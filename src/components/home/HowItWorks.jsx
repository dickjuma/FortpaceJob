import React from 'react';
import { motion } from 'framer-motion';
import { Search, UserCheck, Rocket } from 'lucide-react';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';

const STEPS = [
  {
    icon: Search,
    step: '01',
    title: 'Browse',
    subtitle: 'Find the right service',
    description:
      'Search through thousands of pre-packaged services across every category. Filter by budget, delivery time, and seller level to find exactly what you need.',
    color: 'bg-emerald-50 text-emerald-700',
    ring: 'ring-emerald-200',
  },
  {
    icon: UserCheck,
    step: '02',
    title: 'Hire',
    subtitle: 'Engage with confidence',
    description:
      'Review seller portfolios, ratings, and reviews. Chat directly before placing an order. Your payment is held securely in escrow until you approve the work.',
    color: 'bg-blue-50 text-blue-700',
    ring: 'ring-blue-200',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Work',
    subtitle: 'Get results, fast',
    description:
      'Collaborate seamlessly through our built-in workspace. Track milestones, share files, and request revisions — all within the platform. Pay only when satisfied.',
    color: 'bg-violet-50 text-violet-700',
    ring: 'ring-violet-200',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white border-y border-zinc-100">
      <Container>
        <SectionTitle
          title="How It Works"
          subtitle="Three simple steps to get world-class work done — faster than ever."
        />

        <div className="grid md:grid-cols-3 gap-10 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-14 left-[18%] right-[18%] h-0.5 bg-gradient-to-r from-emerald-200 via-blue-200 to-violet-200" />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step number badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <span className="text-xs font-black text-zinc-400 tracking-widest">
                    STEP {step.step}
                  </span>
                </div>

                {/* Icon circle */}
                <div
                  className={`w-28 h-28 rounded-full ${step.color} ring-4 ${step.ring} flex items-center justify-center mb-6 relative z-10 shadow-sm group-hover:shadow-md transition-shadow duration-300 mt-4`}
                >
                  <Icon className="w-12 h-12" strokeWidth={1.5} />
                </div>

                <h3 className="text-2xl font-black text-zinc-900 mb-1 group-hover:text-emerald-700 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm font-semibold text-emerald-600 mb-3">{step.subtitle}</p>
                <p className="text-zinc-600 leading-relaxed max-w-xs mx-auto text-sm">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
