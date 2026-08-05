package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.ExpenseCategory;
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
public class CreateExpenseRequest {

    @NotBlank(message = "Expense name is required")
    private String expenseName;

    @NotNull(message = "Expense category is required")
    private ExpenseCategory category;

    @NotNull(message = "Expense date is required")
    private LocalDate expenseDate;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = false,
            message = "Amount must be greater than zero")
    private BigDecimal amount;

    private String vendorName;

    private String description;
}