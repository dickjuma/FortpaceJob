// src/components/findWork/performance/Promotion.jsx
import React, { useState } from "react";
import { Megaphone, Target, BarChart3, Rocket, ChevronRight, DollarSign, TrendingUp, Eye, Users } from "lucide-react";

const Benefit = ({ icon: Icon, title, desc }) => (
  <div className="flex gap-4 p-4 rounded-lg bg-white border border-[#E7E1DE] hover:border-[#C9452F] hover:shadow-sm transition-all duration-200">
    <div className="w-10 h-10 rounded-lg bg-[#FDECE7] flex items-center justify-center text-[#C9452F] shrink-0">
      <Icon size={20} />
    </div>
    <div>
      <h4 className="font-semibold text-[#2E2322] text-sm mb-1">{title}</h4>
      <p className="text-sm text-[#6B5B50] leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default function Promotion() {
  const [dailyBudget, setDailyBudget] = useState(5);

  return (
    <div className="bg-white rounded-lg border border-[#E7E1DE] overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-[#E7E1DE] bg-[#F8F4F1]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FDECE7] rounded-lg">
              <Megaphone size={20} className="text-[#C9452F]" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#2E2322]">Promoted Gigs</h1>
              <p className="text-sm text-[#6B5B50]">Increase visibility and get more orders</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#6B5B50]">
            <Eye size={16} />
            <span>Only 5% of sellers use this feature</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#2E2322] mb-3">Boost Your Sales Visibility</h2>
              <p className="text-[#6B5B50] mb-6">
                Get your gigs featured in premium positions to reach more potential clients and increase your order volume.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FDECE7] rounded-lg border border-[#F4C7A1]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#FDECE7] rounded-md">
                    <TrendingUp size={16} className="text-[#C9452F]" />
                  </div>
                  <span className="font-medium text-[#2E2322]">Higher Visibility</span>
                </div>
                <p className="text-sm text-[#6B5B50]">
                  Appear in the top search results where most orders happen
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-md">
                    <DollarSign size={16} className="text-green-600" />
                  </div>
                  <span className="font-medium text-[#2E2322]">Pay Per Click</span>
                </div>
                <p className="text-sm text-[#6B5B50]">
                  Only pay when potential clients click on your gig
                </p>
              </div>
            </div>

            {/* Budget Selector */}
            <div className="bg-[#F8F4F1] p-5 rounded-lg border border-[#E7E1DE]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-[#2E2322] mb-1">Set Daily Budget</h3>
                  <p className="text-sm text-[#6B5B50]">Control your daily spending</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-[#2E2322]">${dailyBudget}/day</div>
                  <div className="text-sm text-[#6B5B50]">≈ {dailyBudget * 4}-{dailyBudget * 12} clicks/day</div>
                </div>
              </div>
              
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={dailyBudget}
                onChange={(e) => setDailyBudget(parseInt(e.target.value))}
                className="w-full h-2 bg-[#EFE7E2] rounded-lg appearance-none cursor-pointer accent-[#C9452F] mb-2"
              />
              <div className="flex justify-between text-sm text-[#7A5A4C]">
                <span>$1</span>
                <span>Daily budget</span>
                <span>$50</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button className="w-full bg-[#C9452F] hover:bg-[#B53A27] text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow transition-all flex items-center justify-center gap-2">
                Start Campaign
                <ChevronRight size={18} />
              </button>
              <p className="text-sm text-[#7A5A4C] text-center mt-3">
                No minimum spend. Cancel anytime.
              </p>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            {/* Stats Preview */}
            <div className="bg-[#F8F4F1] p-5 rounded-lg border border-[#E7E1DE]">
              <h3 className="font-medium text-[#2E2322] mb-4">Expected Results</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border border-[#E7E1DE]">
                  <div className="text-2xl font-semibold text-[#C9452F] mb-1">+240%</div>
                  <div className="text-sm text-[#6B5B50]">CTR Increase</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-[#E7E1DE]">
                  <div className="text-2xl font-semibold text-green-600 mb-1">3x</div>
                  <div className="text-sm text-[#6B5B50]">More Orders</div>
                </div>
              </div>
            </div>

            {/* Promoted Gig Preview */}
            <div className="border border-[#E7E1DE] rounded-lg overflow-hidden">
              <div className="bg-[#FDECE7] px-4 py-2 border-b border-[#E7E1DE]">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-[#C9452F] text-white text-xs font-medium rounded">
                    PROMOTED
                  </div>
                  <span className="text-sm text-[#6B5B50]">Preview of how your gig will appear</span>
                </div>
              </div>
              
              <div className="p-5 bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#F3E9E5] rounded-lg flex items-center justify-center">
                    <Rocket size={24} className="text-[#A38F85]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 bg-[#EFE7E2] rounded-full w-full"></div>
                    </div>
                    <div className="h-2 bg-[#F3E9E5] rounded-full w-2/3 mb-4"></div>
                    
                    <div className="flex items-center justify-between text-sm text-[#6B5B50]">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span>4.9</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>24 orders</span>
                      </div>
                      <div className="font-semibold text-[#2E2322]">$125</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-3">
              <Benefit 
                icon={Target} 
                title="Targeted Exposure" 
                desc="Your gig is shown to buyers with matching search intent"
              />
              <Benefit 
                icon={BarChart3} 
                title="Performance Tracking" 
                desc="Monitor clicks, conversions, and ROI in real-time"
              />
              <Benefit 
                icon={DollarSign} 
                title="Optimized Spending" 
                desc="Automatically adjust to maximize return on investment"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-[#E7E1DE] bg-[#F8F4F1]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-[#6B5B50]">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Active for sellers in your category</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-[#C9452F] hover:text-[#B53A27] font-medium">
              Learn More
            </button>
            <button className="px-6 py-2 bg-[#C9452F] hover:bg-[#B53A27] text-white rounded-lg font-medium">
              Start Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}