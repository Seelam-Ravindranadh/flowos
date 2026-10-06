package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.CreatePaymentRequest;
import com.flowos.flowos_api.dto.PaymentResponse;
import com.flowos.flowos_api.dto.UpdatePaymentRequest;
import com.flowos.flowos_api.entity.Company;
import com.flowos.flowos_api.entity.Invoice;
import com.flowos.flowos_api.entity.Payment;
import com.flowos.flowos_api.enums.InvoiceStatus;
import com.flowos.flowos_api.enums.PaymentStatus;
import com.flowos.flowos_api.exception.BadRequestException;
import com.flowos.flowos_api.exception.ResourceNotFoundException;
import com.flowos.flowos_api.repository.CompanyRepository;
import com.flowos.flowos_api.repository.InvoiceRepository;
import com.flowos.flowos_api.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final CompanyRepository companyRepository;

    /**
     * CREATE PAYMENT - P0.8 Lifecycle Engine
     * 1. Validates payment amount and invoice existence.
     * 2. Enforces multi-tenancy: assigns the payment to the invoice's company.
     * 3. Prevents overpayment against invoice outstanding balance.
     * 4. Updates invoice paidAmount, outstandingAmount, paidDate, and status atomically.
     * 5. Saves Payment and Invoice within a single transactional boundary.
     */
    @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest request) {

        // 1. Validate payment amount
        validatePaymentAmount(request.getAmount());

        // 2. Fetch target invoice
        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Invoice not found with id: " + request.getInvoiceId()));

        // 3. Multi-tenancy integrity check
        Company company = invoice.getCompany();
        if (company == null) {
            // Fallback to seeded tenant if invoice was created before foreign key backfill
            company = companyRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new BadRequestException("No company tenant found to bind payment"));
            invoice.setCompany(company);
        }

        if (request.getCompanyId() != null && !request.getCompanyId().equals(company.getId())) {
            throw new BadRequestException("Supplied company ID (" + request.getCompanyId()
                    + ") does not match Invoice tenant company ID (" + company.getId() + ")");
        }

        // 4. Generate or validate unique payment number
        String paymentNumber = request.getPaymentNumber();
        if (paymentNumber == null || paymentNumber.isBlank()) {
            paymentNumber = "PAY-" + System.currentTimeMillis();
        } else if (paymentRepository.existsByPaymentNumber(paymentNumber)) {
            throw new BadRequestException("Payment number already exists: " + paymentNumber);
        }

        // 5. Calculate current financial state of invoice
        if (invoice.getTotalAmount() == null) {
            throw new BadRequestException("Invoice total amount is not initialized.");
        }

        BigDecimal currentPaidAmount = invoice.getPaidAmount() != null
                ? invoice.getPaidAmount()
                : BigDecimal.ZERO;

        BigDecimal currentOutstanding = invoice.getOutstandingAmount() != null
                ? invoice.getOutstandingAmount()
                : invoice.getTotalAmount().subtract(currentPaidAmount);

        if (currentOutstanding.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Invoice has an invalid negative outstanding amount: " + currentOutstanding);
        }

        // 6. Overpayment prevention
        if (request.getAmount().compareTo(currentOutstanding) > 0) {
            throw new BadRequestException(String.format(
                    "Payment amount (%.2f) exceeds invoice outstanding balance (%.2f)",
                    request.getAmount().doubleValue(), currentOutstanding.doubleValue()));
        }

        // 7. Resolve payment date
        LocalDate paymentDate = request.getPaymentDate() != null
                ? request.getPaymentDate()
                : LocalDate.now();

        // 8. Build and persist Payment entity
        Payment payment = Payment.builder()
                .paymentNumber(paymentNumber)
                .company(company)
                .invoice(invoice)
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .status(PaymentStatus.SUCCESS)
                .paymentDate(paymentDate)
                .transactionReference(request.getTransactionReference() != null && !request.getTransactionReference().isBlank()
                        ? request.getTransactionReference()
                        : "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .remarks(request.getRemarks())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        // 9. Atomically recalculate and persist Invoice state
        BigDecimal newPaidAmount = currentPaidAmount.add(request.getAmount());
        updateInvoiceAmountsAndStatus(invoice, newPaidAmount, paymentDate);
        invoiceRepository.save(invoice);

        log.info("Payment {} processed: Amount {}, Invoice {}, Status {}",
                savedPayment.getPaymentNumber(), savedPayment.getAmount(),
                invoice.getInvoiceNumber(), invoice.getStatus());

        return mapToResponse(savedPayment);
    }

    /**
     * UPDATE PAYMENT
     * Replaces previous payment value, rolling back its impact on the invoice before applying new amount.
     */
    @Transactional
    public PaymentResponse updatePayment(Long id, UpdatePaymentRequest request) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        validatePaymentAmount(request.getAmount());

        Invoice invoice = payment.getInvoice();
        if (invoice == null) {
            throw new BadRequestException("Payment is not bound to a valid invoice");
        }

        BigDecimal oldPaymentAmount = payment.getAmount() != null ? payment.getAmount() : BigDecimal.ZERO;
        BigDecimal currentPaidAmount = invoice.getPaidAmount() != null ? invoice.getPaidAmount() : BigDecimal.ZERO;

        BigDecimal paidAfterRollback = currentPaidAmount.subtract(oldPaymentAmount);
        if (paidAfterRollback.compareTo(BigDecimal.ZERO) < 0) {
            paidAfterRollback = BigDecimal.ZERO;
        }

        BigDecimal availableOutstanding = invoice.getTotalAmount().subtract(paidAfterRollback);

        if (request.getAmount().compareTo(availableOutstanding) > 0) {
            throw new BadRequestException("Updated payment amount (" + request.getAmount()
                    + ") exceeds available invoice outstanding balance (" + availableOutstanding + ")");
        }

        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setStatus(request.getStatus());
        payment.setPaymentDate(request.getPaymentDate() != null ? request.getPaymentDate() : LocalDate.now());
        payment.setTransactionReference(request.getTransactionReference());
        payment.setRemarks(request.getRemarks());

        Payment updatedPayment = paymentRepository.save(payment);

        BigDecimal newPaidAmount = paidAfterRollback.add(request.getAmount());
        updateInvoiceAmountsAndStatus(invoice, newPaidAmount, updatedPayment.getPaymentDate());
        invoiceRepository.save(invoice);

        return mapToResponse(updatedPayment);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        return mapToResponse(payment);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByCompany(Long companyId) {
        return paymentRepository.findByCompanyIdAndStatus(companyId, PaymentStatus.SUCCESS).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByStatus(PaymentStatus status) {
        return paymentRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByInvoice(Long invoiceId) {
        if (!invoiceRepository.existsById(invoiceId)) {
            throw new ResourceNotFoundException("Invoice not found with id: " + invoiceId);
        }
        return paymentRepository.findByInvoiceId(invoiceId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public String deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        Invoice invoice = payment.getInvoice();
        BigDecimal paymentAmount = payment.getAmount() != null ? payment.getAmount() : BigDecimal.ZERO;
        BigDecimal currentPaidAmount = invoice.getPaidAmount() != null ? invoice.getPaidAmount() : BigDecimal.ZERO;

        BigDecimal newPaidAmount = currentPaidAmount.subtract(paymentAmount);
        if (newPaidAmount.compareTo(BigDecimal.ZERO) < 0) {
            newPaidAmount = BigDecimal.ZERO;
        }

        paymentRepository.delete(payment);
        updateInvoiceAmountsAndStatus(invoice, newPaidAmount, null);
        invoiceRepository.save(invoice);

        return "Payment deleted successfully.";
    }

    private void updateInvoiceAmountsAndStatus(Invoice invoice, BigDecimal paidAmount, LocalDate paymentDate) {
        BigDecimal totalAmount = invoice.getTotalAmount();
        BigDecimal outstandingAmount = totalAmount.subtract(paidAmount);

        if (outstandingAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Calculated outstanding balance cannot be negative.");
        }

        invoice.setPaidAmount(paidAmount);
        invoice.setOutstandingAmount(outstandingAmount);

        if (outstandingAmount.compareTo(BigDecimal.ZERO) == 0) {
            invoice.setStatus(InvoiceStatus.PAID);
            invoice.setPaidDate(paymentDate);
        } else if (paidAmount.compareTo(BigDecimal.ZERO) > 0) {
            invoice.setStatus(InvoiceStatus.PARTIALLY_PAID);
            invoice.setPaidDate(null);
        } else {
            if (invoice.getStatus() != InvoiceStatus.CANCELLED) {
                invoice.setStatus(InvoiceStatus.SENT);
            }
            invoice.setPaidDate(null);
        }
    }

    private void validatePaymentAmount(BigDecimal amount) {
        if (amount == null) {
            throw new BadRequestException("Payment amount is required.");
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Payment amount must be greater than zero.");
        }
    }

    private PaymentResponse mapToResponse(Payment payment) {
        Invoice invoice = payment.getInvoice();
        return PaymentResponse.builder()
                .id(payment.getId())
                .companyId(payment.getCompany() != null ? payment.getCompany().getId() : null)
                .paymentNumber(payment.getPaymentNumber())
                .invoiceId(invoice != null ? invoice.getId() : null)
                .invoiceNumber(invoice != null ? invoice.getInvoiceNumber() : null)
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .paymentDate(payment.getPaymentDate())
                .transactionReference(payment.getTransactionReference())
                .remarks(payment.getRemarks())
                .invoiceTotalAmount(invoice != null ? invoice.getTotalAmount() : null)
                .invoicePaidAmount(invoice != null ? invoice.getPaidAmount() : null)
                .invoiceOutstandingAmount(invoice != null ? invoice.getOutstandingAmount() : null)
                .invoiceStatus(invoice != null ? invoice.getStatus() : null)
                .build();
    }
}