// src/components/findWork/performance/SkillLevels.jsx
import React from "react";
import { ChevronRight, Check, Lock, Star, DollarSign, Briefcase, Clock } from "lucide-react";

const LevelStep = ({ level, index, currentLevelIndex }) => {
  const isCompleted = index < currentLevelIndex;
  const isCurrent = index === currentLevelIndex;
  const isLocked = index > currentLevelIndex;

  return (
    <div className="relative flex flex-col items-center flex-1">
      {/* Connector Line */}
      {index !== 0 && (
        <div
          className={`absolute right-1/2 left-[-50%] top-6 h-1 -translate-y-1/2 transition-all duration-700 ${
            isCompleted || isCurrent ? 'bg-[#B7E2BF]' : 'bg-gray-100'
          }`}
        />
      )}

      {/* Circle Indicator */}
      <div
        className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-500 transform ${
          isCompleted
            ? 'bg-[#B7E2BF] border-[#B7E2BF] text-[#4A312F]'
            : isCurrent
            ? 'bg-white border-[#D34079] text-[#D34079] shadow-xl scale-125'
            : 'bg-white border-gray-100 text-gray-300'
        }`}
      >
        {isCompleted ? <Check size={20} strokeWidth={4} /> : isLocked ? <Lock size={16} /> : <span className="font-black italic">!</span>}
      </div>

      <div className="mt-4 text-center">
        <p className={`text-[10px] font-black uppercase tracking-tighter transition-colors ${
          isCurrent ? 'text-[#D34079]' : 'text-[#4A312F]/50'
        }`}>
          {level}
        </p>
      </div>
    </div>
  );
};

// Small requirement tracker component
const Requirement = ({ icon: Icon, label, current, target, unit = "" }) => {
  const progress = Math.min((current / target) * 100, 100);
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-50 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 bg-[#F7F9FB] rounded-lg text-[#4A312F]">
          <Icon size={16} />
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${progress === 100 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
          {progress === 100 ? 'DONE' : `${Math.round(progress)}%`}
        </span>
      </div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-lg font-black text-[#4A312F] mt-1">
        {unit}{current} <span className="text-gray-300 font-medium text-xs">/ {unit}{target}</span>
      </p>
      <div className="w-full h-1 bg-gray-50 rounded-full mt-3 overflow-hidden">
        <div className="h-full bg-[#B7E2BF] transition-all duration-1000" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default function SkillLevels() {
  const levels = ["New Seller", "Level 1", "Level 2", "Top Rated"];
  const currentLevelIndex = 1; 

  // Mock data that would eventually come from your Invoice/Client system
  const stats = {
    orders: 8,
    earnings: 320,
    rating: 4.8,
    daysActive: 45
  };

  const nextLevelRequirements = [
    { icon: Briefcase, label: "Orders", current: stats.orders, target: 10 },
    { icon: DollarSign, label: "Earnings", current: stats.earnings, target: 400, unit: "$" },
    { icon: Star, label: "Rating", current: stats.rating, target: 4.7 },
    { icon: Clock, label: "Days Active", current: stats.daysActive, target: 60 },
  ];

  return (
    <div className="bg-[#F7F9FB] border border-gray-100 p-8 rounded-[2.5rem] shadow-sm space-y-10">
      
      {/* 1. Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black text-[#4A312F] tracking-tight">Level Overview</h2>
          <p className="text-sm text-gray-500 font-medium">You are currently a <span className="text-[#D34079] font-bold">{levels[currentLevelIndex]}</span></p>
        </div>
        <div className="bg-[#4A312F] text-white px-6 py-3 rounded-2xl flex items-center gap-4 shadow-lg shadow-[#4A312F]/20">
            <div className="text-right">
                <p className="text-[10px] font-bold text-[#B7E2BF] uppercase tracking-widest">Next Review</p>
                <p className="text-sm font-bold">Jan 15, 2026</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <ChevronRight size={20} className="text-[#B7E2BF]" />
        </div>
      </div>

      {/* 2. Visual Roadmap */}
      <div className="flex justify-between items-start max-w-2xl mx-auto py-4">
        {levels.map((level, index) => (
          <LevelStep
            key={index}
            level={level}
            index={index}
            currentLevelIndex={currentLevelIndex}
          />
        ))}
      </div>

      {/* 3. The "Next Milestone" Checklist */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-[#4A312F] uppercase tracking-widest">Requirements for {levels[currentLevelIndex + 1]}</h3>
            <div className="h-px flex-1 bg-gray-200/50" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nextLevelRequirements.map((req, i) => (
            <Requirement key={i} {...req} />
          ))}
        </div>
      </div>

      {/* 4. Level Perks Info */}
      <div className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm flex flex-col lg:flex-row gap-8 items-center">
        <div className="flex-1 space-y-4">
            <h3 className="text-xl font-black text-[#4A312F]">Level {currentLevelIndex} Perks</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
                As a Level {currentLevelIndex} seller, you've unlocked specialized features to help manage your growing list of clients and invoices.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3">
                {["Create 10 Gigs", "Custom Offers ($5k)", "24/7 Support", "Promoted Gigs"].map((perk, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-[#4A312F]/70">
                        <Check size={14} className="text-[#B7E2BF]" /> {perk}
                    </div>
                ))}
            </div>
        </div>
        <div className="w-full lg:w-48 aspect-square bg-[#B7E2BF]/10 rounded-3xl flex items-center justify-center">
            <Star size={64} className="text-[#B7E2BF] fill-[#B7E2BF]/20 animate-pulse" />
        </div>
      </div>

    </div>
  );
}