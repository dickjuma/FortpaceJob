import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Clock, RefreshCw, CheckCircle2, ChevronRight, 
  Smartphone, Monitor, Eye, Pencil, Send
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

// Mock Data
const GIG = {
  title: 'I will build a responsive modern React JS web application',
  category: 'Web Development',
  rating: 5.0,
  reviews: 42,
  seller: {
    name: 'Alex Rivera',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    level: 'Top Rated Seller',
    ordersInQueue: 3
  },
  gallery: [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80'
  ],
  packages: {
    basic: { name: 'Basic UI', price: 150, delivery: '3 Days', revisions: '1 Revision', features: ['1 Page', 'Responsive Design', 'Source Code'] },
    standard: { name: 'Standard App', price: 450, delivery: '7 Days', revisions: '3 Revisions', features: ['5 Pages', 'Responsive Design', 'API Integration', 'Source Code'] },
    premium: { name: 'Full SaaS', price: 1200, delivery: '14 Days', revisions: 'Unlimited', features: ['10+ Pages', 'Responsive Design', 'Database Setup', 'API Integration', 'Source Code'] }
  },
  description: 'Hi there! I am a senior React developer with 5+ years of experience. I specialize in building fast, accessible, and beautiful web applications using modern technologies like React, Tailwind CSS, and Framer Motion.\n\nWhat you will get:\n- Clean, maintainable code\n- Fully responsive design\n- SEO optimization\n- Fast load times\n\nPlease message me before placing an order so we can discuss your specific requirements.'
};

