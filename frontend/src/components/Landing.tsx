import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  Layers,
  LineChart,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react';
import { DarkToggle } from './ui/DarkToggle';
import { Logo } from './Sidebar';
import { Button } from './ui/Button';

const stats = [
  { value: '₹1,000 Cr+', label: 'Funding Facilitated' },
  { value: '50,000+', label: 'Businesses' },
  { value: '100+', label: 'Financial Partners' },
  { value: '24 Hours', label: 'Avg Funding Time' },
];

const modules = [
  { icon: BarChart3, name: 'AI Financial Dashboard', desc: 'Real-time cash, working capital, health score & AI insights.' },
  { icon: FileText, name: 'Invoice Financing', desc: 'List invoices, get 5+ lender offers in hours, accept & disburse.' },
  { icon: LineChart, name: 'Cash Flow Forecast', desc: 'AI predicts 30–180 day cash gaps before they hit.' },
  { icon: Wallet, name: 'Receivables & Payables', desc: 'Automated reminders, aging, payment planner & predictions.' },
  { icon: ShieldCheck, name: 'AI Credit Scoring', desc: '300–900 score with explainable factors & repayment prediction.' },
  { icon: Bot, name: 'AI Financial Assistant', desc: 'ChatGPT-style copilot for every financial decision.' },
  { icon: CreditCard, name: 'Expense Management', desc: 'OCR bills, reimbursements, recurring expense analytics.' },
  { icon: Zap, name: 'Workflow Automation', desc: 'Approvals, reminders, and a rule engine — no code needed.' },
  { icon: Layers, name: 'ERP & Bank Integrations', desc: 'SAP, Oracle, Tally, Zoho, HDFC, ICICI — all unified.' },
];

