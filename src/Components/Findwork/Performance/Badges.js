// src/components/findWork/performance/Badges.jsx
import React, { useState } from "react";
import { Award, CheckCircle2, Star, ShieldCheck, Zap, Info, Lock } from "lucide-react";

const BadgeCard = ({ badge, isActive, onClick, isSelected }) => {
  const { icon: Icon, name, description, color, progress } = badge;
  
  return (
    <div
      onClick={() => onClick(badge)}
      className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer group ${
        isActive
          ? 'bg-white border-[#4A312F]/20 shadow-sm'
          : 'bg-[#F7F9FB]/50 border-transparent grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
      } ${isSelected ? 'ring-2 ring-[#D34079] ring-offset-2' : ''}`}
    >
      {/* Status Icon */}
      <div className="absolute top-3 right-3">
        {isActive ? (
          <CheckCircle2 size={16} className="text-green-500" />
        ) : (
          <Lock size={14} className="text-gray-400" />
        )}
      </div>

      <div className="flex flex-col items-center text-center space-y-3">
        {/* Icon Circle */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
          style={{
            backgroundColor: `${color}15`,
            color: color,
          }}
        >
          <Icon size={30} />
        </div>

        <div>
          <h4 className="font-bold text-[#4A312F] text-[13px]">{name}</h4>
          <p className="text-[10px] text-gray-500 font-medium leading-tight mt-1">{description}</p>
        </div>

        {/* Mini Progress Bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              backgroundColor: isActive ? "#B7E2BF" : color,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default function Badges() {
  const [filter, setFilter] = useState("all");
  const [selectedBadge, setSelectedBadge] = useState(null);

  const badgeData = [
    { id: 1, name: "New Seller", description: "Starting your journey", icon: Zap, color: "#4A312F", isActive: true, progress: 100, req: "Automatic" },
    { id: 2, name: "Rising Talent", description: "High quality work", icon: Star, color: "#D34079", isActive: true, progress: 100, req: "Hand-picked by editors" },
    { id: 3, name: "Level 1 Seller", description: "10+ Orders Completed", icon: Award, color: "#457B9D", isActive: false, progress: 70, req: "$400 Earned, 10 Orders, 4.7+ Rating" },
    { id: 4, name: "Pro Verified", description: "Vetted excellence", icon: ShieldCheck, color: "#3B82F6", isActive: false, progress: 30, req: "Professional Application Required" },
    { id: 5, name: "Top Rated", description: "Elite status", icon: Star, color: "#FBB9C2", isActive: false, progress: 10, req: "$20,000 Earned, 100+ Orders" },
  ];

  const filteredBadges = badgeData.filter(b => {
    if (filter === "active") return b.isActive;
    if (filter === "upcoming") return !b.isActive;
    return true;
  });

  return (
    <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B7E2BF]/20 text-[#4A312F] text-[10px] font-bold uppercase tracking-widest">
            <Award size={12} /> Milestone Tracking
          </div>
          <h2 className="text-3xl font-black text-[#4A312F]">Trophy Case</h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-[#F7F9FB] p-1 rounded-xl border border-gray-100">
          {["all", "active", "upcoming"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all ${
                filter === f ? "bg-white text-[#D34079] shadow-sm" : "text-gray-400 hover:text-[#4A312F]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredBadges.map((badge) => (
          <BadgeCard 
            key={badge.id} 
            badge={badge} 
            isActive={badge.isActive} 
            isSelected={selectedBadge?.id === badge.id}
            onClick={setSelectedBadge}
          />
        ))}
      </div>

      {/* Dynamic Requirement Detail Box */}
      <div className={`transition-all duration-300 overflow-hidden ${selectedBadge ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-[#4A312F] text-white p-6 rounded-2xl flex justify-between items-center shadow-lg shadow-[#4A312F]/20">
          <div>
            <p className="text-[10px] font-bold text-[#B7E2BF] uppercase tracking-widest mb-1">Requirements for {selectedBadge?.name}</p>
            <p className="text-sm font-medium">{selectedBadge?.req}</p>
          </div>
          <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold transition">
            View Full Criteria
          </button>
        </div>
      </div>

      {!selectedBadge && (
        <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center gap-4 animate-in slide-in-from-bottom-2">
          <Info size={20} className="text-blue-500" />
          <p className="text-xs text-blue-700 font-medium">
            Click on a badge to view the specific requirements and your current progress.
          </p>
        </div>
      )}
    </div>
  );
}