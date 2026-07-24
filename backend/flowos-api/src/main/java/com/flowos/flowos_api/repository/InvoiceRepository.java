package com.flowos.flowos_api.repository;

import com.flowos.flowos_api.entity.Customer;
import com.flowos.flowos_api.entity.Invoice;
import com.flowos.flowos_api.entity.Vendor;
import com.flowos.flowos_api.enums.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    /**
     * Find Invoice by Invoice Number
     */
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    /**
     * Check Invoice Number Exists
     */
    boolean existsByInvoiceNumber(String invoiceNumber);

    /**
     * Find All By Status
     */
    List<Invoice> findByStatus(InvoiceStatus status);

    /**
     * Search Invoice Number
     */
    List<Invoice> findByInvoiceNumberContainingIgnoreCase(String invoiceNumber);

    /**
     * Find By Customer
     */
    List<Invoice> findByCustomer(Customer customer);

    /**
     * Find By Vendor
     */
    List<Invoice> findByVendor(Vendor vendor);

    /**
     * Find By Customer Id
     */
    List<Invoice> findByCustomerId(Long customerId);

    /**
     * Find By Vendor Id
     */
    List<Invoice> findByVendorId(Long vendorId);

}