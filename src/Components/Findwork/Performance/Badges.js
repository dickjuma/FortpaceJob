import React, { useState, useEffect } from "react";
import { 
  Award, Star, ShieldCheck, Zap, Trophy, 
  Lock, CheckCircle, TrendingUp, Target,
  ChevronRight, Info, Crown, Sparkles
} from "lucide-react";

// Mock API call - replace with your actual backend endpoint
const fetchBadgesData = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    userStats: {
      totalEarnings: 2840,
      completedOrders: 24,
      rating: 4.8,
      responseRate: 98,
      onTimeDelivery: 100,
      accountAge: 3 // months
    },
    badges: [
      {
        id: 1,
        name: "New Seller",
        description: "Welcome to the platform!",
        icon: "Sparkles",
        color: "#4A312F",
        isActive: true,
        earnedDate: "2024-10-15",
        progress: 100,
        requirements: {
          description: "Automatically awarded to all new sellers",
          criteria: [
            { label: "Create account", completed: true },
            { label: "Complete profile", completed: true },
            { label: "Publish first gig", completed: true }
          ]
        }
      },
      {
        id: 2,
        name: "Rising Talent",
        description: "Hand-picked for quality",
        icon: "TrendingUp",
        color: "#B7E2BF",
        isActive: true,
        earnedDate: "2024-11-20",
        progress: 100,
        requirements: {
          description: "Selected by editorial team based on performance",
          criteria: [
            { label: "High-quality deliveries", completed: true },
            { label: "Positive buyer feedback", completed: true },
            { label: "Professional communication", completed: true }
          ]
        }
      },
      {
        id: 3,
        name: "Level 1 Seller",
        description: "Proven track record",
        icon: "Award",
        color: "#D34079",
        isActive: false,
        earnedDate: null,
        progress: 68,
        requirements: {
          description: "Complete 10 orders with excellent performance",
          criteria: [
            { label: "Complete 10+ orders", completed: false, current: 7, target: 10 },
            { label: "Earn $400+", completed: false, current: 284, target: 400 },
            { label: "60 days as active seller", completed: true },
            { label: "Maintain 4.7+ rating", completed: true, current: 4.8 },
            { label: "90%+ response rate", completed: true, current: 98 },
            { label: "90%+ on-time delivery", completed: true, current: 100 }
          ]
        }
      },
      {
        id: 4,
        name: "Level 2 Seller",
        description: "Advanced professional",
        icon: "Star",
        color: "#457B9D",
        isActive: false,
        earnedDate: null,
        progress: 24,
        requirements: {
          description: "Maintain excellence over extended period",
          criteria: [
            { label: "Complete 50+ orders", completed: false, current: 24, target: 50 },
            { label: "Earn $2,000+", completed: false, current: 2840, target: 2000 },
            { label: "120 days as active seller", completed: false, current: 90, target: 120 },
            { label: "Maintain 4.7+ rating", completed: true, current: 4.8 },
            { label: "90%+ response rate", completed: true, current: 98 },
            { label: "90%+ on-time delivery", completed: true, current: 100 }
          ]
        }
      },
      {
        id: 5,
        name: "Top Rated Seller",
        description: "Elite performance",
        icon: "Crown",
        color: "#F1C40F",
        isActive: false,
        earnedDate: null,
        progress: 8,
        requirements: {
          description: "Join the top tier of sellers",
          criteria: [
            { label: "Complete 100+ orders", completed: false, current: 24, target: 100 },
            { label: "Earn $20,000+", completed: false, current: 2840, target: 20000 },
            { label: "180 days as active seller", completed: false, current: 90, target: 180 },
            { label: "Maintain 4.8+ rating", completed: true, current: 4.8 },
            { label: "95%+ response rate", completed: true, current: 98 },
            { label: "95%+ on-time delivery", completed: true, current: 100 }
          ]
        }
      },
      {
        id: 6,
        name: "Pro Verified",
        description: "Vetted excellence",
        icon: "ShieldCheck",
        color: "#6366F1",
        isActive: false,
        earnedDate: null,
        progress: 0,
        requirements: {
          description: "Apply for Pro verification after meeting minimum criteria",
          criteria: [
            { label: "Complete Level 2 requirements", completed: false },
            { label: "Submit portfolio", completed: false },
            { label: "Pass identity verification", completed: false },
            { label: "Pass interview process", completed: false },
            { label: "Meet industry standards", completed: false }
          ]
        }
      }
    ]
  };
};

// Icon mapping
const iconMap = {
  Sparkles,
  TrendingUp,
  Award,
  Star,
  Crown,
  ShieldCheck
};

