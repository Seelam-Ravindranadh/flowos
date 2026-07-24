package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.CreateVendorRequest;
import com.flowos.flowos_api.dto.UpdateVendorRequest;
import com.flowos.flowos_api.dto.VendorResponse;
import com.flowos.flowos_api.entity.Vendor;
import com.flowos.flowos_api.enums.VendorCategory;
import com.flowos.flowos_api.enums.VendorStatus;
import com.flowos.flowos_api.exception.BadRequestException;
import com.flowos.flowos_api.exception.ResourceNotFoundException;
import com.flowos.flowos_api.repository.VendorRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class VendorService {

    private final VendorRepository vendorRepository;

    public VendorService(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    /**
     * Create Vendor
     */
    public VendorResponse createVendor(CreateVendorRequest request) {

        log.info("Creating vendor with email: {}", request.getEmail());

        if (vendorRepository.existsByEmail(request.getEmail())) {

            log.warn("Vendor already exists: {}", request.getEmail());

            throw new BadRequestException(
                    "Vendor already exists with this email.");
        }

        Vendor vendor = new Vendor();

        vendor.setVendorName(request.getVendorName());
        vendor.setEmail(request.getEmail());
        vendor.setPhone(request.getPhone());
        vendor.setCompany(request.getCompany());
        vendor.setAddress(request.getAddress());
        vendor.setGstNumber(request.getGstNumber());

        vendor.setCategory(request.getCategory());
        vendor.setStatus(VendorStatus.ACTIVE);

        vendor.setCreatedAt(LocalDateTime.now());
        vendor.setUpdatedAt(LocalDateTime.now());

        Vendor savedVendor = vendorRepository.save(vendor);

        log.info("Vendor created successfully: {}",
                savedVendor.getEmail());

        return mapToResponse(savedVendor);
    }

    /**
     * Get All Vendors
     */
    public List<VendorResponse> getAllVendors() {

        return vendorRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Get Vendor By Id
     */
    public VendorResponse getVendor(Long id) {

        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vendor not found"));

        return mapToResponse(vendor);
    }

    /**
     * Update Vendor
     */
    public VendorResponse updateVendor(
            Long id,
            UpdateVendorRequest request) {

        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vendor not found"));

        vendor.setVendorName(request.getVendorName());
        vendor.setPhone(request.getPhone());
        vendor.setCompany(request.getCompany());
        vendor.setAddress(request.getAddress());
        vendor.setGstNumber(request.getGstNumber());

        vendor.setCategory(request.getCategory());
        vendor.setStatus(request.getStatus());

        vendor.setUpdatedAt(LocalDateTime.now());

        Vendor updatedVendor = vendorRepository.save(vendor);

        log.info("Vendor updated successfully: {}",
                updatedVendor.getEmail());

        return mapToResponse(updatedVendor);
    }

    /**
     * Delete Vendor
     */
    public String deleteVendor(Long id) {

        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vendor not found"));

        vendorRepository.delete(vendor);

        log.info("Vendor deleted successfully: {}",
                vendor.getEmail());

        return "Vendor deleted successfully";
    }

    /**
     * Search Vendor
     */
    public List<VendorResponse> searchVendor(String name) {

        return vendorRepository
                .findByVendorNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Vendors By Status
     */
    public List<VendorResponse> getVendorsByStatus(
            VendorStatus status) {

        return vendorRepository
                .findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Vendors By Category
     */
    public List<VendorResponse> getVendorsByCategory(
            VendorCategory category) {

        return vendorRepository
                .findByCategory(category)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Entity -> DTO
     */
    private VendorResponse mapToResponse(Vendor vendor) {

        VendorResponse response = new VendorResponse();

        response.setId(vendor.getId());
        response.setVendorName(vendor.getVendorName());
        response.setEmail(vendor.getEmail());
        response.setPhone(vendor.getPhone());
        response.setCompany(vendor.getCompany());
        response.setAddress(vendor.getAddress());
        response.setGstNumber(vendor.getGstNumber());
        response.setCategory(vendor.getCategory());
        response.setStatus(vendor.getStatus());

        return response;
    }
}