// src/pages/public/FeaturedGigShowcasePage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, ShieldCheck, Star, ChevronRight,
  ArrowRight, Award, Zap, Loader2
} from 'lucide-react';
import { useFreelancerGigs } from '../services/freelancerHooks';

export default function FeaturedGigShowcasePage() {
  const { data, isLoading } = useFreelancerGigs({ isFeatured: true, limit: 3 });
  
  // Use data items or empty array
  const gigs = Array.isArray(data) ? data : data?.items ?? data?.gigs ?? [];
  return (
    <div className="min-h-screen bg-white font-body overflow-hidden">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white border-b border-border">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-xl text-brand-900">
            Forte<span className="text-accent DEFAULT">PRO</span>
          </span>
        </div>
        <button className="px-5 py-2 rounded-lg bg-brand-900 text-white text-xs font-body font-medium hover:bg-brand-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2">
          Apply as Pro
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 flex flex-col items-center justify-center text-center min-h-[70vh]">
        {/* Background Glows */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-light/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-info-light/20 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white shadow-sm mb-8 relative z-10"
        >
          <Sparkles className="w-4 h-4 text-accent DEFAULT" />
          <span className="text-xs font-body font-semibold uppercase tracking-wide text-ink-secondary">
            Editor's picks
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.35 }}
          className="font-display font-bold text-5xl sm:text-7xl tracking-tight mb-6 relative z-10 max-w-4xl leading-[1.2] text-brand-900"
        >
          World-class talent.<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent DEFAULT via-info DEFAULT to-accent DEFAULT">
            Unrivaled quality.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="text-lg sm:text-xl text-ink-secondary max-w-2xl font-body font-medium mb-10 relative z-10"
        >
          Discover hand-picked professionals vetted for expertise, communication, and flawless delivery. The top 1% of the Forte marketplace.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-6 text-sm font-body font-medium text-ink-secondary relative z-10"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent DEFAULT" />
            <span>Vetted experts</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent DEFAULT" />
            <span>Guaranteed quality</span>
          </div>
        </motion.div>
      </div>

      {/* Main Showcase Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gigs.map((gig, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              key={gig.id}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden relative mb-5 border border-border bg-surface-muted group-hover:border-accent DEFAULT transition-all duration-300">
                <img
                  src={gig.image}
                  alt={gig.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  width={800}
                  height={1000}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/40 to-transparent opacity-70" />

                {/* Pro Badge */}
                <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 bg-brand-900/80 backdrop-blur-sm rounded-full border border-white/10">
                  <Zap className="w-3.5 h-3.5 text-accent DEFAULT" />
                  <span className="text-xs font-body font-semibold uppercase tracking-wide text-white">
                    Pro verified
                  </span>
                </div>

                {/* Seller Info */}
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={gig.seller?.avatar || 'https://via.placeholder.com/150'}
                      alt={gig.seller?.name || 'Seller'}
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                      width={40}
                      height={40}
                    />
                    <div>
                      <h4 className="text-white font-body font-semibold text-sm">{gig.seller?.name || 'Verified Pro'}</h4>
                      <p className="text-xs font-body font-medium text-accent-light">{gig.seller?.title || 'Forte Expert'}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(gig.tags || []).slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-body font-medium text-white/90"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title & Price */}
              <div className="px-2">
                <h3 className="font-body font-semibold text-xl text-ink-primary mb-2 leading-snug group-hover:text-accent DEFAULT transition-colors">
                  {gig.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-accent DEFAULT font-body font-semibold text-sm">
                    <Star className="w-4 h-4 fill-accent DEFAULT text-accent DEFAULT" />
                    <span>{(gig.rating || 0).toFixed(1)}</span>
                  </div>
                  <div className="text-ink-tertiary text-sm font-body">
                    Starting at{' '}
                    <span className="text-ink-primary font-mono font-semibold text-lg ml-1">
                      KES {(gig.price || gig.startingPrice || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}

        {/* View All CTA */}
        <div className="mt-16 flex justify-center">
          <button className="group inline-flex items-center gap-2 px-8 py-4 bg-brand-900 text-white font-body font-semibold rounded-xl transition-all hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2">
            <span className="flex items-center gap-2">
              Explore all pro services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>

      {/* Value Props */}
      <div className="border-t border-border bg-surface-soft mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05, duration: 0.35 }}
            >
              <div className="w-16 h-16 bg-accent-light rounded-2xl flex items-center justify-center mx-auto mb-5">
                <ShieldCheck className="w-8 h-8 text-accent DEFAULT" />
              </div>
              <h3 className="font-display font-semibold text-lg text-brand-900 mb-2">Vetted for excellence</h3>
              <p className="text-sm font-body text-ink-secondary">
                Only 1% of applicants pass our rigorous quality and communication assessments
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.35 }}
            >
              <div className="w-16 h-16 bg-accent-light rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Star className="w-8 h-8 text-accent DEFAULT" />
              </div>
              <h3 className="font-display font-semibold text-lg text-brand-900 mb-2">Dedicated support</h3>
              <p className="text-sm font-body text-ink-secondary">
                Pro orders include VIP support with faster response times and dispute resolution
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.35 }}
            >
              <div className="w-16 h-16 bg-accent-light rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Sparkles className="w-8 h-8 text-accent DEFAULT" />
              </div>
              <h3 className="font-display font-semibold text-lg text-brand-900 mb-2">Flawless delivery</h3>
              <p className="text-sm font-body text-ink-secondary">
                Expect premium deliverables, proactive communication, and zero friction
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
