import React, { useState, useEffect } from "react";
import { 
  Award, Star, ShieldCheck, TrendingUp, Target,
  ChevronRight, Info, CheckCircle, Lock, Trophy,
  Users, DollarSign, Clock, Calendar, Flag,
  ArrowRight, Settings, Eye
} from "lucide-react";

// Mock API call
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
        description: "Welcome to the platform",
        icon: "Trophy",
        color: "#6B7280",
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
        description: "Quality work recognized",
        icon: "TrendingUp",
        color: "#10B981",
        isActive: true,
        earnedDate: "2024-11-20",
        progress: 100,
        requirements: {
          description: "Selected based on performance and quality",
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
        color: "#3B82F6",
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
        color: "#8B5CF6",
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
        icon: "ShieldCheck",
        color: "#F59E0B",
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
        icon: "Target",
        color: "#EC4899",
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
  Trophy: Trophy,
  TrendingUp: TrendingUp,
  Award: Award,
  Star: Star,
  ShieldCheck: ShieldCheck,
  Target: Target,
  Users: Users,
  DollarSign: DollarSign
};

// Badge Card Component
function BadgeCard({ badge, isSelected, onClick }) {
  const Icon = iconMap[badge.icon] || Award;
  
  return (
    <button
      onClick={() => onClick(badge)}
      className={`relative p-4 rounded-lg border transition-all duration-200 text-left w-full ${
        badge.isActive
          ? 'bg-white border-[#E7E1DE] hover:border-[#E7E1DE] hover:shadow-sm'
          : 'bg-[#F8F4F1] border-[#E7E1DE] hover:border-[#E7E1DE]'
      } ${isSelected ? 'border-[#C9452F] ring-2 ring-[#F4C7A1] bg-[#FDECE7]' : ''}`}
    >
      {/* Status Indicator */}
      <div className="absolute top-3 right-3">
        {badge.isActive ? (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-100 rounded-md">
            <CheckCircle size={12} className="text-green-600" />
            <span className="text-xs font-medium text-green-700">Earned</span>
          </div>
        ) : (
          <div className="p-1 bg-[#F3E9E5] rounded-md">
            <Lock size={14} className="text-[#A38F85]" />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center text-center space-y-3">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            badge.isActive ? 'opacity-100' : 'opacity-60'
          }`}
          style={{
            backgroundColor: badge.isActive ? badge.color : '#E5E7EB',
            color: badge.isActive ? 'white' : '#9CA3AF'
          }}
        >
          <Icon size={20} />
        </div>

        {/* Badge Info */}
        <div className="space-y-1">
          <h3 className={`font-semibold text-sm ${badge.isActive ? 'text-[#2E2322]' : 'text-[#6B5B50]'}`}>
            {badge.name}
          </h3>
          <p className="text-xs text-[#7A5A4C]">
            {badge.description}
          </p>
        </div>

        {/* Progress Bar */}
        {!badge.isActive && (
          <div className="w-full space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#7A5A4C]">Progress</span>
              <span className="font-medium" style={{ color: badge.color }}>{badge.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#F3E9E5] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
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
          <p className="text-xs text-[#A38F85]">
            {new Date(badge.earnedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
        )}
      </div>
    </button>
  );
}

// Requirements Detail Panel
function RequirementsPanel({ badge }) {
  if (!badge) return null;

  const Icon = iconMap[badge.icon] || Award;
  const completedCount = badge.requirements.criteria.filter(c => c.completed).length;
  const totalCount = badge.requirements.criteria.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white rounded-lg border border-[#E7E1DE] p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: badge.color, color: 'white' }}
          >
            <Icon size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#2E2322] mb-1">{badge.name}</h3>
            <p className="text-sm text-[#6B5B50]">{badge.requirements.description}</p>
          </div>
        </div>
        
        {badge.isActive ? (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-md border border-green-200">
            <CheckCircle size={14} />
            <span className="text-sm font-medium">Unlocked</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 bg-[#F8F4F1] text-[#6B5B50] rounded-md border border-[#E7E1DE]">
            <Lock size={14} />
            <span className="text-sm font-medium">Locked</span>
          </div>
        )}
      </div>

      {/* Progress Overview */}
      {!badge.isActive && (
        <div className="mb-6 p-4 bg-[#F8F4F1] rounded-lg border border-[#E7E1DE]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#4A312F]">Progress to unlock</span>
            <span className="text-sm font-semibold" style={{ color: badge.color }}>
              {completedCount}/{totalCount} complete
            </span>
          </div>
          <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#E7E1DE]">
            <div
              className="h-full transition-all duration-300"
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
        <h4 className="text-sm font-medium text-[#2E2322] mb-4">Requirements</h4>
        {badge.requirements.criteria.map((criterion, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 p-3 rounded-lg border ${
              criterion.completed
                ? 'bg-green-50 border-green-100'
                : 'bg-[#F8F4F1] border-[#E7E1DE]'
            }`}
          >
            <div className={`mt-0.5 ${criterion.completed ? 'text-green-600' : 'text-[#A38F85]'}`}>
              {criterion.completed ? (
                <CheckCircle size={16} />
              ) : (
                <div className="w-4 h-4 rounded-full border border-[#E7E1DE]" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${criterion.completed ? 'text-[#2E2322] font-medium' : 'text-[#4A312F]'}`}>
                {criterion.label}
              </p>
              
              {criterion.current !== undefined && criterion.target !== undefined && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6B5B50]">
                      {criterion.current.toLocaleString()} / {criterion.target.toLocaleString()}
                    </span>
                    <span className="font-medium">
                      {Math.round((criterion.current / criterion.target) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#E7E1DE]">
                    <div
                      className="h-full rounded-full"
                      style={{ 
                        width: `${Math.min((criterion.current / criterion.target) * 100, 100)}%`,
                        backgroundColor: criterion.completed ? '#10B981' : badge.color
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
        <div className="mt-6 p-3 bg-[#FDECE7] rounded-lg border border-[#F4C7A1]">
          <div className="flex items-start gap-3">
            <Info size={16} className="text-[#C9452F] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#2E2322] mb-1">Keep Going!</p>
              <p className="text-xs text-[#6B5B50]">
                Complete {totalCount - completedCount} more requirement{totalCount - completedCount !== 1 ? 's' : ''} to unlock this badge.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stats Card Component
function StatsCard({ icon: Icon, label, value, suffix = "" }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-[#E7E1DE]">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-[#F8F4F1] rounded-md">
          <Icon size={16} className="text-[#6B5B50]" />
        </div>
        <span className="text-sm text-[#6B5B50]">{label}</span>
      </div>
      <p className="text-xl font-semibold text-[#2E2322]">{value}{suffix}</p>
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
      <div className="flex items-center justify-center min-h-screen bg-[#F8F4F1]">
        <div className="text-center p-12">
          <Award size={32} className="animate-spin text-[#A38F85] mx-auto mb-4" />
          <p className="text-[#6B5B50] font-medium">Loading badges...</p>
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
    <div className="min-h-screen bg-[#F8F4F1] p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg border border-[#E7E1DE] p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={20} className="text-[#C9452F]" />
                <span className="text-sm font-medium text-[#C9452F]">Achievements</span>
              </div>
              <h1 className="text-2xl font-semibold text-[#2E2322] mb-2">Seller Badges</h1>
              <p className="text-[#6B5B50]">Track your progress and unlock achievements</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#2E2322] mb-1">{earnedCount}</div>
                <div className="text-sm text-[#6B5B50]">Earned</div>
              </div>
              <div className="h-12 w-px bg-[#EFE7E2]" />
              <div className="text-center">
                <div className="text-3xl font-bold text-[#2E2322] mb-1">{totalCount}</div>
                <div className="text-sm text-[#6B5B50]">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard 
            icon={DollarSign}
            label="Total Earnings"
            value={`$${userStats.totalEarnings.toLocaleString()}`}
          />
          <StatsCard 
            icon={CheckCircle}
            label="Completed Orders"
            value={userStats.completedOrders}
          />
          <StatsCard 
            icon={Star}
            label="Rating"
            value={userStats.rating}
            suffix="/5"
          />
          <StatsCard 
            icon={Calendar}
            label="Account Age"
            value={userStats.accountAge}
            suffix=" months"
          />
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg border border-[#E7E1DE] p-1 flex flex-wrap gap-1">
          {[
            { key: "all", label: "All Badges", count: badges.length },
            { key: "earned", label: "Earned", count: earnedCount },
            { key: "inProgress", label: "In Progress", count: badges.filter(b => !b.isActive && b.progress > 0).length },
            { key: "locked", label: "Locked", count: badges.filter(b => !b.isActive && b.progress === 0).length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === tab.key
                  ? "bg-[#C9452F] text-white"
                  : "text-[#6B5B50] hover:bg-[#F8F4F1]"
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
            <h2 className="text-lg font-semibold text-[#2E2322]">Available Badges</h2>
            <div className="grid grid-cols-1 gap-3">
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
              <div className="text-center py-8 px-4 bg-white rounded-lg border border-[#E7E1DE]">
                <Lock size={32} className="mx-auto text-[#C1B1A8] mb-3" />
                <p className="text-[#6B5B50]">No badges in this category</p>
              </div>
            )}
          </div>

          {/* Requirements Panel */}
          <div className="lg:col-span-2">
            {selectedBadge ? (
              <RequirementsPanel badge={selectedBadge} />
            ) : (
              <div className="bg-white rounded-lg border border-dashed border-[#E7E1DE] p-8 text-center">
                <Eye size={32} className="mx-auto text-[#C1B1A8] mb-3" />
                <h3 className="text-lg font-medium text-[#2E2322] mb-2">Select a Badge</h3>
                <p className="text-[#6B5B50]">Click on any badge to view requirements and progress</p>
              </div>
            )}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg border border-[#E7E1DE] p-6">
          <h3 className="text-lg font-semibold text-[#2E2322] mb-4">Badge Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#FDECE7] rounded-lg border border-[#F4C7A1]">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#FDECE7] rounded-md">
                  <TrendingUp size={16} className="text-[#C9452F]" />
                </div>
                <span className="font-medium text-[#2E2322]">Increased Visibility</span>
              </div>
              <p className="text-sm text-[#6B5B50]">
                Higher-level badges appear more prominently in search results
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-md">
                  <DollarSign size={16} className="text-green-600" />
                </div>
                <span className="font-medium text-[#2E2322]">Higher Earnings</span>
              </div>
              <p className="text-sm text-[#6B5B50]">
                Premium badges allow you to charge higher rates for your services
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-md">
                  <Users size={16} className="text-purple-600" />
                </div>
                <span className="font-medium text-[#2E2322]">Trust & Credibility</span>
              </div>
              <p className="text-sm text-[#6B5B50]">
                Badges help build trust with potential clients and establish credibility
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}