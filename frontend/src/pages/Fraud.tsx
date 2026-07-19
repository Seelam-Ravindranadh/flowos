import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Eye, Filter, ShieldAlert, ShieldCheck, Sparkles, XCircle } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DataTable, type Column } from '../components/ui/DataTable';
import { StatusPill } from '../components/ui/Badge';
import { AiPill } from '../components/InsightCard';
import { fraudAlerts } from '../lib/data';
import type { FraudAlert } from '../types';
import { fmtINR, fmtDate } from '../lib/format';
import { cn } from '../lib/cn';

const typeLabel: Record<FraudAlert['type'], string> = {
  duplicate_invoice: 'Duplicate Invoice',
  fake_invoice: 'Fake Invoice',
  unusual_payment: 'Unusual Payment',
  round_trip: 'Circular Flow',
  vendor_anomaly: 'Vendor Anomaly',
};

const sevColor: Record<FraudAlert['severity'], string> = {
  low: 'bg-slate-500/10 text-slate-600 dark:text-slate-300',
  medium: 'bg-warning-500/10 text-warning-600 dark:text-warning-400',
  high: 'bg-danger-500/10 text-danger-600 dark:text-danger-400',
};

export function Fraud() {
  const [items, setItems] = useState(fraudAlerts);
  const open = items.filter((a) => a.status === 'open' || a.status === 'reviewing').length;
  const totalAtRisk = items.filter((a) => a.status !== 'dismissed').reduce((s, a) => s + a.amount, 0);
  const confirmed = items.filter((a) => a.status === 'confirmed').length;

  const update = (id: string, status: FraudAlert['status']) => setItems((arr) => arr.map((a) => a.id === id ? { ...a, status } : a));

  const columns: Column<FraudAlert>[] = [
    { key: 'type', header: 'Type', render: (r) => (
      <div className="flex items-center gap-2.5">
        <div className={cn('grid h-8 w-8 place-items-center rounded-lg', sevColor[r.severity])}>
          {r.severity === 'high' ? <ShieldAlert size={15} /> : <AlertTriangle size={15} />}
        </div>
        <div><div className="text-[12.5px] font-semibold text-slate-800 dark:text-white">{typeLabel[r.type]}</div><div className="text-[11px] text-slate-400">{r.entity}</div></div>
      </div>
    ) },
    { key: 'amount', header: 'Amount at Risk', align: 'right', render: (r) => <span className="font-display text-[13px] font-semibold tabular-nums">{fmtINR(r.amount, { compact: true })}</span> },
    { key: 'sev', header: 'Severity', align: 'center', render: (r) => <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize', sevColor[r.severity])}>{r.severity}</span> },
    { key: 'desc', header: 'Description', render: (r) => <span className="line-clamp-1 text-[12px] text-slate-500 dark:text-slate-400">{r.description}</span> },
    { key: 'det', header: 'Detected', render: (r) => <span className="text-[11.5px] text-slate-400">{fmtDate(r.detectedOn)}</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status} /> },
    { key: 'act', header: '', align: 'right', render: (r) => (
      <div className="flex items-center justify-end gap-1.5">
        {r.status === 'open' && <>
          <Button size="sm" variant="ghost" icon={<Eye size={13} />} onClick={() => update(r.id, 'reviewing')}>Review</Button>
          <Button size="sm" variant="secondary" icon={<CheckCircle2 size={13} />} onClick={() => update(r.id, 'dismissed')}>Dismiss</Button>
        </>}
        {r.status === 'reviewing' && <>
          <Button size="sm" icon={<ShieldAlert size={13} />} onClick={() => update(r.id, 'confirmed')}>Confirm</Button>
          <Button size="sm" variant="secondary" icon={<XCircle size={13} />} onClick={() => update(r.id, 'dismissed')}>Dismiss</Button>
        </>}
        {(r.status === 'confirmed' || r.status === 'dismissed') && <span className="text-[11px] text-slate-400">closed</span>}
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Fraud Detection" subtitle="AI monitors invoices, payments & vendors for anomalies in real time" badge={<AiPill>AI Engine</AiPill>} />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Open Alerts</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-danger-600 dark:text-danger-400">{open}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Amount at Risk</div><div className="mt-1 font-display text-xl font-bold tabular-nums">{fmtINR(totalAtRisk, { compact: true })}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Confirmed (30d)</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-danger-600 dark:text-danger-400">{confirmed}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Blocked (YTD)</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-success-600 dark:text-success-400">{fmtINR(48_00_000, { compact: true })}</div></Card>
      </div>

      {/* AI scan banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-danger-600 via-danger-600 to-warning-600 p-5 text-white">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15"><ShieldCheck size={18} /></div>
            <div>
              <h3 className="font-display text-base font-semibold">Flow AI scanned 1,248 transactions today</h3>
              <p className="mt-1 text-[13px] text-white/90">3 anomalies flagged · 0 confirmed frauds · model accuracy 98.4%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-1.5 text-[12px] font-semibold backdrop-blur">
            <Sparkles size={13} /> Live monitoring
          </div>
        </div>
      </motion.div>

      <Card>
        <CardHeader title="Fraud Alerts" subtitle={`${items.length} detected`} icon={<ShieldAlert size={16} />} action={<Button variant="ghost" size="sm" icon={<Filter size={13} />}>Filter</Button>} />
        <CardBody className="p-0">
          <DataTable columns={columns} rows={items} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Detection Models" subtitle="AI models actively monitoring" icon={<Sparkles size={16} />} action={<AiPill>4 active</AiPill>} />
        <CardBody className="grid gap-3 pt-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: 'Duplicate Invoice', a: '99.1%', d: 'Line-item & vendor fingerprint match' },
            { n: 'Fake Invoice', a: '97.6%', d: 'GSTIN validation & document forensics' },
            { n: 'Unusual Payment', a: '95.3%', d: 'Behavioral anomaly on amount & frequency' },
            { n: 'Vendor Risk Drift', a: '93.8%', d: 'On-time rate & credit score degradation' },
          ].map((m) => (
            <div key={m.n} className="rounded-xl border border-slate-200/80 p-4 dark:border-white/5">
              <ShieldCheck size={18} className="text-brand-500" />
              <h4 className="mt-2 font-display text-[13px] font-semibold text-slate-800 dark:text-white">{m.n}</h4>
              <p className="mt-1 text-[11.5px] text-slate-500 dark:text-slate-400">{m.d}</p>
              <div className="mt-2.5 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Accuracy</span>
                <span className="font-semibold text-success-600 dark:text-success-400">{m.a}</span>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
