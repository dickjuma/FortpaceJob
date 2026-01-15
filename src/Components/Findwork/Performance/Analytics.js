import React, { useState, useEffect } from "react";
import { 
  TrendingUp, ArrowUpRight, ArrowDownRight, Eye, 
  DollarSign, Percent, Wallet, BarChart2, ShieldCheck,
  MessageSquare, Heart, Clock, Star, Download, Filter,
  ChevronDown, RefreshCw
} from "lucide-react";

// Mock API call - replace with actual backend endpoint
const fetchAnalyticsData = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    earnings: {
      available: 2840.00,
      pending: 1150.00,
      withdrawn: 8430.00,
      currency: "USD"
    },
    stats: {
      impressions: { value: 12405, trend: 15.2, isPositive: true },
      clicks: { value: 840, trend: 8.3, isPositive: true },
      orders: { value: 24, trend: 12.5, isPositive: true },
      conversionRate: { value: 3.2, trend: 1.1, isPositive: true },
      avgPrice: { value: 142, trend: 4.5, isPositive: true },
      responseTime: { value: 2.3, trend: -15.2, isPositive: false }
    },
    sellerLevel: {
      current: "Level 1",
      nextLevel: "Level 2",
      ordersToNext: 3,
      responseRate: 98,
      onTimeDelivery: 100,
      orderCompletion: 92
    },
    revenueData: [
      { date: "Dec 17", projected: 120, actual: 115 },
      { date: "Dec 24", projected: 145, actual: 152 },
      { date: "Dec 31", projected: 180, actual: 175 },
      { date: "Jan 7", projected: 210, actual: 195 },
      { date: "Jan 14", projected: 240, actual: 255 }
    ],
    funnelData: {
      searchViews: 2405,
      gigClicks: 840,
      orders: 24,
      repeatBuyers: 85
    }
  };
};

