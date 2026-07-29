import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import { AppLayout } from "../components/AppLayout";
import { Landing } from "../components/Landing";
import ProtectedRoute from "../components/ProtectedRoute";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import type { NavKey } from "../lib/nav";

/* ----------------------------------------------------
   Landing
---------------------------------------------------- */

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Landing
      onEnter={() => navigate("/login")}
    />
  );
}

/* ----------------------------------------------------
   Generic Placeholder Page
---------------------------------------------------- */

function PlaceholderPage({
  title,
}: {
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-ink-900">
      <h1 className="text-3xl font-bold">{title}</h1>

      <p className="mt-3 text-slate-500">
        This module is under development.
      </p>
    </div>
  );
}

/* ----------------------------------------------------
   Route Config
---------------------------------------------------- */

const routes: {
  key: NavKey;
  path: string;
  title: string;
}[] = [
  {
    key: "dashboard",
    path: "/dashboard",
    title: "Dashboard",
  },
  {
    key: "assistant",
    path: "/assistant",
    title: "AI Assistant",
  },
  {
    key: "forecast",
    path: "/forecast",
    title: "Cash Flow Forecast",
  },
  {
    key: "receivables",
    path: "/receivables",
    title: "Receivables",
  },
  {
    key: "payables",
    path: "/payables",
    title: "Payables",
  },
  {
    key: "invoices",
    path: "/invoices",
    title: "Invoice Financing",
  },
  {
    key: "purchase_orders",
    path: "/purchase-orders",
    title: "Purchase Orders",
  },
  {
    key: "vendors",
    path: "/vendors",
    title: "Vendors",
  },
  {
    key: "customers",
    path: "/customers",
    title: "Customers",
  },
  {
    key: "credit_score",
    path: "/credit-score",
    title: "Credit Score",
  },
  {
    key: "funding_marketplace",
    path: "/funding-marketplace",
    title: "Funding Marketplace",
  },
  {
    key: "analytics",
    path: "/analytics",
    title: "Analytics",
  },
  {
    key: "expenses",
    path: "/expenses",
    title: "Expenses",
  },
  {
    key: "inventory",
    path: "/inventory",
    title: "Inventory Finance",
  },
  {
    key: "tax",
    path: "/tax",
    title: "Tax Center",
  },
  {
    key: "integrations",
    path: "/integrations",
    title: "Integrations",
  },
  {
    key: "banking",
    path: "/banking",
    title: "Banking",
  },
  {
    key: "payments",
    path: "/payments",
    title: "Payment Gateway",
  },
  {
    key: "documents",
    path: "/documents",
    title: "Documents",
  },
  {
    key: "notifications",
    path: "/notifications",
    title: "Notifications",
  },
  {
    key: "workflows",
    path: "/workflows",
    title: "Workflow Automation",
  },
  {
    key: "fraud",
    path: "/fraud",
    title: "Fraud Detection",
  },
  {
    key: "reports",
    path: "/reports",
    title: "Reports",
  },
];

/* ----------------------------------------------------
   Layout Wrapper
---------------------------------------------------- */

function DashboardLayout({
  active,
  children,
}: {
  active: NavKey;
  children: React.ReactNode;
}) {
  return (
    <AppLayout active={active}>
      {children}
    </AppLayout>
  );
}

/* ----------------------------------------------------
   Logout
---------------------------------------------------- */

function Logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  return <Navigate to="/login" replace />;
}

/* ----------------------------------------------------
   App Routes
---------------------------------------------------- */

export default function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute>
                <DashboardLayout active={route.key}>
                  {route.key === "dashboard" ? (
                    <Dashboard />
                  ) : (
                    <PlaceholderPage title={route.title} />
                  )}
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        ))}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout active="dashboard">
                <PlaceholderPage title="Settings" />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout active="dashboard">
                <PlaceholderPage title="Profile" />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoices/new"
          element={
            <ProtectedRoute>
              <DashboardLayout active="invoices">
                <PlaceholderPage title="Create Invoice" />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/logout"
          element={<Logout />}
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}