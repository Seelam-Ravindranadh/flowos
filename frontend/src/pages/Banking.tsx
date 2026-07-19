import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, Landmark, Plus, RefreshCw, Search } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DataTable, type Column } from '../components/ui/DataTable';
import { StatusPill } from '../components/ui/Badge';
import { bankAccounts, transactions } from '../lib/data';
import type { Transaction } from '../types';
import { fmtINR, fmtDate } from '../lib/format';

export function Banking() {
  const [q, setQ] = useState('');
  const totalBalance = bankAccounts.reduce((s, b) => s + b.balance, 0);
  const unreconciled = transactions.filter((t) => !t.reconciled).length;
  const rows = transactions.filter((t) => t.description.toLowerCase().includes(q.toLowerCase()) || t.category.toLowerCase().includes(q.toLowerCase()));

  const columns: Column<Transaction>[] = [
    { key: 'date', header: 'Date', render: (r) => <span className="text-[12px] text-slate-500 dark:text-slate-400">{fmtDate(r.date)}</span> },
    { key: 'desc', header: 'Description', render: (r) => (
      <div className="flex items-center gap-2.5">
        <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${r.type === 'inflow' ? 'bg-success-500/10 text-success-600 dark:text-success-400' : 'bg-danger-500/10 text-danger-600 dark:text-danger-400'}`}>
          {r.type === 'inflow' ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
        </div>
        <div><div className="text-[12.5px] font-medium text-slate-800 dark:text-white">{r.description}</div><div className="text-[11px] text-slate-400">{r.bank}</div></div>
      </div>
    ) },
    { key: 'cat', header: 'Category', render: (r) => <span className="inline-flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-slate-400" />{r.category}</span> },
    { key: 'amt', header: 'Amount', align: 'right', render: (r) => (
      <span className={`font-display text-[13.5px] font-semibold tabular-nums ${r.type === 'inflow' ? 'text-success-600 dark:text-success-400' : 'text-slate-800 dark:text-white'}`}>{r.type === 'inflow' ? '+' : '-'}{fmtINR(r.amount, { compact: true })}</span>
    ) },
    { key: 'rec', header: 'Reconciled', align: 'center', render: (r) => r.reconciled ? <CheckCircle2 size={15} className="mx-auto text-success-500" /> : <span className="text-[10.5px] font-semibold text-warning-600 dark:text-warning-400">Pending</span> },
    { key: 'act', header: '', align: 'right', render: () => <Button size="sm" variant="ghost">Match</Button> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Bank Integrations" subtitle="Live balances, transactions & auto-reconciliation" actions={<Button size="sm" icon={<Plus size={14} />}>Connect Bank</Button>} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Total Bank Balance</div><div className="mt-1 font-display text-xl font-bold tabular-nums">{fmtINR(totalBalance, { compact: true })}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Connected Accounts</div><div className="mt-1 font-display text-xl font-bold">{bankAccounts.length}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Unreconciled</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-warning-600 dark:text-warning-400">{unreconciled}</div></Card>
      </div>

      {/* Bank account cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {bankAccounts.map((b, i) => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="relative overflow-hidden p-5">
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-brand-500/15 to-accent-500/15 blur-xl" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                    <Landmark size={18} />
                  </div>
                  <StatusPill status={b.status} />
                </div>
                <div className="mt-3 text-[12px] text-slate-500 dark:text-slate-400">{b.bank}</div>
                <div className="font-mono text-[13px] font-semibold text-slate-800 dark:text-white">{b.account}</div>
                <div className="mt-3 font-display text-xl font-bold tabular-nums text-slate-900 dark:text-white">{fmtINR(b.balance, { compact: true })}</div>
                <div className="mt-1 flex items-center gap-1 text-[10.5px] text-slate-400"><RefreshCw size={10} /> synced {b.lastSync}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader title="Recent Transactions" subtitle={`${rows.length} entries`} icon={<Landmark size={16} />} action={
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-white/10 dark:bg-white/5">
            <Search size={13} className="text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-32 bg-transparent text-[12px] outline-none placeholder:text-slate-400" />
          </div>
        } />
        <CardBody className="p-0">
          <DataTable columns={columns} rows={rows} />
        </CardBody>
      </Card>
    </div>
  );
}
