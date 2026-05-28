import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';

const TESTIMONIALS = [
  {
    content: "We needed a senior React engineer for a critical launch. Forte's AI matched us with David in 2 hours. He integrated flawlessly with our team and we shipped a week early.",
    author: "Michael Chang",
    role: "CTO at NexusTech",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    content: "The escrow system gives us complete peace of mind. We've scaled our entire content marketing team through Forte, saving over $100k annually compared to traditional agencies.",
    author: "Sarah O'Connor",
    role: "VP Marketing, GrowthScale",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    content: "As a freelancer, Forte has completely transformed my career. The clients are professional, the payments are guaranteed, and the platform handles all the administrative overhead.",
    author: "Elena Rodriguez",
    role: "Top Rated UI/UX Designer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <Container>
        <SectionTitle 
          title="Don't just take our word for it" 
          subtitle="Hear from the businesses and professionals who use Forte every day."
        />

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface p-8 rounded-3xl border border-zinc-100 flex flex-col h-full"
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-emerald-500 text-success" />
                ))}
              </div>
              <p className="text-zinc-700 text-lg leading-relaxed mb-8 flex-grow">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-zinc-200">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-zinc-900">{testimonial.author}</h4>
                  <p className="text-sm text-zinc-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
