package com.flowos.flowos_api.repository;

import com.flowos.flowos_api.entity.LenderBid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LenderBidRepository extends JpaRepository<LenderBid, Long> {
    List<LenderBid> findByFundingRequestId(Long fundingRequestId);
}