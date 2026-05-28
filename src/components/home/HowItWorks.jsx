import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, CreditCard } from 'lucide-react';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';

const STEPS = [
  {
    icon: FileText,
    title: 'Post your project',
    description: 'Provide details about your project, timeline, and budget. It takes less than 5 minutes to get started.'
  },
  {
    icon: Users,
    title: 'Receive matches',
    description: 'Our system intelligently matches your requirements with the top 1% of vetted professionals.'
  },
  {
    icon: CreditCard,
    title: 'Hire and collaborate',
    description: 'Review proposals, interview candidates, and manage the entire project securely through our platform.'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-surface border-y border-zinc-200/60">
      <Container>
        <SectionTitle 
          title="How Hiring Works" 
          subtitle="A streamlined process designed to get your project off the ground immediately."
        />

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-zinc-200" />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-white border-4 border-zinc-50 shadow-md flex items-center justify-center mb-6 relative z-10 text-success">
                  <Icon className="w-10 h-10" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-surface-dark text-white font-bold flex items-center justify-center text-sm border-2 border-white">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">{step.title}</h3>
                <p className="text-zinc-600 leading-relaxed max-w-xs mx-auto">
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
