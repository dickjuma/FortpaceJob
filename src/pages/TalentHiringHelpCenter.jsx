import React from 'react';
import { Search, BookOpen, MessageCircle, FileText, ChevronRight, HelpCircle } from 'lucide-react';

const TalentHiringHelpCenter = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-surface-dark text-white pt-20 pb-24 relative">
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6">How can we help?</h1>
          <p className="text-lg text-zinc-300 mb-10">
            Search our knowledge base or browse categories below to find answers to your hiring questions.
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -tranzinc-y-1/2 w-6 h-6 text-zinc-400" />
            <input type="text" placeholder="Search for 'escrow', 'disputes', or 'milestones'..." className="w-full bg-white text-zinc-900 px-12 py-5 rounded-2xl outline-none focus:ring-4 focus:ring-[#4C1D95]/50 text-lg shadow-xl" />
          </div>
        </div>
      </div>

      <div className="bg-surface min-h-screen py-16 -mt-10 rounded-t-[3rem] relative z-20">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="w-12 h-12 bg-[#4C1D95]/10 text-[#4C1D95] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Getting Started</h3>
              <p className="text-zinc-600 text-sm mb-4">Learn how to post jobs, invite freelancers, and set up your client account.</p>
              <div className="text-[#4C1D95] font-bold text-sm flex items-center gap-1">Browse Articles <ChevronRight className="w-4 h-4" /></div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-zinc-200 hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="w-12 h-12 bg-emerald-100 text-success rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Contracts & Payments</h3>
              <p className="text-zinc-600 text-sm mb-4">Everything you need to know about escrow, milestones, and billing methods.</p>
              <div className="text-success font-bold text-sm flex items-center gap-1">Browse Articles <ChevronRight className="w-4 h-4" /></div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-zinc-200 hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Trust & Disputes</h3>
              <p className="text-zinc-600 text-sm mb-4">Understanding the dispute process, refunds, and mediation services.</p>
              <div className="text-amber-600 font-bold text-sm flex items-center gap-1">Browse Articles <ChevronRight className="w-4 h-4" /></div>
            </div>

          </div>

          <div className="bg-surface-dark rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black text-white mb-2">Still need help?</h2>
              <p className="text-zinc-400">Our Enterprise Support team is available 24/7 to assist you.</p>
            </div>
            <button className="px-8 py-4 bg-white text-zinc-900 font-bold rounded-xl hover:bg-zinc-100 transition-colors flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> Contact Support
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default TalentHiringHelpCenter;


