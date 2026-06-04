import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, ShieldCheck, Star, ChevronRight, 
  ArrowRight, Award, Zap
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

// Mock Data
const FEATURED_GIGS = [
  {
    id: 1,
    title: 'Enterprise SaaS Application Architecture',
    seller: { name: 'David Chen', title: 'Ex-Google Engineer', avatar: 'https://i.pravatar.cc/150?u=david' },
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    tags: ['React', 'Node.js', 'AWS'],
    rating: 5.0,
    price: 3500
  },
  {
    id: 2,
    title: 'Award-Winning Brand Identity Design',
    seller: { name: 'Elena R.', title: 'Creative Director', avatar: 'https://i.pravatar.cc/150?u=elena' },
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=1200&q=80',
    tags: ['Branding', 'UI/UX', 'Strategy'],
    rating: 4.9,
    price: 2800
  },
  {
    id: 3,
    title: 'High-Converting B2B Copywriting',
    seller: { name: 'Marcus L.', title: 'B2B Tech Writer', avatar: 'https://i.pravatar.cc/150?u=marcus' },
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?w=1200&q=80',
    tags: ['SEO', 'Sales Copy', 'Tech'],
    rating: 5.0,
    price: 1200
  }
];

export default function FeaturedGigShowcasePage() {
  return (
    <div className="min-h-screen bg-black font-sans text-white overflow-hidden selection:bg-white/30">
      
      {/* Top Navbar Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight">Forte<span className="text-[#2bb75c]">PRO</span></span>
        </div>
        <button className="px-5 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-zinc-200 transition-colors">
          Apply as Pro
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 flex flex-col items-center justify-center text-center min-h-[70vh]">
        
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -tranzinc-x-1/2 -tranzinc-y-1/2 w-[600px] h-[600px] bg-[#2bb75c]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -tranzinc-x-1/2 -tranzinc-y-1/2 w-[800px] h-[400px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 relative z-10"
        >
          <Sparkles className="w-4 h-4 text-[#2bb75c]" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">Editor's Picks</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-5xl sm:text-7xl font-black tracking-tighter mb-6 relative z-10 max-w-4xl leading-[1.1]"
        >
          World-class talent.<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2bb75c] via-violet-400 to-sky-400">
            Unrivaled quality.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-zinc-400 max-w-2xl font-medium mb-10 relative z-10"
        >
          Discover hand-picked professionals vetted for expertise, communication, and flawless delivery. The top 1% of the Forte marketplace.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex items-center gap-6 text-sm font-bold text-zinc-300 relative z-10"
        >
          <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-success" /> Vetted Experts</div>
          <div className="flex items-center gap-2"><Award className="w-5 h-5 text-amber-400" /> Guaranteed Quality</div>
        </motion.div>
      </div>

      {/* Main Showcase Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_GIGS.map((gig, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
              key={gig.id} 
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden relative mb-6 border border-white/10 bg-surface-dark group-hover:border-white/30 transition-colors duration-500">
                <img src={gig.image} alt={gig.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                
                {/* Pro Badge */}
                <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                  <Zap className="w-3.5 h-3.5 text-[#2bb75c] fill-brand-400" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-white">Pro Verified</span>
                </div>

                {/* Seller Info (Bottom Overlay) */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={gig.seller.avatar} alt={gig.seller.name} className="w-12 h-12 rounded-full border-2 border-black object-cover" />
                    <div>
                      <h4 className="text-white font-bold">{gig.seller.name}</h4>
                      <p className="text-xs text-[#2bb75c] font-bold">{gig.seller.title}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {gig.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/5 text-[10px] font-bold text-zinc-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title & Price */}
              <div className="px-2">
                <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-[#2bb75c] transition-colors">
                  {gig.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-400" /> {gig.rating.toFixed(1)}
                  </div>
                  <div className="text-zinc-400 text-sm font-semibold">
                    Starting at <span className="text-white text-lg font-black ml-1">${gig.price}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-20 flex justify-center">
          <button className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105">
            <span className="relative z-10 flex items-center gap-2">Explore All Pro Services <ArrowRight className="w-4 h-4 group-hover:tranzinc-x-1 transition-transform" /></span>
          </button>
        </div>

      </div>

      {/* Value Props */}
      <div className="border-t border-white/10 bg-white/5 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Vetted for Excellence</h3>
              <p className="text-sm text-zinc-400 font-medium">Only 1% of applicants pass our rigorous quality and communication assessments.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Dedicated Support</h3>
              <p className="text-sm text-zinc-400 font-medium">Pro orders include VIP support with faster response times and dispute resolution.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Flawless Delivery</h3>
              <p className="text-sm text-zinc-400 font-medium">Expect premium deliverables, proactive communication, and zero friction.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

