import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, CreditCard, Video, FileText, Clock, FileUp, Users, Target } from 'lucide-react';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';

const FEATURES = [
  { icon: MessageSquare, title: 'Real-time messaging' },
  { icon: CreditCard, title: 'Escrow payments' },
  { icon: Video, title: 'Video interviews' },
  { icon: FileText, title: 'Smart contracts' },
  { icon: Clock, title: 'Time tracking' },
  { icon: FileUp, title: 'File sharing' },
  { icon: Users, title: 'Team collaboration' },
  { icon: Target, title: 'Milestone payments' }
];

export default function Features() {
  return (
    <section className="py-24 bg-surface">
      <Container>
        <SectionTitle 
          title="Everything you need in one workspace" 
          subtitle="Forte provides a complete suite of tools to manage your remote projects from start to finish."
          centered={true}
        />

        <div className="max-w-5xl mx-auto">
          {/* Main Workspace Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 relative rounded-2xl overflow-hidden border border-zinc-200 shadow-2xl bg-white"
          >
            {/* Fake Browser header */}
            <div className="h-12 bg-zinc-100 border-b border-zinc-200 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="mx-auto w-1/2 h-6 bg-white rounded-md border border-zinc-200" />
            </div>
            {/* Using a clean abstract workspace image */}
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3" 
              alt="Forte Workspace" 
              className="w-full h-auto object-cover opacity-90"
            />
          </motion.div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-4 sm:p-6 rounded-xl border border-zinc-100 shadow-sm flex items-center gap-4 hover:border-emerald-200 transition-colors"
                >
                  <Icon className="w-6 h-6 text-success shrink-0" />
                  <span className="font-semibold text-zinc-900 text-sm sm:text-base leading-tight">
                    {feature.title}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
