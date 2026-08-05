package com.flowos.flowos_api.repository;

import com.flowos.flowos_api.entity.CashFlow;
import com.flowos.flowos_api.enums.CashFlowType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CashFlowRepository
        extends JpaRepository<CashFlow,Long> {

    Optional<CashFlow> findByTransactionNumber(String transactionNumber);

    boolean existsByTransactionNumber(String transactionNumber);

    List<CashFlow> findByType(CashFlowType type);

    List<CashFlow> findByTransactionDateBetween(
            LocalDate start,
            LocalDate end
    );

}