package com.flowos.flowos_api.service;

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

        return DashboardResponse.builder()
                .summary(buildSummary(company))
                .cashFlow(buildCashFlow(company.getId()))
                .businessHealth(buildBusinessHealth(company))
                .revenueProfit(buildRevenueChart(company.getId()))
                .expenseBreakdown(buildExpenseBreakdown(company.getId()))
                .receivableAging(buildReceivableAging(company.getId()))
                .recentInvoices(buildRecentInvoices(company.getId()))
                .fundingRequests(buildFundingRequests())
                .build();
    }

    /**
     * 1. DASHBOARD SUMMARY - Tenant Scoped
     */
    private DashboardSummaryDTO buildSummary(Company company) {
        Long companyId = company.getId();

        BigDecimal totalRevenue = invoiceRepository.sumTotalAmountByCompanyId(companyId);
        BigDecimal totalReceivables = invoiceRepository.sumOutstandingAmountByCompanyId(companyId);
        BigDecimal totalPayables = expenseRepository.sumAllAmountByCompanyId(companyId);

        List<Invoice> receivableInvoices = invoiceRepository
                .findByCompanyIdAndOutstandingAmountGreaterThan(companyId, BigDecimal.ZERO);
        long overdueInvoices = receivableInvoices.stream().filter(this::isOverdue).count();

        BigDecimal cashBalance = calculateCurrentCashBalance(company);
        Integer creditScore = company.getCreditScore() != null ? company.getCreditScore() : 0;

        return DashboardSummaryDTO.builder()
                .totalRevenue(totalRevenue.doubleValue())
                .cashBalance(cashBalance.doubleValue())
                .totalReceivables(totalReceivables.doubleValue())
                .totalPayables(totalPayables.doubleValue())
                .creditScore(creditScore)
                .overdueInvoices((int) overdueInvoices)
                .revenueGrowth(0.0)
                .expenseGrowth(0.0)
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
     * 3. BUSINESS HEALTH
     */
    private BusinessHealthDTO buildBusinessHealth(Company company) {
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

        return BusinessHealthDTO.builder()
                .score(creditScore)
                .status(status)
                .cashRunway("6 Months")
                .creditScore(creditScore)
                .build();
    }

    /**
     * 4. REVENUE / PROFIT - Tenant Scoped
     */
    private List<RevenueProfitDTO> buildRevenueChart(Long companyId) {
        Map<Month, BigDecimal> revenueByMonth = invoiceRepository.findByCompanyId(companyId).stream()
                .filter(i -> i.getInvoiceDate() != null && i.getTotalAmount() != null)
                .collect(Collectors.groupingBy(
                        i -> i.getInvoiceDate().getMonth(),
                        Collectors.mapping(Invoice::getTotalAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));

        return revenueByMonth.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> RevenueProfitDTO.builder()
                        .month(entry.getKey().name())
                        .revenue(entry.getValue().doubleValue())
                        .profit(0.0)
                        .profitMargin(0.0)
                        .build())
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
     * Current Cash Balance Calculation - Tenant Scoped
     */
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