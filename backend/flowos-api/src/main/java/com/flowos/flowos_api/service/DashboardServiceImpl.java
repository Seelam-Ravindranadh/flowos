package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.*;
import com.flowos.flowos_api.entity.Company;
import com.flowos.flowos_api.entity.Expense;
import com.flowos.flowos_api.entity.FundingRequest;
import com.flowos.flowos_api.entity.Invoice;
import com.flowos.flowos_api.enums.ExpenseCategory;
import com.flowos.flowos_api.repository.CashFlowRepository;
import com.flowos.flowos_api.repository.CompanyRepository;
import com.flowos.flowos_api.repository.ExpenseRepository;
import com.flowos.flowos_api.repository.FundingRequestRepository;
import com.flowos.flowos_api.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final InvoiceRepository invoiceRepository;
    private final ExpenseRepository expenseRepository;
    private final CashFlowRepository cashFlowRepository;
    private final FundingRequestRepository fundingRequestRepository;
    private final CompanyRepository companyRepository;

    @Override
    public DashboardResponse getDashboard() {

        DashboardSummaryDTO summary = buildSummary();

        List<CashFlowDTO> cashFlow = buildCashFlow();

        BusinessHealthDTO businessHealth = buildBusinessHealth();

        List<RevenueProfitDTO> revenueProfit = buildRevenueChart();

        List<ExpenseBreakdownDTO> expenseBreakdown =
                buildExpenseBreakdown();

        List<ReceivableAgingDTO> receivableAging =
                buildReceivableAging();

        List<InvoiceDTO> recentInvoices =
                buildRecentInvoices();

        List<FundingRequestDTO> fundingRequests =
                buildFundingRequests();

        return DashboardResponse.builder()
                .summary(summary)
                .cashFlow(cashFlow)
                .businessHealth(businessHealth)
                .revenueProfit(revenueProfit)
                .expenseBreakdown(expenseBreakdown)
                .receivableAging(receivableAging)
                .recentInvoices(recentInvoices)
                .fundingRequests(fundingRequests)
                .build();
    }

    /**
     * ---------------------------------------------------------
     * 1. DASHBOARD SUMMARY
     * ---------------------------------------------------------
     */
    private DashboardSummaryDTO buildSummary() {

        Company company = companyRepository.findAll()
                .stream()
                .findFirst()
                .orElse(new Company());

        /*
         * P0.5 - Fetch only invoices which still
         * have an outstanding balance.
         */
        List<Invoice> receivableInvoices =
                invoiceRepository.findByOutstandingAmountGreaterThan(
                        BigDecimal.ZERO
                );

        /*
         * Total Revenue
         */
        BigDecimal totalRevenue =
                invoiceRepository.findAll()
                        .stream()
                        .map(Invoice::getTotalAmount)
                        .filter(Objects::nonNull)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        /*
         * Total Receivables
         */
        BigDecimal totalReceivables =
                receivableInvoices
                        .stream()
                        .map(Invoice::getOutstandingAmount)
                        .filter(Objects::nonNull)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        /*
         * Total Payables
         */
        BigDecimal totalPayables =
                expenseRepository.findAll()
                        .stream()
                        .map(Expense::getAmount)
                        .filter(Objects::nonNull)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        /*
         * Overdue invoices
         *
         * Only invoices with:
         * outstandingAmount > 0
         * AND dueDate < today
         */
        long overdueInvoices =
                receivableInvoices
                        .stream()
                        .filter(invoice ->
                                invoice.getDueDate() != null)
                        .filter(invoice ->
                                invoice.getDueDate()
                                        .isBefore(LocalDate.now()))
                        .count();

        /*
         * Safe company values
         */
        BigDecimal cashBalance =
                company.getCashBalance() != null
                        ? company.getCashBalance()
                        : BigDecimal.ZERO;

        Integer creditScore =
                company.getCreditScore() != null
                        ? company.getCreditScore()
                        : 0;

        return DashboardSummaryDTO.builder()
                .totalRevenue(
                        totalRevenue.doubleValue())

                .cashBalance(
                        cashBalance.doubleValue())

                .totalReceivables(
                        totalReceivables.doubleValue())

                .totalPayables(
                        totalPayables.doubleValue())

                .creditScore(
                        creditScore)

                .overdueInvoices(
                        (int) overdueInvoices)

                .revenueGrowth(0.0)
                .expenseGrowth(0.0)

                .build();
    }

    /**
     * ---------------------------------------------------------
     * 2. CASH FLOW
     * ---------------------------------------------------------
     */
    private List<CashFlowDTO> buildCashFlow() {

        return cashFlowRepository.findAll()
                .stream()
                .filter(Objects::nonNull)
                .map(c -> CashFlowDTO.builder()
                        .month(c.getMonth())
                        .actual(
                                c.getActualAmount() == null
                                        ? 0.0
                                        : c.getActualAmount().doubleValue()
                        )
                        .forecast(
                                c.getForecastAmount() == null
                                        ? 0.0
                                        : c.getForecastAmount().doubleValue()
                        )
                        .build()
                )
                .toList();
    }

    /**
     * ---------------------------------------------------------
     * 3. BUSINESS HEALTH
     * ---------------------------------------------------------
     */
    private BusinessHealthDTO buildBusinessHealth() {

        Company company = companyRepository.findAll()
                .stream()
                .findFirst()
                .orElse(null);

        int creditScore = 0;

        if (company != null && company.getCreditScore() != null) {
            creditScore = company.getCreditScore();
        }

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
     * ---------------------------------------------------------
     * 4. REVENUE / PROFIT CHART
     * ---------------------------------------------------------
     */
    private List<RevenueProfitDTO> buildRevenueChart() {

        Map<Month, BigDecimal> revenueByMonth =
                invoiceRepository.findAll()
                        .stream()
                        .filter(i -> i.getInvoiceDate() != null)
                        .filter(i -> i.getTotalAmount() != null)
                        .collect(Collectors.groupingBy(
                                i -> i.getInvoiceDate().getMonth(),
                                Collectors.mapping(
                                        Invoice::getTotalAmount,
                                        Collectors.reducing(
                                                BigDecimal.ZERO,
                                                BigDecimal::add
                                        )
                                )
                        ));

        return revenueByMonth.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> {

                    BigDecimal revenue = entry.getValue();

                    return RevenueProfitDTO.builder()
                            .month(entry.getKey().name())
                            .revenue(revenue.doubleValue())
                            .profit(0.0)
                            .profitMargin(0.0)
                            .build();
                })
                .toList();
    }

    /**
     * ---------------------------------------------------------
     * 5. EXPENSE BREAKDOWN
     * ---------------------------------------------------------
     */
    private List<ExpenseBreakdownDTO> buildExpenseBreakdown() {

        Map<ExpenseCategory, BigDecimal> expenseMap =
                expenseRepository.findAll()
                        .stream()
                        .filter(e -> e.getCategory() != null)
                        .filter(e -> e.getAmount() != null)
                        .collect(Collectors.groupingBy(
                                Expense::getCategory,
                                Collectors.mapping(
                                        Expense::getAmount,
                                        Collectors.reducing(
                                                BigDecimal.ZERO,
                                                BigDecimal::add
                                        )
                                )
                        ));

        BigDecimal total =
                expenseMap.values()
                        .stream()
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        return expenseMap.entrySet()
                .stream()
                .sorted(
                        Map.Entry.<ExpenseCategory, BigDecimal>
                                        comparingByValue()
                                .reversed()
                )
                .map(entry -> {

                    BigDecimal amount = entry.getValue();

                    double percentage = 0.0;

                    if (total.compareTo(BigDecimal.ZERO) > 0) {

                        percentage = amount
                                .multiply(BigDecimal.valueOf(100))
                                .divide(
                                        total,
                                        2,
                                        RoundingMode.HALF_UP
                                )
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
     * ---------------------------------------------------------
     * 6. RECEIVABLE AGING
     * ---------------------------------------------------------
     */
    private List<ReceivableAgingDTO> buildReceivableAging() {

        LocalDate today = LocalDate.now();

        List<Invoice> invoices =
                invoiceRepository.findAll();

        long zeroToThirtyCount = 0;
        long thirtyOneToSixtyCount = 0;
        long sixtyOneToNinetyCount = 0;
        long overNinetyCount = 0;

        BigDecimal zeroToThirtyAmount = BigDecimal.ZERO;
        BigDecimal thirtyOneToSixtyAmount = BigDecimal.ZERO;
        BigDecimal sixtyOneToNinetyAmount = BigDecimal.ZERO;
        BigDecimal overNinetyAmount = BigDecimal.ZERO;

        for (Invoice invoice : invoices) {

            if (invoice.getDueDate() == null) {
                continue;
            }

            BigDecimal outstanding =
                    invoice.getOutstandingAmount();

            if (outstanding == null ||
                    outstanding.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            long daysOverdue =
                    java.time.temporal.ChronoUnit.DAYS.between(
                            invoice.getDueDate(),
                            today
                    );

            /*
             * Not overdue yet.
             */
            if (daysOverdue < 0) {
                continue;
            }

            if (daysOverdue <= 30) {

                zeroToThirtyCount++;

                zeroToThirtyAmount =
                        zeroToThirtyAmount.add(outstanding);

            } else if (daysOverdue <= 60) {

                thirtyOneToSixtyCount++;

                thirtyOneToSixtyAmount =
                        thirtyOneToSixtyAmount.add(outstanding);

            } else if (daysOverdue <= 90) {

                sixtyOneToNinetyCount++;

                sixtyOneToNinetyAmount =
                        sixtyOneToNinetyAmount.add(outstanding);

            } else {

                overNinetyCount++;

                overNinetyAmount =
                        overNinetyAmount.add(outstanding);
            }
        }

        return List.of(

                ReceivableAgingDTO.builder()
                        .agingBucket("0-30 Days")
                        .amount(zeroToThirtyAmount.doubleValue())
                        .invoiceCount((int) zeroToThirtyCount)
                        .build(),

                ReceivableAgingDTO.builder()
                        .agingBucket("31-60 Days")
                        .amount(thirtyOneToSixtyAmount.doubleValue())
                        .invoiceCount((int) thirtyOneToSixtyCount)
                        .build(),

                ReceivableAgingDTO.builder()
                        .agingBucket("61-90 Days")
                        .amount(sixtyOneToNinetyAmount.doubleValue())
                        .invoiceCount((int) sixtyOneToNinetyCount)
                        .build(),

                ReceivableAgingDTO.builder()
                        .agingBucket("90+ Days")
                        .amount(overNinetyAmount.doubleValue())
                        .invoiceCount((int) overNinetyCount)
                        .build()
        );
    }

    /**
     * ---------------------------------------------------------
     * 7. RECENT INVOICES
     * ---------------------------------------------------------
     */
    /* private List<InvoiceDTO> buildRecentInvoices() {

        return invoiceRepository.findAll()
                .stream()
                .filter(Objects::nonNull)
                .sorted(
                        Comparator.comparing(
                                Invoice::getInvoiceDate,
                                Comparator.nullsLast(
                                        Comparator.reverseOrder()
                                )
                        )
                )
                .limit(5)
                .map(invoice -> InvoiceDTO.builder()

                        .invoiceNumber(
                                invoice.getInvoiceNumber()
                        )

                        .customerName(
                                invoice.getCustomerName()
                        )

                        .amount(
                                invoice.getTotalAmount() == null
                                        ? 0.0
                                        : invoice.getTotalAmount()
                                        .doubleValue()
                        )

                        .invoiceDate(
                                invoice.getInvoiceDate()
                        )

                        .dueDate(
                                invoice.getDueDate()
                        )

                        .status(
                                invoice.getStatus() == null
                                        ? null
                                        : invoice.getStatus().name()
                        )

                        .build()
                )
                .toList();
    } */

    private List<InvoiceDTO> buildRecentInvoices() {

        return invoiceRepository.findAll()
                .stream()
                .sorted((i1, i2) -> {

                    if (i1.getCreatedAt() == null) {
                        return 1;
                    }

                    if (i2.getCreatedAt() == null) {
                        return -1;
                    }

                    return i2.getCreatedAt()
                            .compareTo(i1.getCreatedAt());
                })
                .limit(5)
                .map(invoice -> InvoiceDTO.builder()
                        .invoiceNumber(invoice.getInvoiceNumber())

                        .customerName(
                                invoice.getCustomer() != null
                                        ? invoice.getCustomer().getCustomerName()
                                        : "Unknown"
                        )

                        .amount(
                                invoice.getTotalAmount() != null
                                        ? invoice.getTotalAmount().doubleValue()
                                        : 0.0
                        )

                        .invoiceDate(invoice.getInvoiceDate())
                        .dueDate(invoice.getDueDate())

                        .status(
                                invoice.getStatus() != null
                                        ? invoice.getStatus().name()
                                        : "UNKNOWN"
                        )

                        .build())
                .toList();
    }

    /**
     * ---------------------------------------------------------
     * 8. FUNDING REQUESTS
     * ---------------------------------------------------------
     */
    private List<FundingRequestDTO> buildFundingRequests() {

        return fundingRequestRepository.findAll()
                .stream()
                .filter(Objects::nonNull)
                .sorted(
                        Comparator.comparing(
                                FundingRequest::getRequestDate,
                                Comparator.nullsLast(
                                        Comparator.reverseOrder()
                                )
                        )
                )
                .limit(5)
                .map(request -> FundingRequestDTO.builder()

                        .requestId(
                                resolveRequestId(request)
                        )

                        .lenderName(
                                request.getLenderName()
                        )

                        .requestedAmount(
                                request.getRequestedAmount() == null
                                        ? 0.0
                                        : request.getRequestedAmount()
                                        .doubleValue()
                        )

                        .approvedAmount(
                                request.getApprovedAmount() == null
                                        ? 0.0
                                        : request.getApprovedAmount()
                                        .doubleValue()
                        )

                        .interestRate(
                                request.getInterestRate() == null
                                        ? 0.0
                                        : request.getInterestRate()
                        )

                        .requestDate(
                                request.getRequestDate()
                        )

                        .status(
                                request.getStatus() == null
                                        ? null
                                        : request.getStatus().name()
                        )

                        .build()
                )
                .toList();
    }

    /**
     * FundingRequest contains both requestNumber and requestId.
     * Prefer requestNumber and fall back to requestId.
     */
    private String resolveRequestId(FundingRequest request) {

        if (request.getRequestNumber() != null &&
                !request.getRequestNumber().isBlank()) {

            return request.getRequestNumber();
        }

        return request.getRequestId();
    }

    /**
     * ---------------------------------------------------------
     * HELPER
     * ---------------------------------------------------------
     */
    private boolean isOverdue(Invoice invoice) {

        if (invoice.getDueDate() == null) {
            return false;
        }

        if (invoice.getOutstandingAmount() == null) {
            return false;
        }

        if (invoice.getOutstandingAmount()
                .compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }

        return invoice.getDueDate()
                .isBefore(LocalDate.now());
    }
}