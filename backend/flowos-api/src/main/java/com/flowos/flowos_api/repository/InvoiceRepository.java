package com.flowos.flowos_api.repository;

import com.flowos.flowos_api.entity.Invoice;
import com.flowos.flowos_api.enums.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    boolean existsByInvoiceNumber(String invoiceNumber);

    List<Invoice> findByInvoiceNumberContainingIgnoreCase(String invoiceNumber);

    List<Invoice> findByStatus(InvoiceStatus status);

    List<Invoice> findByCustomerId(Long customerId);

    List<Invoice> findByVendorId(Long vendorId);

    List<Invoice> findByOutstandingAmountGreaterThan(BigDecimal amount);

    /**
     * P0.7: Tenant-scoped queries
     */
    List<Invoice> findByCompanyId(Long companyId);

    List<Invoice> findByCompanyIdAndOutstandingAmountGreaterThan(Long companyId, BigDecimal amount);

    @Query("SELECT COALESCE(SUM(i.totalAmount), 0.00) FROM Invoice i WHERE i.company.id = :companyId")
    BigDecimal sumTotalAmountByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT COALESCE(SUM(i.outstandingAmount), 0.00) FROM Invoice i WHERE i.company.id = :companyId AND i.outstandingAmount > 0")
    BigDecimal sumOutstandingAmountByCompanyId(@Param("companyId") Long companyId);

    List<Invoice> findTop5ByCompanyIdOrderByCreatedAtDesc(Long companyId);
}