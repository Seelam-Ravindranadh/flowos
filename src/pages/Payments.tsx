import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CreditCard, Landmark, Plus, Smartphone, Wallet, Zap } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ChartTooltip } from '../components/ui/ChartTooltip';
import { AiPill } from '../components/InsightCard';

const methods = [
  { name: 'UPI', icon: Smartphone, share: 58, color: '#1E78FF', desc: 'Instant collection via UPI ID & QR' },
  { name: 'Cards', icon: CreditCard, share: 22, color: '#06B6D4', desc: 'Visa, Mastercard, RuPay, Amex' },
  { name: 'Net Banking', icon: Landmark, share: 14, color: '#10B981', desc: '60+ banks supported' },
  { name: 'Wallets', icon: Wallet, share: 6, color: '#F59E0B', desc: 'Paytm, Mobikwik, PhonePe' },
];

const recentCollections = [
  { id: 'pay1', customer: 'Crestline Retail', method: 'UPI', amount: 16_75_600, time: '2h ago', status: 'settled' },
  { id: 'pay2', customer: 'Nimbus Electronics', method: 'NEFT', amount: 18_64_400, time: '5h ago', status: 'settled' },
  { id: 'pay3', customer: 'Online Store (Stripe)', method: 'Card', amount: 2_84_300, time: '1d ago', status: 'settled' },
  { id: 'pay4', customer: 'Helix Pharma', method: 'RTGS', amount: 13_92_400, time: '3d ago', status: 'settled' },
  { id: 'pay5', customer: 'Pinnacle Builders', method: 'UPI', amount: 6_40_000, time: '4d ago', status: 'processing' },
];

const monthly = [
  { m: 'Feb', collected: 212, reconciled: 198 },
  { m: 'Mar', collected: 248, reconciled: 232 },
  { m: 'Apr', collected: 268, reconciled: 254 },
  { m: 'May', collected: 241, reconciled: 236 },
  { m: 'Jun', collected: 296, reconciled: 281 },
  { m: 'Jul', collected: 318, reconciled: 302 },
];

export function Payments() {
  return (
    <div className="space-y-6">
      <PageHeader title="Payment Gateway" subtitle="Collect via UPI, cards & net banking with auto-reconciliation" badge={<AiPill>Auto-Reconcile</AiPill>} actions={<Button size="sm" icon={<Plus size={14} />}>Create Link</Button>} />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Collected (MTD)</div><div className="mt-1 font-display text-xl font-bold tabular-nums">₹3.18 Cr</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Auto-Reconciled</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-success-600 dark:text-success-400">95%</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Avg Settlement</div><div className="mt-1 font-display text-xl font-bold tabular-nums">T+1</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Failed</div><div className="mt-1 font-display text-xl font-bold tabular-nums text-danger-600 dark:text-danger-400">0.4%</div></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Payment methods */}
        <Card className="lg:col-span-1">
          <CardHeader title="Payment Methods" subtitle="Share of collections" icon={<CreditCard size={16} />} />
          <CardBody className="space-y-3 pt-3">
            {methods.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.name} className="rounded-xl border border-slate-200/80 p-3.5 dark:border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: `${m.color}1a`, color: m.color }}><Icon size={16} /></div>
                      <div><div className="text-[12.5px] font-semibold text-slate-800 dark:text-white">{m.name}</div><div className="text-[11px] text-slate-400">{m.desc}</div></div>
                    </div>
                    <span className="font-display text-sm font-bold tabular-nums">{m.share}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${m.share}%` }} transition={{ duration: 0.9 }} className="h-full rounded-full" style={{ background: m.color }} />
                  </div>
                </div>
              );
            })}
          </CardBody>
        </Card>

        {/* Collection trend */}
        <Card className="lg:col-span-2">
          <CardHeader title="Collections vs Reconciliation" subtitle="Last 6 months (₹ Lakh)" icon={<Zap size={16} />} />
          <CardBody>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/5" vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: 'currentColor' }} className="text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => `₹${v}L`} tick={{ fontSize: 10, fill: 'currentColor' }} className="text-slate-400" stroke="currentColor" tickLine={false} axisLine={false} width={42} />
                  <Tooltip content={<ChartTooltip formatter={(v) => `₹${v}L`} />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
                  <Bar dataKey="collected" name="Collected" fill="#1E78FF" radius={[5, 5, 0, 0]} maxBarSize={26} />
                  <Bar dataKey="reconciled" name="Reconciled" fill="#10B981" radius={[5, 5, 0, 0]} maxBarSize={26} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent collections */}
      <Card>
        <CardHeader title="Recent Collections" subtitle="Auto-reconciled against invoices" icon={<Wallet size={16} />} />
        <CardBody className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
            {recentCollections.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-success-500/10 text-success-600 dark:text-success-400"><Smartphone size={16} /></div>
                  <div>
                    <div className="text-[13px] font-medium text-slate-800 dark:text-white">{c.customer}</div>
                    <div className="text-[11px] text-slate-400">via {c.method} · {c.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm font-semibold tabular-nums text-success-600 dark:text-success-400">+₹{(c.amount / 100000).toFixed(1)}L</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${c.status === 'settled' ? 'bg-success-500/10 text-success-600 dark:text-success-400' : 'bg-warning-500/10 text-warning-600 dark:text-warning-400'}`}>{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
