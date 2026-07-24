package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.VendorCategory;
import com.flowos.flowos_api.enums.VendorStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateVendorRequest {

    private String vendorName;

    private String phone;

    private String company;

    private String address;

    private String gstNumber;

    private VendorCategory category;

    private VendorStatus status;
}