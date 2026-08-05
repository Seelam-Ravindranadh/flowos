package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.FundingStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateFundingRequest {

    private String requestNumber;

    private Long companyId;

    private BigDecimal requestedAmount;

    private BigDecimal approvedAmount;

    private Double interestRate;

    private Integer tenureMonths;

    private String lenderName;

    private LocalDate requestDate;

    private String purpose;

}
