import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, SlidersHorizontal, ChevronDown, Star, Heart, 
  MapPin, Clock, Award, X, Check
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

// Mock Data
const MOCK_GIGS = Array(12).fill(null).map((_, i) => ({
  id: i,
  title: [
    'I will build a responsive modern React JS web application',
    'I will design an outstanding SaaS landing page in Figma',
    'I will write SEO optimized tech blog posts',
    'I will create custom 3D animations for your brand'
  ][i % 4],
  seller: {
    name: ['Alex Rivera', 'Sarah Chen', 'Mike Johnson', 'Elena Rodriguez'][i % 4],
    avatar: `https://i.pravatar.cc/150?u=${i}`,
    level: i % 3 === 0 ? 'Top Rated' : i % 2 === 0 ? 'Level 2' : 'New Seller',
  },
  image: [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    'https://images.unsplash.com/photo-1455390582262-044cdead27d8?w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
  ][i % 4],
  rating: (4.5 + Math.random() * 0.5).toFixed(1),
  reviews: Math.floor(Math.random() * 500) + 10,
  price: Math.floor(Math.random() * 500) + 50,
  delivery: i % 2 === 0 ? '24h' : '3d',
  isFavorite: i === 2
}));

const CATEGORIES = ['All Categories', 'Web Development', 'UI/UX Design', 'Digital Marketing', 'Writing', 'Video & Animation'];

export default function GigSearchPage() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Categories');
  
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
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-zinc-400"
              />
              <Search className="absolute left-4 top-1/2 -tranzinc-y-1/2 w-5 h-5 text-zinc-400" />
              <button className="absolute right-2 top-1/2 -tranzinc-y-1/2 bg-brand-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-700 transition-colors">
                Search
              </button>
            </div>

            {/* Quick Filters / Sorting */}
            <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
              <button 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-colors shrink-0",
                  isFiltersOpen ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-600" : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-surface dark:hover:bg-zinc-800/50"
                )}
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
              
              <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700 shrink-0 mx-1" />
              
              <select className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer shrink-0">
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
                        deliveryFilter === time ? "bg-brand-500 border-brand-500" : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-surface-dark group-hover:border-brand-400"
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
                  <input type="number" placeholder="Min" className="w-full bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm font-bold text-zinc-900 dark:text-white outline-none focus:border-brand-500" />
                  <span className="text-zinc-400">-</span>
                  <input type="number" placeholder="Max" className="w-full bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm font-bold text-zinc-900 dark:text-white outline-none focus:border-brand-500" />
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
                          isChecked ? "bg-brand-500 border-brand-500" : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-surface-dark group-hover:border-brand-400"
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
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">12,490 services available</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MOCK_GIGS.map(gig => (
              <div key={gig.id} className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden group hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-brand-500/5 transition-all hover:-tranzinc-y-1 flex flex-col cursor-pointer">
                
                {/* Thumbnail */}
                <div className="aspect-[4/3] w-full relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img src={gig.image} alt="Gig Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full transition-colors z-10 group/btn">
                    <Heart className={cn("w-4 h-4", gig.isFavorite ? "fill-rose-500 text-rose-500" : "text-white group-hover/btn:text-rose-500")} />
                  </button>
                  {/* Delivery Badge */}
                  <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">{gig.delivery}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* Seller Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="relative">
                      <img src={gig.seller.avatar} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-success border border-white dark:border-zinc-900 rounded-full" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white group-hover:underline">{gig.seller.name}</span>
                      <span className="text-[10px] font-semibold text-zinc-500">{gig.seller.level}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 leading-snug mb-3 line-clamp-2 hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex-1">
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

          {/* Load More */}
          <div className="mt-12 flex justify-center">
            <button className="px-8 py-3 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 hover:border-brand-500 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl shadow-sm transition-all hover:text-brand-600">
              Load More Gigs
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
