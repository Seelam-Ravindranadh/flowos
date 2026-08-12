package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.CreateInvoiceRequest;
import com.flowos.flowos_api.dto.InvoiceResponse;
import com.flowos.flowos_api.dto.UpdateInvoiceRequest;
import com.flowos.flowos_api.entity.Customer;
import com.flowos.flowos_api.entity.Invoice;
import com.flowos.flowos_api.entity.Vendor;
import com.flowos.flowos_api.enums.InvoiceStatus;
import com.flowos.flowos_api.exception.BadRequestException;
import com.flowos.flowos_api.exception.ResourceNotFoundException;
import com.flowos.flowos_api.repository.CustomerRepository;
import com.flowos.flowos_api.repository.InvoiceRepository;
import com.flowos.flowos_api.repository.VendorRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    private final CustomerRepository customerRepository;

    private final VendorRepository vendorRepository;


    /**
     * Create Invoice
     */
     /* public InvoiceResponse createInvoice(
            CreateInvoiceRequest request
    ) {

        log.info("Creating Invoice : {}", request.getInvoiceNumber());

        if (invoiceRepository.existsByInvoiceNumber(
                request.getInvoiceNumber())) {

            throw new BadRequestException(
                    "Invoice Number already exists."
            );
        }

        Customer customer =
                customerRepository.findById(request.getCustomerId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Customer not found"));

        Vendor vendor =
                vendorRepository.findById(request.getVendorId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Vendor not found"));

        Invoice invoice = new Invoice();

        if (!invoice.getInvoiceNumber().equals(request.getInvoiceNumber())
                && invoiceRepository.existsByInvoiceNumber(request.getInvoiceNumber())) {

            throw new BadRequestException(
                    "Invoice Number already exists.");
        }
        invoice.setInvoiceNumber(request.getInvoiceNumber());

        invoice.setCustomer(customer);

        invoice.setVendor(vendor);

        invoice.setInvoiceDate(request.getInvoiceDate());

        invoice.setDueDate(request.getDueDate());

        invoice.setAmount(request.getAmount());

        invoice.setTax(request.getTax());

        BigDecimal totalAmount =
                request.getAmount().add(request.getTax());

        invoice.setTotalAmount(totalAmount);

        invoice.setPaidAmount(BigDecimal.ZERO);

        invoice.setOutstandingAmount(totalAmount);

        invoice.setStatus(InvoiceStatus.DRAFT);

        invoice.setNotes(request.getNotes());

        Invoice savedInvoice =
                invoiceRepository.save(invoice);

        log.info("Invoice Created Successfully : {}",
                savedInvoice.getInvoiceNumber());

        return mapToResponse(savedInvoice);
    }
            */


    public InvoiceResponse createInvoice(CreateInvoiceRequest request) {

        log.info("Creating Invoice : {}", request.getInvoiceNumber());

        if (invoiceRepository.existsByInvoiceNumber(
                request.getInvoiceNumber())) {

            throw new BadRequestException(
                    "Invoice Number already exists.");
        }

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id : "
                                        + request.getCustomerId()));

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vendor not found with id : "
                                        + request.getVendorId()));

        BigDecimal amount = request.getAmount();
        BigDecimal tax = request.getTax();

        if (amount == null || amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Invoice amount must be greater than or equal to zero.");
        }

        if (tax == null || tax.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Tax must be greater than or equal to zero.");
        }

        BigDecimal totalAmount = amount.add(tax);

        Invoice invoice = new Invoice();

        invoice.setInvoiceNumber(request.getInvoiceNumber());
        invoice.setCustomer(customer);
        invoice.setVendor(vendor);
        invoice.setInvoiceDate(request.getInvoiceDate());
        invoice.setDueDate(request.getDueDate());
        invoice.setAmount(amount);
        invoice.setTax(tax);
        invoice.setTotalAmount(totalAmount);

        invoice.setPaidAmount(BigDecimal.ZERO);
        invoice.setOutstandingAmount(totalAmount);

        invoice.setStatus(InvoiceStatus.DRAFT);
        invoice.setNotes(request.getNotes());

        Invoice savedInvoice = invoiceRepository.save(invoice);

        log.info("Invoice Created Successfully : {}",
                savedInvoice.getInvoiceNumber());

        return mapToResponse(savedInvoice);
    }
    /**
     * Entity -> DTO
     */
    private InvoiceResponse mapToResponse(
            Invoice invoice
    ) {

        InvoiceResponse response =
                new InvoiceResponse();

        response.setId(invoice.getId());

        response.setInvoiceNumber(
                invoice.getInvoiceNumber());

        response.setCustomerId(
                invoice.getCustomer().getId());

        response.setCustomerName(
                invoice.getCustomer().getCustomerName());

        response.setVendorId(
                invoice.getVendor().getId());

        response.setVendorName(
                invoice.getVendor().getVendorName());

        response.setInvoiceDate(
                invoice.getInvoiceDate());

        response.setDueDate(
                invoice.getDueDate());

        response.setPaidDate(
                invoice.getPaidDate());

        response.setAmount(
                invoice.getAmount());

        response.setTax(
                invoice.getTax());

        response.setTotalAmount(
                invoice.getTotalAmount());

        response.setPaidAmount(
                invoice.getPaidAmount());

        response.setOutstandingAmount(
                invoice.getOutstandingAmount());

        response.setStatus(
                invoice.getStatus());

        response.setNotes(
                invoice.getNotes());

        return response;
    }
    /**
     * Get Invoice By Id
     */
    public InvoiceResponse getInvoice(Long id) {

        log.info("Fetching Invoice with Id : {}", id);

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Invoice not found with id : " + id));

        return mapToResponse(invoice);
    }

    /**
     * Get All Invoices
     */
    public List<InvoiceResponse> getAllInvoices() {

        log.info("Fetching all invoices");

        return invoiceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Search Invoice By Invoice Number
     */
    public List<InvoiceResponse> searchInvoice(String invoiceNumber) {

        log.info("Searching Invoice : {}", invoiceNumber);

        return invoiceRepository
                .findByInvoiceNumberContainingIgnoreCase(invoiceNumber)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Update Invoice
     */
    public InvoiceResponse updateInvoice(
            Long id,
            UpdateInvoiceRequest request
    ) {

        log.info("Updating Invoice : {}", id);

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invoice not found with id : " + id));

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id : "
                                        + request.getCustomerId()));

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vendor not found"));

        invoice.setCustomer(customer);

        invoice.setVendor(vendor);

        invoice.setInvoiceNumber(request.getInvoiceNumber());

        invoice.setInvoiceDate(request.getInvoiceDate());

        invoice.setDueDate(request.getDueDate());

        invoice.setPaidDate(request.getPaidDate());

        invoice.setAmount(request.getAmount());

        invoice.setTax(request.getTax());

        BigDecimal totalAmount =
                request.getAmount().add(request.getTax());

        invoice.setTotalAmount(totalAmount);

        invoice.setPaidAmount(request.getPaidAmount());

        BigDecimal outstandingAmount =
                totalAmount.subtract(request.getPaidAmount());

        invoice.setOutstandingAmount(outstandingAmount);

        invoice.setStatus(request.getStatus());

        invoice.setNotes(request.getNotes());

        Invoice updatedInvoice = invoiceRepository.save(invoice);

        log.info("Invoice Updated Successfully : {}",
                updatedInvoice.getInvoiceNumber());

        return mapToResponse(updatedInvoice);
    }
    /**
     * Delete Invoice
     */
    public String deleteInvoice(Long id) {

        log.info("Deleting Invoice : {}", id);

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invoice not found with id : " + id));

        invoiceRepository.delete(invoice);

        log.info("Invoice Deleted Successfully : {}",
                invoice.getInvoiceNumber());

        return "Invoice deleted successfully.";
    }
    /**
     * Get Invoices By Status
     */
    public List<InvoiceResponse> getInvoicesByStatus(
            InvoiceStatus status
    ) {

        log.info("Fetching invoices with status : {}", status);

        return invoiceRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Get Invoices By Customer
     */
    public List<InvoiceResponse> getInvoicesByCustomer(
            Long customerId
    ) {

        log.info("Fetching invoices for customer : {}", customerId);

        return invoiceRepository.findByCustomerId(customerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Get Invoices By Vendor
     */
    public List<InvoiceResponse> getInvoicesByVendor(
            Long vendorId
    ) {

        log.info("Fetching invoices for vendor : {}", vendorId);

        return invoiceRepository.findByVendorId(vendorId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

}