package com.flowos.flowos_api.repository;

import com.flowos.flowos_api.entity.Payment;
import com.flowos.flowos_api.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByPaymentNumber(String paymentNumber);

    boolean existsByPaymentNumber(String paymentNumber);

    List<Payment> findByStatus(PaymentStatus status);

    List<Payment> findByInvoiceId(Long invoiceId);

    /**
     * P0.7: Tenant-scoped queries
     */
    List<Payment> findByCompanyIdAndStatus(Long companyId, PaymentStatus status);

    List<Payment> findByCompanyIdAndStatusAndPaymentDateGreaterThanEqual(
            Long companyId, PaymentStatus status, LocalDate startDate);

    @Query("SELECT COALESCE(SUM(p.amount), 0.00) FROM Payment p WHERE p.company.id = :companyId AND p.status = :status")
    BigDecimal sumAmountByCompanyIdAndStatus(@Param("companyId") Long companyId, @Param("status") PaymentStatus status);
}