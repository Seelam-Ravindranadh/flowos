package com.flowos.flowos_api.repository;

import com.flowos.flowos_api.entity.Invoice;
import com.flowos.flowos_api.enums.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface InvoiceRepository
        extends JpaRepository<Invoice, Long> {

    boolean existsByInvoiceNumber(String invoiceNumber);

    List<Invoice> findByInvoiceNumberContainingIgnoreCase(
            String invoiceNumber);

    List<Invoice> findByStatus(
            InvoiceStatus status);

    List<Invoice> findByCustomerId(
            Long customerId);

    List<Invoice> findByVendorId(
            Long vendorId);

    /*
     * P0.5 - Receivables
     *
     * Returns only invoices that still have
     * money outstanding.
     */
    List<Invoice> findByOutstandingAmountGreaterThan(
            BigDecimal amount);


}