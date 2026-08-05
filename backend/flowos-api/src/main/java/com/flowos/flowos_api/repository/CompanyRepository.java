package com.flowos.flowos_api.repository;

import com.flowos.flowos_api.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository
        extends JpaRepository<Company, Long> {

    Optional<Company> findByCompanyName(String companyName);

    Optional<Company> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByCompanyName(String companyName);

}