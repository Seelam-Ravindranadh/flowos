import { useState } from 'react';
import { Building2, Mail, Plus, Search, TrendingUp } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DataTable, type Column } from '../components/ui/DataTable';
import { AiPill } from '../components/InsightCard';
import { vendors } from '../lib/data';
import type { Vendor } from '../types';
import { fmtINR, riskColor } from '../lib/format';

export function Vendors() {
  const [q, setQ] = useState('');
  const rows = vendors.filter((v) => v.name.toLowerCase().includes(q.toLowerCase()) || v.category.toLowerCase().includes(q.toLowerCase()));

  const totalSpent = vendors.reduce((s, v) => s + v.totalSpent, 0);
  const totalOutstanding = vendors.reduce((s, v) => s + v.outstanding, 0);
  const avgPerf = Math.round(vendors.reduce((s, v) => s + v.performance, 0) / vendors.length);

  const columns: Column<Vendor>[] = [
    { key: 'name', header: 'Vendor', render: (r) => (
      <div className="flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent-500/10 text-[11px] font-bold text-accent-600 dark:text-accent-400">{r.name.slice(0, 2).toUpperCase()}</div>
        <div>
          <div className="text-[12.5px] font-semibold text-slate-800 dark:text-white">{r.name}</div>
          <div className="text-[11px] text-slate-400">{r.category}</div>
        </div>
      </div>
    ) },
    { key: 'gstin', header: 'GSTIN', render: (r) => <span className="font-mono text-[11.5px] text-slate-500 dark:text-slate-400">{r.gstin}</span> },
    { key: 'spent', header: 'Total Spent', align: 'right', render: (r) => <span className="font-display text-[13px] font-semibold tabular-nums">{fmtINR(r.totalSpent, { compact: true })}</span> },
    { key: 'out', header: 'Outstanding', align: 'right', render: (r) => <span className="text-[12.5px] tabular-nums">{fmtINR(r.outstanding, { compact: true })}</span> },
    { key: 'delay', header: 'Avg Delay', align: 'center', render: (r) => (
      <span className={`text-[12px] font-semibold ${r.avgDelayDays > 7 ? 'text-danger-500' : r.avgDelayDays > 3 ? 'text-warning-500' : 'text-success-600 dark:text-success-400'}`}>{r.avgDelayDays}d</span>
    ) },
    { key: 'perf', header: 'Performance', align: 'center', render: (r) => (
      <div className="inline-flex items-center gap-1.5">
        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div className={`h-full rounded-full ${r.performance >= 90 ? 'bg-success-500' : r.performance >= 80 ? 'bg-brand-500' : 'bg-warning-500'}`} style={{ width: `${r.performance}%` }} />
        </div>
        <span className="text-[11px] font-semibold tabular-nums">{r.performance}%</span>
      </div>
    ) },
    { key: 'risk', header: 'Risk', render: (r) => {
      const c = riskColor[r.riskBand];
      return <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${c.bg} ${c.text}`}><span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />{c.label}</span>;
    } },
    { key: 'act', header: '', align: 'right', render: () => <Button size="sm" variant="ghost">View</Button> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Vendor Management" subtitle="Performance, risk, and payment history for every supplier" badge={<AiPill>AI Risk Scoring</AiPill>} actions={<Button size="sm" icon={<Plus size={14} />}>Add Vendor</Button>} />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Active Vendors</div><div className="mt-1 font-display text-xl font-bold">{vendors.length}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Total Spent (YTD)</div><div className="mt-1 font-display text-xl font-bold tabular-nums">{fmtINR(totalSpent, { compact: true })}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Outstanding</div><div className="mt-1 font-display text-xl font-bold tabular-nums">{fmtINR(totalOutstanding, { compact: true })}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Avg Performance</div><div className="mt-1 font-display text-xl font-bold tabular-nums">{avgPerf}%</div></Card>
      </div>

      <Card>
        <CardHeader title="All Vendors" subtitle={`${rows.length} suppliers`} icon={<Building2 size={16} />} action={
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
