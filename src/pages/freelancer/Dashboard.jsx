import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, Target, ShieldCheck, Zap, 
  Briefcase, Star, Clock, Bell, ChevronRight,
  TrendingUp, Award, Activity, Calendar, ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

const earningsData = [
  { name: 'Jan', amount: 2400 }, { name: 'Feb', amount: 1398 },
  { name: 'Mar', amount: 9800 }, { name: 'Apr', amount: 3908 },
  { name: 'May', amount: 4800 }, { name: 'Jun', amount: 3800 },
];

const proposalData = [
  { name: 'Sent', value: 45 }, { name: 'Viewed', value: 30 },
  { name: 'Interviewed', value: 12 }, { name: 'Hired', value: 5 }
];

const recommendedJobs = [
  { id: 1, title: 'Senior React Developer for Fintech Dashboard', budget: '$80/hr', match: 98, clientRating: 4.9, skills: ['React', 'TypeScript', 'Redux'] },
  { id: 2, title: 'Full Stack Node.js Backend API', budget: '$4,500', match: 95, clientRating: 5.0, skills: ['Node.js', 'Express', 'PostgreSQL'] },
  { id: 3, title: 'Figma UI/UX Design System', budget: '$60/hr', match: 91, clientRating: 4.7, skills: ['Figma', 'UI Design', 'Wireframing'] },
];

