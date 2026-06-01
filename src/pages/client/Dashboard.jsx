import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Briefcase, FileText, 
  Search, Bell, ArrowRight, MoreHorizontal,
  Star, Clock, Calendar as CalendarIcon, CheckCircle2,
  AlertCircle, ChevronLeft, ChevronRight, Zap, Download, DollarSign
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// Mock Data
const spendData = [
  { name: 'Week 1', total: 1200 }, { name: 'Week 2', total: 2100 },
  { name: 'Week 3', total: 1800 }, { name: 'Week 4', total: 3400 },
];

const activeProjects = [
  { id: 1, name: 'E-commerce Redesign', freelancer: 'Alex D.', role: 'UI/UX', progress: 75, status: 'On Track', amount: '$4,500' },
  { id: 2, name: 'Mobile App Backend', freelancer: 'Sarah K.', role: 'Node.js', progress: 40, status: 'At Risk', amount: '$8,200' },
  { id: 3, name: 'SEO Optimization', freelancer: 'Mike R.', role: 'Marketing', progress: 90, status: 'Review', amount: '$1,200' },
  { id: 4, name: 'Smart Contract Audit', freelancer: 'Elena T.', role: 'Web3', progress: 15, status: 'On Track', amount: '$12,000' },
];

const suggestedFreelancers = [
  { id: 1, name: 'Jessica W.', title: 'Senior React Engineer', rating: 4.9, match: 98, rate: '$85/hr', skills: ['React', 'TypeScript', 'Next.js'] },
  { id: 2, name: 'David L.', title: 'Product Designer', rating: 5.0, match: 95, rate: '$65/hr', skills: ['Figma', 'UI/UX', 'Prototyping'] },
  { id: 3, name: 'Anna M.', title: 'DevOps Specialist', rating: 4.8, match: 92, rate: '$95/hr', skills: ['AWS', 'Docker', 'CI/CD'] },
];

const timeline = [
  { time: '10:30 AM', title: 'Milestone Approved', desc: 'E-commerce Redesign - Phase 1', type: 'success' },
  { time: '09:15 AM', title: 'New Proposal Received', desc: 'From David L. for Mobile App', type: 'info' },
  { time: 'Yesterday', title: 'Payment Released', desc: '$1,200 to Mike R.', type: 'payment' },
];

const ClientDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Welcome Banner & 10. AI Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-[#118a00] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -tranzinc-y-1/2 tranzinc-x-1/2" />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, Enterprise Corp!</h1>
            <p className="text-[#14a800] mb-6 max-w-lg">Your team is moving fast. You have 3 pending approvals and 2 new proposals matching your open jobs.</p>
            <div className="flex gap-4">
              <button className="bg-white text-[#14a800] px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:-tranzinc-y-0.5">
                Post New Job
              </button>
              <button className="bg-[#14a800]/30 border border-[#14a800]/20/50 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#14a800]/50 transition-all">
                Review Approvals
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm relative overflow-hidden group"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-white">AI Market Insight</h3>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
            Demand for <strong className="text-zinc-900 dark:text-white">Web3 Developers</strong> has increased by 15% this week. Consider locking in contracts now to secure current rates.
          </p>
          <button className="text-sm font-semibold text-[#14a800] dark:text-[#14a800] flex items-center gap-1 group-hover:gap-2 transition-all">
            View full report <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Spend (30d)', value: '$24,500', trend: '+12%', icon: TrendingUp, color: 'text-[#14a800]', bg: 'bg-[#14a800]/5 dark:bg-[#14a800]/10' },
          { label: 'Active Contracts', value: '12', trend: 'Stable', icon: Briefcase, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-500/10' },
          { label: 'Open Jobs', value: '4', trend: '2 new today', icon: FileText, color: 'text-[#14a800]', bg: 'bg-[#14a800]/5 dark:bg-[#14a800]/10' },
          { label: 'Total Freelancers', value: '45', trend: 'Top 5% client', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' }
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + (i * 0.05) }} 
            className="bg-white dark:bg-zinc-800 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow cursor-default"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-md">{stat.trend}</span>
            </div>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* 3. Active Projects Table */}
        <div className="xl:col-span-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="font-bold text-xl text-zinc-900 dark:text-white">Active Projects</h2>
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
              <input type="text" placeholder="Search projects..." className="w-full sm:w-64 pl-9 pr-4 py-2 bg-surface dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-[#14a800] outline-none" />
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface dark:bg-surface-dark/50 text-zinc-500 dark:text-zinc-400 font-medium border-b border-zinc-200 dark:border-zinc-700">
                <tr>
                  <th className="px-6 py-4 cursor-pointer hover:text-zinc-800 dark:hover:text-white">Project Name</th>
                  <th className="px-6 py-4">Freelancer</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {activeProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-surface dark:hover:bg-zinc-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-900 dark:text-white">{project.name}</div>
                      <div className="text-xs text-zinc-500">{project.role}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#14a800]/10 dark:bg-[#14a800] flex items-center justify-center text-xs font-bold text-[#14a800] dark:text-[#14a800]">
                          {project.freelancer[0]}
                        </div>
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{project.freelancer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#14a800] rounded-full" style={{ width: `${project.progress}%` }} />
                        </div>
                        <span className="text-xs font-medium text-zinc-500">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        project.status === 'On Track' ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
                        project.status === 'At Risk' ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
                        'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-zinc-900 dark:text-white">
                      {project.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
            <span className="text-sm text-zinc-500">Showing 1 to 4 of 12 entries</span>
            <div className="flex gap-1">
              <button className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-surface dark:hover:bg-zinc-800 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-[#14a800]/5 dark:bg-[#14a800]/30 text-[#14a800] font-medium text-sm w-9">1</button>
              <button className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-surface dark:hover:bg-zinc-800 font-medium text-sm w-9">2</button>
              <button className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-surface dark:hover:bg-zinc-800"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* 5. Suggested Freelancers */}
        <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-xl text-zinc-900 dark:text-white">Top Matches</h2>
            <button className="text-[#14a800] hover:text-[#14a800] p-1"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4 flex-1">
            {suggestedFreelancers.map((freelancer) => (
              <div key={freelancer.id} className="p-4 border border-zinc-100 dark:border-zinc-700/50 rounded-2xl hover:border-[#14a800]/20 dark:hover:border-[#14a800]/20 transition-colors group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-#14a800] to-[#118a00] flex items-center justify-center text-white font-bold shadow-md">
                      {freelancer.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white group-hover:text-[#14a800] transition-colors">{freelancer.name}</h4>
                      <p className="text-xs text-zinc-500">{freelancer.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-green-600 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded text-center mb-1">{freelancer.match}% Match</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {freelancer.skills.map(s => <span key={s} className="px-2 py-1 bg-surface dark:bg-surface-dark text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 rounded-md border border-zinc-200 dark:border-zinc-700">{s}</span>)}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-zinc-100 dark:border-zinc-700/50">
                  <div className="flex items-center gap-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {freelancer.rating}
                    <span className="text-zinc-400 mx-1">•</span> {freelancer.rate}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 text-zinc-400 hover:text-[#14a800] hover:bg-[#14a800]/5 dark:hover:bg-[#14a800]/30 rounded-lg transition-colors"><Star className="w-4 h-4" /></button>
                    <button className="px-3 py-1.5 bg-surface-dark dark:bg-white text-white dark:text-zinc-900 text-xs font-bold rounded-lg hover:opacity-90 transition-opacity">Hire</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 text-sm font-semibold text-[#14a800] bg-[#14a800]/5 dark:bg-[#14a800]/10 hover:bg-[#14a800]/10 dark:hover:bg-[#14a800]/20 rounded-xl transition-colors">
            View All Recommendations
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* 4. Pending Contracts & 6. Recent Payments */}
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Pending Contracts */}
           <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl shadow-sm p-6">
             <h2 className="font-bold text-lg mb-4 flex items-center justify-between">Pending Contracts <span className="w-6 h-6 bg-[#14a800]/10 dark:bg-[#14a800]/30 text-[#14a800] rounded-full flex items-center justify-center text-xs">2</span></h2>
             <div className="space-y-3">
               {[1, 2].map(i => (
                 <div key={i} className="p-3 border border-zinc-100 dark:border-zinc-700 rounded-xl bg-surface dark:bg-surface-dark/50">
                   <h4 className="font-semibold text-sm mb-1 text-zinc-900 dark:text-white">API Integration Module</h4>
                   <p className="text-xs text-zinc-500 mb-3">Awaiting signature from John Doe</p>
                   <div className="flex gap-2">
                     <button className="flex-1 py-1.5 text-xs font-semibold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded shadow-sm hover:bg-surface dark:hover:bg-zinc-700">Review</button>
                     <button className="flex-1 py-1.5 text-xs font-semibold bg-[#14a800] text-white rounded shadow-sm hover:bg-[#118a00]">Remind</button>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           {/* Recent Payments */}
           <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl shadow-sm p-6">
             <div className="flex justify-between items-center mb-4">
               <h2 className="font-bold text-lg">Recent Payments</h2>
               <button className="text-zinc-400 hover:text-[#14a800]"><Download className="w-4 h-4" /></button>
             </div>
             <div className="space-y-4">
               {[
                 { to: 'Alex D.', amount: '$1,200', date: 'Today, 10:00 AM', status: 'Completed' },
                 { to: 'Figma Pro', amount: '$45', date: 'Yesterday', status: 'Completed' },
                 { to: 'Elena T.', amount: '$3,000', date: 'Oct 12', status: 'Processing' }
               ].map((p, i) => (
                 <div key={i} className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
                       <DollarSign className="w-4 h-4 text-zinc-500" />
                     </div>
                     <div>
                       <div className="font-semibold text-sm text-zinc-900 dark:text-white">{p.to}</div>
                       <div className="text-[10px] text-zinc-500">{p.date}</div>
                     </div>
                   </div>
                   <div className="text-right">
                     <div className="font-bold text-sm text-zinc-900 dark:text-white">{p.amount}</div>
                     <div className={`text-[10px] font-semibold ${p.status === 'Completed' ? 'text-green-600' : 'text-amber-500'}`}>{p.status}</div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* 7. Activity Timeline */}
        <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl shadow-sm p-6">
          <h2 className="font-bold text-lg mb-6">Activity Timeline</h2>
          <div className="relative pl-4 border-l-2 border-zinc-100 dark:border-zinc-700 space-y-6">
            {timeline.map((item, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 border-white dark:border-zinc-800 ${
                  item.type === 'success' ? 'bg-green-500' : item.type === 'info' ? 'bg-[#14a800]' : 'bg-amber-500'
                }`} />
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">{item.time}</div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">{item.title}</h4>
                <p className="text-xs text-zinc-500 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Calendar & 9. Notifications */}
        <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-zinc-400" />
            <h2 className="font-bold text-lg text-zinc-900 dark:text-white">Upcoming</h2>
          </div>
          <div className="mb-6 p-4 bg-surface dark:bg-surface-dark rounded-xl border border-zinc-100 dark:border-zinc-700/50 text-center">
             <div className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Oct 24, Friday</div>
             <div className="text-xs text-zinc-500">2 Milestones Due</div>
          </div>
          
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-zinc-400" /> Alerts
          </h2>
          <div className="space-y-3 flex-1">
             <div className="flex gap-3 p-3 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-200 rounded-xl border border-red-100 dark:border-red-900/30">
               <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
               <div className="text-xs">
                 <strong className="block mb-0.5">Budget Alert</strong>
                 Project "Mobile App" is nearing 90% of allocated escrow budget.
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClientDashboard;
