import { motion } from 'framer-motion';
import { AlertTriangle, Calendar, FileBarChart, FileText, Plus, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DataTable, type Column } from '../components/ui/DataTable';
import { StatusPill } from '../components/ui/Badge';
import { AiPill } from '../components/InsightCard';
import { taxFilings } from '../lib/data';
import type { TaxFiling } from '../types';
import { fmtINR, fmtDate } from '../lib/format';

export function Tax() {
  const totalLiability = taxFilings.reduce((s, t) => s + t.liability, 0);
  const totalPaid = taxFilings.reduce((s, t) => s + t.paid, 0);
  const upcoming = taxFilings.filter((t) => t.status === 'upcoming').length;
  const overdue = taxFilings.filter((t) => t.status === 'overdue').length;

  const columns: Column<TaxFiling>[] = [
    { key: 'type', header: 'Filing', render: (r) => <span className="font-mono text-[12.5px] font-semibold">{r.type}</span> },
    { key: 'period', header: 'Period', render: (r) => <span className="text-[12.5px]">{r.period}</span> },
    { key: 'due', header: 'Due Date', render: (r) => <span className="text-[12px] text-slate-500 dark:text-slate-400">{fmtDate(r.dueOn)}</span> },
    { key: 'liab', header: 'Liability', align: 'right', render: (r) => <span className="font-display text-[13px] font-semibold tabular-nums">{r.liability > 0 ? fmtINR(r.liability, { compact: true }) : '—'}</span> },
    { key: 'paid', header: 'Paid', align: 'right', render: (r) => <span className="text-[12.5px] tabular-nums">{r.paid > 0 ? fmtINR(r.paid, { compact: true }) : '—'}</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status === 'draft' ? 'draft' : r.status} /> },
    { key: 'act', header: '', align: 'right', render: (r) => r.status === 'upcoming' ? <Button size="sm" icon={<FileText size={13} />}>File Now</Button> : <Button size="sm" variant="ghost">View</Button> },
  ];

  const calendar = taxFilings.filter((t) => t.status === 'upcoming' || t.status === 'overdue').sort((a, b) => new Date(a.dueOn).getTime() - new Date(b.dueOn).getTime());

  return (
    <div className="space-y-6">
      <PageHeader title="Tax Center" subtitle="GST, TDS, filings, reconciliation and tax calendar" badge={<AiPill>AI Reconciliation</AiPill>} actions={<Button size="sm" icon={<Plus size={14} />}>New Filing</Button>} />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Total Liability</div><div className="mt-1 font-display text-xl font-bold tabular-nums">{fmtINR(totalLiability, { compact: true })}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Paid</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-success-600 dark:text-success-400">{fmtINR(totalPaid, { compact: true })}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Upcoming</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-brand-600 dark:text-brand-400">{upcoming}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Overdue</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-danger-600 dark:text-danger-400">{overdue}</div></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Filings" subtitle="All tax obligations in one place" icon={<FileBarChart size={16} />} />
          <CardBody className="p-0">
            <DataTable columns={columns} rows={taxFilings} />
          </CardBody>
        </Card>

        {/* Tax calendar */}
        <Card>
          <CardHeader title="Tax Calendar" subtitle="Upcoming deadlines" icon={<Calendar size={16} />} />
          <CardBody className="pt-3">
            <div className="space-y-2">
              {calendar.map((t, i) => {
                const days = Math.ceil((new Date(t.dueOn).getTime() - new Date('2025-07-31').getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <motion.div key={t.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 rounded-xl border border-slate-200/80 p-3 dark:border-white/5">
                    <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-center ${days < 0 ? 'bg-danger-500/10 text-danger-600 dark:text-danger-400' : days <= 7 ? 'bg-warning-500/10 text-warning-600 dark:text-warning-400' : 'bg-brand-500/10 text-brand-600 dark:text-brand-400'}`}>
                      <div className="font-display text-[13px] font-bold leading-none">{new Date(t.dueOn).getDate()}</div>
                      <div className="text-[9px] uppercase">{new Date(t.dueOn).toLocaleDateString('en-IN', { month: 'short' })}</div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12.5px] font-semibold text-slate-800 dark:text-white">{t.type}</div>
                      <div className="text-[11px] text-slate-400">{t.period} · {days < 0 ? `${Math.abs(days)}d overdue` : `in ${days}d`}</div>
                    </div>
                    {t.liability > 0 && <span className="text-[11px] font-semibold tabular-nums text-slate-600 dark:text-slate-300">{fmtINR(t.liability, { compact: true })}</span>}
                  </motion.div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="AI Reconciliation Status" subtitle="GSTR-2B auto-matched with purchase register" icon={<Sparkles size={16} />} action={<AiPill>92% ready</AiPill>} />
        <CardBody className="grid gap-3 pt-3 sm:grid-cols-3">
          {[
            { l: 'Matched invoices', v: '248 of 270', c: 'text-success-600 dark:text-success-400' },
            { l: 'Mismatched', v: '14', c: 'text-warning-600 dark:text-warning-400' },
            { l: 'Missing in 2B', v: '8', c: 'text-danger-600 dark:text-danger-400' },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-slate-200/80 p-4 dark:border-white/5">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{s.l}</div>
              <div className={`mt-1 font-display text-xl font-bold tabular-nums ${s.c}`}>{s.v}</div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
