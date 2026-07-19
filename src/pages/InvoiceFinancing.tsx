import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  Upload,
  X,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DataTable, type Column } from '../components/ui/DataTable';
import { StatusPill } from '../components/ui/Badge';
import { AiPill } from '../components/InsightCard';
import { fundingOffers, fundingRequests, invoices, kpi } from '../lib/data';
import type { FundingOffer, FundingRequest, Invoice } from '../types';
import { fmtINR, fmtRate } from '../lib/format';

export function InvoiceFinancing() {
  const [tab, setTab] = useState<'marketplace' | 'requests' | 'upload'>('marketplace');
  const [selected, setSelected] = useState<FundingRequest | null>(null);

  const eligible = invoices.filter((i) => i.financingEligible && i.status !== 'paid' && i.status !== 'financed');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoice Financing Marketplace"
        subtitle="List invoices, receive competing lender offers, and unlock cash in hours"
        badge={<AiPill>AI Buyer Verification</AiPill>}
        actions={
          <Button size="sm" icon={<Plus size={14} />} onClick={() => setTab('upload')}>List Invoice</Button>
        }
      />

      {/* KPI strip */}
      <div className="grid gap-4 sm:grid-cols-4">
        <MiniStat label="Total Funded (YTD)" value={fmtINR(2_84_00_000, { compact: true })} sub="14 invoices" tone="brand" icon={<TrendingUp size={16} />} />
        <MiniStat label="Avg Advance Ratio" value="89%" sub="across all lenders" tone="accent" icon={<BadgeCheck size={16} />} />
        <MiniStat label="Best Rate This Week" value="9.6%" sub="Kotak · 75 days" tone="success" icon={<Sparkles size={16} />} />
        <MiniStat label="Avg Disbursal Time" value="14 hrs" sub="from accept to cash" tone="warning" icon={<Clock size={16} />} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white p-1 text-[12.5px] font-medium dark:border-white/5 dark:bg-ink-850/60">
        {[
          { k: 'marketplace', l: 'Eligible Invoices', n: eligible.length },
          { k: 'requests', l: 'Funding Requests', n: fundingRequests.length },
          { k: 'upload', l: 'Upload New' },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k as typeof tab)}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 transition ${tab === t.k ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'}`}
          >
            {t.l}
            {t.n !== undefined && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${tab === t.k ? 'bg-white/20' : 'bg-slate-200 dark:bg-white/10'}`}>{t.n}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'marketplace' && <Marketplace eligible={eligible} />}
      {tab === 'requests' && <RequestsView onSelect={setSelected} />}
      {tab === 'upload' && <UploadView onDone={() => setTab('marketplace')} />}

      <AnimatePresence>
        {selected && <RequestDrawer request={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

function Marketplace({ eligible }: { eligible: Invoice[] }) {
  const [filter, setFilter] = useState('');
  const rows = eligible.filter((i) => i.customerName.toLowerCase().includes(filter.toLowerCase()) || i.number.toLowerCase().includes(filter.toLowerCase()));

  const columns: Column<Invoice>[] = [
    { key: 'number', header: 'Invoice', render: (r) => (
      <div>
        <div className="font-mono text-[12.5px] font-semibold text-slate-800 dark:text-white">{r.number}</div>
        <div className="text-[11px] text-slate-400">{new Date(r.issuedOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
      </div>
    ) },
    { key: 'customer', header: 'Buyer', render: (r) => (
      <div className="flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-500/10 text-[10px] font-bold text-brand-600 dark:text-brand-400">{r.customerName.slice(0, 2).toUpperCase()}</div>
        <div>
          <div className="text-[12.5px] font-medium text-slate-800 dark:text-white">{r.customerName}</div>
          <div className="text-[11px] text-slate-400">Payment prob. {r.paymentProbability}%</div>
        </div>
      </div>
    ) },
    { key: 'amount', header: 'Amount', align: 'right', render: (r) => (
      <div className="font-display text-[13.5px] font-semibold tabular-nums">{fmtINR(r.total, { compact: true })}</div>
    ) },
    { key: 'due', header: 'Due', render: (r) => (
      <div className="text-[12px] text-slate-600 dark:text-slate-300">
        {new Date(r.dueOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
        <div className="text-[11px] text-slate-400">{r.daysOutstanding}d outstanding</div>
      </div>
    ) },
    { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status} /> },
    { key: 'advance', header: 'Est. Advance', align: 'right', render: (r) => (
      <div className="text-[12.5px]">
        <span className="font-semibold text-success-600 dark:text-success-400">{fmtINR(r.total * 0.9, { compact: true })}</span>
        <span className="text-slate-400"> · 90%</span>
      </div>
    ) },
    { key: 'action', header: '', align: 'right', render: () => (
      <Button size="sm" variant="secondary" icon={<ArrowRight size={13} />}>List</Button>
    ) },
  ];

  return (
    <Card>
      <CardHeader
        title="Eligible Invoices"
        subtitle="AI-verified · ready to list for financing"
        icon={<FileText size={16} />}
        action={
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-white/10 dark:bg-white/5">
            <Search size={13} className="text-slate-400" />
            <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search…" className="w-28 bg-transparent text-[12px] outline-none placeholder:text-slate-400" />
          </div>
        }
      />
      <CardBody className="p-0 pt-2">
        <DataTable
          columns={columns}
          rows={rows}
          empty={<div className="px-5 py-10 text-center text-sm text-slate-400">No eligible invoices match your search.</div>}
        />
      </CardBody>
    </Card>
  );
}

function RequestsView({ onSelect }: { onSelect: (r: FundingRequest) => void }) {
  const columns: Column<FundingRequest>[] = [
    { key: 'inv', header: 'Invoice', render: (r) => <div className="font-mono text-[12.5px] font-semibold">{r.invoiceNumber}</div> },
    { key: 'cust', header: 'Buyer', render: (r) => <span className="text-[12.5px]">{r.customerName}</span> },
    { key: 'amt', header: 'Amount', align: 'right', render: (r) => <span className="font-display font-semibold tabular-nums">{fmtINR(r.amount, { compact: true })}</span> },
    { key: 'adv', header: 'Advance', align: 'right', render: (r) => <span className="text-[12.5px] text-slate-500">{r.advanceRatio}%</span> },
    { key: 'offers', header: 'Offers', align: 'center', render: (r) => (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${r.offers > 0 ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'bg-slate-500/10 text-slate-500'}`}>
        {r.offers} {r.offers > 0 ? 'received' : 'pending'}
      </span>
    ) },
    { key: 'rate', header: 'Best Rate', align: 'right', render: (r) => r.bestRate ? <span className="font-semibold tabular-nums text-success-600 dark:text-success-400">{fmtRate(r.bestRate)}</span> : <span className="text-slate-400">—</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status} /> },
    { key: 'act', header: '', align: 'right', render: (r) => (
      <button onClick={() => onSelect(r)} className="text-[12.5px] font-semibold text-brand-600 dark:text-brand-400">View →</button>
    ) },
  ];
  return (
    <Card>
      <CardHeader title="Funding Requests" subtitle="Track every request end-to-end" icon={<TrendingUp size={16} />} />
      <CardBody className="p-0 pt-2">
        <DataTable columns={columns} rows={fundingRequests} />
      </CardBody>
    </Card>
  );
}

