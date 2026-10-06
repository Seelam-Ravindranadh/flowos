package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.CreateInvoiceRequest;
import com.flowos.flowos_api.dto.InvoiceResponse;
import com.flowos.flowos_api.dto.UpdateInvoiceRequest;
import com.flowos.flowos_api.entity.Company;
import com.flowos.flowos_api.entity.Customer;
import com.flowos.flowos_api.entity.Invoice;
import com.flowos.flowos_api.entity.Vendor;
import com.flowos.flowos_api.enums.InvoiceStatus;
import com.flowos.flowos_api.exception.BadRequestException;
import com.flowos.flowos_api.exception.ResourceNotFoundException;
import com.flowos.flowos_api.repository.CompanyRepository;
import com.flowos.flowos_api.repository.CustomerRepository;
import com.flowos.flowos_api.repository.InvoiceRepository;
import com.flowos.flowos_api.repository.VendorRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;
    private final VendorRepository vendorRepository;
    private final CompanyRepository companyRepository;

    /**
     * Create Invoice - Enforces P0.7 Tenant Linking
     */
    @Transactional
    public InvoiceResponse createInvoice(CreateInvoiceRequest request) {

        log.info("Creating Invoice : {}", request.getInvoiceNumber());

        if (invoiceRepository.existsByInvoiceNumber(request.getInvoiceNumber())) {
            throw new BadRequestException("Invoice Number already exists: " + request.getInvoiceNumber());
        }

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer not found with id : " + request.getCustomerId()));

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vendor not found with id : " + request.getVendorId()));

        // Resolve Company Tenant (explicit ID or fall back to first registered company)
        Company company;
        if (request.getCompanyId() != null) {
            company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Company not found with id : " + request.getCompanyId()));
        } else {
            company = companyRepository.findAll().stream().findFirst()
                    .orElseThrow(() ->
                            new BadRequestException("No registered company tenant found. Please seed the companies table."));
        }

        BigDecimal amount = request.getAmount() != null ? request.getAmount() : BigDecimal.ZERO;
        BigDecimal tax = request.getTax() != null ? request.getTax() : BigDecimal.ZERO;

        if (amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Invoice amount must be greater than or equal to zero.");
        }

        if (tax.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Tax must be greater than or equal to zero.");
        }

        BigDecimal totalAmount = request.getTotalAmount() != null && request.getTotalAmount().compareTo(BigDecimal.ZERO) > 0
                ? request.getTotalAmount()
                : amount.add(tax);

        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(request.getInvoiceNumber());
        invoice.setCompany(company); // Fixes the 500 PropertyValueException
        invoice.setCustomer(customer);
        invoice.setVendor(vendor);
        invoice.setInvoiceDate(request.getInvoiceDate() != null ? request.getInvoiceDate() : LocalDate.now());
        invoice.setDueDate(request.getDueDate());
        invoice.setAmount(amount);
        invoice.setTax(tax);
        invoice.setTotalAmount(totalAmount);
        invoice.setPaidAmount(BigDecimal.ZERO);
        invoice.setOutstandingAmount(totalAmount);
        invoice.setStatus(InvoiceStatus.DRAFT);
        invoice.setNotes(request.getNotes());

        Invoice savedInvoice = invoiceRepository.save(invoice);

        log.info("Invoice Created Successfully : {} for Company : {}",
                savedInvoice.getInvoiceNumber(), company.getCompanyName());

        return mapToResponse(savedInvoice);
    }

    /**
     * Entity -> DTO
     */
    private InvoiceResponse mapToResponse(Invoice invoice) {

        InvoiceResponse response = new InvoiceResponse();
        response.setId(invoice.getId());
        response.setInvoiceNumber(invoice.getInvoiceNumber());

        if (invoice.getCustomer() != null) {
            response.setCustomerId(invoice.getCustomer().getId());
            response.setCustomerName(invoice.getCustomer().getCustomerName());
        }

        if (invoice.getVendor() != null) {
            response.setVendorId(invoice.getVendor().getId());
            response.setVendorName(invoice.getVendor().getVendorName());
        }

        response.setInvoiceDate(invoice.getInvoiceDate());
        response.setDueDate(invoice.getDueDate());
        response.setPaidDate(invoice.getPaidDate());
        response.setAmount(invoice.getAmount());
        response.setTax(invoice.getTax());
        response.setTotalAmount(invoice.getTotalAmount());
        response.setPaidAmount(invoice.getPaidAmount());
        response.setOutstandingAmount(invoice.getOutstandingAmount());
        response.setStatus(invoice.getStatus());
        response.setNotes(invoice.getNotes());

        return response;
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getInvoice(Long id) {
        log.info("Fetching Invoice with Id : {}", id);
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id : " + id));
        return mapToResponse(invoice);
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getAllInvoices() {
        log.info("Fetching all invoices");
        return invoiceRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> searchInvoice(String invoiceNumber) {
        log.info("Searching Invoice : {}", invoiceNumber);
        return invoiceRepository.findByInvoiceNumberContainingIgnoreCase(invoiceNumber).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public InvoiceResponse updateInvoice(Long id, UpdateInvoiceRequest request) {
        log.info("Updating Invoice : {}", id);

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id : " + id));

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id : " + request.getCustomerId()));

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id : " + request.getVendorId()));

        invoice.setCustomer(customer);
        invoice.setVendor(vendor);
        invoice.setInvoiceNumber(request.getInvoiceNumber());
        invoice.setInvoiceDate(request.getInvoiceDate());
        invoice.setDueDate(request.getDueDate());
        invoice.setPaidDate(request.getPaidDate());

        BigDecimal amount = request.getAmount() != null ? request.getAmount() : BigDecimal.ZERO;
        BigDecimal tax = request.getTax() != null ? request.getTax() : BigDecimal.ZERO;
        BigDecimal totalAmount = amount.add(tax);

        invoice.setAmount(amount);
        invoice.setTax(tax);
        invoice.setTotalAmount(totalAmount);

        BigDecimal paidAmount = request.getPaidAmount() != null ? request.getPaidAmount() : BigDecimal.ZERO;
        invoice.setPaidAmount(paidAmount);
        invoice.setOutstandingAmount(totalAmount.subtract(paidAmount));
        invoice.setStatus(request.getStatus());
        invoice.setNotes(request.getNotes());

        Invoice updatedInvoice = invoiceRepository.save(invoice);
        log.info("Invoice Updated Successfully : {}", updatedInvoice.getInvoiceNumber());

        return mapToResponse(updatedInvoice);
    }

    @Transactional
    public String deleteInvoice(Long id) {
        log.info("Deleting Invoice : {}", id);
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id : " + id));
        invoiceRepository.delete(invoice);
        log.info("Invoice Deleted Successfully : {}", invoice.getInvoiceNumber());
        return "Invoice deleted successfully.";
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoicesByStatus(InvoiceStatus status) {
        log.info("Fetching invoices with status : {}", status);
        return invoiceRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoicesByCustomer(Long customerId) {
        log.info("Fetching invoices for customer : {}", customerId);
        return invoiceRepository.findByCustomerId(customerId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoicesByVendor(Long vendorId) {
        log.info("Fetching invoices for vendor : {}", vendorId);
        return invoiceRepository.findByVendorId(vendorId).stream()
                .map(this::mapToResponse)
                .toList();
    }
}