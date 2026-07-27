package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.VendorCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Request object for creating a new vendor")
public class CreateVendorRequest {

    @Schema(
            description = "Vendor Name",
            example = "ABC Technologies"
    )
    @NotBlank(message = "Vendor name is required")
    private String vendorName;

    @Schema(
            description = "Vendor Email",
            example = "vendor@abc.com"
    )
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    private String email;

    @Schema(
            description = "Vendor Phone Number",
            example = "9876543210"
    )
    @NotBlank(message = "Phone is required")
    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Phone must contain 10 digits"
    )
    private String phone;

    @Schema(
            description = "Company Name",
            example = "ABC Pvt Ltd"
    )
    @NotBlank(message = "Company is required")
    private String company;

    @Schema(
            description = "Vendor Address",
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

    @Schema(
            description = "Vendor Category",
            example = "SOFTWARE"
    )
    private VendorCategory category;
}