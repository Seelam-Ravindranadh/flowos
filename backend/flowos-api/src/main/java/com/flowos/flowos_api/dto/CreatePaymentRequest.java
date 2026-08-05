package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.PaymentMethod;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePaymentRequest {

    private String paymentNumber;

    private Long invoiceId;

    private BigDecimal amount;

    private PaymentMethod paymentMethod;

    private LocalDate paymentDate;

    private String transactionReference;

    private String remarks;

}