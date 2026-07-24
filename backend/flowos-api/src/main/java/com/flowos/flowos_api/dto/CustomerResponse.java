package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.CustomerStatus;
import lombok.Data;

@Data
public class CustomerResponse {

    private Long id;

    private String customerName;

    private String email;

    private String phone;

    private String company;

    private String address;

    private String gstNumber;

    private CustomerStatus status;

}
