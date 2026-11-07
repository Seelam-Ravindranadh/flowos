package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.BidStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LenderBidResponse {

    private Long id;
    private String bidNumber;
    private Long fundingRequestId;
    private String lenderName;
    private BigDecimal advanceAmount;
    private Double discountRate;
    private BigDecimal platformFee;
    private BigDecimal netDisbursement;
    private BidStatus status;
    private LocalDate bidDate;
    private String notes;
}