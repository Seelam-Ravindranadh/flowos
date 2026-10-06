package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.DashboardResponse;

public interface DashboardService {

    DashboardResponse getDashboard();

    DashboardResponse getDashboard(Long companyId);
}