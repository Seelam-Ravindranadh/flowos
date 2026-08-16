package com.flowos.flowos_api.repository;

import com.flowos.flowos_api.entity.Expense;
import com.flowos.flowos_api.enums.ExpenseCategory;
import com.flowos.flowos_api.enums.ExpenseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository
        extends JpaRepository<Expense, Long> {

    /**
     * Find expenses by category.
     */
    List<Expense> findByCategory(
            ExpenseCategory category
    );

    /**
     * Find expenses between two dates.
     */
    List<Expense> findByExpenseDateBetween(
            LocalDate start,
            LocalDate end
    );

    /**
     * P0.6
     *
     * Find expenses by status.
     *
     * APPROVED expenses are treated as
     * cash outflows for actual cash flow.
     */
    List<Expense> findByStatus(
            ExpenseStatus status
    );
}