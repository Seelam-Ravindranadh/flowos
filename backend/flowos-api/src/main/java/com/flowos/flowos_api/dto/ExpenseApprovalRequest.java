package com.flowos.flowos_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Expense Approval/Rejection Payload")
public class ExpenseApprovalRequest {

    @NotBlank(message = "Approver identifier/email is required")
    @Schema(example = "ravindranadhseelam@gmail.com")
    private String approvedBy;

    @Schema(example = "Budget threshold exceeded")
    private String rejectionReason;
}