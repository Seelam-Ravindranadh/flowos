package com.flowos.flowos_api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tax")
@Tag(name = "Tax & GST Center APIs")
public class TaxController {

    @Operation(summary = "Get Tax and GST summary position")
    @GetMapping("/summary")
    public ResponseEntity<List> getTaxSummary(@RequestParam(defaultValue = "1") Long companyId) {
        return ResponseEntity.ok(Collections.singletonList(Map.of(
                "netGstPayable", new BigDecimal("35550.00"),
                "inputTaxCreditAvailable", new BigDecimal("83160.00"),
                "tdsPayable", new BigDecimal("4280.00"),
                "complianceScore", 98.4,
                "mismatchedInvoicesCount", 1
        )));
    }
}