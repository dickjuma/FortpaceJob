import React from 'react';
import { TrendingUp, BarChart2, Users, DollarSign } from 'lucide-react';

const WorkAnalytics = () => {
  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center shadow-sm">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-zinc-900">Platform Analytics</h1>
              <p className="text-zinc-600 font-medium">Track your hiring efficiency and total spend on Fortspace.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 text-success rounded-lg"><DollarSign className="w-5 h-5" /></div>
                <div className="font-bold text-zinc-500">Total Spend</div>
              </div>
              <div className="text-3xl font-black text-zinc-900">$24,500</div>
              <div className="text-sm font-bold text-success mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> +12% this year
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-100 text-brand-600 rounded-lg"><Users className="w-5 h-5" /></div>
                <div className="font-bold text-zinc-500">Talent Hired</div>
              </div>
              <div className="text-3xl font-black text-zinc-900">14</div>
              <div className="text-sm font-bold text-brand-600 mt-2">Across 8 categories</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><BarChart2 className="w-5 h-5" /></div>
                <div className="font-bold text-zinc-500">Avg Job Cost</div>
              </div>
              <div className="text-3xl font-black text-zinc-900">$1,750</div>
              <div className="text-sm font-medium text-zinc-500 mt-2">Per completed contract</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-100 text-brand-600 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
                <div className="font-bold text-zinc-500">Hire Rate</div>
              </div>
              <div className="text-3xl font-black text-zinc-900">68%</div>
              <div className="text-sm font-medium text-zinc-500 mt-2">Of posted jobs filled</div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm text-center">
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Spend by Category (Placeholder)</h3>
            <p className="text-zinc-500 mb-8">A pie chart or bar graph visualizing your expenditure would go here.</p>
            <div className="h-64 bg-surface border-2 border-dashed border-zinc-200 rounded-2xl flex items-center justify-center">
              <span className="text-zinc-400 font-bold">Chart Component Required (e.g. Recharts or Chart.js)</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default WorkAnalytics;
