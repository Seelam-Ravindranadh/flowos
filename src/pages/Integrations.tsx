import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Cloud, Layers, Plug, Plus, RefreshCw, Search } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusPill } from '../components/ui/Badge';
import { AiPill } from '../components/InsightCard';
import { integrations } from '../lib/data';
import type { Integration } from '../types';
import { cn } from '../lib/cn';

const categories = ['All', 'ERP', 'Banking', 'Payments', 'Tax', 'CRM'] as const;

export function Integrations() {
  const [cat, setCat] = useState<typeof categories[number]>('All');
  const [q, setQ] = useState('');
  const rows = integrations.filter((i) => (cat === 'All' || i.category === cat) && i.name.toLowerCase().includes(q.toLowerCase()));
  const connected = integrations.filter((i) => i.status === 'connected').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Integrations" subtitle="Connect your ERP, banks, payments & tax systems" badge={<AiPill>Unified Data Layer</AiPill>} actions={<Button size="sm" icon={<Plus size={14} />}>Browse Marketplace</Button>} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Connected</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-success-600 dark:text-success-400">{connected}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Available</div><div className="mt-1 font-display text-xl font-bold tabular-nums">{integrations.filter((i) => i.status === 'available').length}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Sync Events (24h)</div><div className="mt-1 font-display text-xl font-bold tabular-nums">1,284</div></Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 text-[12px] font-medium">
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={cn('rounded-lg px-3 py-1.5 transition', cat === c ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5')}>{c}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-white/10 dark:bg-white/5">
          <Search size={13} className="text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-32 bg-transparent text-[12px] outline-none placeholder:text-slate-400" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((it, i) => (
          <motion.div key={it.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card hover className="h-full p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 font-display text-[12px] font-bold text-slate-700 dark:from-white/10 dark:to-white/5 dark:text-slate-200">{it.logo}</div>
                  <div>
                    <h3 className="font-display text-[14px] font-semibold text-slate-900 dark:text-white">{it.name}</h3>
                    <span className="text-[10.5px] font-medium uppercase tracking-wide text-slate-400">{it.category}</span>
                  </div>
                </div>
                <StatusPill status={it.status} />
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-400">{it.description}</p>
              {it.status === 'connected' && (
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <RefreshCw size={11} /> synced {it.lastSync}
                </div>
              )}
              <div className="mt-4">
                {it.status === 'connected' ? (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" className="flex-1">Configure</Button>
                    <Button size="sm" variant="ghost" className="flex-1">Sync now</Button>
                  </div>
                ) : (
                  <Button size="sm" className="w-full" variant={it.status === 'beta' ? 'secondary' : 'primary'}>
                    {it.status === 'beta' ? 'Join Beta' : 'Connect'}
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* API access */}
      <Card>
        <CardHeader title="Developer API" subtitle="REST & webhook access for custom integrations" icon={<Plug size={16} />} action={<AiPill>v2.4</AiPill>} />
        <CardBody className="grid gap-3 pt-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200/80 p-4 dark:border-white/5">
            <div className="flex items-center gap-2"><Cloud size={16} className="text-brand-500" /><h4 className="font-display text-[13px] font-semibold">REST API</h4></div>
            <p className="mt-1.5 text-[12px] text-slate-500 dark:text-slate-400">Full CRUD access to invoices, vendors, customers, payments & reports. OAuth2 + API keys.</p>
            <div className="mt-3 rounded-lg bg-slate-900 p-2.5 font-mono text-[11px] text-slate-300 dark:bg-ink-950">
              <span className="text-slate-500">GET</span> /v2/invoices?status=overdue
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/80 p-4 dark:border-white/5">
            <div className="flex items-center gap-2"><Layers size={16} className="text-accent-500" /><h4 className="font-display text-[13px] font-semibold">Webhooks</h4></div>
            <p className="mt-1.5 text-[12px] text-slate-500 dark:text-slate-400">Real-time events for funding, payments, fraud & cash alerts — delivered in &lt;200ms.</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['invoice.paid', 'funding.disbursed', 'fraud.detected', 'cash.warning'].map((e) => (
                <span key={e} className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10.5px] text-slate-600 dark:bg-white/5 dark:text-slate-300">{e}</span>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
