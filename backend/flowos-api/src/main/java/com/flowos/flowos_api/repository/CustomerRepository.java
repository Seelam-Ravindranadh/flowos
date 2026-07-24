package com.flowos.flowos_api.repository;

import com.flowos.flowos_api.entity.Customer;
import com.flowos.flowos_api.enums.CustomerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository
        extends JpaRepository<Customer,Long> {

    Optional<Customer> findByEmail(String email);

    List<Customer> findByStatus(CustomerStatus status);

    List<Customer> findByCustomerNameContainingIgnoreCase(String name);

    boolean existsByEmail(String email);

}
