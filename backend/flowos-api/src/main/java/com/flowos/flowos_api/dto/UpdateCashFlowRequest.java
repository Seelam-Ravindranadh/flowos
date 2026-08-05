package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.CashFlowType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCashFlowRequest {

    private CashFlowType type;

    private BigDecimal amount;

    private LocalDate transactionDate;

    private String source;

    private String description;

}