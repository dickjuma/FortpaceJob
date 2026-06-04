import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Star, TrendingUp, ShieldCheck,
  Target, MessageCircle, AlertTriangle, ArrowUpRight,
  Info
} from 'lucide-react';
import { CheckSquare } from 'react-feather';
import { cn } from '../../admin/utils/cn';

export default function FreelancerSuccessScorePage() {
  const score = 94;

  const getScoreColor = (val) => {
    if(val >= 90) return 'text-success';
    if(val >= 75) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreBg = (val) => {
    if(val >= 90) return 'bg-success';
    if(val >= 75) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">

      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" /> Success Score
          </h1>
          <p className="text-zinc-500 font-medium">Your marketplace reputation and performance metrics.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">

        {/* Left Column: Overall Score & Trends */}
        <div className="flex-1 space-y-8">

          {/* Main Score Card */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button className="text-zinc-400 hover:text-zinc-600 transition-colors"><Info className="w-5 h-5" /></button>
            </div>

            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-8">Overall Job Success Score</h2>

            {/* Circular Progress Placeholder / Animation */}
            <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-zinc-100 dark:stroke-zinc-800" strokeWidth="8" fill="none" />
                <motion.circle
                  cx="50" cy="50" r="40"
                  className={cn("stroke-emerald-500", getScoreColor(score).replace('text', 'stroke'))}
                  strokeWidth="8" fill="none"
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * score) / 100 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("text-5xl font-black", getScoreColor(score))}>{score}%</span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1">Top 5%</span>
              </div>
            </div>

            <p className="text-sm font-medium text-zinc-500 max-w-md mx-auto">
              Your score is based on long-term client relationships, feedback, and successful project deliveries over the past 24 months.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <div className="bg-emerald-50 dark:bg-success/10 px-4 py-2 rounded-xl flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-success" />
                <span className="text-sm font-bold text-emerald-700 dark:text-success">+2% this month</span>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-6">Score Breakdown</h3>

            <div className="space-y-6">
              {[
                { label: 'Client Satisfaction (Reviews)', score: 98, weight: '40%', icon: Star },
                { label: 'Project Completion Rate', score: 100, weight: '30%', icon: CheckSquare },
                { label: 'Communication & Responsiveness', score: 85, weight: '15%', icon: MessageCircle },
                { label: 'Dispute Rate (Lower is better)', score: 95, weight: '15%', icon: ShieldCheck }
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-zinc-400" />
                      <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{item.label}</span>
                      <span className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded uppercase">{item.weight}</span>
                    </div>
                    <span className={cn("text-sm font-black", getScoreColor(item.score))}>{item.score}/100</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={cn("h-full rounded-full", getScoreBg(item.score))}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Recommendations */}
        <div className="w-full lg:w-96 shrink-0 space-y-6">

          <div className="bg-gradient-to-br from-[#2bb75c] to-[#1d8d38] rounded-3xl p-6 shadow-md text-white">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#2bb75c]" /> Improve Your Score
            </h3>
            <p className="text-sm font-medium text-[#2bb75c] mb-6 leading-relaxed">
              Forte AI has analyzed your profile and recent contracts to provide actionable insights for reaching a 99% score.
            </p>

            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Improve Response Time</h4>
                    <p className="text-xs font-medium text-[#2bb75c] mt-1">Your average response time dropped to 4 hours this week. Keeping it under 2 hours boosts your communication score.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Ask for Reviews</h4>
                    <p className="text-xs font-medium text-[#2bb75c] mt-1">You have 2 recently completed contracts without feedback. Requesting reviews will solidify your 98% satisfaction rate.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-6">Marketplace Benchmarks</h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-zinc-500">Top Rated Plus Eligibility</span>
                  <span className="text-xs font-bold text-success">Met</span>
                </div>
                <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                  <div className="h-full w-full bg-success rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-zinc-500">Expert Vetted Eligibility</span>
                  <span className="text-xs font-bold text-[#2bb75c]">Invited to Apply</span>
                </div>
                <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                  <div className="h-full w-[80%] bg-[#2bb75c] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

