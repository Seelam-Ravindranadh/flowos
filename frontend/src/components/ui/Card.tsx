import { type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function Card({
  children,
  className,
  hover = false,
  glass = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border shadow-card transition',
        glass
          ? 'glass'
          : 'bg-white border-slate-200/80 dark:bg-ink-850/60 dark:border-white/5',
        hover && 'hover:shadow-glow hover:-translate-y-0.5',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  icon,
  action,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-start justify-between gap-3 px-5 pt-5', className)}>
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate font-display text-[15px] font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}
