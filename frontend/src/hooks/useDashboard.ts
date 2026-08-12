import { useEffect, useState } from "react";
import { dashboardService } from "../services/dashboardService";
import { DashboardResponse } from "../types/dashboard";

export default function useDashboard() {

    const [dashboard, setDashboard] =
        useState<DashboardResponse | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {

        try {

            setLoading(true);
            setError("");

            const response =
                await dashboardService.getDashboard();

            setDashboard(response.data);

        } catch (error) {

            console.error("Dashboard API failed:", error);

            setError("Unable to load dashboard.");

        } finally {

            setLoading(false);

        }
    }

    return {
        dashboard,
        loading,
        error,
        refresh: loadDashboard
    };
}