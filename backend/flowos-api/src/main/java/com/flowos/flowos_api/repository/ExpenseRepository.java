package com.flowos.flowos_api.repository;

import com.flowos.flowos_api.entity.Expense;
import com.flowos.flowos_api.enums.ExpenseCategory;
import com.flowos.flowos_api.enums.ExpenseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByCategory(ExpenseCategory category);

    List<Expense> findByExpenseDateBetween(LocalDate start, LocalDate end);

    List<Expense> findByStatus(ExpenseStatus status);

    /**
     * P0.7: Tenant-scoped queries
     */
    List<Expense> findByCompanyId(Long companyId);

    List<Expense> findByCompanyIdAndStatus(Long companyId, ExpenseStatus status);

    List<Expense> findByCompanyIdAndStatusAndExpenseDateGreaterThanEqual(
            Long companyId, ExpenseStatus status, LocalDate startDate);

    @Query("SELECT COALESCE(SUM(e.amount), 0.00) FROM Expense e WHERE e.company.id = :companyId")
    BigDecimal sumAllAmountByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT COALESCE(SUM(e.amount), 0.00) FROM Expense e WHERE e.company.id = :companyId AND e.status = :status")
    BigDecimal sumAmountByCompanyIdAndStatus(@Param("companyId") Long companyId, @Param("status") ExpenseStatus status);
}