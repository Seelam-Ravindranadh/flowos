package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.*;
import com.flowos.flowos_api.entity.Invoice;
import com.flowos.flowos_api.entity.Payment;
import com.flowos.flowos_api.enums.InvoiceStatus;
import com.flowos.flowos_api.enums.PaymentStatus;
import com.flowos.flowos_api.exception.BadRequestException;
import com.flowos.flowos_api.exception.ResourceNotFoundException;
import com.flowos.flowos_api.repository.InvoiceRepository;
import com.flowos.flowos_api.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;

    /**
     * CREATE PAYMENT
     *
     * Payment is recorded against an invoice.
     * Invoice paidAmount, outstandingAmount and status
     * are automatically recalculated.
     */
    /* @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest request) {

        // 1. Validate payment number
        if (paymentRepository.existsByPaymentNumber(
                request.getPaymentNumber())) {

            throw new BadRequestException(
                    "Payment number already exists.");
        }

        // 2. Validate amount
        validatePaymentAmount(request.getAmount());

        // 3. Find invoice
        Invoice invoice = invoiceRepository.findById(
                        request.getInvoiceId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Invoice not found with id : "
                                        + request.getInvoiceId()));

        // 4. Validate invoice total
        if (invoice.getTotalAmount() == null) {
            throw new BadRequestException(
                    "Invoice total amount is not available.");
        }

        // 5. Get current paid amount
        BigDecimal currentPaidAmount =
                invoice.getPaidAmount() != null
                        ? invoice.getPaidAmount()
                        : BigDecimal.ZERO;

        // 6. Calculate current outstanding
        BigDecimal currentOutstanding =
                invoice.getTotalAmount()
                        .subtract(currentPaidAmount);

        if (currentOutstanding.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException(
                    "Invoice has invalid outstanding amount.");
        }

        // 7. Prevent overpayment
        if (request.getAmount()
                .compareTo(currentOutstanding) > 0) {

            throw new BadRequestException(
                    "Payment amount cannot be greater than "
                            + "invoice outstanding amount. "
                            + "Outstanding amount: "
                            + currentOutstanding);
        }

        // 8. Create payment
        Payment payment = Payment.builder()
                .paymentNumber(request.getPaymentNumber())
                .invoice(invoice)
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .paymentDate(
                        request.getPaymentDate() != null
                                ? request.getPaymentDate()
                                : LocalDate.now())
                .transactionReference(
                        request.getTransactionReference())
                .remarks(request.getRemarks())
                .status(PaymentStatus.SUCCESS)
                .build();

        // 9. Save payment
        Payment savedPayment =
                paymentRepository.save(payment);

        // 10. Update invoice
        updateInvoiceAfterPayment(
                invoice,
                request.getAmount(),
                savedPayment.getPaymentDate());

        invoiceRepository.save(invoice);

        return mapToResponse(savedPayment);
    }
       */
