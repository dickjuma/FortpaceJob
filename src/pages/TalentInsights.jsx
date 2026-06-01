import React from 'react';
import { LineChart, TrendingUp, DollarSign, Users, Briefcase } from 'lucide-react';

const TalentInsights = () => {
  return (
    <>
      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          
          <div className="flex items-center gap-4 mb-10 border-b border-zinc-200 pb-6">
            <div className="w-14 h-14 bg-[#14a800]/10 text-[#14a800] rounded-2xl flex items-center justify-center shadow-sm">
              <LineChart className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-zinc-900">Talent Market Insights</h1>
              <p className="text-zinc-600 font-medium">Data-driven hiring intelligence for Q3 2026</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Avg Web Dev Rate', value: '$85/hr', trend: '+12%', icon: DollarSign },
              { label: 'Time to Hire', value: '48 Hrs', trend: '-15%', icon: Clock },
              { label: 'Active React Devs', value: '14,200', trend: '+5%', icon: Users },
              { label: 'Jobs Posted Today', value: '1,432', trend: '+22%', icon: Briefcase }
            ].map((metric, i) => (
              <div key={i} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:border-[#14a800]/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                    <metric.icon className="w-5 h-5 text-zinc-500" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${metric.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-[#14a800]/10 text-[#14a800]'}`}>
                    {metric.trend}
                  </span>
                </div>
                <div className="text-2xl font-black text-zinc-900 mb-1">{metric.value}</div>
                <div className="text-sm font-medium text-zinc-500">{metric.label}</div>
              </div>
            ))}
          </div>

          {/* Chart Placeholder & Top Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm h-96 flex flex-col items-center justify-center text-zinc-400">
              <TrendingUp className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-bold">Demand Curve Visualization Placeholder</p>
              <p className="text-sm">Install recharts to render actual data curves.</p>
            </div>
            
            <div className="bg-surface-dark text-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-bold mb-6">Trending Skills</h3>
              <div className="space-y-4">
                {[
                  { skill: 'AI/LLM Integration', growth: '450%' },
                  { skill: 'Next.js 14', growth: '210%' },
                  { skill: 'Rust Engineering', growth: '180%' },
                  { skill: 'UX Micro-interactions', growth: '150%' },
                  { skill: 'AWS Serverless', growth: '120%' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-zinc-800 pb-3 last:border-0 last:pb-0">
                    <span className="font-medium text-zinc-300">{item.skill}</span>
                    <span className="text-success font-bold text-sm">+{item.growth}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

// Simple mock icon for time
const Clock = ({className}) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2"/></svg>;

export default TalentInsights;
