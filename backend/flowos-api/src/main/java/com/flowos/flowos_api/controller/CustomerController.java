package com.flowos.flowos_api.controller;

import com.flowos.flowos_api.dto.CreateCustomerRequest;
import com.flowos.flowos_api.dto.CustomerResponse;
import com.flowos.flowos_api.dto.UpdateCustomerRequest;
import com.flowos.flowos_api.enums.CustomerStatus;
import com.flowos.flowos_api.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Customer APIs", description = "Customer Management APIs")
public class CustomerController {

    private final CustomerService customerService;

    /**
     * Create Customer
     */
    @Operation(summary = "Create Customer")
    @PostMapping
    public CustomerResponse createCustomer(
            @Valid @RequestBody CreateCustomerRequest request) {

        return customerService.createCustomer(request);
    }

    /**
     * Get All Customers
     */
    @Operation(summary = "Get All Customers")
    @GetMapping
    public List<CustomerResponse> getAllCustomers() {

        return customerService.getAllCustomers();
    }

    /**
     * Get Customer By Id
     */
    @Operation(summary = "Get Customer By Id")
    @GetMapping("/{id}")
    public CustomerResponse getCustomer(
            @PathVariable Long id) {

        return customerService.getCustomer(id);
    }

    /**
     * Update Customer
     */
    @Operation(summary = "Update Customer")
    @PutMapping("/{id}")
    public CustomerResponse updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCustomerRequest request) {

        return customerService.updateCustomer(id, request);
    }

    /**
     * Delete Customer
     */
    @Operation(summary = "Delete Customer")
    @DeleteMapping("/{id}")
    public String deleteCustomer(
            @PathVariable Long id) {

        return customerService.deleteCustomer(id);
    }

    /**
     * Search Customers
     */
    @Operation(summary = "Search Customers By Name")
    @GetMapping("/search")
    public List<CustomerResponse> searchCustomer(
            @RequestParam String name) {

        return customerService.searchCustomer(name);
    }

    /**
     * Customers By Status
     */
    @Operation(summary = "Get Customers By Status")
    @GetMapping("/status")
    public List<CustomerResponse> getCustomersByStatus(
            @RequestParam CustomerStatus status) {

        return customerService.getCustomersByStatus(status);
    }

}