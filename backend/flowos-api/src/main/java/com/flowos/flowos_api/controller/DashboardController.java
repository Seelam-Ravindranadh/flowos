package com.flowos.flowos_api.controller;

import com.flowos.flowos_api.dto.DashboardResponse;
import com.flowos.flowos_api.service.DashboardService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard APIs")
public class DashboardController {

    private final DashboardService dashboardService;


    @GetMapping
    @Operation(summary = "Get Dashboard Data")
    public DashboardResponse getDashboard() {

        return dashboardService.getDashboard();
    }
}