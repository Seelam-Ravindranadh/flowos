package com.flowos.flowos_api.dto;

import lombok.Data;

@Data
public class SignupRequest {

    private String firstName;

    private String lastName;

    private String email;

    private String password;

    private String role;
}