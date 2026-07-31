package com.flowos.flowos_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Funding Request Details")
public class FundingRequestDTO {

    @Schema(
            description = "Funding Request ID",
            example = "FR-2026-5001"
    )
    private String requestId;

    @Schema(
            description = "Funding Partner",
            example = "HDFC Bank"
    )
    private String lenderName;

    @Schema(
            description = "Requested Amount",
            example = "500000"
    )
    private Double requestedAmount;

    @Schema(
            description = "Approved Amount",
            example = "450000"
    )
    private Double approvedAmount;

    @Schema(
            description = "Interest Rate (%)",
            example = "11.75"
    )
    private Double interestRate;

    @Schema(
            description = "Request Date",
            example = "2026-07-22"
    )
    private LocalDate requestDate;

    @Schema(
            description = "Current Status",
            example = "APPROVED"
    )
    private String status;

}