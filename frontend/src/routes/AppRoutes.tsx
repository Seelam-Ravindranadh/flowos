import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Landing } from "../components/Landing";
import { AppLayout } from "../components/AppLayout";

import { Dashboard } from "../pages/Dashboard";
import { Customers } from "../pages/Customers";
import { Reports } from "../pages/Reports";
import { Analytics } from "../pages/Analytics";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing onEnter={() => {}} />} />

        <Route
          path="/dashboard"
          element={
            <AppLayout active="dashboard" onNavigate={() => {}}>
              <Dashboard onNavigate={() => {}} />
            </AppLayout>
          }
        />

        <Route
          path="/customers"
          element={
            <AppLayout active="customers" onNavigate={() => {}}>
              <Customers />
            </AppLayout>
          }
        />

        <Route
          path="/reports"
          element={
            <AppLayout active="reports" onNavigate={() => {}}>
              <Reports />
            </AppLayout>
          }
        />

        <Route
          path="/analytics"
          element={
            <AppLayout active="analytics" onNavigate={() => {}}>
              <Analytics />
            </AppLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}