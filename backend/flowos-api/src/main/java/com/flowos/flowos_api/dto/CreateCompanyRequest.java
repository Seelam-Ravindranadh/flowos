package com.flowos.flowos_api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCompanyRequest {

    @NotBlank
    private String companyName;

    private String registrationNumber;

    private String gstNumber;

    private String panNumber;

    @Email
    private String email;

    private String phone;

    private String website;

    private String address;

    private String city;

    private String state;

    private String country;

    private String postalCode;

}