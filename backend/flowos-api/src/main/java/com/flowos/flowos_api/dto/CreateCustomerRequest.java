package com.flowos.flowos_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Request object used to create a new customer")
public class CreateCustomerRequest {

    @Schema(
            description = "Customer Name",
            example = "John Smith"
    )
    @NotBlank(message = "Customer name is required")
    private String customerName;

    @Schema(
            description = "Customer Email",
            example = "john@gmail.com"
    )
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Schema(
            description = "Customer Phone Number",
            example = "9876543210"
    )
    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Phone number must be 10 digits"
    )
    private String phone;

    @Schema(
            description = "Company Name",
            example = "ABC Technologies"
    )
    @NotBlank(message = "Company is required")
    private String company;

    @Schema(
            description = "Customer Address",
            example = "Hyderabad"
    )
    @NotBlank(message = "Address is required")
    private String address;

    @Schema(
            description = "GST Number",
            example = "29ABCDE1234F1Z5"
    )
    @NotBlank(message = "GST Number is required")
    private String gstNumber;
}