// Badge Card Component
function BadgeCard({ badge, isSelected, onClick }) {
  const Icon = iconMap[badge.icon] || Award;
  
  return (
    <button
      onClick={() => onClick(badge)}
      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left w-full ${
        badge.isActive
          ? 'bg-white border-gray-200 shadow-lg hover:shadow-xl hover:border-[#B7E2BF]'
          : 'bg-[#F7F9FB] border-gray-200 hover:border-gray-300 hover:shadow-md'
      } ${isSelected ? 'ring-2 ring-[#D34079] ring-offset-2 scale-[1.02]' : ''}`}
    >
      {/* Status Badge */}
      <div className="absolute top-3 right-3">
        {badge.isActive ? (
          <div className="flex items-center gap-1 px-2 py-1 bg-[#B7E2BF] text-[#4A312F] rounded-full">
            <CheckCircle size={12} />
            <span className="text-xs font-black uppercase tracking-wider">Earned</span>
          </div>
        ) : (
          <div className="p-1.5 bg-gray-100 rounded-full">
            <Lock size={14} className="text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center text-center space-y-4">
        {/* Icon */}
        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
            badge.isActive ? 'scale-100' : 'opacity-60 scale-95 grayscale'
          }`}
          style={{
            backgroundColor: badge.isActive ? badge.color : '#E5E7EB',
            color: badge.isActive ? 'white' : '#9CA3AF'
          }}
        >
          <Icon size={36} strokeWidth={badge.isActive ? 2.5 : 2} />
        </div>

        {/* Badge Info */}
        <div className="space-y-1">
          <h3 className={`font-black text-base uppercase tracking-tight ${badge.isActive ? 'text-[#4A312F]' : 'text-gray-500'}`}>
            {badge.name}
          </h3>
          <p className="text-xs text-gray-500 font-bold">
            {badge.description}
          </p>
        </div>

        {/* Progress Bar */}
        {!badge.isActive && (
          <div className="w-full space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-black uppercase tracking-widest">Progress</span>
              <span className="font-black text-[#4A312F]">{badge.progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ 
                  width: `${badge.progress}%`,
                  backgroundColor: badge.color
                }}
              />
            </div>
          </div>
        )}

        {/* Earned Date */}
        {badge.isActive && badge.earnedDate && (
          <p className="text-xs text-gray-400 font-black uppercase tracking-widest">
            Earned {new Date(badge.earnedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
        )}
      </div>
    </button>
  );
}

