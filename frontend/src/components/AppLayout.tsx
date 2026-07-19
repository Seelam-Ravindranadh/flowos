import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { NAV_LABELS, type NavKey } from '../lib/nav';

export function AppLayout({
  active,
  onNavigate,
  children,
}: {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-950">
      {/* Ambient gradient backdrop */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/[0.07]" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl dark:bg-accent-500/[0.05]" />
      </div>

      <Sidebar
        active={active}
        onNavigate={(k) => { onNavigate(k); setSidebarOpen(false); }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-[260px]">
        <Topbar
          title={NAV_LABELS[active]}
          onMenu={() => setSidebarOpen(true)}
          onNavigate={onNavigate}
        />
        <motion.main
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
