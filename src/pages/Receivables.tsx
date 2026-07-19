import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle, Bell, Brain, FileText, Mail, MessageCircle, Plus, Search, Send, Smartphone } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DataTable, type Column } from '../components/ui/DataTable';
import { StatusPill } from '../components/ui/Badge';
import { ChartTooltip } from '../components/ui/ChartTooltip';
import { AiPill, InsightCard } from '../components/InsightCard';
import { invoices, kpi, receivableAging } from '../lib/data';
import type { Invoice } from '../types';
import { fmtINR, fmtPct } from '../lib/format';

type Filter = 'all' | 'overdue' | 'pending' | 'paid';

export function Receivables() {
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');

  const rows = invoices.filter((i) => {
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'overdue' ? i.status === 'overdue' :
      filter === 'pending' ? ['sent', 'viewed', 'partial'].includes(i.status) :
      i.status === 'paid';
    return matchesFilter && (i.customerName.toLowerCase().includes(q.toLowerCase()) || i.number.toLowerCase().includes(q.toLowerCase()));
  });

  const totalOutstanding = invoices.filter((i) => i.status !== 'paid').reduce((s, i) => s + (i.total - i.paidAmount), 0);
  const overdue = invoices.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.total, 0);
  const paid = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.total, 0);

  const columns: Column<Invoice>[] = [
    { key: 'number', header: 'Invoice', render: (r) => (
      <div>
        <div className="font-mono text-[12.5px] font-semibold text-slate-800 dark:text-white">{r.number}</div>
        <div className="text-[11px] text-slate-400">issued {new Date(r.issuedOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
      </div>
    ) },
    { key: 'customer', header: 'Customer', render: (r) => (
      <div className="flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-500/10 text-[10px] font-bold text-brand-600 dark:text-brand-400">{r.customerName.slice(0, 2).toUpperCase()}</div>
        <span className="text-[12.5px] font-medium text-slate-800 dark:text-white">{r.customerName}</span>
      </div>
    ) },
    { key: 'due', header: 'Due Date', render: (r) => (
      <div>
        <div className="text-[12.5px] text-slate-700 dark:text-slate-200">{new Date(r.dueOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
        <div className={`text-[11px] ${r.daysOutstanding > 0 ? 'text-danger-500' : 'text-slate-400'}`}>{r.daysOutstanding > 0 ? `${r.daysOutstanding}d outstanding` : 'on time'}</div>
      </div>
    ) },
    { key: 'amount', header: 'Amount', align: 'right', render: (r) => (
      <div>
        <div className="font-display text-[13.5px] font-semibold tabular-nums">{fmtINR(r.total, { compact: true })}</div>
        {r.paidAmount > 0 && <div className="text-[11px] text-success-600 dark:text-success-400">{fmtINR(r.paidAmount, { compact: true })} paid</div>}
      </div>
    ) },
    { key: 'prob', header: 'Pay Probability', align: 'center', render: (r) => (
      <div className="inline-flex items-center gap-1.5">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div className={`h-full rounded-full ${r.paymentProbability >= 85 ? 'bg-success-500' : r.paymentProbability >= 65 ? 'bg-brand-500' : r.paymentProbability >= 50 ? 'bg-warning-500' : 'bg-danger-500'}`} style={{ width: `${r.paymentProbability}%` }} />
        </div>
        <span className="text-[11px] font-semibold tabular-nums text-slate-600 dark:text-slate-300">{r.paymentProbability}%</span>
      </div>
    ) },
    { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status} /> },
    { key: 'actions', header: '', align: 'right', render: (r) => (
      <div className="flex items-center justify-end gap-1.5">
        {r.status !== 'paid' && (
          <>
            <button title="Email reminder" className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5"><Mail size={14} /></button>
            <button title="WhatsApp reminder" className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-success-600 hover:bg-success-500/10 dark:border-white/10"><MessageCircle size={14} /></button>
          </>
        )}
        <Button size="sm" variant="ghost">View</Button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounts Receivable"
        subtitle="Track invoices, send reminders, and predict collections with AI"
        badge={<AiPill>AI Payment Prediction</AiPill>}
        actions={<Button size="sm" icon={<Plus size={14} />}>New Invoice</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Total Outstanding</div><div className="mt-1 font-display text-xl font-bold tabular-nums">{fmtINR(totalOutstanding, { compact: true })}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Overdue</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-danger-600 dark:text-danger-400">{fmtINR(overdue, { compact: true })}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Collected (MTD)</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-success-600 dark:text-success-400">{fmtINR(paid, { compact: true })}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Avg DSO</div><div className="mt-1 font-display text-xl font-bold tabular-nums">54 days</div></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Aging */}
        <Card>
          <CardHeader title="Aging Report" subtitle={fmtINR(kpi.pendingReceivables, { compact: true }) + ' outstanding'} icon={<AlertTriangle size={16} />} />
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="h-[160px] w-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={receivableAging} dataKey="amount" nameKey="bucket" innerRadius={42} outerRadius={72} paddingAngle={2}>
                      {receivableAging.map((_, i) => <Cell key={i} fill={['#10B981', '#1E78FF', '#06B6D4', '#F59E0B', '#EF4444'][i]} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip formatter={(v) => `₹${v}L`} />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {receivableAging.map((a, i) => (
                  <div key={a.bucket} className="flex items-center justify-between text-[12px]">
                    <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="h-2 w-2 rounded-full" style={{ background: ['#10B981', '#1E78FF', '#06B6D4', '#F59E0B', '#EF4444'][i] }} /> {a.bucket}
                    </span>
                    <span className="font-semibold tabular-nums">₹{a.amount}L</span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* AI reminders */}
        <Card className="lg:col-span-2">
          <CardHeader title="AI Reminder Recommendations" subtitle="Ranked by response likelihood" icon={<Brain size={16} />} action={<AiPill>3 suggested</AiPill>} />
          <CardBody className="space-y-2.5 pt-3">
            {invoices.filter((i) => i.status === 'overdue' || (i.status === 'sent' && i.daysOutstanding > 15)).slice(0, 3).map((iv, i) => (
              <div key={iv.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 p-3.5 dark:border-white/5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12.5px] font-semibold">{iv.number}</span>
                    <StatusPill status={iv.status} />
                  </div>
                  <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400">{iv.customerName} · {iv.daysOutstanding}d outstanding · {fmtINR(iv.total, { compact: true })}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-success-500/10 px-2 py-0.5 text-[10.5px] font-semibold text-success-600 dark:text-success-400">{iv.paymentProbability}% likely</span>
                  <Button size="sm" variant="secondary" icon={<Smartphone size={13} />}>WhatsApp</Button>
                  <Button size="sm" icon={<Send size={13} />}>Send</Button>
                </div>
              </div>
            ))}
            <button className="block w-full rounded-xl border border-dashed border-slate-300 py-2.5 text-[12.5px] font-medium text-slate-500 hover:border-brand-400 hover:text-brand-600 dark:border-white/10 dark:text-slate-400">
              Auto-remind all overdue (12 customers) →
            </button>
          </CardBody>
        </Card>
      </div>

      {/* Invoices table */}
      <Card>
        <CardHeader
          title="All Invoices"
          subtitle={`${rows.length} invoices`}
          icon={<FileText size={16} />}
          action={
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-white/10 dark:bg-white/5">
                <Search size={13} className="text-slate-400" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-28 bg-transparent text-[12px] outline-none placeholder:text-slate-400" />
              </div>
            </div>
          }
        />
        <div className="flex items-center gap-1 px-5 pb-2 text-[12px] font-medium">
          {([['all', 'All'], ['overdue', 'Overdue'], ['pending', 'Pending'], ['paid', 'Paid']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} className={`rounded-lg px-3 py-1.5 transition ${filter === k ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}>{l}</button>
          ))}
        </div>
        <CardBody className="p-0">
          <DataTable columns={columns} rows={rows} />
        </CardBody>
      </Card>
    </div>
  );
}
