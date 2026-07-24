package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.CustomerStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCustomerRequest {

    private String customerName;

    private String phone;

    private String company;

    private String address;

    private String gstNumber;

    private CustomerStatus status;

}
