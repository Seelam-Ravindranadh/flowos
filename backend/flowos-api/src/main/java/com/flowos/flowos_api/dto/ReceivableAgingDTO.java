package com.flowos.flowos_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Receivable Aging Summary")
public class ReceivableAgingDTO {

    @Schema(
            description = "Age Bucket",
            example = "0-30 Days"
    )
    private String agingBucket;

    @Schema(
            description = "Outstanding Amount",
            example = "248000"
    )
    private Double amount;

    @Schema(
            description = "Number of Invoices",
            example = "18"
    )
    private Integer invoiceCount;

}