import { useState } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { KpiCard } from '../components/ui/KpiCard';
import { Button } from '../components/ui/Button';
import { AiPill, InsightCard } from '../components/InsightCard';
import { ScoreRing } from '../components/ui/ScoreRing';
import { PageHeader } from '../components/ui/PageHeader';
import { ChartTooltip } from '../components/ui/ChartTooltip';
import {
  cashFlowSeries,
  expenseBreakdown,
  fundingRequests,
  insights,
  invoices,
  kpi,
  receivableAging,
  revenueSeries,
} from '../lib/data';
import { fmtINR, fmtPct } from '../lib/format';

const spark = (seed: number, n = 12) => Array.from({ length: n }, (_, i) => Math.sin(i / 2 + seed) * 20 + 60 + i * 2);

export function Dashboard({ onNavigate }: { onNavigate: (k: string) => void }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Dashboard"
        subtitle="Aurora Textiles Pvt Ltd · Live cash position, forecast and AI recommendations"
        badge={<AiPill>Flow AI active</AiPill>}
        actions={
          <>
            <Button variant="secondary" size="sm" icon={<Calendar size={14} />}>Last 30 days</Button>
            <Button size="sm" icon={<Plus size={14} />}>New Invoice</Button>
          </>
        }
      />

      {/* KPI grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Cash Available" value={fmtINR(kpi.cashAvailable, { compact: true })} delta={8.2} deltaLabel="vs last month" tone="brand" icon={<Wallet size={18} />} spark={spark(1)} />
        <KpiCard label="Working Capital" value={fmtINR(kpi.workingCapital, { compact: true })} delta={12.4} deltaLabel="+₹46L MoM" tone="accent" icon={<TrendingUp size={18} />} spark={spark(2)} />
        <KpiCard label="Revenue (MTD)" value={fmtINR(kpi.revenueMTD, { compact: true })} delta={5.1} deltaLabel="vs target ₹3.1Cr" tone="success" icon={<ArrowUpRight size={18} />} spark={spark(3)} />
        <KpiCard label="Outstanding Invoices" value={String(kpi.outstandingInvoices)} delta={-3.2} deltaLabel={fmtINR(kpi.pendingReceivables, { compact: true })} tone="warning" icon={<FileText size={18} />} spark={spark(4)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Cash flow chart - spans 2 */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Cash Position & Forecast"
            subtitle="30-day history + 30-day AI forecast"
            icon={<Activity size={16} />}
            action={
              <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5 text-[11px] font-medium dark:bg-white/5">
                {['30D', '60D', '90D', '180D'].map((t, i) => (
                  <button key={t} className={`rounded-md px-2 py-1 ${i === 0 ? 'bg-white text-slate-900 shadow-sm dark:bg-ink-700 dark:text-white' : 'text-slate-500'}`}>{t}</button>
                ))}
              </div>
            }
          />
          <CardBody className="pt-2">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gBal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E78FF" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#1E78FF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gFc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/5" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'currentColor' }} className="text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} interval={6} />
                  <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 10, fill: 'currentColor' }} className="text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} width={48} />
                  <Tooltip content={<ChartTooltip formatter={(v) => fmtINR(Number(v), { compact: true })} />} />
                  <ReferenceLine x="Today" stroke="#1E78FF" strokeDasharray="4 4" strokeOpacity={0.5} />
                  <Area type="monotone" dataKey="balance" name="Actual Balance" stroke="#1E78FF" strokeWidth={2.5} fill="url(#gBal)" dot={false} />
                  <Area type="monotone" dataKey="balance" name="Forecast" stroke="#06B6D4" strokeWidth={2} strokeDasharray="5 5" fill="url(#gFc)" dot={false} connectNulls />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-[11.5px] text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand-500" /> Actual</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent-500" /> AI Forecast</span>
              <span className="ml-auto inline-flex items-center gap-1.5 text-danger-600 dark:text-danger-400"><AlertTriangle size={13} /> Shortage predicted in 18 days</span>
            </div>
          </CardBody>
        </Card>

        {/* Business Health + Credit Score */}
        <Card>
          <CardHeader title="Business Health" subtitle="AI composite score" icon={<HeartPulse size={16} />} action={<AiPill>AI</AiPill>} />
          <CardBody className="flex flex-col items-center">
            <ScoreRing score={kpi.businessHealth} min={0} max={100} label="Health" size={140} />
            <div className="mt-5 grid w-full grid-cols-2 gap-2">
              {[
                { label: 'Liquidity', v: 82, c: '#10B981' },
                { label: 'Profitability', v: 68, c: '#1E78FF' },
                { label: 'Efficiency', v: 74, c: '#06B6D4' },
                { label: 'Stability', v: 71, c: '#F59E0B' },
              ].map((m) => (
                <div key={m.label} className="rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-white/[0.03]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">{m.label}</span>
                    <span className="font-semibold tabular-nums">{m.v}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${m.v}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full rounded-full" style={{ background: m.c }} />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* AI Insights row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="AI Insights & Recommendations"
            subtitle="Generated 12 min ago · refreshed every hour"
            icon={<Brain size={16} />}
            action={<AiPill>6 new</AiPill>}
          />
          <CardBody className="space-y-3 pt-3">
            {insights.slice(0, 4).map((ins, i) => (
              <InsightCard key={ins.id} insight={ins} index={i} />
            ))}
            <button onClick={() => onNavigate('assistant')} className="mx-auto block w-full rounded-xl border border-dashed border-slate-300 py-2.5 text-[12.5px] font-medium text-slate-500 transition hover:border-brand-400 hover:text-brand-600 dark:border-white/10 dark:text-slate-400">
              Ask Flow AI for more recommendations →
            </button>
          </CardBody>
        </Card>

        {/* Right rail: quick stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Cash Snapshot" icon={<Landmark size={16} />} />
            <CardBody className="space-y-3 pt-3">
              <Row label="Cash Available" value={fmtINR(kpi.cashAvailable, { compact: true })} tone="success" />
              <Row label="Expected Inflow (30d)" value={fmtINR(kpi.expectedInflow, { compact: true })} tone="brand" />
              <Row label="Expected Outflow (30d)" value={fmtINR(kpi.expectedOutflow, { compact: true })} tone="danger" />
              <div className="my-2 h-px bg-slate-200/70 dark:bg-white/5" />
              <Row label="Net Cash Position" value={fmtINR(kpi.netCashPosition, { compact: true, sign: true })} tone="brand" bold />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Credit Score" subtitle="FlowOS AI scoring" icon={<Shield size={16} />} action={<AiPill>AI</AiPill>} />
            <CardBody className="flex items-center gap-4 pt-3">
              <ScoreRing score={kpi.creditScore} size={104} stroke={9} />
              <div className="flex-1">
                <p className="text-[12px] text-slate-500 dark:text-slate-400">Top 38% of your segment. Improving DSO to 48d could lift to <span className="font-semibold text-success-600 dark:text-success-400">780</span>.</p>
                <button onClick={() => onNavigate('credit_score')} className="mt-2.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-600 dark:text-brand-400">
                  View breakdown <ArrowUpRight size={13} />
                </button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Bottom: revenue, aging, expenses */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Revenue vs Profit" subtitle="Last 6 months" icon={<TrendingUp size={16} />} />
          <CardBody className="pt-2">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/5" vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: 'currentColor' }} className="text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => `₹${v}L`} tick={{ fontSize: 10, fill: 'currentColor' }} className="text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} width={42} />
                  <Tooltip content={<ChartTooltip formatter={(v) => `₹${v}L`} />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
                  <Bar dataKey="revenue" name="Revenue" fill="#1E78FF" radius={[5, 5, 0, 0]} maxBarSize={26} />
                  <Bar dataKey="profit" name="Profit" fill="#10B981" radius={[5, 5, 0, 0]} maxBarSize={26} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Receivables Aging" subtitle={fmtINR(kpi.pendingReceivables, { compact: true }) + ' outstanding'} icon={<Receipt size={16} />} />
          <CardBody className="pt-2">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={receivableAging} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/5" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `₹${v}L`} tick={{ fontSize: 10, fill: 'currentColor' }} className="text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="bucket" tick={{ fontSize: 11, fill: 'currentColor' }} className="text-slate-500 dark:text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} width={64} />
                  <Tooltip content={<ChartTooltip formatter={(v) => `₹${v}L`} />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
                  <Bar dataKey="amount" name="Outstanding" radius={[0, 5, 5, 0]} maxBarSize={22}>
                    {receivableAging.map((e, i) => (
                      <Cell key={i} fill={i === 0 ? '#10B981' : i === 1 ? '#1E78FF' : i === 2 ? '#06B6D4' : i === 3 ? '#F59E0B' : '#EF4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Expense Breakdown" subtitle="This month" icon={<CreditCard size={16} />} />
          <CardBody className="pt-2">
            <div className="flex items-center gap-4">
              <div className="h-[180px] w-[180px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenseBreakdown} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80} paddingAngle={2}>
                      {expenseBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {expenseBreakdown.map((e) => (
                  <div key={e.name} className="flex items-center justify-between text-[12px]">
                    <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="h-2 w-2 rounded-full" style={{ background: e.color }} /> {e.name}
                    </span>
                    <span className="font-semibold tabular-nums">{e.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent invoices + funding */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Recent Invoices" subtitle="Latest 6 across all customers" icon={<FileText size={16} />} action={<Button variant="ghost" size="sm" onClick={() => onNavigate('receivables')}>View all →</Button>} />
          <CardBody className="pt-0">
            <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
              {invoices.slice(0, 6).map((iv) => (
                <div key={iv.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12.5px] font-semibold text-slate-800 dark:text-white">{iv.number}</span>
                      <StatusBadge status={iv.status} />
                    </div>
                    <p className="mt-0.5 truncate text-[12px] text-slate-500 dark:text-slate-400">{iv.customerName} · due {new Date(iv.dueOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-sm font-semibold tabular-nums text-slate-900 dark:text-white">{fmtINR(iv.total, { compact: true })}</div>
                    <div className="text-[11px] text-slate-400">{iv.daysOutstanding > 0 ? `${iv.daysOutstanding}d outstanding` : 'settled'}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Active Funding Requests" subtitle="Invoice financing pipeline" icon={<Sparkles size={16} />} action={<Button variant="ghost" size="sm" onClick={() => onNavigate('invoices')}>View all →</Button>} />
          <CardBody className="pt-0">
            <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
              {fundingRequests.map((f) => (
                <div key={f.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12.5px] font-semibold text-slate-800 dark:text-white">{f.invoiceNumber}</span>
                      <StatusBadge status={f.status} />
                    </div>
                    <p className="mt-0.5 truncate text-[12px] text-slate-500 dark:text-slate-400">{f.customerName} · {f.offers} offers · best {f.bestRate ? `${f.bestRate}%` : '—'}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-sm font-semibold tabular-nums text-slate-900 dark:text-white">{fmtINR(f.amount, { compact: true })}</div>
                    <div className="text-[11px] text-slate-400">{f.advanceRatio}% advance</div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, tone, bold }: { label: string; value: string; tone: 'success' | 'brand' | 'danger'; bold?: boolean }) {
  const c = tone === 'success' ? 'text-success-600 dark:text-success-400' : tone === 'danger' ? 'text-danger-600 dark:text-danger-400' : 'text-brand-600 dark:text-brand-400';
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12.5px] text-slate-500 dark:text-slate-400">{label}</span>
      <span className={`font-display ${bold ? 'text-base font-bold' : 'text-sm font-semibold'} tabular-nums ${c}`}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { c: string; label: string }> = {
    paid: { c: 'text-success-600 dark:text-success-400 bg-success-500/10', label: 'Paid' },
    overdue: { c: 'text-danger-600 dark:text-danger-400 bg-danger-500/10', label: 'Overdue' },
    sent: { c: 'text-slate-600 dark:text-slate-300 bg-slate-500/10', label: 'Sent' },
    viewed: { c: 'text-slate-600 dark:text-slate-300 bg-slate-500/10', label: 'Viewed' },
    partial: { c: 'text-warning-600 dark:text-warning-400 bg-warning-500/10', label: 'Partial' },
    financed: { c: 'text-brand-600 dark:text-brand-400 bg-brand-500/10', label: 'Financed' },
    funded: { c: 'text-success-600 dark:text-success-400 bg-success-500/10', label: 'Funded' },
    repaid: { c: 'text-slate-600 dark:text-slate-300 bg-slate-500/10', label: 'Repaid' },
    listed: { c: 'text-warning-600 dark:text-warning-400 bg-warning-500/10', label: 'Listed' },
    under_review: { c: 'text-accent-600 dark:text-accent-400 bg-accent-500/10', label: 'Under Review' },
    offers_received: { c: 'text-brand-600 dark:text-brand-400 bg-brand-500/10', label: 'Offers Received' },
  };
  const s = map[status] ?? { c: 'text-slate-500 bg-slate-500/10', label: status };
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-medium ${s.c}`}>{s.label}</span>;
}
