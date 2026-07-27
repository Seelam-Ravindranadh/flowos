package com.flowos.flowos_api.dto;

import com.flowos.flowos_api.enums.CustomerStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "Customer Response")
public class CustomerResponse {

    @Schema(example = "1")
    private Long id;

    @Schema(example = "John Smith")
    private String customerName;

    @Schema(example = "john@gmail.com")
    private String email;

    @Schema(example = "9876543210")
    private String phone;

    @Schema(example = "ABC Technologies")
    private String company;

    @Schema(example = "Hyderabad")
    private String address;

    @Schema(example = "29ABCDE1234F1Z5")
    private String gstNumber;

    @Schema(example = "ACTIVE")
    private CustomerStatus status;

    @Schema(example = "2026-07-27T10:30:00")
    private LocalDateTime createdAt;

    @Schema(example = "2026-07-27T10:30:00")
    private LocalDateTime updatedAt;
}