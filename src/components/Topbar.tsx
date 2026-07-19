import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  Check,
  Command,
  Menu,
  Plus,
  Search,
  Settings,
} from 'lucide-react';
import { DarkToggle } from './ui/DarkToggle';
import { NAV, type NavKey } from '../lib/nav';
import { notifications as notifData } from '../lib/data';
import { cn } from '../lib/cn';
import { Logo } from './Sidebar';

export function Topbar({
  title,
  onMenu,
  onNavigate,
}: {
  title: string;
  onMenu: () => void;
  onNavigate: (key: NavKey) => void;
}) {
  const [search, setSearch] = useState(false);
  const [notif, setNotif] = useState(false);
  const unread = notifData.filter((n) => !n.read).length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearch(true);
      }
      if (e.key === 'Escape') {
        setSearch(false);
        setNotif(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl dark:border-white/5 dark:bg-ink-900/80 sm:px-6">
      <button
        onClick={onMenu}
        className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5 lg:hidden"
      >
        <Menu size={18} />
      </button>

      <div className="hidden min-w-0 sm:block">
        <h2 className="truncate font-display text-[15px] font-semibold text-slate-900 dark:text-white">{title}</h2>
        <p className="truncate text-[11.5px] text-slate-500 dark:text-slate-400">Aurora Textiles Pvt Ltd · FY 2025-26</p>
      </div>

      {/* Search trigger */}
      <button
        onClick={() => setSearch(true)}
        className="group ml-auto hidden items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-3 py-2 text-sm text-slate-400 transition hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 md:flex"
      >
        <Search size={15} />
        <span className="text-[13px]">Search…</span>
        <kbd className="ml-6 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-white/10 dark:text-slate-400">⌘K</kbd>
      </button>

      <button
        onClick={() => setSearch(true)}
        className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5 md:hidden"
      >
        <Search size={16} />
      </button>

      <DarkToggle />

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotif((v) => !v)}
          className="relative grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white/70 text-slate-600 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
        >
          <Bell size={17} />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-danger-500 px-1 text-[9px] font-bold text-white ring-2 ring-white dark:ring-ink-900">
              {unread}
            </span>
          )}
        </button>
        <AnimatePresence>
          {notif && (
            <NotifPanel onClose={() => setNotif(false)} onNavigate={onNavigate} />
          )}
        </AnimatePresence>
      </div>

      <button className="hidden h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white/70 text-slate-600 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 sm:grid">
        <Settings size={17} />
      </button>

      <button className="hidden items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:bg-brand-700 md:inline-flex">
        <Plus size={15} /> New
      </button>

      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 py-1 pl-1 pr-3 dark:border-white/10 dark:bg-white/5">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-[11px] font-bold text-white">
          RM
        </div>
        <div className="hidden leading-tight sm:block">
          <div className="text-[12px] font-semibold text-slate-800 dark:text-white">Rhea Mehta</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Finance Manager</div>
        </div>
      </div>

      <AnimatePresence>
        {search && <CommandPalette onClose={() => setSearch(false)} onNavigate={(k) => { onNavigate(k); setSearch(false); }} />}
      </AnimatePresence>
    </header>
  );
}

function NotifPanel({ onClose, onNavigate }: { onClose: () => void; onNavigate: (k: NavKey) => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.97 }}
        transition={{ duration: 0.18 }}
        className="absolute right-0 top-12 z-50 w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-ink-850"
      >
        <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3 dark:border-white/5">
          <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">Notifications</h4>
          <button className="text-[11px] font-medium text-brand-600 dark:text-brand-400">Mark all read</button>
        </div>
        <div className="no-scrollbar max-h-[340px] overflow-y-auto">
          {notifData.slice(0, 6).map((n) => (
            <button
              key={n.id}
              onClick={() => {
                if (n.type === 'cash') onNavigate('forecast');
                else if (n.type === 'funding') onNavigate('invoices');
                else if (n.type === 'fraud') onNavigate('fraud');
                else if (n.type === 'gst') onNavigate('tax');
                else if (n.type === 'supplier') onNavigate('payables');
                else onNavigate('notifications');
                onClose();
              }}
              className={cn(
                'flex w-full gap-3 border-b border-slate-100/70 px-4 py-3 text-left transition last:border-0 hover:bg-slate-50 dark:border-white/[0.03] dark:hover:bg-white/[0.03]',
                !n.read && 'bg-brand-500/[0.03] dark:bg-brand-500/[0.04]',
              )}
            >
              <span
                className={cn(
                  'mt-1 h-2 w-2 shrink-0 rounded-full',
                  n.severity === 'critical' ? 'bg-danger-500' : n.severity === 'warning' ? 'bg-warning-500' : n.severity === 'success' ? 'bg-success-500' : 'bg-brand-500',
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[13px] font-semibold text-slate-800 dark:text-white">{n.title}</p>
                  <span className="shrink-0 text-[10px] text-slate-400">{n.time}</span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-[12px] text-slate-500 dark:text-slate-400">{n.detail}</p>
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={() => { onNavigate('notifications'); onClose(); }}
          className="block w-full border-t border-slate-200/70 px-4 py-3 text-center text-[12px] font-semibold text-brand-600 hover:bg-slate-50 dark:border-white/5 dark:text-brand-400 dark:hover:bg-white/[0.03]"
        >
          View all notifications
        </button>
      </motion.div>
    </>
  );
}

function CommandPalette({ onClose, onNavigate }: { onClose: () => void; onNavigate: (k: NavKey) => void }) {
  const [q, setQ] = useState('');
  const filtered = NAV.filter((n) => n.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]">
      <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ duration: 0.18 }}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-ink-850"
      >
        <div className="flex items-center gap-3 border-b border-slate-200/70 px-4 py-3.5 dark:border-white/5">
          <Command size={18} className="text-slate-400" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search modules, invoices, vendors…"
            className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
          />
          <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-white/10">ESC</kbd>
        </div>
        <div className="max-h-[320px] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <div className="px-3 py-6 text-center text-sm text-slate-400">No results for "{q}"</div>
          )}
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-medium text-slate-800 dark:text-white">{item.label}</div>
                  <div className="text-[11px] text-slate-400">{item.group}</div>
                </div>
                <Check size={14} className="text-slate-300 dark:text-slate-600" />
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between border-t border-slate-200/70 px-4 py-2.5 text-[11px] text-slate-400 dark:border-white/5">
          <div className="flex items-center gap-1.5">
            <Logo size={14} /> FlowOS Command
          </div>
          <span>↑↓ to navigate · ↵ to select</span>
        </div>
      </motion.div>
    </div>
  );
}
