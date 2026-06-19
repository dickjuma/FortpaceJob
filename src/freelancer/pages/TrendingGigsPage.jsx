// src/pages/freelancer/TrendingGigsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Star, Loader2, TrendingUp } from 'lucide-react';
import { useFeaturedGigs } from '../../platform/common/hooks/useGigsMarketplace';

// ---------- Shared UI Components (inline) ----------
const Card = ({ children, className = '', hover = true }) => (
  <motion.div
    whileHover={hover ? { y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' } : {}}
    transition={{ duration: 0.2 }}
    className={`bg-white border border-border rounded-2xl shadow-sm ${className}`}
  >
    {children}
  </motion.div>
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-surface-muted text-ink-secondary',
    success: 'bg-accent-light text-accent-dark',
    warning: 'bg-warn-light text-warn',
    danger: 'bg-danger-light text-danger',
    info: 'bg-info-light text-info',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Spinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-8 h-8 border-4 border-border border-t-brand-900 rounded-full animate-spin" />
  </div>
);

// ---------- Constants ----------
const CATEGORIES = ['All Trending', 'AI Services', 'Web Development', 'Design', 'Video', 'Marketing'];

// ---------- Main Component ----------
export default function TrendingGigsPage() {
  const [timeframe, setTimeframe] = useState('weekly');
  const [activeCategory, setActiveCategory] = useState('All Trending');
  const { gigs, loading } = useFeaturedGigs({ limit: 12, sortBy: 'trending' });

  return (
    <div className="min-h-screen bg-surface-soft">
      {/* Header Section */}
      <div className="bg-white border-b border-border pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="danger" className="gap-1">
                  <Flame className="w-3.5 h-3.5" /> Trending
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-brand-900 tracking-tight flex items-center gap-3">
                Trending services
              </h1>
              <p className="text-sm text-ink-secondary font-medium mt-2 max-w-lg">
                Discover the fastest-growing services. These gigs are receiving exceptional buyer interest.
              </p>
            </div>

            {/* Timeframe Toggle */}
            <div className="flex items-center bg-surface-muted p-1 rounded-lg shrink-0">
              <button
                onClick={() => setTimeframe('daily')}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                  timeframe === 'daily'
                    ? 'bg-white text-brand-900 shadow-sm border border-border'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setTimeframe('weekly')}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                  timeframe === 'weekly'
                    ? 'bg-white text-brand-900 shadow-sm border border-border'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                This week
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-brand-900 text-white'
                    : 'bg-surface-muted text-ink-secondary hover:bg-surface-soft'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Feed */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {loading ? (
          <Spinner />
        ) : gigs.length === 0 ? (
          <div className="text-center py-16">
            <TrendingUp className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
            <p className="text-ink-secondary">No trending gigs at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {gigs.map((gig, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: idx * 0.05, duration: 0.2 }}
                  key={gig.id}
                  className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col"
                >
                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-brand-900 text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-lg shadow-sm">
                      #{idx + 1}
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div className="aspect-[4/3] w-full relative overflow-hidden bg-surface-muted">
                    {gig.img ? (
                      <img
                        src={gig.img}
                        alt={gig.title || 'Gig thumbnail'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        width="400"
                        height="300"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-soft" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Seller Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-xs font-bold text-ink-secondary">
                        {(gig.seller || 'S')[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-ink-primary">{gig.seller}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-display font-semibold text-brand-900 leading-snug mb-3 line-clamp-2 flex-1">
                      {gig.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-4">
                      <Star className="w-4 h-4 fill-warn text-warn" />
                      <span className="text-sm font-semibold text-ink-primary">{gig.rating}</span>
                      <span className="text-xs font-medium text-ink-tertiary">({gig.reviews})</span>
                    </div>

                    {/* Price */}
                    <div className="pt-4 border-t border-border flex justify-between items-center">
                      <span className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wide">Starting at</span>
                      <span className="text-xl font-mono font-bold text-brand-900">${gig.price}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
