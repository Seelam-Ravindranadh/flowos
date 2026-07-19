import { motion } from 'framer-motion';
import { AlertTriangle, Package, Plus, Sparkles, TrendingUp, Warehouse } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DataTable, type Column } from '../components/ui/DataTable';
import { AiPill, InsightCard } from '../components/InsightCard';
import { insights, inventory } from '../lib/data';
import type { InventoryItem } from '../types';
import { fmtINR } from '../lib/format';

export function Inventory() {
  const totalValue = inventory.reduce((s, i) => s + i.value, 0);
  const financeable = inventory.filter((i) => i.financeable).reduce((s, i) => s + i.value, 0);
  const reorder = inventory.filter((i) => i.qty <= i.reorderLevel);

  const columns: Column<InventoryItem>[] = [
    { key: 'sku', header: 'SKU', render: (r) => <span className="font-mono text-[12px] font-semibold">{r.sku}</span> },
    { key: 'name', header: 'Item', render: (r) => (
      <div><div className="text-[12.5px] font-medium">{r.name}</div><div className="text-[11px] text-slate-400">{r.warehouse}</div></div>
    ) },
    { key: 'qty', header: 'Qty', align: 'right', render: (r) => (
      <div className="text-right">
        <span className="text-[12.5px] font-semibold tabular-nums">{r.qty.toLocaleString('en-IN')}</span>
        <div className={`text-[10.5px] ${r.qty <= r.reorderLevel ? 'text-danger-500 font-semibold' : 'text-slate-400'}`}>reorder @ {r.reorderLevel}</div>
      </div>
    ) },
    { key: 'value', header: 'Value', align: 'right', render: (r) => <span className="font-display text-[13px] font-semibold tabular-nums">{fmtINR(r.value, { compact: true })}</span> },
    { key: 'turnover', header: 'Turnover', align: 'center', render: (r) => <span className="text-[12px] tabular-nums">{r.turnover}x</span> },
    { key: 'days', header: 'Days of Stock', align: 'center', render: (r) => (
      <span className={`text-[12px] font-semibold ${r.daysOfStock < 14 ? 'text-danger-500' : r.daysOfStock > 60 ? 'text-warning-500' : 'text-slate-600 dark:text-slate-300'}`}>{r.daysOfStock}d</span>
    ) },
    { key: 'fin', header: 'Financeable', align: 'center', render: (r) => r.financeable ? <span className="rounded-full bg-success-500/10 px-2 py-0.5 text-[10.5px] font-semibold text-success-600 dark:text-success-400">Yes</span> : <span className="text-slate-400">No</span> },
    { key: 'act', header: '', align: 'right', render: () => <Button size="sm" variant="ghost">Finance</Button> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Finance" subtitle="Stock value, turnover, AI reorder alerts & financing against inventory" badge={<AiPill>AI Reorder</AiPill>} actions={<Button size="sm" icon={<Plus size={14} />}>Add Item</Button>} />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Total Stock Value</div><div className="mt-1 font-display text-xl font-bold tabular-nums">{fmtINR(totalValue, { compact: true })}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Financeable</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-success-600 dark:text-success-400">{fmtINR(financeable, { compact: true })}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Avg Turnover</div><div className="mt-1 font-display text-xl font-bold tabular-nums">9.3x</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Reorder Alerts</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-danger-600 dark:text-danger-400">{reorder.length}</div></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Inventory" subtitle={`${inventory.length} SKUs across 2 warehouses`} icon={<Package size={16} />} />
          <CardBody className="p-0">
            <DataTable columns={columns} rows={inventory} />
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="AI Reorder Suggestions" icon={<Sparkles size={16} />} action={<AiPill>{reorder.length} alerts</AiPill>} />
            <CardBody className="space-y-2.5 pt-3">
              {reorder.length === 0 && <p className="text-[12.5px] text-slate-400">All items above reorder levels.</p>}
              {reorder.map((r) => (
                <motion.div key={r.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 rounded-xl border border-danger-500/20 bg-danger-500/[0.04] p-3">
                  <AlertTriangle size={16} className="shrink-0 text-danger-500" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-semibold text-slate-800 dark:text-white">{r.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{r.qty} in stock · reorder at {r.reorderLevel} · {r.daysOfStock}d left</div>
                  </div>
                  <Button size="sm" variant="secondary">Order</Button>
                </motion.div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Inventory Financing" icon={<TrendingUp size={16} />} />
            <CardBody className="pt-3">
              <div className="rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 p-4 text-white">
                <Warehouse size={20} />
                <p className="mt-2 text-[13px] leading-snug">Unlock <span className="font-semibold">{fmtINR(financeable * 0.6, { compact: true })}</span> against your financeable inventory at 11.8% from 3 lenders.</p>
                <Button variant="secondary" size="sm" className="mt-3 !bg-white !text-brand-700">Get offers →</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader title="AI Insights" icon={<Sparkles size={16} />} />
        <CardBody className="grid gap-3 pt-3 sm:grid-cols-2">
          {insights.filter((i) => i.category === 'growth').slice(0, 2).map((ins, i) => <InsightCard key={ins.id} insight={ins} index={i} />)}
        </CardBody>
      </Card>
    </div>
  );
}
