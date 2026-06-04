import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, SlidersHorizontal, Star, Heart, 
  Clock, Check, Loader2
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import { useFeaturedGigs } from '../../common/hooks/useGigsMarketplace';

const CATEGORIES = ['All Categories', 'Web Development', 'UI/UX Design', 'Digital Marketing', 'Writing', 'Video & Animation'];

export default function GigSearchPage() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const { gigs, loading } = useFeaturedGigs({ limit: 24, q: searchQuery || undefined });
  
  // Filter states
  const [budgetRange, setBudgetRange] = useState([10, 1000]);
  const [deliveryFilter, setDeliveryFilter] = useState('');
  const [sellerLevelFilter, setSellerLevelFilter] = useState([]);

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans flex flex-col">
      
      {/* Top Search & Filter Bar */}
      <div className="sticky top-0 z-40 bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full max-w-xl">
              <input 
                type="text"
                placeholder="What service are you looking for today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2bb75c] transition-all placeholder:text-zinc-400"
              />
              <Search className="absolute left-4 top-1/2 -tranzinc-y-1/2 w-5 h-5 text-zinc-400" />
              <button className="absolute right-2 top-1/2 -tranzinc-y-1/2 bg-[#2bb75c] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#1d8d38] transition-colors">
                Search
              </button>
            </div>

            {/* Quick Filters / Sorting */}
            <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
              <button 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-colors shrink-0",
                  isFiltersOpen ? "border-[#2bb75c]/20 bg-[#2bb75c]/5 dark:bg-[#2bb75c]/10 text-[#2bb75c]" : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-surface dark:hover:bg-zinc-800/50"
                )}
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
              
              <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700 shrink-0 mx-1" />
              
              <select className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-[#2bb75c] cursor-pointer shrink-0">
                <option>Sort by: Recommended</option>
                <option>Sort by: Best Selling</option>
                <option>Sort by: Newest Arrivals</option>
              </select>
            </div>

          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto scrollbar-hide pb-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors",
                  activeCategory === cat ? "bg-surface-dark dark:bg-white text-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex flex-col md:flex-row gap-8 items-start relative">
        
        {/* Left Filters Sidebar */}
        <AnimatePresence>
          {(isFiltersOpen || window.innerWidth >= 768) && (
            <motion.div 
              initial={{ opacity: 0, width: 0, x: -20 }}
              animate={{ opacity: 1, width: 250, x: 0 }}
              exit={{ opacity: 0, width: 0, x: -20 }}
              className={cn(
                "w-[250px] shrink-0 space-y-6 overflow-hidden",
                !isFiltersOpen && "hidden md:block" // Force hide on mobile if not open, but keep structure for animation
              )}
            >
              
              {/* Delivery Time Filter */}
              <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Delivery Time</h3>
                <div className="space-y-3">
                  {['Up to 24 hours', 'Up to 3 days', 'Up to 7 days', 'Anytime'].map(time => (
                    <label key={time} className="flex items-center gap-3 cursor-pointer group">
                      <div className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                        deliveryFilter === time ? "bg-[#2bb75c] border-[#2bb75c]/20" : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-surface-dark group-hover:border-[#2bb75c]/20"
                      )}>
                        {deliveryFilter === time && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <input type="radio" className="hidden" name="delivery" onChange={() => setDeliveryFilter(time)} />
                      <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{time}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget Filter */}
              <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Budget ($)</h3>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" className="w-full bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm font-bold text-zinc-900 dark:text-white outline-none focus:border-[#2bb75c]/20" />
                  <span className="text-zinc-400">-</span>
                  <input type="number" placeholder="Max" className="w-full bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm font-bold text-zinc-900 dark:text-white outline-none focus:border-[#2bb75c]/20" />
                </div>
              </div>

              {/* Seller Level Filter */}
              <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Seller Level</h3>
                <div className="space-y-3">
                  {['Top Rated Seller', 'Level 2', 'Level 1', 'New Seller'].map(level => {
                    const isChecked = sellerLevelFilter.includes(level);
                    return (
                      <label key={level} className="flex items-center gap-3 cursor-pointer group">
                        <div className={cn(
                          "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                          isChecked ? "bg-[#2bb75c] border-[#2bb75c]/20" : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-surface-dark group-hover:border-[#2bb75c]/20"
                        )}>
                          {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" onChange={() => {
                          setSellerLevelFilter(prev => isChecked ? prev.filter(l => l !== level) : [...prev, level])
                        }} />
                        <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{level}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Active Toggle */}
              <div>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">Online Sellers Only</span>
                  <div className="w-10 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 relative transition-colors group-hover:bg-zinc-300 dark:group-hover:bg-zinc-600 flex items-center p-0.5">
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </label>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Gig Grid Area */}
        <div className="flex-1 w-full min-w-0">
          
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{loading ? 'Loading…' : `${gigs.length} services available`}</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#2bb75c]" />
            </div>
          ) : gigs.length === 0 ? (
            <p className="text-center text-zinc-500 font-medium py-16">No gigs match your search.</p>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gigs.map(gig => (
              <div key={gig.id} className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden group hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-[#2bb75c]/25/5 transition-all hover:-tranzinc-y-1 flex flex-col cursor-pointer">
                
                {/* Thumbnail */}
                <div className="aspect-[4/3] w-full relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  {gig.img ? (
                    <img src={gig.img} alt="Gig Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : null}
                  <button type="button" className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full transition-colors z-10 group/btn">
                    <Heart className="w-4 h-4 text-white group-hover/btn:text-rose-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* Seller Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-bold">{(gig.seller || 'S')[0]}</div>
                    </div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white group-hover:underline">{gig.seller}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 leading-snug mb-3 line-clamp-2 hover:text-[#2bb75c] dark:hover:text-[#2bb75c] transition-colors flex-1">
                    {gig.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{gig.rating}</span>
                    <span className="text-xs font-semibold text-zinc-400">({gig.reviews})</span>
                  </div>

                  {/* Price Row */}
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center mt-auto">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Starting at</span>
                    <span className="text-lg font-black text-zinc-900 dark:text-white">${gig.price}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
          )}

        </div>

      </div>
    </div>
  );
}

