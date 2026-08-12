package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.*;
import com.flowos.flowos_api.entity.Company;
import com.flowos.flowos_api.entity.Expense;
import com.flowos.flowos_api.entity.Invoice;
import com.flowos.flowos_api.enums.ExpenseCategory;
import com.flowos.flowos_api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
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

        DashboardSummaryDTO summary =
                DashboardSummaryDTO.builder()
                        .totalRevenue(2450000.0)
                        .cashBalance(820000.0)
                        .totalReceivables(420000.0)
                        .totalPayables(180000.0)
                        .creditScore(785)
                        .overdueInvoices(12)
                        .revenueGrowth(18.6)
                        .expenseGrowth(6.4)
                        .build();

        List<CashFlowDTO> cashFlow = List.of(

                CashFlowDTO.builder()
                        .month("Jan")
                        .actual(210000.0)
                        .forecast(230000.0)
                        .build(),

                CashFlowDTO.builder()
                        .month("Feb")
                        .actual(260000.0)
                        .forecast(255000.0)
                        .build(),

                CashFlowDTO.builder()
                        .month("Mar")
                        .actual(280000.0)
                        .forecast(270000.0)
                        .build(),

                CashFlowDTO.builder()
                        .month("Apr")
                        .actual(320000.0)
                        .forecast(310000.0)
                        .build(),

                CashFlowDTO.builder()
                        .month("May")
                        .actual(360000.0)
                        .forecast(345000.0)
                        .build(),

                CashFlowDTO.builder()
                        .month("Jun")
                        .actual(390000.0)
                        .forecast(375000.0)
                        .build()
        );

        BusinessHealthDTO businessHealth =
                BusinessHealthDTO.builder()
                        .score(92)
                        .status("Excellent")
                        .cashRunway("8 Months")
                        .creditScore(785)
                        .build();

        List<RevenueProfitDTO> revenueProfit = List.of(

                RevenueProfitDTO.builder()
                        .month("Jan")
                        .revenue(400000.0)
                        .profit(80000.0)
                        .profitMargin(20.0)
                        .build(),

                RevenueProfitDTO.builder()
                        .month("Feb")
                        .revenue(420000.0)
                        .profit(92000.0)
                        .profitMargin(21.9)
                        .build(),

                RevenueProfitDTO.builder()
                        .month("Mar")
                        .revenue(480000.0)
                        .profit(105000.0)
                        .profitMargin(21.8)
                        .build(),

                RevenueProfitDTO.builder()
                        .month("Apr")
                        .revenue(520000.0)
                        .profit(118000.0)
                        .profitMargin(22.7)
                        .build(),

                RevenueProfitDTO.builder()
                        .month("May")
                        .revenue(570000.0)
                        .profit(132000.0)
                        .profitMargin(23.2)
                        .build(),

                RevenueProfitDTO.builder()
                        .month("Jun")
                        .revenue(610000.0)
                        .profit(145000.0)
                        .profitMargin(23.8)
                        .build()
        );

        List<ExpenseBreakdownDTO> expenseBreakdown = List.of(

                ExpenseBreakdownDTO.builder()
                        .category("Payroll")
                        .amount(185000.0)
                        .percentage(34.5)
                        .build(),

                ExpenseBreakdownDTO.builder()
                        .category("Operations")
                        .amount(95000.0)
                        .percentage(17.7)
                        .build(),

                ExpenseBreakdownDTO.builder()
                        .category("Marketing")
                        .amount(82000.0)
                        .percentage(15.3)
                        .build(),

                ExpenseBreakdownDTO.builder()
                        .category("Technology")
                        .amount(61000.0)
                        .percentage(11.4)
                        .build(),

                ExpenseBreakdownDTO.builder()
                        .category("Other")
                        .amount(114000.0)
                        .percentage(21.1)
                        .build()
        );

        List<ReceivableAgingDTO> aging = List.of(

                ReceivableAgingDTO.builder()
                        .agingBucket("0-30 Days")
                        .amount(520000.0)
                        .invoiceCount(18)
                        .build(),

                ReceivableAgingDTO.builder()
                        .agingBucket("31-60 Days")
                        .amount(285000.0)
                        .invoiceCount(10)
                        .build(),

                ReceivableAgingDTO.builder()
                        .agingBucket("61-90 Days")
                        .amount(146000.0)
                        .invoiceCount(6)
                        .build(),

                ReceivableAgingDTO.builder()
                        .agingBucket("90+ Days")
                        .amount(72000.0)
                        .invoiceCount(3)
                        .build()
        );

        List<InvoiceDTO> invoices = List.of(

                InvoiceDTO.builder()
                        .invoiceNumber("INV-2026-1001")
                        .customerName("Infosys Ltd")
                        .amount(180000.0)
                        .invoiceDate(LocalDate.now().minusDays(20))
                        .dueDate(LocalDate.now().plusDays(10))
                        .status("PENDING")
                        .build(),

                InvoiceDTO.builder()
                        .invoiceNumber("INV-2026-1002")
                        .customerName("TCS")
                        .amount(245000.0)
                        .invoiceDate(LocalDate.now().minusDays(15))
                        .dueDate(LocalDate.now().plusDays(15))
                        .status("APPROVED")
                        .build(),

                InvoiceDTO.builder()
                        .invoiceNumber("INV-2026-1003")
                        .customerName("Wipro")
                        .amount(98000.0)
                        .invoiceDate(LocalDate.now().minusDays(8))
                        .dueDate(LocalDate.now().plusDays(22))
                        .status("PAID")
                        .build()
        );

        List<FundingRequestDTO> fundingRequests = List.of(

                FundingRequestDTO.builder()
                        .requestId("FR-2026-5001")
                        .lenderName("HDFC Bank")
                        .requestedAmount(500000.0)
                        .approvedAmount(450000.0)
                        .interestRate(11.75)
                        .requestDate(LocalDate.now().minusDays(7))
                        .status("APPROVED")
                        .build(),

                FundingRequestDTO.builder()
                        .requestId("FR-2026-5002")
                        .lenderName("ICICI Bank")
                        .requestedAmount(300000.0)
                        .approvedAmount(0.0)
                        .interestRate(12.10)
                        .requestDate(LocalDate.now().minusDays(3))
                        .status("UNDER_REVIEW")
                        .build()
        );

        return DashboardResponse.builder()
                .summary(summary)
                .cashFlow(cashFlow)
                .businessHealth(businessHealth)
                .revenueProfit(revenueProfit)
                .expenseBreakdown(expenseBreakdown)
                .receivableAging(aging)
                .recentInvoices(invoices)
                .fundingRequests(fundingRequests)
                .build();
    }

    private DashboardSummaryDTO buildSummary() {

        Company company = companyRepository.findAll()
                .stream()
                .findFirst()
                .orElse(new Company());

        BigDecimal totalRevenue = invoiceRepository.findAll()
                .stream()
                .map(Invoice::getTotalAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal receivables = invoiceRepository.findAll()
                .stream()
                .map(Invoice::getOutstandingAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal payables = expenseRepository.findAll()
                .stream()
                .map(Expense::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long overdue = invoiceRepository.findAll()
                .stream()
                .filter(i -> i.getDueDate() != null)
                .filter(i -> i.getDueDate().isBefore(LocalDate.now()))
                .count();

        return DashboardSummaryDTO.builder()
                .totalRevenue(totalRevenue.doubleValue())
                .cashBalance(company.getCashBalance().doubleValue())
                .totalReceivables(receivables.doubleValue())
                .totalPayables(payables.doubleValue())
                .creditScore(company.getCreditScore())
                .overdueInvoices((int) overdue)
                .build();
    }
    private List<RevenueProfitDTO> buildRevenueChart() {

        Map<Month, BigDecimal> revenue =
                invoiceRepository.findAll()
                        .stream()
                        .collect(Collectors.groupingBy(

                                i -> i.getInvoiceDate().getMonth(),

                                Collectors.mapping(
                                        Invoice::getTotalAmount,

                                        Collectors.reducing(
                                                BigDecimal.ZERO,
                                                BigDecimal::add)
                                )
                        ));

        return revenue.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry ->

                        RevenueProfitDTO.builder()
                                .month(entry.getKey().name())
                                .revenue(entry.getValue().doubleValue())
                                .profit(0.0)
                                .profitMargin(0.0)
                                .build()

                ).toList();
    }

    private List<CashFlowDTO> buildCashFlow() {

        return cashFlowRepository.findAll()

                .stream()

                .map(c ->

                        CashFlowDTO.builder()

                                .month(c.getMonth())

                                .actual(c.getActualAmount().doubleValue())

                                .forecast(c.getForecastAmount().doubleValue())

                                .build())

                .toList();
    }

    private BusinessHealthDTO buildBusinessHealth() {

        Company company = companyRepository.findAll()

                .stream()

                .findFirst()

                .orElse(new Company());

        return BusinessHealthDTO.builder()

                .score(company.getCreditScore())

                .status(company.getCreditScore() >= 750
                        ? "Excellent"
                        : "Average")

                .cashRunway("6 Months")

                .creditScore(company.getCreditScore())

                .build();
    }

    private List<ExpenseBreakdownDTO> buildExpenseBreakdown() {

       Map<ExpenseCategory, BigDecimal> expenseMap =
                expenseRepository.findAll()
                        .stream()
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

        BigDecimal total = expenseMap.values()

                .stream()

                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return expenseMap.entrySet()

                .stream()

                .map(e ->

                        ExpenseBreakdownDTO.builder()

                                .category(e.getKey().name())

                                .amount(e.getValue().doubleValue())

                                .percentage(

                                        total.compareTo(BigDecimal.ZERO) == 0

                                                ? 0

                                                : e.getValue()

                                                .multiply(BigDecimal.valueOf(100))

                                                .divide(total,2, RoundingMode.HALF_UP)

                                                .doubleValue()

                                )

                                .build())

                .toList();
    }
}