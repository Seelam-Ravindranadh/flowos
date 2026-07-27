package com.flowos.flowos_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Schema(description = "Create Invoice Request")
public class CreateInvoiceRequest {

    @Schema(
            description = "Invoice Number",
            example = "INV-1001"
    )
    @NotBlank(message = "Invoice number is required")
    private String invoiceNumber;

    @Schema(
            description = "Customer ID",
            example = "1"
    )
    @NotNull(message = "Customer is required")
    private Long customerId;

    @Schema(
            description = "Vendor ID",
            example = "2"
    )
    @NotNull(message = "Vendor is required")
    private Long vendorId;

    @Schema(
            description = "Invoice Date",
            example = "2026-07-27"
    )
    @NotNull(message = "Invoice Date is required")
    private LocalDate invoiceDate;

    @Schema(
            description = "Due Date",
            example = "2026-08-10"
    )
    @NotNull(message = "Due Date is required")
    private LocalDate dueDate;

    @Schema(
            description = "Invoice Amount",
            example = "25000"
    )
    @NotNull
    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;

    @Schema(
            description = "Tax Amount",
            example = "4500"
    )
    @NotNull
    @Positive(message = "Tax must be greater than zero")
    private BigDecimal tax;

    @Schema(
            description = "Additional Notes",
            example = "Payment due in 15 days"
    )
    private String notes;
}