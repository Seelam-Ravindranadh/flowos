package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.ExpenseCategory;
import com.flowos.flowos_api.enums.ExpenseStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseResponse {

    private Long id;

    private String expenseName;

    private ExpenseCategory category;

    private LocalDate expenseDate;

    private BigDecimal amount;

    private String vendorName;

    private String description;

    private ExpenseStatus status;
}
