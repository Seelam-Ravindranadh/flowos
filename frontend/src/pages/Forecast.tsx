import { useState } from 'react';
import { motion } from 'framer-motion';
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
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertTriangle, Brain, Calendar, Download, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AiPill, InsightCard } from '../components/InsightCard';
import { ChartTooltip } from '../components/ui/ChartTooltip';
import { cashFlowSeries, insights, kpi } from '../lib/data';
import { fmtINR } from '../lib/format';

const HORIZONS = [
  { key: '30', label: '30 days', days: 30 },
  { key: '60', label: '60 days', days: 60 },
  { key: '90', label: '90 days', days: 90 },
  { key: '180', label: '180 days', days: 180 },
] as const;

export function Forecast() {
  const [horizon, setHorizon] = useState<typeof HORIZONS[number]['key']>('30');
  const h = HORIZONS.find((x) => x.key === horizon)!;
  const series = cashFlowSeries.slice(-h.days).concat(
    horizon === '180' ? Array.from({ length: 120 }, (_, i) => ({
      day: 30 + i + 1,
      label: `+${30 + i + 1}d`,
      inflow: Math.round(3_80_000 + Math.sin(i / 4) * 2_10_000 + (i % 9 === 0 ? 8_40_000 : 0)),
      outflow: Math.round(2_90_000 + Math.cos(i / 5) * 1_50_000 + (i % 15 === 0 ? 6_80_000 : 0)),
      net: 0,
      balance: Math.round(1_60_00_000 - i * 1_40_000),
      forecast: true,
    })) : [],
  );

  const minBalance = Math.min(...series.map((s) => s.balance));
  const minIdx = series.findIndex((s) => s.balance === minBalance);
  const shortage = minBalance < 50_00_000;

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Cash Flow Forecast"
        subtitle={`${h.label} ahead · powered by Flow AI predictive engine`}
        badge={<AiPill>AI Forecast</AiPill>}
        actions={
          <>
            <div className="flex items-center gap-0.5 rounded-xl bg-slate-100 p-0.5 text-[12px] font-medium dark:bg-white/5">
              {HORIZONS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setHorizon(t.key)}
                  className={`rounded-lg px-3 py-1.5 transition ${horizon === t.key ? 'bg-white text-slate-900 shadow-sm dark:bg-ink-700 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <Button variant="secondary" size="sm" icon={<Download size={14} />}>Export</Button>
          </>
        }
      />

      {/* AI prediction banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 p-5 text-white"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <Brain size={18} />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold">AI Prediction</h3>
              <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-white/90">
                {shortage
                  ? `Cash is projected to dip to ${fmtINR(minBalance, { compact: true })} around ${series[minIdx]?.label}. Financing FLW-1458 (+₹25.2L) would keep you above the ₹50L safety floor through the entire ${h.label} window.`
                  : `You're projected to stay above the ₹50L safety floor for the next ${h.days} days. Net cash position: +${fmtINR(kpi.netCashPosition, { compact: true })}.`}
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <Stat label="Min Balance" value={fmtINR(minBalance, { compact: true })} />
            <Stat label="Expected Inflow" value={fmtINR(kpi.expectedInflow, { compact: true })} />
            <Stat label="Expected Outflow" value={fmtINR(kpi.expectedOutflow, { compact: true })} />
          </div>
        </div>
      </motion.div>

      {/* Main forecast chart */}
      <Card>
        <CardHeader
          title="Projected Cash Balance"
          subtitle={`${h.days}-day forecast with inflow/outflow bands`}
          icon={<TrendingUp size={16} />}
        />
        <CardBody>
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fcBal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E78FF" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#1E78FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fcIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fcOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/5" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'currentColor' }} className="text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} interval={Math.max(1, Math.floor(series.length / 12))} />
                <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 10, fill: 'currentColor' }} className="text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} width={48} />
                <Tooltip content={<ChartTooltip formatter={(v) => fmtINR(Number(v), { compact: true })} />} />
                <ReferenceLine y={50_00_000} stroke="#EF4444" strokeDasharray="6 4" strokeOpacity={0.6} label={{ value: 'Safety floor ₹50L', position: 'right', fill: '#EF4444', fontSize: 10 }} />
                <ReferenceLine x="Today" stroke="#1E78FF" strokeDasharray="4 4" strokeOpacity={0.5} />
                <Area type="monotone" dataKey="inflow" name="Inflow" stroke="#10B981" strokeWidth={1.5} fill="url(#fcIn)" dot={false} />
                <Area type="monotone" dataKey="outflow" name="Outflow" stroke="#EF4444" strokeWidth={1.5} fill="url(#fcOut)" dot={false} />
                <Area type="monotone" dataKey="balance" name="Cash Balance" stroke="#1E78FF" strokeWidth={2.5} fill="url(#fcBal)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-[11.5px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand-500" /> Cash Balance</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success-500" /> Inflow</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-danger-500" /> Outflow</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-danger-500/70" /> Safety floor</span>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Net cash flow bars */}
        <Card className="lg:col-span-2">
          <CardHeader title="Net Daily Cash Flow" subtitle="Inflow minus outflow, per day" icon={<Calendar size={16} />} />
          <CardBody>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={series.filter((_, i) => i % Math.max(1, Math.floor(series.length / 30)) === 0)} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/5" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'currentColor' }} className="text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 10, fill: 'currentColor' }} className="text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} width={48} />
                  <Tooltip content={<ChartTooltip formatter={(v) => fmtINR(Number(v), { compact: true, sign: true })} />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
                  <Bar dataKey="net" name="Net Flow" radius={[4, 4, 0, 0]} maxBarSize={22}>
                    {series.map((s, i) => (
                      <Cell key={i} fill={s.net >= 0 ? '#10B981' : '#EF4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* AI recommendations */}
        <Card>
          <CardHeader title="AI Recommendations" subtitle="To optimize your forecast" icon={<Brain size={16} />} action={<AiPill>3</AiPill>} />
          <CardBody className="space-y-3 pt-3">
            {insights.filter((i) => i.category === 'cash' || i.category === 'funding' || i.category === 'payables').slice(0, 3).map((ins, i) => (
              <InsightCard key={ins.id} insight={ins} index={i} />
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Scenario planner */}
      <Card>
        <CardHeader title="Scenario Planner" subtitle="See how financing decisions change your runway" icon={<Wallet size={16} />} action={<AiPill>AI</AiPill>} />
        <CardBody>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { name: 'Base case', desc: 'No action', min: 32_00_000, color: '#EF4444', gap: 'Shortage in 18d' },
              { name: 'Finance FLW-1458', desc: '+₹25.2L now', min: 64_00_000, color: '#1E78FF', gap: 'Safe for 45d' },
              { name: 'Finance + Delay payables', desc: '+₹39.4L combined', min: 86_00_000, color: '#10B981', gap: 'Safe for 90d+' },
            ].map((s) => (
              <div key={s.name} className="rounded-xl border border-slate-200/80 p-4 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">{s.name}</h4>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${s.color === '#10B981' ? 'bg-success-500/10 text-success-600 dark:text-success-400' : s.color === '#1E78FF' ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'bg-danger-500/10 text-danger-600 dark:text-danger-400'}`}>
                    {s.color === '#10B981' ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {s.gap}
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">{s.desc}</p>
                <div className="mt-3">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Min projected balance</div>
                  <div className="font-display text-xl font-bold tabular-nums" style={{ color: s.color }}>{fmtINR(s.min, { compact: true })}</div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-white/70">{label}</div>
      <div className="font-display text-lg font-bold tabular-nums">{value}</div>
    </div>
  );
}
