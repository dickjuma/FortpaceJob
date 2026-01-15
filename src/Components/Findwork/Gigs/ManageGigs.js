// src/components/findWork/Gigs/ManageGigs.jsx
import React, { useState } from "react";
import { 
  MoreVertical, Edit3, Eye, Trash2, 
  ChevronDown, ArrowUpRight, BarChart2, 
  Pause, Play, Copy, ExternalLink,
  CheckSquare, Square, Download, Share2, TrendingUp
} from "lucide-react";

export default function ManageGigs() {
  const [activeTab, setActiveTab] = useState("Active");
  const [selectedGigs, setSelectedGigs] = useState([]);

  const gigs = [
    { 
      id: "GIG-8821", 
      title: "Enterprise React SaaS Architecture & Scalable Systems", 
      status: "Active", 
      price: 1250,
      stats: { impressions: "12.4k", clicks: 420, ctr: "8.2%", orders: 14, revenue: "$17,500" },
      trend: "+14.2%",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=150&q=80" 
    },
    { 
      id: "GIG-4402", 
      title: "UI/UX Audit & Conversion Rate Optimization", 
      status: "Paused", 
      price: 350,
      stats: { impressions: "2.1k", clicks: 45, ctr: "1.8%", orders: 2, revenue: "$700" },
      trend: "-2.1%",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=150&q=80" 
    },
  ];

  const toggleSelect = (id) => {
    setSelectedGigs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFDFD] text-[#4A312F] p-6 lg:p-10 font-sans">
      
      {/* 1. High-Impact Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <QuickStat label="Pipeline" value="$24,800" icon={<TrendingUp size={18}/>} color="text-[#B7E2BF]" trend="+18%" />
        <QuickStat label="Total Reach" value="84.2k" icon={<Eye size={18}/>} color="text-[#D34079]" trend="+5.4%" />
        <QuickStat label="Avg. CTR" value="4.2%" icon={<BarChart2 size={18}/>} color="text-blue-400" trend="+0.8%" />
        <QuickStat label="Active Orders" value="09" icon={<Play size={18}/>} color="text-[#B7E2BF]" trend="Steady" />
      </div>

      {/* 2. Main Fever-style Table Container */}
      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
        
        {/* Toolbar */}
        <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-gray-50">
          <div className="flex bg-gray-50 p-1 rounded-full border border-gray-100">
            {["Active", "Pending", "Paused", "Draft"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? "bg-[#4A312F] text-white shadow-lg" : "text-gray-400 hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {selectedGigs.length > 0 && (
              <div className="flex items-center gap-4 px-6 py-2 bg-[#D34079] rounded-full animate-in fade-in slide-in-from-right-4">
                <span className="text-[10px] font-black text-white uppercase">{selectedGigs.length} Selected</span>
                <div className="w-px h-4 bg-white/20" />
                <button className="text-white hover:scale-110 transition-transform"><Trash2 size={14}/></button>
                <button className="text-white hover:scale-110 transition-transform"><Pause size={14}/></button>
              </div>
            )}
            <button className="p-3 border border-gray-100 rounded-full hover:bg-gray-50 text-gray-400"><Download size={18}/></button>
            <button className="bg-[#4A312F] text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:shadow-[#4A312F]/20 transition-all flex items-center gap-2">
               Create New Gig
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-12 gap-4 px-10 py-5 bg-gray-50/30 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
          <div className="col-span-1">Select</div>
          <div className="col-span-4">Gig Overview</div>
          <div className="col-span-1 text-center">Impressions</div>
          <div className="col-span-1 text-center">Clicks</div>
          <div className="col-span-1 text-center">CTR</div>
          <div className="col-span-2 text-center">Revenue</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* List Content */}
        <div className="divide-y divide-gray-50">
          {gigs.map((gig) => (
            <div key={gig.id} className={`grid grid-cols-1 lg:grid-cols-12 gap-4 px-10 py-8 items-center transition-all group ${selectedGigs.includes(gig.id) ? 'bg-[#B7E2BF]/5' : 'hover:bg-gray-50/50'}`}>
              
              <div className="col-span-1">
                <button onClick={() => toggleSelect(gig.id)} className="transition-colors">
                  {selectedGigs.includes(gig.id) 
                    ? <CheckSquare size={20} className="text-[#D34079]" /> 
                    : <Square size={20} className="text-gray-200" />
                  }
                </button>
              </div>

              <div className="col-span-4 flex items-center gap-6">
                <div className="relative w-20 h-14 rounded-xl overflow-hidden shadow-md shrink-0">
                  <img src={gig.image} alt={gig.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className={`absolute top-1 right-1 w-2 h-2 rounded-full border border-white ${gig.status === 'Active' ? 'bg-[#B7E2BF] shadow-[0_0_8px_#B7E2BF]' : 'bg-gray-400'}`} />
                </div>
                <div>
                  <h3 className="text-[14px] font-black text-[#4A312F] group-hover:text-[#D34079] transition-colors leading-tight line-clamp-1">
                    {gig.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{gig.id}</span>
                    <span className="text-[9px] font-black text-[#B7E2BF] bg-[#4A312F] px-2 py-0.5 rounded uppercase">Starting ${gig.price}</span>
                  </div>
                </div>
              </div>

              <MetricCell value={gig.stats.impressions} sub="Views" />
              <MetricCell value={gig.stats.clicks} sub="Engagement" />
              <MetricCell value={gig.stats.ctr} sub="Ratio" heat={parseFloat(gig.stats.ctr) > 5} />
              
              <div className="col-span-2 text-center">
                <p className="text-sm font-black text-[#4A312F]">{gig.stats.revenue}</p>
                <div className="flex items-center justify-center gap-1">
                   <span className="text-[8px] font-black text-[#B7E2BF] uppercase">{gig.stats.orders} Orders</span>
                   <ArrowUpRight size={10} className="text-[#B7E2BF]" />
                </div>
              </div>

              <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                <ActionButton icon={<Edit3 size={16}/>} color="hover:bg-[#4A312F] hover:text-white" />
                <ActionButton icon={gig.status === 'Active' ? <Pause size={16}/> : <Play size={16}/>} color="hover:bg-[#D34079] hover:text-white" />
                <ActionButton icon={<Share2 size={16}/>} color="hover:bg-blue-50 hover:text-blue-600" />
                <button className="p-2 text-gray-300 hover:text-black">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="px-10 py-6 bg-gray-50/50 flex justify-between items-center border-t border-gray-100">
           <div className="flex gap-8">
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Next Settlement</span>
                 <span className="text-[10px] font-black text-[#4A312F]">Jan 24, 2026</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Avg. Response</span>
                 <span className="text-[10px] font-black text-[#B7E2BF]">1.2 Hours</span>
              </div>
           </div>
           <button className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D34079] hover:underline transition-all">
             View Full Analytics Report &rarr;
           </button>
        </div>
      </div>
    </div>
  );
}

function MetricCell({ value, sub, heat }) {
  return (
    <div className="col-span-1 text-center">
      <p className={`text-[13px] font-black ${heat ? 'text-[#D34079]' : 'text-[#4A312F]'}`}>
        {value}
      </p>
      <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-0.5">{sub}</p>
    </div>
  );
}

function QuickStat({ label, value, icon, color, trend }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group">
      <div className="flex justify-between items-center mb-6">
        <div className={`p-3 rounded-2xl bg-gray-50 ${color} group-hover:bg-[#4A312F] group-hover:text-white transition-all`}>
          {icon}
        </div>
        <div className="text-right">
           <span className={`text-[10px] font-black px-2 py-1 rounded-md ${trend.includes('+') ? 'bg-[#B7E2BF]/10 text-[#B7E2BF]' : 'bg-gray-50 text-gray-400'}`}>
            {trend}
          </span>
        </div>
      </div>
      <p className="text-3xl font-black text-[#4A312F] tracking-tighter mb-1">{value}</p>
      <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{label}</p>
    </div>
  );
}

function ActionButton({ icon, color }) {
  return (
    <button className={`p-3 rounded-xl border border-gray-100 bg-white transition-all shadow-sm ${color}`}>
      {icon}
    </button>
  );
}