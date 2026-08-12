package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.InvoiceStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceRequestDTO {

    private String invoiceNumber;

    private Long customerId;

    private Long vendorId;

    private LocalDate invoiceDate;

    private LocalDate dueDate;

    private BigDecimal amount;

    private BigDecimal tax;

    private InvoiceStatus status;

    private String notes;
}