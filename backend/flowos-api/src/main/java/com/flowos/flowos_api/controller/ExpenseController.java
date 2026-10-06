package com.flowos.flowos_api.controller;

import com.flowos.flowos_api.dto.CreateExpenseRequest;
import com.flowos.flowos_api.dto.ExpenseApprovalRequest;
import com.flowos.flowos_api.dto.ExpenseResponse;
import com.flowos.flowos_api.dto.UpdateExpenseRequest;
import com.flowos.flowos_api.enums.ExpenseCategory;
import com.flowos.flowos_api.enums.ExpenseStatus;
import com.flowos.flowos_api.service.ExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@Tag(name = "Expense Lifecycle APIs")
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    @Operation(summary = "Create a new expense (enters PENDING status)")
    public ResponseEntity<ExpenseResponse> createExpense(@Valid @RequestBody CreateExpenseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseService.createExpense(request));
    }

    @PutMapping("/{id}/approve")
    @Operation(summary = "Approve Expense (recognizes cash outflow in ledger)")
    public ResponseEntity<ExpenseResponse> approveExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseApprovalRequest request) {
        return ResponseEntity.ok(expenseService.approveExpense(id, request));
    }

    @PutMapping("/{id}/reject")
    @Operation(summary = "Reject Expense (excludes from cash outflow)")
    public ResponseEntity<ExpenseResponse> rejectExpense(
            @PathVariable Long id,
            @RequestBody ExpenseApprovalRequest request) {
        return ResponseEntity.ok(expenseService.rejectExpense(id, request));
    }

    @GetMapping
    @Operation(summary = "Get all expenses or filter by company tenant")
    public ResponseEntity<List<ExpenseResponse>> getExpenses(@RequestParam(required = false) Long companyId) {
        if (companyId != null) {
            return ResponseEntity.ok(expenseService.getExpensesByCompany(companyId));
        }
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get expense by ID")
    public ResponseEntity<ExpenseResponse> getExpense(@PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getExpense(id));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get expenses filtered by status")
    public ResponseEntity<List<ExpenseResponse>> getExpensesByStatus(@PathVariable ExpenseStatus status) {
        return ResponseEntity.ok(expenseService.getExpensesByStatus(status));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing expense")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long id,
            @RequestBody UpdateExpenseRequest request) {
        return ResponseEntity.ok(expenseService.updateExpense(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an expense")
    public ResponseEntity<String> deleteExpense(@PathVariable Long id) {
        return ResponseEntity.ok(expenseService.deleteExpense(id));
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get expenses by category")
    public ResponseEntity<List<ExpenseResponse>> getExpensesByCategory(@PathVariable ExpenseCategory category) {
        return ResponseEntity.ok(expenseService.getExpensesByCategory(category));
    }

    @GetMapping("/monthly")
    @Operation(summary = "Get total approved expenses for a specific month")
    public ResponseEntity<BigDecimal> getMonthlyExpense(@RequestParam int year, @RequestParam int month) {
        return ResponseEntity.ok(expenseService.getMonthlyExpense(year, month));
    }
}