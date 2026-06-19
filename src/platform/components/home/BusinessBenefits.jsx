import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Lock, BrainCircuit, Globe2, Building2 } from 'lucide-react';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: 'Verified Professionals',
    description: 'Every freelancer undergoes a strict vetting process. Only the top 1% of talent makes it onto Forte.'
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    description: 'Funds are held securely in escrow and only released when you are 100% satisfied with the work.'
  },
  {
    icon: Zap,
    title: 'Fast Hiring',
    description: 'Post a job and start receiving highly qualified proposals in under 60 minutes.'
  },
  {
    icon: BrainCircuit,
    title: 'AI-Powered Matching',
    description: 'Our proprietary algorithm analyzes hundreds of data points to find the perfect talent match instantly.'
  },
  {
    icon: Building2,
    title: 'Enterprise Support',
    description: 'Dedicated account managers and custom workflows for growing teams and enterprise clients.'
  },
  {
    icon: Globe2,
    title: 'Global Talent Access',
    description: 'Tap into a diverse, worldwide pool of experts across 150+ countries and 300+ skill categories.'
  }
];

export default function BusinessBenefits() {
  return (
    <section className="py-24 bg-white border-b border-zinc-100">
      <Container>
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/3 lg:sticky lg:top-32">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-6">
              Why leading businesses choose Forte
            </h2>
            <p className="text-lg text-zinc-600 mb-8">
              We've built the infrastructure to make remote hiring secure, fast, and reliable at any scale.
            </p>
            <div className="hidden lg:block w-24 h-1 bg-success rounded-full" />
          </div>

          <div className="lg:w-2/3">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-12">
              {BENEFITS.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col"
                  >
                    <div className="w-12 h-12 rounded-xl bg-surface border border-zinc-100 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6 text-success" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-3">{benefit.title}</h3>
                    <p className="text-zinc-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
