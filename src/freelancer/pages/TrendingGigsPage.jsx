import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Flame, ArrowUpRight, Star, 
  Heart, Clock, Loader2
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import { useFeaturedGigs } from '../../common/hooks/useGigsMarketplace';

const CATEGORIES = ['All Trending', 'AI Services', 'Web Development', 'Design', 'Video', 'Marketing'];

export default function TrendingGigsPage() {
  const [timeframe, setTimeframe] = useState('weekly');
  const [activeCategory, setActiveCategory] = useState('All Trending');
  const { gigs, loading } = useFeaturedGigs({ limit: 12, sortBy: 'trending' });

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans flex flex-col">
      
      {/* Header Section */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-rose-600 dark:fill-rose-400" /> Hot Right Now
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
                Trending Services
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-2 max-w-lg">
                Discover the fastest-growing services on Forte. These gigs are receiving exceptional buyer interest and perfect ratings.
              </p>
            </div>

            {/* Timeframe Toggle */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl shadow-inner shrink-0">
              <button 
                onClick={() => setTimeframe('daily')}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                  timeframe === 'daily' ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                )}
              >
                Today
              </button>
              <button 
                onClick={() => setTimeframe('weekly')}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                  timeframe === 'weekly' ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                )}
              >
                This Week
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
                  activeCategory === cat ? "bg-surface-dark dark:bg-white text-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Feed */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full">
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#14a800]" />
          </div>
        ) : gigs.length === 0 ? (
          <p className="text-center text-zinc-500 font-medium py-16">No trending gigs right now.</p>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {gigs.map((gig, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                key={gig.id} 
                className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden group hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-rose-500/5 transition-all hover:-tranzinc-y-1 flex flex-col cursor-pointer relative"
              >
                
                {/* Top Badge Overlay */}
                <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-start p-4 pointer-events-none">
                  <div className="bg-surface-dark text-white font-black text-lg w-10 h-10 flex items-center justify-center rounded-xl shadow-lg border border-white/10 shadow-black/50">
                    #{idx + 1}
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="aspect-[4/3] w-full relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  {gig.img ? (
                    <img src={gig.img} alt="Gig Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Seller Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600">
                      {(gig.seller || 'S')[0]}
                    </div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white group-hover:underline">{gig.seller}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 leading-snug mb-4 line-clamp-2 hover:text-[#14a800] dark:hover:text-[#14a800] transition-colors flex-1">
                    {gig.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-5">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{gig.rating}</span>
                    <span className="text-xs font-semibold text-zinc-400">({gig.reviews})</span>
                  </div>

                  {/* Price Row */}
                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center mt-auto">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Starting at</span>
                    <span className="text-xl font-black text-zinc-900 dark:text-white">${gig.price}</span>
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
