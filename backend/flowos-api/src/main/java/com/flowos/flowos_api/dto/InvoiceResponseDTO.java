package com.flowos.flowos_api.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceResponseDTO {

    private Long id;

    private String invoiceNumber;

    private Long customerId;

    private String customerName;

    private LocalDate invoiceDate;

    private LocalDate dueDate;

    private BigDecimal amount;

    private BigDecimal tax;

    private BigDecimal totalAmount;

    private BigDecimal paidAmount;

    private BigDecimal outstandingAmount;

    private String status;

    private LocalDate paidDate;

    private String notes;
}