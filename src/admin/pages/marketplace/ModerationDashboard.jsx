import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Users, 
  DollarSign, 
  UserX, 
  Clock,
  TrendingUp,
  Search,
  Bell,
  Calendar,
  Activity,
  ChevronRight,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line
} from 'recharts';

// Mock Data for Analytics
const FRAUD_TRENDS = [
  { name: 'Mon', AI: 400, Human: 240 },
  { name: 'Tue', AI: 300, Human: 139 },
  { name: 'Wed', AI: 200, Human: 980 },
  { name: 'Thu', AI: 278, Human: 390 },
  { name: 'Fri', AI: 189, Human: 480 },
  { name: 'Sat', AI: 239, Human: 380 },
  { name: 'Sun', AI: 349, Human: 430 },
];

const RISK_TIMELINE = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  jobs: Math.floor(Math.random() * 40) + 10,
  users: Math.floor(Math.random() * 60) + 20,
  transactions: Math.floor(Math.random() * 30) + 5,
  chat: Math.floor(Math.random() * 80) + 20
}));

const FRAUD_CATEGORIES = [
  { name: 'Payment Fraud', value: 400, color: '#ef4444' },
  { name: 'Fake Jobs', value: 300, color: '#f59e0b' },
  { name: 'Identity Impersonation', value: 300, color: '#6366f1' },
  { name: 'Spam Proposals', value: 200, color: '#3b82f6' },
  { name: 'Chat Abuse', value: 100, color: '#10b981' },
];

const ESCROW_RISK = [
  { date: '05/01', held: 4000, risk: 2400, safe: 2400 },
  { date: '05/02', held: 3000, risk: 1398, safe: 2210 },
  { date: '05/03', held: 2000, risk: 9800, safe: 2290 },
  { date: '05/04', held: 2780, risk: 3908, safe: 2000 },
  { date: '05/05', held: 1890, risk: 4800, safe: 2181 },
  { date: '05/06', held: 2390, risk: 3800, safe: 2500 },
];

/**
 * Marketplace Moderation Analytics Dashboard
 * A mission-critical Command Center for Trust & Safety operations.
 */
