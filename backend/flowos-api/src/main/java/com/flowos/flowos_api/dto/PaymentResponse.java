package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.InvoiceStatus;
import com.flowos.flowos_api.enums.PaymentMethod;
import com.flowos.flowos_api.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {

    private Long id;
    private Long companyId;
    private String paymentNumber;
    private Long invoiceId;
    private String invoiceNumber;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private LocalDate paymentDate;
    private String transactionReference;
    private String remarks;

    // Post-payment balance snapshot on the Invoice
    private BigDecimal invoiceTotalAmount;
    private BigDecimal invoicePaidAmount;
    private BigDecimal invoiceOutstandingAmount;
    private InvoiceStatus invoiceStatus;
}