/*
    @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest request) {

        // 1. Validate payment number
        if (request.getPaymentNumber() == null ||
                request.getPaymentNumber().isBlank()) {

            throw new BadRequestException(
                    "Payment number is required.");
        }

        if (paymentRepository.existsByPaymentNumber(
                request.getPaymentNumber())) {

            throw new BadRequestException(
                    "Payment number already exists.");
        }

        // 2. Validate amount
        validatePaymentAmount(request.getAmount());

        // 3. Find invoice
        Invoice invoice = invoiceRepository.findById(
                        request.getInvoiceId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Invoice not found with id : "
                                        + request.getInvoiceId()));

        // 4. Validate invoice total
        if (invoice.getTotalAmount() == null) {

            throw new BadRequestException(
                    "Invoice total amount is not available.");
        }

        // 5. Calculate current paid amount
        BigDecimal currentPaidAmount =
                invoice.getPaidAmount() != null
                        ? invoice.getPaidAmount()
                        : BigDecimal.ZERO;

        // 6. Calculate actual outstanding amount
        BigDecimal currentOutstanding =
                invoice.getTotalAmount()
                        .subtract(currentPaidAmount);

        if (currentOutstanding.compareTo(BigDecimal.ZERO) < 0) {

            throw new BadRequestException(
                    "Invoice has invalid outstanding amount.");
        }

        // 7. Prevent overpayment
        if (request.getAmount()
                .compareTo(currentOutstanding) > 0) {

            throw new BadRequestException(
                    "Payment amount cannot exceed invoice "
                            + "outstanding amount. Outstanding amount: "
                            + currentOutstanding);
        }

        // 8. Payment date
        LocalDate paymentDate =
                request.getPaymentDate() != null
                        ? request.getPaymentDate()
                        : LocalDate.now();

        // 9. Create payment
        Payment payment = Payment.builder()
                .paymentNumber(request.getPaymentNumber())
                .invoice(invoice)
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .paymentDate(paymentDate)
                .transactionReference(
                        request.getTransactionReference())
                .remarks(request.getRemarks())
                .status(PaymentStatus.SUCCESS)
                .build();

        // 10. Save payment
        Payment savedPayment =
                paymentRepository.save(payment);

        // 11. Recalculate invoice
        BigDecimal newPaidAmount =
                currentPaidAmount.add(request.getAmount());

        updateInvoiceAmountsAndStatus(
                invoice,
                newPaidAmount,
                paymentDate);

        // 12. Save invoice
        invoiceRepository.save(invoice);

        return mapToResponse(savedPayment);
    } */
    @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest request) {

        // 1. Validate payment number
        if (paymentRepository.existsByPaymentNumber(
                request.getPaymentNumber())) {

            throw new BadRequestException(
                    "Payment number already exists.");
        }

        // 2. Validate payment amount
        validatePaymentAmount(request.getAmount());

        // 3. Find invoice
        Invoice invoice = invoiceRepository.findById(
                request.getInvoiceId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Invoice not found with id : "
                                + request.getInvoiceId()));

        // 4. Validate invoice total
        if (invoice.getTotalAmount() == null) {

            throw new BadRequestException(
                    "Invoice total amount is not available.");
        }

        // 5. Current paid amount
        BigDecimal currentPaidAmount =
                invoice.getPaidAmount() != null
                        ? invoice.getPaidAmount()
                        : BigDecimal.ZERO;

        // 6. Calculate current outstanding
        BigDecimal currentOutstanding =
                invoice.getTotalAmount()
                        .subtract(currentPaidAmount);

        // 7. Validate invoice data
        if (currentOutstanding.compareTo(BigDecimal.ZERO) < 0) {

            throw new BadRequestException(
                    "Invoice has invalid outstanding amount.");
        }

        // 8. Prevent overpayment
        if (request.getAmount()
                .compareTo(currentOutstanding) > 0) {

            throw new BadRequestException(
                    "Payment amount cannot exceed "
                            + "invoice outstanding amount. "
                            + "Outstanding amount: "
                            + currentOutstanding);
        }

        // 9. Payment date
        LocalDate paymentDate =
                request.getPaymentDate() != null
                        ? request.getPaymentDate()
                        : LocalDate.now();

        // 10. Create payment
        Payment payment = Payment.builder()
                .paymentNumber(request.getPaymentNumber())
                .invoice(invoice)
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .paymentDate(paymentDate)
                .transactionReference(
                        request.getTransactionReference())
                .remarks(request.getRemarks())
                .status(PaymentStatus.SUCCESS)
                .build();

        // 11. Save payment
        Payment savedPayment =
                paymentRepository.save(payment);

        // 12. Calculate new paid amount
        BigDecimal newPaidAmount =
                currentPaidAmount
                        .add(request.getAmount());

        // 13. Update invoice atomically
        updateInvoiceAmountsAndStatus(
                invoice,
                newPaidAmount,
                paymentDate);

        // 14. Save invoice
        invoiceRepository.save(invoice);

        // 15. Return response
        return mapToResponse(savedPayment);
    }
    /**
     * UPDATE PAYMENT
     *
     * Important:
     * The old payment amount is first removed from the invoice
     * and the new payment amount is then applied.
     */
    @Transactional
    public PaymentResponse updatePayment(
            Long id,
            UpdatePaymentRequest request) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found with id : "
                                        + id));

        validatePaymentAmount(request.getAmount());

        Invoice invoice = payment.getInvoice();

        BigDecimal oldPaymentAmount =
                payment.getAmount() != null
                        ? payment.getAmount()
                        : BigDecimal.ZERO;

        BigDecimal currentPaidAmount =
                invoice.getPaidAmount() != null
                        ? invoice.getPaidAmount()
                        : BigDecimal.ZERO;

        /*
         * Remove old payment from invoice.
         */
        BigDecimal paidAfterRemovingOldPayment =
                currentPaidAmount.subtract(
                        oldPaymentAmount);

        if (paidAfterRemovingOldPayment
                .compareTo(BigDecimal.ZERO) < 0) {

            paidAfterRemovingOldPayment =
                    BigDecimal.ZERO;
        }

        /*
         * Calculate available outstanding after
         * removing old payment.
         */
        BigDecimal availableOutstanding =
                invoice.getTotalAmount()
                        .subtract(
                                paidAfterRemovingOldPayment);

        /*
         * Prevent overpayment.
         */
        if (request.getAmount()
                .compareTo(availableOutstanding) > 0) {

            throw new BadRequestException(
                    "Updated payment amount cannot be "
                            + "greater than invoice outstanding amount. "
                            + "Available amount: "
                            + availableOutstanding);
        }

        /*
         * Update payment.
         */
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(
                request.getPaymentMethod());
        payment.setStatus(request.getStatus());
        payment.setPaymentDate(
                request.getPaymentDate());
        payment.setTransactionReference(
                request.getTransactionReference());
        payment.setRemarks(
                request.getRemarks());

        Payment updatedPayment =
                paymentRepository.save(payment);

        /*
         * Recalculate invoice.
         */
        BigDecimal newPaidAmount =
                paidAfterRemovingOldPayment
                        .add(request.getAmount());

        updateInvoiceAmountsAndStatus(
                invoice,
                newPaidAmount,
                request.getPaymentDate());

        invoiceRepository.save(invoice);

        return mapToResponse(updatedPayment);
    }

    /**
     * GET PAYMENT
     */
    public PaymentResponse getPayment(Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found with id : "
                                        + id));

        return mapToResponse(payment);
    }

    /**
     * GET ALL PAYMENTS
     */
    public List<PaymentResponse> getAllPayments() {

        return paymentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * GET PAYMENTS BY STATUS
     */
    public List<PaymentResponse> getPaymentsByStatus(
            PaymentStatus status) {

        return paymentRepository
                .findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * GET PAYMENTS BY INVOICE
     */
    public List<PaymentResponse> getPaymentsByInvoice(
            Long invoiceId) {

        if (!invoiceRepository.existsById(invoiceId)) {

            throw new ResourceNotFoundException(
                    "Invoice not found with id : "
                            + invoiceId);
        }

        return paymentRepository
                .findByInvoiceId(invoiceId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * DELETE PAYMENT
     *
     * When a payment is deleted, the invoice is recalculated.
     */
    @Transactional
    public String deletePayment(Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found with id : "
                                        + id));

        Invoice invoice = payment.getInvoice();

        BigDecimal paymentAmount =
                payment.getAmount() != null
                        ? payment.getAmount()
                        : BigDecimal.ZERO;

        BigDecimal currentPaidAmount =
                invoice.getPaidAmount() != null
                        ? invoice.getPaidAmount()
                        : BigDecimal.ZERO;

        /*
         * Remove deleted payment.
         */
        BigDecimal newPaidAmount =
                currentPaidAmount
                        .subtract(paymentAmount);

        if (newPaidAmount.compareTo(BigDecimal.ZERO) < 0) {
            newPaidAmount = BigDecimal.ZERO;
        }

        paymentRepository.delete(payment);

        /*
         * Recalculate invoice.
         */
        updateInvoiceAmountsAndStatus(
                invoice,
                newPaidAmount,
                null);

        invoiceRepository.save(invoice);

        return "Payment deleted successfully.";
    }

    /**
     * Update invoice after creating a payment.
     */
    private void updateInvoiceAfterPayment(
            Invoice invoice,
            BigDecimal paymentAmount,
            LocalDate paymentDate) {

        BigDecimal currentPaidAmount =
                invoice.getPaidAmount() != null
                        ? invoice.getPaidAmount()
                        : BigDecimal.ZERO;

        BigDecimal newPaidAmount =
                currentPaidAmount
                        .add(paymentAmount);

        updateInvoiceAmountsAndStatus(
                invoice,
                newPaidAmount,
                paymentDate);
    }

    /**
     * Recalculate invoice financial values.
     */
    private void updateInvoiceAmountsAndStatus(
            Invoice invoice,
            BigDecimal paidAmount,
            LocalDate paymentDate) {

        if (invoice.getTotalAmount() == null) {
            throw new BadRequestException(
                    "Invoice total amount is not available.");
        }

        if (paidAmount == null ||
                paidAmount.compareTo(BigDecimal.ZERO) < 0) {

            throw new BadRequestException(
                    "Paid amount cannot be negative.");
        }

        BigDecimal totalAmount =
                invoice.getTotalAmount();

        BigDecimal outstandingAmount =
                totalAmount.subtract(paidAmount);

        if (outstandingAmount.compareTo(BigDecimal.ZERO) < 0) {

            throw new BadRequestException(
                    "Outstanding amount cannot be negative.");
        }

        invoice.setPaidAmount(paidAmount);
        invoice.setOutstandingAmount(outstandingAmount);

        // Fully paid
        if (outstandingAmount.compareTo(BigDecimal.ZERO) == 0) {

            invoice.setStatus(InvoiceStatus.PAID);
            invoice.setPaidDate(paymentDate);

            // Partially paid
        } else if (paidAmount.compareTo(BigDecimal.ZERO) > 0) {

            invoice.setStatus(InvoiceStatus.PARTIALLY_PAID);
            invoice.setPaidDate(null);

            // Not paid
        } else {

            if (invoice.getStatus() != InvoiceStatus.CANCELLED) {
                invoice.setStatus(InvoiceStatus.SENT);
            }

            invoice.setPaidDate(null);
        }
    }

    /**
     * Validate payment amount.
     */
    private void validatePaymentAmount(
            BigDecimal amount) {

        if (amount == null) {

            throw new BadRequestException(
                    "Payment amount is required.");
        }

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new BadRequestException(
                    "Payment amount must be greater than zero.");
        }
    }

    /**
     * Entity -> DTO
     */
    private PaymentResponse mapToResponse(
            Payment payment) {

        return PaymentResponse.builder()
                .id(payment.getId())
                .paymentNumber(
                        payment.getPaymentNumber())
                .invoiceId(
                        payment.getInvoice().getId())
                .invoiceNumber(
                        payment.getInvoice()
                                .getInvoiceNumber())
                .amount(payment.getAmount())
                .paymentMethod(
                        payment.getPaymentMethod())
                .status(payment.getStatus())
                .paymentDate(
                        payment.getPaymentDate())
                .transactionReference(
                        payment.getTransactionReference())
                .remarks(payment.getRemarks())
                .build();
    }
}