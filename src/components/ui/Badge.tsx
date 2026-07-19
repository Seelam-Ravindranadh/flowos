import { type ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Tone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral' | 'accent';

const toneMap: Record<Tone, string> = {
  brand: 'text-brand-700 dark:text-brand-300 bg-brand-500/10 ring-brand-500/20',
  success: 'text-success-700 dark:text-success-300 bg-success-500/10 ring-success-500/20',
  warning: 'text-warning-700 dark:text-warning-300 bg-warning-500/10 ring-warning-500/20',
  danger: 'text-danger-700 dark:text-danger-300 bg-danger-500/10 ring-danger-500/20',
  neutral: 'text-slate-600 dark:text-slate-300 bg-slate-500/10 ring-slate-500/15',
  accent: 'text-accent-600 dark:text-accent-400 bg-accent-500/10 ring-accent-500/20',
};

export function Badge({
  children,
  tone = 'neutral',
  dot = false,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset',
        toneMap[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function StatusPill({ status, className }: { status: string; className?: string }) {
  // Look up in statusTone, fallback to neutral
  const tones: Record<string, string> = {
    paid: 'text-success-700 dark:text-success-300 bg-success-500/10 ring-success-500/20',
    financed: 'text-brand-700 dark:text-brand-300 bg-brand-500/10 ring-brand-500/20',
    funded: 'text-success-700 dark:text-success-300 bg-success-500/10 ring-success-500/20',
    repaid: 'text-slate-600 dark:text-slate-300 bg-slate-500/10 ring-slate-500/15',
    accepted: 'text-brand-700 dark:text-brand-300 bg-brand-500/10 ring-brand-500/20',
    offers_received: 'text-brand-700 dark:text-brand-300 bg-brand-500/10 ring-brand-500/20',
    sent: 'text-slate-600 dark:text-slate-300 bg-slate-500/10 ring-slate-500/15',
    viewed: 'text-slate-600 dark:text-slate-300 bg-slate-500/10 ring-slate-500/15',
    draft: 'text-slate-500 dark:text-slate-400 bg-slate-500/10 ring-slate-500/15',
    overdue: 'text-danger-700 dark:text-danger-300 bg-danger-500/10 ring-danger-500/20',
    partial: 'text-warning-700 dark:text-warning-300 bg-warning-500/10 ring-warning-500/20',
    disputed: 'text-danger-700 dark:text-danger-300 bg-danger-500/10 ring-danger-500/20',
    listed: 'text-warning-700 dark:text-warning-300 bg-warning-500/10 ring-warning-500/20',
    under_review: 'text-accent-600 dark:text-accent-400 bg-accent-500/10 ring-accent-500/20',
    rejected: 'text-danger-700 dark:text-danger-300 bg-danger-500/10 ring-danger-500/20',
    unpaid: 'text-warning-700 dark:text-warning-300 bg-warning-500/10 ring-warning-500/20',
    scheduled: 'text-brand-700 dark:text-brand-300 bg-brand-500/10 ring-brand-500/20',
    approved: 'text-success-700 dark:text-success-300 bg-success-500/10 ring-success-500/20',
    pending_approval: 'text-warning-700 dark:text-warning-300 bg-warning-500/10 ring-warning-500/20',
    submitted: 'text-slate-600 dark:text-slate-300 bg-slate-500/10 ring-slate-500/15',
    reimbursed: 'text-success-700 dark:text-success-300 bg-success-500/10 ring-success-500/20',
    flagged: 'text-danger-700 dark:text-danger-300 bg-danger-500/10 ring-danger-500/20',
    open: 'text-danger-700 dark:text-danger-300 bg-danger-500/10 ring-danger-500/20',
    reviewing: 'text-warning-700 dark:text-warning-300 bg-warning-500/10 ring-warning-500/20',
    confirmed: 'text-danger-700 dark:text-danger-300 bg-danger-500/10 ring-danger-500/20',
    dismissed: 'text-slate-500 dark:text-slate-400 bg-slate-500/10 ring-slate-500/15',
    filed: 'text-success-700 dark:text-success-300 bg-success-500/10 ring-success-500/20',
    upcoming: 'text-brand-700 dark:text-brand-300 bg-brand-500/10 ring-brand-500/20',
    received: 'text-success-700 dark:text-success-300 bg-success-500/10 ring-success-500/20',
    connected: 'text-success-700 dark:text-success-300 bg-success-500/10 ring-success-500/20',
    available: 'text-slate-600 dark:text-slate-300 bg-slate-500/10 ring-slate-500/15',
    beta: 'text-accent-600 dark:text-accent-400 bg-accent-500/10 ring-accent-500/20',
    synced: 'text-success-700 dark:text-success-300 bg-success-500/10 ring-success-500/20',
    syncing: 'text-accent-600 dark:text-accent-400 bg-accent-500/10 ring-accent-500/20',
    failed: 'text-danger-700 dark:text-danger-300 bg-danger-500/10 ring-danger-500/20',
  };
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset',
        tones[status] ?? tones.draft,
        className,
      )}
    >
      {label}
    </span>
  );
}
