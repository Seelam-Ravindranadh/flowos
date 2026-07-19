import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, GitBranch, Mail, MessageCircle, Plus, Settings, Sparkles, Zap } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AiPill } from '../components/InsightCard';
import { workflowRules } from '../lib/data';
import type { WorkflowRule } from '../types';
import { cn } from '../lib/cn';

const channelMeta: Record<WorkflowRule['channel'], { icon: typeof Mail; c: string; label: string }> = {
  email: { icon: Mail, c: 'bg-brand-500/10 text-brand-600 dark:text-brand-400', label: 'Email' },
  whatsapp: { icon: MessageCircle, c: 'bg-success-500/10 text-success-600 dark:text-success-400', label: 'WhatsApp' },
  app: { icon: Bell, c: 'bg-accent-500/10 text-accent-600 dark:text-accent-400', label: 'In-app' },
  system: { icon: Settings, c: 'bg-slate-500/10 text-slate-500', label: 'System' },
};

export function Workflows() {
  const [rules, setRules] = useState(workflowRules);
  const toggle = (id: string) => setRules((arr) => arr.map((r) => r.id === id ? { ...r, active: !r.active } : r));
  const activeCount = rules.filter((r) => r.active).length;
  const totalRuns = rules.reduce((s, r) => s + r.runs, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Workflow Automation" subtitle="Approvals, reminders, and a no-code rule engine" badge={<AiPill>Rule Engine</AiPill>} actions={<Button size="sm" icon={<Plus size={14} />}>New Rule</Button>} />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Active Rules</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-success-600 dark:text-success-400">{activeCount}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Total Runs (30d)</div><div className="mt-1 font-display text-xl font-bold tabular-nums">{totalRuns}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Hours Saved</div><div className="mt-1 font-display text-xl font-bold tabular-nums">128h</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Success Rate</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-success-600 dark:text-success-400">99.2%</div></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Rule list */}
        <Card className="lg:col-span-2">
          <CardHeader title="Automation Rules" icon={<GitBranch size={16} />} />
          <CardBody className="space-y-2.5 pt-3">
            {rules.map((r, i) => {
              const meta = channelMeta[r.channel];
              const Icon = meta.icon;
              return (
                <motion.div key={r.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 p-4 dark:border-white/5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className={cn(r.active ? 'text-brand-500' : 'text-slate-300')} />
                      <h4 className="text-[13px] font-semibold text-slate-800 dark:text-white">{r.name}</h4>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11.5px]">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-white/5 dark:text-slate-300"><span className="text-slate-400">when</span> {r.trigger}</span>
                      <span className="text-slate-300">→</span>
                      <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5', meta.c)}><Icon size={11} /> {r.action}</span>
                    </div>
                    <div className="mt-1.5 text-[10.5px] text-slate-400">{r.runs} runs · last {r.lastRun}</div>
                  </div>
                  <button
                    onClick={() => toggle(r.id)}
                    className={cn('relative h-6 w-11 shrink-0 rounded-full transition', r.active ? 'bg-brand-500' : 'bg-slate-200 dark:bg-white/10')}
                  >
                    <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', r.active ? 'left-[22px]' : 'left-0.5')} />
                  </button>
                </motion.div>
              );
            })}
          </CardBody>
        </Card>

        {/* Workflow builder preview */}
        <Card>
          <CardHeader title="Rule Builder" subtitle="No-code visual builder" icon={<Sparkles size={16} />} action={<AiPill>Drag & drop</AiPill>} />
          <CardBody className="pt-3">
            <div className="space-y-2">
              {[
                { l: 'Trigger', v: 'Invoice overdue +3d', c: 'border-brand-500/40 bg-brand-500/5' },
                { l: 'Condition', v: 'Amount > ₹1,00,000', c: 'border-warning-500/40 bg-warning-500/5' },
                { l: 'Action', v: 'Send WhatsApp + email', c: 'border-success-500/40 bg-success-500/5' },
              ].map((s) => (
                <div key={s.l} className={cn('rounded-xl border p-3', s.c)}>
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{s.l}</div>
                  <div className="mt-0.5 text-[12.5px] font-medium text-slate-800 dark:text-white">{s.v}</div>
                </div>
              ))}
            </div>
            <Button className="mt-3 w-full" size="sm">Create Rule</Button>
          </CardBody>
        </Card>
      </div>

      {/* Approval workflows */}
      <Card>
        <CardHeader title="Approval Workflows" subtitle="Multi-step finance & purchase approvals" icon={<GitBranch size={16} />} />
        <CardBody className="grid gap-3 pt-3 sm:grid-cols-2">
          {[
            { t: 'Purchase Order Approval', steps: ['Submit', 'Manager Review', 'CFO Approve', 'Issue PO'], active: 28 },
            { t: 'Invoice Approval', steps: ['Receive', '3-way Match', 'Finance Approve', 'Pay'], active: 142 },
            { t: 'Expense Approval', steps: ['Submit', 'Manager Approve', 'Reimburse'], active: 64 },
            { t: 'Funding Approval', steps: ['List', 'Buyer Verify', 'Accept Offer', 'Disburse'], active: 14 },
          ].map((w) => (
            <div key={w.t} className="rounded-xl border border-slate-200/80 p-4 dark:border-white/5">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-[13px] font-semibold text-slate-800 dark:text-white">{w.t}</h4>
                <span className="text-[11px] text-slate-400">{w.active} runs</span>
              </div>
              <div className="mt-3 flex items-center gap-1">
                {w.steps.map((s, i) => (
                  <div key={s} className="flex flex-1 items-center gap-1">
                    <div className="flex-1 truncate rounded-lg bg-slate-100 px-2 py-1.5 text-center text-[10.5px] font-medium text-slate-600 dark:bg-white/5 dark:text-slate-300">{s}</div>
                    {i < w.steps.length - 1 && <span className="text-slate-300">→</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
