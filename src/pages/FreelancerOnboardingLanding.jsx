import React from 'react';
import { Rocket, Target, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FreelancerOnboardingLanding = () => {
  return (
    <>
      <div className="min-h-screen bg-surface-dark text-white flex flex-col justify-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&w=2000&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-transparent"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-5xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#14a800]/20 text-[#14a800] font-bold tracking-wide text-sm mb-8 border border-[#14a800]/20/30">
              <Rocket className="w-4 h-4 fill-current" /> JOIN FORTSPACE
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Work on your terms. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Earn what you deserve.</span>
            </h1>
            
            <p className="text-xl text-zinc-300 mb-10 leading-relaxed">
              Join the world's most premium talent network. Connect with enterprise clients, build your portfolio, and scale your freelance business globally.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button className="px-8 py-4 bg-[#14a800] hover:bg-[#118a00] text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 text-lg">
                Create Free Profile <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors border border-white/20 text-lg">
                View Enterprise Requirements
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-10">
              <div>
                <Target className="w-8 h-8 text-success mb-4" />
                <h3 className="font-bold text-lg mb-2">High-Quality Clients</h3>
                <p className="text-zinc-400 text-sm">Work with vetted startups and Fortune 500 companies.</p>
              </div>
              <div>
                <DollarSign className="w-8 h-8 text-success mb-4" />
                <h3 className="font-bold text-lg mb-2">Escrow Protection</h3>
                <p className="text-zinc-400 text-sm">Never chase an invoice again. Funds are secured before you work.</p>
              </div>
              <div>
                <Rocket className="w-8 h-8 text-success mb-4" />
                <h3 className="font-bold text-lg mb-2">Grow Your Agency</h3>
                <p className="text-zinc-400 text-sm">Start solo and scale into a full-fledged agency natively.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FreelancerOnboardingLanding;
