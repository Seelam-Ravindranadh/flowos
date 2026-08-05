package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.*;
import com.flowos.flowos_api.entity.CashFlow;
import com.flowos.flowos_api.enums.CashFlowType;
import com.flowos.flowos_api.exception.BadRequestException;
import com.flowos.flowos_api.exception.ResourceNotFoundException;
import com.flowos.flowos_api.repository.CashFlowRepository;
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
public class CashFlowService {

    private final CashFlowRepository cashFlowRepository;

    public CashFlowResponse createCashFlow(CreateCashFlowRequest request){

        if(cashFlowRepository.existsByTransactionNumber(request.getTransactionNumber())){
            throw new BadRequestException("Transaction Number already exists.");
        }

        CashFlow cashFlow=new CashFlow();

        cashFlow.setTransactionNumber(request.getTransactionNumber());
        cashFlow.setType(request.getType());
        cashFlow.setAmount(request.getAmount());
        cashFlow.setTransactionDate(request.getTransactionDate());
        cashFlow.setSource(request.getSource());
        cashFlow.setDescription(request.getDescription());

        return mapToResponse(cashFlowRepository.save(cashFlow));
    }

    public CashFlowResponse updateCashFlow(Long id,
                                           UpdateCashFlowRequest request){

        CashFlow cashFlow=cashFlowRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Cash Flow not found"));

        cashFlow.setType(request.getType());
        cashFlow.setAmount(request.getAmount());
        cashFlow.setTransactionDate(request.getTransactionDate());
        cashFlow.setSource(request.getSource());
        cashFlow.setDescription(request.getDescription());

        return mapToResponse(cashFlowRepository.save(cashFlow));
    }

    public CashFlowResponse getCashFlow(Long id){

        return mapToResponse(
                cashFlowRepository.findById(id)
                        .orElseThrow(()->
                                new ResourceNotFoundException("Cash Flow not found"))
        );
    }

    public List<CashFlowResponse> getAllCashFlows(){

        return cashFlowRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<CashFlowResponse> getCashFlowsByType(CashFlowType type){

        return cashFlowRepository.findByType(type)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public BigDecimal getMonthlyCashFlow(int year,int month){

        LocalDate start=YearMonth.of(year,month).atDay(1);

        LocalDate end=YearMonth.of(year,month).atEndOfMonth();

        return cashFlowRepository.findByTransactionDateBetween(start,end)
                .stream()
                .map(CashFlow::getAmount)
                .reduce(BigDecimal.ZERO,BigDecimal::add);
    }

    public String deleteCashFlow(Long id){

        CashFlow cashFlow=cashFlowRepository.findById(id)
                .orElseThrow(()->
                        new ResourceNotFoundException("Cash Flow not found"));

        cashFlowRepository.delete(cashFlow);

        return "Cash Flow deleted successfully.";
    }

    private CashFlowResponse mapToResponse(CashFlow cashFlow){

        return CashFlowResponse.builder()
                .id(cashFlow.getId())
                .transactionNumber(cashFlow.getTransactionNumber())
                .type(cashFlow.getType())
                .amount(cashFlow.getAmount())
                .transactionDate(cashFlow.getTransactionDate())
                .source(cashFlow.getSource())
                .description(cashFlow.getDescription())
                .build();
    }

}