package com.flowos.flowos_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Create Funding Request Payload")
public class CreateFundingRequest {

    private String requestNumber;

    @NotNull(message = "Company ID is required")
    private Long companyId;

    @NotNull(message = "Invoice ID is required")
    private Long invoiceId;

    @NotNull(message = "Requested advance amount is required")
    @DecimalMin(value = "0.01", message = "Requested amount must be greater than zero")
    private BigDecimal requestedAmount;

    private BigDecimal approvedAmount;

    private Double interestRate;

    private Integer tenureMonths;

    private String lenderName;

    private LocalDate requestDate;

    private String purpose;

    private String notes;
}