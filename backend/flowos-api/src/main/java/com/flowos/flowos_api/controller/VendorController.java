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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
@Tag(name = "Vendor APIs", description = "Vendor Management APIs")
public class VendorController {

    private final VendorService vendorService;

    @Operation(summary = "Create Vendor")
    @PostMapping
    public ResponseEntity<VendorResponse> createVendor(@Valid @RequestBody CreateVendorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vendorService.createVendor(request));
    }

    @Operation(summary = "Get All Vendors")
    @GetMapping
    public ResponseEntity<List<VendorResponse>> getAllVendors() {
        return ResponseEntity.ok(vendorService.getAllVendors());
    }

    @Operation(summary = "Get Vendor By Id")
    @GetMapping("/{id}")
    public ResponseEntity<VendorResponse> getVendor(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getVendor(id));
    }

    @Operation(summary = "Update Vendor")
    @PutMapping("/{id}")
    public ResponseEntity<VendorResponse> updateVendor(
            @PathVariable Long id,
            @Valid @RequestBody UpdateVendorRequest request) {
        return ResponseEntity.ok(vendorService.updateVendor(id, request));
    }

    @Operation(summary = "Delete Vendor")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVendor(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.deleteVendor(id));
    }

    @Operation(summary = "Search Vendors")
    @GetMapping("/search")
    public ResponseEntity<List<VendorResponse>> searchVendor(@RequestParam String name) {
        return ResponseEntity.ok(vendorService.searchVendor(name));
    }

    @Operation(summary = "Get Vendors By Status")
    @GetMapping("/status")
    public ResponseEntity<List<VendorResponse>> getByStatus(@RequestParam VendorStatus status) {
        return ResponseEntity.ok(vendorService.getVendorsByStatus(status));
    }

    @Operation(summary = "Get Vendors By Category")
    @GetMapping("/category")
    public ResponseEntity<List<VendorResponse>> getByCategory(@RequestParam VendorCategory category) {
        return ResponseEntity.ok(vendorService.getVendorsByCategory(category));
    }
}