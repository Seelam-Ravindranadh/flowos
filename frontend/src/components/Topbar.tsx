import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  Command,
  Menu,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DarkToggle } from "./ui/DarkToggle";
import { Logo } from "./Sidebar";
import { NAV, type NavKey } from "../lib/nav";
import { notifications as notifData } from "../lib/data";
import { cn } from "../lib/cn";

export function Topbar({
  title,
  onMenu,
}: {
  title: string;
  onMenu: () => void;
}) {
  const navigate = useNavigate();

  /* ---------------------------------------------
     Component State
  --------------------------------------------- */

  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unread = notifData.filter((n) => !n.read).length;

  /* ---------------------------------------------
     Navigation Helper
  --------------------------------------------- */

  const handleNavigate = (key: NavKey) => {
    setSearchOpen(false);
    setNotifOpen(false);

    switch (key) {
      case "dashboard":
        navigate("/dashboard");
        break;

      case "customers":
        navigate("/customers");
        break;

      case "reports":
        navigate("/reports");
        break;

      case "analytics":
        navigate("/analytics");
        break;

      case "assistant":
        navigate("/assistant");
        break;

      case "forecast":
        navigate("/forecast");
        break;

      case "notifications":
        navigate("/notifications");
        break;

      case "receivables":
        navigate("/receivables");
        break;

      case "payables":
        navigate("/payables");
        break;

      case "invoices":
        navigate("/invoices");
        break;

      case "tax":
        navigate("/tax");
        break;

      case "fraud":
        navigate("/fraud");
        break;

      case "credit_score":
        navigate("/credit-score");
        break;

      default:
        console.warn("Unknown route:", key);
    }
  };

  /* ---------------------------------------------
     Keyboard Shortcuts
  --------------------------------------------- */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl + K / Cmd + K
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }

      // ESC
      if (event.key === "Escape") {
        setSearchOpen(false);
        setNotifOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* ---------------------------------------------
     Header
  --------------------------------------------- */

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl dark:border-white/5 dark:bg-ink-900/80 sm:px-6">
      {/* Mobile Menu */}
      <button
        onClick={onMenu}
        className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5 lg:hidden"
      >
        <Menu size={18} />
      </button>

      {/* Page Title */}
      <div className="hidden min-w-0 sm:block">
        <h2 className="truncate font-display text-[15px] font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="truncate text-[11.5px] text-slate-500 dark:text-slate-400">
          Aurora Textiles Pvt Ltd · FY 2025-26
        </p>
      </div>

      {/* Desktop Search */}
      <button
        onClick={() => setSearchOpen(true)}
        className="group ml-auto hidden items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-3 py-2 text-sm text-slate-400 transition hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 md:flex"
      >
        <Search size={15} />

        <span className="text-[13px]">
          Search…
        </span>

        <kbd className="ml-6 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-white/10 dark:text-slate-400">
          ⌘K
        </kbd>
      </button>

      {/* Mobile Search */}
      <button
        onClick={() => setSearchOpen(true)}
        className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5 md:hidden"
      >
        <Search size={16} />
      </button>

      {/* Theme Toggle */}
      <DarkToggle />
            {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen((v) => !v)}
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
          {notifOpen && (
            <NotifPanel
              onClose={() => setNotifOpen(false)}
              onNavigate={handleNavigate}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Settings */}
      <button
        onClick={() => navigate("/settings")}
        className="hidden h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white/70 text-slate-600 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 sm:grid"
      >
        <Settings size={17} />
      </button>

      {/* New Button */}
      <button
        onClick={() => navigate("/invoices/new")}
        className="hidden items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:bg-brand-700 md:inline-flex"
      >
        <Plus size={15} />
        New
      </button>

      {/* User */}
      <button
        onClick={() => navigate("/profile")}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 py-1 pl-1 pr-3 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
      >
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-[11px] font-bold text-white">
          RM
        </div>

        <div className="hidden leading-tight sm:block">
          <div className="text-[12px] font-semibold text-slate-800 dark:text-white">
            Rhea Mehta
          </div>

          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            Finance Manager
          </div>
        </div>
      </button>

      {/* Command Palette */}
      <AnimatePresence>
        {searchOpen && (
          <CommandPalette
            onClose={() => setSearchOpen(false)}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
import { motion } from "framer-motion";

function NotifPanel({
  onClose,
  onNavigate,
}: {
  onClose: () => void;
  onNavigate: (key: NavKey) => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.97 }}
        transition={{ duration: 0.18 }}
        className="absolute right-0 top-12 z-50 w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-ink-850"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3 dark:border-white/5">
          <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
            Notifications
          </h4>

          <button className="text-[11px] font-medium text-brand-600 dark:text-brand-400">
            Mark all read
          </button>
        </div>

        {/* Notification List */}
        <div className="no-scrollbar max-h-[340px] overflow-y-auto">
          {notifData.slice(0, 6).map((notification) => (
            <button
              key={notification.id}
              onClick={() => {
                switch (notification.type) {
                  case "cash":
                    onNavigate("forecast");
                    break;

                  case "funding":
                    onNavigate("invoices");
                    break;

                  case "fraud":
                    onNavigate("fraud");
                    break;

                  case "gst":
                    onNavigate("tax");
                    break;

                  case "supplier":
                    onNavigate("payables");
                    break;

                  default:
                    onNavigate("notifications");
                }

                onClose();
              }}
              className={cn(
                "flex w-full gap-3 border-b border-slate-100/70 px-4 py-3 text-left transition last:border-0 hover:bg-slate-50 dark:border-white/[0.03] dark:hover:bg-white/[0.03]",
                !notification.read &&
                  "bg-brand-500/[0.03] dark:bg-brand-500/[0.04]"
              )}
            >
              {/* Status Dot */}
              <span
                className={cn(
                  "mt-1 h-2 w-2 shrink-0 rounded-full",
                  notification.severity === "critical"
                    ? "bg-danger-500"
                    : notification.severity === "warning"
                    ? "bg-warning-500"
                    : notification.severity === "success"
                    ? "bg-success-500"
                    : "bg-brand-500"
                )}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[13px] font-semibold text-slate-800 dark:text-white">
                    {notification.title}
                  </p>

                  <span className="shrink-0 text-[10px] text-slate-400">
                    {notification.time}
                  </span>
                </div>

                <p className="mt-0.5 line-clamp-2 text-[12px] text-slate-500 dark:text-slate-400">
                  {notification.detail}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <button
          onClick={() => {
            onNavigate("notifications");
            onClose();
          }}
          className="block w-full border-t border-slate-200/70 px-4 py-3 text-center text-[12px] font-semibold text-brand-600 transition hover:bg-slate-50 dark:border-white/5 dark:text-brand-400 dark:hover:bg-white/[0.03]"
        >
          View all notifications
        </button>
      </motion.div>
    </>
  );
}
function CommandPalette({
  onClose,
  onNavigate,
}: {
  onClose: () => void;
  onNavigate: (key: NavKey) => void;
}) {
  const [query, setQuery] = useState("");

  const filteredItems = NAV.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ duration: 0.18 }}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-ink-850"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-slate-200/70 px-4 py-3.5 dark:border-white/5">
          <Command
            size={18}
            className="text-slate-400"
          />

          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules, invoices, customers, reports..."
            className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
          />

          <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-white/10 dark:text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Search Results */}
        <div className="max-h-[340px] overflow-y-auto p-2">
          {filteredItems.length === 0 && (
            <div className="px-3 py-6 text-center text-sm text-slate-400">
              No results found for "{query}"
            </div>
          )}

          {filteredItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                onClick={() => {
                  onNavigate(item.key);
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Icon size={16} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-medium text-slate-800 dark:text-white">
                    {item.label}
                  </div>

                  <div className="text-[11px] text-slate-400">
                    {item.group}
                  </div>
                </div>

                <Check
                  size={14}
                  className="text-slate-300 dark:text-slate-600"
                />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200/70 px-4 py-2.5 text-[11px] text-slate-400 dark:border-white/5">
          <div className="flex items-center gap-1.5">
            <Logo size={14} />
            FlowOS Command Palette
          </div>

          <span>↑↓ Navigate • Enter Select</span>
        </div>
      </motion.div>
    </div>
  );
}