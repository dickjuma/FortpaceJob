// src/components/findWork/performance/Analytics.jsx
import React from "react";
import { 
  TrendingUp, ArrowUpRight, ArrowDownRight, Info, Eye, 
  DollarSign, CheckCircle, Percent, Wallet, BarChart2, ShieldCheck
} from "lucide-react";

// Individual Stat Card
function Stat({ label, value, trend, isPositive, icon }) {
  return (
    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#B7E2BF] transition-all duration-500 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${isPositive ? 'bg-[#B7E2BF]/10 text-[#4A312F]' : 'bg-red-50 text-red-500'}`}>
          {icon}
        </div>
        <div className={`flex items-center text-xs font-black ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {trend}%
        </div>
      </div>
      <div>
        <p className="text-3xl font-black text-black tracking-tighter mb-1">{value}</p>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
}

// Performance Metric with "Level Progress"
function LevelMetric({ label, percentage, colorClass }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
        <span className={`text-sm font-black ${colorClass}`}>{percentage}%</span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${colorClass.replace('text', 'bg')}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

export default function Analytics() {
  const stats = [
    { label: "Gig Impressions", value: "12,405", trend: 15.2, isPositive: true, icon: <Eye size={20} /> },
    { label: "Conversion", value: "3.2%", trend: 1.1, isPositive: true, icon: <Percent size={20} /> },
    { label: "Avg. Sale Price", value: "$142", trend: 4.5, isPositive: true, icon: <DollarSign size={20} /> },
  ];

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Financial Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#4A312F] p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-[#4A312F]/30">
          <div className="relative z-10 flex flex-col md:flex-row justify-between h-full gap-8">
            <div>
              <div className="flex items-center gap-2 text-[#B7E2BF] mb-4">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Seller Earnings</span>
              </div>
              <h2 className="text-4xl font-black tracking-tight mb-2">Financial Hub</h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Net income after fees</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-12">
              <div>
                <p className="text-[10px] uppercase font-black text-[#B7E2BF] tracking-widest mb-2">Available Now</p>
                <p className="text-5xl font-black tracking-tighter">$2,840<span className="text-xl text-gray-500">.00</span></p>
              </div>
              <div className="border-l border-white/10 pl-10">
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">In Pipeline</p>
                <p className="text-3xl font-black text-gray-300 tracking-tighter">$1,150<span className="text-lg">.00</span></p>
              </div>
            </div>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Quick Actions (Sidebar style) */}
        <div className="lg:col-span-4 bg-white border border-gray-100 rounded-[3rem] p-10 flex flex-col justify-center space-y-6 shadow-sm">
           <button className="w-full bg-black hover:bg-[#D34079] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-3">
             <Wallet size={18} /> Withdraw Funds
           </button>
           <button className="w-full bg-[#F7F9FB] hover:bg-gray-100 text-black py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-3">
             <BarChart2 size={18} /> Detailed Report
           </button>
        </div>
      </div>

      {/* 2. Seller Level & Main Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Seller Level Card */}
        <div className="lg:col-span-4 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
          <div>
            <h3 className="text-lg font-black text-black uppercase tracking-tight mb-1">Level Progress</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next Goal: Level 2 Seller</p>
          </div>
          
          <div className="space-y-8">
            <LevelMetric label="Response Rate" percentage={98} colorClass="text-green-500" />
            <LevelMetric label="On-Time Delivery" percentage={100} colorClass="text-green-500" />
            <LevelMetric label="Order Completion" percentage={92} colorClass="text-[#D34079]" />
          </div>

          <div className="p-6 bg-[#F7F9FB] rounded-2xl border border-gray-100">
             <p className="text-[10px] font-black text-gray-400 uppercase leading-relaxed">
               You are <span className="text-black">3 orders away</span> from qualifying for the next badge. Keep up the high completion rate!
             </p>
          </div>
        </div>

        {/* Grid Stats */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <Stat key={idx} {...stat} />
            ))}
          </div>

          {/* Revenue Graph Placeholder */}
          <div className="bg-white border border-gray-100 rounded-[3rem] p-10 flex-1 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-lg font-black text-black uppercase tracking-tight">Earnings Flow</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last 30 Days Activity</p>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#B7E2BF]" />
                  <span className="text-[10px] font-black uppercase text-gray-400">Projected</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#D34079]" />
                  <span className="text-[10px] font-black uppercase text-gray-400">Actual</span>
                </div>
              </div>
            </div>
            
            <div className="h-64 w-full bg-[#F7F9FB] rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center group cursor-pointer hover:border-[#D34079] transition-all">
               <TrendingUp size={48} className="text-gray-200 group-hover:text-[#D34079] transition-all mb-4" />
               <p className="text-black text-xs font-black uppercase tracking-widest">Interactive Chart Data Loading...</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Funnel Analysis */}
      <div className="bg-black p-10 rounded-[3rem] text-white">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black uppercase tracking-tight">Performance Funnel</h3>
            <span className="text-[10px] font-black text-[#B7E2BF] uppercase tracking-[0.2em] border border-[#B7E2BF]/30 px-4 py-2 rounded-full">Pro Stats</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Search Views", val: "2,405", color: "text-[#B7E2BF]" },
              { label: "Gig Clicks", val: "840", color: "text-[#D34079]" },
              { label: "Total Orders", val: "24", color: "text-white" },
              { label: "Retainer Rate", val: "85%", color: "text-[#B7E2BF]" }
            ].map((item, i) => (
              <div key={i} className="space-y-2 border-l border-white/10 pl-6">
                 <p className={`text-4xl font-black tracking-tighter ${item.color}`}>{item.val}</p>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.label}</p>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
}