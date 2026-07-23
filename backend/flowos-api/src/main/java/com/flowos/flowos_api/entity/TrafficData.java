package com.flowos.flowos_api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "traffic_data")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TrafficData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String location;

    private String routeName;

    private Double latitude;

    private Double longitude;

    // LOW / MODERATE / HIGH / SEVERE
    private String congestionLevel;

    // Speed in km/h
    private Double averageSpeed;

    private Integer vehicleCount;

    private LocalDateTime recordedAt;
}