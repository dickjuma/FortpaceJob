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
            isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-400' : 'bg-gray-200'
          }`}
        />
      )}

      {/* Circle Indicator */}
      <div
        className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 ${
          isCompleted
            ? 'bg-green-500 border-green-500 text-white'
            : isCurrent
            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
            : 'bg-white border-gray-300 text-gray-400'
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
          isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'
        }`}>
          {level}
        </p>
        {isCurrent && (
          <div className="mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
            Current
          </div>
        )}
      </div>

      {/* Benefits Preview */}
      {isCurrent && benefits && (
        <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={12} className="text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Current Benefits</span>
          </div>
          <div className="flex items-center gap-1">
            {benefits.slice(0, 2).map((benefit, i) => (
              <div key={i} className="text-xs text-blue-600 px-1.5 py-0.5 bg-blue-100 rounded">
                {benefit}
              </div>
            ))}
            {benefits.length > 2 && (
              <span className="text-xs text-blue-500">+{benefits.length - 2}</span>
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
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500"
  };

  return (
    <div className="p-4 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${color === 'blue' ? 'bg-blue-50' : color === 'green' ? 'bg-green-50' : 'bg-gray-50'} rounded-lg`}>
            <Icon size={16} className={`${color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : 'text-gray-600'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{label}</p>
            <p className="text-xs text-gray-500">Target: {unit}{target}</p>
          </div>
        </div>
        <span className={`text-sm font-semibold ${progress === 100 ? 'text-green-600' : 'text-gray-700'}`}>
          {unit}{current}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
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
    <div className={`p-4 rounded-lg border ${available ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-gray-900">{title}</h4>
            {available ? (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Active
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                Locked
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{description}</p>
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
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award size={20} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Seller Levels</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Level Progress</h1>
            <p className="text-gray-600 mt-1">Track your progress and unlock new features</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-gray-600">Next review:</p>
              </div>
              <p className="font-medium text-gray-900">Jan 15, 2024</p>
            </div>
            <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
              Learn More
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="p-6 bg-blue-50 border-b border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">You are currently</h2>
              <p className="text-2xl font-bold text-blue-600">{levels[currentLevelIndex]}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-600">Progress to next level</div>
              <div className="text-2xl font-bold text-gray-900">65%</div>
            </div>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 pt-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("requirements")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "requirements"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Requirements
          </button>
          <button
            onClick={() => setActiveTab("perks")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "perks"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Perks & Benefits
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "timeline"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Level Comparison</h4>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                      {levels.slice(0, 3).map((level, i) => (
                        <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {level}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      ["Max Gigs", "5", "10", "Unlimited"],
                      ["Custom Offers", "✓", "✓", "✓"],
                      ["Promoted Gigs", "✗", "✓", "✓"],
                      ["Analytics", "Basic", "Standard", "Advanced"],
                      ["Support", "24h", "12h", "4h"]
                    ].map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
            <div className="relative pl-8 border-l border-gray-200 space-y-8">
              {[
                { date: "Oct 15, 2023", title: "New Seller", description: "Joined the platform and completed first gig" },
                { date: "Nov 10, 2023", title: "First 5 Orders", description: "Reached 5 successful deliveries" },
                { date: "Dec 5, 2023", title: "Level 1 Achieved", description: "Met requirements for Level 1 seller" },
                { date: "Future", title: "Level 2 Target", description: "Aiming to complete 50 orders by March" }
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-10 w-6 h-6 rounded-full flex items-center justify-center ${
                    i === 2 ? 'bg-blue-600 text-white' : i < 2 ? 'bg-green-500 text-white' : 'bg-gray-300'
                  }`}>
                    {i < 2 ? <Check size={12} /> : i === 2 ? <Award size={12} /> : <Target size={12} />}
                  </div>
                  <div className={`p-4 rounded-lg border ${
                    i === 2 ? 'border-blue-200 bg-blue-50' : i < 2 ? 'border-green-200 bg-green-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <span className="text-sm text-gray-500">{item.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{stats.orders}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">${stats.earnings}</div>
            <div className="text-sm text-gray-600">Total Earnings</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{stats.rating}/5</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{stats.repeatClients}</div>
            <div className="text-sm text-gray-600">Repeat Clients</div>
          </div>
        </div>
      </div>
    </div>
  );
}