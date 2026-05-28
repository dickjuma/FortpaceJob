import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Clock, RefreshCw, CheckCircle2, ChevronDown, 
  ChevronRight, Heart, Share2, ShieldCheck, Play
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const FAQ = [
  { q: "What do you need to get started?", a: "I need your brand guidelines, project requirements, and any wireframes or inspiration you have." },
  { q: "Do you provide source code?", a: "Yes, the Premium package includes the full source code via a GitHub repository." },
  { q: "Can you do a rush delivery?", a: "Yes, select the 'Extra Fast Delivery' add-on at checkout for 48-hour turnaround." }
];

export default function PublicGigPage() {
  const [activePackage, setActivePackage] = useState('Standard');
  const [openFaq, setOpenFaq] = useState(null);

  const packages = {
    Basic: { price: 350, desc: '1 Landing Page + 3 sections. React & Tailwind. No backend.', days: 3, revisions: 1, features: ['Responsive Design', 'Source File', '1 Page'] },
    Standard: { price: 800, desc: '5 Pages App + State Management. Perfect for MVPs.', days: 7, revisions: 3, features: ['Responsive Design', 'Source File', 'State Management', '5 Pages', 'API Integration'] },
    Premium: { price: 1500, desc: 'Full-stack Next.js app with DB, Auth, and Payment integration.', days: 14, revisions: 'Unlimited', features: ['Responsive Design', 'Source File', 'State Management', 'Up to 10 Pages', 'API Integration', 'Database Setup', 'Authentication'] },
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Breadcrumbs */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
          <button type="button" className="hover:text-brand-600">Home</button> <ChevronRight className="w-3 h-3" />
          <button type="button" className="hover:text-brand-600">Programming & Tech</button> <ChevronRight className="w-3 h-3" />
          <button type="button" className="hover:text-brand-600">Web Development</button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-12">
        
        {/* Left Column: Gig Details */}
        <div className="flex-1 min-w-0">
          
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white leading-tight mb-6">
            I will build a scalable React and Next.js web application
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <img src="https://i.pravatar.cc/150?u=a1" alt="Alex Rivera" className="w-8 h-8 rounded-full" />
              <span className="font-bold text-zinc-900 dark:text-white text-sm hover:underline cursor-pointer">Alex Rivera</span>
              <span className="text-amber-500 text-sm font-bold flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Top Rated Plus</span>
            </div>
            <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 hidden sm:block"></div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-bold text-zinc-900 dark:text-white text-sm">4.9</span>
              <span className="text-zinc-500 text-sm font-medium">(124 reviews)</span>
            </div>
            <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 hidden sm:block"></div>
            <span className="text-zinc-500 text-sm font-medium">12 Orders in Queue</span>
          </div>

          {/* Media Gallery */}
          <div className="mb-12">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-surface-dark mb-4 group cursor-pointer border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80" alt="Gig Main" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-white ml-1" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-video rounded-xl overflow-hidden cursor-pointer border border-zinc-200 dark:border-zinc-800 hover:border-brand-500 transition-colors">
                  <img src={`https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&q=80&random=${i}`} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* About This Gig */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">About This Gig</h2>
            <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              <p>Welcome to my premium React & Next.js development service. I specialize in building highly performant, accessible, and scalable web applications that drive real business value.</p>
              <p><strong>What you will get:</strong></p>
              <ul>
                <li>Pixel-perfect Figma to React conversion</li>
                <li>Responsive design (Mobile, Tablet, Desktop)</li>
                <li>Server-Side Rendering (SSR) & Static Site Generation (SSG) with Next.js</li>
                <li>State management (Zustand, Redux, or Context API)</li>
                <li>API integration (REST or GraphQL)</li>
                <li>SEO optimized code</li>
              </ul>
              <p>Please contact me before placing an order so we can discuss your requirements in detail to ensure we are aligned on the scope and timeline.</p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQ.map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-6 py-4 flex justify-between items-center text-left font-bold text-zinc-900 dark:text-white hover:bg-surface dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    {item.q}
                    <ChevronDown className={cn("w-5 h-5 text-zinc-400 transition-transform", openFaq === idx ? "rotate-180" : "")} />
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-4 text-zinc-600 dark:text-zinc-400 font-medium"
                      >
                        {item.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Mini Profile */}
          <div className="mb-12 bg-surface-dark dark:bg-surface-dark text-white rounded-3xl p-8 border border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl"></div>
            
            <h2 className="text-xl font-bold mb-6">About The Seller</h2>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
              <img src="https://i.pravatar.cc/150?u=a1" alt="Alex Rivera" className="w-24 h-24 rounded-full border-2 border-zinc-700 object-cover shrink-0" />
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-lg font-bold">Alex Rivera</h3>
                <p className="text-sm font-medium text-zinc-400 mb-2">Senior Frontend Engineer</p>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 text-xs font-bold mb-4">
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9 (124)</span>
                  <span className="px-2 py-0.5 bg-zinc-800 rounded">English (Fluent)</span>
                  <span className="px-2 py-0.5 bg-zinc-800 rounded">Spanish (Native)</span>
                </div>
                <button className="px-6 py-2 border border-zinc-700 hover:bg-zinc-800 rounded-xl font-bold transition-colors text-sm">Contact Me</button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Pricing Card */}
        <div className="w-full lg:w-[400px] shrink-0 relative">
          <div className="sticky top-28 bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-1 shadow-xl">
            
            {/* Package Tabs */}
            <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-1 mb-6">
              {['Basic', 'Standard', 'Premium'].map(pkg => (
                <button 
                  key={pkg}
                  onClick={() => setActivePackage(pkg)}
                  className={cn(
                    "flex-1 py-3 text-sm font-bold rounded-xl transition-all",
                    activePackage === pkg ? "bg-white dark:bg-surface-dark text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  )}
                >
                  {pkg}
                </button>
              ))}
            </div>

            <div className="px-5 pb-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{activePackage}</h3>
                <span className="text-2xl font-black text-zinc-900 dark:text-white">${packages[activePackage].price}</span>
              </div>
              
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-6 h-12 line-clamp-2">
                {packages[activePackage].desc}
              </p>

              <div className="flex items-center gap-6 text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-zinc-400" /> {packages[activePackage].days} Days Delivery</span>
                <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 text-zinc-400" /> {packages[activePackage].revisions} Revisions</span>
              </div>

              <ul className="space-y-3 mb-8">
                {packages[activePackage].features.map(feat => (
                  <li key={feat} className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0" /> {feat}
                  </li>
                ))}
              </ul>

              <button className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-2 mb-3">
                Continue (${packages[activePackage].price}) <ChevronRight className="w-5 h-5" />
              </button>
              <button className="w-full py-3 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-surface dark:hover:bg-zinc-800 transition-colors">
                Compare Packages
              </button>
            </div>

            <div className="p-4 bg-surface dark:bg-zinc-800/50 rounded-b-[1.4rem] border-t border-zinc-100 dark:border-zinc-800 text-center flex items-center justify-center gap-4">
              <button className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2 transition-colors"><Heart className="w-4 h-4" /> Save</button>
              <button className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2 transition-colors"><Share2 className="w-4 h-4" /> Share</button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
