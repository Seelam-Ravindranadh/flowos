package com.flowos.flowos_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName;

    @Column(unique = true)
    private String registrationNumber;

    @Column(unique = true)
    private String gstNumber;

    @Column(unique = true)
    private String panNumber;

    @Column(unique = true)
    private String email;

    private String phone;

    private String website;

    private String address;

    private String city;

    private String state;

    private String country;

    private String postalCode;

    private String industry;

    private Integer employeeCount;

    @Column(precision = 18, scale = 2)
    private BigDecimal annualRevenue;

    @Column(precision = 18, scale = 2)
    private BigDecimal totalAssets;

    @Column(precision = 18, scale = 2)
    private BigDecimal totalLiabilities;

    @Column(precision = 18, scale = 2)
    private BigDecimal cashBalance;

    private Integer creditScore;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}