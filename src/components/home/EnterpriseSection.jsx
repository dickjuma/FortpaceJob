import React from 'react';
import { motion } from 'framer-motion';
import { Building, Users, PieChart, Workflow, ArrowRight } from 'lucide-react';
import Container from '../common/Container';
import Button from '../common/Button';

export default function EnterpriseSection() {
  return (
    <section id="enterprise" className="py-24 bg-surface-dark overflow-hidden relative">
      {/* Abstract dark shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-success rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-500 rounded-full blur-[100px]" />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <span className="inline-block px-3 py-1 bg-white/10 text-success font-semibold tracking-wide uppercase text-sm rounded-full mb-6">
              Forte Enterprise
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Built for growing businesses and enterprises
            </h2>
            <p className="text-lg text-zinc-300 mb-10 leading-relaxed">
              Scale your workforce seamlessly with advanced compliance, custom workflows, and dedicated strategic support.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-success shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Team Dashboard</h4>
                  <p className="text-sm text-zinc-400">Manage multiple departments and hiring managers centrally.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <PieChart className="w-6 h-6 text-success shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Advanced Analytics</h4>
                  <p className="text-sm text-zinc-400">Track spend, time, and project ROI in real-time.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Workflow className="w-6 h-6 text-success shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Custom Workflows</h4>
                  <p className="text-sm text-zinc-400">Integrate with your existing ERP and procurement systems.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building className="w-6 h-6 text-success shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Compliance Shield</h4>
                  <p className="text-sm text-zinc-400">Automated worker classification and global tax compliance.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="lg">Contact Sales</Button>
              <Button variant="white" size="lg" className="bg-transparent text-white border-zinc-700 hover:bg-zinc-800">
                Book a Demo
              </Button>
            </div>
          </motion.div>

          {/* Right Image/Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl border border-zinc-700 bg-zinc-800/50 backdrop-blur-xl p-4 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&ixlib=rb-4.0.3" 
                alt="Enterprise Dashboard" 
                className="rounded-lg shadow-inner opacity-80 mix-blend-luminosity"
              />
            </div>
            
            {/* Small floating UI element */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl border border-zinc-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <PieChart className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900">$2.4M</p>
                <p className="text-xs text-zinc-500">Annual Savings</p>
              </div>
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
