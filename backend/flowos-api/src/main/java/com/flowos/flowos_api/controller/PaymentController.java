package com.flowos.flowos_api.controller;

import com.flowos.flowos_api.dto.CreatePaymentRequest;
import com.flowos.flowos_api.dto.PaymentResponse;
import com.flowos.flowos_api.dto.UpdatePaymentRequest;
import com.flowos.flowos_api.enums.PaymentStatus;
import com.flowos.flowos_api.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public PaymentResponse createPayment(
            @RequestBody CreatePaymentRequest request) {

        return paymentService.createPayment(request);
    }

    @PutMapping("/{id}")
    public PaymentResponse updatePayment(
            @PathVariable Long id,
            @RequestBody UpdatePaymentRequest request) {

        return paymentService.updatePayment(id, request);
    }

    @GetMapping("/{id}")
    public PaymentResponse getPayment(
            @PathVariable Long id) {

        return paymentService.getPayment(id);
    }

    @GetMapping
    public List<PaymentResponse> getAllPayments() {

        return paymentService.getAllPayments();
    }

    @GetMapping("/status/{status}")
    public List<PaymentResponse> getPaymentsByStatus(
            @PathVariable PaymentStatus status) {

        return paymentService.getPaymentsByStatus(status);
    }

    @GetMapping("/invoice/{invoiceId}")
    public List<PaymentResponse> getPaymentsByInvoice(
            @PathVariable Long invoiceId) {

        return paymentService.getPaymentsByInvoice(invoiceId);
    }

    @DeleteMapping("/{id}")
    public String deletePayment(
            @PathVariable Long id) {

        return paymentService.deletePayment(id);
    }
}