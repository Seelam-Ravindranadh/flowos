package com.flowos.flowos_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "Login Request")
public class LoginRequest {

    @Schema(example = "ravindranadhseelam@gmail.com")
    @Email
    @NotBlank
    private String email;

    @Schema(example = "Ravi@0998")
    @NotBlank
    private String password;
}