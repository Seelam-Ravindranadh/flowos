package com.flowos.flowos_api.repository;

import com.flowos.flowos_api.entity.Payment;
import com.flowos.flowos_api.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /**
     * Find Payment by Payment Number
     */
    Optional<Payment> findByPaymentNumber(String paymentNumber);

    /**
     * Check Payment Number Exists
     */
    boolean existsByPaymentNumber(String paymentNumber);

    /**
     * Find Payments by Status
     */
    List<Payment> findByStatus(PaymentStatus status);

    /**
     * Find Payments by Invoice Id
     */
    List<Payment> findByInvoiceId(Long invoiceId);

}