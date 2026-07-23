package com.flowos.flowos_api.dto;

import lombok.Data;

@Data
public class TrafficRequest {

    private String location;
    private String routeName;
    private Double latitude;
    private Double longitude;
    private String congestionLevel;
    private Double averageSpeed;
    private Integer vehicleCount;
}