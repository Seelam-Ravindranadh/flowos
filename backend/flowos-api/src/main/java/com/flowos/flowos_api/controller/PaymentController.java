package com.flowos.flowos_api.controller;

import com.flowos.flowos_api.dto.CreatePaymentRequest;
import com.flowos.flowos_api.dto.PaymentResponse;
import com.flowos.flowos_api.dto.UpdatePaymentRequest;
import com.flowos.flowos_api.enums.PaymentStatus;
import com.flowos.flowos_api.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payment Lifecycle APIs")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @Operation(summary = "Record Payment & Trigger Invoice Lifecycle Reconciliation")
    public ResponseEntity<PaymentResponse> createPayment(@RequestBody CreatePaymentRequest request) {
        PaymentResponse response = paymentService.createPayment(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Payment & Recalculate Invoice Balances")
    public ResponseEntity<PaymentResponse> updatePayment(
            @PathVariable Long id,
            @RequestBody UpdatePaymentRequest request) {
        return ResponseEntity.ok(paymentService.updatePayment(id, request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Payment by ID")
    public ResponseEntity<PaymentResponse> getPayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPayment(id));
    }

    @GetMapping
    @Operation(summary = "Get All Payments or Filter by Company Tenant")
    public ResponseEntity<List<PaymentResponse>> getPayments(@RequestParam(required = false) Long companyId) {
        if (companyId != null) {
            return ResponseEntity.ok(paymentService.getPaymentsByCompany(companyId));
        }
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get Payments by Status")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByStatus(@PathVariable PaymentStatus status) {
        return ResponseEntity.ok(paymentService.getPaymentsByStatus(status));
    }

    @GetMapping("/invoice/{invoiceId}")
    @Operation(summary = "Get Payments for an Invoice")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByInvoice(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(paymentService.getPaymentsByInvoice(invoiceId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Payment & Revert Invoice Balance")
    public ResponseEntity<String> deletePayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.deletePayment(id));
    }
}