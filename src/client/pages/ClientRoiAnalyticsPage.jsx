import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, BarChart2, PieChart, Sparkles, Download, 
  RefreshCw, Bot, ShieldCheck, DollarSign, Activity 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../platform/components/common/Card';
import Button from '../../platform/components/common/Button';

export default function ClientRoiAnalyticsPage() {
  const [roiForecast, setRoiForecast] = useState(87.5);
  const [activeSegment, setActiveSegment] = useState('overall');

  const { data: roiData } = useQuery({
    queryKey: ['client', 'roiAnalytics'],
    queryFn: async () => {
      return [
        { name: 'Nairobi Pipeline Alignment QA', cost: 125000, target: 150000, savings: 25000, percentage: 83 },
        { name: 'Forte Mobile CSS Flexbox Layouts', cost: 85000, target: 80000, savings: -5000, percentage: 106 },
        { name: 'Mombasa Substation Fiber Splicing', cost: 160000, target: 200000, savings: 40000, percentage: 80 }
      ];
    }
  });
  const departments = roiData || [];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-white bg-zinc-950/20 rounded-3xl animate-in fade-in duration-500">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">AI ROI & Predictive Analytics</h1>
          <p className="text-xs font-semibold text-light-gray/50 mt-1">Audit department operational ROI, forecast monthly workforce budget curves, and review productivity index heatmaps.</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => toast.success('BI Report generated.')} variant="outline" className="border-white/10 hover:bg-white/5 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 bg-transparent text-white">
            <Download size={14} /> Export BI PDF
          </Button>
        </div>
      </div>

      {/* Analytics KPI rows */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-none bg-gradient-to-br from-[#222222] to-zinc-900 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-success/20 blur-[50px] rounded-full"></div>
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Platform Talent ROI Index</p>
          <h2 className="text-4xl font-black mt-2 text-white">+{roiForecast}%</h2>
          <span className="text-[9px] uppercase tracking-wider font-bold text-success mt-4 block flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Exceeds corporate target benchmark by 12%
          </span>
        </Card>

        <Card className="p-6 border border-white/10 bg-white/5 shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-light-gray/50 uppercase tracking-widest flex items-center gap-1"><BarChart2 className="w-3.5 h-3.5" /> Direct Budget Savings</p>
          <h2 className="text-4xl font-black mt-2 text-white">KES 185,000</h2>
          <span className="text-[9px] uppercase tracking-wider font-bold text-success mt-4 block flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> Optimization via offline radius dispatch
          </span>
        </Card>

        <Card className="p-6 border border-white/10 bg-white/5 shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-light-gray/50 uppercase tracking-widest flex items-center gap-1"><PieChart className="w-3.5 h-3.5" /> Average Project Velocity</p>
          <h2 className="text-4xl font-black mt-2 text-success">94.2/100</h2>
          <span className="text-[9px] uppercase tracking-wider font-bold text-light-gray/40 mt-4 block flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> All milestones delivered on schedule
          </span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Department Budget Distributions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-white/10 bg-white/5 p-6 rounded-3xl">
            <h3 className="font-black text-sm uppercase tracking-wider mb-4">Department Spending Optimization</h3>
            
            <div className="space-y-4">
              {departments.map(dept => (
                <div key={dept.name} className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-white">{dept.name}</h4>
                      <p className="text-[9px] text-light-gray/50 mt-0.5">Budget Limit Target: KES {dept.target.toLocaleString()}</p>
                    </div>
                    <span className={`text-[10px] font-mono font-bold ${dept.savings >= 0 ? 'text-success' : 'text-[#e63946]'}`}>
                      {dept.savings >= 0 ? `Saved KES ${dept.savings.toLocaleString()}` : `Overbudget KES ${Math.abs(dept.savings).toLocaleString()}`}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${dept.percentage > 100 ? 'bg-[#e63946]' : 'bg-success'}`} style={{ width: `${Math.min(dept.percentage, 100)}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-light-gray/40">
                      <span>KES {dept.cost.toLocaleString()} Allocated</span>
                      <span>{dept.percentage}% of Limit</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Side: AI Assistant & Insights */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-gradient-to-br from-[#222222] to-zinc-900 border border-white/10 text-white rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/20 blur-[50px] rounded-full"></div>
            <h4 className="font-black text-xs uppercase tracking-wider flex items-center gap-1.5 mb-3 text-success">
              <Bot className="w-4 h-4 text-success animate-bounce" /> AI Analytics insights
            </h4>
            <p className="text-[10px] font-semibold text-white/70 leading-relaxed">
              We tracked field travel logs and auto-suggested dispatching **Kiprotich Arap** to Nairobi Pipeline Site A instead of Mombasa. This single optimization auto-saved **KES 15,000** in transport allowances.
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
}

