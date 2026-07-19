import { type ReactNode } from 'react';

export interface TooltipPayload {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string;
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: ReactNode;
  formatter?: (v: number | string, name: string) => string;
  labelFormatter?: (l: ReactNode) => ReactNode;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur dark:border-white/10 dark:bg-ink-850/95">
      {label !== undefined && (
        <div className="mb-1 font-medium text-slate-500 dark:text-slate-400">
          {labelFormatter ? labelFormatter(label) : label}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-600 dark:text-slate-300">{p.name}</span>
            <span className="ml-auto font-semibold tabular-nums text-slate-900 dark:text-white">
              {formatter && typeof p.value === 'number' ? formatter(p.value, p.name ?? '') : p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
