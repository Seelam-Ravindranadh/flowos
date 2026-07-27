package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.VendorCategory;
import com.flowos.flowos_api.enums.VendorStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Update Vendor Request")
public class UpdateVendorRequest {

    @Schema(example = "ABC Technologies")
    @NotBlank(message = "Vendor name is required")
    private String vendorName;

    @Schema(example = "9876543210")
    @NotBlank(message = "Phone is required")
    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Phone must contain 10 digits"
    )
    private String phone;

    @Schema(example = "ABC Pvt Ltd")
    @NotBlank(message = "Company is required")
    private String company;

    @Schema(example = "Hyderabad")
    @NotBlank(message = "Address is required")
    private String address;

    @Schema(example = "29ABCDE1234F1Z5")
    @NotBlank(message = "GST Number is required")
    private String gstNumber;

    @Schema(example = "SOFTWARE")
    private VendorCategory category;

    @Schema(example = "ACTIVE")
    private VendorStatus status;
}