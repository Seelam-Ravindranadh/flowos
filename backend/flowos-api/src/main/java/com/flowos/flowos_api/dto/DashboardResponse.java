package com.flowos.flowos_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Complete Dashboard Response")
public class DashboardResponse {

    private DashboardSummaryDTO summary;

    private List<CashFlowDTO> cashFlow;

    private BusinessHealthDTO businessHealth;

    private List<RevenueProfitDTO> revenueProfit;

    private List<ExpenseBreakdownDTO> expenseBreakdown;

    private List<ReceivableAgingDTO> receivableAging;

    private List<InvoiceDTO> recentInvoices;

    private List<FundingRequestDTO> fundingRequests;

}