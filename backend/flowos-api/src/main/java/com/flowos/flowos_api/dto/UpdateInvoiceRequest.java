package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.InvoiceStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Schema(description = "Update Invoice Request")
public class UpdateInvoiceRequest {

    @Schema(example = "INV-1001")
    @NotBlank(message = "Invoice number is required")
    private String invoiceNumber;

    @Schema(example = "1")
    @NotNull(message = "Customer is required")
    private Long customerId;

    @Schema(example = "2")
    @NotNull(message = "Vendor is required")
    private Long vendorId;

    @Schema(example = "2026-07-27")
    @NotNull(message = "Invoice Date is required")
    private LocalDate invoiceDate;

    @Schema(example = "2026-08-10")
    @NotNull(message = "Due Date is required")
    private LocalDate dueDate;

    @Schema(example = "2026-08-05")
    private LocalDate paidDate;

    @Schema(example = "25000")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @Schema(example = "4500")
    @Positive(message = "Tax must be positive")
    private BigDecimal tax;

    @Schema(example = "10000")
    @Positive(message = "Paid amount must be positive")
    private BigDecimal paidAmount;

    @Schema(example = "PAID")
    private InvoiceStatus status;

    @Schema(example = "Paid through bank transfer")
    private String notes;
}