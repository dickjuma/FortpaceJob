// src/components/findWork/performance/Promotion.jsx
import React, { useState } from "react";
import { Megaphone, Target, BarChart3, Rocket, Zap, ChevronRight, DollarSign } from "lucide-react";

const Benefit = ({ icon: Icon, title, desc }) => (
  <div className="flex gap-4 p-5 rounded-2xl bg-white/60 border border-white hover:border-[#B7E2BF] hover:bg-white hover:shadow-xl hover:shadow-[#B7E2BF]/10 transition-all duration-300 group">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B7E2BF]/20 to-[#B7E2BF]/5 flex items-center justify-center text-[#4A312F] shrink-0 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <div>
      <h4 className="font-bold text-[#4A312F] text-sm">{title}</h4>
      <p className="text-[11px] text-[#4A312F]/60 leading-relaxed mt-1">{desc}</p>
    </div>
  </div>
);

export default function Promotion() {
  const [dailyBudget, setDailyBudget] = useState(5);

  return (
    <div className="bg-[#F7F9FB] rounded-[2.5rem] overflow-hidden border border-[#4A312F]/5 shadow-2xl shadow-[#4A312F]/5">
      {/* 1. Hero / Main CTA Section */}
      <div className="p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 bg-white">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D34079]/10 text-[#D34079] text-[10px] font-black uppercase tracking-[0.2em]">
            <Zap size={14} fill="currentColor" />
            Seller Accelerator
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-black text-[#4A312F] leading-[1.1] tracking-tight">
            Skyrocket your <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D34079] to-[#FBB9C2]">
              Sales Visibility.
            </span>
          </h2>
          
          <p className="text-[#4A312F]/70 text-lg leading-relaxed max-w-xl">
            Join the elite 5% of sellers using Promoted Gigs to secure top-tier placements and 3x their monthly invoice volume.
          </p>
          
          {/* Quick Budget Preview */}
          <div className="bg-[#F7F9FB] p-6 rounded-2xl border border-gray-100 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-[#4A312F]/60 uppercase">Estimated Daily Clicks</span>
              <span className="text-sm font-black text-[#D34079]">{dailyBudget * 4} - {dailyBudget * 12}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={dailyBudget}
              onChange={(e) => setDailyBudget(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D34079]"
            />
            <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
              <span>$1/day</span>
              <span>Daily Budget: ${dailyBudget}</span>
              <span>$50/day</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button className="bg-[#4A312F] hover:bg-black text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-[#4A312F]/20 transition-all flex items-center gap-3 active:scale-95">
              Launch Campaign <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* 2. Interactive Card Preview */}
        <div className="hidden lg:block relative flex-1">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#B7E2BF]/20 blur-[100px] rounded-full"></div>
          
          {/* Mock Promoted Gig Card */}
          <div className="relative bg-white p-6 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(74,49,47,0.15)] border border-gray-100 w-72 mx-auto rotate-2 hover:rotate-0 transition-all duration-700">
            <div className="absolute top-4 right-4 bg-[#D34079] text-white text-[8px] font-black px-2 py-1 rounded-md tracking-widest shadow-lg">
              PROMOTED
            </div>
            <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-4 overflow-hidden flex items-center justify-center">
               <Rocket size={40} className="text-gray-200" />
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded-full w-full"></div>
              <div className="h-3 bg-gray-100 rounded-full w-2/3"></div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#FBB9C2]"></div>
                  <div className="w-12 h-3 bg-gray-50 rounded-full"></div>
                </div>
                <div className="h-6 w-12 bg-[#B7E2BF]/20 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Floating Metric Badge */}
          <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 animate-bounce transition-all duration-[3000ms]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 text-green-500 rounded-lg">
                <BarChart3 size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">CTR Increase</p>
                <p className="text-lg font-black text-[#4A312F]">+240%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Benefits Grid */}
      <div className="p-10 bg-gradient-to-t from-[#F7F9FB] to-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Benefit 
            icon={Target} 
            title="Surgical Precision" 
            desc="Our AI shows your Gig to buyers whose search intent matches your history of high-value invoices."
          />
          <Benefit 
            icon={Megaphone} 
            title="Premium Placement" 
            desc="Secure the top 4 slots in Search and Category pages where 80% of all platform orders happen."
          />
          <Benefit 
            icon={DollarSign} 
            title="Zero Risk Spending" 
            desc="Only pay when a buyer clicks your ad. We optimize your spend to ensure maximum ROI on every cent."
          />
        </div>
      </div>
    </div>
  );
}