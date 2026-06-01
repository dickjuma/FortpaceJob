import React from 'react';
import { Target, TrendingUp, Star, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

const FreelancerSuccessScore = () => {
  return (
    <>
      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          
          <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
            <div className="w-48 h-48 rounded-full border-8 border-zinc-100 flex items-center justify-center relative shrink-0">
              {/* Circular Progress Mock */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="none" className="text-zinc-200" />
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray="552.9" strokeDashoffset="27.6" className="text-success" />
              </svg>
              <div className="text-center">
                <div className="text-5xl font-black text-zinc-900">95%</div>
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-1">Success Score</div>
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4">Your Job Success Score</h1>
              <p className="text-lg text-zinc-600 mb-6 max-w-xl leading-relaxed">
                Your Job Success Score (JSS) measures your overall reputation on Fortspace based on client feedback, contract outcomes, and platform reliability.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-xl flex items-center gap-2">
                  <Award className="w-4 h-4" /> Top Rated Eligible
                </span>
                <span className="px-4 py-2 bg-zinc-200 text-zinc-700 text-sm font-bold rounded-xl">
                  Updated: Today
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#14a800]" /> Score Breakdown
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-bold text-zinc-700 mb-2">
                    <span>Client Satisfaction (Private Feedback)</span>
                    <span className="text-success">Excellent</span>
                  </div>
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="w-[95%] h-full bg-success rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold text-zinc-700 mb-2">
                    <span>Long-term Contracts</span>
                    <span className="text-[#14a800]">Great</span>
                  </div>
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-[#14a800] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold text-zinc-700 mb-2">
                    <span>Contracts Completed Without Dispute</span>
                    <span className="text-success">100%</span>
                  </div>
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-success rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-dark text-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" /> How to Improve
              </h3>
              <ul className="space-y-4 text-zinc-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span>Maintain proactive communication with clients to ensure 5-star private feedback upon completion.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span>Avoid closing contracts without earnings or mutual agreement.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span>Deliver milestones on or before the agreed-upon deadline.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default FreelancerSuccessScore;
