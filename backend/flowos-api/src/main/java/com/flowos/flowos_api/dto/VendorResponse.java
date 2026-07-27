package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.VendorCategory;
import com.flowos.flowos_api.enums.VendorStatus;
import lombok.Data;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Vendor Response")
@Data
public class VendorResponse {
    @Schema(example = "1")
    private Long id;

    @Schema(example = "ABC Technologies")
    private String vendorName;

    @Schema(example = "vendor@abc.com")
    private String email;

    @Schema(example = "9876543210")
    private String phone;

    @Schema(example = "ABC Pvt Ltd")
    private String company;

    @Schema(example = "Hyderabad")
    private String address;

    @Schema(example = "29ABCDE1234F1Z5")
    private String gstNumber;

    @Schema(example = "SOFTWARE")
    private VendorCategory category;

    @Schema(example = "ACTIVE")
    private VendorStatus status;

    @Schema(example = "2026-07-27T10:30:00")
    private LocalDateTime createdAt;

    @Schema(example = "2026-07-27T10:30:00")
    private LocalDateTime updatedAt;
}