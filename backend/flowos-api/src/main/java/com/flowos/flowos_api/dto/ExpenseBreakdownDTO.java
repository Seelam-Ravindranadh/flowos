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
@Schema(description = "Expense Category Breakdown")
public class ExpenseBreakdownDTO {

    @Schema(
            description = "Expense Category",
            example = "Payroll"
    )
    private String category;

    @Schema(
            description = "Expense Amount",
            example = "185000"
    )
    private Double amount;

    @Schema(
            description = "Percentage of Total Expenses",
            example = "34.5"
    )
    private Double percentage;

}