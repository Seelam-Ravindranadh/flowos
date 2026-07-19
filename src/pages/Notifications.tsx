import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  CreditCard,
  FileText,
  Info,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AiPill } from '../components/InsightCard';
import { notifications as notifData } from '../lib/data';
import type { Notification } from '../types';
import { cn } from '../lib/cn';

const typeMeta: Record<Notification['type'], { icon: typeof Bell; c: string }> = {
  cash: { icon: Wallet, c: 'bg-danger-500/10 text-danger-600 dark:text-danger-400' },
  funding: { icon: CheckCircle2, c: 'bg-success-500/10 text-success-600 dark:text-success-400' },
  invoice: { icon: FileText, c: 'bg-brand-500/10 text-brand-600 dark:text-brand-400' },
  payment: { icon: CreditCard, c: 'bg-success-500/10 text-success-600 dark:text-success-400' },
  supplier: { icon: AlertTriangle, c: 'bg-warning-500/10 text-warning-600 dark:text-warning-400' },
  gst: { icon: Info, c: 'bg-brand-500/10 text-brand-600 dark:text-brand-400' },
  ai: { icon: Sparkles, c: 'bg-accent-500/10 text-accent-600 dark:text-accent-400' },
  fraud: { icon: ShieldCheck, c: 'bg-danger-500/10 text-danger-600 dark:text-danger-400' },
};

const filters = ['all', 'unread', 'critical', 'ai'] as const;

export function Notifications() {
  const [filter, setFilter] = useState<typeof filters[number]>('all');
  const [items, setItems] = useState(notifData);

  const rows = items.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    if (filter === 'critical') return n.severity === 'critical';
    if (filter === 'ai') return n.type === 'ai';
    return true;
  });

  const markAll = () => setItems((arr) => arr.map((n) => ({ ...n, read: true })));
  const toggle = (id: string) => setItems((arr) => arr.map((n) => n.id === id ? { ...n, read: !n.read } : n));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification Center"
        subtitle="Cash alerts, funding updates, reminders and AI recommendations"
        badge={<AiPill>AI Smart Alerts</AiPill>}
        actions={<Button variant="secondary" size="sm" onClick={markAll}>Mark all read</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Unread</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-brand-600 dark:text-brand-400">{items.filter((n) => !n.read).length}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Critical</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-danger-600 dark:text-danger-400">{items.filter((n) => n.severity === 'critical').length}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">AI Alerts</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-accent-600 dark:text-accent-400">{items.filter((n) => n.type === 'ai').length}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Total (30d)</div><div className="mt-1 font-display text-xl font-bold tabular-nums">142</div></Card>
      </div>

      <div className="flex items-center gap-1 text-[12px] font-medium">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn('rounded-lg px-3 py-1.5 capitalize transition', filter === f ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5')}>{f}</button>
        ))}
      </div>

      <Card>
        <CardBody className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
            {rows.map((n, i) => {
              const meta = typeMeta[n.type];
              const Icon = meta.icon;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => toggle(n.id)}
                  className={cn('flex cursor-pointer items-start gap-3 px-5 py-4 transition hover:bg-slate-50/80 dark:hover:bg-white/[0.02]', !n.read && 'bg-brand-500/[0.03] dark:bg-brand-500/[0.04]')}
                >
                  <div className={cn('mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl', meta.c)}><Icon size={16} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[13px] font-semibold text-slate-800 dark:text-white">{n.title}</h4>
                      {n.severity === 'critical' && <span className="rounded-full bg-danger-500/10 px-1.5 py-0.5 text-[9.5px] font-bold uppercase text-danger-600 dark:text-danger-400">Critical</span>}
                      {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />}
                    </div>
                    <p className="mt-0.5 text-[12.5px] text-slate-500 dark:text-slate-400">{n.detail}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-slate-400">{n.time}</span>
                </motion.div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
