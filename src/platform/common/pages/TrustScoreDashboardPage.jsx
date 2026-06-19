import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, TrendingUp, Clock, 
  MessageSquare, Zap, Target, Star,
  Award, Activity, BarChart2, ChevronRight
} from 'lucide-react';

const mockTrustData = {
  score: 98,
  maxScore: 100,
  previousScore: 94,
  percentile: 'Top 5%',
  lastUpdated: 'Today, 09:41 AM',
  factors: [
    { id: 1, name: 'Job Success Rate', score: 100, status: 'excellent', icon: Target, description: 'Percentage of jobs completed successfully without dispute.' },
    { id: 2, name: 'Response Time', score: 95, status: 'good', icon: Clock, description: 'Average time taken to respond to client messages.' },
    { id: 3, name: 'Client Feedback', score: 98, status: 'excellent', icon: Star, description: 'Average rating from past clients.' },
    { id: 4, name: 'Dispute Rate', score: 100, status: 'excellent', icon: ShieldCheck, description: 'Frequency of job disputes (lower is better).' }
  ],
  timeline: [
    { id: 1, date: 'May 15', event: 'Score increased by +2 points', type: 'positive' },
    { id: 2, date: 'May 10', event: 'Completed 5 jobs with 5-star ratings', type: 'positive' },
    { id: 3, date: 'Apr 28', event: 'Late response to client message', type: 'negative' },
    { id: 4, date: 'Apr 15', event: 'Achieved Top Rated status', type: 'positive' }
  ],
  recommendations: [
    { id: 1, title: 'Improve response time on weekends', impact: 'High', description: 'Your weekend response time averages 12 hours. Reducing this to under 4 hours could boost your score by 2 points.', icon: Zap },
    { id: 2, title: 'Request feedback for recent jobs', impact: 'Medium', description: 'You have 3 recently completed jobs without feedback. A polite request could improve your feedback density.', icon: MessageSquare }
  ]
};

const ScoreCircle = ({ score, maxScore }) => {
  const percentage = (score / maxScore) * 100;
  const strokeDasharray = `${percentage} 100`;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-border"
          strokeWidth="3"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <motion.path
          className="text-[#e63946]"
          strokeWidth="3"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          stroke="currentColor"
          fill="none"
          initial={{ strokeDasharray: "0 100" }}
          animate={{ strokeDasharray }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-text-primary">{score}</span>
        <span className="text-sm text-text-secondary">/ {maxScore}</span>
      </div>
    </div>
  );
};

