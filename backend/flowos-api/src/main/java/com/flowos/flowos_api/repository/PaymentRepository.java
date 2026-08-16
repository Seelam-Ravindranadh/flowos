package com.flowos.flowos_api.repository;

import com.flowos.flowos_api.entity.Payment;
import com.flowos.flowos_api.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    /**
     * Find payment by payment number.
     */
    Optional<Payment> findByPaymentNumber(
            String paymentNumber
    );

    /**
     * Check whether payment number already exists.
     */
    boolean existsByPaymentNumber(
            String paymentNumber
    );

    /**
     * Find payments by status.
     */
    List<Payment> findByStatus(
            PaymentStatus status
    );

    /**
     * Find payments by invoice.
     */
    List<Payment> findByInvoiceId(
            Long invoiceId
    );
}