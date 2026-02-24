import React, { useState, useEffect } from "react";
import { 
  TrendingUp, TrendingDown, Eye, 
  DollarSign, Percent, Wallet, BarChart2, ShieldCheck,
  Users, Clock, Star, Download, Filter,
  ChevronDown, RefreshCw, ShoppingBag,
  ArrowRight, Calendar, CheckCircle, AlertCircle
} from "lucide-react";

// Mock API call
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
    <div className="bg-white rounded-lg border border-[#E7E1DE] p-5 hover:border-[#E7E1DE] transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 rounded-md bg-[#F8F4F1]">
          {React.cloneElement(icon, { size: 18, className: "text-[#6B5B50]" })}
        </div>
        {trend !== null && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
            isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-semibold text-[#2E2322] mb-1">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </p>
        <p className="text-sm text-[#6B5B50]">{label}</p>
      </div>
    </div>
  );
}

// Progress Bar Component
function ProgressMetric({ label, percentage, color = "blue" }) {
  const colorClasses = {
    blue: "bg-[#FDECE7]",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500"
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-[#4A312F]">{label}</span>
        <span className="text-sm font-semibold text-[#2E2322]">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-[#F3E9E5] rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${colorClasses[color]}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Revenue Chart Component
function RevenueChart({ data }) {
  const maxValue = Math.max(...data.map(d => Math.max(d.projected, d.actual)));
  
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#2E2322]">Revenue Overview</h3>
          <p className="text-sm text-[#6B5B50]">Last 30 days performance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FDECE7]"></div>
            <span className="text-sm text-[#6B5B50]">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#C1B1A8]"></div>
            <span className="text-sm text-[#6B5B50]">Projected</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-end justify-between h-48">
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1">
            <div className="flex flex-col items-center w-full h-40 justify-end">
              <div className="flex items-end gap-1 w-8">
                <div 
                  className="w-6 bg-[#EFE7E2] rounded-t-sm"
                  style={{ height: `${(item.projected / maxValue) * 100}%` }}
                />
                <div 
                  className="w-6 bg-[#FDECE7] rounded-t-sm"
                  style={{ height: `${(item.actual / maxValue) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-xs font-medium text-[#6B5B50] mt-2">{item.date}</span>
            <span className="text-xs text-[#7A5A4C]">${item.actual}</span>
          </div>
        ))}
      </div>
    </div>
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
      <div className="flex items-center justify-center min-h-screen bg-[#F8F4F1]">
        <div className="text-center p-12">
          <RefreshCw size={32} className="animate-spin text-[#A38F85] mx-auto mb-4" />
          <p className="text-[#6B5B50] font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const { earnings, stats, sellerLevel, revenueData, funnelData } = data;

  return (
    <div className="min-h-screen bg-[#F8F4F1] p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#2E2322]">Analytics Dashboard</h1>
            <p className="text-[#6B5B50] mt-1">Track your performance and earnings</p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <button 
              onClick={handleRefresh} 
              disabled={refreshing}
              className="px-4 py-2 bg-white border border-[#E7E1DE] rounded-lg text-[#4A312F] hover:bg-[#F8F4F1] flex items-center gap-2 text-sm font-medium"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            
            <div className="relative">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none px-4 py-2 bg-white border border-[#E7E1DE] rounded-lg text-[#4A312F] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#C9452F] focus:border-[#C9452F] pr-10"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A38F85] pointer-events-none" />
            </div>
            
            <button className="px-4 py-2 bg-[#C9452F] text-white rounded-lg hover:bg-[#B53A27] flex items-center gap-2 text-sm font-medium">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="bg-white rounded-lg border border-[#E7E1DE] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-[#2E2322]">Earnings Summary</h2>
              <p className="text-sm text-[#6B5B50]">Balance overview</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#7A5A4C]">
              <Calendar size={16} />
              <span>Last updated: Today</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-[#FDECE7] rounded-lg border border-[#F4C7A1]">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#FDECE7] rounded-lg">
                  <Wallet size={18} className="text-[#C9452F]" />
                </div>
                <span className="text-sm font-medium text-[#4A312F]">Available</span>
              </div>
              <p className="text-2xl font-bold text-[#2E2322]">
                ${earnings.available.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock size={18} className="text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-[#4A312F]">Pending</span>
              </div>
              <p className="text-2xl font-bold text-[#2E2322]">
                ${earnings.pending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle size={18} className="text-green-600" />
                </div>
                <span className="text-sm font-medium text-[#4A312F]">Withdrawn</span>
              </div>
              <p className="text-2xl font-bold text-[#2E2322]">
                ${earnings.withdrawn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-[#C9452F] text-white rounded-lg hover:bg-[#B53A27] flex items-center gap-2 font-medium">
              <Wallet size={16} />
              Withdraw Funds
            </button>
            <button className="px-5 py-2.5 bg-white border border-[#E7E1DE] text-[#4A312F] rounded-lg hover:bg-[#F8F4F1] flex items-center gap-2 font-medium">
              <BarChart2 size={16} />
              View Details
            </button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard 
            label="Impressions" 
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
            icon={<ShoppingBag />}
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

        {/* Seller Level & Revenue Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Seller Level Card */}
          <div className="bg-white rounded-lg border border-[#E7E1DE] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[#2E2322]">Seller Level</h3>
                <p className="text-sm text-[#6B5B50]">Progress to next level</p>
              </div>
              <div className="flex items-center gap-2">
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-[#2E2322]">{sellerLevel.current}</span>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-[#F8F4F1] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#4A312F]">Next Level: {sellerLevel.nextLevel}</span>
                <span className="text-sm font-semibold text-[#C9452F]">{sellerLevel.ordersToNext} orders needed</span>
              </div>
              <div className="h-2 bg-[#EFE7E2] rounded-full">
                <div 
                  className="h-full bg-[#FDECE7] rounded-full"
                  style={{ width: '75%' }}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <ProgressMetric 
                label="Response Rate" 
                percentage={sellerLevel.responseRate} 
                color="green"
              />
              <ProgressMetric 
                label="On-Time Delivery" 
                percentage={sellerLevel.onTimeDelivery} 
                color="blue"
              />
              <ProgressMetric 
                label="Order Completion" 
                percentage={sellerLevel.orderCompletion} 
                color="purple"
              />
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-lg border border-[#E7E1DE] p-6">
            <RevenueChart data={revenueData} />
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-lg border border-[#E7E1DE] p-6">
          <h3 className="text-lg font-semibold text-[#2E2322] mb-6">Conversion Funnel</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border border-[#E7E1DE] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#4A312F]">Search Views</span>
                <span className="text-xs px-2 py-1 bg-[#F3E9E5] text-[#6B5B50] rounded">100%</span>
              </div>
              <p className="text-xl font-bold text-[#2E2322]">{funnelData.searchViews.toLocaleString()}</p>
            </div>
            
            <div className="p-4 border border-[#E7E1DE] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#4A312F]">Gig Clicks</span>
                <span className="text-xs px-2 py-1 bg-[#FDECE7] text-[#C9452F] rounded">
                  {((funnelData.gigClicks / funnelData.searchViews) * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-xl font-bold text-[#2E2322]">{funnelData.gigClicks.toLocaleString()}</p>
            </div>
            
            <div className="p-4 border border-[#E7E1DE] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#4A312F]">Orders</span>
                <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded">
                  {((funnelData.orders / funnelData.gigClicks) * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-xl font-bold text-[#2E2322]">{funnelData.orders}</p>
            </div>
            
            <div className="p-4 border border-[#E7E1DE] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#4A312F]">Repeat Buyers</span>
                <span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded">
                  {funnelData.repeatBuyers}%
                </span>
              </div>
              <p className="text-xl font-bold text-[#2E2322]">{funnelData.repeatBuyers}%</p>
            </div>
          </div>

          {/* Funnel Visualization */}
          <div className="mt-6 p-4 bg-[#F8F4F1] rounded-lg">
            <div className="flex items-center justify-between">
              {[
                { label: 'Views', value: funnelData.searchViews, percentage: 100 },
                { label: 'Clicks', value: funnelData.gigClicks, percentage: (funnelData.gigClicks / funnelData.searchViews) * 100 },
                { label: 'Orders', value: funnelData.orders, percentage: (funnelData.orders / funnelData.gigClicks) * 100 },
                { label: 'Repeat', value: funnelData.repeatBuyers, percentage: funnelData.repeatBuyers }
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-16 h-16 rounded-full border-4 border-white bg-white shadow-sm flex items-center justify-center mb-2">
                    <span className="font-bold text-[#2E2322]">{step.value}</span>
                  </div>
                  <span className="text-sm font-medium text-[#4A312F]">{step.label}</span>
                  <span className="text-xs text-[#7A5A4C]">{step.percentage.toFixed(1)}%</span>
                  {index < 3 && (
                    <div className="flex-1 h-0.5 bg-[#C1B1A8] mt-2 w-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white rounded-lg border border-[#E7E1DE] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#2E2322]">Key Insights</h3>
            <button className="text-sm text-[#C9452F] hover:text-[#B53A27] font-medium">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-[#E7E1DE] rounded-lg hover:border-[#C9452F] transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#FDECE7] rounded-lg">
                  <TrendingUp size={16} className="text-[#C9452F]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#2E2322] mb-1">Peak Sales Period</h4>
                  <p className="text-sm text-[#6B5B50]">Wednesday at 2 PM sees 37% higher conversion rates</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-[#E7E1DE] rounded-lg hover:border-green-300 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Users size={16} className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-[#2E2322] mb-1">Customer Retention</h4>
                  <p className="text-sm text-[#6B5B50]">85% of buyers return for additional services</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-[#E7E1DE] rounded-lg hover:border-orange-300 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <AlertCircle size={16} className="text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-[#2E2322] mb-1">Response Time Alert</h4>
                  <p className="text-sm text-[#6B5B50]">Response time increased by 15% this week</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}