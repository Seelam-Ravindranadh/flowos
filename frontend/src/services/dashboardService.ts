import api from "../api/api";

export const dashboardService = {

    getDashboard() {
        return api.get("/dashboard");
    }

};