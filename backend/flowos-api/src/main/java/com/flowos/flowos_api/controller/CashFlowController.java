package com.flowos.flowos_api.controller;

import com.flowos.flowos_api.dto.*;
import com.flowos.flowos_api.enums.CashFlowType;
import com.flowos.flowos_api.service.CashFlowService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/cashflows")
@RequiredArgsConstructor
public class CashFlowController {

    private final CashFlowService cashFlowService;

    @PostMapping
    public CashFlowResponse create(
            @RequestBody CreateCashFlowRequest request){

        return cashFlowService.createCashFlow(request);
    }

    @PutMapping("/{id}")
    public CashFlowResponse update(
            @PathVariable Long id,
            @RequestBody UpdateCashFlowRequest request){

        return cashFlowService.updateCashFlow(id,request);
    }

    @GetMapping("/{id}")
    public CashFlowResponse get(
            @PathVariable Long id){

        return cashFlowService.getCashFlow(id);
    }

    @GetMapping
    public List<CashFlowResponse> getAll(){

        return cashFlowService.getAllCashFlows();
    }

    @GetMapping("/type/{type}")
    public List<CashFlowResponse> byType(
            @PathVariable CashFlowType type){

        return cashFlowService.getCashFlowsByType(type);
    }

    @GetMapping("/monthly")
    public BigDecimal monthly(
            @RequestParam int year,
            @RequestParam int month){

        return cashFlowService.getMonthlyCashFlow(year,month);
    }

    @DeleteMapping("/{id}")
    public String delete(
            @PathVariable Long id){

        return cashFlowService.deleteCashFlow(id);
    }

}