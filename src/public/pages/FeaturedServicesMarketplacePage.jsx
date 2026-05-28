import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Star, TrendingUp, Sparkles, ChevronRight, ChevronLeft,
  Briefcase, Code, PenTool, Video, Music, Palette, Cpu, Globe, Heart, ArrowRight
} from 'lucide-react';

const CATEGORIES = [
  { id: 1, name: 'Development & IT', icon: Code, color: 'text-brand-600', bg: 'bg-brand-50 dark:bg-brand-900/20' },
  { id: 2, name: 'Design & Creative', icon: Palette, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-900/20' },
  { id: 3, name: 'Digital Marketing', icon: Globe, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  { id: 4, name: 'Writing & Translation', icon: PenTool, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { id: 5, name: 'Video & Animation', icon: Video, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  { id: 6, name: 'Music & Audio', icon: Music, color: 'text-accent', bg: 'bg-pink-50 dark:bg-pink-900/20' },
  { id: 7, name: 'Business', icon: Briefcase, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-900/20' },
  { id: 8, name: 'AI Services', icon: Cpu, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
];

const TRENDING_SERVICES = [
  { id: 101, title: 'I will develop a custom AI chatbot for your website', seller: 'AI_Wizard', rating: 4.9, reviews: 124, price: 500, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400', badge: 'Trending' },
  { id: 102, title: 'I will design a modern minimalist logo', seller: 'DesignPro', rating: 4.8, reviews: 890, price: 150, image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=400', badge: 'Best Seller' },
  { id: 103, title: 'I will build a responsive React web application', seller: 'CodeMaster', rating: 5.0, reviews: 45, price: 800, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400' },
  { id: 104, title: 'I will edit your YouTube videos professionally', seller: 'VideoNinja', rating: 4.7, reviews: 312, price: 80, image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=400' },
];

const SPONSORED_SERVICES = [
  { id: 201, title: 'I will write SEO optimized blog articles', seller: 'ContentKing', rating: 4.9, reviews: 210, price: 60, image: 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&q=80&w=400', sponsored: true },
  { id: 202, title: 'I will create highly converting Facebook ads', seller: 'AdGenius', rating: 4.6, reviews: 156, price: 200, image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=400', sponsored: true },
  { id: 203, title: 'I will design your mobile app UI/UX', seller: 'CreativeMind', rating: 5.0, reviews: 88, price: 350, image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400', sponsored: true },
  { id: 204, title: 'I will provide comprehensive SEO audits', seller: 'SEOGuru', rating: 4.8, reviews: 420, price: 120, image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=400', sponsored: true },
];

const AI_RECOMMENDATIONS = [
  { id: 301, title: 'I will setup your cloud infrastructure on AWS', seller: 'CloudExpert', rating: 4.9, reviews: 67, price: 400, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400', match: '98%' },
  { id: 302, title: 'I will audit your smart contract for security', seller: 'CryptoSec', rating: 5.0, reviews: 24, price: 1000, image: 'https://images.unsplash.com/photo-1639762681485-074b7f4ec651?auto=format&fit=crop&q=80&w=400', match: '95%' },
  { id: 303, title: 'I will create a comprehensive business plan', seller: 'BizStrategist', rating: 4.8, reviews: 112, price: 300, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400', match: '92%' },
];

function ServiceCard({ service, showMatch = false }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col group cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <button 
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors"
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>
        {service.badge && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-brand-600 text-white text-xs font-medium rounded-full shadow-sm">
            {service.badge}
          </div>
        )}
        {showMatch && service.match && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-teal-500 text-white text-xs font-medium rounded-full flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3" />
            {service.match} Match
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img src={`https://ui-avatars.com/api/?name=${service.seller}&background=random`} alt={service.seller} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{service.seller}</span>
          </div>
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-3 group-hover:text-brand-600 transition-colors leading-snug">
          {service.title}
        </h3>
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {service.rating} <span className="text-gray-500 dark:text-gray-400 font-normal">({service.reviews})</span>
          </div>
          <div className="font-semibold text-gray-900 dark:text-white">
            From ${service.price}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedServicesMarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-surface dark:bg-gray-950 pb-20 font-sans">
      {/* Hero Section */}
      <div className="bg-brand-600 dark:bg-brand-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 p-12 opacity-20 pointer-events-none">
           <Sparkles className="w-48 h-48" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 flex flex-col items-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl"
          >
            Find the perfect freelance services for your business
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-100 text-lg md:text-xl mb-10 max-w-2xl"
          >
            Discover top-rated talent, AI-matched to your project needs. Get started today and bring your ideas to life.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-3xl relative"
          >
            <div className="relative flex items-center bg-white rounded-xl shadow-xl p-2 focus-within:ring-4 focus-within:ring-brand-500/30 transition-all">
              <Search className="w-6 h-6 text-gray-400 ml-4 flex-shrink-0" />
              <input 
                type="text"
                placeholder="Search for any service..."
                className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500 px-4 py-3 text-lg outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex-shrink-0">
                Search
              </button>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-brand-100">
              <span className="font-medium mr-2 text-white/80">Popular:</span>
              {['Website Design', 'WordPress', 'Logo Design', 'AI Services', 'Video Editing'].map(term => (
                <button key={term} className="px-3 py-1 rounded-full border border-white/20 hover:bg-white/10 hover:text-white transition-all">
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Explore by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center gap-4"
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors">
                    {cat.name}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* AI Recommendations */}
        <section className="bg-gradient-to-br from-teal-50 to-brand-50 dark:from-teal-900/20 dark:to-brand-900/20 rounded-3xl p-8 md:p-10 border border-teal-100 dark:border-teal-900/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-100 dark:bg-teal-900/50 rounded-xl text-teal-600 dark:text-teal-400">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recommended for You</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Based on your recent activity and AI matching</p>
              </div>
            </div>
            <button className="text-brand-600 dark:text-brand-400 font-medium flex items-center gap-1 hover:gap-2 transition-all self-start md:self-auto">
              View all matches <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_RECOMMENDATIONS.map((service, idx) => (
              <motion.div key={service.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <ServiceCard service={service} showMatch={true} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trending Services */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Services</h2>
            </div>
            <div className="flex gap-2">
              <button className="p-2.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-surface dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-surface dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRENDING_SERVICES.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        {/* Sponsored Services */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sponsored Services</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Featured partners and top-rated professionals</p>
            </div>
            <button className="text-brand-600 dark:text-brand-400 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              See all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPONSORED_SERVICES.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
