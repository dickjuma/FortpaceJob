import React, { useState } from 'react';
import { 
  TrendingUp, Eye, MousePointer, DollarSign, Download, Filter, Zap, 
  ArrowUpRight, ArrowDownRight, Target, Share2, Award, Calendar, BarChart2, Star
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';

// --- Premium custom SVG Progress Ring ---
const CustomProgressRing = ({ percent, colorClass }) => {
  const radius = 30;
  const stroke = 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
      <svg className="w-full h-full transform -rotate-90">
        <circle 
          className="text-light-gray" 
          strokeWidth={stroke} 
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx="32" 
          cy="32" 
        />
        <circle 
          className={colorClass} 
          strokeWidth={stroke} 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round" 
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx="32" 
          cy="32" 
        />
      </svg>
      <span className="absolute text-[10px] font-black text-text-primary">{percent}%</span>
    </div>
  );
};

export default function FreelancerAnalyticsPage() {
  const [datePeriod, setDatePeriod] = useState('Last 30 Days');

  const stats = [
    { title: 'Search Impressions', value: '18,294', change: '14.2%', isPositive: true, icon: Eye },
    { title: 'Profile Clicks', value: '1,485', change: '8.7%', isPositive: true, icon: MousePointer },
    { title: 'Proposal Success', value: '42.8%', change: '3.1%', isPositive: true, icon: Target },
    { title: 'Job Success Score', value: '99.4%', change: '0.2%', isPositive: true, icon: Award }
  ];

  const handleExport = () => {
    toast.success('Analytics report dispatched successfully! 📊', { icon: '📈' });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-success/20 text-success rounded-xl border border-success/20 shadow-sm">
              <BarChart2 className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Business Intelligence Dashboard</h1>
          </div>
          <p className="text-sm text-text-secondary mt-1 font-semibold">
            Track user visibility metrics, conversion indexes, geographical engagement, and task velocity indicators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={datePeriod}
            onChange={(e) => setDatePeriod(e.target.value)}
            className="text-xs font-bold text-text-primary border border-border bg-white rounded-xl px-3 py-2 outline-none shadow-sm cursor-pointer"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>

          <Button 
            onClick={handleExport}
            variant="outline" 
            className="rounded-xl font-bold text-xs shadow-sm bg-white" 
            icon={<Download size={14} />}
          >
            Export CSV Dataset
          </Button>
        </div>
      </div>

      {/* KPIs Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <Card key={idx} className="p-6 border border-border bg-white shadow-sm relative overflow-hidden group hover:border-success/30 transition-all">
              <div className="flex justify-between items-center mb-4">
                <div className="p-2 bg-light-gray text-text-secondary rounded-xl group-hover:scale-105 transition-all">
                  <Icon className="w-5 h-5 text-success" />
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-0.5",
                  st.isPositive ? "bg-success/10 text-success" : "bg-[#e63946]/10 text-[#e63946]"
                )}>
                  {st.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {st.change}
                </span>
              </div>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{st.title}</p>
              <h3 className="text-3xl font-black text-text-primary mt-1">{st.value}</h3>
            </Card>
          );
        })}
      </div>

      {/* Advanced performance ring dashboard metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Core Conversion Rings */}
        <Card className="p-6 border border-border bg-white shadow-sm space-y-6">
          <h3 className="font-black text-text-primary text-sm uppercase tracking-wider border-b border-border pb-3">
            Conversion Indexes
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 p-3 bg-light-gray/40 rounded-2xl">
              <div className="flex-1">
                <h4 className="text-xs font-bold text-text-primary">Response Index Rating</h4>
                <p className="text-[9px] font-semibold text-text-secondary mt-0.5">Average time replies within 1 hour limit</p>
              </div>
              <CustomProgressRing percent={96} colorClass="text-success" />
            </div>

            <div className="flex items-center justify-between gap-4 p-3 bg-light-gray/40 rounded-2xl">
              <div className="flex-1">
                <h4 className="text-xs font-bold text-text-primary">Deliver On-time Index</h4>
                <p className="text-[9px] font-semibold text-text-secondary mt-0.5">Projects finalized before client deadline</p>
              </div>
              <CustomProgressRing percent={98} colorClass="text-success" />
            </div>

            <div className="flex items-center justify-between gap-4 p-3 bg-light-gray/40 rounded-2xl">
              <div className="flex-1">
                <h4 className="text-xs font-bold text-text-primary">Engagement Conversion</h4>
                <p className="text-[9px] font-semibold text-text-secondary mt-0.5">Ratio of clicks that trigger project milestones</p>
              </div>
              <CustomProgressRing percent={84} colorClass="text-warning" />
            </div>
          </div>
        </Card>

        {/* Client Insights card heatmap mock */}
        <Card className="p-6 border border-border bg-white shadow-sm lg:col-span-2 space-y-4">
          <h3 className="font-black text-text-primary text-sm uppercase tracking-wider border-b border-border pb-3">
            Client Traffic Heatmap By Peak Availability
          </h3>
          <p className="text-xs text-text-secondary font-semibold">
            Evaluate time periods when top procurement clients view your active service listings.
          </p>
          
          <div className="grid grid-cols-7 gap-2.5 pt-2 text-center text-[9px] font-black text-text-secondary">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <span key={day}>{day}</span>
            ))}
            
            {/* Heatmap mock pixels */}
            {[
              'bg-success/10', 'bg-success/40', 'bg-success/20', 'bg-success/80', 'bg-success/90', 'bg-success/10', 'bg-success/20',
              'bg-success/40', 'bg-success/90', 'bg-success/60', 'bg-success/80', 'bg-success/90', 'bg-success/15', 'bg-success/10',
              'bg-success/20', 'bg-success/80', 'bg-success/90', 'bg-success/90', 'bg-success/90', 'bg-success/20', 'bg-success/10'
            ].map((cl, i) => (
              <div key={i} className={cn("h-7 rounded-lg transition-transform hover:scale-110 cursor-pointer shadow-inner", cl)}></div>
            ))}
          </div>

          <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-wider pt-3 border-t border-border">
            <span>Low Engagement</span>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 bg-success/10 rounded"></div>
              <div className="w-2.5 h-2.5 bg-success/40 rounded"></div>
              <div className="w-2.5 h-2.5 bg-success/80 rounded"></div>
              <div className="w-2.5 h-2.5 bg-success/90 rounded"></div>
            </div>
            <span>High Engagement</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
