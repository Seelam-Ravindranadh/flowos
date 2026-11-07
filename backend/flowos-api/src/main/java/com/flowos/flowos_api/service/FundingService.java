package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.CreateBidRequest;
import com.flowos.flowos_api.dto.CreateFundingRequest;
import com.flowos.flowos_api.dto.FundingRequestDetailsResponse;
import com.flowos.flowos_api.dto.LenderBidResponse;

import java.util.List;

public interface FundingService {

    FundingRequestDetailsResponse createFundingRequest(CreateFundingRequest request);

    LenderBidResponse submitBid(Long fundingRequestId, CreateBidRequest request);

    FundingRequestDetailsResponse acceptBid(Long fundingRequestId, Long bidId);

    FundingRequestDetailsResponse getFundingRequest(Long id);

    List<FundingRequestDetailsResponse> getAllRequests(Long companyId);
}