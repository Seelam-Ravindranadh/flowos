package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.PaymentMethod;
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
@Schema(description = "Payment Creation Payload")
public class CreatePaymentRequest {

    @Schema(example = "1", description = "Target Company ID (Optional - defaults to Invoice Company)")
    private Long companyId;

    @Schema(example = "PAY-2026-1002")
    private String paymentNumber;

    @Schema(example = "1", description = "Invoice ID to pay")
    @NotNull(message = "Invoice ID is required")
    private Long invoiceId;

    @Schema(example = "18000.00")
    @NotNull(message = "Payment amount is required")
    @DecimalMin(value = "0.01", message = "Payment amount must be greater than zero")
    private BigDecimal amount;

    @Schema(example = "BANK_TRANSFER")
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    @Schema(example = "2026-10-06")
    private LocalDate paymentDate;

    @Schema(example = "TXN-2026-001")
    private String transactionReference;

    @Schema(example = "Settlement of remaining balance")
    private String remarks;
}