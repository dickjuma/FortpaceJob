// src/pages/public/GigSearchPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Search, SlidersHorizontal, Star, Heart,
  Clock, Check, Loader2, X
} from 'lucide-react';
import { gigAPI } from '../../common/services/api';

const CATEGORIES = ['All Categories', 'Web Development', 'UI/UX Design', 'Digital Marketing', 'Writing', 'Video & Animation'];

export default function GigSearchPage() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState('');
  const [sellerLevelFilter, setSellerLevelFilter] = useState([]);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');

  const { data, isLoading: loading } = useQuery({
    queryKey: [
      'gigSearch',
      searchQuery,
      activeCategory,
      budgetMin,
      budgetMax,
      deliveryFilter,
      sellerLevelFilter.join(','),
      onlineOnly,
      sortBy,
    ],
    queryFn: () => {
      const params = {};
      if (searchQuery) params.q = searchQuery;
      if (activeCategory && activeCategory !== 'All Categories') params.category = activeCategory;
      if (budgetMin) params.priceMin = budgetMin;
      if (budgetMax) params.priceMax = budgetMax;
      if (deliveryFilter && deliveryFilter !== 'any') params.deliveryTime = deliveryFilter;
      if (onlineOnly) params.online = true;
      if (sortBy && sortBy !== 'recommended') params.sort = sortBy;
      return gigAPI.getGigs(params);
    },
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });

  const gigs = Array.isArray(data)
    ? data
    : data?.gigs ?? data?.items ?? data?.data ?? [];

  const getDeliveryTimeLabel = (time) => {
    switch(time) {
      case '24h': return 'Up to 24 hours';
      case '3d': return 'Up to 3 days';
      case '7d': return 'Up to 7 days';
      default: return 'Anytime';
    }
  };

  return (
    <div className="min-h-screen bg-white font-body flex flex-col">

      {/* Top Search & Filter Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Search Input */}
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                placeholder="What service are you looking for today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-soft border border-border rounded-xl pl-11 pr-24 h-11 text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900 placeholder:text-ink-tertiary"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ink-tertiary" />
              <button className="absolute right-1 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-brand-900 text-white rounded-lg text-xs font-body font-medium hover:bg-brand-800 transition-colors">
                Search
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-body font-medium border transition-colors ${
                  isFiltersOpen
                    ? "border-accent DEFAULT bg-accent-light text-accent DEFAULT"
                    : "border-border bg-white text-ink-primary hover:bg-surface-muted"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>

              <div className="h-5 w-px bg-border" />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 px-3 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900 cursor-pointer"
              >
                <option value="recommended">Sort by: Recommended</option>
                <option value="best-selling">Sort by: Best Selling</option>
                <option value="newest">Sort by: Newest</option>
                <option value="price-low">Sort by: Price: Low to High</option>
                <option value="price-high">Sort by: Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-body font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "bg-brand-900 text-white"
                    : "bg-surface-muted text-ink-secondary hover:bg-surface-soft"
                }`}
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
              animate={{ opacity: 1, width: 260, x: 0 }}
              exit={{ opacity: 0, width: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 overflow-hidden hidden md:block"
              style={{ width: isFiltersOpen || window.innerWidth >= 768 ? 260 : 0 }}
            >
              <div className="w-[260px] space-y-6 pr-2">

                {/* Delivery Time Filter */}
                <div className="pb-5 border-b border-border">
                  <h3 className="font-body font-semibold text-ink-primary mb-3">Delivery time</h3>
                  <div className="space-y-2">
                    {[
                      { id: '24h', label: 'Up to 24 hours' },
                      { id: '3d', label: 'Up to 3 days' },
                      { id: '7d', label: 'Up to 7 days' },
                      { id: 'any', label: 'Anytime' }
                    ].map(time => (
                      <label key={time.id} className="flex items-center gap-2 cursor-pointer group">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                            deliveryFilter === time.id
                              ? "border-accent DEFAULT"
                              : "border-border group-hover:border-accent DEFAULT"
                          }`}
                          onClick={() => setDeliveryFilter(deliveryFilter === time.id ? '' : time.id)}
                        >
                          {deliveryFilter === time.id && <div className="w-2 h-2 rounded-full bg-accent DEFAULT" />}
                        </div>
                        <span className="text-sm font-body text-ink-secondary group-hover:text-ink-primary transition-colors">
                          {time.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Budget Filter */}
                <div className="pb-5 border-b border-border">
                  <h3 className="font-body font-semibold text-ink-primary mb-3">Budget (KES)</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    />
                    <span className="text-ink-tertiary">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    />
                  </div>
                </div>

                {/* Seller Level Filter */}
                <div className="pb-5 border-b border-border">
                  <h3 className="font-body font-semibold text-ink-primary mb-3">Seller level</h3>
                  <div className="space-y-2">
                    {['Top Rated Seller', 'Level 2', 'Level 1', 'New Seller'].map(level => {
                      const isChecked = sellerLevelFilter.includes(level);
                      return (
                        <label key={level} className="flex items-center gap-2 cursor-pointer group">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                              isChecked
                                ? "bg-accent DEFAULT border-accent DEFAULT"
                                : "border-border bg-white group-hover:border-accent DEFAULT"
                            }`}
                            onClick={() => {
                              setSellerLevelFilter(prev =>
                                isChecked ? prev.filter(l => l !== level) : [...prev, level]
                              );
                            }}
                          >
                            {isChecked && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-sm font-body text-ink-secondary group-hover:text-ink-primary transition-colors">
                            {level}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Online Sellers Toggle */}
                <div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-body font-medium text-ink-primary">Online sellers only</span>
                    <div
                      className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                        onlineOnly ? "bg-accent DEFAULT" : "bg-border"
                      }`}
                      onClick={() => setOnlineOnly(!onlineOnly)}
                    >
                      <motion.div
                        className="w-4 h-4 bg-white rounded-full shadow-sm"
                        animate={{ x: onlineOnly ? 14 : 0 }}
                      />
                    </div>
                  </label>
                </div>

                {/* Reset Filters */}
                {(deliveryFilter || budgetMin || budgetMax || sellerLevelFilter.length > 0 || onlineOnly) && (
                  <button
                    onClick={() => {
                      setDeliveryFilter('');
                      setBudgetMin('');
                      setBudgetMax('');
                      setSellerLevelFilter([]);
                      setOnlineOnly(false);
                    }}
                    className="text-xs font-body font-medium text-accent DEFAULT hover:text-accent-dark transition-colors"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {isFiltersOpen && window.innerWidth < 768 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsFiltersOpen(false)}
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl p-5 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-display font-semibold text-lg text-brand-900">Filters</h3>
                  <button onClick={() => setIsFiltersOpen(false)} className="p-1">
                    <X className="w-5 h-5 text-ink-tertiary" />
                  </button>
                </div>
                {/* Mobile filter content - same as desktop */}
                <div className="space-y-5">
                  <div>
                    <h4 className="font-body font-semibold text-ink-primary mb-2">Delivery time</h4>
                    {['24h', '3d', '7d', 'any'].map(time => (
                      <label key={time} className="flex items-center gap-2 py-1">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            deliveryFilter === time ? "border-accent DEFAULT" : "border-border"
                          }`}
                          onClick={() => setDeliveryFilter(deliveryFilter === time ? '' : time)}
                        >
                          {deliveryFilter === time && <div className="w-2 h-2 rounded-full bg-accent DEFAULT m-0.5" />}
                        </div>
                        <span className="text-sm">{getDeliveryTimeLabel(time)}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-body font-semibold text-ink-primary mb-2">Budget (KES)</h4>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min" className="w-full h-9 px-3 border border-border rounded-lg text-sm" />
                      <input type="number" placeholder="Max" className="w-full h-9 px-3 border border-border rounded-lg text-sm" />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="w-full mt-6 py-2 rounded-lg bg-brand-900 text-white font-body font-medium text-sm"
                >
                  Apply filters
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gig Grid Area */}
        <div className="flex-1 w-full min-w-0">

          <div className="flex justify-between items-end mb-5">
            <h2 className="font-display font-semibold text-xl text-brand-900">
              {loading ? 'Loading...' : `${gigs.length} services available`}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-accent DEFAULT border-t-transparent rounded-full animate-spin" />
            </div>
          ) : gigs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-ink-secondary font-body">No gigs match your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {gigs.map((gig, idx) => (
                <motion.div
                  key={gig.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ y: -3 }}
                  className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col"
                >
                  <div className="aspect-[4/3] w-full relative overflow-hidden bg-surface-muted">
                    <img
                      src={gig.img}
                      alt={gig.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      width={400}
                      height={300}
                    />
                    <button className="absolute top-2 right-2 p-1.5 bg-black/20 hover:bg-black/40 rounded-full transition-colors">
                      <Heart className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-accent-light flex items-center justify-center text-xs font-mono font-semibold text-accent-dark">
                        {gig.seller.charAt(0)}
                      </div>
                      <span className="text-xs font-body font-medium text-ink-secondary">{gig.seller}</span>
                    </div>

                    <h3 className="text-sm font-body font-semibold text-ink-primary leading-snug mb-2 line-clamp-2 hover:text-accent DEFAULT transition-colors">
                      {gig.title}
                    </h3>

                    <div className="flex items-center gap-1.5 mb-3">
                      <Star className="w-3.5 h-3.5 fill-accent DEFAULT text-accent DEFAULT" />
                      <span className="text-sm font-body font-semibold text-ink-primary">{gig.rating}</span>
                      <span className="text-xs font-body text-ink-tertiary">({gig.reviews})</span>
                    </div>

                    <div className="pt-2 border-t border-border flex justify-between items-center mt-auto">
                      <span className="text-xs font-body font-medium text-ink-tertiary">Starting at</span>
                      <span className="font-mono font-bold text-base text-ink-primary">KES {gig.price}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
