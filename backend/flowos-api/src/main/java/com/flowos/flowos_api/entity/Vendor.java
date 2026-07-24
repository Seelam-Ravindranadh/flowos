package com.flowos.flowos_api.entity;

import com.flowos.flowos_api.enums.VendorCategory;
import com.flowos.flowos_api.enums.VendorStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "vendors")
@Getter
@Setter
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vendorName;

    @Column(unique = true)
    private String email;

    private String phone;

    private String company;

    private String address;

    private String gstNumber;

    @Enumerated(EnumType.STRING)
    private VendorCategory category;

    @Enumerated(EnumType.STRING)
    private VendorStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}