const FreelancerDashboard = () => {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & 1. Earnings Overview / 2. Ranking Score Card combined visually */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px]"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] -tranzinc-y-1/2 tranzinc-x-1/4 pointer-events-none" />
          
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">Good morning, Alex!</h1>
                <div className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Available
                </div>
              </div>
              <p className="text-zinc-400">You're in the top 3% of developers this month.</p>
            </div>
            <button className="hidden sm:block bg-white/10 hover:bg-white/20 border border-white/20 transition-colors px-4 py-2 rounded-xl text-sm font-semibold backdrop-blur-sm">
              Withdraw Funds
            </button>
          </div>

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <div className="text-sm text-zinc-400 mb-1 font-medium flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> Total Earned</div>
              <div className="text-2xl font-bold">$42,500</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <div className="text-sm text-zinc-400 mb-1 font-medium flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> Active Jobs</div>
              <div className="text-2xl font-bold">4</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <div className="text-sm text-zinc-400 mb-1 font-medium flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pending Clearance</div>
              <div className="text-2xl font-bold">$1,200</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <div className="text-sm text-zinc-400 mb-1 font-medium flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> Growth</div>
              <div className="text-2xl font-bold text-green-400">+12%</div>
            </div>
          </div>
        </motion.div>

        {/* Ranking Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm relative group overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <Award className="w-32 h-32" />
           </div>
           <h2 className="font-bold text-lg mb-6 relative z-10 flex items-center gap-2">
             <ShieldCheck className="w-5 h-5 text-brand-600 dark:text-brand-400" /> Rank & Reputation
           </h2>
           
           <div className="space-y-5 relative z-10">
             <div>
               <div className="flex justify-between text-sm mb-1 font-semibold">
                 <span>Marketplace Position</span>
                 <span className="text-brand-600 dark:text-brand-400">Top 3%</span>
               </div>
               <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                 <div className="h-full bg-brand-600 rounded-full w-[97%]" />
               </div>
             </div>
             
             <div>
               <div className="flex justify-between text-sm mb-1 font-semibold">
                 <span>Trust Score</span>
                 <span className="text-green-600">99/100</span>
               </div>
               <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                 <div className="h-full bg-green-500 rounded-full w-[99%]" />
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-700">
               <div>
                 <div className="text-xs text-zinc-500 font-medium">Job Success</div>
                 <div className="text-lg font-bold">100%</div>
               </div>
               <div>
                 <div className="text-xs text-zinc-500 font-medium">Response Rate</div>
                 <div className="text-lg font-bold">&lt; 1 hr</div>
               </div>
             </div>
           </div>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        <div className="xl:col-span-2 space-y-6">
          {/* 8. Performance Charts */}
          <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg text-zinc-900 dark:text-white">Earnings Analytics</h2>
              <select className="bg-surface dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 text-sm font-medium rounded-lg px-3 py-1.5 outline-none">
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(value) => `$${value}`} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* 5. Active Contracts */}
             <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl shadow-sm p-6">
               <div className="flex justify-between items-center mb-4">
                 <h2 className="font-bold text-lg">Active Contracts</h2>
                 <button className="text-sm text-brand-600 font-medium">View All</button>
               </div>
               <div className="space-y-4">
                 {[1, 2].map(i => (
                   <div key={i} className="p-4 border border-zinc-100 dark:border-zinc-700 rounded-2xl bg-surface dark:bg-surface-dark/50 hover:border-brand-200 dark:hover:border-brand-800 transition-colors">
                     <h4 className="font-semibold text-sm mb-1 text-zinc-900 dark:text-white line-clamp-1">Frontend Dashboard Build</h4>
                     <p className="text-xs text-zinc-500 mb-3">Client: Enterprise Corp</p>
                     <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden mb-2">
                       <div className="h-full bg-brand-600 w-2/3" />
                     </div>
                     <div className="flex justify-between text-xs font-semibold">
                       <span className="text-zinc-500">Milestone 2/3</span>
                       <span className="text-brand-600">$1,500</span>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             {/* 4. Proposal Tracker & 7. Skill Analytics combined visually */}
             <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl shadow-sm p-6">
               <h2 className="font-bold text-lg mb-4">Proposal Win Rate</h2>
               <div className="h-40 mb-4">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={proposalData} layout="vertical" margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} width={80} />
                     <Tooltip cursor={{fill: 'transparent'}} />
                     <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                       {proposalData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={index === 3 ? '#10B981' : index === 2 ? '#3B82F6' : '#94A3B8'} />
                       ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
               
               <div className="pt-4 border-t border-zinc-100 dark:border-zinc-700">
                 <h3 className="font-semibold text-sm mb-3">Top Performing Skills</h3>
                 <div className="flex flex-wrap gap-2">
                   <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-700 text-xs font-bold rounded-md">React (95%)</span>
                   <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-700 text-xs font-bold rounded-md">Node.js (88%)</span>
                   <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-700 text-xs font-bold rounded-md">UI Design (82%)</span>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* 3. Recommended Jobs */}
          <div className="bg-gradient-to-b from-blue-50 to-white dark:from-zinc-800 dark:to-zinc-900 border border-brand-100 dark:border-zinc-700 rounded-3xl shadow-sm p-6 flex flex-col h-full max-h-[500px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl text-zinc-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> Matches For You
              </h2>
            </div>
            
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
              {recommendedJobs.map((job) => (
                <div key={job.id} className="p-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white group-hover:text-brand-600 transition-colors line-clamp-2 pr-2">{job.title}</h4>
                    <div className="text-xs font-extrabold text-green-600 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded shrink-0">{job.match}%</div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-3">
                    <span className="text-zinc-900 dark:text-white font-bold">{job.budget}</span>
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {job.clientRating}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.skills.map(s => <span key={s} className="px-2 py-1 bg-surface dark:bg-surface-dark text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 rounded-md border border-zinc-200 dark:border-zinc-700">{s}</span>)}
                  </div>
                  
                  <button className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl transition-colors">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 9. Upcoming Deadlines & 10. Notifications */}
          <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl shadow-sm p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zinc-400" /> Schedule & Alerts
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl text-amber-900 dark:text-amber-200">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="block mb-0.5">Deadline Approaching</strong>
                  Frontend Dashboard Build - Milestone 2 is due tomorrow at 5:00 PM EST.
                </div>
              </div>
            </div>

            <h3 className="font-semibold text-sm mb-3">Recent Notifications</h3>
            <div className="space-y-3">
              {[
                { title: 'Payment Released', time: '2 hours ago', icon: CheckCircle2, color: 'text-green-500' },
                { title: 'New message from Enterprise Corp', time: '5 hours ago', icon: Bell, color: 'text-brand-500' }
              ].map((n, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className={`w-8 h-8 rounded-full bg-surface dark:bg-surface-dark flex items-center justify-center shrink-0`}>
                    <n.icon className={`w-4 h-4 ${n.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{n.title}</p>
                    <p className="text-xs text-zinc-500">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
