package com.flowos.flowos_api.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TrafficResponse {

    private Long id;
    private String location;
    private String routeName;
    private Double latitude;
    private Double longitude;
    private String congestionLevel;
    private Double averageSpeed;
    private Integer vehicleCount;
    private LocalDateTime recordedAt;
}