export default function TrustScoreDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-light-gray text-text-primary font-sans py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#222222] flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-[#e63946]" />
              Trust & Performance Score
            </h1>
            <p className="mt-1 text-text-secondary">
              Last updated: {mockTrustData.lastUpdated}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-border text-text-primary rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2 shadow-sm">
              <Activity className="w-4 h-4" />
              View Analytics
            </button>
            <button className="px-4 py-2 bg-[#e63946] text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm shadow-sm">
              Share Score
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-lg border border-border shadow-sm p-8 flex flex-col md:flex-row items-center gap-8"
          >
            <ScoreCircle score={mockTrustData.score} maxScore={mockTrustData.maxScore} />
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-[#222222]">Exceptional Trust Level</h2>
                <p className="text-text-secondary mt-1 text-lg">
                  You are in the <span className="font-semibold text-[#e63946]">{mockTrustData.percentile}</span> of all freelancers on Forte.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-success/10 p-5 rounded-lg border border-success/30">
                  <div className="flex items-center gap-2 text-success mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Recent Trend</span>
                  </div>
                  <span className="text-xl font-bold text-success">+{mockTrustData.score - mockTrustData.previousScore} Points</span>
                </div>
                <div className="bg-success p-5 rounded-lg border border-success/50">
                  <div className="flex items-center gap-2 text-[#222222] mb-2">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">Current Status</span>
                  </div>
                  <span className="text-xl font-bold text-[#222222]">Top Rated Plus</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Recommendations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-success/30 rounded-lg border border-success shadow-sm p-6 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#e63946]" />
              <h3 className="font-semibold text-[#222222]">AI Insights</h3>
            </div>
            <div className="space-y-4 flex-1">
              {mockTrustData.recommendations.map((rec) => {
                const Icon = rec.icon;
                return (
                  <div key={rec.id} className="bg-white rounded-lg p-4 shadow-sm border border-border">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-success/50 rounded-lg shrink-0">
                        <Icon className="w-4 h-4 text-[#222222]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-text-primary">{rec.title}</h4>
                        <p className="text-xs text-text-secondary mt-1 leading-relaxed">{rec.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="w-full mt-4 py-2 bg-[#e63946] hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm">
              View All Recommendations
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trust Factors Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#222222]">Trust Factors</h3>
              <div className="flex bg-border/50 rounded-lg p-1">
                {['overview', 'details'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab 
                        ? 'bg-white text-text-primary shadow-sm' 
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockTrustData.factors.map((factor, idx) => {
                const Icon = factor.icon;
                return (
                  <motion.div
                    key={factor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="bg-white rounded-lg border border-border p-6 shadow-sm hover:border-success transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${
                          factor.score >= 95 ? 'bg-success/10 text-success' :
                          factor.score >= 80 ? 'bg-warning/10 text-warning' :
                          'bg-error/10 text-error'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="font-semibold text-text-primary">{factor.name}</h4>
                      </div>
                      <span className="text-xl font-bold text-text-primary">{factor.score}%</span>
                    </div>
                    
                    <div className="w-full bg-border/50 rounded-full h-2 mb-3 overflow-hidden">
                      <motion.div 
                        className={`h-full rounded-full ${
                          factor.score >= 95 ? 'bg-success' :
                          factor.score >= 80 ? 'bg-warning' : 'bg-error'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${factor.score}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                    
                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                      {factor.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Fake Chart Area */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg border border-border shadow-sm p-6 mt-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#222222]">Performance Analytics</h3>
                <BarChart2 className="w-5 h-5 text-text-secondary" />
              </div>
              <div className="h-64 w-full flex items-end justify-between gap-2 px-4 pb-4 border-b border-border relative">
                {/* Horizontal grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-4">
                  {[100, 75, 50, 25, 0].map((val) => (
                    <div key={val} className="w-full border-t border-border flex items-center">
                      <span className="text-xs text-text-secondary -mt-2 -ml-6 bg-white pr-1 absolute">{val}</span>
                    </div>
                  ))}
                </div>
                {/* Mock Bars */}
                {[60, 75, 82, 85, 90, 88, 94, 98].map((height, i) => (
                  <motion.div 
                    key={i}
                    className="w-full bg-[#e63946]/20 hover:bg-[#e63946]/40 rounded-t-sm relative group z-10 cursor-pointer transition-colors"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className="absolute -top-8 left-1/2 -tranzinc-x-1/2 bg-[#222222] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {height}%
                    </div>
                    <div className="absolute top-0 left-0 w-full bg-[#e63946] rounded-t-sm" style={{ height: '4px' }}></div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between px-4 mt-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
              </div>
            </motion.div>

          </div>

          {/* Timeline Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-border shadow-sm p-6">
              <h3 className="text-lg font-bold text-[#222222] mb-6">Recent Activity</h3>
              <div className="relative border-l border-border ml-3 space-y-6">
                {mockTrustData.timeline.map((item, idx) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="relative pl-6"
                  >
                    <div className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${
                      item.type === 'positive' ? 'bg-success' : 'bg-error'
                    }`} />
                    <div className="text-xs font-medium text-text-secondary mb-1">{item.date}</div>
                    <div className="text-sm text-text-primary font-medium leading-snug">{item.event}</div>
                  </motion.div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 border border-border hover:bg-light-gray text-text-primary rounded-lg transition-colors text-sm font-medium shadow-sm">
                View Full History
              </button>
            </div>

            <div className="bg-[#222222] rounded-lg shadow-sm p-8 text-white relative overflow-hidden">
              <ShieldCheck className="w-10 h-10 mb-5 text-success" />
              <h3 className="text-xl font-bold mb-2">Trust & Safety Hub</h3>
              <p className="text-light-gray text-sm mb-6 leading-relaxed">
                Learn how Forte protects both freelancers and clients through our comprehensive trust systems.
              </p>
              <button className="bg-[#e63946] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors w-full flex items-center justify-center gap-2 shadow-sm">
                Explore Policies
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
