// src/components/findWork/performance/SkillLevels.jsx
import React, { useState } from "react";
import { 
  ChevronRight, Check, Lock, Star, DollarSign, 
  Briefcase, Clock, Award, TrendingUp, Users,
  Shield, Zap, Globe, MessageSquare, Target,
  BarChart, Calendar, HelpCircle, ExternalLink
} from "lucide-react";

const LevelStep = ({ level, index, currentLevelIndex, benefits }) => {
  const isCompleted = index < currentLevelIndex;
  const isCurrent = index === currentLevelIndex;
  const isLocked = index > currentLevelIndex;

  return (
    <div className="relative flex flex-col items-center flex-1">
      {/* Connector Line */}
      {index !== 0 && (
        <div
          className={`absolute right-1/2 left-[-50%] top-6 h-0.5 -translate-y-1/2 ${
            isCompleted ? 'bg-green-500' : isCurrent ? 'bg-[#E07152]' : 'bg-[#EFE7E2]'
          }`}
        />
      )}

      {/* Circle Indicator */}
      <div
        className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 ${
          isCompleted
            ? 'bg-green-500 border-green-500 text-white'
            : isCurrent
            ? 'bg-[#C9452F] border-[#C9452F] text-white shadow-md'
            : 'bg-white border-[#E7E1DE] text-[#A38F85]'
        }`}
      >
        {isCompleted ? (
          <Check size={16} />
        ) : isLocked ? (
          <Lock size={14} />
        ) : (
          <span className="font-semibold">{index + 1}</span>
        )}
      </div>

      {/* Level Label */}
      <div className="mt-3 text-center">
        <p className={`text-xs font-medium ${
          isCurrent ? 'text-[#C9452F]' : isCompleted ? 'text-[#2E2322]' : 'text-[#7A5A4C]'
        }`}>
          {level}
        </p>
        {isCurrent && (
          <div className="mt-1 px-2 py-0.5 bg-[#FDECE7] text-[#C9452F] text-xs rounded-full">
            Current
          </div>
        )}
      </div>

      {/* Benefits Preview */}
      {isCurrent && benefits && (
        <div className="mt-3 p-2 bg-[#FDECE7] rounded-lg border border-[#F4C7A1]">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={12} className="text-[#C9452F]" />
            <span className="text-xs font-medium text-[#B53A27]">Current Benefits</span>
          </div>
          <div className="flex items-center gap-1">
            {benefits.slice(0, 2).map((benefit, i) => (
              <div key={i} className="text-xs text-[#C9452F] px-1.5 py-0.5 bg-[#FDECE7] rounded">
                {benefit}
              </div>
            ))}
            {benefits.length > 2 && (
              <span className="text-xs text-[#C9452F]">+{benefits.length - 2}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Requirement = ({ icon: Icon, label, current, target, unit = "", color = "blue" }) => {
  const progress = Math.min((current / target) * 100, 100);
  const colorClasses = {
    blue: "bg-[#FDECE7]",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500"
  };

  return (
    <div className="p-4 rounded-lg border border-[#E7E1DE] bg-white hover:border-[#E7E1DE] transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${color === 'blue' ? 'bg-[#FDECE7]' : color === 'green' ? 'bg-green-50' : 'bg-[#F8F4F1]'} rounded-lg`}>
            <Icon size={16} className={`${color === 'blue' ? 'text-[#C9452F]' : color === 'green' ? 'text-green-600' : 'text-[#6B5B50]'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-[#2E2322]">{label}</p>
            <p className="text-xs text-[#7A5A4C]">Target: {unit}{target}</p>
          </div>
        </div>
        <span className={`text-sm font-semibold ${progress === 100 ? 'text-green-600' : 'text-[#4A312F]'}`}>
          {unit}{current}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-[#7A5A4C]">Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-[#F3E9E5] rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${colorClasses[color]} transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const PerkCard = ({ icon: Icon, title, description, available }) => {
  return (
    <div className={`p-4 rounded-lg border ${available ? 'border-green-200 bg-green-50' : 'border-[#E7E1DE] bg-[#F8F4F1]'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${available ? 'bg-green-100 text-green-600' : 'bg-[#F3E9E5] text-[#A38F85]'}`}>
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-[#2E2322]">{title}</h4>
            {available ? (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Active
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-[#F3E9E5] text-[#7A5A4C] text-xs font-medium rounded-full">
                Locked
              </span>
            )}
          </div>
          <p className="text-sm text-[#6B5B50]">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default function SkillLevels() {
  const [activeTab, setActiveTab] = useState("requirements");
  
  const levels = ["New Seller", "Level 1", "Level 2", "Top Rated", "Pro"];
  const currentLevelIndex = 1;

  const levelBenefits = {
    0: ["Basic Profile", "Create 5 Gigs", "Standard Support"],
    1: ["Create 10 Gigs", "Custom Offers", "Priority Support", "Basic Analytics"],
    2: ["Unlimited Gigs", "Advanced Analytics", "Promoted Gigs", "Client Management"],
    3: ["Featured Listings", "Dedicated Support", "API Access", "Custom Domain"],
    4: ["Enterprise Features", "White Label", "Premium Placement", "Account Manager"]
  };

  const stats = {
    orders: 8,
    earnings: 320,
    rating: 4.8,
    daysActive: 45,
    responseRate: 98,
    completionRate: 95,
    repeatClients: 3
  };

  const nextLevelRequirements = [
    { icon: Briefcase, label: "Orders Completed", current: stats.orders, target: 10, color: "blue" },
    { icon: DollarSign, label: "Total Earnings", current: stats.earnings, target: 400, unit: "$", color: "green" },
    { icon: Star, label: "Average Rating", current: stats.rating, target: 4.7, color: "purple" },
    { icon: Clock, label: "Days Active", current: stats.daysActive, target: 60, color: "orange" },
    { icon: MessageSquare, label: "Response Rate", current: stats.responseRate, target: 90, unit: "%", color: "blue" },
    { icon: Check, label: "Completion Rate", current: stats.completionRate, target: 90, unit: "%", color: "green" }
  ];

  const perks = [
    { icon: Users, title: "Custom Offers", description: "Send custom proposals to clients", available: true },
    { icon: BarChart, title: "Advanced Analytics", description: "Detailed performance insights", available: false },
    { icon: Shield, title: "Priority Support", description: "Faster response times", available: true },
    { icon: Globe, title: "Promoted Gigs", description: "Boost your gig visibility", available: false },
    { icon: Target, title: "Targeted Bidding", description: "Get matched with ideal projects", available: false },
    { icon: Award, title: "Verified Badge", description: "Build trust with clients", available: false }
  ];

  return (
    <div className="bg-white rounded-lg border border-[#E7E1DE]">
      {/* Header */}
      <div className="p-6 border-b border-[#E7E1DE]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award size={20} className="text-[#C9452F]" />
              <span className="text-sm font-medium text-[#C9452F]">Seller Levels</span>
            </div>
            <h1 className="text-2xl font-semibold text-[#2E2322]">Level Progress</h1>
            <p className="text-[#6B5B50] mt-1">Track your progress and unlock new features</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-[#6B5B50]">Next review:</p>
              </div>
              <p className="font-medium text-[#2E2322]">Jan 15, 2024</p>
            </div>
            <button className="px-4 py-2 text-[#C9452F] hover:text-[#B53A27] font-medium flex items-center gap-2">
              Learn More
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="p-6 bg-[#FDECE7] border-b border-[#F4C7A1]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#FDECE7] rounded-lg">
              <TrendingUp size={24} className="text-[#C9452F]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#2E2322]">You are currently</h2>
              <p className="text-2xl font-bold text-[#C9452F]">{levels[currentLevelIndex]}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-sm text-[#6B5B50]">Progress to next level</div>
              <div className="text-2xl font-bold text-[#2E2322]">65%</div>
            </div>
            <div className="w-24 h-2 bg-[#EFE7E2] rounded-full overflow-hidden">
              <div className="h-full bg-[#C9452F] rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 pt-6">
        <div className="flex border-b border-[#E7E1DE]">
          <button
            onClick={() => setActiveTab("requirements")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "requirements"
                ? "border-[#C9452F] text-[#C9452F]"
                : "border-transparent text-[#7A5A4C] hover:text-[#4A312F]"
            }`}
          >
            Requirements
          </button>
          <button
            onClick={() => setActiveTab("perks")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "perks"
                ? "border-[#C9452F] text-[#C9452F]"
                : "border-transparent text-[#7A5A4C] hover:text-[#4A312F]"
            }`}
          >
            Perks & Benefits
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "timeline"
                ? "border-[#C9452F] text-[#C9452F]"
                : "border-transparent text-[#7A5A4C] hover:text-[#4A312F]"
            }`}
          >
            Timeline
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {activeTab === "requirements" && (
          <div className="space-y-6">
            {/* Level Progress Bar */}
            <div className="flex justify-between items-start max-w-4xl mx-auto py-4">
              {levels.map((level, index) => (
                <LevelStep
                  key={index}
                  level={level}
                  index={index}
                  currentLevelIndex={currentLevelIndex}
                  benefits={levelBenefits[index]}
                />
              ))}
            </div>

            {/* Next Level Requirements */}
            <div>
              <h3 className="text-lg font-semibold text-[#2E2322] mb-4">
                Requirements for {levels[currentLevelIndex + 1]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nextLevelRequirements.map((req, i) => (
                  <Requirement key={i} {...req} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "perks" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {perks.map((perk, i) => (
                <PerkCard key={i} {...perk} />
              ))}
            </div>
            
            {/* Comparison Table */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-[#2E2322] mb-4">Level Comparison</h4>
              <div className="overflow-x-auto border border-[#E7E1DE] rounded-lg">
                <table className="min-w-full divide-y divide-[#E7E1DE]">
                  <thead className="bg-[#F8F4F1]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#7A5A4C] uppercase tracking-wider">Feature</th>
                      {levels.slice(0, 3).map((level, i) => (
                        <th key={i} className="px-6 py-3 text-left text-xs font-medium text-[#7A5A4C] uppercase tracking-wider">
                          {level}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#E7E1DE]">
                    {[
                      ["Max Gigs", "5", "10", "Unlimited"],
                      ["Custom Offers", "✓", "✓", "✓"],
                      ["Promoted Gigs", "✗", "✓", "✓"],
                      ["Analytics", "Basic", "Standard", "Advanced"],
                      ["Support", "24h", "12h", "4h"]
                    ].map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-[#2E2322]">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="space-y-6">
            <div className="relative pl-8 border-l border-[#E7E1DE] space-y-8">
              {[
                { date: "Oct 15, 2023", title: "New Seller", description: "Joined the platform and completed first gig" },
                { date: "Nov 10, 2023", title: "First 5 Orders", description: "Reached 5 successful deliveries" },
                { date: "Dec 5, 2023", title: "Level 1 Achieved", description: "Met requirements for Level 1 seller" },
                { date: "Future", title: "Level 2 Target", description: "Aiming to complete 50 orders by March" }
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-10 w-6 h-6 rounded-full flex items-center justify-center ${
                    i === 2 ? 'bg-[#C9452F] text-white' : i < 2 ? 'bg-green-500 text-white' : 'bg-[#C1B1A8]'
                  }`}>
                    {i < 2 ? <Check size={12} /> : i === 2 ? <Award size={12} /> : <Target size={12} />}
                  </div>
                  <div className={`p-4 rounded-lg border ${
                    i === 2 ? 'border-[#F4C7A1] bg-[#FDECE7]' : i < 2 ? 'border-green-200 bg-green-50' : 'border-[#E7E1DE]'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-[#2E2322]">{item.title}</h4>
                      <span className="text-sm text-[#7A5A4C]">{item.date}</span>
                    </div>
                    <p className="text-sm text-[#6B5B50]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="p-6 border-t border-[#E7E1DE] bg-[#F8F4F1]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-[#E7E1DE]">
            <div className="text-2xl font-bold text-[#2E2322]">{stats.orders}</div>
            <div className="text-sm text-[#6B5B50]">Total Orders</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-[#E7E1DE]">
            <div className="text-2xl font-bold text-[#2E2322]">${stats.earnings}</div>
            <div className="text-sm text-[#6B5B50]">Total Earnings</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-[#E7E1DE]">
            <div className="text-2xl font-bold text-[#2E2322]">{stats.rating}/5</div>
            <div className="text-sm text-[#6B5B50]">Average Rating</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-[#E7E1DE]">
            <div className="text-2xl font-bold text-[#2E2322]">{stats.repeatClients}</div>
            <div className="text-sm text-[#6B5B50]">Repeat Clients</div>
          </div>
        </div>
      </div>
    </div>
  );
}