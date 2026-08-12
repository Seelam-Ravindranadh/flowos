package com.flowos.flowos_api.entity;

import com.flowos.flowos_api.enums.CashFlowType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cash_flows")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CashFlow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false,unique=true)
    private String transactionNumber;

    @Enumerated(EnumType.STRING)
    private CashFlowType type;

    @Column(nullable=false,precision=18,scale=2)
    private BigDecimal amount;

    private LocalDate transactionDate;

    private String source;

    private String description;

    private String month;
    private BigDecimal actualAmount;
    private BigDecimal forecastAmount;

}