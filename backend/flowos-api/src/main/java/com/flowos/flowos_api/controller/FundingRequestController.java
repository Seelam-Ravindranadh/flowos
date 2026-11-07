package com.flowos.flowos_api.controller;

import com.flowos.flowos_api.dto.CreateBidRequest;
import com.flowos.flowos_api.dto.CreateFundingRequest;
import com.flowos.flowos_api.dto.FundingRequestResponse;
import com.flowos.flowos_api.dto.LenderBidResponse;
import com.flowos.flowos_api.enums.FundingRequestStatus;
import com.flowos.flowos_api.service.FundingRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@RestController
@RequestMapping("/api/funding-requests")
@RequiredArgsConstructor
@Tag(name = "Invoice Financing & Marketplace APIs")
public class FundingRequestController {

    private final FundingRequestService fundingRequestService;

    @PostMapping
    @Operation(summary = "List an unpaid invoice on the financing marketplace")
    public ResponseEntity<FundingRequestResponse> createRequest(@Valid @RequestBody CreateFundingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fundingRequestService.createRequest(request));
    }

    @PostMapping("/{id}/bids")
    @Operation(summary = "Submit a lender discount/advance bid")
    public ResponseEntity<LenderBidResponse> submitBid(
            @PathVariable Long id,
            @Valid @RequestBody CreateBidRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fundingRequestService.submitBid(id, request));
    }

    @PostMapping("/{id}/bids/{bidId}/accept")
    @Operation(summary = "Accept winning bid (credits net payout into cash ledger)")
    public ResponseEntity<FundingRequestResponse> acceptBid(
            @PathVariable Long id,
            @PathVariable Long bidId) {
        return ResponseEntity.ok(fundingRequestService.acceptBid(id, bidId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get funding request with submitted lender bids")
    public ResponseEntity<FundingRequestResponse> getRequest(@PathVariable Long id) {
        return ResponseEntity.ok(fundingRequestService.getRequest(id));
    }

    @GetMapping
    @Operation(summary = "Get all funding requests or filter by tenant")
    public ResponseEntity<List<FundingRequestResponse>> getAllRequests(@RequestParam(required = false) Long companyId) {
        if (companyId != null) {
            return ResponseEntity.ok(fundingRequestService.getRequestsByCompany(companyId));
        }
        return ResponseEntity.ok(fundingRequestService.getAllRequests());
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Filter funding requests by marketplace status")
    public ResponseEntity<List<FundingRequestResponse>> getRequestsByStatus(@PathVariable FundingRequestStatus status) {
        return ResponseEntity.ok(fundingRequestService.getRequestsByStatus(status));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete funding request")
    public ResponseEntity<String> deleteRequest(@PathVariable Long id) {
        return ResponseEntity.ok(fundingRequestService.deleteRequest(id));
    }

    /*@Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }*/
}