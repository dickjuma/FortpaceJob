import React from "react";
import { 
  Users, 
  Briefcase, 
  CircleDollarSign, 
  Gavel, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap
} from "lucide-react";

// Modernized StatCard using our new aesthetic
const StatCard = ({ title, value, change, trend, icon: Icon, isDark = false }) => (
  <div className={`p-6 rounded-2xl border shadow-sm transition-all hover:scale-[1.02] ${
    isDark 
      ? 'bg-navy border-white/10 text-white' 
      : 'bg-white border-zinc-100 text-zinc-900'
  }`}>
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-2xl ${
        isDark ? 'bg-accent-purple/20 text-accent-purple' : 'bg-zinc-50 text-accent-purple'
      }`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
        trend === 'up' 
          ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600') 
          : (isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-50 text-rose-600')
      }`}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </div>
    </div>
    <div className="mt-5">
      <p className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
        {title}
      </p>
      <h3 className="text-3xl font-black mt-1 tracking-tight">{value}</h3>
    </div>
  </div>
);

// Modernized ActivityItem
const ActivityItem = ({ title, time, type, status }) => {
  const isDark = document.documentElement.classList.contains('dark');
  
  return (
    <div className="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-white/5 last:border-0 group cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/5 px-2 -mx-2 rounded-xl transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          type === 'user' ? 'bg-accent-purple/10 text-accent-purple' : 
          type === 'finance' ? 'bg-emerald-500/10 text-emerald-500' : 
          'bg-amber-500/10 text-amber-500'
        }`}>
          {type === 'user' ? <Users size={18} /> : type === 'finance' ? <CircleDollarSign size={18} /> : <Gavel size={18} />}
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-accent-purple transition-colors">{title}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{time}</p>
        </div>
      </div>
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter ${
        status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 
        status === 'pending' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' : 
        'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'
      }`}>
        {status}
      </span>
    </div>
  );
};

const Dashboard = () => {
  // Using dummy test data without relying on a backend
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">System Overview</h1>
          <p className="text-zinc-500 mt-1 font-medium">Real-time platform performance and governance metrics.</p>
        </div>
        <button className="hidden sm:flex items-center gap-2 bg-navy dark:bg-white text-white dark:text-navy px-5 py-2.5 rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-lg">
          <TrendingUp size={18} />
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value="12,482" 
          change="+14.2%" 
          trend="up" 
          icon={Users} 
          isDark={true}
        />
        <StatCard 
          title="Platform GTV" 
          value="$284.5k" 
          change="+28.4%" 
          trend="up" 
          icon={CircleDollarSign} 
        />
        <StatCard 
          title="Active Jobs" 
          value="842" 
          change="-2.1%" 
          trend="down" 
          icon={Briefcase} 
        />
        <StatCard 
          title="Open Disputes" 
          value="14" 
          change="+4" 
          trend="up" 
          icon={Gavel} 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Charts / Data Area */}
        <div className="xl:col-span-2 space-y-8">
          {/* System Health */}
          <div className="bg-white dark:bg-navy p-8 rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm relative overflow-hidden">
            {/* Background Blob for aesthetic */}
            <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-accent-purple/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
              <div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">System Health</h2>
                <p className="text-sm text-zinc-500 font-medium">Infrastructure and service status</p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-100 dark:border-emerald-500/20">
                <ShieldCheck size={18} />
                All Systems Operational
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
              {[
                { label: "Redis Cluster", status: "Healthy", ping: "4ms", icon: Zap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { label: "Escrow Ledger", status: "Synchronized", ping: "99.9%", icon: ShieldCheck, color: "text-accent-purple", bg: "bg-accent-purple/10" },
                { label: "Notification Queue", status: "Processing", ping: "12/m", icon: TrendingUp, color: "text-brand-500", bg: "bg-brand-500/10" }
              ].map((service) => (
                <div key={service.label} className="p-5 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 hover:border-zinc-200 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-xl ${service.bg} ${service.color}`}>
                      <service.icon size={18} />
                    </div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{service.label}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">{service.status}</span>
                    <span className="text-xs font-bold text-zinc-400">{service.ping}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Intelligence Visualization */}
          <div className="bg-navy p-8 rounded-[24px] text-white overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 to-transparent opacity-50 pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-black tracking-tight">Growth Intelligence</h2>
              <p className="text-zinc-400 text-sm mt-1 font-medium">Predictive analysis for the next quarter.</p>
              
              <div className="mt-12 flex items-end gap-2 h-40">
                {[40, 70, 45, 90, 65, 80, 55, 95, 75, 100].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-accent-purple/30 rounded-t-lg group-hover:bg-accent-purple/60 transition-all duration-700 ease-out relative cursor-crosshair"
                    style={{ height: `${h}%`, transitionDelay: `${i * 30}ms` }}
                  >
                    <div className="absolute -top-8 left-1/2 -tranzinc-x-1/2 bg-white text-navy text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      +{h}%
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between border-t border-white/10 pt-6 gap-6">
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-[10px] text-accent-purple uppercase font-bold tracking-widest mb-1">Est. Retention</p>
                    <p className="text-2xl font-black">94.2%</p>
                  </div>
                  <div className="w-px h-10 bg-white/10"></div>
                  <div>
                    <p className="text-[10px] text-accent-purple uppercase font-bold tracking-widest mb-1">Active SME's</p>
                    <p className="text-2xl font-black">1,248</p>
                  </div>
                </div>
                <button className="bg-white text-navy px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-colors shadow-lg">
                  Full Analytics Report
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/30 blur-[120px] rounded-full -tranzinc-y-1/2 tranzinc-x-1/2 pointer-events-none"></div>
          </div>
        </div>

        {/* Sidebar Activity */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-navy p-6 sm:p-8 rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">Governance Feed</h2>
              <button className="text-accent-purple text-xs font-bold hover:underline">View All</button>
            </div>
            <div className="space-y-1">
              <ActivityItem title="User verified: John Doe (SME)" time="2 mins ago" type="user" status="completed" />
              <ActivityItem title="Escrow Release: Project #842" time="15 mins ago" type="finance" status="completed" />
              <ActivityItem title="New Dispute: UI Design Contract" time="1 hour ago" type="dispute" status="pending" />
              <ActivityItem title="Payout failed: Flutterwave API" time="3 hours ago" type="finance" status="failed" />
              <ActivityItem title="Policy Update: Commission Fees" time="5 hours ago" type="user" status="completed" />
            </div>
          </div>

          <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 p-6 sm:p-8 rounded-[24px] relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <AlertTriangle size={120} />
            </div>
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-3 relative z-10">
              <div className="p-2 bg-rose-100 dark:bg-rose-500/20 rounded-xl">
                <AlertTriangle size={20} />
              </div>
              <h3 className="font-black tracking-tight">Security Alerts</h3>
            </div>
            <p className="text-sm text-rose-700/80 dark:text-rose-300/80 leading-relaxed font-medium mt-4 relative z-10">
              3 accounts flagged for multi-login anomalies in the last 24 hours. Immediate investigation required for Financial Module stability.
            </p>
            <button className="mt-6 w-full bg-rose-600 dark:bg-rose-500 text-white py-3 rounded-xl text-sm font-bold hover:bg-rose-700 dark:hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20 relative z-10">
              Investigate Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
