import type { Currency } from '../types';

export const fmtINR = (n: number, opts: { compact?: boolean; sign?: boolean } = {}) => {
  const { compact = false, sign = false } = opts;
  const abs = Math.abs(n);
  let body: string;
  if (compact) {
    if (abs >= 1_00_00_000) body = `₹${(abs / 1_00_00_000).toFixed(2).replace(/\.00$/, '')} Cr`;
    else if (abs >= 1_00_000) body = `₹${(abs / 1_00_000).toFixed(2).replace(/\.00$/, '')} L`;
    else if (abs >= 1_000) body = `₹${(abs / 1_000).toFixed(1)}K`;
    else body = `₹${abs.toLocaleString('en-IN')}`;
  } else {
    body = `₹${abs.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }
  const prefix = n < 0 ? '-' : sign ? '+' : '';
  return `${prefix}${body}`;
};

export const fmtPct = (n: number, digits = 1) => `${n > 0 ? '+' : ''}${n.toFixed(digits)}%`;

export const fmtNumber = (n: number) => n.toLocaleString('en-IN');

export const fmtRate = (n: number) => `${n.toFixed(2)}%`;

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const fmtDateShort = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

export const relativeDays = (n: number) =>
  n === 0 ? 'today' : n > 0 ? `in ${n}d` : `${Math.abs(n)}d ago`;

export const riskBandFromScore = (s: number) =>
  s >= 750 ? 'low' : s >= 650 ? 'moderate' : s >= 550 ? 'elevated' : 'high';

export const riskColor: Record<string, { text: string; bg: string; dot: string; label: string }> = {
  low: { text: 'text-success-600 dark:text-success-400', bg: 'bg-success-500/10', dot: 'bg-success-500', label: 'Low Risk' },
  moderate: { text: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-500/10', dot: 'bg-brand-500', label: 'Moderate' },
  elevated: { text: 'text-warning-600 dark:text-warning-400', bg: 'bg-warning-500/10', dot: 'bg-warning-500', label: 'Elevated' },
  high: { text: 'text-danger-600 dark:text-danger-400', bg: 'bg-danger-500/10', dot: 'bg-danger-500', label: 'High Risk' },
};

export const statusTone: Record<string, string> = {
  paid: 'text-success-600 dark:text-success-400 bg-success-500/10',
  financed: 'text-brand-600 dark:text-brand-400 bg-brand-500/10',
  sent: 'text-slate-600 dark:text-slate-300 bg-slate-500/10',
  viewed: 'text-slate-600 dark:text-slate-300 bg-slate-500/10',
  draft: 'text-slate-500 dark:text-slate-400 bg-slate-500/10',
  overdue: 'text-danger-600 dark:text-danger-400 bg-danger-500/10',
  partial: 'text-warning-600 dark:text-warning-400 bg-warning-500/10',
  disputed: 'text-danger-600 dark:text-danger-400 bg-danger-500/10',
  funded: 'text-success-600 dark:text-success-400 bg-success-500/10',
  repaid: 'text-slate-600 dark:text-slate-300 bg-slate-500/10',
  accepted: 'text-brand-600 dark:text-brand-400 bg-brand-500/10',
  listed: 'text-warning-600 dark:text-warning-400 bg-warning-500/10',
  under_review: 'text-accent-600 dark:text-accent-400 bg-accent-500/10',
  offers_received: 'text-brand-600 dark:text-brand-400 bg-brand-500/10',
  rejected: 'text-danger-600 dark:text-danger-400 bg-danger-500/10',
  unpaid: 'text-warning-600 dark:text-warning-400 bg-warning-500/10',
  scheduled: 'text-brand-600 dark:text-brand-400 bg-brand-500/10',
  approved: 'text-success-600 dark:text-success-400 bg-success-500/10',
  pending_approval: 'text-warning-600 dark:text-warning-400 bg-warning-500/10',
  submitted: 'text-slate-600 dark:text-slate-300 bg-slate-500/10',
  reimbursed: 'text-success-600 dark:text-success-400 bg-success-500/10',
  flagged: 'text-danger-600 dark:text-danger-400 bg-danger-500/10',
  open: 'text-danger-600 dark:text-danger-400 bg-danger-500/10',
  reviewing: 'text-warning-600 dark:text-warning-400 bg-warning-500/10',
  confirmed: 'text-danger-600 dark:text-danger-400 bg-danger-500/10',
  dismissed: 'text-slate-500 dark:text-slate-400 bg-slate-500/10',
  filed: 'text-success-600 dark:text-success-400 bg-success-500/10',
  upcoming: 'text-brand-600 dark:text-brand-400 bg-brand-500/10',
  draft_tax: 'text-slate-600 dark:text-slate-300 bg-slate-500/10',
};

export const statusLabel = (s: string) =>
  s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export const currencySymbol = (c: Currency) => (c === 'INR' ? '₹' : '$');
