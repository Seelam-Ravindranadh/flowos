import { motion } from "framer-motion";
import useDashboard from "../hooks/useDashboard";

import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Brain,
  Calendar,
  CreditCard,
  FileText,
  HeartPulse,
  Landmark,
  Plus,
  Receipt,
  Shield,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { KpiCard } from "../components/ui/KpiCard";
import { ScoreRing } from "../components/ui/ScoreRing";
import { PageHeader } from "../components/ui/PageHeader";
import { ChartTooltip } from "../components/ui/ChartTooltip";

import { AiPill, InsightCard } from "../components/InsightCard";



import { fmtINR } from "../lib/format";

/* -------------------------------------------------------------------------- */
/* Sparkline Generator                                                        */
/* -------------------------------------------------------------------------- */

const spark = (seed: number, n = 12) =>
  Array.from({ length: n }, (_, i) => ({
    value: Math.sin(i / 2 + seed) * 20 + 60 + i * 2,
  }));

/* -------------------------------------------------------------------------- */
/* Dashboard                                                                  */
/* -------------------------------------------------------------------------- */

interface DashboardProps {
  onNavigate: (route: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { dashboard, loading, error } = useDashboard();

if (loading) {
    return <h2>Loading...</h2>;
}

if (error) {
    return <h2>{error}</h2>;
}

if (!dashboard) {
    return <h2>No Dashboard Data</h2>;
}

const insights = [
    "Revenue increased 18.6%",
    "Cash runway is healthy",
    "3 invoices overdue"
];
const summary = dashboard.summary;
const cashFlowSeries = dashboard.cashFlow;
const revenueSeries = dashboard.revenueProfit;
const expenseBreakdown = dashboard.expenseBreakdown;
const receivableAging = dashboard.receivableAging;
const invoices = dashboard.recentInvoices;
const fundingRequests = dashboard.fundingRequests;
const businessHealth = dashboard.businessHealth;
  return (
    <div className="space-y-6">

      {/* ------------------------------------------------------------------ */}
      {/* Page Header                                                        */}
      {/* ------------------------------------------------------------------ */}

      <PageHeader
        title="Financial Dashboard"
        subtitle="Aurora Textiles Pvt Ltd · Live cash position, forecast and AI recommendations"
        badge={<AiPill>Flow AI Active</AiPill>}
        actions={
          <>
            <Button variant="secondary" size="sm" icon={<Calendar size={14} />}>
              Last 30 Days
            </Button>

            <Button
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => onNavigate("/invoices/new")}
            >
              New Invoice
            </Button>
          </>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* KPI Cards                                                          */}
      {/* ------------------------------------------------------------------ */}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <KpiCard
          label="Cash Available"
          value={fmtINR(summary.cashBalance)}
          delta={8.2}
          deltaLabel="vs last month"
          tone="brand"
          icon={<Wallet size={18} />}
          spark={spark(1).map((d) => d.value)}
        />

        <KpiCard
          label="Working Capital"
          value={fmtINR(
                 summary.totalReceivables -
                 summary.totalPayables
                 )}
          delta={12.4}
          deltaLabel="+₹46L MoM"
          tone="accent"
          icon={<TrendingUp size={18} />}
          spark={spark(2).map((d) => d.value)}
        />

        <KpiCard
          label="Revenue (MTD)"
          value={fmtINR(summary.totalRevenue)}
          delta={5.1}
          deltaLabel="vs target ₹3.1Cr"
          tone="success"
          icon={<ArrowUpRight size={18} />}
          spark={spark(3).map((d) => d.value)}
        />

        <KpiCard
          label="Outstanding Invoices"
          value={summary.overdueInvoices.toString()}
          delta={-3.2}
          deltaLabel={fmtINR(summary.totalReceivables, { compact: true })}
          tone="warning"
          icon={<FileText size={18} />}
          spark={spark(4).map((d) => d.value)}
        />
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* Cash Flow + Business Health                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-4 lg:grid-cols-3">

        {/* Cash Flow Chart */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Cash Position & Forecast"
            subtitle="30-day history + 30-day AI forecast"
            icon={<Activity size={16} />}
            action={
              <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5 text-[11px] font-medium dark:bg-white/5">
                {["30D", "60D", "90D", "180D"].map((range, index) => (
                  <button
                    key={range}
                    className={`rounded-md px-2 py-1 ${
                      index === 0
                        ? "bg-white text-slate-900 shadow-sm dark:bg-ink-700 dark:text-white"
                        : "text-slate-500"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            }
          />

          <CardBody className="pt-2">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={cashFlowSeries}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="cashBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E78FF" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#1E78FF" stopOpacity={0} />
                    </linearGradient>

                    <linearGradient id="cashForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    className="text-slate-200 dark:text-white/5"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    interval={6}
                    stroke="currentColor"
                    className="text-slate-400"
                    tick={{ fontSize: 10, fill: "currentColor" }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    width={48}
                    stroke="currentColor"
                    className="text-slate-400"
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                    tick={{ fontSize: 10, fill: "currentColor" }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    content={
                      <ChartTooltip
                        formatter={(value) => fmtINR(Number(value), { compact: true })}
                      />
                    }
                  />

                  {/* Actual Balance */}
                  <Area
                    type="monotone"
                    dataKey="actual"
                    name="Actual Balance"
                    stroke="#1E78FF"
                    strokeWidth={2.5}
                    fill="url(#cashBalance)"
                    dot={false}
                    activeDot={{ r: 4 }}
                  />

                  {/* AI Forecast */}
                  <Area
                    type="monotone"
                    dataKey="forecast"
                    name="AI Forecast"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="url(#cashForecast)"
                    dot={false}
                    connectNulls
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                Actual Balance
              </span>

              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent-500" />
                AI Forecast
              </span>

              <span className="ml-auto inline-flex items-center gap-2 text-danger-600 dark:text-danger-400">
                <AlertTriangle size={13} />
                Shortage predicted in 18 days
              </span>
            </div>
          </CardBody>
        </Card>

        {/* ============================================================
            Business Health
        ============================================================ */}

        <Card>
          <CardHeader
            title="Business Health"
            subtitle="AI composite score"
            icon={<HeartPulse size={16} />}
            action={<AiPill>AI</AiPill>}
          />

          <CardBody className="flex flex-col items-center">
            <ScoreRing
              score={businessHealth.score}
              min={0}
              max={100}
              label="Health"
              size={140}
            />

            <div className="mt-5 grid w-full grid-cols-2 gap-2">
              {[
                { label: "Liquidity", value: 82, color: "#10B981" },
                { label: "Profitability", value: 68, color: "#1E78FF" },
                { label: "Efficiency", value: 74, color: "#06B6D4" },
                { label: "Stability", value: 71, color: "#F59E0B" },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-white/[0.03]"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">
                      {metric.label}
                    </span>

                    <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                      {metric.value}
                    </span>
                  </div>

                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: metric.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 w-full rounded-xl border border-success-200 bg-success-50 px-4 py-3 dark:border-success-500/20 dark:bg-success-500/10">
              <div className="flex items-start gap-2">
                <TrendingUp
                  size={16}
                  className="mt-0.5 text-success-600 dark:text-success-400"
                />

                <div>
                  <p className="text-[12px] font-semibold text-success-700 dark:text-success-300">
                    AI Assessment
                  </p>

                  <p className="mt-1 text-[11.5px] leading-relaxed text-success-700/90 dark:text-success-200">
                    Your overall financial health is strong. Cash flow remains
                    stable, receivables are under control, and profitability is
                    improving compared to the previous month.
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* AI Insights + Right Rail                                            */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-4 lg:grid-cols-3">

        {/* AI Insights */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="AI Insights & Recommendations"
            subtitle="Generated 12 min ago · Refreshed every hour"
            icon={<Brain size={16} />}
            action={<AiPill>6 New</AiPill>}
          />

          <CardBody className="space-y-3 pt-3">
           <button
               onClick={() => onNavigate("assistant")}
                className="block w-full rounded-xl border border-dashed border-slate-300 py-3 text-center text-[13px] font-medium text-slate-500 transition hover:border-brand-500 hover:text-brand-600 dark:border-white/10 dark:text-slate-400 dark:hover:border-brand-400 dark:hover:text-brand-400"
             >
              Ask Flow AI for more recommendations →
            </button>
          </CardBody>

          
        </Card>

        {/* ------------------------------------------------------------ */}
        {/* Right Rail                                                   */}
        {/* ------------------------------------------------------------ */}

        <div className="space-y-4">

          {/* Cash Snapshot */}
          <Card>
            <CardHeader title="Cash Snapshot" icon={<Landmark size={16} />} />

            <CardBody className="space-y-3 pt-3">
              <Row
                label="Cash Available"
                value={fmtINR(summary.cashBalance, { compact: true })}
                tone="success"
              />

              <Row
                 label="Expected Inflow"
                value={fmtINR(summary.totalReceivables)}
                tone="success"
              />

              <Row
                  label="Expected Outflow"
                  value={fmtINR(summary.totalPayables)}
                  tone="success"
              />

              <div className="my-2 h-px bg-slate-200/70 dark:bg-white/5" />

              <Row
                label="Net Cash Position"
                value={fmtINR(summary.cashBalance, { compact: true, sign: true })}
                tone="brand"
                bold
              />
            </CardBody>
          </Card>

          {/* Credit Score */}
          <Card>
            <CardHeader
              title="Credit Score"
              subtitle="FlowOS AI Scoring"
              icon={<Shield size={16} />}
              action={<AiPill>AI</AiPill>}
            />

            <CardBody className="flex items-center gap-4 pt-3">
              <ScoreRing score={businessHealth.creditScore} size={104} stroke={9} />

              <div className="flex-1">
                <p className="text-[12px] text-slate-500 dark:text-slate-400">
                  Top 38% of your industry segment. Improving DSO to 48 days
                  could increase your score to
                  <span className="font-semibold text-success-600 dark:text-success-400">
                    {" "}
                    780
                  </span>
                  .
                </p>

                <button
                  onClick={() => onNavigate("credit_score")}
                  className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-600 transition hover:text-brand-700 dark:text-brand-400"
                >
                  View Credit Analysis
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Bottom Analytics                                                    */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-4 lg:grid-cols-3">

        {/* Revenue vs Profit */}
        <Card>
          <CardHeader
            title="Revenue vs Profit"
            subtitle="Last 6 months"
            icon={<TrendingUp size={16} />}
          />

          <CardBody className="pt-2">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueSeries}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    className="text-slate-200 dark:text-white/5"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    className="text-slate-400"
                    stroke="currentColor"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    tickFormatter={(v) => `₹${v}L`}
                    tick={{ fontSize: 10, fill: "currentColor" }}
                    className="text-slate-400"
                    stroke="currentColor"
                    tickLine={false}
                    axisLine={false}
                    width={42}
                  />

                  <Tooltip
                    cursor={{ fill: "rgba(148,163,184,0.08)" }}
                    content={<ChartTooltip formatter={(value) => `₹${value}L`} />}
                  />

                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#1E78FF"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={26}
                  />

                  <Bar
                    dataKey="profit"
                    name="Profit"
                    fill="#10B981"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={26}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* ------------------------------------------------------------ */}
        {/* Receivables Aging                                            */}
        {/* ------------------------------------------------------------ */}

        <Card>
          <CardHeader
            title="Receivables Aging"
            subtitle={
              fmtINR(summary.totalReceivables, { compact: true }) + " outstanding"
            }
            icon={<Receipt size={16} />}
          />

          <CardBody className="pt-2">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={receivableAging}
                  layout="vertical"
                  margin={{ top: 4, right: 12, left: 8, bottom: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    className="text-slate-200 dark:text-white/5"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    tickFormatter={(value) => `₹${value}L`}
                    tick={{ fontSize: 10, fill: "currentColor" }}
                    className="text-slate-400"
                    stroke="currentColor"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="agingBucket"
                    width={70}
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    className="text-slate-500 dark:text-slate-400"
                    stroke="currentColor"
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    cursor={{ fill: "rgba(148,163,184,0.08)" }}
                    content={<ChartTooltip formatter={(value) => `₹${value}L`} />}
                  />

                  <Bar
                    dataKey="amount"
                    name="Outstanding"
                    radius={[0, 5, 5, 0]}
                    maxBarSize={22}
                  >
                    {receivableAging.map((item, index) => (
                      <Cell
                        key={item.agingBucket}
                        fill={
                          index === 0
                            ? "#10B981"
                            : index === 1
                            ? "#1E78FF"
                            : index === 2
                            ? "#06B6D4"
                            : index === 3
                            ? "#F59E0B"
                            : "#EF4444"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 space-y-2">
              {receivableAging.map((item) => (
                <div
                  key={item.agingBucket}
                  className="flex items-center justify-between text-[12px]"
                >
                  <span className="text-slate-500 dark:text-slate-400">
                    {item.agingBucket}
                  </span>

                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                    ₹{item.amount}L
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* ------------------------------------------------------------ */}
        {/* Expense Breakdown                                            */}
        {/* ------------------------------------------------------------ */}

        <Card>
          <CardHeader
            title="Expense Breakdown"
            subtitle="This month"
            icon={<CreditCard size={16} />}
          />

          <CardBody className="pt-2">
            <div className="flex items-center gap-4">

              {/* Pie Chart */}
              <div className="h-[180px] w-[180px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      dataKey="amount"
                      nameKey="category"
                      innerRadius={48}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {expenseBreakdown.map((item) => (
                        <Cell key={item.category} fill={"green"} />
                      ))}
                    </Pie>

                    <Tooltip
                      content={<ChartTooltip formatter={(value) => `${value}%`} />}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-3">
                {expenseBreakdown.map((item) => (
                  <div
                    key={item.category}
                    className="flex items-center justify-between text-[12px]"
                  >
                    <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: "green" }}
                      />
                      {item.category}
                    </span>

                    <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Recent Invoices + Funding Requests */}
      {/* ---------------------------------------------------------------- */}

      <div className="grid gap-4 lg:grid-cols-2">

        {/* ================================================================ */}
        {/* Recent Invoices */}
        {/* ================================================================ */}

        <Card>
          <CardHeader
            title="Recent Invoices"
            subtitle="Latest invoices across customers"
            icon={<FileText size={16} />}
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("receivables")}
              >
                View All →
              </Button>
            }
          />

          <CardBody className="pt-0">
            <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {invoices.slice(0, 6).map((invoice) => (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-between py-3"
                >
                  {/* Left */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12.5px] font-semibold text-slate-900 dark:text-white">
                        {invoice.invoiceNumber}
                      </span>

                      <StatusBadge status={invoice.status} />
                    </div>

                    <p className="mt-1 truncate text-[12px] text-slate-500 dark:text-slate-400">
                      {invoice.customerName}
                    </p>

                    <p className="text-[11px] text-slate-400">
                      Due{" "}
                      {new Date(invoice.dueDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Right */}
                  <div className="text-right">
                    <div className="font-display text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
                      {fmtINR(invoice.amount, { compact: true })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* ================================================================ */}
        {/* Funding Requests */}
        {/* ================================================================ */}

        <Card>
          <CardHeader
            title="Active Funding Requests"
            subtitle="Invoice financing marketplace"
            icon={<Sparkles size={16} />}
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("invoices")}
              >
                View All →
              </Button>
            }
          />

          <CardBody className="pt-0">
            <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {fundingRequests.map((request) => (
                <motion.div
                  key={request.requestId}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-between py-3"
                >
                  {/* Left */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12.5px] font-semibold text-slate-900 dark:text-white">
                        {request.lenderName}
                      </span>

                      <StatusBadge status={request.status} />
                    </div>

                    <p className="mt-1 truncate text-[12px] text-slate-500 dark:text-slate-400">
                      {request.lenderName}
                    </p>

                    <p className="text-[11px] text-slate-400">
                      {request.interestRate} lender offers
                      {request.interestRate ? ` • Best ${request.interestRate}%` : ""}
                    </p>
                  </div>

                  {/* Right */}
                  <div className="text-right">
                    <div className="font-display text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
                      {fmtINR(request.requestedAmount, { compact: true })}
                    </div>

                    <div className="mt-1 text-[11px] text-brand-600 dark:text-brand-400">
                      {request.interestRate}% Advance
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              className="mt-5 w-full"
              variant="secondary"
              onClick={() => onNavigate("assistant")}
              icon={<Brain size={16} />}
            >
              Get AI Funding Recommendations
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Row Component                                                               */
/* -------------------------------------------------------------------------- */

function Row({
  label,
  value,
  tone,
  bold = false,
}: {
  label: string;
  value: string;
  tone: "success" | "brand" | "danger";
  bold?: boolean;
}) {
  const color =
    tone === "success"
      ? "text-success-600 dark:text-success-400"
      : tone === "danger"
      ? "text-danger-600 dark:text-danger-400"
      : "text-brand-600 dark:text-brand-400";

  return (
    <div className="flex items-center justify-between">
      <span className="text-[12.5px] text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span
        className={[
          "font-display tabular-nums",
          bold ? "text-base font-bold" : "text-sm font-semibold",
          color,
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Status Badge                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; className: string }> = {
    paid: {
      label: "Paid",
      className:
        "bg-success-500/10 text-success-700 dark:bg-success-500/20 dark:text-success-400",
    },
    overdue: {
      label: "Overdue",
      className:
        "bg-danger-500/10 text-danger-700 dark:bg-danger-500/20 dark:text-danger-400",
    },
    sent: {
      label: "Sent",
      className:
        "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300",
    },
    viewed: {
      label: "Viewed",
      className:
        "bg-brand-500/10 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400",
    },
    partial: {
      label: "Partial",
      className:
        "bg-warning-500/10 text-warning-700 dark:bg-warning-500/20 dark:text-warning-400",
    },
    financed: {
      label: "Financed",
      className:
        "bg-accent-500/10 text-accent-700 dark:bg-accent-500/20 dark:text-accent-400",
    },
    funded: {
      label: "Funded",
      className:
        "bg-success-500/10 text-success-700 dark:bg-success-500/20 dark:text-success-400",
    },
    repaid: {
      label: "Repaid",
      className:
        "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300",
    },
    listed: {
      label: "Listed",
      className:
        "bg-warning-500/10 text-warning-700 dark:bg-warning-500/20 dark:text-warning-400",
    },
    under_review: {
      label: "Under Review",
      className:
        "bg-brand-500/10 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400",
    },
    offers_received: {
      label: "Offers Received",
      className:
        "bg-accent-500/10 text-accent-700 dark:bg-accent-500/20 dark:text-accent-400",
    },
  };

  const key = status.toLowerCase();

  const current =
              statusMap[key] ?? {
                  label: status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
                  className: "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300",
                };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-medium ${current.className}`}
    >
      {current.label}
    </span>
  );
}
