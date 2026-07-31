package com.flowos.flowos_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Dashboard KPI Summary")
public class DashboardSummaryDTO {

    @Schema(example = "1250000")
    private Double totalRevenue;

    @Schema(example = "865000")
    private Double cashBalance;

    @Schema(example = "215000")
    private Double totalReceivables;

    @Schema(example = "94000")
    private Double totalPayables;

    @Schema(example = "78")
    private Integer creditScore;

    @Schema(example = "17")
    private Integer overdueInvoices;

    @Schema(example = "12.4")
    private Double revenueGrowth;

    @Schema(example = "4.8")
    private Double expenseGrowth;

}