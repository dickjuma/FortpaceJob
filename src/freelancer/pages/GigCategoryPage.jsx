import React from 'react';
import { motion } from 'framer-motion';
import { 
  MonitorPlay, Code2, PenTool, Search, 
  Smartphone, Database, Layout, ChevronRight,
  Star, Heart, Clock
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

// Mock Data
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
    avatar: `https://i.pravatar.cc/150?u=${i}`,
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
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans flex flex-col">
      
      {/* Category Hero Banner */}
      <div className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-surface-dark">
          <img src={CATEGORY.banner} alt="Category Banner" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto mt-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <CATEGORY.icon className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
          >
            {CATEGORY.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-zinc-300 font-medium"
          >
            {CATEGORY.description}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-6 mt-8 hidden sm:flex"
          >
            <div className="text-center"><span className="block text-2xl font-black text-white">{CATEGORY.stats.freelancers}</span><span className="text-xs font-bold text-zinc-400 uppercase">Freelancers</span></div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center"><span className="block text-2xl font-black text-white">{CATEGORY.stats.projects}</span><span className="text-xs font-bold text-zinc-400 uppercase">Projects done</span></div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center"><span className="block text-2xl font-black text-white">{CATEGORY.stats.satisfaction}</span><span className="text-xs font-bold text-zinc-400 uppercase">Satisfaction</span></div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full space-y-16">
        
        {/* Explore Subcategories */}
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Explore {CATEGORY.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SUBCATEGORIES.map((sub, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                key={sub.name}
                className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 text-center cursor-pointer group hover:border-[#2bb75c]/20 hover:shadow-lg hover:shadow-[#2bb75c]/25/10 transition-all"
              >
                <div className="w-12 h-12 bg-surface dark:bg-zinc-800 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2bb75c]/5 dark:group-hover:bg-[#2bb75c]/10 transition-colors">
                  <sub.icon className="w-6 h-6 text-zinc-400 group-hover:text-[#2bb75c] transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1 group-hover:text-[#2bb75c] dark:group-hover:text-[#2bb75c] transition-colors">{sub.name}</h3>
                <span className="text-xs font-semibold text-zinc-500">{sub.count} services</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Popular Services Grid */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Popular in {CATEGORY.name}</h2>
              <p className="text-zinc-500 text-sm mt-1">Highly rated services chosen by businesses.</p>
            </div>
            <button className="hidden sm:flex items-center gap-1 text-sm font-bold text-[#2bb75c] hover:text-[#2bb75c] transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {POPULAR_GIGS.map(gig => (
              <div key={gig.id} className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden group hover:shadow-xl hover:-tranzinc-y-1 transition-all cursor-pointer flex flex-col">
                <div className="aspect-[4/3] w-full relative bg-zinc-100 dark:bg-zinc-800">
                  <img src={gig.image} alt="Thumbnail" className="w-full h-full object-cover" />
                  <button className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full transition-colors z-10">
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">{gig.delivery}</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <img src={gig.seller.avatar} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white">{gig.seller.name}</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 leading-snug mb-3 line-clamp-2 hover:text-[#2bb75c]">
                    {gig.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mb-4">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{gig.rating}</span>
                    <span className="text-xs font-semibold text-zinc-400">({gig.reviews})</span>
                  </div>
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center mt-auto">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Starting at</span>
                    <span className="text-lg font-black text-zinc-900 dark:text-white">${gig.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="sm:hidden w-full mt-6 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm font-bold text-zinc-900 dark:text-white transition-colors">
            View All Services
          </button>
        </div>

        {/* Buying Guides / SEO text blocks */}
        <div className="bg-zinc-100 dark:bg-surface-dark rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Programming & Tech on Forte</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
            Whether you need a simple landing page, a complex SaaS application, or specialized data analysis, our community of expert programmers and technologists is ready to help. Discover top talent in web development, mobile apps, artificial intelligence, and more.
          </p>
          <div className="flex flex-wrap gap-2">
            {['React JS', 'Python', 'WordPress', 'Shopify', 'iOS Apps', 'Android', 'Machine Learning'].map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg text-xs font-bold text-zinc-500 border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:border-[#2bb75c]/20 transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

