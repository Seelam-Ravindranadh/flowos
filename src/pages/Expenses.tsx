import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Camera, CheckCircle2, CreditCard, Plus, Repeat, ScanLine, XCircle } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DataTable, type Column } from '../components/ui/DataTable';
import { StatusPill } from '../components/ui/Badge';
import { AiPill } from '../components/InsightCard';
import { ChartTooltip } from '../components/ui/ChartTooltip';
import { expenses, expenseBreakdown } from '../lib/data';
import type { Expense } from '../types';
import { fmtINR, fmtDate } from '../lib/format';

export function Expenses() {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const approved = expenses.filter((e) => e.status === 'approved' || e.status === 'reimbursed').reduce((s, e) => s + e.amount, 0);
  const flagged = expenses.filter((e) => e.status === 'flagged').length;

  const columns: Column<Expense>[] = [
    { key: 'date', header: 'Date', render: (r) => <span className="text-[12px] text-slate-500 dark:text-slate-400">{fmtDate(r.date)}</span> },
    { key: 'cat', header: 'Category', render: (r) => (
      <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-500" /><span className="text-[12.5px] font-medium">{r.category}</span></span>
    ) },
    { key: 'vendor', header: 'Vendor', render: (r) => <span className="text-[12.5px]">{r.vendor}</span> },
    { key: 'by', header: 'Submitted By', render: (r) => <span className="text-[12px] text-slate-500 dark:text-slate-400">{r.submittedBy}</span> },
    { key: 'amt', header: 'Amount', align: 'right', render: (r) => <span className="font-display text-[13px] font-semibold tabular-nums">{fmtINR(r.amount, { compact: true })}</span> },
    { key: 'rec', header: 'Receipt', align: 'center', render: (r) => r.receipt ? <CheckCircle2 size={15} className="mx-auto text-success-500" /> : <XCircle size={15} className="mx-auto text-slate-300" /> },
    { key: 'recur', header: 'Recurring', align: 'center', render: (r) => r.recurring ? <Repeat size={14} className="mx-auto text-brand-500" /> : <span className="text-slate-300">—</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status} /> },
    { key: 'act', header: '', align: 'right', render: () => <Button size="sm" variant="ghost">Review</Button> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Expense Management" subtitle="OCR-powered bills, reimbursements, and recurring expense analytics" badge={<AiPill>AI OCR</AiPill>} actions={<Button size="sm" icon={<Camera size={14} />}>Scan Bill</Button>} />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Total (MTD)</div><div className="mt-1 font-display text-xl font-bold tabular-nums">{fmtINR(total, { compact: true })}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Approved</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-success-600 dark:text-success-400">{fmtINR(approved, { compact: true })}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Flagged</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-danger-600 dark:text-danger-400">{flagged}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Recurring</div><div className="mt-1 font-display text-xl font-bold tabular-nums">{expenses.filter((e) => e.recurring).length}</div></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title="Category Breakdown" icon={<CreditCard size={16} />} />
          <CardBody>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseBreakdown} dataKey="value" nameKey="name" innerRadius={42} outerRadius={72} paddingAngle={2}>
                    {expenseBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-1.5">
              {expenseBreakdown.map((e) => (
                <div key={e.name} className="flex items-center justify-between text-[11.5px]">
                  <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="h-2 w-2 rounded-full" style={{ background: e.color }} />{e.name}</span>
                  <span className="font-semibold tabular-nums">{e.value}%</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* OCR scanner card */}
        <Card className="lg:col-span-2">
          <CardHeader title="AI Bill Scanner" subtitle="Snap a photo — OCR extracts vendor, amount, date & tax" icon={<ScanLine size={16} />} action={<AiPill>AI OCR</AiPill>} />
          <CardBody>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 text-center transition hover:border-brand-400 dark:border-white/10 dark:bg-white/[0.02]">
                <Camera size={28} className="mx-auto text-brand-500" />
                <h4 className="mt-3 font-display text-sm font-semibold">Scan or upload a bill</h4>
                <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">Auto-extracts 12+ fields in &lt;3s</p>
                <Button className="mt-3" size="sm" icon={<Camera size={14} />}>Open Scanner</Button>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.03]">
                <h4 className="font-display text-sm font-semibold">Last scanned</h4>
                <div className="mt-3 space-y-2 text-[12.5px]">
                  {[
                    { l: 'Vendor', v: 'The Leela' },
                    { l: 'Amount', v: '₹24,600' },
                    { l: 'Date', v: '28 Jul 2025' },
                    { l: 'GSTIN', v: '27AAATL1234M1Z5' },
                    { l: 'Category', v: 'Client Meeting (AI)' },
                  ].map((f) => (
                    <div key={f.l} className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{f.l}</span>
                      <span className="font-medium text-slate-800 dark:text-white">{f.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="All Expenses" subtitle={`${expenses.length} submissions`} icon={<CreditCard size={16} />} />
        <CardBody className="p-0">
          <DataTable columns={columns} rows={expenses} />
        </CardBody>
      </Card>
    </div>
  );
}