// Stat Card Component
function StatCard({ label, value, trend, isPositive, icon, prefix = "", suffix = "" }) {
  return (
    <div className="bg-[#F7F9FB] rounded-xl p-6 border border-[#4A312F]/20 hover:border-[#D34079] hover:shadow-lg hover:shadow-[#D34079]/10 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-lg bg-[#B7E2BF]/20 border border-[#B7E2BF]/30">
          {React.cloneElement(icon, { size: 20, className: "text-[#4A312F]" })}
        </div>
        {trend !== null && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-[#D34079]' : 'text-red-500'}`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-[#4A312F] mb-1">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </p>
        <p className="text-sm text-[#4A312F] font-semibold">{label}</p>
      </div>
    </div>
  );
}

// Progress Bar Component
function ProgressMetric({ label, percentage, colorClass }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-[#4A312F]">{label}</span>
        <span className={`text-sm font-bold ${colorClass}`}>{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-[#F7F9FB]/50 rounded-full overflow-hidden border border-[#4A312F]/10">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${colorClass.replace('text', 'bg')} shadow-sm`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Mini Chart Component (SVG based)
function MiniChart({ data }) {
  const maxValue = Math.max(...data.map(d => Math.max(d.projected, d.actual)));
  const points = data.length;
  const width = 100;
  const height = 40;
  
  const getY = (value) => height - (value / maxValue) * height;
  
  const actualPath = data.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${(i / (points - 1)) * width} ${getY(d.actual)}`
  ).join(' ');
  
  return (
    <svg width={width} height={height} className="ml-auto">
      <path
        d={actualPath}
        fill="none"
        stroke="#D34079"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchAnalyticsData();
      setData(result);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F9FB]">
        <div className="text-center p-12">
          <RefreshCw size={40} className="animate-spin text-[#D34079] mx-auto mb-4" />
          <p className="text-[#4A312F] font-semibold text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const { earnings, stats, sellerLevel, revenueData, funnelData } = data;

  return (
    <div className="min-h-screen bg-[#F7F9FB] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#4A312F]">Analytics</h1>
            <p className="text-[#4A312F] mt-1 text-lg font-semibold opacity-90">Track your performance and earnings</p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={handleRefresh} disabled={refreshing} className="px-6 py-2.5 bg-[#D34079] ...">
    <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
    Refresh
  </button>
  <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="...">
    {/* options */}
  </select>

            
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2.5 border-2 border-[#4A312F]/30 bg-white rounded-xl text-sm font-semibold text-[#4A312F] focus:outline-none focus:ring-4 focus:ring-[#FBB9C2]/30 focus:border-[#D34079] shadow-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button className="px-6 py-2.5 bg-[#D34079] text-white rounded-xl hover:bg-[#B72F66] shadow-lg hover:shadow-xl flex items-center gap-2 text-sm font-bold transition-all duration-300 active:scale-95 transform">
              <Download size={16} />
              Export Data
            </button>
          </div>
        </div>

        {/* Earnings Card */}
        <div className="bg-gradient-to-br from-[#4A312F] via-[#5A3F3A] to-[#3A2623] rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FBB9C2]/10 to-[#B7E2BF]/5" />
          <div className="relative flex items-center gap-3 mb-8">
            <ShieldCheck size={22} className="text-[#FBB9C2]" />
            <span className="text-lg font-bold bg-[#FBB9C2]/20 px-3 py-1 rounded-full backdrop-blur-sm">Seller Earnings</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-sm text-white/80 mb-3 font-medium">Available for Withdrawal</p>
              <p className="text-5xl font-black leading-tight">
                ${earnings.available.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-white/80 mb-3 font-medium">Pending Clearance</p>
              <p className="text-4xl font-bold text-[#FBB9C2]">
                ${earnings.pending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-white/80 mb-3 font-medium">Withdrawn to Date</p>
              <p className="text-4xl font-bold">
                ${earnings.withdrawn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/20 flex gap-4">
            <button className="flex-1 bg-[#D34079] hover:bg-[#B72F66] text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 transform backdrop-blur-sm flex items-center justify-center gap-3">
              <Wallet size={20} />
              Withdraw Now
            </button>
            <button className="px-8 py-4 border-2 border-white/30 hover:border-white backdrop-blur-sm hover:bg-white/10 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl">
              <BarChart2 size={20} />
              View Details
            </button>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            label="Gig Impressions" 
            value={stats.impressions.value}
            trend={stats.impressions.trend}
            isPositive={stats.impressions.isPositive}
            icon={<Eye />}
          />
          <StatCard 
            label="Gig Clicks" 
            value={stats.clicks.value}
            trend={stats.clicks.trend}
            isPositive={stats.clicks.isPositive}
            icon={<MessageSquare />}
          />
          <StatCard 
            label="Total Orders" 
            value={stats.orders.value}
            trend={stats.orders.trend}
            isPositive={stats.orders.isPositive}
            icon={<ShieldCheck />}
          />
          <StatCard 
            label="Conversion Rate" 
            value={stats.conversionRate.value}
            trend={stats.conversionRate.trend}
            isPositive={stats.conversionRate.isPositive}
            icon={<Percent />}
            suffix="%"
          />
          <StatCard 
            label="Avg. Selling Price" 
            value={stats.avgPrice.value}
            trend={stats.avgPrice.trend}
            isPositive={stats.avgPrice.isPositive}
            icon={<DollarSign />}
            prefix="$"
          />
          <StatCard 
            label="Avg. Response Time" 
            value={stats.responseTime.value}
            trend={stats.responseTime.trend}
            isPositive={stats.responseTime.isPositive}
            icon={<Clock />}
            suffix=" hrs"
          />
        </div>

        {/* Level Progress & Revenue Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Seller Level Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-[#4A312F]/10 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-[#4A312F]">{sellerLevel.current}</h3>
                <p className="text-lg text-[#4A312F]/80 font-semibold mt-1">Next: {sellerLevel.nextLevel}</p>
              </div>
              <Star size={32} className="text-[#D34079] fill-[#D34079] shadow-lg" />
            </div>
            
            <div className="space-y-6 mb-8">
              <ProgressMetric 
                label="Response Rate" 
                percentage={sellerLevel.responseRate} 
                colorClass="text-[#D34079]" 
              />
              <ProgressMetric 
                label="On-Time Delivery" 
                percentage={sellerLevel.onTimeDelivery} 
                colorClass="text-[#B7E2BF]" 
              />
              <ProgressMetric 
                label="Order Completion" 
                percentage={sellerLevel.orderCompletion} 
                colorClass="text-[#FBB9C2]" 
              />
            </div>

            <div className="p-6 bg-gradient-to-r from-[#FBB9C2]/20 to-[#D34079]/10 rounded-2xl border border-[#D34079]/20 shadow-lg">
              <p className="text-lg text-[#4A312F] font-bold text-center">
                {sellerLevel.ordersToNext} orders away from <span className="text-[#D34079]">{sellerLevel.nextLevel}</span>
              </p>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-[#4A312F]/10 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-[#4A312F]">Earnings Overview</h3>
                <p className="text-lg text-[#4A312F]/80 font-semibold mt-1">Revenue trends over time</p>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#D34079] shadow-sm" />
                  <span className="text-sm font-bold text-[#4A312F]">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#B7E2BF]/60" />
                  <span className="text-sm font-semibold text-[#4A312F]/80">Projected</span>
                </div>
              </div>
            </div>
            
            <div className="h-72 flex items-end justify-between gap-3 p-4">
              {revenueData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="w-full flex items-end justify-center gap-1 h-56 relative">
                    <div 
                      className="w-1.5 bg-[#B7E2BF]/40 group-hover:bg-[#B7E2BF]/60 rounded-lg transition-all duration-300 shadow-sm"
                      style={{ height: `${(item.projected / 300) * 100}%` }}
                      title={`Projected: $${item.projected}`}
                    />
                    <div 
                      className="w-2 bg-gradient-to-t from-[#D34079] to-[#FBB9C2] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110"
                      style={{ height: `${(item.actual / 300) * 100}%` }}
                      title={`Actual: $${item.actual}`}
                    />
                  </div>
                  <span className="text-sm font-bold text-[#4A312F]">{item.date}</span>
                </div>
              ))}
              <MiniChart data={revenueData} className="absolute bottom-4 right-4 shadow-lg" />
            </div>
          </div>
        </div>

        {/* Funnel Analysis */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 border border-[#4A312F]/10 shadow-2xl">
          <h3 className="text-2xl font-black text-[#4A312F] mb-10 text-center">Conversion Funnel</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-full h-28 bg-gradient-to-b from-[#D34079] via-[#FBB9C2] to-[#D34079] rounded-3xl flex items-center justify-center mb-4 shadow-2xl group-hover:scale-105 transition-all duration-300">
                <span className="text-4xl font-black text-white drop-shadow-lg">{funnelData.searchViews.toLocaleString()}</span>
              </div>
              <p className="text-lg font-bold text-[#4A312F] mb-1">Search Views</p>
              <p className="text-sm text-[#4A312F]/70 font-semibold">100%</p>
            </div>
            
            <div className="text-center group">
              <div className="w-full h-24 bg-gradient-to-b from-[#D34079]/90 to-[#FBB9C2]/80 rounded-3xl flex items-center justify-center mb-4 shadow-xl group-hover:scale-105 transition-all duration-300">
                <span className="text-3xl font-black text-white">{funnelData.gigClicks.toLocaleString()}</span>
              </div>
              <p className="text-lg font-bold text-[#4A312F] mb-1">Gig Clicks</p>
              <p className="text-sm text-[#4A312F]/70 font-semibold">{((funnelData.gigClicks / funnelData.searchViews) * 100).toFixed(1)}%</p>
            </div>
            
            <div className="text-center group">
              <div className="w-full h-20 bg-gradient-to-b from-[#B7E2BF] to-[#D34079]/80 rounded-3xl flex items-center justify-center mb-4 shadow-xl group-hover:scale-105 transition-all duration-300">
                <span className="text-2xl font-black text-[#4A312F] drop-shadow-lg">{funnelData.orders}</span>
              </div>
              <p className="text-lg font-bold text-[#4A312F] mb-1">Orders</p>
              <p className="text-sm text-[#4A312F]/70 font-semibold">{((funnelData.orders / funnelData.gigClicks) * 100).toFixed(1)}%</p>
            </div>
            
            <div className="text-center group">
              <div className="w-full h-16 bg-gradient-to-b from-[#FBB9C2] to-[#B7E2BF] rounded-3xl flex items-center justify-center mb-4 shadow-xl group-hover:scale-105 transition-all duration-300">
                <span className="text-xl font-black text-[#4A312F] drop-shadow-md">{funnelData.repeatBuyers}%</span>
              </div>
              <p className="text-lg font-bold text-[#4A312F] mb-1">Repeat Buyers</p>
              <p className="text-sm text-[#4A312F]/70 font-semibold">Retention Rate</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
