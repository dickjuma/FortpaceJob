import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Globe2, LockKeyhole, ShieldCheck, Sparkles, Users2 } from 'lucide-react';

const BENEFITS = [
  {
    title: 'Faster hiring and delivery',
    description: 'Move from account creation to working relationships with fewer onboarding bottlenecks and stronger trust signals.',
    icon: Sparkles,
  },
  {
    title: 'Built for solo users and teams',
    description: 'Support individual professionals, growing SMEs, and enterprise hiring workflows in one unified marketplace.',
    icon: Users2,
  },
  {
    title: 'Security and compliance ready',
    description: 'Designed with verification, consent, and enterprise-grade account hygiene in mind from the start.',
    icon: ShieldCheck,
  },
];

const BADGES = [
  'Protected by enterprise-grade security',
  'GDPR-conscious onboarding design',
  'Global-ready hiring and talent workflows',
  'Scalable for freelancers, SMEs, and enterprise teams',
];

const FAQS = [
  {
    question: 'Can I switch from client to freelancer later?',
    answer: 'Yes. The onboarding flow starts with your primary path, but the platform can later support expanded account capabilities and profile completion.',
  },
  {
    question: 'Do business accounts need extra verification?',
    answer: 'SME and corporate accounts typically unlock additional company details, team setup, and verification workflows after core registration.',
  },
  {
    question: 'Will my progress be saved if I leave?',
    answer: 'Yes. Your onboarding step and entered details are preserved in session storage so you can return without restarting.',
  },
  {
    question: 'Is this registration secure?',
    answer: 'The experience is designed to plug into secure auth APIs, rate limiting, CSRF protection, and future verification layers.',
  },
];

export default function RegisterBottomSections() {
  const [openFaq, setOpenFaq] = React.useState(0);

  return (
    <div className="border-t border-zinc-200 bg-transparent px-4 py-14 dark:border-zinc-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-12">
        <section className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#2bb75c]">
              Why join us
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
              Clear onboarding for serious work.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
              Designed to be readable, trustworthy, and easy to move through on desktop, tablet, and mobile.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {BENEFITS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-zinc-950 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {BADGES.map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-sm font-semibold text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            >
              <LockKeyhole className="h-4 w-4 text-[#2bb75c]" />
              <span>{badge}</span>
            </div>
          ))}
        </section>

        <section className="grid gap-8 xl:grid-cols-[0.88fr_1.12fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#2bb75c]">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
              Common registration questions
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
              Helpful answers for clients, freelancers, businesses, and growing teams joining the marketplace.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={item.question}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-zinc-950 dark:text-white sm:text-base">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                      >
                        <p className="px-5 pb-5 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="flex flex-col gap-4 border-t border-zinc-200 pt-8 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Globe2 className="h-4 w-4" />
            <span>Global marketplace onboarding built for trust, clarity, and scale.</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/help-center" className="transition-colors hover:text-zinc-900 dark:hover:text-white">Help Center</Link>
            <Link to="/help-center" className="transition-colors hover:text-zinc-900 dark:hover:text-white">Privacy</Link>
            <Link to="/help-center" className="transition-colors hover:text-zinc-900 dark:hover:text-white">Terms</Link>
            <Link to="/help-center" className="transition-colors hover:text-zinc-900 dark:hover:text-white">Security</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

