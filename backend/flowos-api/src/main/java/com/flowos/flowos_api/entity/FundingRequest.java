package com.flowos.flowos_api.entity;

import com.flowos.flowos_api.enums.FundingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name="funding_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FundingRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String requestNumber;

    private String lenderName;

    @Column(precision = 18, scale = 2)
    private BigDecimal requestedAmount;

    @Column(precision = 18, scale = 2)
    private BigDecimal approvedAmount;

    private Double interestRate;

    @Column(name = "tenure_months")
    private Integer tenureMonths;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FundingStatus status;

    private String Purpose;

    private LocalDate requestDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="company_id")
    private Company company;
}