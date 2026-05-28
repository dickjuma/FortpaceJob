import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';
import Container from '../common/Container';

export default function SuccessStories() {
  return (
    <section className="py-24 bg-surface-dark text-white overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=1632&ixlib=rb-4.0.3" 
                alt="Freelancer working" 
                className="w-full h-[500px] object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="font-bold text-xl text-white">300% Income Growth</p>
                    <p className="text-sm text-emerald-300">In just 18 months</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-success font-bold uppercase tracking-wider text-sm mb-4 block">Success Stories</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 leading-tight">
              From side hustle to a six-figure agency.
            </h2>
            <p className="text-lg text-zinc-300 mb-8 leading-relaxed">
              "When I joined Forte, I was just looking for a few extra projects. The platform's algorithm matched me with high-quality enterprise clients so consistently that I had to start hiring my own team. Today, my agency runs entirely on Forte's infrastructure."
            </p>
            <div className="mb-10">
              <p className="font-bold text-white text-xl">James Wilson</p>
              <p className="text-zinc-400">Founder, Velocity Web</p>
            </div>
            
            <a href="#" className="inline-flex items-center gap-2 text-success font-semibold hover:text-emerald-300 transition-colors">
              Read more success stories <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