export default function GigPreviewPage() {
  const [device, setDevice] = useState('desktop'); // desktop, mobile
  const [activeTab, setActiveTab] = useState('standard');

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-surface-dark font-sans flex flex-col">
      
      {/* Top Action Bar (Editor Chrome) */}
      <div className="sticky top-0 z-50 bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
            <button 
              onClick={() => setDevice('desktop')}
              className={cn("p-1.5 rounded-md transition-colors", device === 'desktop' ? "bg-white dark:bg-zinc-700 shadow-sm text-[#2bb75c]" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white")}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setDevice('mobile')}
              className={cn("p-1.5 rounded-md transition-colors", device === 'mobile' ? "bg-white dark:bg-zinc-700 shadow-sm text-[#2bb75c]" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white")}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm font-bold text-zinc-500 flex items-center gap-1.5">
            <Eye className="w-4 h-4" /> Preview Mode
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            <Pencil className="w-4 h-4" /> Edit Details
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-[#2bb75c] hover:bg-[#1d8d38] text-white text-sm font-bold rounded-xl shadow-sm transition-colors">
            Publish Gig <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Container Wrapper */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
        
        {/* Device Frame */}
        <motion.div 
          layout
          className={cn(
            "bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden relative",
            device === 'desktop' ? "w-full max-w-6xl rounded-2xl" : "w-full max-w-[400px] rounded-[2.5rem] border-8 border-zinc-800 dark:border-black min-h-[800px]"
          )}
        >
          {/* Scrollable content inside the device */}
          <div className="h-full overflow-y-auto scrollbar-hide">
            
            {/* Mock Header (Forte Public Nav) */}
            <div className="h-16 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between px-6 bg-white dark:bg-surface-dark sticky top-0 z-40">
              <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">ForteSpace</span>
              <div className="hidden sm:flex items-center gap-4 text-sm font-bold text-zinc-600 dark:text-zinc-300">
                <span>Explore</span>
                <span>Messages</span>
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>

            {/* Breadcrumb */}
            <div className="px-6 py-4 text-xs font-bold text-zinc-400 flex items-center gap-2">
              <span>{GIG.category}</span> <ChevronRight className="w-3 h-3" /> <span>Web Programming</span>
            </div>

            {/* Main Gig Content Area */}
            <div className={cn("p-6 flex gap-8", device === 'mobile' ? "flex-col" : "flex-row")}>
              
              {/* Left Column (Content) */}
              <div className={cn(device === 'desktop' ? "w-[65%]" : "w-full")}>
                
                <h1 className={cn("font-extrabold text-zinc-900 dark:text-white mb-4", device === 'desktop' ? "text-3xl leading-tight" : "text-2xl")}>
                  {GIG.title}
                </h1>

                {/* Seller Mini Profile */}
                <div className="flex items-center gap-3 mb-6">
                  <img src={GIG.seller.avatar} alt="Seller" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900 dark:text-white">{GIG.seller.name}</span>
                      <span className="text-xs font-bold text-[#2bb75c] bg-[#2bb75c]/5 dark:bg-[#2bb75c]/10 px-2 py-0.5 rounded-md">{GIG.seller.level}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm mt-0.5">
                      <div className="flex items-center text-amber-500 font-bold gap-1">
                        <Star className="w-4 h-4 fill-amber-500" /> {GIG.rating} <span className="text-zinc-400 font-medium">({GIG.reviews})</span>
                      </div>
                      <span className="text-zinc-300 dark:text-zinc-600">|</span>
                      <span className="text-zinc-500 font-medium">{GIG.seller.ordersInQueue} Orders in Queue</span>
                    </div>
                  </div>
                </div>

                {/* Main Gallery */}
                <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-8 border border-zinc-200 dark:border-zinc-800">
                  <img src={GIG.gallery[0]} alt="Gig Cover" className="w-full h-full object-cover" />
                </div>

                {/* About This Gig */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">About This Gig</h2>
                  <div className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {GIG.description}
                  </div>
                </div>

              </div>

              {/* Right Column (Pricing Panel) */}
              <div className={cn("shrink-0", device === 'desktop' ? "w-[35%]" : "w-full")}>
                <div className="sticky top-24 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl shadow-zinc-200/50 dark:shadow-none">
                  
                  {/* Package Tabs */}
                  <div className="flex border-b border-zinc-200 dark:border-zinc-800">
                    {['basic', 'standard', 'premium'].map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          "flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors relative",
                          activeTab === tab ? "text-[#2bb75c]" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-surface dark:bg-zinc-800/50"
                        )}
                      >
                        {tab}
                        {activeTab === tab && (
                          <motion.div layoutId="preview-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2bb75c]" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Package Content */}
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeTab}
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                      className="p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-zinc-900 dark:text-white">{GIG.packages[activeTab].name}</h3>
                        <span className="text-2xl font-black text-zinc-900 dark:text-white">${GIG.packages[activeTab].price}</span>
                      </div>
                      <p className="text-sm text-zinc-500 mb-6 font-medium">
                        {activeTab === 'basic' ? 'A simple single-page React app perfect for landing pages.' : activeTab === 'standard' ? 'A fully responsive multi-page web app with API integrations.' : 'A complete SaaS frontend solution with state management and routing.'}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-6">
                        <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-zinc-400" /> {GIG.packages[activeTab].delivery}</div>
                        <div className="flex items-center gap-1.5"><RefreshCw className="w-4 h-4 text-zinc-400" /> {GIG.packages[activeTab].revisions}</div>
                      </div>

                      <div className="space-y-3 mb-8">
                        {GIG.packages[activeTab].features.map((feat, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-success" />
                            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{feat}</span>
                          </div>
                        ))}
                      </div>

                      <button className="w-full py-3 bg-[#2bb75c] hover:bg-[#1d8d38] text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
                        Continue (${GIG.packages[activeTab].price}) <ChevronRight className="w-4 h-4" />
                      </button>
                      <button className="w-full py-3 mt-3 bg-transparent border border-zinc-200 dark:border-zinc-700 hover:bg-surface dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl transition-colors">
                        Compare Packages
                      </button>
                    </motion.div>
                  </AnimatePresence>

                </div>
              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}

