package com.flowos.flowos_api.service.impl;

import com.flowos.flowos_api.dto.CreateBidRequest;
import com.flowos.flowos_api.dto.CreateFundingRequest;
import com.flowos.flowos_api.dto.FundingRequestDetailsResponse;
import com.flowos.flowos_api.dto.LenderBidResponse;
import com.flowos.flowos_api.entity.*;
import com.flowos.flowos_api.entity.LenderBid;
import com.flowos.flowos_api.enums.*;
import com.flowos.flowos_api.exception.BadRequestException;
import com.flowos.flowos_api.exception.ResourceNotFoundException;
import com.flowos.flowos_api.repository.*;
import com.flowos.flowos_api.service.FundingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FundingServiceImpl implements FundingService {

    private final FundingRequestRepository fundingRequestRepository;
    private final LenderBidRepository lenderBidRepository;
    private final InvoiceRepository invoiceRepository;
    private final CompanyRepository companyRepository;
    private final PaymentRepository paymentRepository;

    private static final BigDecimal PLATFORM_FEE_PERCENTAGE = BigDecimal.valueOf(0.005); // 0.5% platform fee

    @Override
    @Transactional
    public FundingRequestDetailsResponse createFundingRequest(CreateFundingRequest request) {
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + request.getCompanyId()));

        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + request.getInvoiceId()));

        if (!invoice.getCompany().getId().equals(company.getId())) {
            throw new BadRequestException("Invoice does not belong to the requested company tenant");
        }

        if (invoice.getOutstandingAmount() == null || invoice.getOutstandingAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Invoice has no outstanding amount to finance");
        }

        if (request.getRequestedAmount().compareTo(invoice.getOutstandingAmount()) > 0) {
            throw new BadRequestException("Requested funding amount cannot exceed invoice outstanding balance: "
                    + invoice.getOutstandingAmount());
        }

        String reqNumber = "FIN-" + System.currentTimeMillis();

        FundingRequest fundingRequest = FundingRequest.builder()
                .requestNumber(reqNumber)
                .company(company)
                .invoice(invoice)
                .requestedAmount(request.getRequestedAmount())
                .requestDate(LocalDate.now())
                .status(FundingRequestStatus.OPEN_FOR_BIDS)
                .notes(request.getNotes())
                .build();

        FundingRequest saved = fundingRequestRepository.save(fundingRequest);
        log.info("Listed Invoice {} on Financing Marketplace. Request: {}", invoice.getInvoiceNumber(), saved.getRequestNumber());
        return mapToDetails(saved);
    }

    @Override
    @Transactional
    public LenderBidResponse submitBid(Long fundingRequestId, CreateBidRequest request) {
        FundingRequest fundingRequest = fundingRequestRepository.findById(fundingRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Funding request not found with id: " + fundingRequestId));

        if (fundingRequest.getStatus() != FundingRequestStatus.OPEN_FOR_BIDS &&
                fundingRequest.getStatus() != FundingRequestStatus.BIDS_RECEIVED) {
            throw new BadRequestException("Funding request is not open for bidding");
        }

        if (request.getAdvanceAmount().compareTo(fundingRequest.getInvoice().getOutstandingAmount()) > 0) {
            throw new BadRequestException("Bid advance amount exceeds invoice outstanding balance");
        }

        // Calculate 0.5% platform fee and net payout
        BigDecimal platformFee = request.getAdvanceAmount().multiply(PLATFORM_FEE_PERCENTAGE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal netDisbursement = request.getAdvanceAmount().subtract(platformFee);

        LenderBid bid = LenderBid.builder()
                .bidNumber("BID-" + System.currentTimeMillis())
                .fundingRequest(fundingRequest)
                .lenderName(request.getLenderName())
                .advanceAmount(request.getAdvanceAmount())
                .discountRate(request.getDiscountRate())
                .platformFee(platformFee)
                .netDisbursement(netDisbursement)
                .status(BidStatus.SUBMITTED)
                .bidDate(LocalDate.now())
                .notes(request.getNotes())
                .build();

        LenderBid savedBid = lenderBidRepository.save(bid);

        fundingRequest.setStatus(FundingRequestStatus.BIDS_RECEIVED);
        fundingRequestRepository.save(fundingRequest);

        log.info("Lender {} submitted bid {} for {}", savedBid.getLenderName(), savedBid.getBidNumber(), fundingRequest.getRequestNumber());
        return mapToBidResponse(savedBid);
    }

    @Override
    @Transactional
    public FundingRequestDetailsResponse acceptBid(Long fundingRequestId, Long bidId) {
        FundingRequest fundingRequest = fundingRequestRepository.findById(fundingRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Funding request not found with id: " + fundingRequestId));

        LenderBid winningBid = lenderBidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found with id: " + bidId));

        if (!winningBid.getFundingRequest().getId().equals(fundingRequestId)) {
            throw new BadRequestException("Bid does not belong to this funding request");
        }

        if (fundingRequest.getStatus() == FundingRequestStatus.FUNDED) {
            throw new BadRequestException("Funding request is already funded");
        }

        // 1. Accept winning bid, reject all other competing bids
        List<LenderBid> allBids = lenderBidRepository.findByFundingRequestId(fundingRequestId);
        for (LenderBid bid : allBids) {
            if (bid.getId().equals(bidId)) {
                bid.setStatus(BidStatus.ACCEPTED);
            } else {
                bid.setStatus(BidStatus.REJECTED);
            }
        }
        lenderBidRepository.saveAll(allBids);

        // 2. Mark FundingRequest as FUNDED and record final agreed metrics
        fundingRequest.setStatus(FundingRequestStatus.FUNDED);
        fundingRequest.setApprovedAmount(winningBid.getAdvanceAmount());
        fundingRequest.setInterestRate(winningBid.getDiscountRate());
        fundingRequest.setLenderName(winningBid.getLenderName());
        FundingRequest updatedRequest = fundingRequestRepository.save(fundingRequest);

        // 3. Update Invoice Status to PARTIALLY_PAID or PAID based on advance
        Invoice invoice = fundingRequest.getInvoice();
        BigDecimal newPaidAmount = (invoice.getPaidAmount() != null ? invoice.getPaidAmount() : BigDecimal.ZERO)
                .add(winningBid.getAdvanceAmount());
        BigDecimal newOutstanding = invoice.getTotalAmount().subtract(newPaidAmount);
        if (newOutstanding.compareTo(BigDecimal.ZERO) < 0) newOutstanding = BigDecimal.ZERO;

        invoice.setPaidAmount(newPaidAmount);
        invoice.setOutstandingAmount(newOutstanding);
        invoice.setStatus(newOutstanding.compareTo(BigDecimal.ZERO) == 0 ? InvoiceStatus.PAID : InvoiceStatus.PARTIALLY_PAID);
        invoiceRepository.save(invoice);

        // 4. Record Net Advance Disbursement as an actual Cash Inflow in Payments table
        Payment payout = Payment.builder()
                .paymentNumber("PAY-FIN-" + System.currentTimeMillis())
                .company(fundingRequest.getCompany())
                .invoice(invoice)
                .amount(winningBid.getNetDisbursement())
                .paymentMethod(PaymentMethod.BANK_TRANSFER)
                .status(PaymentStatus.SUCCESS)
                .paymentDate(LocalDate.now())
                .transactionReference("TXN-FIN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .remarks("Financing advance from " + winningBid.getLenderName() + " (Platform fee: ₹" + winningBid.getPlatformFee() + ")")
                .build();
        paymentRepository.save(payout);

        log.info("Funding Request {} FUNDED. Net disbursement ₹{} credited to company cash balance.",
                fundingRequest.getRequestNumber(), winningBid.getNetDisbursement());

        return mapToDetails(updatedRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public FundingRequestDetailsResponse getFundingRequest(Long id) {
        FundingRequest request = fundingRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Funding request not found with id: " + id));
        return mapToDetails(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FundingRequestDetailsResponse> getAllRequests(Long companyId) {
        List<FundingRequest> requests = (companyId != null)
                ? fundingRequestRepository.findByCompanyId(companyId)
                : fundingRequestRepository.findAll();
        return requests.stream().map(this::mapToDetails).toList();
    }

    private FundingRequestDetailsResponse mapToDetails(FundingRequest request) {
        Invoice invoice = request.getInvoice();
        List<LenderBidResponse> bids = lenderBidRepository.findByFundingRequestId(request.getId()).stream()
                .map(this::mapToBidResponse)
                .toList();

        return FundingRequestDetailsResponse.builder()
                .id(request.getId())
                .requestNumber(request.getRequestNumber())
                .companyId(request.getCompany() != null ? request.getCompany().getId() : null)
                .invoiceId(invoice != null ? invoice.getId() : null)
                .invoiceNumber(invoice != null ? invoice.getInvoiceNumber() : null)
                .invoiceTotalAmount(invoice != null ? invoice.getTotalAmount() : null)
                .invoiceOutstandingAmount(invoice != null ? invoice.getOutstandingAmount() : null)
                .requestedAmount(request.getRequestedAmount())
                .approvedAmount(request.getApprovedAmount())
                .interestRate(request.getInterestRate())
                .lenderName(request.getLenderName())
                .status(request.getStatus())
                .requestDate(request.getRequestDate())
                .notes(request.getNotes())
                .bids(bids)
                .build();
    }

    private LenderBidResponse mapToBidResponse(LenderBid bid) {
        return LenderBidResponse.builder()
                .id(bid.getId())
                .bidNumber(bid.getBidNumber())
                .fundingRequestId(bid.getFundingRequest().getId())
                .lenderName(bid.getLenderName())
                .advanceAmount(bid.getAdvanceAmount())
                .discountRate(bid.getDiscountRate())
                .platformFee(bid.getPlatformFee())
                .netDisbursement(bid.getNetDisbursement())
                .status(bid.getStatus())
                .bidDate(bid.getBidDate())
                .notes(bid.getNotes())
                .build();
    }
}