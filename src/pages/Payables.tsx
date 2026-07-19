import { useState } from 'react';
import { Calendar, Clock, Percent, Plus, Search, Sparkles, Wallet } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DataTable, type Column } from '../components/ui/DataTable';
import { StatusPill } from '../components/ui/Badge';
import { AiPill, InsightCard } from '../components/InsightCard';
import { insights, payables, payableAging } from '../lib/data';
import type { Payable } from '../types';
import { fmtINR } from '../lib/format';

export function Payables() {
  const [q, setQ] = useState('');
  const rows = payables.filter((p) => p.vendorName.toLowerCase().includes(q.toLowerCase()) || p.number.toLowerCase().includes(q.toLowerCase()));

  const totalDue = payables.filter((p) => p.status !== 'paid').reduce((s, p) => s + p.amount, 0);
  const overdue = payables.filter((p) => p.status === 'overdue').reduce((s, p) => s + p.amount, 0);
  const discountsAvailable = payables.filter((p) => p.earlyDiscount > 0 && p.status !== 'paid').reduce((s, p) => s + (p.amount * p.earlyDiscount / 100), 0);

  const priorityColor: Record<string, string> = {
    critical: 'bg-danger-500/10 text-danger-600 dark:text-danger-400',
    high: 'bg-warning-500/10 text-warning-600 dark:text-warning-400',
    medium: 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
    low: 'bg-slate-500/10 text-slate-500',
  };

  const columns: Column<Payable>[] = [
    { key: 'number', header: 'Bill #', render: (r) => <span className="font-mono text-[12.5px] font-semibold">{r.number}</span> },
    { key: 'vendor', header: 'Vendor', render: (r) => (
      <div className="flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-accent-500/10 text-[10px] font-bold text-accent-600 dark:text-accent-400">{r.vendorName.slice(0, 2).toUpperCase()}</div>
        <span className="text-[12.5px] font-medium">{r.vendorName}</span>
      </div>
    ) },
    { key: 'due', header: 'Due Date', render: (r) => (
      <div>
        <div className="text-[12.5px]">{new Date(r.dueOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
        <div className={`text-[11px] ${r.daysToDue < 0 ? 'text-danger-500' : r.daysToDue <= 7 ? 'text-warning-500' : 'text-slate-400'}`}>
          {r.daysToDue < 0 ? `${Math.abs(r.daysToDue)}d overdue` : r.daysToDue === 0 ? 'due today' : `in ${r.daysToDue}d`}
        </div>
      </div>
    ) },
    { key: 'amount', header: 'Amount', align: 'right', render: (r) => <span className="font-display text-[13.5px] font-semibold tabular-nums">{fmtINR(r.amount, { compact: true })}</span> },
    { key: 'priority', header: 'Priority', align: 'center', render: (r) => (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ${priorityColor[r.priority]}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" /> {r.priority}
      </span>
    ) },
    { key: 'discount', header: 'Early Disc.', align: 'right', render: (r) => r.earlyDiscount > 0 ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-success-500/10 px-2 py-0.5 text-[11px] font-semibold text-success-600 dark:text-success-400"><Percent size={10} />{r.earlyDiscount}%</span>
    ) : <span className="text-slate-400">—</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status} /> },
    { key: 'act', header: '', align: 'right', render: (r) => r.status !== 'paid' ? <Button size="sm" variant="secondary">Schedule</Button> : <span className="text-[11px] text-slate-400">settled</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounts Payable"
        subtitle="Plan supplier payments, capture early-payment discounts, and optimize cash"
        badge={<AiPill>AI Payment Planner</AiPill>}
        actions={<Button size="sm" icon={<Plus size={14} />}>Add Bill</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Total Due</div><div className="mt-1 font-display text-xl font-bold tabular-nums">{fmtINR(totalDue, { compact: true })}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Overdue</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-danger-600 dark:text-danger-400">{fmtINR(overdue, { compact: true })}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Early-Pay Savings</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-success-600 dark:text-success-400">{fmtINR(discountsAvailable, { compact: true })}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Avg DPO</div><div className="mt-1 font-display text-xl font-bold tabular-nums">28 days</div></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* AI payment planner */}
        <Card className="lg:col-span-2">
          <CardHeader title="AI Payment Planner" subtitle="Optimized schedule to balance cash & vendor health" icon={<Sparkles size={16} />} action={<AiPill>AI</AiPill>} />
          <CardBody className="space-y-2.5 pt-3">
            {[
              { v: 'Apex Machinery', n: 'AM-2207', amt: 12_80_000, action: 'Pay now', reason: '8d overdue · critical · impacts vendor risk score', tone: 'danger' as const },
              { v: 'Marlin Yarns', n: 'MY-441', amt: 8_60_000, action: 'Pay by Aug 12', reason: 'Capture 1.5% early discount → save ₹12,900', tone: 'success' as const },
              { v: 'Trident Supplies', n: 'TR-9982', amt: 14_20_000, action: 'Delay to Aug 14', reason: 'Within terms · frees ₹14.2L for cash gap window', tone: 'brand' as const },
              { v: 'Bluefreight Logistics', n: 'BF-118', amt: 5_20_000, action: 'Pay by Aug 19', reason: '2% early discount available → save ₹10,400', tone: 'success' as const },
            ].map((r) => (
              <div key={r.n} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 p-3.5 dark:border-white/5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12.5px] font-semibold">{r.n}</span>
                    <span className="text-[12px] text-slate-500 dark:text-slate-400">· {r.v}</span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400">{r.reason}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm font-semibold tabular-nums">{fmtINR(r.amt, { compact: true })}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${r.tone === 'danger' ? 'bg-danger-500/10 text-danger-600 dark:text-danger-400' : r.tone === 'success' ? 'bg-success-500/10 text-success-600 dark:text-success-400' : 'bg-brand-500/10 text-brand-600 dark:text-brand-400'}`}>{r.action}</span>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Upcoming due calendar */}
        <Card>
          <CardHeader title="Due This Week" subtitle="Next 7 days" icon={<Calendar size={16} />} />
          <CardBody className="pt-2">
            <div className="space-y-2.5">
              {payables.filter((p) => p.daysToDue >= -10 && p.daysToDue <= 7 && p.status !== 'paid').map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl border border-slate-200/70 p-3 dark:border-white/5">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-center ${p.daysToDue < 0 ? 'bg-danger-500/10 text-danger-600 dark:text-danger-400' : 'bg-brand-500/10 text-brand-600 dark:text-brand-400'}`}>
                    <Clock size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12.5px] font-medium">{p.vendorName}</div>
                    <div className="text-[11px] text-slate-400">{fmtINR(p.amount, { compact: true })} · {p.daysToDue < 0 ? `${Math.abs(p.daysToDue)}d overdue` : `in ${p.daysToDue}d`}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* AI insight */}
      <Card>
        <CardHeader title="AI Recommendations" icon={<Sparkles size={16} />} action={<AiPill>2</AiPill>} />
        <CardBody className="grid gap-3 pt-3 sm:grid-cols-2">
          {insights.filter((i) => i.category === 'payables').slice(0, 2).map((ins, i) => <InsightCard key={ins.id} insight={ins} index={i} />)}
        </CardBody>
      </Card>

      {/* Payables table */}
      <Card>
        <CardHeader title="All Payables" subtitle={`${rows.length} bills`} icon={<Wallet size={16} />} action={
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-white/10 dark:bg-white/5">
            <Search size={13} className="text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-28 bg-transparent text-[12px] outline-none placeholder:text-slate-400" />
          </div>
        } />
        <CardBody className="p-0">
          <DataTable columns={columns} rows={rows} />
        </CardBody>
      </Card>
    </div>
  );
}