function UploadView({ onDone }: { onDone: () => void }) {
  return (
    <Card>
      <CardHeader title="Upload Invoice for Financing" subtitle="AI will verify the buyer and match lenders in minutes" icon={<Upload size={16} />} action={<AiPill>AI OCR</AiPill>} />
      <CardBody>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 px-6 py-12 text-center transition hover:border-brand-400 hover:bg-brand-500/[0.03] dark:border-white/10 dark:bg-white/[0.02]">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <Upload size={24} />
              </div>
              <h4 className="mt-4 font-display text-base font-semibold">Drag & drop your invoice</h4>
              <p className="mt-1 text-[12.5px] text-slate-500 dark:text-slate-400">PDF, PNG or JPG · max 10MB · AI OCR extracts fields automatically</p>
              <Button className="mt-4" size="sm" icon={<FileText size={14} />}>Choose file</Button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { l: 'Buyer name', v: 'Vertex Industries', ok: true },
                { l: 'Invoice number', v: 'FLW-1458', ok: true },
                { l: 'Amount', v: '₹28,08,400', ok: true },
                { l: 'Due date', v: 'Aug 03, 2025', ok: true },
                { l: 'GSTIN', v: '27AABCV1234R1ZP', ok: true },
                { l: 'Buyer verification', v: 'Verified · 94% pay prob.', ok: true },
              ].map((f) => (
                <div key={f.l} className="flex items-center justify-between rounded-xl border border-slate-200/80 px-3.5 py-2.5 dark:border-white/5">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{f.l}</div>
                    <div className="text-[13px] font-medium text-slate-800 dark:text-white">{f.v}</div>
                  </div>
                  <CheckCircle2 size={16} className="text-success-500" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-5 text-white">
            <Sparkles size={20} />
            <h4 className="mt-2 font-display text-base font-semibold">What happens next</h4>
            <ol className="mt-3 space-y-3 text-[13px]">
              {['AI extracts & verifies invoice fields', 'Buyer creditworthiness checked', '5+ lenders compete in real time', 'You pick the best offer', 'Funds in your bank in 6–24 hrs'].map((s, i) => (
                <li key={s} className="flex gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/20 text-[10px] font-bold">{i + 1}</span>
                  <span className="text-white/90">{s}</span>
                </li>
              ))}
            </ol>
            <Button variant="secondary" className="mt-4 w-full !bg-white !text-brand-700" onClick={onDone}>List on marketplace →</Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function RequestDrawer({ request, onClose }: { request: FundingRequest; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ type: 'spring', stiffness: 360, damping: 36 }}
        className="relative h-full w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-ink-850"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/70 bg-white/90 px-5 py-4 backdrop-blur dark:border-white/5 dark:bg-ink-850/90">
          <div>
            <h3 className="font-display text-base font-semibold">{request.invoiceNumber}</h3>
            <p className="text-[12px] text-slate-500 dark:text-slate-400">{request.customerName} · {fmtINR(request.amount, { compact: true })}</p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"><X size={16} /></button>
        </div>

        <div className="space-y-5 p-5">
          {/* Timeline */}
          <div>
            <h4 className="font-display text-sm font-semibold">Status Timeline</h4>
            <div className="mt-3 space-y-0">
              {request.timeline.map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`grid h-7 w-7 place-items-center rounded-full ${t.done ? 'bg-success-500 text-white' : 'border-2 border-slate-200 bg-white text-slate-300 dark:border-white/10 dark:bg-ink-850'}`}>
                      {t.done ? <CheckCircle2 size={14} /> : <Clock size={12} />}
                    </div>
                    {i < request.timeline.length - 1 && <div className={`h-7 w-0.5 ${t.done ? 'bg-success-500/40' : 'bg-slate-200 dark:bg-white/10'}`} />}
                  </div>
                  <div className="pb-3">
                    <div className={`text-[13px] font-medium ${t.done ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>{t.label}</div>
                    <div className="text-[11px] text-slate-400">{t.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Offers */}
          {request.offers > 0 && (
            <div>
              <h4 className="font-display text-sm font-semibold">Lender Offers ({request.offers})</h4>
              <div className="mt-3 space-y-2.5">
                {fundingOffers.map((o) => <OfferRow key={o.lenderId} offer={o} />)}
              </div>
            </div>
          )}

          <div className="rounded-xl bg-slate-50 p-4 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between text-[12.5px]">
              <span className="text-slate-500 dark:text-slate-400">Advance ratio</span>
              <span className="font-semibold">{request.advanceRatio}%</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[12.5px]">
              <span className="text-slate-500 dark:text-slate-400">Net advance</span>
              <span className="font-semibold text-success-600 dark:text-success-400">{fmtINR(request.amount * request.advanceRatio / 100, { compact: true })}</span>
            </div>
          </div>

          <Button className="w-full" icon={<CheckCircle2 size={15} />}>Accept Best Offer</Button>
        </div>
      </motion.div>
    </div>
  );
}

function OfferRow({ offer }: { offer: FundingOffer }) {
  return (
    <div className="rounded-xl border border-slate-200/80 p-3.5 dark:border-white/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-[10px] font-bold dark:bg-white/5">{offer.lenderName.slice(0, 2).toUpperCase()}</div>
          <div>
            <div className="text-[13px] font-semibold text-slate-800 dark:text-white">{offer.lenderName}</div>
            <div className="text-[10.5px] text-slate-400">{offer.lenderType} · {offer.processingTime}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-base font-bold tabular-nums text-success-600 dark:text-success-400">{fmtRate(offer.rate)}</div>
          <div className="text-[10.5px] text-slate-400">{offer.tenureDays}d</div>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between text-[11.5px] text-slate-500 dark:text-slate-400">
        <span>Net advance <span className="font-semibold text-slate-700 dark:text-slate-200">{fmtINR(offer.netAdvance, { compact: true })}</span></span>
        <span>Fee {fmtINR(offer.fee, { compact: true })}</span>
      </div>
    </div>
  );
}

function MiniStat({ label, value, sub, tone, icon }: { label: string; value: string; sub: string; tone: 'brand' | 'accent' | 'success' | 'warning'; icon: React.ReactNode }) {
  const c = { brand: 'bg-brand-500/10 text-brand-600 dark:text-brand-400', accent: 'bg-accent-500/10 text-accent-600 dark:text-accent-400', success: 'bg-success-500/10 text-success-600 dark:text-success-400', warning: 'bg-warning-500/10 text-warning-600 dark:text-warning-400' }[tone];
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`grid h-9 w-9 place-items-center rounded-xl ${c}`}>{icon}</div>
        <div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">{label}</div>
          <div className="font-display text-lg font-bold tabular-nums text-slate-900 dark:text-white">{value}</div>
        </div>
      </div>
      <div className="mt-2 text-[11px] text-slate-400">{sub}</div>
    </Card>
  );
}
