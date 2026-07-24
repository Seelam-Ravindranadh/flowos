package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.VendorCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateVendorRequest {

    private String vendorName;

    private String email;

    private String phone;

    private String company;

    private String address;

    private String gstNumber;

    private VendorCategory category;
}