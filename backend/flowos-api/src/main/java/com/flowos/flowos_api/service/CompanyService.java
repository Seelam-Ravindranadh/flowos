package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.CompanyFinancialSummaryResponse;
import com.flowos.flowos_api.dto.CompanyProfileResponse;
import com.flowos.flowos_api.dto.CreateCompanyRequest;
import com.flowos.flowos_api.dto.UpdateCompanyRequest;
import com.flowos.flowos_api.entity.Company;
import com.flowos.flowos_api.exception.BadRequestException;
import com.flowos.flowos_api.exception.ResourceNotFoundException;
import com.flowos.flowos_api.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyService {

    private final CompanyRepository companyRepository;

    /**
     * Create Company
     */
    public CompanyProfileResponse createCompany(CreateCompanyRequest request) {

        log.info("Creating Company : {}", request.getCompanyName());

        if (companyRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException(
                    "Company already exists with email : "
                            + request.getEmail());
        }

        Company company = new Company();

        company.setCompanyName(request.getCompanyName());
        company.setRegistrationNumber(request.getRegistrationNumber());
        company.setGstNumber(request.getGstNumber());
        company.setPanNumber(request.getPanNumber());
        company.setEmail(request.getEmail());
        company.setPhone(request.getPhone());
        company.setWebsite(request.getWebsite());
        company.setAddress(request.getAddress());
        company.setCity(request.getCity());
        company.setState(request.getState());
        company.setCountry(request.getCountry());
        company.setPostalCode(request.getPostalCode());

        company.setCreatedAt(LocalDateTime.now());
        company.setUpdatedAt(LocalDateTime.now());

        Company savedCompany = companyRepository.save(company);

        log.info("Company Created Successfully : {}",
                savedCompany.getCompanyName());

        return mapToProfile(savedCompany);
    }

    /**
     * Get Company
     */
    public CompanyProfileResponse getCompany(Long id) {

        Company company =
                companyRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Company not found with id : " + id));

        return mapToProfile(company);
    }

    /**
     * Update Company
     */
    public CompanyProfileResponse updateCompany(
            Long id,
            UpdateCompanyRequest request) {

        Company company =
                companyRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Company not found with id : " + id));

        company.setCompanyName(request.getCompanyName());
        company.setRegistrationNumber(request.getRegistrationNumber());
        company.setGstNumber(request.getGstNumber());
        company.setPanNumber(request.getPanNumber());
        company.setEmail(request.getEmail());
        company.setPhone(request.getPhone());
        company.setWebsite(request.getWebsite());
        company.setAddress(request.getAddress());
        company.setCity(request.getCity());
        company.setState(request.getState());
        company.setCountry(request.getCountry());
        company.setPostalCode(request.getPostalCode());

        company.setUpdatedAt(LocalDateTime.now());

        Company updated =
                companyRepository.save(company);

        log.info("Company Updated Successfully");

        return mapToProfile(updated);
    }

    /**
     * Delete Company
     */
    public String deleteCompany(Long id) {

        Company company =
                companyRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Company not found"));

        companyRepository.delete(company);

        log.info("Company Deleted Successfully");

        return "Company deleted successfully";
    }

    /**
     * Company Profile
     */
    public CompanyProfileResponse getCompanyProfile(Long id) {

        Company company =
                companyRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Company not found"));

        return mapToProfile(company);
    }

    /**
     * Financial Summary
     */
    public CompanyFinancialSummaryResponse getFinancialSummary(Long id) {

        Company company =
                companyRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Company not found"));

        return CompanyFinancialSummaryResponse.builder()
                .companyId(company.getId())
                .companyName(company.getCompanyName())
                .annualRevenue(company.getAnnualRevenue())
                .totalAssets(company.getTotalAssets())
                .totalLiabilities(company.getTotalLiabilities())
                .cashBalance(company.getCashBalance())
                .creditScore(company.getCreditScore())
                .build();
    }

    /**
     * Entity -> DTO
     */
    private CompanyProfileResponse mapToProfile(
            Company company) {

        return CompanyProfileResponse.builder()
                .id(company.getId())
                .companyName(company.getCompanyName())
                .registrationNumber(company.getRegistrationNumber())
                .gstNumber(company.getGstNumber())
                .panNumber(company.getPanNumber())
                .email(company.getEmail())
                .phone(company.getPhone())
                .website(company.getWebsite())
                .address(company.getAddress())
                .city(company.getCity())
                .state(company.getState())
                .country(company.getCountry())
                .postalCode(company.getPostalCode())
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .build();
    }

}