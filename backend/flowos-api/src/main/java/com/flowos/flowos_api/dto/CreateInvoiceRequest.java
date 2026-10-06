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
            example = "INV-1001"
    )
    @NotBlank(message = "Invoice number is required")
    private String invoiceNumber;

    @Schema(
            description = "Company ID (Tenant) - Optional, defaults to primary company",
            example = "1"
    )
    private Long companyId;

    @Schema(
            description = "Customer ID",
            example = "1"
    )
    @NotNull(message = "Customer is required")
    private Long customerId;

    @Schema(
            description = "Vendor ID",
            example = "1"
    )
    @NotNull(message = "Vendor is required")
    private Long vendorId;

    @Schema(
            description = "Invoice Date",
            example = "2026-10-06"
    )
    @NotNull(message = "Invoice Date is required")
    private LocalDate invoiceDate;

    @Schema(
            description = "Due Date",
            example = "2026-11-15"
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
            description = "Tax Amount",
            example = "4500.00"
    )
    @NotNull(message = "Tax is required")
    private BigDecimal tax;

    @Schema(
            description = "Total Amount (Base Amount + Tax) - Optional, calculated automatically if omitted",
            example = "29500.00"
    )
    private BigDecimal totalAmount;

    @Schema(
            description = "Additional Notes",
            example = "Payment due in 30 days"
    )
    private String notes;
}