import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem('flowos-theme');
    if (stored) return stored === 'dark';
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('flowos-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return { dark, setDark, toggle: () => setDark((d) => !d) };
}

export function DarkToggle({ className = '' }: { className?: string }) {
  const { dark, toggle } = useDarkMode();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/70 text-slate-600 transition hover:bg-white hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 ${className}`}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
