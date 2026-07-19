import { motion } from 'framer-motion';
import { Brain, CheckCircle2, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ScoreRing } from '../components/ui/ScoreRing';
import { AiPill } from '../components/InsightCard';
import { kpi } from '../lib/data';

const factors = [
  { name: 'Financial Health', score: 78, max: 100, weight: '25%', detail: 'Profitability, margins, and balance sheet strength across the last 6 months.', color: '#1E78FF' },
  { name: 'Cash Flow Stability', score: 71, max: 100, weight: '20%', detail: 'Volatility of operating cash flow — lower variance means higher stability.', color: '#06B6D4' },
  { name: 'Invoice Reliability', score: 84, max: 100, weight: '20%', detail: 'Historical collection rate and payment probability of your buyer base.', color: '#10B981' },
  { name: 'Credit Utilization', score: 68, max: 100, weight: '15%', detail: 'Current debt-to-credit ratio. 68% is healthy; under 60% is optimal.', color: '#F59E0B' },
  { name: 'Repayment History', score: 88, max: 100, weight: '15%', detail: 'On-time repayment track record across all active facilities.', color: '#10B981' },
  { name: 'Business Risk', score: 64, max: 100, weight: '5%', detail: 'Industry, vintage, size and regulatory exposure of your business.', color: '#8B5CF6' },
];

const bands = [
  { range: '300–549', label: 'Poor', color: '#EF4444', pct: 'Bottom 15%' },
  { range: '550–649', label: 'Fair', color: '#F59E0B', pct: '15–35%' },
  { range: '650–749', label: 'Good', color: '#1E78FF', pct: '35–62%' },
  { range: '750–849', label: 'Excellent', color: '#10B981', pct: '62–90%' },
  { range: '850–900', label: 'Elite', color: '#06B6D4', pct: 'Top 10%' },
];

export function CreditScore() {
  const score = kpi.creditScore;
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Credit Score"
        subtitle="Explainable 300–900 scoring engine, refreshed daily by Flow AI"
        badge={<AiPill>AI Scoring Engine</AiPill>}
        actions={<Button variant="secondary" size="sm">Download report</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Score hero */}
        <Card className="lg:col-span-1">
          <CardHeader title="Your FlowOS Score" subtitle="Updated 2 hrs ago" icon={<ShieldCheck size={16} />} />
          <CardBody className="flex flex-col items-center pt-4">
            <ScoreRing score={score} size={180} stroke={12} />
            <div className="mt-4 w-full rounded-xl bg-slate-50 p-3.5 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-slate-500 dark:text-slate-400">Segment rank</span>
                <span className="font-semibold">Top 38%</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[12px]">
                <span className="text-slate-500 dark:text-slate-400">Repayment prediction</span>
                <span className="font-semibold text-success-600 dark:text-success-400">88% on-time</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[12px]">
                <span className="text-slate-500 dark:text-slate-400">Trend (90d)</span>
                <span className="inline-flex items-center gap-1 font-semibold text-success-600 dark:text-success-400"><TrendingUp size={12} /> +18 pts</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Score bands */}
        <Card className="lg:col-span-2">
          <CardHeader title="Score Bands" subtitle="Where you stand vs the SME segment" icon={<Brain size={16} />} />
          <CardBody className="pt-3">
            <div className="relative mb-4">
              <div className="h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-danger-500 via-warning-500 via-brand-500 to-success-500" />
              <motion.div
                initial={{ left: '0%' }}
                animate={{ left: `${((score - 300) / 600) * 100}%` }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -top-1 z-10 h-5 w-5 -translate-x-1/2 rounded-full border-4 border-white bg-brand-600 shadow-lg dark:border-ink-850"
              />
            </div>
            <div className="grid gap-2.5 sm:grid-cols-5">
              {bands.map((b) => {
                const active = (b.range === '650–749');
                return (
                  <div key={b.range} className={`rounded-xl border p-3 ${active ? 'border-brand-500/40 bg-brand-500/5' : 'border-slate-200/80 dark:border-white/5'}`}>
                    <div className="h-1.5 w-8 rounded-full" style={{ background: b.color }} />
                    <div className="mt-2 font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-200">{b.range}</div>
                    <div className="text-[12px] font-medium" style={{ color: b.color }}>{b.label}</div>
                    <div className="mt-1 text-[10.5px] text-slate-400">{b.pct}</div>
                    {active && <div className="mt-1.5 inline-flex items-center gap-1 text-[10.5px] font-semibold text-brand-600 dark:text-brand-400"><CheckCircle2 size={11} /> You</div>}
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Factor breakdown */}
      <Card>
        <CardHeader title="Score Factor Breakdown" subtitle="Every factor explained — hover for detail" icon={<Sparkles size={16} />} action={<AiPill>Explainable AI</AiPill>} />
        <CardBody className="space-y-4 pt-3">
          {factors.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-slate-200/80 p-4 dark:border-white/5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-semibold text-slate-800 dark:text-white">{f.name}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-medium text-slate-500 dark:bg-white/5 dark:text-slate-400">weight {f.weight}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg font-bold tabular-nums" style={{ color: f.color }}>{f.score}<span className="text-[11px] text-slate-400">/{f.max}</span></span>
                </div>
              </div>
              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(f.score / f.max) * 100}%` }} transition={{ duration: 1, delay: i * 0.06, ease: 'easeOut' }} className="h-full rounded-full" style={{ background: f.color }} />
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">{f.detail}</p>
            </motion.div>
          ))}
        </CardBody>
      </Card>

      {/* Improvement plan */}
      <Card>
        <CardHeader title="AI Improvement Plan" subtitle="Actions to lift your score to 780+" icon={<Brain size={16} />} action={<AiPill>3 actions</AiPill>} />
        <CardBody className="grid gap-3 pt-3 sm:grid-cols-3">
          {[
            { t: 'Reduce DSO from 54 → 48 days', i: '+22 pts', d: 'Auto-remind overdue customers and offer 2/10 net 30 terms.', c: '#1E78FF' },
            { t: 'Pay down OD facility by ₹30L', i: '+14 pts', d: 'Lowers credit utilization from 68% to 52% — optimal band.', c: '#10B981' },
            { t: 'Finance 2 invoices this month', i: '+8 pts', d: 'Diversifies funding mix and demonstrates active credit management.', c: '#06B6D4' },
          ].map((a) => (
            <div key={a.t} className="rounded-xl border border-slate-200/80 p-4 dark:border-white/5">
              <div className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: `${a.c}1a`, color: a.c }}>{a.i}</div>
              <h4 className="mt-2.5 font-display text-[13.5px] font-semibold text-slate-800 dark:text-white">{a.t}</h4>
              <p className="mt-1 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">{a.d}</p>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
