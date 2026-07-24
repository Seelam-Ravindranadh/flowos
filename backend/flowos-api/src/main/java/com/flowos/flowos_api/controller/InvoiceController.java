package com.flowos.flowos_api.controller;

import com.flowos.flowos_api.dto.CreateInvoiceRequest;
import com.flowos.flowos_api.dto.InvoiceResponse;
import com.flowos.flowos_api.dto.UpdateInvoiceRequest;
import com.flowos.flowos_api.enums.InvoiceStatus;
import com.flowos.flowos_api.service.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Invoice APIs", description = "Invoice Management APIs")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(
            InvoiceService invoiceService
    ) {
        this.invoiceService = invoiceService;
    }

    /**
     * Create Invoice
     */
    @Operation(summary = "Create Invoice")
    @PostMapping
    public InvoiceResponse createInvoice(
            @Valid
            @RequestBody
            CreateInvoiceRequest request
    ) {

        return invoiceService.createInvoice(request);
    }

    /**
     * Get Invoice By Id
     */
    @Operation(summary = "Get Invoice By Id")
    @GetMapping("/{id}")
    public InvoiceResponse getInvoice(
            @PathVariable Long id
    ) {

        return invoiceService.getInvoice(id);
    }

    /**
     * Get All Invoices
     */
    @Operation(summary = "Get All Invoices")
    @GetMapping
    public List<InvoiceResponse> getAllInvoices() {

        return invoiceService.getAllInvoices();
    }

    /**
     * Search Invoice
     */
    @Operation(summary = "Search Invoice By Invoice Number")
    @GetMapping("/search")
    public List<InvoiceResponse> searchInvoice(
            @RequestParam String invoiceNumber
    ) {

        return invoiceService.searchInvoice(invoiceNumber);
    }

    /**
     * Update Invoice
     */
    @Operation(summary = "Update Invoice")
    @PutMapping("/{id}")
    public InvoiceResponse updateInvoice(
            @PathVariable Long id,
            @Valid
            @RequestBody
            UpdateInvoiceRequest request
    ) {

        return invoiceService.updateInvoice(id, request);
    }

    /**
     * Delete Invoice
     */
    @Operation(summary = "Delete Invoice")
    @DeleteMapping("/{id}")
    public String deleteInvoice(
            @PathVariable Long id
    ) {

        return invoiceService.deleteInvoice(id);
    }

    /**
     * Filter By Status
     */
    @Operation(summary = "Get Invoices By Status")
    @GetMapping("/status/{status}")
    public List<InvoiceResponse> getInvoicesByStatus(
            @PathVariable InvoiceStatus status
    ) {

        return invoiceService.getInvoicesByStatus(status);
    }

    /**
     * Filter By Customer
     */
    @Operation(summary = "Get Invoices By Customer")
    @GetMapping("/customer/{customerId}")
    public List<InvoiceResponse> getInvoicesByCustomer(
            @PathVariable Long customerId
    ) {

        return invoiceService.getInvoicesByCustomer(customerId);
    }

    /**
     * Filter By Vendor
     */
    @Operation(summary = "Get Invoices By Vendor")
    @GetMapping("/vendor/{vendorId}")
    public List<InvoiceResponse> getInvoicesByVendor(
            @PathVariable Long vendorId
    ) {

        return invoiceService.getInvoicesByVendor(vendorId);
    }

}