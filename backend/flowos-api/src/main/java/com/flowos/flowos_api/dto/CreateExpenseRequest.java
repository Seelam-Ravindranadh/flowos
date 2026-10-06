package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.ExpenseCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Create Expense Request Payload")
public class CreateExpenseRequest {

    @Schema(description = "Company Tenant ID (Optional - defaults to primary tenant)", example = "1")
    private Long companyId;

    @Schema(description = "Expense Number / Code", example = "EXP-2026-001")
    private String expenseNumber;

    @NotBlank(message = "Expense name is required")
    @Schema(example = "Cloud Compute Infrastructure")
    private String expenseName;

    @NotNull(message = "Expense category is required")
    @Schema(example = "SOFTWARE")
    private ExpenseCategory category;

    @NotNull(message = "Expense date is required")
    @Schema(example = "2026-10-06")
    private LocalDate expenseDate;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    @Schema(example = "30000.00")
    private BigDecimal amount;

    @Schema(example = "Amazon Web Services")
    private String vendorName;

    @Schema(example = "Monthly production server cluster invoice")
    private String description;
}