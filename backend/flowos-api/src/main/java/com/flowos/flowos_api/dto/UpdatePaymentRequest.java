package com.flowos.flowos_api.dto;

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
public class UpdatePaymentRequest {

    private BigDecimal amount;

    private PaymentMethod paymentMethod;

    private PaymentStatus status;

    private LocalDate paymentDate;

    private String transactionReference;

    private String remarks;

}