import React, { useState } from 'react';
import { Search, Filter, Star, ChevronDown, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GigMarketplacePage() {
  const [gigs] = useState([
    { id: 1, title: 'I will build a custom enterprise React dashboard', seller: 'Alex Johnson', level: 'Top Rated', rating: 4.9, reviews: 124, price: 500, delivery: '7 Days', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
    { id: 2, title: 'I will design your mobile app UI/UX in Figma', seller: 'Elena R.', level: 'Level 2', rating: 5.0, reviews: 89, price: 350, delivery: '3 Days', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
    { id: 3, title: 'I will setup your AWS cloud infrastructure', seller: 'Marcus C.', level: 'Top Rated Plus', rating: 4.8, reviews: 312, price: 1200, delivery: '14 Days', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
    { id: 4, title: 'I will write SEO-optimized technical content', seller: 'Sarah Dev', level: 'Level 1', rating: 4.9, reviews: 45, price: 80, delivery: '2 Days', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  ]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-gradient-to-r from-[#14a800] to-[#118a00] rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform tranzinc-x-1/2 -tranzinc-y-1/2"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Find the perfect freelance service for your business</h1>
          <div className="flex bg-white rounded-xl overflow-hidden shadow-lg p-1">
            <div className="flex items-center pl-4 bg-white">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Try 'react dashboard', 'logo design'..." 
              className="w-full border-none focus:ring-0 text-gray-900 placeholder-gray-500 py-3 px-4"
            />
            <button className="bg-[#14a800] hover:bg-[#118a00] text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Search
            </button>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 text-sm font-medium">
            <span className="text-[#14a800]">Popular:</span>
            {['Web Design', 'React.js', 'AWS Setup', 'SEO Writing'].map(tag => (
              <span key={tag} className="border border-[#14a800]/20/30 bg-[#118a00]/30 hover:bg-[#118a00]/50 cursor-pointer px-3 py-1 rounded-full transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <Filter className="w-5 h-5 mr-2" /> Filters
              </h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Service Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center text-sm text-gray-600 dark:text-gray-400"><input type="checkbox" className="mr-2 rounded text-[#14a800] focus:ring-[#14a800]" /> Programming & Tech</label>
                  <label className="flex items-center text-sm text-gray-600 dark:text-gray-400"><input type="checkbox" className="mr-2 rounded text-[#14a800] focus:ring-[#14a800]" /> Graphics & Design</label>
                  <label className="flex items-center text-sm text-gray-600 dark:text-gray-400"><input type="checkbox" className="mr-2 rounded text-[#14a800] focus:ring-[#14a800]" /> Digital Marketing</label>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Delivery Time</h3>
                <div className="space-y-2">
                  <label className="flex items-center text-sm text-gray-600 dark:text-gray-400"><input type="radio" name="delivery" className="mr-2 text-[#14a800] focus:ring-[#14a800]" /> Express 24h</label>
                  <label className="flex items-center text-sm text-gray-600 dark:text-gray-400"><input type="radio" name="delivery" className="mr-2 text-[#14a800] focus:ring-[#14a800]" /> Up to 3 days</label>
                  <label className="flex items-center text-sm text-gray-600 dark:text-gray-400"><input type="radio" name="delivery" className="mr-2 text-[#14a800] focus:ring-[#14a800]" /> Up to 7 days</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gig Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recommended for you</h2>
            <button className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Sort by: <span className="text-[#14a800] dark:text-[#14a800] ml-1">Relevance</span> <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={gig.id} 
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="h-48 overflow-hidden relative">
                  <img src={gig.image} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-900 flex items-center shadow-sm">
                    {gig.level === 'Top Rated Plus' ? <Zap className="w-3 h-3 text-yellow-500 mr-1 fill-current" /> : null}
                    {gig.level}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#14a800]/10 dark:bg-[#14a800]/50 text-[#14a800] flex items-center justify-center text-xs font-bold">
                      {gig.seller[0]}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white hover:underline">{gig.seller}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-lg leading-snug mb-4 group-hover:text-[#14a800] transition-colors line-clamp-2 h-14">
                    {gig.title}
                  </h3>
                  <div className="flex items-center text-sm font-bold text-gray-900 dark:text-white mb-4">
                    <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                    {gig.rating} <span className="text-gray-500 font-normal ml-1">({gig.reviews})</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-4 h-4 mr-1" /> {gig.delivery}
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Starting at</span>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">${gig.price}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
