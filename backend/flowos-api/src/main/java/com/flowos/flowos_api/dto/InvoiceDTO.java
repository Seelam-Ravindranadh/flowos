package com.flowos.flowos_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Recent Invoice Details")
public class InvoiceDTO {

    @Schema(
            description = "Invoice Number",
            example = "INV-2026-1001"
    )
    private String invoiceNumber;

    @Schema(
            description = "Customer Name",
            example = "ABC Technologies Pvt Ltd"
    )
    private String customerName;

    @Schema(
            description = "Invoice Amount",
            example = "125000"
    )
    private Double amount;

    @Schema(
            description = "Invoice Date",
            example = "2026-07-25"
    )
    private LocalDate invoiceDate;

    @Schema(
            description = "Due Date",
            example = "2026-08-25"
    )
    private LocalDate dueDate;

    @Schema(
            description = "Invoice Status",
            example = "PAID"
    )
    private String status;

}