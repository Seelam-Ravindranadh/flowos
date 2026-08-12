package com.flowos.flowos_api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PaymentRequestDTO {

    private BigDecimal amount;

    private LocalDate paymentDate;

    private String paymentMethod;

    private String referenceNumber;

    private String notes;
}
