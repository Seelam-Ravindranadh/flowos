package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

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
}