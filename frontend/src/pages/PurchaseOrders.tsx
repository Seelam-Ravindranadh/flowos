import { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, FileStack, Plus } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DataTable, type Column } from '../components/ui/DataTable';
import { StatusPill } from '../components/ui/Badge';
import { purchaseOrders } from '../lib/data';
import type { PurchaseOrder } from '../types';
import { fmtINR, fmtDate } from '../lib/format';

export function PurchaseOrders() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const rows = purchaseOrders.filter((p) =>
    filter === 'all' ? true :
    filter === 'pending' ? p.status === 'pending_approval' || p.status === 'draft' :
    p.status === 'approved' || p.status === 'sent' || p.status === 'received',
  );

  const totalValue = purchaseOrders.reduce((s, p) => s + p.amount, 0);
  const pending = purchaseOrders.filter((p) => p.status === 'pending_approval' || p.status === 'draft').length;

  const columns: Column<PurchaseOrder>[] = [
    { key: 'number', header: 'PO #', render: (r) => <span className="font-mono text-[12.5px] font-semibold">{r.number}</span> },
    { key: 'vendor', header: 'Vendor', render: (r) => <span className="text-[12.5px] font-medium">{r.vendorName}</span> },
    { key: 'created', header: 'Created', render: (r) => <span className="text-[12px] text-slate-500 dark:text-slate-400">{fmtDate(r.createdOn)}</span> },
    { key: 'delivery', header: 'Delivery By', render: (r) => <span className="text-[12px] text-slate-500 dark:text-slate-400">{fmtDate(r.deliveryBy)}</span> },
    { key: 'items', header: 'Items', align: 'center', render: (r) => <span className="text-[12px] tabular-nums">{r.items}</span> },
    { key: 'amount', header: 'Amount', align: 'right', render: (r) => <span className="font-display text-[13.5px] font-semibold tabular-nums">{fmtINR(r.amount, { compact: true })}</span> },
    { key: 'approver', header: 'Approver', render: (r) => <span className="text-[12px] text-slate-500 dark:text-slate-400">{r.approver}</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status} /> },
    { key: 'act', header: '', align: 'right', render: (r) => (
      <div className="flex items-center justify-end gap-1.5">
        {(r.status === 'approved' || r.status === 'received') && <Button size="sm" variant="ghost" icon={<ArrowRight size={13} />}>To Invoice</Button>}
        {r.status === 'pending_approval' && <Button size="sm" icon={<CheckCircle2 size={13} />}>Approve</Button>}
        {r.status === 'draft' && <Button size="sm" variant="secondary">Submit</Button>}
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Purchase Orders" subtitle="Create, approve, track and convert POs to invoices" actions={<Button size="sm" icon={<Plus size={14} />}>New PO</Button>} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Total PO Value</div><div className="mt-1 font-display text-xl font-bold tabular-nums">{fmtINR(totalValue, { compact: true })}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Pending Approval</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-warning-600 dark:text-warning-400">{pending}</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Avg Approval Time</div><div className="mt-1 font-display text-xl font-bold tabular-nums">1.2 days</div></Card>
      </div>

      <Card>
        <CardHeader title="Purchase Orders" icon={<FileStack size={16} />} />
        <div className="flex items-center gap-1 px-5 pb-2 text-[12px] font-medium">
          {([['all', 'All'], ['pending', 'Pending'], ['approved', 'Approved']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} className={`rounded-lg px-3 py-1.5 transition ${filter === k ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}>{l}</button>
          ))}
        </div>
        <CardBody className="p-0">
          <DataTable columns={columns} rows={rows} />
        </CardBody>
      </Card>
    </div>
  );
}
