package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.VendorCategory;
import com.flowos.flowos_api.enums.VendorStatus;
import lombok.Data;

@Data
public class VendorResponse {

    private Long id;

    private String vendorName;

    private String email;

    private String phone;

    private String company;

    private String address;

    private String gstNumber;

    private VendorCategory category;

    private VendorStatus status;
}