import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Container from '../common/Container';

const FEATURES = [
  { 
    title: 'Stick to your budget', 
    description: 'Find the right service for every price point. No hourly rates, just project-based pricing.'
  },
  { 
    title: 'Get quality work done quickly', 
    description: 'Hand your project over to a talented freelancer in minutes, get long-lasting results.'
  },
  { 
    title: 'Pay when you\'re happy', 
    description: 'Upfront quotes mean no surprises. Payments only get released when you approve.'
  },
  { 
    title: 'Count on 24/7 support', 
    description: 'Our round-the-clock support team is available to help anytime, anywhere.'
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-emerald-50/50">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 mb-8 leading-tight">
              A whole world of freelance talent at your fingertips
            </h2>

            <div className="space-y-8">
              {FEATURES.map((feature, index) => (
                <div key={index}>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-7 h-7 text-zinc-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 mb-2">{feature.title}</h3>
                      <p className="text-lg text-zinc-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Media */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="rounded-xl overflow-hidden shadow-2xl relative aspect-[4/3] bg-zinc-100">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1000&h=750" 
                alt="Talent collaboration" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
