package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.InvoiceStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public class UpdateInvoiceRequest {

    @NotBlank(message = "Invoice number is required")
    private String invoiceNumber;

    @NotNull
    private Long customerId;

    @NotNull
    private Long vendorId;

    @NotNull
    private LocalDate invoiceDate;

    @NotNull
    private LocalDate dueDate;

    private LocalDate paidDate;

    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @Positive(message = "Tax must be positive")
    private BigDecimal tax;

    @Positive(message = "Paid amount must be positive")
    private BigDecimal paidAmount;

    private InvoiceStatus status;

    private String notes;
}