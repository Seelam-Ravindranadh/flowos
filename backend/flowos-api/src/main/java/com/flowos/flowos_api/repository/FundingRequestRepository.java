package com.flowos.flowos_api.repository;

import com.flowos.flowos_api.entity.FundingRequest;
import com.flowos.flowos_api.enums.FundingRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FundingRequestRepository
        extends JpaRepository<FundingRequest, Long> {

    List<FundingRequest> findByStatus(FundingRequestStatus status);

    List<FundingRequest> findByLenderNameContainingIgnoreCase(String lenderName);

    boolean existsByRequestNumber(String requestNumber);

    List<FundingRequest> findByCompanyId(Long companyId);

    Optional<FundingRequest> findByInvoiceId(Long invoiceId);
}