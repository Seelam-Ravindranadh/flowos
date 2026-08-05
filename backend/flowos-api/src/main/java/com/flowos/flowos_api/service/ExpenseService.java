package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.CreateExpenseRequest;
import com.flowos.flowos_api.dto.ExpenseResponse;
import com.flowos.flowos_api.dto.UpdateExpenseRequest;
import com.flowos.flowos_api.entity.Expense;
import com.flowos.flowos_api.enums.ExpenseCategory;
import com.flowos.flowos_api.enums.ExpenseStatus;
import com.flowos.flowos_api.exception.ResourceNotFoundException;
import com.flowos.flowos_api.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    /**
     * Create Expense
     */
    public ExpenseResponse createExpense(
            CreateExpenseRequest request) {

        Expense expense = new Expense();

        expense.setExpenseName(request.getExpenseName());
        expense.setCategory(request.getCategory());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setAmount(request.getAmount());
        expense.setVendorName(request.getVendorName());
        expense.setDescription(request.getDescription());
        expense.setStatus(ExpenseStatus.APPROVED);

        Expense savedExpense =
                expenseRepository.save(expense);

        return mapToResponse(savedExpense);
    }

    /**
     * Update Expense
     */
    public ExpenseResponse updateExpense(
            Long id,
            UpdateExpenseRequest request) {

        Expense expense =
                expenseRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Expense not found with id : " + id));

        expense.setExpenseName(request.getExpenseName());
        expense.setCategory(request.getCategory());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setAmount(request.getAmount());
        expense.setVendorName(request.getVendorName());
        expense.setDescription(request.getDescription());
        expense.setStatus(request.getStatus());

        Expense updated =
                expenseRepository.save(expense);

        return mapToResponse(updated);
    }

    /**
     * Get Expense
     */
    public ExpenseResponse getExpense(Long id) {

        Expense expense =
                expenseRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Expense not found"));

        return mapToResponse(expense);
    }

    /**
     * Get All Expenses
     */
    public List<ExpenseResponse> getAllExpenses() {

        return expenseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Expense Category
     */
    public List<ExpenseResponse> getExpensesByCategory(
            ExpenseCategory category) {

        return expenseRepository.findByCategory(category)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Monthly Expense
     */
    public BigDecimal getMonthlyExpense(
            int year,
            int month) {

        YearMonth yearMonth =
                YearMonth.of(year, month);

        LocalDate start =
                yearMonth.atDay(1);

        LocalDate end =
                yearMonth.atEndOfMonth();

        return expenseRepository
                .findByExpenseDateBetween(start, end)
                .stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Delete Expense
     */
    public String deleteExpense(Long id) {

        Expense expense =
                expenseRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Expense not found"));

        expenseRepository.delete(expense);

        return "Expense deleted successfully.";
    }

    /**
     * Entity -> DTO
     */
    private ExpenseResponse mapToResponse(
            Expense expense) {

        ExpenseResponse response =
                new ExpenseResponse();

        response.setId(expense.getId());
        response.setExpenseName(expense.getExpenseName());
        response.setCategory(expense.getCategory());
        response.setExpenseDate(expense.getExpenseDate());
        response.setAmount(expense.getAmount());
        response.setVendorName(expense.getVendorName());
        response.setDescription(expense.getDescription());
        response.setStatus(expense.getStatus());

        return response;
    }

}