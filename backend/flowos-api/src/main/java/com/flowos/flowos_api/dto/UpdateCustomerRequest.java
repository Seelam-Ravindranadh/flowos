package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.CustomerStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCustomerRequest {

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Phone number must be 10 digits"
    )
    private String phone;

    @NotBlank(message = "Company is required")
    private String company;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "GST Number is required")
    private String gstNumber;

    private CustomerStatus status;
}