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
@Schema(description = "Business Health")
public class BusinessHealthDTO {

    @Schema(example = "87")
    private Integer score;

    @Schema(example = "Healthy")
    private String status;

    @Schema(example = "8 Months")
    private String cashRunway;

    @Schema(example = "785")
    private Integer creditScore;

}