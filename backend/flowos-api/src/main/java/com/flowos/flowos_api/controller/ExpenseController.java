package com.flowos.flowos_api.controller;

import com.flowos.flowos_api.dto.CreateExpenseRequest;
import com.flowos.flowos_api.dto.ExpenseResponse;
import com.flowos.flowos_api.dto.UpdateExpenseRequest;
import com.flowos.flowos_api.enums.ExpenseCategory;
import com.flowos.flowos_api.service.ExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@Tag(name = "Expense APIs")
public class ExpenseController {

    private final ExpenseService expenseService;

    /**
     * Create Expense
     */
    @PostMapping
    @Operation(summary = "Create a new expense")
    public ResponseEntity<ExpenseResponse> createExpense(
            @RequestBody CreateExpenseRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(expenseService.createExpense(request));
    }

    /**
     * Get All Expenses
     */
    @GetMapping
    @Operation(summary = "Get all expenses")
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses() {

        return ResponseEntity.ok(
                expenseService.getAllExpenses()
        );
    }

    /**
     * Get Expense by ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get expense by ID")
    public ResponseEntity<ExpenseResponse> getExpense(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                expenseService.getExpense(id)
        );
    }

    /**
     * Update Expense
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing expense")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long id,
            @RequestBody UpdateExpenseRequest request) {

        return ResponseEntity.ok(
                expenseService.updateExpense(id, request)
        );
    }

    /**
     * Delete Expense
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an expense")
    public ResponseEntity<String> deleteExpense(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                expenseService.deleteExpense(id)
        );
    }

    /**
     * Get Expenses by Category
     */
    @GetMapping("/category/{category}")
    @Operation(summary = "Get expenses by category")
    public ResponseEntity<List<ExpenseResponse>> getExpensesByCategory(
            @PathVariable ExpenseCategory category) {

        return ResponseEntity.ok(
                expenseService.getExpensesByCategory(category)
        );
    }

    /**
     * Get Monthly Expense
     */
    @GetMapping("/monthly")
    @Operation(summary = "Get total expenses for a specific month")
    public ResponseEntity<BigDecimal> getMonthlyExpense(
            @RequestParam int year,
            @RequestParam int month) {

        return ResponseEntity.ok(
                expenseService.getMonthlyExpense(year, month)
        );
    }
}