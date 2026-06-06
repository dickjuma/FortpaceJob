// src/pages/freelancer/FreelancerSuccessScorePage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Star, TrendingUp, ShieldCheck,
  Target, MessageCircle, AlertTriangle, ArrowUpRight,
  Info, CheckCircle2
} from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function FreelancerSuccessScorePage() {
  const score = 94;

  const getScoreColor = (val) => {
    if(val >= 90) return 'text-accent';
    if(val >= 75) return 'text-warn';
    return 'text-danger';
  };

  const getScoreBg = (val) => {
    if(val >= 90) return 'bg-accent';
    if(val >= 75) return 'bg-warn';
    return 'bg-danger';
  };

  const breakdownItems = [
    { label: 'Client satisfaction (reviews)', score: 98, weight: '40%', icon: Star },
    { label: 'Project completion rate', score: 100, weight: '30%', icon: CheckCircle2 },
    { label: 'Communication & responsiveness', score: 85, weight: '15%', icon: MessageCircle },
    { label: 'Dispute rate (lower is better)', score: 95, weight: '15%', icon: ShieldCheck }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-surface-soft pb-16"
    >
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-warn-light rounded-xl">
              <Trophy className="w-6 h-6 text-warn" />
            </div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Success score</h1>
          </div>
          <p className="text-ink-secondary font-body">Your marketplace reputation and performance metrics</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">

        {/* Left Column: Overall Score & Trends */}
        <div className="flex-1 space-y-6">

          {/* Main Score Card */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <button className="text-ink-tertiary hover:text-ink-secondary transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </div>

            <h2 className="font-display font-semibold text-lg text-brand-900 mb-6">Overall job success score</h2>

            {/* Circular Progress */}
            <div className="relative w-40 h-40 mx-auto mb-5 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" className="stroke-border" strokeWidth="6" fill="none" />
                <motion.circle
                  cx="50" cy="50" r="42"
                  className="stroke-accent"
                  strokeWidth="6" fill="none"
                  strokeDasharray="263.89"
                  initial={{ strokeDashoffset: 263.89 }}
                  animate={{ strokeDashoffset: 263.89 - (263.89 * score) / 100 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("font-mono font-bold text-4xl", getScoreColor(score))}>{score}%</span>
                <span className="text-xs font-body font-medium text-ink-tertiary mt-1">Top 5%</span>
              </div>
            </div>

            <p className="text-sm font-body text-ink-secondary max-w-md mx-auto">
              Your score is based on long-term client relationships, feedback, and successful project deliveries over the past 24 months
            </p>

            <div className="mt-5 flex justify-center">
              <div className="bg-accent-light px-3 py-1.5 rounded-lg flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-accent DEFAULT" />
                <span className="text-sm font-body font-semibold text-accent-dark">+2% this month</span>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-display font-semibold text-lg text-brand-900 mb-5">Score breakdown</h3>

            <div className="space-y-5">
              {breakdownItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-ink-tertiary" />
                        <span className="text-sm font-body font-semibold text-ink-primary">{item.label}</span>
                        <span className="text-xs font-body font-medium bg-surface-muted text-ink-tertiary px-1.5 py-0.5 rounded">
                          {item.weight}
                        </span>
                      </div>
                      <span className={cn("text-sm font-mono font-semibold", getScoreColor(item.score))}>
                        {item.score}/100
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.05 }}
                        className={cn("h-full rounded-full", getScoreBg(item.score))}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations */}
        <div className="w-full lg:w-96 shrink-0 space-y-5">

          {/* Improvement Tips */}
          <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-5 shadow-sm text-white">
            <h3 className="font-body font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-accent-light" /> Improve your score
            </h3>
            <p className="text-sm font-body text-white/80 mb-5 leading-relaxed">
              Personalized insights to help you reach a 99% score
            </p>

            <div className="space-y-3">
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-warn flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-body font-semibold text-white">Improve response time</h4>
                    <p className="text-xs font-body text-white/70 mt-1">
                      Your average response time is 4 hours. Keeping it under 2 hours boosts your score.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-accent-light flex items-center justify-center shrink-0">
                    <TrendingUp className="w-3.5 h-3.5 text-accent DEFAULT" />
                  </div>
                  <div>
                    <h4 className="text-sm font-body font-semibold text-white">Request feedback</h4>
                    <p className="text-xs font-body text-white/70 mt-1">
                      You have 2 completed contracts without reviews. Requesting feedback will solidify your rating.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Marketplace Benchmarks */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-body font-semibold text-ink-primary mb-5">Marketplace benchmarks</h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-body font-medium text-ink-secondary">Top rated plus eligibility</span>
                  <span className="text-xs font-body font-semibold text-accent DEFAULT">Met</span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full w-full bg-accent DEFAULT rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-body font-medium text-ink-secondary">Expert vetted eligibility</span>
                  <span className="text-xs font-body font-semibold text-accent DEFAULT">Invited</span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-accent DEFAULT rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tip */}
          <div className="bg-accent-light border border-accent DEFAULT rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-accent DEFAULT" />
              </div>
              <div>
                <h4 className="text-sm font-body font-semibold text-accent-dark mb-1">Pro tip</h4>
                <p className="text-xs font-body text-accent-dark">
                  Responding to messages within 1 hour can increase your communication score by up to 15%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
