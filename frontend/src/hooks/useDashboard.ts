import { useEffect, useState } from "react";
import { DashboardResponse } from "../types/dashboard";
import { getDashboard } from "../api/dashboardApi";

export default  function useDashboard() {

    const [dashboard, setDashboard] =
        useState<DashboardResponse | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const data = await getDashboard();

                setDashboard(data);

            } catch (err) {
                console.error(err);
                setError("Unable to load dashboard.");
            }finally {

                setLoading(false);

            }

        };

        loadDashboard();

    }, []);

    return {

        dashboard,

        loading,

        error

    };

}