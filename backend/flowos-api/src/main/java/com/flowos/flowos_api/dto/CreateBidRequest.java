package com.flowos.flowos_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Lender Bid Submission Payload")
public class CreateBidRequest {

    @NotBlank(message = "Lender name is required")
    @Schema(example = "HDFC Bank SME Desk")
    private String lenderName;

    @NotNull(message = "Advance amount is required")
    @DecimalMin(value = "0.01", message = "Advance amount must be greater than zero")
    @Schema(example = "23600.00")
    private BigDecimal advanceAmount;

    @NotNull(message = "Discount rate is required")
    @DecimalMin(value = "0.1", message = "Discount rate must be positive")
    @Schema(example = "11.5", description = "Annualized discount rate in percentage")
    private Double discountRate;

    @Schema(example = "Fast 2-hour disbursement offer")
    private String notes;
}