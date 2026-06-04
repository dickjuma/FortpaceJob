import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, FileText, CheckCircle, Eye, ChevronLeft, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const conversionData = [
  { name: 'Week 1', sent: 12, viewed: 8, interviews: 2 },
  { name: 'Week 2', sent: 15, viewed: 10, interviews: 3 },
  { name: 'Week 3', sent: 8, viewed: 7, interviews: 4 },
  { name: 'Week 4', sent: 20, viewed: 15, interviews: 6 },
  { name: 'Week 5', sent: 14, viewed: 12, interviews: 5 },
];

export default function ProposalAnalyticsPage() {
  const stats = [
    { name: 'Proposals Sent (30d)', value: '69', change: '+12%', icon: FileText, color: 'text-[#2bb75c]' },
    { name: 'View Rate', value: '75%', change: '+5%', icon: Eye, color: 'text-[#2bb75c]' },
    { name: 'Interview Rate', value: '28%', change: '+8%', icon: Award, color: 'text-yellow-600' },
    { name: 'Hired / Won', value: '6', change: '+2', icon: CheckCircle, color: 'text-green-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-8">
        <Link to="/freelancer/proposals" className="text-sm font-medium text-[#2bb75c] hover:text-[#2bb75c] mb-4 inline-flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Bidding Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <TrendingUp className="w-8 h-8 mr-3 text-[#2bb75c]" /> Proposal Performance Analytics
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your bidding efficiency, profile views, and interview conversion rates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-surface dark:bg-gray-800 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30">
                {stat.change}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Funnel Chart */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Conversion Funnel</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip cursor={{fill: '#F3F4F6', opacity: 0.4}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                <Bar dataKey="sent" name="Sent" fill="#9ca3af" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="viewed" name="Viewed" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="interviews" name="Interviews" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Score Trend */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Average Match Score</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={conversionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} domain={[0, 100]} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                <Area type="monotone" dataKey="sent" name="Score %" stroke="#f59e0b" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-[#2bb75c]/5 dark:bg-[#2bb75c]/10 border border-[#2bb75c]/20 dark:border-[#2bb75c]/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-[#2bb75c] dark:text-[#2bb75c] mb-2">AI Bidding Insights</h3>
        <p className="text-sm text-[#2bb75c] dark:text-[#2bb75c]">
          Your interview conversion rate is <strong>8% higher</strong> than the marketplace average. However, your match score on recent proposals has dropped slightly. Consider using the AI Optimizer on your next cover letter to boost your rank visibility.
        </p>
      </div>
    </div>
  );
}

