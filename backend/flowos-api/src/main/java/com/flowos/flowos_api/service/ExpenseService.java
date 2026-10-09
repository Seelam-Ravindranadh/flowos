package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.CreateExpenseRequest;
import com.flowos.flowos_api.dto.ExpenseApprovalRequest;
import com.flowos.flowos_api.dto.ExpenseResponse;
import com.flowos.flowos_api.dto.UpdateExpenseRequest;
import com.flowos.flowos_api.entity.Company;
import com.flowos.flowos_api.entity.Expense;
import com.flowos.flowos_api.enums.ExpenseCategory;
import com.flowos.flowos_api.enums.ExpenseStatus;
import com.flowos.flowos_api.exception.BadRequestException;
import com.flowos.flowos_api.exception.ResourceNotFoundException;
import com.flowos.flowos_api.repository.CompanyRepository;
import com.flowos.flowos_api.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CompanyRepository companyRepository;

    /**
     * Create Expense - P0.9 Enforces PENDING Status & Tenant Binding
     */
   /* @Transactional
    public ExpenseResponse createExpense(CreateExpenseRequest request) {

        Company company;
        if (request.getCompanyId() != null) {
            company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + request.getCompanyId()));
        } else {
            company = companyRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new BadRequestException("No registered company tenant found. Seed companies table first."));
        }

        String expenseNumber = request.getExpenseNumber();
        if (expenseNumber == null || expenseNumber.isBlank()) {
            expenseNumber = "EXP-" + System.currentTimeMillis();
        }

        Expense expense = new Expense();
        expense.setExpenseNumber(expenseNumber);
        expense.setExpenseName(request.getExpenseName());
        expense.setCategory(request.getCategory());
        expense.setExpenseDate(request.getExpenseDate() != null ? request.getExpenseDate() : LocalDate.now());
        expense.setAmount(request.getAmount());
        expense.setVendorName(request.getVendorName());
        expense.setDescription(request.getDescription());
        expense.setCompany(company);
        expense.setStatus(ExpenseStatus.PENDING); // Gated: requires approval before outflow recognition

        Expense savedExpense = expenseRepository.save(expense);
        log.info("Created Expense {} in PENDING state for Company {}", savedExpense.getExpenseNumber(), company.getCompanyName());
        return mapToResponse(savedExpense);
    }  */

    @Transactional
    public ExpenseResponse createExpense(CreateExpenseRequest request) {

        Company company = companyRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new BadRequestException("No registered company tenant found."));

        String expenseNumber = (request.getExpenseNumber() != null && !request.getExpenseNumber().isBlank())
                ? request.getExpenseNumber()
                : "EXP-" + System.currentTimeMillis();

        Expense expense = new Expense();
        expense.setExpenseNumber(expenseNumber);
        expense.setExpenseName(request.getExpenseName());
        expense.setCategory(request.getCategory());
        expense.setExpenseDate(request.getExpenseDate() != null ? request.getExpenseDate() : LocalDate.now());
        expense.setAmount(request.getAmount());
        expense.setVendorName(request.getVendorName());
        expense.setDescription(request.getDescription());
        expense.setCompany(company);              // <-- Required non-null tenant FK
        expense.setStatus(ExpenseStatus.PENDING); // <-- Enters PENDING approval gate

        Expense saved = expenseRepository.save(expense);
        return mapToResponse(saved);
    }
    /**
     * Approve Expense - Recognizes cash outflow in ledger
     */
    @Transactional
    public ExpenseResponse approveExpense(Long id, ExpenseApprovalRequest request) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        if (expense.getStatus() == ExpenseStatus.APPROVED) {
            throw new BadRequestException("Expense is already approved");
        }

        expense.setStatus(ExpenseStatus.APPROVED);
        expense.setApprovedBy(request.getApprovedBy());
        expense.setApprovalDate(LocalDate.now());
        expense.setRejectionReason(null);

        Expense updated = expenseRepository.save(expense);
        log.info("Expense {} APPROVED by {}", updated.getExpenseNumber(), request.getApprovedBy());
        return mapToResponse(updated);
    }

    /**
     * Reject Expense - Excluded from cash outflow calculations
     */
    @Transactional
    public ExpenseResponse rejectExpense(Long id, ExpenseApprovalRequest request) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        expense.setStatus(ExpenseStatus.REJECTED);
        expense.setApprovedBy(request.getApprovedBy());
        expense.setApprovalDate(LocalDate.now());
        expense.setRejectionReason(request.getRejectionReason());

        Expense updated = expenseRepository.save(expense);
        log.info("Expense {} REJECTED. Reason: {}", updated.getExpenseNumber(), request.getRejectionReason());
        return mapToResponse(updated);
    }

    @Transactional
    public ExpenseResponse updateExpense(Long id, UpdateExpenseRequest request) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        expense.setExpenseName(request.getExpenseName());
        expense.setCategory(request.getCategory());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setAmount(request.getAmount());
        expense.setVendorName(request.getVendorName());
        expense.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            expense.setStatus(request.getStatus());
        }

        Expense updated = expenseRepository.save(expense);
        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpense(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        return mapToResponse(expense);
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getAllExpenses() {
        return expenseRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByCompany(Long companyId) {
        return expenseRepository.findByCompanyId(companyId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByStatus(ExpenseStatus status) {
        return expenseRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByCategory(ExpenseCategory category) {
        return expenseRepository.findByCategory(category).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BigDecimal getMonthlyExpense(int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();

        return expenseRepository.findByExpenseDateBetween(start, end).stream()
                .filter(e -> e.getStatus() == ExpenseStatus.APPROVED || e.getStatus() == ExpenseStatus.PAID)
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Transactional
    public String deleteExpense(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        expenseRepository.delete(expense);
        return "Expense deleted successfully.";
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        ExpenseResponse response = new ExpenseResponse();
        response.setId(expense.getId());
        response.setCompanyId(expense.getCompany() != null ? expense.getCompany().getId() : null);
        response.setCompanyName(expense.getCompany() != null ? expense.getCompany().getCompanyName() : null);
        response.setExpenseNumber(expense.getExpenseNumber());
        response.setExpenseName(expense.getExpenseName());
        response.setCategory(expense.getCategory());
        response.setExpenseDate(expense.getExpenseDate());
        response.setAmount(expense.getAmount());
        response.setVendorName(expense.getVendorName());
        response.setDescription(expense.getDescription());
        response.setStatus(expense.getStatus());
        response.setApprovedBy(expense.getApprovedBy());
        response.setApprovalDate(expense.getApprovalDate());
        response.setRejectionReason(expense.getRejectionReason());
        response.setCreatedAt(expense.getCreatedAt());
        return response;
    }
}