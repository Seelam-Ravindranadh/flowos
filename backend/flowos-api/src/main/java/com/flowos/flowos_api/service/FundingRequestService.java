package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.CreateFundingRequest;
import com.flowos.flowos_api.dto.FundingRequestResponse;
import com.flowos.flowos_api.dto.UpdateFundingRequest;
import com.flowos.flowos_api.entity.FundingRequest;
import com.flowos.flowos_api.enums.FundingStatus;
import com.flowos.flowos_api.exception.ResourceNotFoundException;
import com.flowos.flowos_api.repository.FundingRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FundingRequestService {

    private final FundingRequestRepository fundingRequestRepository;

    /**
     * Apply Funding
     */
    public FundingRequestResponse createRequest(
            CreateFundingRequest request) {

        log.info("Creating Funding Request");

        FundingRequest fundingRequest = new FundingRequest();

        fundingRequest.setRequestNumber(request.getRequestNumber());
        fundingRequest.setLenderName(request.getLenderName());
        fundingRequest.setRequestedAmount(request.getRequestedAmount());
        fundingRequest.setApprovedAmount(request.getApprovedAmount());
        fundingRequest.setInterestRate(request.getInterestRate());
        fundingRequest.setTenureMonths(request.getTenureMonths());
        fundingRequest.setPurpose(request.getPurpose());

        fundingRequest.setStatus(FundingStatus.UNDER_REVIEW);

        fundingRequest.setRequestDate(LocalDate.now());

        FundingRequest saved =
                fundingRequestRepository.save(fundingRequest);

        return mapToResponse(saved);
    }

    /**
     * Update Funding Request
     */
    public FundingRequestResponse updateRequest(
            Long id,
            UpdateFundingRequest request) {

        FundingRequest fundingRequest =
                fundingRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Funding Request not found with id : "
                                                + id));

        fundingRequest.setLenderName(request.getLenderName());
        fundingRequest.setRequestedAmount(request.getRequestedAmount());
        fundingRequest.setApprovedAmount(request.getApprovedAmount());
        fundingRequest.setInterestRate(request.getInterestRate());
        fundingRequest.setTenureMonths(request.getTenureMonths());
        fundingRequest.setPurpose(request.getPurpose());
        fundingRequest.setStatus(request.getStatus());

        FundingRequest updated =
                fundingRequestRepository.save(fundingRequest);

        return mapToResponse(updated);
    }

    /**
     * Get Funding Request
     */
    public FundingRequestResponse getRequest(Long id) {

        FundingRequest fundingRequest =
                fundingRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Funding Request not found"));

        return mapToResponse(fundingRequest);
    }

    /**
     * Get All Requests
     */
    public List<FundingRequestResponse> getAllRequests() {

        return fundingRequestRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Funding History
     */
    public List<FundingRequestResponse> getRequestsByStatus(
            FundingStatus status) {

        return fundingRequestRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Approve Request
     */
    public FundingRequestResponse approveRequest(Long id) {

        FundingRequest fundingRequest =
                fundingRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Funding Request not found"));

        fundingRequest.setStatus(FundingStatus.APPROVED);

        return mapToResponse(
                fundingRequestRepository.save(fundingRequest));
    }

    /**
     * Reject Request
     */
    public FundingRequestResponse rejectRequest(Long id) {

        FundingRequest fundingRequest =
                fundingRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Funding Request not found"));

        fundingRequest.setStatus(FundingStatus.REJECTED);

        return mapToResponse(
                fundingRequestRepository.save(fundingRequest));
    }

    /**
     * Delete Request
     */
    public String deleteRequest(Long id) {

        FundingRequest fundingRequest =
                fundingRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Funding Request not found"));

        fundingRequestRepository.delete(fundingRequest);

        return "Funding Request deleted successfully.";
    }

    /**
     * Entity -> DTO
     */
    private FundingRequestResponse mapToResponse(
            FundingRequest request) {

        FundingRequestResponse response =
                new FundingRequestResponse();

        response.setId(request.getId());
        response.setRequestNumber(request.getRequestNumber());
        response.setLenderName(request.getLenderName());
        response.setRequestedAmount(request.getRequestedAmount());
        response.setApprovedAmount(request.getApprovedAmount());
        response.setInterestRate(request.getInterestRate());
        response.setTenureMonths(request.getTenureMonths());
        response.setPurpose(request.getPurpose());
        response.setRequestDate(request.getRequestDate());
        response.setStatus(request.getStatus());

        return response;
    }

}