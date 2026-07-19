import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3, Download, TrendingUp } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ChartTooltip } from '../components/ui/ChartTooltip';
import { AiPill } from '../components/InsightCard';
import { analyticsTrend, industryBenchmark, kpi, revenueSeries } from '../lib/data';
import { fmtINR } from '../lib/format';

export function Analytics() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Revenue, profit, cash flow and benchmarks across your business" badge={<AiPill>AI Insights</AiPill>} actions={<Button variant="secondary" size="sm" icon={<Download size={14} />}>Export</Button>} />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Revenue (YTD)</div><div className="mt-1 font-display text-xl font-bold tabular-nums">{fmtINR(1_93_20_000, { compact: true })}</div><div className="mt-0.5 text-[11px] font-semibold text-success-600 dark:text-success-400">+12.4% YoY</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Gross Margin</div><div className="mt-1 font-display text-xl font-bold tabular-nums">31%</div><div className="mt-0.5 text-[11px] font-semibold text-success-600 dark:text-success-400">+2.1pp</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Growth Rate</div><div className="mt-1 font-display text-xl font-bold tabular-nums">14.2%</div><div className="mt-0.5 text-[11px] font-semibold text-success-600 dark:text-success-400">vs 9% industry</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Funding Trend</div><div className="mt-1 font-display text-xl font-bold tabular-nums">+89%</div><div className="mt-0.5 text-[11px] font-semibold text-success-600 dark:text-success-400">QoQ</div></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Revenue vs Expense" subtitle="6-month trend" icon={<TrendingUp size={16} />} />
          <CardBody>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsTrend} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/5" vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: 'currentColor' }} className="text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => `₹${v}L`} tick={{ fontSize: 10, fill: 'currentColor' }} className="text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} width={42} />
                  <Tooltip content={<ChartTooltip formatter={(v) => `₹${v}L`} />} />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#1E78FF" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="expense" name="Expense" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="funding" name="Funding" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Receivables vs Payables" subtitle="Working capital composition" icon={<BarChart3 size={16} />} />
          <CardBody>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsTrend} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/5" vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: 'currentColor' }} className="text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => `₹${v}L`} tick={{ fontSize: 10, fill: 'currentColor' }} className="text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} width={42} />
                  <Tooltip content={<ChartTooltip formatter={(v) => `₹${v}L`} />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
                  <Bar dataKey="receivables" name="Receivables" fill="#1E78FF" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="payables" name="Payables" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Industry benchmark */}
      <Card>
        <CardHeader title="Industry Benchmark" subtitle="You vs industry median vs best-in-class" icon={<BarChart3 size={16} />} action={<AiPill>AI</AiPill>} />
        <CardBody className="space-y-3 pt-3">
          {industryBenchmark.map((b) => {
            const max = Math.max(b.you, b.industry, b.best) * 1.2;
            return (
              <div key={b.metric} className="rounded-xl border border-slate-200/80 p-3.5 dark:border-white/5">
                <div className="mb-2 flex items-center justify-between text-[12.5px]">
                  <span className="font-medium text-slate-800 dark:text-white">{b.metric}</span>
                  <span className="text-[11px] text-slate-400">Best-in-class: {b.best}{b.metric.includes('Ratio') ? '' : b.metric.includes('%') ? '%' : ''}</span>
                </div>
                <div className="space-y-1.5">
                  <BenchmarkRow label="You" value={b.you} max={max} color="#1E78FF" suffix={b.metric.includes('Ratio') ? '' : b.metric.includes('%') ? '%' : ''} />
                  <BenchmarkRow label="Industry" value={b.industry} max={max} color="#94A3B8" suffix={b.metric.includes('Ratio') ? '' : b.metric.includes('%') ? '%' : ''} />
                  <BenchmarkRow label="Best" value={b.best} max={max} color="#10B981" suffix={b.metric.includes('Ratio') ? '' : b.metric.includes('%') ? '%' : ''} />
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>
    </div>
  );
}

function BenchmarkRow({ label, value, max, color, suffix }: { label: string; value: number; max: number; color: string; suffix: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-[11px] text-slate-500 dark:text-slate-400">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
        <div className="h-full rounded-full transition-all" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
      <span className="w-12 text-right text-[11.5px] font-semibold tabular-nums">{value}{suffix}</span>
    </div>
  );
}
