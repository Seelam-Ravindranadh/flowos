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
    @Schema(description = "Monthly Revenue vs Profit")
    public class RevenueProfitDTO {

        @Schema(
                description = "Month",
                example = "Jan"
        )
        private String month;

        @Schema(
                description = "Total Revenue",
                example = "520000"
        )
        private Double revenue;

        @Schema(
                description = "Net Profit",
                example = "146000"
        )
        private Double profit;

        @Schema(
                description = "Profit Margin (%)",
                example = "28.08"
        )
        private Double profitMargin;

    }