// Requirements Detail Panel
function RequirementsPanel({ badge }) {
  if (!badge) return null;

  const completedCount = badge.requirements.criteria.filter(c => c.completed).length;
  const totalCount = badge.requirements.criteria.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white rounded-[2rem] border-2 border-gray-100 p-8 shadow-xl animate-in slide-in-from-right duration-300">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: badge.color, color: 'white' }}
          >
            {React.createElement(iconMap[badge.icon] || Award, { size: 28 })}
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#4A312F] uppercase tracking-tight mb-1">{badge.name}</h3>
            <p className="text-sm text-gray-600 font-bold">{badge.requirements.description}</p>
          </div>
        </div>
        
        {badge.isActive && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#B7E2BF] text-[#4A312F] rounded-full shadow-sm">
            <Trophy size={16} />
            <span className="text-sm font-black uppercase tracking-wider">Unlocked</span>
          </div>
        )}
      </div>

      {/* Progress Overview */}
      {!badge.isActive && (
        <div className="mb-6 p-5 bg-gradient-to-br from-[#B7E2BF]/20 to-[#B7E2BF]/10 rounded-2xl border-2 border-[#B7E2BF]/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-black text-[#4A312F] uppercase tracking-widest">Overall Progress</span>
            <span className="text-sm font-black" style={{ color: badge.color }}>{completedCount}/{totalCount} completed</span>
          </div>
          <div className="w-full h-3 bg-white rounded-full overflow-hidden border-2 border-[#B7E2BF]/20">
            <div
              className="h-full transition-all duration-700"
              style={{ 
                width: `${completionPercentage}%`,
                backgroundColor: badge.color
              }}
            />
          </div>
        </div>
      )}

      {/* Requirements List */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Requirements</h4>
        {badge.requirements.criteria.map((criterion, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 p-5 rounded-2xl border-2 transition-all ${
              criterion.completed
                ? 'bg-[#B7E2BF]/10 border-[#B7E2BF]/30'
                : 'bg-[#F7F9FB] border-gray-200'
            }`}
          >
            <div className={`mt-0.5 flex-shrink-0 ${criterion.completed ? 'text-[#4A312F]' : 'text-gray-400'}`}>
              {criterion.completed ? (
                <CheckCircle size={20} fill="currentColor" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-current" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-black uppercase tracking-tight ${criterion.completed ? 'text-[#4A312F]' : 'text-gray-700'}`}>
                {criterion.label}
              </p>
              
              {criterion.current !== undefined && criterion.target !== undefined && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-black uppercase tracking-widest">
                      {criterion.current.toLocaleString()} / {criterion.target.toLocaleString()}
                    </span>
                    <span className="font-black text-[#4A312F]">
                      {Math.round((criterion.current / criterion.target) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-gray-200">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${Math.min((criterion.current / criterion.target) * 100, 100)}%`,
                        backgroundColor: criterion.completed ? '#B7E2BF' : badge.color
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Next Steps */}
      {!badge.isActive && (
        <div className="mt-6 p-5 bg-[#4A312F]/5 rounded-2xl border-2 border-[#4A312F]/10">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-[#4A312F] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-black text-[#4A312F] mb-1 uppercase tracking-tight">Keep Going!</p>
              <p className="text-xs text-gray-700 font-bold">
                Complete {totalCount - completedCount} more requirement{totalCount - completedCount !== 1 ? 's' : ''} to unlock this badge.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Badges() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedBadge, setSelectedBadge] = useState(null);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    setLoading(true);
    try {
      const result = await fetchBadgesData();
      setData(result);
      // Auto-select first active badge or first badge
      const firstBadge = result.badges.find(b => b.isActive) || result.badges[0];
      setSelectedBadge(firstBadge);
    } catch (error) {
      console.error('Failed to load badges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F9FB]">
        <div className="text-center">
          <Award size={40} className="animate-bounce text-[#D34079] mx-auto mb-4" />
          <p className="text-[#4A312F] font-black uppercase tracking-widest">Loading badges...</p>
        </div>
      </div>
    );
  }

  const { badges, userStats } = data;

  const filteredBadges = badges.filter(badge => {
    if (filter === "earned") return badge.isActive;
    if (filter === "inProgress") return !badge.isActive && badge.progress > 0;
    if (filter === "locked") return !badge.isActive && badge.progress === 0;
    return true;
  });

  const earnedCount = badges.filter(b => b.isActive).length;
  const totalCount = badges.length;

  return (
    <div className="min-h-screen bg-[#F7F9FB] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-[#4A312F] rounded-[2rem] p-8 text-white shadow-2xl shadow-[#4A312F]/30 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={24} className="text-[#B7E2BF]" />
                <span className="text-xs font-black text-[#B7E2BF] uppercase tracking-[0.2em]">Achievement System</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Trophy Case</h1>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Track your progress and unlock achievements</p>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-5xl font-black text-[#B7E2BF] mb-1 tracking-tighter">{earnedCount}</div>
                <div className="text-xs text-gray-400 font-black uppercase tracking-widest">Earned</div>
              </div>
              <div className="w-px h-16 bg-white/10" />
              <div className="text-center">
                <div className="text-5xl font-black text-white mb-1 tracking-tighter">{totalCount}</div>
                <div className="text-xs text-gray-400 font-black uppercase tracking-widest">Total</div>
              </div>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-gray-100 flex flex-wrap gap-2">
          {[
            { key: "all", label: "All Badges", count: badges.length },
            { key: "earned", label: "Earned", count: earnedCount },
            { key: "inProgress", label: "In Progress", count: badges.filter(b => !b.isActive && b.progress > 0).length },
            { key: "locked", label: "Locked", count: badges.filter(b => !b.isActive && b.progress === 0).length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                filter === tab.key
                  ? "bg-[#D34079] text-white shadow-lg"
                  : "bg-[#F7F9FB] text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Badges Grid */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-black text-[#4A312F] px-1 uppercase tracking-tight">Available Badges</h2>
            <div className="grid grid-cols-1 gap-4">
              {filteredBadges.map(badge => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  isSelected={selectedBadge?.id === badge.id}
                  onClick={setSelectedBadge}
                />
              ))}
            </div>
            
            {filteredBadges.length === 0 && (
              <div className="text-center py-12 px-4 bg-white rounded-[2rem] border-2 border-gray-100">
                <Lock size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 font-black uppercase tracking-widest text-sm">No badges in this category</p>
              </div>
            )}
          </div>

          {/* Requirements Panel */}
          <div className="lg:col-span-2">
            {selectedBadge ? (
              <RequirementsPanel badge={selectedBadge} />
            ) : (
              <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-200 p-12 text-center">
                <Target size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-black text-gray-400 uppercase tracking-tight mb-2">Select a Badge</h3>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Click on any badge to view requirements and progress</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}