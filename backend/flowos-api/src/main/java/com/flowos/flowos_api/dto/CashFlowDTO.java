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
@Schema(description = "Monthly Cash Flow")
public class CashFlowDTO {

    @Schema(example = "Jan")
    private String month;

    @Schema(example = "245000")
    private Double actual;

    @Schema(example = "262000")
    private Double forecast;

}