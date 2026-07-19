import { type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
  width?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  onRowClick,
  empty,
  className,
  rowKey = (r) => r.id,
}: {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
  className?: string;
  rowKey?: (row: T) => string;
}) {
  if (rows.length === 0 && empty) {
    return <div className="px-5 py-10">{empty}</div>;
  }
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200/80 dark:border-white/5">
            {columns.map((c) => (
              <th
                key={c.key}
                style={{ width: c.width }}
                className={cn(
                  'whitespace-nowrap px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400',
                  c.align === 'right' && 'text-right',
                  c.align === 'center' && 'text-center',
                  c.align !== 'right' && c.align !== 'center' && 'text-left',
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-b border-slate-100/80 transition last:border-0 dark:border-white/[0.03]',
                onRowClick && 'cursor-pointer hover:bg-slate-50/80 dark:hover:bg-white/[0.02]',
              )}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn(
                    'whitespace-nowrap px-5 py-3.5 text-slate-700 dark:text-slate-200',
                    c.align === 'right' && 'text-right tabular-nums',
                    c.align === 'center' && 'text-center',
                    c.className,
                  )}
                >
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
