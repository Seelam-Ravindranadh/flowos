package com.flowos.flowos_api.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyFinancialSummaryResponse {

    private Long companyId;

    private String companyName;

    private BigDecimal annualRevenue;

    private BigDecimal totalAssets;

    private BigDecimal totalLiabilities;

    private BigDecimal cashBalance;

    private Integer creditScore;
}