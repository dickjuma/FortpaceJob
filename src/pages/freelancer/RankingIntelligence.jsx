import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Award, ShieldCheck, Zap, 
  Target, Crosshair, Sparkles, Activity, Eye, Users
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, Cell
} from 'recharts';

// Mock Data
const rankingTrends = [
  { month: 'Jan', rank: 75, percentile: 60 },
  { month: 'Feb', rank: 78, percentile: 65 },
  { month: 'Mar', rank: 82, percentile: 72 },
  { month: 'Apr', rank: 88, percentile: 85 },
  { month: 'May', rank: 94, percentile: 92 },
  { month: 'Jun', rank: 98, percentile: 97 }
];

const skillDemandData = [
  { skill: 'React', demand: 98 },
  { skill: 'Node.js', demand: 85 },
  { skill: 'TypeScript', demand: 92 },
  { skill: 'GraphQL', demand: 75 },
  { skill: 'Next.js', demand: 88 }
];

const matchAnalytics = [
  { subject: 'Technical', A: 95, fullMark: 100 },
  { subject: 'Communication', A: 85, fullMark: 100 },
  { subject: 'Reliability', A: 99, fullMark: 100 },
  { subject: 'Speed', A: 90, fullMark: 100 },
  { subject: 'Value', A: 92, fullMark: 100 },
];

const RankingIntelligence = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-3 text-zinc-900 dark:text-white">
            <Zap className="w-8 h-8 text-[#14a800] fill-#14a800]/50" /> Ranking Intelligence
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">AI-powered analysis of your marketplace positioning and competition.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-[#14a800] hover:bg-[#118a00] text-white rounded-xl font-bold shadow-lg shadow-[#14a800]/25 transition-all flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Optimize Profile
          </button>
        </div>
      </div>

      {/* 1. Core Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Global Ranking', value: 'Top 3%', icon: Award, color: 'text-[#14a800]', bg: 'bg-[#14a800]/10' },
          { label: 'Trust Score', value: '99/100', icon: ShieldCheck, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Skill Mastery', value: 'Elite', icon: Target, color: 'text-[#14a800]', bg: 'bg-[#14a800]/10' },
          { label: 'Market Visibility', value: 'High', icon: Eye, color: 'text-amber-400', bg: 'bg-amber-500/10' }
        ].map((score, i) => (
          <motion.div 
            key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-surface-dark rounded-3xl p-6 border border-zinc-800 shadow-2xl relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] ${score.bg} -tranzinc-y-1/2 tranzinc-x-1/2`} />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`w-10 h-10 rounded-xl ${score.bg} flex items-center justify-center`}>
                <score.icon className={`w-5 h-5 ${score.color}`} />
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-extrabold text-white mb-1 tracking-tight">{score.value}</div>
              <div className="text-sm font-semibold text-zinc-400">{score.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* 2. Ranking Trends Chart */}
        <div className="xl:col-span-2 bg-surface-dark rounded-3xl p-6 md:p-8 border border-zinc-800 shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#14a800]/5 blur-[100px] pointer-events-none" />
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h2 className="font-bold text-xl text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#14a800]" /> Ranking Trajectory
              </h2>
              <p className="text-xs text-zinc-400 mt-1">Your marketplace percentile progression over time.</p>
            </div>
          </div>
          <div className="h-[300px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rankingTrends} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRank" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0F172A', color: '#fff' }} 
                  itemStyle={{ color: '#818CF8' }}
                />
                <Area type="monotone" dataKey="percentile" stroke="#818CF8" strokeWidth={3} fillOpacity={1} fill="url(#colorRank)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Match Analytics Radar */}
        <div className="bg-surface-dark rounded-3xl p-6 border border-zinc-800 shadow-2xl flex flex-col items-center relative overflow-hidden">
          <h2 className="font-bold text-xl text-white mb-2 w-full text-left flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-[#14a800]" /> Match Analytics
          </h2>
          <p className="text-xs text-zinc-400 w-full text-left mb-4">Algorithm assessment of your profile compatibility against top-tier clients.</p>
          <div className="w-full h-[250px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={matchAnalytics}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 600}} />
                <Radar name="Match Quality" dataKey="A" stroke="#60A5FA" strokeWidth={2} fill="#3B82F6" fillOpacity={0.3} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* 4. Skill Demand Charts */}
        <div className="bg-surface-dark rounded-3xl p-6 border border-zinc-800 shadow-2xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-xl text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" /> Skill Demand Index
              </h2>
              <p className="text-xs text-zinc-400 mt-1">Marketplace demand vs your verified capabilities.</p>
            </div>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillDemandData} layout="vertical" margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="skill" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8', fontWeight: 600}} width={80} />
                <Tooltip cursor={{fill: '#1E293B'}} contentStyle={{ borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: '#fff' }} />
                <Bar dataKey="demand" radius={[0, 4, 4, 0]} barSize={20}>
                  {skillDemandData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.demand > 90 ? '#10B981' : entry.demand > 80 ? '#3B82F6' : '#6366F1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Competition Analysis */}
        <div className="bg-surface-dark rounded-3xl p-6 border border-zinc-800 shadow-2xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />
          <h2 className="font-bold text-xl text-white mb-2 flex items-center gap-2 relative z-10">
            <Users className="w-5 h-5 text-rose-400" /> Competition Analysis
          </h2>
          <p className="text-xs text-zinc-400 mb-6 relative z-10">Insights on competing freelancers in your primary category (Frontend Development).</p>
          
          <div className="space-y-4 relative z-10">
            <div className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white mb-1">Average Hourly Rate</div>
                <div className="text-xs text-zinc-400">Top 10% competitors</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold text-[#14a800]">$95.00</div>
                <div className="text-[10px] font-bold text-green-400">+5% vs last month</div>
              </div>
            </div>

            <div className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white mb-1">Average Proposal Response</div>
                <div className="text-xs text-zinc-400">Time to first client reply</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold text-[#14a800]">1.2 hrs</div>
                <div className="text-[10px] font-bold text-rose-400">You are faster by 15m</div>
              </div>
            </div>

            <div className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Suggested Actions
              </h4>
              <ul className="space-y-2 text-xs text-zinc-300 font-medium">
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#14a800] before:rounded-full">Update portfolio with a Next.js project.</li>
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#14a800] before:rounded-full">Increase hourly rate to $90/hr.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default RankingIntelligence;
