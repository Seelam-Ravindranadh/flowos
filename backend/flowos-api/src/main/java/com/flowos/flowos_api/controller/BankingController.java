    package com.flowos.flowos_api.controller;

    import com.flowos.flowos_api.repository.PaymentRepository;
    import io.swagger.v3.oas.annotations.Operation;
    import io.swagger.v3.oas.annotations.tags.Tag;
    import lombok.RequiredArgsConstructor;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RequestParam;
    import org.springframework.web.bind.annotation.RestController;

    import java.util.List;
    import java.util.Map;

    @RestController
    @RequestMapping("/api/banking")
    @RequiredArgsConstructor
    @Tag(name = "Connected Banking APIs")
    public class BankingController {

        private final PaymentRepository paymentRepository;

        @Operation(summary = "Get Connected Bank Accounts")
        @GetMapping("/accounts")
        public ResponseEntity<List> getBankAccounts(@RequestParam(defaultValue = "1") Long companyId) {
            return ResponseEntity.ok(List.of(
                    Map.of("bank", "State Bank of India", "accountNumber", "XXXX4092", "type", "Operating", "status", "CONNECTED"),
                    Map.of("bank", "HDFC Bank", "accountNumber", "XXXX8821", "type", "Escrow / Financing", "status", "CONNECTED")
            ));
        }
    }