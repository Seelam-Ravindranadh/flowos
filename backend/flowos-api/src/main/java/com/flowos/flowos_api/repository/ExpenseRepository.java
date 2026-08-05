package com.flowos.flowos_api.repository;

import com.flowos.flowos_api.entity.Expense;
import com.flowos.flowos_api.enums.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository
        extends JpaRepository<Expense, Long> {

    List<Expense> findByCategory(ExpenseCategory category);

    List<Expense> findByExpenseDateBetween(
            LocalDate start,
            LocalDate end
    );

    List<Expense> findByVendorId(Long vendorId);

}