import { type ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

export interface KPIProps {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  icon?: ReactNode;
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'accent' | 'neutral';
  spark?: number[];
  footnote?: string;
}

const toneStyles: Record<string, { iconBg: string; spark: string }> = {
  brand: { iconBg: 'bg-brand-500/10 text-brand-600 dark:text-brand-400', spark: '#1E78FF' },
  success: { iconBg: 'bg-success-500/10 text-success-600 dark:text-success-400', spark: '#10B981' },
  warning: { iconBg: 'bg-warning-500/10 text-warning-600 dark:text-warning-400', spark: '#F59E0B' },
  danger: { iconBg: 'bg-danger-500/10 text-danger-600 dark:text-danger-400', spark: '#EF4444' },
  accent: { iconBg: 'bg-accent-500/10 text-accent-600 dark:text-accent-400', spark: '#06B6D4' },
  neutral: { iconBg: 'bg-slate-500/10 text-slate-600 dark:text-slate-300', spark: '#64748B' },
};

export function KpiCard({ label, value, delta, deltaLabel, icon, tone = 'brand', spark, footnote }: KPIProps) {
  const s = toneStyles[tone];
  const up = (delta ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition hover:shadow-glow dark:border-white/5 dark:bg-ink-850/60"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {icon && <div className={cn('grid h-10 w-10 place-items-center rounded-xl', s.iconBg)}>{icon}</div>}
          <span className="text-[12.5px] font-medium text-slate-500 dark:text-slate-400">{label}</span>
        </div>
        {delta !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums',
              up ? 'text-success-600 dark:text-success-400 bg-success-500/10' : 'text-danger-600 dark:text-danger-400 bg-danger-500/10',
            )}
          >
            {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <div className="font-display text-[26px] font-bold leading-tight tabular-nums text-slate-900 dark:text-white">
            {value}
          </div>
          {(deltaLabel || footnote) && (
            <div className="mt-1 text-[11.5px] text-slate-500 dark:text-slate-400">{deltaLabel ?? footnote}</div>
          )}
        </div>
        {spark && spark.length > 1 && <Sparkline data={spark} color={s.spark} />}
      </div>
    </motion.div>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 84;
  const h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d - min) / range) * h;
    return `${x},${y}`;
  });
  const id = `sl-${color.replace('#', '')}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts.join(' ')} ${w},${h}`} fill={`url(#${id})`} stroke="none" />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
