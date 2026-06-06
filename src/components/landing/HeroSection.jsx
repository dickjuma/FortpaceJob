import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Star, ShieldCheck } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-surface-dark">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80" 
          alt="Professionals working" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
              Hire Trusted Talent For <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4C1D95] to-[#7bc67e]">
                Online & Onsite Work
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-300 mb-10 leading-relaxed max-w-2xl">
              Connect with world-class freelancers and top local professionals. Vetted, ready to work, and backed by our escrow protection.
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2"
          >
            <div className="flex-1 flex items-center px-4 py-3 bg-surface rounded-xl border border-transparent hover:border-zinc-200 transition-colors">
              <Search className="w-5 h-5 text-zinc-400 mr-3" />
              <input 
                type="text" 
                placeholder="What service are you looking for?" 
                className="w-full bg-transparent border-none outline-none text-zinc-800 placeholder:text-zinc-400"
              />
            </div>
            
            <div className="hidden md:block w-px bg-zinc-200 my-2 mx-1"></div>
            
            <div className="flex-1 flex items-center px-4 py-3 bg-surface rounded-xl border border-transparent hover:border-zinc-200 transition-colors">
              <MapPin className="w-5 h-5 text-zinc-400 mr-3" />
              <input 
                type="text" 
                placeholder="Location (optional for online)" 
                className="w-full bg-transparent border-none outline-none text-zinc-800 placeholder:text-zinc-400"
              />
            </div>
            
            <button className="bg-[#4C1D95] hover:bg-[#22C55E] text-white px-8 py-4 rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20 whitespace-nowrap">
              Search Talent
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-4 text-sm text-zinc-400"
          >
            <span className="font-medium text-zinc-300">Popular:</span>
            {['Web Development', 'Mobile Apps', 'Electricians', 'UI/UX Design', 'Plumbing'].map((term) => (
              <span key={term} className="px-3 py-1 rounded-full border border-zinc-700 hover:border-zinc-500 hover:text-zinc-200 cursor-pointer transition-colors">
                {term}
              </span>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 flex items-center gap-8 border-t border-zinc-800 pt-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="text-white font-medium">Escrow Protection</div>
                <div className="text-zinc-400 text-xs">Payment is secure</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-[#4C1D95]" />
              </div>
              <div>
                <div className="text-white font-medium">Vetted Talent</div>
                <div className="text-zinc-400 text-xs">Top 3% of applicants</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


