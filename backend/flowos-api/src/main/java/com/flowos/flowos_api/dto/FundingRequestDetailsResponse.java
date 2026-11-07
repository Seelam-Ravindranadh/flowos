package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.FundingRequestStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FundingRequestDetailsResponse {

    private Long id;
    private String requestNumber;
    private Long companyId;
    private Long invoiceId;
    private String invoiceNumber;
    private BigDecimal invoiceTotalAmount;
    private BigDecimal invoiceOutstandingAmount;
    private BigDecimal requestedAmount;
    private BigDecimal approvedAmount;
    private Double interestRate;
    private String lenderName;
    private FundingRequestStatus status;
    private LocalDate requestDate;
    private String notes;
    private List<LenderBidResponse> bids;
}