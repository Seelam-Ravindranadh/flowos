package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.InvoiceStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateInvoiceRequest {

    @NotBlank
    private String invoiceNumber;

    @NotNull
    private Long customerId;

    @NotNull
    private Long vendorId;

    @NotNull
    private LocalDate invoiceDate;

    @FutureOrPresent
    private LocalDate dueDate;

    @DecimalMin("0.0")
    private BigDecimal amount;

    @DecimalMin("0.0")
    private BigDecimal tax;

    @DecimalMin("0.0")
    private BigDecimal paidAmount;

    private LocalDate paidDate;

    private InvoiceStatus status;

    private String notes;

}