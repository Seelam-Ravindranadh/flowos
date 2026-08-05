package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.*;
import com.flowos.flowos_api.entity.Invoice;
import com.flowos.flowos_api.entity.Payment;
import com.flowos.flowos_api.enums.PaymentStatus;
import com.flowos.flowos_api.exception.BadRequestException;
import com.flowos.flowos_api.exception.ResourceNotFoundException;
import com.flowos.flowos_api.repository.InvoiceRepository;
import com.flowos.flowos_api.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;

    public PaymentResponse createPayment(CreatePaymentRequest request) {

        if (paymentRepository.existsByPaymentNumber(request.getPaymentNumber())) {
            throw new BadRequestException("Payment number already exists.");
        }

        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));

        Payment payment = Payment.builder()
                .paymentNumber(request.getPaymentNumber())
                .invoice(invoice)
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .paymentDate(request.getPaymentDate())
                .transactionReference(request.getTransactionReference())
                .remarks(request.getRemarks())
                .status(PaymentStatus.SUCCESS)
                .build();

        return mapToResponse(paymentRepository.save(payment));
    }

    public PaymentResponse updatePayment(Long id, UpdatePaymentRequest request) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setStatus(request.getStatus());
        payment.setPaymentDate(request.getPaymentDate());
        payment.setTransactionReference(request.getTransactionReference());
        payment.setRemarks(request.getRemarks());

        return mapToResponse(paymentRepository.save(payment));
    }

    public PaymentResponse getPayment(Long id) {

        return mapToResponse(paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found")));
    }

    public List<PaymentResponse> getAllPayments() {

        return paymentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<PaymentResponse> getPaymentsByStatus(PaymentStatus status) {

        return paymentRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public String deletePayment(Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        paymentRepository.delete(payment);

        return "Payment deleted successfully.";
    }

    private PaymentResponse mapToResponse(Payment payment) {

        return PaymentResponse.builder()
                .id(payment.getId())
                .paymentNumber(payment.getPaymentNumber())
                .invoiceId(payment.getInvoice().getId())
                .invoiceNumber(payment.getInvoice().getInvoiceNumber())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .paymentDate(payment.getPaymentDate())
                .transactionReference(payment.getTransactionReference())
                .remarks(payment.getRemarks())
                .build();
    }
}