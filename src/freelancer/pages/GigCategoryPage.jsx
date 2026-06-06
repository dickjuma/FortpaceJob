// src/pages/public/GigCategoryPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  MonitorPlay, Code2, PenTool, Search,
  Smartphone, Database, Layout, ChevronRight,
  Star, Heart, Clock
} from 'lucide-react';

const CATEGORY = {
  name: 'Programming & Tech',
  description: 'You think it. A programmer develops it.',
  icon: Code2,
  banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
  stats: {
    freelancers: '45K+',
    projects: '2M+',
    satisfaction: '99%'
  }
};

const SUBCATEGORIES = [
  { name: 'Website Development', icon: MonitorPlay, count: '12,400' },
  { name: 'Mobile Apps', icon: Smartphone, count: '8,200' },
  { name: 'Data Processing', icon: Database, count: '4,100' },
  { name: 'UX/UI Design', icon: Layout, count: '9,500' },
  { name: 'QA & Review', icon: PenTool, count: '2,300' },
  { name: 'Support & IT', icon: Search, count: '5,600' },
];

const POPULAR_GIGS = Array(8).fill(null).map((_, i) => ({
  id: i,
  title: 'I will build a responsive modern React JS web application',
  seller: {
    name: 'Alex Rivera',
    avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop`,
    level: 'Top Rated',
  },
  image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
  rating: 5.0,
  reviews: 124,
  price: 150,
  delivery: '3d'
}));

export default function GigCategoryPage() {
  return (
    <div className="min-h-screen bg-white font-body flex flex-col">

      {/* Category Hero Banner */}
      <div className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-brand-900">
          <img
            src={CATEGORY.banner}
            alt={CATEGORY.name}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/50 to-transparent" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <CATEGORY.icon className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display font-bold text-4xl md:text-5xl text-white mb-4"
          >
            {CATEGORY.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80 font-body"
          >
            {CATEGORY.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-center gap-6 mt-8 hidden sm:flex"
          >
            <div className="text-center">
              <span className="block font-mono font-bold text-2xl text-white">{CATEGORY.stats.freelancers}</span>
              <span className="text-xs font-body font-medium text-white/60 uppercase tracking-wide">Freelancers</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <span className="block font-mono font-bold text-2xl text-white">{CATEGORY.stats.projects}</span>
              <span className="text-xs font-body font-medium text-white/60 uppercase tracking-wide">Projects done</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <span className="block font-mono font-bold text-2xl text-white">{CATEGORY.stats.satisfaction}</span>
              <span className="text-xs font-body font-medium text-white/60 uppercase tracking-wide">Satisfaction</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full space-y-12">

        {/* Explore Subcategories */}
        <div>
          <h2 className="font-display font-semibold text-2xl text-brand-900 mb-6">Explore {CATEGORY.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SUBCATEGORIES.map((sub, i) => {
              const Icon = sub.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  key={sub.name}
                  className="bg-white border border-border rounded-2xl p-4 text-center cursor-pointer group hover:border-accent DEFAULT hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-surface-soft rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-accent-light transition-colors">
                    <Icon className="w-6 h-6 text-ink-tertiary group-hover:text-accent DEFAULT transition-colors" />
                  </div>
                  <h3 className="text-sm font-body font-semibold text-ink-primary mb-1 group-hover:text-accent DEFAULT transition-colors">
                    {sub.name}
                  </h3>
                  <span className="text-xs font-body text-ink-tertiary">{sub.count} services</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Popular Services Grid */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="font-display font-semibold text-2xl text-brand-900">Popular in {CATEGORY.name}</h2>
              <p className="text-ink-secondary text-sm mt-1">Highly rated services chosen by businesses</p>
            </div>
            <button className="hidden sm:flex items-center gap-1 text-sm font-body font-medium text-accent DEFAULT hover:text-accent-dark transition-colors">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {POPULAR_GIGS.map((gig, idx) => (
              <motion.div
                key={gig.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                whileHover={{ y: -3 }}
                className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col"
              >
                <div className="aspect-[4/3] w-full relative bg-surface-muted">
                  <img
                    src={gig.image}
                    alt={gig.title}
                    className="w-full h-full object-cover"
                    width={800}
                    height={600}
                  />
                  <button className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors z-10">
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    <Clock className="w-3 h-3 text-ink-tertiary" />
                    <span className="text-xs font-mono font-medium text-ink-primary">{gig.delivery}</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={gig.seller.avatar}
                      alt={gig.seller.name}
                      className="w-6 h-6 rounded-full object-cover"
                      width={24}
                      height={24}
                    />
                    <span className="text-xs font-body font-semibold text-ink-primary">{gig.seller.name}</span>
                  </div>
                  <h3 className="text-sm font-body font-semibold text-ink-primary leading-snug mb-3 line-clamp-2 hover:text-accent DEFAULT transition-colors">
                    {gig.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mb-4">
                    <Star className="w-4 h-4 fill-accent DEFAULT text-accent DEFAULT" />
                    <span className="text-sm font-body font-semibold text-ink-primary">{gig.rating}</span>
                    <span className="text-xs font-body text-ink-tertiary">({gig.reviews})</span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between items-center mt-auto">
                    <span className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Starting at</span>
                    <span className="font-mono font-bold text-lg text-ink-primary">KES {gig.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="sm:hidden w-full mt-6 py-2.5 bg-surface-muted rounded-xl text-sm font-body font-medium text-ink-primary transition-colors">
            View all services
          </button>
        </div>

        {/* SEO Text Block */}
        <div className="bg-surface-soft rounded-2xl p-6 border border-border">
          <h2 className="font-display font-semibold text-xl text-brand-900 mb-3">Programming & Tech on Forte</h2>
          <p className="text-sm text-ink-secondary leading-relaxed mb-4">
            Whether you need a simple landing page, a complex SaaS application, or specialized data analysis, our community of expert programmers and technologists is ready to help. Discover top talent in web development, mobile apps, artificial intelligence, and more.
          </p>
          <div className="flex flex-wrap gap-2">
            {['React JS', 'Python', 'WordPress', 'Shopify', 'iOS Apps', 'Android', 'Machine Learning'].map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-white border border-border rounded-lg text-xs font-body font-medium text-ink-tertiary hover:border-accent DEFAULT hover:text-accent DEFAULT transition-colors cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
