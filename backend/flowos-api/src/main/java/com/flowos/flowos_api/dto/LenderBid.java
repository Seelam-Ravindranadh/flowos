package com.flowos.flowos_api.entity;

import com.flowos.flowos_api.enums.BidStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lender_bids")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LenderBid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bid_number", unique = true, nullable = false)
    private String bidNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "funding_request_id", nullable = false)
    private FundingRequest fundingRequest;

    @Column(name = "lender_name", nullable = false)
    private String lenderName;

    @Column(name = "advance_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal advanceAmount;

    @Column(name = "discount_rate", nullable = false)
    private Double discountRate;

    @Column(name = "platform_fee", nullable = false, precision = 18, scale = 2)
    private BigDecimal platformFee;

    @Column(name = "net_disbursement", nullable = false, precision = 18, scale = 2)
    private BigDecimal netDisbursement;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private BidStatus status;

    @Column(name = "bid_date", nullable = false)
    private LocalDate bidDate;

    @Column(length = 1000)
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}