const partners = ['HDFC Bank', 'ICICI', 'Axis', 'Kotak', 'Razorpay', 'SAP', 'Oracle', 'Zoho', 'Tally', 'Stripe'];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export function Landing({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-ink-950 dark:text-white">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-ink-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="font-display text-lg font-bold">FlowOS</span>
          </div>
          <nav className="ml-6 hidden items-center gap-7 text-[13.5px] font-medium text-slate-600 dark:text-slate-300 lg:flex">
            <a href="#modules" className="hover:text-slate-900 dark:hover:text-white">Platform</a>
            <a href="#ai" className="hover:text-slate-900 dark:hover:text-white">AI</a>
            <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white">Pricing</a>
            <a href="#stats" className="hover:text-slate-900 dark:hover:text-white">Customers</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <DarkToggle />
            <button
              onClick={onEnter}
              className="hidden rounded-xl px-3.5 py-2 text-[13.5px] font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5 sm:block"
            >
              Sign in
            </button>
            <Button size="sm" onClick={onEnter} icon={<ArrowRight size={14} />}>
              Start Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="premium-grid absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-brand-500/20 via-accent-500/10 to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
          <motion.div {...fade(0)} className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3.5 py-1.5 text-[12px] font-semibold text-brand-700 dark:text-brand-300">
              <Sparkles size={13} /> The AI Financial Operating System
            </div>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
              The AI Financial
              <br />
              <span className="gradient-text">Operating System</span> for SMEs
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              Manage cash flow, invoices, suppliers, payments, financing and financial intelligence — all from one intelligent platform built for the modern SME.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" onClick={onEnter} icon={<ArrowRight size={16} />}>
                Start Free
              </Button>
              <Button size="lg" variant="secondary" icon={<PlayCircle size={16} />}>
                Watch Product Tour
              </Button>
              <Button size="lg" variant="ghost" icon={<ChevronRight size={16} />}>
                Book Demo
              </Button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-slate-500 dark:text-slate-400">
              <CheckCircle2 size={14} className="text-success-500" /> No credit card required · 14-day trial
            </div>
          </motion.div>

          {/* Dashboard preview */}
          <motion.div {...fade(0.15)} className="relative mx-auto mt-14 max-w-5xl">
            <div className="absolute -inset-x-8 -inset-y-4 rounded-[2rem] bg-gradient-to-r from-brand-500/20 to-accent-500/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl dark:border-white/10 dark:bg-ink-850">
              <div className="flex items-center gap-2 border-b border-slate-200/70 px-4 py-3 dark:border-white/5">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-danger-400" />
                  <span className="h-3 w-3 rounded-full bg-warning-400" />
                  <span className="h-3 w-3 rounded-full bg-success-400" />
                </div>
                <div className="mx-auto flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1 text-[11px] text-slate-500 dark:bg-white/5 dark:text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-success-500" /> app.flowos.io/dashboard
                </div>
              </div>
              <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-6">
                {[
                  { label: 'Cash Available', value: '₹1.84 Cr', delta: '+8.2%', tone: 'from-brand-500/15 to-brand-500/5' },
                  { label: 'Working Capital', value: '₹4.18 Cr', delta: '+12.4%', tone: 'from-accent-500/15 to-accent-500/5' },
                  { label: 'Credit Score', value: '742', delta: '+18 pts', tone: 'from-success-500/15 to-success-500/5' },
                ].map((k, i) => (
                  <motion.div
                    key={k.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${k.tone} p-4`}
                  >
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{k.label}</div>
                    <div className="mt-1.5 font-display text-2xl font-bold tabular-nums">{k.value}</div>
                    <div className="mt-1 text-[11px] font-semibold text-success-600 dark:text-success-400">{k.delta}</div>
                  </motion.div>
                ))}
                <div className="sm:col-span-3 rounded-xl border border-slate-200/70 bg-white p-4 dark:border-white/5 dark:bg-ink-900/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">AI Insight</div>
                      <div className="mt-1 text-sm font-semibold">Cash shortage expected in 18 days</div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-danger-500/10 px-2 py-0.5 text-[10px] font-semibold text-danger-600 dark:text-danger-400">
                      Critical
                    </span>
                  </div>
                  <div className="mt-3 flex h-20 items-end gap-1.5">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-gradient-to-t from-brand-500/40 to-accent-500/80"
                        style={{ height: `${30 + Math.sin(i / 3) * 25 + (i > 30 ? -i * 1.5 : 0)}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div id="stats" {...fade(0.25)} className="mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-200/70 bg-white/60 p-5 text-center backdrop-blur dark:border-white/5 dark:bg-white/[0.03]">
                <div className="font-display text-2xl font-bold gradient-text sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-[12px] font-medium text-slate-500 dark:text-slate-400">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div {...fade(0)} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">
            <Layers size={13} /> 22 Modules, One Platform
          </motion.div>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Everything your finance team needs
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Replace 8+ disconnected tools with a single intelligent operating system.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="group rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:-translate-y-1 hover:shadow-glow dark:border-white/5 dark:bg-ink-850/60"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 text-brand-600 dark:text-brand-400">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold">{m.name}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-400">{m.desc}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-600 opacity-0 transition group-hover:opacity-100 dark:text-brand-400">
                  Explore <ArrowRight size={13} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* AI section */}
      <section id="ai" className="relative overflow-hidden border-y border-slate-200/60 bg-slate-50/50 py-24 dark:border-white/5 dark:bg-white/[0.02]">
        <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
          <motion.div {...fade(0)}>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500/15 to-accent-500/15 px-3 py-1 text-[12px] font-semibold text-brand-700 dark:text-brand-300">
              <Sparkles size={13} /> Flow AI
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              An AI copilot for every financial decision
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Flow reads your books, forecasts cash, scores risk, and explains every recommendation in plain English — so you always know what to do next.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Predicts cash shortages up to 180 days ahead',
                'Recommends which invoices to finance and when',
                'Flags duplicate, fake and unusual transactions',
                'Explains your 300–900 credit score, factor by factor',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] text-slate-700 dark:text-slate-200">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success-500" /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button onClick={onEnter} icon={<ArrowRight size={15} />}>Try Flow AI</Button>
            </div>
          </motion.div>

          <motion.div {...fade(0.12)} className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand-500/20 to-accent-500/20 blur-2xl" />
            <div className="relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-ink-850">
              <div className="flex items-center gap-2 border-b border-slate-200/70 pb-3 dark:border-white/5">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                  <Bot size={16} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold">Flow Assistant</div>
                  <div className="text-[10.5px] text-slate-400">Always on · analyzes in real time</div>
                </div>
              </div>
              <div className="space-y-3 py-4">
                <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-brand-600 px-3.5 py-2.5 text-[13px] text-white">
                  How much cash do I need next month?
                </div>
                <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-slate-100 px-3.5 py-2.5 text-[13px] text-slate-700 dark:bg-white/5 dark:text-slate-200">
                  You'll need ~₹86.4L. Expected inflows of ₹1.12L leave +₹25.9L net — but ₹84L overdue receivables mean a gap by Aug 18. Recommend financing FLW-1458 (+₹25.2L).
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Finance FLW-1458', 'Show forecast', 'Which customers pay late?'].map((c) => (
                    <span key={c} className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] text-slate-600 dark:border-white/10 dark:text-slate-300">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <p className="text-center text-[12px] font-semibold uppercase tracking-wider text-slate-400">
          Integrated with the tools and banks you already use
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {partners.map((p) => (
            <span key={p} className="font-display text-lg font-bold text-slate-400 dark:text-slate-500">{p}</span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="relative mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <motion.div {...fade(0)} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-600 to-accent-600 px-8 py-16 text-center text-white sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent-400/30 blur-3xl" />
          <div className="relative">
            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold backdrop-blur">
              <Star size={12} /> Trusted by 50,000+ businesses
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              Run your finance on autopilot
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/85">
              Start free in minutes. Connect your bank and ERP, and FlowOS takes it from there.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={onEnter}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-[15px] font-semibold text-brand-700 shadow-lg transition hover:scale-[1.02]"
              >
                Start Free <ArrowRight size={16} />
              </button>
              <button
                onClick={onEnter}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-[15px] font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Book Demo
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 py-10 dark:border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2.5">
            <Logo size={26} />
            <span className="font-display text-base font-bold">FlowOS</span>
            <span className="text-[12px] text-slate-400">© 2026 FlowOS Technologies</span>
          </div>
          <div className="flex items-center gap-6 text-[12.5px] text-slate-500 dark:text-slate-400">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white">Privacy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white">Terms</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white">Security</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
