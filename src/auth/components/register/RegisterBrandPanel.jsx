import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';

const STATS = [
  { label: 'Active freelancers', value: '48K+' },
  { label: 'Jobs completed', value: '1.2M+' },
  { label: 'Countries supported', value: '120+' },
];

const QUOTES = [
  {
    quote: 'We hired a vetted product designer in under 48 hours and scaled our roadmap with confidence.',
    name: 'Maya Chen',
    role: 'Founder, Atlas Commerce',
  },
  {
    quote: 'This onboarding felt enterprise-ready from day one. It gave our team confidence to move fast.',
    name: 'David Oloo',
    role: 'Operations Lead, Northforge',
  },
  {
    quote: 'The marketplace made it easy to showcase my skills, win work, and build long-term client relationships.',
    name: 'Sofia Martins',
    role: 'Freelance Brand Strategist',
  },
];

export default function RegisterBrandPanel() {
  const [quoteIndex, setQuoteIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setQuoteIndex((value) => (value + 1) % QUOTES.length);
    }, 4800);

    return () => window.clearInterval(timer);
  }, []);

  const activeQuote = QUOTES[quoteIndex];

  return (
    <aside className="relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] dark:border-zinc-800 dark:bg-[linear-gradient(180deg,#0f172a_0%,#020617_100%)] sm:p-8 xl:p-10">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 top-12 h-40 w-40 rounded-full bg-brand-100 blur-3xl dark:bg-brand-500/10" />
        <div className="absolute -left-12 bottom-12 h-32 w-32 rounded-full bg-cyan-100 blur-3xl dark:bg-cyan-500/10" />
      </div>

      <div className="relative z-10 flex h-full flex-col text-zinc-950 dark:text-white">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-brand-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-brand-300">
          <Sparkles className="h-3.5 w-3.5" />
          Trusted onboarding
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="max-w-md text-3xl font-black leading-tight sm:text-4xl">
            Keep signup simple. Make trust obvious.
          </h2>
          <p className="max-w-lg text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
            Forte is built for clients, freelancers, and teams that want a clean onboarding flow, clear account setup, and secure verification from the start.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3 xl:mt-10">
          {STATS.map((item) => (
            <div key={item.label} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-2xl font-black">{item.value}</p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 xl:mt-auto">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
                Member story
              </p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">
                High-trust marketplace onboarding
              </p>
            </div>
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="mt-4"
            >
              <p className="text-base leading-7 text-zinc-800 dark:text-white sm:text-lg">
                "{activeQuote.quote}"
              </p>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <div>
                  <p className="font-semibold">{activeQuote.name}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{activeQuote.role}</p>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Verified flow
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}
