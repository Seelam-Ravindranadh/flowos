package com.flowos.flowos_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Create Invoice Request")
public class CreateInvoiceRequest {

    @Schema(
            description = "Invoice Number",
            example = "INV-2026-001"
    )
    @NotBlank(message = "Invoice number is required")
    private String invoiceNumber;

    @Schema(
            description = "Company ID (Tenant) - Optional, defaults to primary company",
            example = "1"
    )
    private Long companyId;

    @Schema(
            description = "Customer ID (for Receivables / Sales Invoices)",
            example = "1"
    )
    private Long customerId;

    @Schema(
            description = "Vendor ID (for Payables / Supplier Invoices) - Optional",
            example = "1"
    )
    private Long vendorId;

    @Schema(
            description = "Invoice Issue Date - Defaults to current date if omitted",
            example = "2026-11-07"
    )
    private LocalDate invoiceDate;

    @Schema(
            description = "Invoice Due Date",
            example = "2026-12-07"
    )
    @NotNull(message = "Due Date is required")
    private LocalDate dueDate;

    @Schema(
            description = "Invoice Base Amount",
            example = "25000.00"
    )
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;

    @Schema(
            description = "Tax Amount - Defaults to 0 if omitted",
            example = "4500.00"
    )
    private BigDecimal tax;

    @Schema(
            description = "Total Amount (Base Amount + Tax) - Calculated automatically if omitted",
            example = "29500.00"
    )
    private BigDecimal totalAmount;

    @Schema(
            description = "Additional Notes",
            example = "Net 30 terms. Remit via NEFT/RTGS."
    )
    private String notes;
}