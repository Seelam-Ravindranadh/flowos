package com.flowos.flowos_api.service.impl;

import com.flowos.flowos_api.dto.*;
import com.flowos.flowos_api.entity.Company;
import com.flowos.flowos_api.entity.Expense;
import com.flowos.flowos_api.entity.FundingRequest;
import com.flowos.flowos_api.entity.Invoice;
import com.flowos.flowos_api.entity.Payment;
import com.flowos.flowos_api.enums.ExpenseCategory;
import com.flowos.flowos_api.enums.ExpenseStatus;
import com.flowos.flowos_api.enums.PaymentStatus;
import com.flowos.flowos_api.repository.CashFlowRepository;
import com.flowos.flowos_api.repository.CompanyRepository;
import com.flowos.flowos_api.repository.ExpenseRepository;
import com.flowos.flowos_api.repository.FundingRequestRepository;
import com.flowos.flowos_api.repository.InvoiceRepository;
import com.flowos.flowos_api.repository.PaymentRepository;
import com.flowos.flowos_api.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final InvoiceRepository invoiceRepository;
    private final ExpenseRepository expenseRepository;
    private final CashFlowRepository cashFlowRepository;
    private final FundingRequestRepository fundingRequestRepository;
    private final CompanyRepository companyRepository;
    private final PaymentRepository paymentRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        Company defaultCompany = companyRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No registered company found. Seed companies table first."));
        return getDashboard(defaultCompany.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found with id: " + companyId));

        BigDecimal cashBalance = calculateCurrentCashBalance(company);

        return DashboardResponse.builder()
                .summary(buildSummary(company, cashBalance))
                .cashFlow(buildCashFlow(company.getId()))
                .businessHealth(buildBusinessHealth(company, cashBalance, company.getId()))
                .revenueProfit(buildRevenueChart(company.getId()))
                .expenseBreakdown(buildExpenseBreakdown(company.getId()))
                .receivableAging(buildReceivableAging(company.getId()))
                .recentInvoices(buildRecentInvoices(company.getId()))
                .fundingRequests(buildFundingRequests())
                .build();
    }

    /**
     * 1. DASHBOARD SUMMARY - Tenant Scoped with Dynamic MoM Growth
     */
    private DashboardSummaryDTO buildSummary(Company company, BigDecimal cashBalance) {
        Long companyId = company.getId();

        BigDecimal totalRevenue = invoiceRepository.sumTotalAmountByCompanyId(companyId);
        BigDecimal totalReceivables = invoiceRepository.sumOutstandingAmountByCompanyId(companyId);
        BigDecimal totalPayables = expenseRepository.sumAmountByCompanyIdAndStatus(companyId, ExpenseStatus.APPROVED);

        List<Invoice> receivableInvoices = invoiceRepository
                .findByCompanyIdAndOutstandingAmountGreaterThan(companyId, BigDecimal.ZERO);
        long overdueInvoices = receivableInvoices.stream().filter(this::isOverdue).count();

        // Calculate dynamic Month-over-Month (MoM) growth rates
        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(today);
        YearMonth priorMonth = currentMonth.minusMonths(1);

        double revGrowth = calculateRevenueGrowth(companyId, currentMonth, priorMonth);
        double expGrowth = calculateExpenseGrowth(companyId, currentMonth, priorMonth);

        return DashboardSummaryDTO.builder()
                .totalRevenue(totalRevenue.doubleValue())
                .cashBalance(cashBalance.doubleValue())
                .totalReceivables(totalReceivables.doubleValue())
                .totalPayables(totalPayables.doubleValue())
                .creditScore(company.getCreditScore() != null ? company.getCreditScore() : 0)
                .overdueInvoices((int) overdueInvoices)
                .revenueGrowth(revGrowth)
                .expenseGrowth(expGrowth)
                .build();
    }

    /**
     * 2. CASH FLOW - Tenant Scoped
     */
    private List<CashFlowDTO> buildCashFlow(Long companyId) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.withDayOfMonth(1).minusMonths(5);
        YearMonth startMonth = YearMonth.from(startDate);

        List<Payment> successfulPayments = paymentRepository
                .findByCompanyIdAndStatusAndPaymentDateGreaterThanEqual(companyId, PaymentStatus.SUCCESS, startDate)
                .stream()
                .filter(Objects::nonNull)
                .toList();

        List<Expense> approvedExpenses = expenseRepository
                .findByCompanyIdAndStatusAndExpenseDateGreaterThanEqual(companyId, ExpenseStatus.APPROVED, startDate)
                .stream()
                .filter(Objects::nonNull)
                .toList();

        Map<String, Double> forecastByMonth = cashFlowRepository.findAll().stream()
                .filter(Objects::nonNull)
                .filter(c -> c.getMonth() != null)
                .collect(Collectors.toMap(
                        c -> c.getMonth().toUpperCase(),
                        c -> c.getForecastAmount() != null ? c.getForecastAmount().doubleValue() : 0.0,
                        (first, second) -> second
                ));

        return IntStream.range(0, 6)
                .mapToObj(startMonth::plusMonths)
                .map(month -> {
                    BigDecimal inflow = successfulPayments.stream()
                            .filter(p -> p.getPaymentDate() != null && YearMonth.from(p.getPaymentDate()).equals(month))
                            .map(Payment::getAmount)
                            .filter(Objects::nonNull)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal outflow = approvedExpenses.stream()
                            .filter(e -> e.getExpenseDate() != null && YearMonth.from(e.getExpenseDate()).equals(month))
                            .map(Expense::getAmount)
                            .filter(Objects::nonNull)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal actualCashFlow = inflow.subtract(outflow);
                    String monthName = month.getMonth().name().substring(0, 3);
                    double forecast = forecastByMonth.getOrDefault(monthName.toUpperCase(), 0.0);

                    return CashFlowDTO.builder()
                            .month(monthName)
                            .actual(actualCashFlow.doubleValue())
                            .forecast(forecast)
                            .build();
                })
                .toList();
    }

    /**
     * 3. BUSINESS HEALTH - Dynamic Cash Runway based on Trailing 90-Day Burn
     */
    private BusinessHealthDTO buildBusinessHealth(Company company, BigDecimal currentCash, Long companyId) {
        int creditScore = company.getCreditScore() != null ? company.getCreditScore() : 0;
        String status;

        if (creditScore >= 750) {
            status = "Excellent";
        } else if (creditScore >= 650) {
            status = "Good";
        } else if (creditScore >= 550) {
            status = "Average";
        } else {
            status = "Needs Attention";
        }

        // Calculate trailing 90-day average monthly burn rate
        LocalDate ninetyDaysAgo = LocalDate.now().minusDays(90);
        List<Expense> trailingExpenses = expenseRepository.findByCompanyIdAndStatusAndExpenseDateGreaterThanEqual(
                companyId, ExpenseStatus.APPROVED, ninetyDaysAgo);

        BigDecimal totalTrailingOutflows = trailingExpenses.stream()
                .map(Expense::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal averageMonthlyBurn = totalTrailingOutflows.divide(BigDecimal.valueOf(3), 2, RoundingMode.HALF_UP);

        String dynamicRunway;
        if (currentCash.compareTo(BigDecimal.ZERO) <= 0) {
            dynamicRunway = "0 Months (Negative Cash)";
        } else if (averageMonthlyBurn.compareTo(BigDecimal.ZERO) == 0) {
            dynamicRunway = "12+ Months (Zero Burn)";
        } else {
            BigDecimal months = currentCash.divide(averageMonthlyBurn, 1, RoundingMode.HALF_UP);
            dynamicRunway = months.doubleValue() + " Months";
        }

        return BusinessHealthDTO.builder()
                .score(creditScore)
                .status(status)
                .cashRunway(dynamicRunway)
                .creditScore(creditScore)
                .build();
    }

    /**
     * 4. REVENUE / PROFIT - Dynamic Gross Profit & Profit Margins
     */
    private List<RevenueProfitDTO> buildRevenueChart(Long companyId) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.withDayOfMonth(1).minusMonths(5);
        YearMonth startMonth = YearMonth.from(startDate);

        List<Invoice> invoices = invoiceRepository.findByCompanyId(companyId);
        List<Expense> expenses = expenseRepository.findByCompanyIdAndStatus(companyId, ExpenseStatus.APPROVED);

        return IntStream.range(0, 6)
                .mapToObj(startMonth::plusMonths)
                .map(month -> {
                    BigDecimal monthlyRev = invoices.stream()
                            .filter(i -> i.getInvoiceDate() != null && YearMonth.from(i.getInvoiceDate()).equals(month))
                            .map(Invoice::getTotalAmount)
                            .filter(Objects::nonNull)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal monthlyExp = expenses.stream()
                            .filter(e -> e.getExpenseDate() != null && YearMonth.from(e.getExpenseDate()).equals(month))
                            .map(Expense::getAmount)
                            .filter(Objects::nonNull)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal grossProfit = monthlyRev.subtract(monthlyExp);
                    double profitMargin = monthlyRev.compareTo(BigDecimal.ZERO) > 0
                            ? grossProfit.multiply(BigDecimal.valueOf(100))
                            .divide(monthlyRev, 2, RoundingMode.HALF_UP)
                            .doubleValue()
                            : 0.0;

                    return RevenueProfitDTO.builder()
                            .month(month.getMonth().name().substring(0, 3))
                            .revenue(monthlyRev.doubleValue())
                            .profit(grossProfit.doubleValue())
                            .profitMargin(profitMargin)
                            .build();
                })
                .toList();
    }

    /**
     * 5. EXPENSE BREAKDOWN - Tenant Scoped
     */
    private List<ExpenseBreakdownDTO> buildExpenseBreakdown(Long companyId) {
        Map<ExpenseCategory, BigDecimal> expenseMap = expenseRepository.findByCompanyId(companyId).stream()
                .filter(e -> e.getCategory() != null && e.getAmount() != null)
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.mapping(Expense::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));

        BigDecimal total = expenseMap.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);

        return expenseMap.entrySet().stream()
                .sorted(Map.Entry.<ExpenseCategory, BigDecimal>comparingByValue().reversed())
                .map(entry -> {
                    BigDecimal amount = entry.getValue();
                    double percentage = 0.0;
                    if (total.compareTo(BigDecimal.ZERO) > 0) {
                        percentage = amount.multiply(BigDecimal.valueOf(100))
                                .divide(total, 2, RoundingMode.HALF_UP)
                                .doubleValue();
                    }

                    return ExpenseBreakdownDTO.builder()
                            .category(entry.getKey().name())
                            .amount(amount.doubleValue())
                            .percentage(percentage)
                            .build();
                })
                .toList();
    }

    /**
     * 6. RECEIVABLE AGING - Tenant Scoped
     */
    private List<ReceivableAgingDTO> buildReceivableAging(Long companyId) {
        LocalDate today = LocalDate.now();
        List<Invoice> invoices = invoiceRepository.findByCompanyIdAndOutstandingAmountGreaterThan(companyId, BigDecimal.ZERO);

        int bucket0to30 = 0, bucket31to60 = 0, bucket61to90 = 0, bucket90Plus = 0;
        BigDecimal amt0to30 = BigDecimal.ZERO, amt31to60 = BigDecimal.ZERO, amt61to90 = BigDecimal.ZERO, amt90Plus = BigDecimal.ZERO;

        for (Invoice invoice : invoices) {
            if (invoice.getDueDate() == null || invoice.getOutstandingAmount() == null) {
                continue;
            }

            BigDecimal outstanding = invoice.getOutstandingAmount();
            long daysOverdue = java.time.temporal.ChronoUnit.DAYS.between(invoice.getDueDate(), today);

            if (daysOverdue <= 30) {
                bucket0to30++;
                amt0to30 = amt0to30.add(outstanding);
            } else if (daysOverdue <= 60) {
                bucket31to60++;
                amt31to60 = amt31to60.add(outstanding);
            } else if (daysOverdue <= 90) {
                bucket61to90++;
                amt61to90 = amt61to90.add(outstanding);
            } else {
                bucket90Plus++;
                amt90Plus = amt90Plus.add(outstanding);
            }
        }

        return List.of(
                ReceivableAgingDTO.builder().agingBucket("0-30 Days").amount(amt0to30.doubleValue()).invoiceCount(bucket0to30).build(),
                ReceivableAgingDTO.builder().agingBucket("31-60 Days").amount(amt31to60.doubleValue()).invoiceCount(bucket31to60).build(),
                ReceivableAgingDTO.builder().agingBucket("61-90 Days").amount(amt61to90.doubleValue()).invoiceCount(bucket61to90).build(),
                ReceivableAgingDTO.builder().agingBucket("90+ Days").amount(amt90Plus.doubleValue()).invoiceCount(bucket90Plus).build()
        );
    }

    /**
     * 7. RECENT INVOICES - Tenant Scoped
     */
    private List<InvoiceDTO> buildRecentInvoices(Long companyId) {
        return invoiceRepository.findTop5ByCompanyIdOrderByCreatedAtDesc(companyId).stream()
                .map(invoice -> InvoiceDTO.builder()
                        .invoiceNumber(invoice.getInvoiceNumber())
                        .customerName(invoice.getCustomer() != null ? invoice.getCustomer().getCustomerName() : "Unknown")
                        .amount(invoice.getTotalAmount() != null ? invoice.getTotalAmount().doubleValue() : 0.0)
                        .invoiceDate(invoice.getInvoiceDate())
                        .dueDate(invoice.getDueDate())
                        .status(invoice.getStatus() != null ? invoice.getStatus().name() : "UNKNOWN")
                        .build())
                .toList();
    }

    /**
     * 8. FUNDING REQUESTS
     */
    private List<FundingRequestDTO> buildFundingRequests() {
        return fundingRequestRepository.findAll().stream()
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(FundingRequest::getRequestDate, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .map(request -> FundingRequestDTO.builder()
                        .requestId(request.getRequestNumber() != null && !request.getRequestNumber().isBlank()
                                ? request.getRequestNumber()
                                : request.getRequestId())
                        .lenderName(request.getLenderName())
                        .requestedAmount(request.getRequestedAmount() != null ? request.getRequestedAmount().doubleValue() : 0.0)
                        .approvedAmount(request.getApprovedAmount() != null ? request.getApprovedAmount().doubleValue() : 0.0)
                        .interestRate(request.getInterestRate() != null ? request.getInterestRate() : 0.0)
                        .requestDate(request.getRequestDate())
                        .status(request.getStatus() != null ? request.getStatus().name() : null)
                        .build())
                .toList();
    }

    /**
     * Calculation Helpers
     */
    private double calculateRevenueGrowth(Long companyId, YearMonth currentMonth, YearMonth priorMonth) {
        BigDecimal curRev = getMonthlyInvoiceSum(companyId, currentMonth);
        BigDecimal priorRev = getMonthlyInvoiceSum(companyId, priorMonth);

        if (priorRev.compareTo(BigDecimal.ZERO) == 0) {
            return 0.0;
        }
        return curRev.subtract(priorRev)
                .multiply(BigDecimal.valueOf(100))
                .divide(priorRev, 2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private double calculateExpenseGrowth(Long companyId, YearMonth currentMonth, YearMonth priorMonth) {
        BigDecimal curExp = getMonthlyExpenseSum(companyId, currentMonth);
        BigDecimal priorExp = getMonthlyExpenseSum(companyId, priorMonth);

        if (priorExp.compareTo(BigDecimal.ZERO) == 0) {
            return 0.0;
        }
        return curExp.subtract(priorExp)
                .multiply(BigDecimal.valueOf(100))
                .divide(priorExp, 2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private BigDecimal getMonthlyInvoiceSum(Long companyId, YearMonth month) {
        return invoiceRepository.findByCompanyId(companyId).stream()
                .filter(i -> i.getInvoiceDate() != null && YearMonth.from(i.getInvoiceDate()).equals(month))
                .map(Invoice::getTotalAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal getMonthlyExpenseSum(Long companyId, YearMonth month) {
        return expenseRepository.findByCompanyIdAndStatus(companyId, ExpenseStatus.APPROVED).stream()
                .filter(e -> e.getExpenseDate() != null && YearMonth.from(e.getExpenseDate()).equals(month))
                .map(Expense::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateCurrentCashBalance(Company company) {
        BigDecimal openingCash = company.getOpeningCashBalance() != null
                ? company.getOpeningCashBalance()
                : BigDecimal.ZERO;

        BigDecimal totalInflows = paymentRepository.sumAmountByCompanyIdAndStatus(company.getId(), PaymentStatus.SUCCESS);
        BigDecimal totalOutflows = expenseRepository.sumAmountByCompanyIdAndStatus(company.getId(), ExpenseStatus.APPROVED);

        return openingCash.add(totalInflows).subtract(totalOutflows);
    }

    private boolean isOverdue(Invoice invoice) {
        return invoice.getDueDate() != null &&
                invoice.getOutstandingAmount() != null &&
                invoice.getOutstandingAmount().compareTo(BigDecimal.ZERO) > 0 &&
                invoice.getDueDate().isBefore(LocalDate.now());
    }
}