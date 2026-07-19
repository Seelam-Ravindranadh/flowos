import { useState } from 'react';
import { Mail, Plus, Search, TrendingUp, Users } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DataTable, type Column } from '../components/ui/DataTable';
import { AiPill } from '../components/InsightCard';
import { customers } from '../lib/data';
import type { Customer } from '../types';
import { fmtINR, riskColor } from '../lib/format';

export function Customers() {
  const [q, setQ] = useState('');
  const rows = customers.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.industry.toLowerCase().includes(q.toLowerCase()));

  const totalOutstanding = customers.reduce((s, c) => s + c.outstanding, 0);
  const totalInvoiced = customers.reduce((s, c) => s + c.totalInvoiced, 0);
  const avgPayDays = Math.round(customers.reduce((s, c) => s + c.avgPaymentDays, 0) / customers.length);

  const columns: Column<Customer>[] = [
    { key: 'name', header: 'Customer', render: (r) => (
      <div className="flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/10 text-[11px] font-bold text-brand-600 dark:text-brand-400">{r.name.slice(0, 2).toUpperCase()}</div>
        <div>
          <div className="text-[12.5px] font-semibold text-slate-800 dark:text-white">{r.name}</div>
          <div className="text-[11px] text-slate-400">{r.industry} · since {r.relationshipSince}</div>
        </div>
      </div>
    ) },
    { key: 'gstin', header: 'GSTIN', render: (r) => <span className="font-mono text-[11.5px] text-slate-500 dark:text-slate-400">{r.gstin}</span> },
    { key: 'invoiced', header: 'Total Invoiced', align: 'right', render: (r) => <span className="font-display text-[13px] font-semibold tabular-nums">{fmtINR(r.totalInvoiced, { compact: true })}</span> },
    { key: 'out', header: 'Outstanding', align: 'right', render: (r) => <span className="text-[12.5px] tabular-nums">{fmtINR(r.outstanding, { compact: true })}</span> },
    { key: 'avg', header: 'Avg Pay Time', align: 'center', render: (r) => (
      <span className={`text-[12px] font-semibold ${r.avgPaymentDays > 70 ? 'text-danger-500' : r.avgPaymentDays > 50 ? 'text-warning-500' : 'text-success-600 dark:text-success-400'}`}>{r.avgPaymentDays}d</span>
    ) },
    { key: 'limit', header: 'Credit Limit', align: 'right', render: (r) => <span className="text-[12.5px] tabular-nums text-slate-500">{fmtINR(r.creditLimit, { compact: true })}</span> },
    { key: 'risk', header: 'Risk', render: (r) => {
      const c = riskColor[r.riskBand];
      return <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${c.bg} ${c.text}`}><span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />{c.label}</span>;
    } },
    { key: 'act', header: '', align: 'right', render: () => <Button size="sm" variant="ghost">View</Button> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Customer Management" subtitle="Purchase history, collections, risk and credit limits" badge={<AiPill>AI Risk Scoring</AiPill>} actions={<Button size="sm" icon={<Plus size={14} />}>Add Customer</Button>} />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Active Customers</div><div className="mt-1 font-display text-xl font-bold">{customers.length}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Total Invoiced</div><div className="mt-1 font-display text-xl font-bold tabular-nums">{fmtINR(totalInvoiced, { compact: true })}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Outstanding</div><div className="mt-1 font-display text-xl font-bold tabular-nums">{fmtINR(totalOutstanding, { compact: true })}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Avg Payment Time</div><div className="mt-1 font-display text-xl font-bold tabular-nums">{avgPayDays}d</div></Card>
      </div>

      <Card>
        <CardHeader title="All Customers" subtitle={`${rows.length} accounts`} icon={<Users size={16} />} action={
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