const ModerationDashboard = () => {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [systemStatus, setSystemStatus] = useState('active');

  const kpis = [
    { label: 'Active Risk Cases', value: '142', trend: '+12%', icon: AlertTriangle, color: 'warning', border: 'border-amber-500' },
    { label: 'Critical Fraud Alerts', value: '28', trend: '+4%', icon: ShieldAlert, color: 'danger', border: 'border-red-500' },
    { label: 'Flagged Users', value: '854', trend: '-2%', icon: Users, color: 'warning', border: 'border-amber-500' },
    { label: 'Escrow Holds', value: '$42,105', trend: '+18%', icon: DollarSign, color: 'danger', border: 'border-red-500' },
    { label: 'Suspended Accounts', value: '1,204', trend: '+1%', icon: UserX, color: 'neutral', border: 'border-zinc-500' },
    { label: 'Pending Reviews', value: '312', trend: '-8%', icon: Clock, color: 'info', border: 'border-brand-500' },
  ];

  return (
    <div className="space-y-8 pb-20 overflow-x-hidden">
      
      {/* 1. KPI CARDS - TOP ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        {kpis.map((kpi, idx) => (
          <div 
            key={idx}
            className={cn(
              "bg-white dark:bg-surface-dark p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer animate-in fade-in slide-in-from-bottom-2",
              kpi.border
            )}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn(
                "p-2 rounded-lg",
                kpi.color === 'danger' ? "bg-red-500/10 text-red-500" :
                kpi.color === 'warning' ? "bg-amber-500/10 text-amber-500" :
                kpi.color === 'info' ? "bg-brand-500/10 text-brand-500" : "bg-zinc-500/10 text-zinc-500"
              )}>
                <kpi.icon size={18} />
              </div>
              <div className={cn(
                "text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-1",
                kpi.trend.startsWith('+') ? "bg-success/10 text-success" : "bg-red-500/10 text-red-500"
              )}>
                {kpi.trend.startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {kpi.trend}
              </div>
            </div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{kpi.label}</p>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white leading-none tracking-tight">{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* 2. MAIN GRID - HEATMAP & FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* CENTER COLUMN: HEATMAP & CHARTS */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* RISK HEATMAP */}
          <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden relative group">
             <div className="flex items-center justify-between mb-6">
                <div>
                   <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2 tracking-tight">
                      <Activity size={20} className="text-brand-500" />
                      Platform Risk Heatmap
                   </h3>
                   <p className="text-xs text-zinc-500 font-medium">Spike detection and anomaly clusters across last 24h</p>
                </div>
                <div className="flex items-center gap-2">
                   <button className="px-3 py-1 bg-brand-500 text-white text-[10px] font-black rounded uppercase">24h</button>
                   <button className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-black rounded uppercase">7D</button>
                </div>
             </div>

             <div className="h-[250px] w-full mt-4">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={RISK_TIMELINE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                   <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                     itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                   />
                   <Line type="monotone" dataKey="jobs" name="Jobs" stroke="#f59e0b" strokeWidth={3} dot={false} />
                   <Line type="monotone" dataKey="users" name="Users" stroke="#3b82f6" strokeWidth={3} dot={false} />
                   <Line type="monotone" dataKey="transactions" name="Transactions" stroke="#10b981" strokeWidth={3} dot={false} />
                   <Line type="monotone" dataKey="chat" name="Chat" stroke="#ef4444" strokeWidth={3} dot={false} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
             
             <div className="mt-6 flex justify-end gap-6 items-center">
                <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase">
                   <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Jobs</div>
                   <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Users</div>
                   <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#10b981]" /> Transactions</div>
                   <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#ef4444]" /> Chat</div>
                </div>
             </div>
          </div>

          {/* FRAUD TRENDS CHARTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             
             {/* A. Fraud Attempts Over Time */}
             <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center justify-between">
                   Enforcement Trend
                   <TrendingUp size={14} className="text-brand-500" />
                </h4>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={FRAUD_TRENDS}>
                      <defs>
                        <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                        itemStyle={{ fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="AI" stroke="#6366f1" fillOpacity={1} fill="url(#colorAI)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>

             {/* B. Top Fraud Categories */}
             <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Attack Vectors</h4>
                <div className="h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={FRAUD_CATEGORIES}
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {FRAUD_CATEGORIES.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center">
                     <span className="text-xl font-bold text-zinc-900 dark:text-white">42%</span>
                     <span className="text-[8px] text-zinc-500 uppercase font-black">Payments</span>
                  </div>
                </div>
             </div>

             {/* C. Escrow Risk Exposure */}
             <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Capital Exposure</h4>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ESCROW_RISK}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                      <Bar dataKey="held" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="risk" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>

          </div>

        </div>

        {/* RIGHT COLUMN: REAL-TIME FEED */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col h-[700px] sticky top-24">
           <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                 Live Moderation Feed
              </h3>
              <div className="flex items-center gap-2">
                 <span className="text-[9px] font-bold text-zinc-500">14 new</span>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {[
                { score: 87, id: 'U4821', role: 'Client', event: 'Job Posted', decision: 'BLOCK', time: '2s ago' },
                { score: 42, id: 'U0093', role: 'FL', event: 'Message Sent', decision: 'FLAG', time: '8s ago' },
                { score: 94, id: 'U1152', role: 'Client', event: 'Withdrawal', decision: 'ESCALATE', time: '14s ago' },
                { score: 21, id: 'U8830', role: 'FL', event: 'Profile Update', decision: 'ALLOW', time: '1m ago' },
                { score: 78, id: 'U3321', role: 'Client', event: 'Bulk Proposals', decision: 'BLOCK', time: '2m ago' },
                { score: 65, id: 'U5540', role: 'FL', event: 'Payment Link', decision: 'FLAG', time: '3m ago' },
              ].map((ev, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "p-3 rounded-xl bg-surface dark:bg-surface-dark/50 border border-zinc-200 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group cursor-pointer",
                    ev.score >= 80 && "border-red-500/30 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5"
                  )}
                >
                   <div className="flex items-center justify-between mb-2">
                      <div className={cn(
                        "text-[10px] font-['DM_Mono'] px-2 py-0.5 rounded font-black",
                        ev.score >= 80 ? "bg-red-500 text-white" :
                        ev.score >= 60 ? "bg-orange-500 text-white" :
                        ev.score >= 40 ? "bg-amber-500 text-white" : "bg-success text-white"
                      )}>
                        {ev.score}
                      </div>
                      <span className="text-[10px] font-['DM_Mono'] text-zinc-500">{ev.id}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                         <p className="text-[11px] font-bold text-zinc-900 dark:text-white leading-none">{ev.event}</p>
                         <p className="text-[9px] font-medium text-zinc-500">{ev.role} • {ev.time}</p>
                      </div>
                      <div className={cn(
                        "text-[9px] font-black px-1.5 py-0.5 rounded",
                        ev.decision === 'BLOCK' ? "bg-red-500/10 text-red-500" :
                        ev.decision === 'FLAG' ? "bg-amber-500/10 text-amber-500" :
                        ev.decision === 'ESCALATE' ? "bg-brand-500/10 text-brand-500" : "bg-success/10 text-success"
                      )}>
                        {ev.decision}
                      </div>
                   </div>
                   
                   <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="flex-1 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-[9px] font-black uppercase transition-colors">View</button>
                      <button className="flex-1 py-1.5 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 rounded-lg text-[9px] font-black uppercase transition-colors">Block</button>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-surface dark:bg-surface-dark/50 rounded-b-3xl">
              <button className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-white text-[10px] font-black uppercase rounded-lg shadow-lg shadow-indigo-500/20 transition-all">
                 View Full Queue
              </button>
           </div>
        </div>

      </div>

      {/* 3. SYSTEM INTELLIGENCE FOOTER */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
         {[
           { label: 'AI Throughput', value: '1,240 /min', sub: 'Healthy' },
           { label: 'Avg Response', value: '142ms', sub: '99th ptl' },
           { label: 'False Positive', value: '3.2%', sub: 'Target: <5%' },
           { label: 'Escalation', value: '8.1%', sub: '+1.2% pts' },
           { label: 'Active Clusters', value: '4', sub: 'In review' },
         ].map((stat, i) => (
           <div key={i} className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">{stat.value}</h4>
              <p className="text-[9px] font-bold text-brand-500/80 mt-1 uppercase">{stat.sub}</p>
           </div>
         ))}
      </div>

    </div>
  );
};

export default ModerationDashboard;
