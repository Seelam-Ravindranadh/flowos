package com.flowos.flowos_api.repository;

import com.flowos.flowos_api.entity.FundingRequest;
import com.flowos.flowos_api.enums.FundingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FundingRequestRepository
        extends JpaRepository<FundingRequest, Long> {

    List<FundingRequest> findByStatus(FundingStatus status);

    List<FundingRequest> findByLenderNameContainingIgnoreCase(String lenderName);

    boolean existsByRequestNumber(String requestNumber);

}