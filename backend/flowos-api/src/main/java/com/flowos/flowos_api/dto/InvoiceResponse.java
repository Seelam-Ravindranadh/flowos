package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.InvoiceStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Schema(description = "Invoice Response")
public class InvoiceResponse {

    @Schema(example = "1")
    private Long id;

    @Schema(example = "INV-1001")
    private String invoiceNumber;

    @Schema(example = "1")
    private Long customerId;

    @Schema(example = "John Smith")
    private String customerName;

    @Schema(example = "2")
    private Long vendorId;

    @Schema(example = "ABC Technologies")
    private String vendorName;

    @Schema(example = "2026-07-27")
    private LocalDate invoiceDate;

    @Schema(example = "2026-08-10")
    private LocalDate dueDate;

    @Schema(example = "2026-08-05")
    private LocalDate paidDate;

    @Schema(example = "25000")
    private BigDecimal amount;

    @Schema(example = "4500")
    private BigDecimal tax;

    @Schema(example = "29500")
    private BigDecimal totalAmount;

    @Schema(example = "10000")
    private BigDecimal paidAmount;

    @Schema(example = "19500")
    private BigDecimal outstandingAmount;

    @Schema(example = "PAID")
    private InvoiceStatus status;

    @Schema(example = "Paid through bank transfer")
    private String notes;
}