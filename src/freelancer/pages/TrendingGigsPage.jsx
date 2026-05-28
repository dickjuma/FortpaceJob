import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Flame, ArrowUpRight, Star, 
  Heart, Clock, Sparkles, RefreshCw
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

// Mock Data
const CATEGORIES = ['All Trending', 'AI Services', 'Web Development', 'Design', 'Video', 'Marketing'];

const MOCK_GIGS = Array(8).fill(null).map((_, i) => ({
  id: i,
  title: [
    'I will build a custom ChatGPT AI agent for your business',
    'I will develop a modern React JS landing page',
    'I will design an outstanding SaaS UI UX in Figma',
    'I will create viral short form videos for TikTok'
  ][i % 4],
  seller: {
    name: ['Alex Rivera', 'Sarah Chen', 'Mike Johnson', 'Elena Rodriguez'][i % 4],
    avatar: `https://i.pravatar.cc/150?u=${i}`,
    level: i % 3 === 0 ? 'Top Rated' : i % 2 === 0 ? 'Level 2' : 'New Seller',
  },
  image: [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80'
  ][i % 4],
  rating: (4.8 + Math.random() * 0.2).toFixed(1),
  reviews: Math.floor(Math.random() * 800) + 100,
  price: Math.floor(Math.random() * 300) + 50,
  trendingRank: i + 1,
  growthPercent: Math.floor(Math.random() * 50) + 120
}));

export default function TrendingGigsPage() {
  const [timeframe, setTimeframe] = useState('weekly'); // daily, weekly
  const [activeCategory, setActiveCategory] = useState('All Trending');

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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {MOCK_GIGS.map((gig, idx) => (
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
                    #{gig.trendingRank}
                  </div>
                  <div className="bg-white dark:bg-surface-dark px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-zinc-100 dark:border-zinc-800">
                    <TrendingUp className="w-3.5 h-3.5 text-success" />
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">+{gig.growthPercent}%</span>
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="aspect-[4/3] w-full relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img src={gig.image} alt="Gig Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Seller Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <img src={gig.seller.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white group-hover:underline">{gig.seller.name}</span>
                      <span className="text-[10px] font-bold text-brand-600 bg-brand-50 dark:bg-brand-500/10 px-1.5 py-0.5 rounded w-fit">{gig.seller.level}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 leading-snug mb-4 line-clamp-2 hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex-1">
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

        {/* Load More Trigger */}
        <div className="mt-16 text-center">
          <button className="inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 hover:border-brand-500 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl shadow-sm transition-all hover:text-brand-600">
            <RefreshCw className="w-4 h-4" /> Load More Trending
          </button>
        </div>

      </div>

    </div>
  );
}
