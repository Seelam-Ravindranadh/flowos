import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Download, FileBarChart, FileSpreadsheet, FileText, Plus, TrendingUp } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DataTable, type Column } from '../components/ui/DataTable';
import { AiPill } from '../components/InsightCard';
import { ChartTooltip } from '../components/ui/ChartTooltip';
import { reports, revenueSeries } from '../lib/data';
import type { ReportItem } from '../types';
import { fmtDate } from '../lib/format';

const pnl = [
  { item: 'Revenue', amount: 364 },
  { item: 'COGS', amount: -241 },
  { item: 'Gross Profit', amount: 123 },
  { item: 'Operating Exp.', amount: -42 },
  { item: 'EBITDA', amount: 81 },
  { item: 'Depreciation', amount: -12 },
  { item: 'Interest', amount: -8 },
  { item: 'Tax', amount: -18 },
  { item: 'Net Profit', amount: 43 },
];

export function Reports() {
  const columns: Column<ReportItem>[] = [
    { key: 'name', header: 'Report', render: (r) => (
      <div className="flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400"><FileText size={15} /></div>
        <div><div className="text-[12.5px] font-semibold text-slate-800 dark:text-white">{r.name}</div><div className="text-[11px] text-slate-400">{r.type}</div></div>
      </div>
    ) },
    { key: 'period', header: 'Period', render: (r) => <span className="text-[12.5px] text-slate-600 dark:text-slate-300">{r.period}</span> },
    { key: 'gen', header: 'Generated', render: (r) => <span className="text-[12px] text-slate-500 dark:text-slate-400">{fmtDate(r.generatedOn)}</span> },
    { key: 'fmt', header: 'Format', align: 'center', render: (r) => (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${r.format === 'PDF' ? 'bg-danger-500/10 text-danger-600 dark:text-danger-400' : 'bg-success-500/10 text-success-600 dark:text-success-400'}`}>
        {r.format === 'PDF' ? <FileText size={10} /> : <FileSpreadsheet size={10} />} {r.format}
      </span>
    ) },
    { key: 'act', header: '', align: 'right', render: (r) => (
      <div className="flex items-center justify-end gap-1.5">
        <Button size="sm" variant="ghost">Preview</Button>
        <Button size="sm" variant="secondary" icon={<Download size={13} />}>Download</Button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" subtitle="Generate & download P&L, balance sheet, cash flow & more" badge={<AiPill>AI Generated</AiPill>} actions={<Button size="sm" icon={<Plus size={14} />}>Generate Report</Button>} />

      {/* Quick reports */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { n: 'P&L Statement', d: 'Revenue, COGS, EBITDA, Net Profit', icon: FileBarChart, c: 'from-brand-500/15 to-brand-500/5 text-brand-600 dark:text-brand-400' },
          { n: 'Balance Sheet', d: 'Assets, liabilities & equity snapshot', icon: FileText, c: 'from-accent-500/15 to-accent-500/5 text-accent-600 dark:text-accent-400' },
          { n: 'Cash Flow', d: 'Operating, investing & financing CF', icon: TrendingUp, c: 'from-success-500/15 to-success-500/5 text-success-600 dark:text-success-400' },
          { n: 'GST Report', d: 'GSTR-1, 3B & 2B reconciliation', icon: FileSpreadsheet, c: 'from-warning-500/15 to-warning-500/5 text-warning-600 dark:text-warning-400' },
        ].map((q, i) => {
          const Icon = q.icon;
          return (
            <motion.div key={q.n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card hover className={`bg-gradient-to-br ${q.c} p-5`}>
                <Icon size={22} />
                <h3 className="mt-3 font-display text-[14px] font-semibold text-slate-900 dark:text-white">{q.n}</h3>
                <p className="mt-1 text-[12px] text-slate-600 dark:text-slate-300">{q.d}</p>
                <Button size="sm" variant="secondary" className="mt-3 !bg-white/80 dark:!bg-white/10">Generate →</Button>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* P&L snapshot */}
        <Card className="lg:col-span-2">
          <CardHeader title="P&L Snapshot" subtitle="July 2025 · ₹ Lakh" icon={<FileBarChart size={16} />} />
          <CardBody>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pnl} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/5" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `₹${v}L`} tick={{ fontSize: 10, fill: 'currentColor' }} className="text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="item" tick={{ fontSize: 11, fill: 'currentColor' }} className="text-slate-500 dark:text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} width={96} />
                  <Tooltip content={<ChartTooltip formatter={(v) => `₹${v}L`} />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
                  <Bar dataKey="amount" name="Amount" radius={[0, 5, 5, 0]} maxBarSize={20}>
                    {pnl.map((p, i) => (
                      <Cell key={i} fill={p.amount < 0 ? '#EF4444' : p.item === 'Net Profit' || p.item === 'Gross Profit' || p.item === 'EBITDA' ? '#10B981' : '#1E78FF'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Revenue vs profit mini */}
        <Card>
          <CardHeader title="Revenue Trend" subtitle="6 months" icon={<TrendingUp size={16} />} />
          <CardBody>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/5" vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: 'currentColor' }} className="text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => `₹${v}L`} tick={{ fontSize: 10, fill: 'currentColor' }} className="text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} width={42} />
                  <Tooltip content={<ChartTooltip formatter={(v) => `₹${v}L`} />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
                  <Bar dataKey="revenue" name="Revenue" fill="#1E78FF" radius={[4, 4, 0, 0]} maxBarSize={22} />
                  <Bar dataKey="profit" name="Profit" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Generated Reports" subtitle={`${reports.length} available`} icon={<FileBarChart size={16} />} />
        <CardBody className="p-0">
          <DataTable columns={columns} rows={reports} />
        </CardBody>
      </Card>
    </div>
  );
}
