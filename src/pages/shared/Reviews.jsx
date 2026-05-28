import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, ShieldCheck, TrendingUp, Award,
  ThumbsUp, ThumbsDown, MessageSquare, Briefcase,
  CheckCircle2, Download
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// Mock Data
const ratingTrends = [
  { month: 'Jan', rating: 4.8 }, { month: 'Feb', rating: 4.9 },
  { month: 'Mar', rating: 4.7 }, { month: 'Apr', rating: 5.0 },
  { month: 'May', rating: 4.9 }, { month: 'Jun', rating: 5.0 }
];

const sentimentData = [
  { subject: 'Communication', A: 95, fullMark: 100 },
  { subject: 'Quality', A: 98, fullMark: 100 },
  { subject: 'Speed', A: 90, fullMark: 100 },
  { subject: 'Reliability', A: 99, fullMark: 100 },
  { subject: 'Expertise', A: 100, fullMark: 100 },
];

const reviewsList = [
  {
    id: 1,
    client: 'David L.',
    company: 'Fintech Solutions Inc.',
    avatar: 'D',
    rating: 5.0,
    date: 'Oct 15, 2026',
    contract: 'Frontend Dashboard Development',
    text: 'Incredible attention to detail and exceptionally fast delivery. The dashboard looks and performs exactly as requested. Communication was flawless throughout the entire process.',
    skills: ['React', 'TypeScript', 'UI Design'],
    verified: true
  },
  {
    id: 2,
    client: 'Sarah K.',
    company: 'HealthTech Startup',
    avatar: 'S',
    rating: 4.8,
    date: 'Sep 28, 2026',
    contract: 'Mobile App Architecture Review',
    text: 'Very knowledgeable and provided a comprehensive audit of our React Native app. Caught several performance bottlenecks we had missed.',
    skills: ['React Native', 'Architecture', 'Performance'],
    verified: true
  },
  {
    id: 3,
    client: 'Enterprise Corp',
    company: 'Enterprise Corp',
    avatar: 'E',
    rating: 5.0,
    date: 'Aug 10, 2026',
    contract: 'Full Stack SaaS MVP',
    text: 'A true professional. Managed the entire backend and frontend integration seamlessly. Highly recommended for complex SaaS applications.',
    skills: ['Node.js', 'React', 'System Design'],
    verified: true
  }
];

const ReviewsPage = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
            <Star className="w-8 h-8 text-amber-500 fill-amber-500" /> Reviews & Ratings
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">Track your marketplace reputation and client sentiment.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl font-bold hover:bg-surface dark:hover:bg-zinc-700 transition-colors shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Core Trust & Breakdown (Left Column) */}
        <div className="space-y-6">
          
          {/* Trust Score Hero Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-indigo-900 to-zinc-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/20 rounded-full blur-[60px] pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <ShieldCheck className="w-12 h-12 text-amber-400 mb-4" />
              <div className="text-sm font-bold uppercase tracking-widest text-zinc-300 mb-1">Global Trust Score</div>
              <div className="text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                99<span className="text-3xl text-zinc-400 font-medium">/100</span>
              </div>
              <div className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-amber-300 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Top Rated Plus
              </div>
            </div>
          </motion.div>

          {/* Rating Breakdown */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm"
          >
            <h3 className="font-bold text-lg mb-6">Rating Breakdown</h3>
            <div className="flex items-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-extrabold text-zinc-900 dark:text-white">4.9</div>
                <div className="flex gap-1 text-amber-500 my-1 justify-center">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <div className="text-xs font-semibold text-zinc-500">Based on 45 reviews</div>
              </div>
              
              <div className="flex-1 space-y-2">
                {[
                  { stars: 5, pct: 90 },
                  { stars: 4, pct: 8 },
                  { stars: 3, pct: 2 },
                  { stars: 2, pct: 0 },
                  { stars: 1, pct: 0 }
                ].map(row => (
                  <div key={row.stars} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-zinc-500 w-3">{row.stars}</span>
                    <Star className="w-3 h-3 text-zinc-400 fill-zinc-400 shrink-0" />
                    <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.pct}%` }} />
                    </div>
                    <span className="text-xs font-bold text-zinc-400 w-6 text-right">{row.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sentiment Radar Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm flex flex-col items-center"
          >
            <h3 className="font-bold text-lg mb-2 w-full text-left">Sentiment Analysis</h3>
            <p className="text-xs text-zinc-500 w-full text-left mb-4">AI-driven client feedback sentiment.</p>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={sentimentData}>
                  <PolarGrid stroke="#334155" opacity={0.2} />
                  <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} />
                  <Radar name="Sentiment" dataKey="A" stroke="#2563EB" fill="#3B82F6" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>

        {/* 2. Charts & Reviews List (Right Column) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Rating Trends Line Chart */}
          <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-600" /> Rating Trends
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ratingTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis domain={[4.0, 5.0]} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="rating" stroke="#F59E0B" strokeWidth={4} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 8}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Review Cards Feed */}
          <div className="bg-white dark:bg-zinc-800 rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-700 flex justify-between items-center bg-surface dark:bg-surface-dark/30">
              <h2 className="font-bold text-xl text-zinc-900 dark:text-white">Recent Client Reviews</h2>
              <select className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-semibold rounded-lg px-3 py-1.5 outline-none">
                <option>Newest First</option>
                <option>Highest Rated</option>
                <option>Lowest Rated</option>
              </select>
            </div>
            
            <div className="divide-y divide-zinc-100 dark:divide-zinc-700/50">
              {reviewsList.map((review) => (
                <div key={review.id} className="p-6 hover:bg-surface dark:hover:bg-zinc-800/30 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                        {review.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-zinc-900 dark:text-white text-lg">{review.client}</h4>
                          {review.verified && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded uppercase">
                              <CheckCircle2 className="w-3 h-3" /> Verified Client
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 font-medium">{review.company} • {review.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-zinc-300 fill-zinc-300'}`} />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-white">{review.rating}.0 Score</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-700/50 rounded-md text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-3 border border-zinc-200 dark:border-zinc-700">
                      <Briefcase className="w-3 h-3" /> {review.contract}
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 italic leading-relaxed">"{review.text}"</p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-700/50">
                    {review.skills.map(skill => (
                      <span key={skill} className="px-2 py-1 text-[10px] font-bold text-brand-600 bg-brand-50 dark:bg-brand-900/20 dark:text-brand-400 border border-brand-100 dark:border-brand-900/50 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-surface dark:bg-surface-dark/50 border-t border-zinc-200 dark:border-zinc-700 text-center">
              <button className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors">
                Load More Reviews
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
