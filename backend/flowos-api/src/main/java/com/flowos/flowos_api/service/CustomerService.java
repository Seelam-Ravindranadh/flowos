package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.CreateCustomerRequest;
import com.flowos.flowos_api.dto.CustomerResponse;
import com.flowos.flowos_api.dto.UpdateCustomerRequest;
import com.flowos.flowos_api.entity.Customer;
import com.flowos.flowos_api.enums.CustomerStatus;
import com.flowos.flowos_api.exception.BadRequestException;
import com.flowos.flowos_api.exception.ResourceNotFoundException;
import com.flowos.flowos_api.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class CustomerService {

    private final CustomerRepository customerRepository;



    /**
     * Create Customer
     */
    public CustomerResponse createCustomer(CreateCustomerRequest request) {

        log.info("Creating customer with email: {}", request.getEmail());

        if (customerRepository.existsByEmail(request.getEmail())) {

            log.warn("Customer already exists: {}", request.getEmail());

            throw new BadRequestException("Customer already exists with this email.");
        }

        Customer customer = new Customer();

        customer.setCustomerName(request.getCustomerName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setCompany(request.getCompany());
        customer.setAddress(request.getAddress());
        customer.setGstNumber(request.getGstNumber());

        customer.setStatus(CustomerStatus.ACTIVE);

        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());

        Customer savedCustomer = customerRepository.save(customer);

        log.info("Customer created successfully: {}", savedCustomer.getEmail());

        return mapToResponse(savedCustomer);
    }

    /**
     * Get All Customers
     */
    public List<CustomerResponse> getAllCustomers() {

        return customerRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Get Customer By Id
     */
    public CustomerResponse getCustomer(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer not found with id : " + id));

        return mapToResponse(customer);
    }

    /**
     * Update Customer
     */
    public CustomerResponse updateCustomer(
            Long id,
            UpdateCustomerRequest request) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer not found with id : " + id));

        customer.setCustomerName(request.getCustomerName());
        customer.setPhone(request.getPhone());
        customer.setCompany(request.getCompany());
        customer.setAddress(request.getAddress());
        customer.setGstNumber(request.getGstNumber());
        customer.setStatus(request.getStatus());

        customer.setUpdatedAt(LocalDateTime.now());

        Customer updatedCustomer = customerRepository.save(customer);

        log.info("Customer updated successfully: {}", updatedCustomer.getEmail());

        return mapToResponse(updatedCustomer);
    }

    /**
     * Delete Customer
     */
    public String deleteCustomer(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer not found with id : " + id));

        customerRepository.delete(customer);

        log.info("Customer deleted successfully: {}", customer.getEmail());

        return "Customer deleted successfully";
    }

    /**
     * Search Customer
     */
    public List<CustomerResponse> searchCustomer(String name) {

        return customerRepository
                .findByCustomerNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Customers By Status
     */
    public List<CustomerResponse> getCustomersByStatus(CustomerStatus status) {

        return customerRepository
                .findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Entity -> DTO
     */
    private CustomerResponse mapToResponse(Customer customer) {

        CustomerResponse response = new CustomerResponse();

        response.setId(customer.getId());
        response.setCustomerName(customer.getCustomerName());
        response.setEmail(customer.getEmail());
        response.setPhone(customer.getPhone());
        response.setCompany(customer.getCompany());
        response.setAddress(customer.getAddress());
        response.setGstNumber(customer.getGstNumber());
        response.setStatus(customer.getStatus());

        return response;
    }
}