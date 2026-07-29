package com.flowos.flowos_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "User Registration Request")
public class RegisterRequest {

    @Schema(example = "Ravindranadh")
    @NotBlank
    private String firstName;

    @Schema(example = "Seelam")
    @NotBlank
    private String lastName;

    @Schema(example = "ravindranadhseelam@gmail.com")
    @Email
    @NotBlank
    private String email;

    @Schema(example = "USER")
    @NotBlank
    private String role;

    @Schema(example = "Ravi@0998")
    @Size(min = 8)
    @NotBlank
    private String password;
}