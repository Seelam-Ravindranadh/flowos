package com.flowos.flowos_api.dto;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyProfileResponse {

    private Long id;

    private String companyName;
    private String registrationNumber;

    private String gstNumber;
    private String panNumber;

    private String email;
    private String phone;
    private String website;

    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
