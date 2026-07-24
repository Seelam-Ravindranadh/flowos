package com.flowos.flowos_api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCustomerRequest {

    private String customerName;

    private String email;

    private String phone;

    private String company;

    private String address;

    private String gstNumber;

}
