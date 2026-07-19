import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

export function PageHeader({
  title,
  subtitle,
  actions,
  badge,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-[22px] font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </motion.div>
  );
}

export function SectionTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-display text-[13px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${className}`}>
      {children}
    </h2>
  );
}
