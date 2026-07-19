import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, CheckCircle2, Info, Sparkles, XCircle } from 'lucide-react';
import { cn } from '../lib/cn';
import type { AIInsight } from '../types';

const severityStyle = {
  critical: { ring: 'ring-danger-500/30', bg: 'bg-danger-500/[0.06]', icon: 'text-danger-500', Icon: XCircle },
  warning: { ring: 'ring-warning-500/30', bg: 'bg-warning-500/[0.06]', icon: 'text-warning-500', Icon: AlertTriangle },
  info: { ring: 'ring-brand-500/30', bg: 'bg-brand-500/[0.06]', icon: 'text-brand-500', Icon: Info },
  success: { ring: 'ring-success-500/30', bg: 'bg-success-500/[0.06]', icon: 'text-success-500', Icon: CheckCircle2 },
};

export function InsightCard({ insight, index = 0 }: { insight: AIInsight; index?: number }) {
  const s = severityStyle[insight.severity];
  const Icon = s.Icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={cn('relative overflow-hidden rounded-2xl ring-1 p-4', s.ring, s.bg)}
    >
      <div className="flex items-start gap-3">
        <div className={cn('mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/70 dark:bg-white/5', s.icon)}>
          <Icon size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">{insight.title}</h4>
            <span className="rounded-full bg-white/60 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:bg-white/5 dark:text-slate-400">
              {insight.category}
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">{insight.detail}</p>
          {(insight.action || insight.impact) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {insight.action && (
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-[12px] font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                  {insight.action}
                  <ArrowRight size={13} />
                </button>
              )}
              {insight.impact && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-white/70 px-2.5 py-1.5 text-[12px] font-medium text-success-700 dark:bg-white/5 dark:text-success-400">
                  {insight.impact}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function AiPill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-500/15 to-accent-500/15 px-2.5 py-1 text-[11px] font-semibold text-brand-600 dark:text-brand-300 ring-1 ring-inset ring-brand-500/20', className)}>
      <Sparkles size={12} />
      {children}
    </span>
  );
}
