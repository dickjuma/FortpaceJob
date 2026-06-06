// src/pages/freelancer/GigPerformanceInsightsPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, TrendingUp, Search, DollarSign, Target,
  ArrowUpRight, AlertCircle, CheckCircle2, ChevronRight,
  Zap, BarChart3, Users, Check
} from 'lucide-react';

export default function GigPerformanceInsightsPage() {
  const [showSuccess, setShowSuccess] = React.useState(null);

  const handleReviewPricing = () => {
    setShowSuccess({ message: 'Opening pricing editor' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleUpdateKeywords = () => {
    setShowSuccess({ message: 'Opening keyword editor' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleAdjustPricing = () => {
    setShowSuccess({ message: 'Opening pricing adjustment' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleAutoApply = () => {
    setShowSuccess({ message: 'Auto-applying AI fixes' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success Toast */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          {showSuccess.message}
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-accent-light text-accent-dark rounded-lg text-xs font-body font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Insights
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl text-brand-900">Performance insights</h1>
          <p className="text-sm text-ink-secondary font-body mt-1">Smart recommendations to boost your ranking and revenue</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Main Content Area */}
        <div className="flex-1 w-full space-y-6">

          {/* Top Insight Alert */}
          <div className="bg-gradient-to-r from-brand-900 to-brand-800 rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-accent-light" />
                  <h2 className="font-body font-semibold text-lg">Optimization opportunity</h2>
                </div>
                <p className="text-white/80 leading-relaxed font-body text-sm mb-5">
                  Your "React JS Development" gig is performing well in search, but dropping off at the pricing page. Aligning your Premium package with market averages could increase monthly revenue by an estimated <strong className="text-white font-semibold">KES 1,200</strong>.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleReviewPricing}
                    className="px-5 py-2 rounded-lg bg-white text-brand-900 font-body font-medium text-sm hover:bg-surface-soft transition-colors"
                  >
                    Review pricing
                  </button>
                  <button className="px-5 py-2 rounded-lg bg-white/10 text-white font-body font-medium text-sm hover:bg-white/20 transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>

              <div className="w-full md:w-44 bg-white/10 rounded-xl p-4 text-center shrink-0">
                <span className="text-xs font-body font-medium text-accent-light uppercase tracking-wide block mb-1">
                  Growth potential
                </span>
                <span className="font-mono font-bold text-3xl text-white block mb-1">+24%</span>
                <span className="text-xs font-body text-accent-light flex items-center justify-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> in conversion
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Recommendation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* SEO Analysis Card */}
            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm hover:border-accent DEFAULT transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-accent-light rounded-xl">
                  <Search className="w-5 h-5 text-accent DEFAULT" />
                </div>
                <span className="bg-danger-light text-danger px-2 py-0.5 rounded-lg text-xs font-body font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Needs attention
                </span>
              </div>

              <h3 className="font-body font-semibold text-lg text-ink-primary mb-2">SEO & keyword analysis</h3>
              <p className="text-sm text-ink-secondary mb-5 leading-relaxed">
                You are currently ranking #12 for "React Developer". Adding "Next.js" and "TailwindCSS" to your tags is recommended.
              </p>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center text-sm font-body p-3 bg-surface-soft rounded-xl">
                  <span className="text-ink-secondary">Current ranking score</span>
                  <span className="font-mono font-semibold text-warn">72/100</span>
                </div>
                <div className="flex justify-between items-center text-sm font-body p-3 bg-accent-light rounded-xl border border-accent DEFAULT">
                  <span className="text-accent-dark">Predicted score</span>
                  <span className="font-mono font-semibold text-accent-dark flex items-center gap-1">94/100 <TrendingUp className="w-3.5 h-3.5" /></span>
                </div>
              </div>

              <button
                onClick={handleUpdateKeywords}
                className="flex items-center text-sm font-body font-medium text-accent DEFAULT hover:text-accent-dark transition-colors"
              >
                Update keywords <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Pricing Suggestions Card */}
            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm hover:border-accent DEFAULT transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-accent-light rounded-xl">
                  <DollarSign className="w-5 h-5 text-accent DEFAULT" />
                </div>
                <span className="bg-accent-light text-accent-dark px-2 py-0.5 rounded-lg text-xs font-body font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Good standing
                </span>
              </div>

              <h3 className="font-body font-semibold text-lg text-ink-primary mb-2">Pricing strategy</h3>
              <p className="text-sm text-ink-secondary mb-5 leading-relaxed">
                45% of buyers purchase a Premium package averaging KES 350. Yours is currently KES 250.
              </p>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-full bg-border rounded-full h-1.5">
                    <div className="bg-ink-tertiary h-1.5 rounded-full" style={{ width: '60%' }} />
                  </div>
                  <span className="text-xs font-mono font-medium text-ink-secondary shrink-0">Your avg: KES 185</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-full bg-accent-light rounded-full h-1.5">
                    <div className="bg-accent DEFAULT h-1.5 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <span className="text-xs font-mono font-medium text-accent-dark shrink-0">Market: KES 240</span>
                </div>
              </div>

              <button
                onClick={handleAdjustPricing}
                className="flex items-center text-sm font-body font-medium text-accent DEFAULT hover:text-accent-dark transition-colors"
              >
                Adjust pricing <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Competitor Comparison Card */}
            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-accent-light rounded-xl">
                  <Users className="w-5 h-5 text-accent DEFAULT" />
                </div>
                <div>
                  <h3 className="font-body font-semibold text-lg text-ink-primary">Competitor benchmarking</h3>
                  <p className="text-sm text-ink-secondary">How you compare to top 10% sellers</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">
                      <th className="pb-3 pr-4">Metric</th>
                      <th className="pb-3 px-4">You</th>
                      <th className="pb-3 px-4">Top 10%</th>
                      <th className="pb-3 pl-4 text-right">Insight</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4 font-body font-medium text-ink-primary">Click-through rate</td>
                      <td className="py-3 px-4 font-mono font-semibold text-ink-primary">4.2%</td>
                      <td className="py-3 px-4 font-mono font-semibold text-ink-tertiary">6.8%</td>
                      <td className="py-3 pl-4 text-right text-danger font-body text-xs font-medium">Add video to improve</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4 font-body font-medium text-ink-primary">Conversion rate</td>
                      <td className="py-3 px-4 font-mono font-semibold text-accent DEFAULT">2.8%</td>
                      <td className="py-3 px-4 font-mono font-semibold text-ink-tertiary">2.5%</td>
                      <td className="py-3 pl-4 text-right text-accent DEFAULT font-body text-xs font-medium">You're doing great</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-body font-medium text-ink-primary">Response time</td>
                      <td className="py-3 px-4 font-mono font-semibold text-ink-primary">2 hrs</td>
                      <td className="py-3 px-4 font-mono font-semibold text-ink-tertiary">&lt; 1 hr</td>
                      <td className="py-3 pl-4 text-right text-warn font-body text-xs font-medium">Download mobile app</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-5">

          {/* Visibility Score */}
          <div className="bg-brand-900 rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-light/20 rounded-bl-full pointer-events-none" />

            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-body font-semibold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-accent-light" /> Visibility score
              </h3>
              <span className="text-xs font-mono font-semibold text-accent-light flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> Top 15%
              </span>
            </div>

            <div className="flex justify-center mb-4 relative z-10">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/20" />
                  <motion.circle
                    cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                    className="text-accent-light"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 251.2" }}
                    animate={{ strokeDasharray: `${(85 / 100) * 251.2} 251.2` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="font-mono font-bold text-3xl">85</span>
                  <span className="text-xs font-body text-white/60">/100</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-body mb-5 relative z-10 text-center">
              Your gig appears on page 2 for most primary keywords. Completing the suggestions will push you to page 1.
            </p>

            <button
              onClick={handleAutoApply}
              className="w-full py-2.5 rounded-lg bg-accent DEFAULT text-white hover:bg-accent-dark text-sm font-body font-medium transition-colors relative z-10"
            >
              Auto-apply fixes
            </button>
          </div>

          {/* Projected Impact */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-body font-semibold text-ink-primary mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent DEFAULT" /> Projected impact
            </h3>
            <p className="text-xs text-ink-secondary font-body leading-relaxed mb-4">
              If you apply the recommended changes today, our model predicts:
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-accent-light rounded-xl">
                <span className="text-xs font-body font-medium text-accent-dark">Search impressions</span>
                <span className="text-sm font-mono font-semibold text-accent-dark">+45%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent-light rounded-xl">
                <span className="text-xs font-body font-medium text-accent-dark">Monthly revenue</span>
                <span className="text-sm font-mono font-semibold text-accent-dark">+KES 1.2K</span>
              </div>
            </div>
          </div>

          {/* Quick Tip */}
          <div className="bg-surface-soft border border-border rounded-xl p-4">
            <h4 className="text-sm font-body font-semibold text-ink-primary mb-2">Pro tip</h4>
            <p className="text-xs text-ink-secondary">
              Responding to messages within 1 hour can increase your conversion rate by up to 25%.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
