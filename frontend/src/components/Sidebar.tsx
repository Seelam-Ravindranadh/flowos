import { motion } from 'framer-motion';
import { ChevronsLeft, Sparkles, X } from 'lucide-react';
import { NAV, NAV_GROUPS, type NavKey } from '../lib/nav';
import { cn } from '../lib/cn';

export function Sidebar({
  active,
  onNavigate,
  open,
  onClose,
}: {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink-950/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200 bg-white/95 backdrop-blur-xl transition-transform duration-300 dark:border-white/5 dark:bg-ink-900/95 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between px-5">
          <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2.5">
            <Logo />
            <div className="text-left">
              <div className="font-display text-[15px] font-bold leading-none text-slate-900 dark:text-white">FlowOS</div>
              <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">Financial OS</div>
            </div>
          </button>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-2">
          {NAV_GROUPS.map((group) => (
            <div key={group} className="mb-1.5">
              <div className="px-3 py-2 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {group}
              </div>
              {NAV.filter((n) => n.group === group).map((item) => {
                const Icon = item.icon;
                const isActive = active === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => onNavigate(item.key)}
                    className={cn(
                      'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-medium transition',
                      isActive
                        ? 'bg-brand-500/10 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                        : 'text-slate-600 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:bg-white/5',
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-500"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <Icon size={17} className={cn(isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300')} />
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          'ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                          item.badge === 'AI'
                            ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white'
                            : 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300',
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* AI upsell card */}
        <div className="px-3 pb-3">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 p-3.5 text-white">
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/15 blur-xl" />
            <div className="relative">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide opacity-90">
                <Sparkles size={12} /> Flow AI
              </div>
              <p className="mt-1 text-[12px] leading-snug opacity-95">
                Ask anything about your finances. Get instant insights.
              </p>
              <button
                onClick={() => onNavigate('assistant')}
                className="mt-2.5 inline-flex items-center gap-1 rounded-lg bg-white/20 px-2.5 py-1.5 text-[12px] font-semibold backdrop-blur transition hover:bg-white/30"
              >
                Open Assistant →
              </button>
            </div>
          </div>
        </div>

        {/* Collapse hint (desktop) */}
        <div className="hidden border-t border-slate-200/70 px-5 py-3 text-[11px] text-slate-400 dark:border-white/5 lg:flex lg:items-center lg:gap-2">
          <ChevronsLeft size={13} /> Press <kbd className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] dark:bg-white/10">⌘K</kbd> to search
        </div>
      </aside>
    </>
  );
}

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="shrink-0">
      <defs>
        <linearGradient id="flowos-logo" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E78FF" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#flowos-logo)" />
      <path d="M9 21c3.5 0 4.5-10 8-10s4.5 6 6 6" stroke="white" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <circle cx="23" cy="17" r="2.2" fill="white" />
    </svg>
  );
}
