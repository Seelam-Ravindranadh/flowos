import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, User } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { AiPill } from '../components/InsightCard';
import { aiFallback, aiResponses, chatSeed, company } from '../lib/data';
import type { ChatMessage } from '../types';

export function Assistant({ onNavigate }: { onNavigate: (k: string) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>(chatSeed);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: `u${Date.now()}`, role: 'user', content: text, time: now() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const match = aiResponses.find((r) => r.match.test(text));
      const reply = match ? match.reply(company) : aiFallback;
      const botMsg: ChatMessage = {
        id: `a${Date.now()}`,
        role: 'assistant',
        content: reply.content,
        time: now(),
        chips: reply.chips,
      };
      setMessages((m) => [...m, botMsg]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Flow AI Assistant"
        subtitle="Your financial copilot — ask anything about cash, invoices, vendors, credit, or reports"
        badge={<AiPill>Powered by Flow AI</AiPill>}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        {/* Chat */}
        <Card className="flex h-[calc(100vh-220px)] min-h-[520px] flex-col">
          {/* Messages */}
          <div className="no-scrollbar flex-1 overflow-y-auto p-5">
            <div className="space-y-5">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} onChip={send} />
              ))}
              {typing && <TypingBubble />}
              <div ref={endRef} />
            </div>
          </div>

          {/* Composer */}
          <div className="border-t border-slate-200/70 p-4 dark:border-white/5">
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-end gap-2"
            >
              <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/20 dark:border-white/10 dark:bg-white/5">
                <Sparkles size={16} className="shrink-0 text-brand-500" />
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Flow anything…"
                  className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim()}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white transition hover:bg-brand-700 disabled:opacity-40"
              >
                <Send size={17} />
              </button>
            </form>
            <p className="mt-2 text-center text-[11px] text-slate-400">
              Flow AI can analyze your books in real time. Suggestions are not financial advice.
            </p>
          </div>
        </Card>

        {/* Side rail */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-display text-sm font-semibold">Quick prompts</h3>
            <div className="mt-3 space-y-2">
              {[
                'How much cash do I need next month?',
                'Which customer pays late?',
                'Which supplier should I pay first?',
                'Can I afford a ₹40L purchase?',
                'Should I finance invoice #1458?',
                'What is my credit score?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="block w-full rounded-xl border border-slate-200/80 px-3 py-2.5 text-left text-[12.5px] text-slate-600 transition hover:border-brand-300 hover:bg-brand-500/[0.04] hover:text-brand-700 dark:border-white/5 dark:text-slate-300 dark:hover:border-brand-500/30"
                >
                  {q}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display text-sm font-semibold">Jump to</h3>
            <div className="mt-3 space-y-1">
              {[
                { label: 'Cash Flow Forecast', k: 'forecast' },
                { label: 'Receivables', k: 'receivables' },
                { label: 'Invoice Financing', k: 'invoices' },
                { label: 'Credit Score', k: 'credit_score' },
                { label: 'Reports', k: 'reports' },
              ].map((l) => (
                <button
                  key={l.k}
                  onClick={() => onNavigate(l.k)}
                  className="block w-full rounded-lg px-3 py-2 text-left text-[12.5px] text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  {l.label} →
                </button>
              ))}
            </div>
          </Card>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-5 text-white">
            <Bot size={20} />
            <p className="mt-2 text-[13px] leading-snug">
              Flow generates <span className="font-semibold">P&L, Balance Sheet & Cash Flow</span> reports on demand — just ask.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, onChip }: { message: ChatMessage; onChip: (t: string) => void }) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${isUser ? 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-200' : 'bg-gradient-to-br from-brand-500 to-accent-500 text-white'}`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${isUser ? 'rounded-br-md bg-brand-600 text-white' : 'rounded-bl-md bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-slate-200'}`}>
          {message.content.split('\n').map((line, i) => (
            <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{line}</p>
          ))}
        </div>
        {message.chips && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.chips.map((c) => (
              <button
                key={c}
                onClick={() => onChip(c)}
                className="rounded-full border border-slate-200 px-2.5 py-1 text-[11.5px] font-medium text-slate-600 transition hover:border-brand-400 hover:bg-brand-500/10 hover:text-brand-700 dark:border-white/10 dark:text-slate-300 dark:hover:border-brand-500/40"
              >
                {c}
              </button>
            ))}
          </div>
        )}
        <span className="mt-1 text-[10px] text-slate-400">{message.time}</span>
      </div>
    </motion.div>
  );
}

function TypingBubble() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white">
        <Bot size={16} />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 dark:bg-white/5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-slate-400"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function now() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
