package com.flowos.flowos_api.controller;

import com.flowos.flowos_api.dto.CreateVendorRequest;
import com.flowos.flowos_api.dto.UpdateVendorRequest;
import com.flowos.flowos_api.dto.VendorResponse;
import com.flowos.flowos_api.enums.VendorCategory;
import com.flowos.flowos_api.enums.VendorStatus;
import com.flowos.flowos_api.service.VendorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
@Tag(name = "Vendor APIs")
public class VendorController {

    private final VendorService vendorService;

    @Operation(summary = "Create Vendor")
    @PostMapping
    public VendorResponse createVendor(
            @Valid @RequestBody CreateVendorRequest request) {

        return vendorService.createVendor(request);
    }

    @Operation(summary = "Get All Vendors")
    @GetMapping
    public List<VendorResponse> getAllVendors() {

        return vendorService.getAllVendors();
    }

    @Operation(summary = "Get Vendor By Id")
    @GetMapping("/{id}")
    public VendorResponse getVendor(
            @PathVariable Long id) {

        return vendorService.getVendor(id);
    }

    @Operation(summary = "Update Vendor")
    @PutMapping("/{id}")
    public VendorResponse updateVendor(
            @PathVariable Long id,
            @RequestBody UpdateVendorRequest request) {

        return vendorService.updateVendor(id, request);
    }

    @Operation(summary = "Delete Vendor")
    @DeleteMapping("/{id}")
    public String deleteVendor(
            @PathVariable Long id) {

        return vendorService.deleteVendor(id);
    }

    @Operation(summary = "Search Vendors")
    @GetMapping("/search")
    public List<VendorResponse> searchVendor(
            @RequestParam String name) {

        return vendorService.searchVendor(name);
    }

    @Operation(summary = "Get Vendors By Status")
    @GetMapping("/status")
    public List<VendorResponse> getByStatus(
            @RequestParam VendorStatus status) {

        return vendorService.getVendorsByStatus(status);
    }

    @Operation(summary = "Get Vendors By Category")
    @GetMapping("/category")
    public List<VendorResponse> getByCategory(
            @RequestParam VendorCategory category) {

        return vendorService.getVendorsByCategory(category);
    }
}