import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Briefcase, Landmark, Plus, Sparkles, Star, TrendingUp, Zap } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AiPill } from '../components/InsightCard';
import { lenders } from '../lib/data';
import { fmtINR, fmtRate } from '../lib/format';

const products = ['All', 'Invoice Discounting', 'Working Capital Loan', 'Supply Chain Finance', 'Purchase Order Finance', 'Equipment Finance'];

export function FundingMarketplace() {
  const [product, setProduct] = useState('All');
  const rows = lenders.filter((l) => product === 'All' || l.product === product);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Funding Marketplace"
        subtitle="Banks, NBFCs and private lenders competing for your business"
        badge={<AiPill>AI Match</AiPill>}
        actions={<Button size="sm" icon={<Plus size={14} />}>Request Funding</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Active Lenders</div><div className="mt-1 font-display text-xl font-bold">{lenders.length * 12}+</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Best Rate Available</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-success-600 dark:text-success-400">9.6%</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Avg Disbursal</div><div className="mt-1 font-display text-xl font-bold tabular-nums">18 hrs</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Funded (YTD)</div><div className="mt-1 font-display text-xl font-bold tabular-nums">{fmtINR(2_84_00_000, { compact: true })}</div></Card>
      </div>

      {/* AI match banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 p-5 text-white">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15"><Sparkles size={18} /></div>
            <div>
              <h3 className="font-display text-base font-semibold">Your best match: HDFC Invoice Discounting</h3>
              <p className="mt-1 text-[13px] text-white/90">9.8% rate · ₹24.82L net advance on FLW-1458 · disbursal in 24 hrs · 4.8★ lender rating</p>
            </div>
          </div>
          <Button variant="secondary" className="!bg-white !text-brand-700">Accept & apply →</Button>
        </div>
      </motion.div>

      {/* Product filter */}
      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200/80 bg-white p-1 text-[12px] font-medium dark:border-white/5 dark:bg-ink-850/60">
        {products.map((p) => (
          <button key={p} onClick={() => setProduct(p)} className={`rounded-lg px-3 py-1.5 transition ${product === p ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'}`}>{p}</button>
        ))}
      </div>

      {/* Lender cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((l, i) => (
          <motion.div key={l.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card hover className="h-full p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 font-display text-[13px] font-bold text-brand-600 dark:text-brand-400">{l.name.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <h3 className="font-display text-[14px] font-semibold text-slate-900 dark:text-white">{l.name}</h3>
                    <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-medium text-slate-500 dark:bg-white/5 dark:text-slate-400">
                      {l.type === 'Bank' ? <Landmark size={10} /> : l.type === 'NBFC' ? <Briefcase size={10} /> : <Zap size={10} />} {l.type}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 rounded-full bg-warning-500/10 px-2 py-0.5 text-[11px] font-semibold text-warning-600 dark:text-warning-400">
                  <Star size={11} className="fill-current" /> {l.rating}
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-white/[0.03]">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{l.product}</div>
                <div className="mt-1 font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{fmtRate(l.rate)}<span className="text-[11px] font-medium text-slate-400"> / annum</span></div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
                <div><div className="text-slate-400">Max amount</div><div className="font-semibold tabular-nums">{fmtINR(l.maxAmount, { compact: true })}</div></div>
                <div><div className="text-slate-400">Tenure</div><div className="font-semibold">{l.tenure}</div></div>
                <div><div className="text-slate-400">Disbursal</div><div className="font-semibold">{l.disbursal}</div></div>
                <div><div className="text-slate-400">Rating</div><div className="font-semibold">{l.rating} / 5</div></div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1">Apply</Button>
                <Button size="sm" variant="secondary" className="flex-1">Compare</Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
