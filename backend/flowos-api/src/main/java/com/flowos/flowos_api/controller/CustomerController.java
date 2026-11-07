package com.flowos.flowos_api.controller;

import com.flowos.flowos_api.dto.CreateCustomerRequest;
import com.flowos.flowos_api.dto.CustomerResponse;
import com.flowos.flowos_api.dto.UpdateCustomerRequest;
import com.flowos.flowos_api.enums.CustomerStatus;
import com.flowos.flowos_api.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@Tag(name = "Customer APIs", description = "Customer Management APIs")
public class CustomerController {

    private final CustomerService customerService;

    @Operation(summary = "Create Customer", description = "Creates a new customer in the system.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Customer created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "409", description = "Customer already exists")
    })
    @PostMapping
    public ResponseEntity<CustomerResponse> createCustomer(@Valid @RequestBody CreateCustomerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(customerService.createCustomer(request));
    }

    @Operation(summary = "Get All Customers")
    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @Operation(summary = "Get Customer By Id")
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomer(id));
    }

    @Operation(summary = "Update Customer")
    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCustomerRequest request) {
        return ResponseEntity.ok(customerService.updateCustomer(id, request));
    }

    @Operation(summary = "Delete Customer")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok("Customer deleted successfully");
    }

    @Operation(summary = "Search Customers By Name")
    @GetMapping("/search")
    public ResponseEntity<List<CustomerResponse>> searchCustomer(@RequestParam String name) {
        return ResponseEntity.ok(customerService.searchCustomer(name));
    }

    @Operation(summary = "Get Customers By Status")
    @GetMapping("/status")
    public ResponseEntity<List<CustomerResponse>> getCustomersByStatus(@RequestParam CustomerStatus status) {
        return ResponseEntity.ok(customerService.getCustomersByStatus(status));
    }
}