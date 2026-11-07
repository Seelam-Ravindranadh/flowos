package com.flowos.flowos_api.controller;

import com.flowos.flowos_api.dto.CreateInvoiceRequest;
import com.flowos.flowos_api.dto.InvoiceResponse;
import com.flowos.flowos_api.dto.UpdateInvoiceRequest;
import com.flowos.flowos_api.enums.InvoiceStatus;
import com.flowos.flowos_api.service.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/invoices")
@Tag(name = "Invoice APIs", description = "Invoice Management & Accounts Receivable APIs")
public class InvoiceController {

    private final InvoiceService invoiceService;

    /**
     * Create Invoice (Returns HTTP 201 Created)
     */
    @Operation(summary = "Create Invoice")
    @PostMapping
    public ResponseEntity<InvoiceResponse> createInvoice(
            @Valid @RequestBody CreateInvoiceRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invoiceService.createInvoice(request));
    }

    /**
     * Get Invoice By Id
     */
    @Operation(summary = "Get Invoice By Id")
    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponse> getInvoice(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(invoiceService.getInvoice(id));
    }

    /**
     * Get All Invoices (Optionally filtered by company tenant)
     */
    @Operation(summary = "Get All Invoices")
    @GetMapping
    public ResponseEntity<List<InvoiceResponse>> getAllInvoices(
            @RequestParam(required = false) Long companyId
    ) {
        return ResponseEntity.ok(invoiceService.getAllInvoices(companyId));
    }

    /**
     * Search Invoice By Number
     */
    @Operation(summary = "Search Invoice By Invoice Number")
    @GetMapping("/search")
    public ResponseEntity<List<InvoiceResponse>> searchInvoice(
            @RequestParam String invoiceNumber
    ) {
        return ResponseEntity.ok(invoiceService.searchInvoice(invoiceNumber));
    }

    /**
     * Update Invoice
     */
    @Operation(summary = "Update Invoice")
    @PutMapping("/{id}")
    public ResponseEntity<InvoiceResponse> updateInvoice(
            @PathVariable Long id,
            @Valid @RequestBody UpdateInvoiceRequest request
    ) {
        return ResponseEntity.ok(invoiceService.updateInvoice(id, request));
    }

    /**
     * Delete Invoice
     */
    @Operation(summary = "Delete Invoice")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInvoice(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(invoiceService.deleteInvoice(id));
    }

    /**
     * Filter By Status
     */
    @Operation(summary = "Get Invoices By Status")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<InvoiceResponse>> getInvoicesByStatus(
            @PathVariable InvoiceStatus status
    ) {
        return ResponseEntity.ok(invoiceService.getInvoicesByStatus(status));
    }

    /**
     * Filter By Customer
     */
    @Operation(summary = "Get Invoices By Customer")
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<InvoiceResponse>> getInvoicesByCustomer(
            @PathVariable Long customerId
    ) {
        return ResponseEntity.ok(invoiceService.getInvoicesByCustomer(customerId));
    }

    /**
     * Filter By Vendor
     */
    @Operation(summary = "Get Invoices By Vendor")
    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<InvoiceResponse>> getInvoicesByVendor(
            @PathVariable Long vendorId
    ) {
        return ResponseEntity.ok(invoiceService.getInvoicesByVendor(vendorId));
    }
}