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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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

    /**
     * P0.6
     *
     * Used to calculate actual cash inflows
     * from successful payments.
     */
    private final PaymentRepository paymentRepository;

    @Override
    public DashboardResponse getDashboard() {

        DashboardSummaryDTO summary =
                buildSummary();

        List<CashFlowDTO> cashFlow =
                buildCashFlow();

        BusinessHealthDTO businessHealth =
                buildBusinessHealth();

        List<RevenueProfitDTO> revenueProfit =
                buildRevenueChart();

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
     * =========================================================
     * 1. DASHBOARD SUMMARY
     * =========================================================
     */
    private DashboardSummaryDTO buildSummary() {

        Company company =
                companyRepository.findAll()
                        .stream()
                        .findFirst()
                        .orElse(new Company());

        /*
         * Only invoices with outstanding balances
         * are receivables.
         */
        List<Invoice> receivableInvoices =
                invoiceRepository
                        .findByOutstandingAmountGreaterThan(
                                BigDecimal.ZERO
                        );

        /*
         * Total invoice value.
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
         * Total receivables.
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
         * Total payables.
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
         * Overdue invoices.
         */
        long overdueInvoices =
                receivableInvoices
                        .stream()
                        .filter(this::isOverdue)
                        .count();

        /*
         * P0.6
         *
         * Calculate current cash from:
         *
         * opening cash
         * + successful payments
         * - approved expenses
         */
        BigDecimal cashBalance =
                calculateCurrentCashBalance();

        Integer creditScore =
                company.getCreditScore() != null
                        ? company.getCreditScore()
                        : 0;

        return DashboardSummaryDTO.builder()
                .totalRevenue(
                        totalRevenue.doubleValue()
                )
                .cashBalance(
                        cashBalance.doubleValue()
                )
                .totalReceivables(
                        totalReceivables.doubleValue()
                )
                .totalPayables(
                        totalPayables.doubleValue()
                )
                .creditScore(creditScore)
                .overdueInvoices(
                        (int) overdueInvoices
                )
                .revenueGrowth(0.0)
                .expenseGrowth(0.0)
                .build();
    }

    /**
     * =========================================================
     * 2. CASH FLOW - P0.6
     * =========================================================
     *
     * Actual cash flow:
     *
     * SUCCESSFUL PAYMENTS
     *              -
     * APPROVED EXPENSES
     *
     * Six months are returned, including months with
     * zero transactions.
     */
    private List<CashFlowDTO> buildCashFlow() {

        LocalDate today = LocalDate.now();

        /*
         * First day of the oldest month in our
         * six-month dashboard window.
         */
        LocalDate startDate =
                today.withDayOfMonth(1)
                        .minusMonths(5);

        YearMonth startMonth =
                YearMonth.from(startDate);

        /*
         * ------------------------------------------
         * CASH INFLOWS
         * ------------------------------------------
         *
         * Only successful payments count as
         * actual cash inflows.
         */
        List<Payment> successfulPayments =
                paymentRepository
                        .findByStatus(
                                PaymentStatus.SUCCESS
                        )
                        .stream()
                        .filter(Objects::nonNull)
                        .filter(payment ->
                                payment.getPaymentDate() != null
                        )
                        .filter(payment ->
                                !payment.getPaymentDate()
                                        .isBefore(startDate)
                        )
                        .toList();

        /*
         * ------------------------------------------
         * CASH OUTFLOWS
         * ------------------------------------------
         *
         * Only approved expenses count as
         * actual cash outflows.
         */
        List<Expense> approvedExpenses =
                expenseRepository
                        .findByStatus(
                                ExpenseStatus.APPROVED
                        )
                        .stream()
                        .filter(Objects::nonNull)
                        .filter(expense ->
                                expense.getExpenseDate() != null
                        )
                        .filter(expense ->
                                !expense.getExpenseDate()
                                        .isBefore(startDate)
                        )
                        .toList();

        /*
         * ------------------------------------------
         * FORECAST
         * ------------------------------------------
         *
         * Existing CashFlow records continue to
         * supply forecast values.
         */
        Map<String, Double> forecastByMonth =
                cashFlowRepository.findAll()
                        .stream()
                        .filter(Objects::nonNull)
                        .filter(c ->
                                c.getMonth() != null
                        )
                        .collect(
                                Collectors.toMap(
                                        c -> c.getMonth()
                                                .toUpperCase(),
                                        c ->
                                                c.getForecastAmount() == null
                                                        ? 0.0
                                                        : c.getForecastAmount()
                                                        .doubleValue(),
                                        (first, second) -> second
                                )
                        );

        /*
         * ------------------------------------------
         * BUILD SIX MONTHS
         * ------------------------------------------
         */
        return IntStream.range(0, 6)
                .mapToObj(startMonth::plusMonths)
                .map(month -> {

                    /*
                     * Monthly inflow.
                     */
                    BigDecimal inflow =
                            successfulPayments
                                    .stream()
                                    .filter(payment ->
                                            YearMonth.from(
                                                    payment.getPaymentDate()
                                            ).equals(month)
                                    )
                                    .map(Payment::getAmount)
                                    .filter(Objects::nonNull)
                                    .reduce(
                                            BigDecimal.ZERO,
                                            BigDecimal::add
                                    );

                    /*
                     * Monthly outflow.
                     */
                    BigDecimal outflow =
                            approvedExpenses
                                    .stream()
                                    .filter(expense ->
                                            YearMonth.from(
                                                    expense.getExpenseDate()
                                            ).equals(month)
                                    )
                                    .map(Expense::getAmount)
                                    .filter(Objects::nonNull)
                                    .reduce(
                                            BigDecimal.ZERO,
                                            BigDecimal::add
                                    );

                    /*
                     * Actual net cash flow.
                     */
                    BigDecimal actualCashFlow =
                            inflow.subtract(outflow);

                    String monthName =
                            month.getMonth()
                                    .name()
                                    .substring(0, 3);

                    /*
                     * Existing forecast data is optional.
                     */
                    double forecast =
                            forecastByMonth.getOrDefault(
                                    monthName.toUpperCase(),
                                    0.0
                            );

                    return CashFlowDTO.builder()
                            .month(monthName)
                            .actual(
                                    actualCashFlow.doubleValue()
                            )
                            .forecast(forecast)
                            .build();
                })
                .toList();
    }

    /**
     * =========================================================
     * 3. BUSINESS HEALTH
     * =========================================================
     */
    private BusinessHealthDTO buildBusinessHealth() {

        Company company =
                companyRepository.findAll()
                        .stream()
                        .findFirst()
                        .orElse(null);

        int creditScore = 0;

        if (company != null &&
                company.getCreditScore() != null) {

            creditScore =
                    company.getCreditScore();
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
     * =========================================================
     * 4. REVENUE / PROFIT
     * =========================================================
     */
    private List<RevenueProfitDTO> buildRevenueChart() {

        Map<Month, BigDecimal> revenueByMonth =
                invoiceRepository.findAll()
                        .stream()
                        .filter(i ->
                                i.getInvoiceDate() != null
                        )
                        .filter(i ->
                                i.getTotalAmount() != null
                        )
                        .collect(
                                Collectors.groupingBy(
                                        i -> i.getInvoiceDate()
                                                .getMonth(),
                                        Collectors.mapping(
                                                Invoice::getTotalAmount,
                                                Collectors.reducing(
                                                        BigDecimal.ZERO,
                                                        BigDecimal::add
                                                )
                                        )
                                )
                        );

        return revenueByMonth.entrySet()
                .stream()
                .sorted(
                        Map.Entry.comparingByKey()
                )
                .map(entry -> {

                    BigDecimal revenue =
                            entry.getValue();

                    return RevenueProfitDTO.builder()
                            .month(
                                    entry.getKey()
                                            .name()
                            )
                            .revenue(
                                    revenue.doubleValue()
                            )
                            .profit(0.0)
                            .profitMargin(0.0)
                            .build();
                })
                .toList();
    }

    /**
     * =========================================================
     * 5. EXPENSE BREAKDOWN
     * =========================================================
     */
    private List<ExpenseBreakdownDTO> buildExpenseBreakdown() {

        Map<ExpenseCategory, BigDecimal> expenseMap =
                expenseRepository.findAll()
                        .stream()
                        .filter(e ->
                                e.getCategory() != null
                        )
                        .filter(e ->
                                e.getAmount() != null
                        )
                        .collect(
                                Collectors.groupingBy(
                                        Expense::getCategory,
                                        Collectors.mapping(
                                                Expense::getAmount,
                                                Collectors.reducing(
                                                        BigDecimal.ZERO,
                                                        BigDecimal::add
                                                )
                                        )
                                )
                        );

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
                        Map.Entry
                                .<ExpenseCategory, BigDecimal>
                                        comparingByValue()
                                .reversed()
                )
                .map(entry -> {

                    BigDecimal amount =
                            entry.getValue();

                    double percentage = 0.0;

                    if (total.compareTo(
                            BigDecimal.ZERO) > 0) {

                        percentage =
                                amount
                                        .multiply(
                                                BigDecimal.valueOf(100)
                                        )
                                        .divide(
                                                total,
                                                2,
                                                RoundingMode.HALF_UP
                                        )
                                        .doubleValue();
                    }

                    return ExpenseBreakdownDTO.builder()
                            .category(
                                    entry.getKey().name()
                            )
                            .amount(
                                    amount.doubleValue()
                            )
                            .percentage(
                                    percentage
                            )
                            .build();
                })
                .toList();
    }

    /**
     * =========================================================
     * 6. RECEIVABLE AGING
     * =========================================================
     */
    private List<ReceivableAgingDTO> buildReceivableAging() {

        LocalDate today =
                LocalDate.now();

        List<Invoice> invoices =
                invoiceRepository
                        .findByOutstandingAmountGreaterThan(
                                BigDecimal.ZERO
                        );

        int zeroToThirtyCount = 0;
        int thirtyOneToSixtyCount = 0;
        int sixtyOneToNinetyCount = 0;
        int overNinetyCount = 0;

        BigDecimal zeroToThirtyAmount =
                BigDecimal.ZERO;

        BigDecimal thirtyOneToSixtyAmount =
                BigDecimal.ZERO;

        BigDecimal sixtyOneToNinetyAmount =
                BigDecimal.ZERO;

        BigDecimal overNinetyAmount =
                BigDecimal.ZERO;

        for (Invoice invoice : invoices) {

            if (invoice.getDueDate() == null) {
                continue;
            }

            BigDecimal outstanding =
                    invoice.getOutstandingAmount();

            if (outstanding == null ||
                    outstanding.compareTo(
                            BigDecimal.ZERO
                    ) <= 0) {
                continue;
            }

            long daysOverdue =
                    java.time.temporal.ChronoUnit.DAYS.between(
                            invoice.getDueDate(),
                            today
                    );

            if (daysOverdue <= 30) {

                zeroToThirtyCount++;

                zeroToThirtyAmount =
                        zeroToThirtyAmount.add(
                                outstanding
                        );

            } else if (daysOverdue <= 60) {

                thirtyOneToSixtyCount++;

                thirtyOneToSixtyAmount =
                        thirtyOneToSixtyAmount.add(
                                outstanding
                        );

            } else if (daysOverdue <= 90) {

                sixtyOneToNinetyCount++;

                sixtyOneToNinetyAmount =
                        sixtyOneToNinetyAmount.add(
                                outstanding
                        );

            } else {

                overNinetyCount++;

                overNinetyAmount =
                        overNinetyAmount.add(
                                outstanding
                        );
            }
        }

        return List.of(

                ReceivableAgingDTO.builder()
                        .agingBucket("0-30 Days")
                        .amount(
                                zeroToThirtyAmount
                                        .doubleValue()
                        )
                        .invoiceCount(
                                zeroToThirtyCount
                        )
                        .build(),

                ReceivableAgingDTO.builder()
                        .agingBucket("31-60 Days")
                        .amount(
                                thirtyOneToSixtyAmount
                                        .doubleValue()
                        )
                        .invoiceCount(
                                thirtyOneToSixtyCount
                        )
                        .build(),

                ReceivableAgingDTO.builder()
                        .agingBucket("61-90 Days")
                        .amount(
                                sixtyOneToNinetyAmount
                                        .doubleValue()
                        )
                        .invoiceCount(
                                sixtyOneToNinetyCount
                        )
                        .build(),

                ReceivableAgingDTO.builder()
                        .agingBucket("90+ Days")
                        .amount(
                                overNinetyAmount
                                        .doubleValue()
                        )
                        .invoiceCount(
                                overNinetyCount
                        )
                        .build()
        );
    }

    /**
     * =========================================================
     * 7. RECENT INVOICES
     * =========================================================
     */
    private List<InvoiceDTO> buildRecentInvoices() {

        return invoiceRepository.findAll()
                .stream()
                .sorted(
                        Comparator.comparing(
                                Invoice::getCreatedAt,
                                Comparator.nullsLast(
                                        Comparator.reverseOrder()
                                )
                        )
                )
                .limit(5)
                .map(invoice ->
                        InvoiceDTO.builder()
                                .invoiceNumber(
                                        invoice.getInvoiceNumber()
                                )
                                .customerName(
                                        invoice.getCustomer() != null
                                                ? invoice.getCustomer()
                                                .getCustomerName()
                                                : "Unknown"
                                )
                                .amount(
                                        invoice.getTotalAmount() != null
                                                ? invoice.getTotalAmount()
                                                .doubleValue()
                                                : 0.0
                                )
                                .invoiceDate(
                                        invoice.getInvoiceDate()
                                )
                                .dueDate(
                                        invoice.getDueDate()
                                )
                                .status(
                                        invoice.getStatus() != null
                                                ? invoice.getStatus()
                                                .name()
                                                : "UNKNOWN"
                                )
                                .build()
                )
                .toList();
    }

    /**
     * =========================================================
     * 8. FUNDING REQUESTS
     * =========================================================
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
                .map(request ->
                        FundingRequestDTO.builder()
                                .requestId(
                                        resolveRequestId(request)
                                )
                                .lenderName(
                                        request.getLenderName()
                                )
                                .requestedAmount(
                                        request.getRequestedAmount()
                                                == null
                                                ? 0.0
                                                : request.getRequestedAmount()
                                                .doubleValue()
                                )
                                .approvedAmount(
                                        request.getApprovedAmount()
                                                == null
                                                ? 0.0
                                                : request.getApprovedAmount()
                                                .doubleValue()
                                )
                                .interestRate(
                                        request.getInterestRate()
                                                == null
                                                ? 0.0
                                                : request.getInterestRate()
                                )
                                .requestDate(
                                        request.getRequestDate()
                                )
                                .status(
                                        request.getStatus() == null
                                                ? null
                                                : request.getStatus()
                                                .name()
                                )
                                .build()
                )
                .toList();
    }

    /**
     * =========================================================
     * REQUEST ID
     * =========================================================
     */
    private String resolveRequestId(
            FundingRequest request) {

        if (request.getRequestNumber() != null &&
                !request.getRequestNumber().isBlank()) {

            return request.getRequestNumber();
        }

        return request.getRequestId();
    }

    /**
     * =========================================================
     * P0.6 - CURRENT CASH BALANCE
     * =========================================================
     *
     * Current Cash =
     *
     * Opening Cash
     * + Successful Payments
     * - Approved Expenses
     */
    private BigDecimal calculateCurrentCashBalance() {

        Company company =
                companyRepository.findAll()
                        .stream()
                        .findFirst()
                        .orElse(new Company());

        /*
         * Opening cash balance.
         */
        BigDecimal openingCash =
                company.getOpeningCashBalance() != null
                        ? company.getOpeningCashBalance()
                        : BigDecimal.ZERO;

        /*
         * Total successful payment inflows.
         */
        BigDecimal totalInflows =
                paymentRepository
                        .findByStatus(
                                PaymentStatus.SUCCESS
                        )
                        .stream()
                        .filter(Objects::nonNull)
                        .map(Payment::getAmount)
                        .filter(Objects::nonNull)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        /*
         * Total approved expense outflows.
         */
        BigDecimal totalOutflows =
                expenseRepository
                        .findByStatus(
                                ExpenseStatus.APPROVED
                        )
                        .stream()
                        .filter(Objects::nonNull)
                        .map(Expense::getAmount)
                        .filter(Objects::nonNull)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        /*
         * Final reconciliation.
         */
        return openingCash
                .add(totalInflows)
                .subtract(totalOutflows);
    }

    /**
     * =========================================================
     * HELPER - OVERDUE
     * =========================================================
     */
    private boolean isOverdue(
            Invoice invoice) {

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