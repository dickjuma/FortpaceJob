// src/pages/freelancer/GigAnalyticsPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Download, Eye, MousePointerClick,
  ShoppingCart, DollarSign, Users, RefreshCw, Sparkles,
  ArrowUpRight, ArrowDownRight, Filter
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useGigAnalytics } from '../services/freelancerHooks';

export default function GigAnalyticsPage() {
  const { data: response, isLoading } = useGigAnalytics();
  const analyticsData = response?.data || response || {};
  const [timeRange, setTimeRange] = useState('Last 7 Days');
  const [activeGig, setActiveGig] = useState('All Gigs');
  
  const fallbackTraffic = [
    { date: 'Mon', impressions: 4000, clicks: 240 },
    { date: 'Tue', impressions: 3000, clicks: 139 },
    { date: 'Wed', impressions: 2000, clicks: 980 },
    { date: 'Thu', impressions: 2780, clicks: 390 },
    { date: 'Fri', impressions: 1890, clicks: 480 },
    { date: 'Sat', impressions: 2390, clicks: 380 },
    { date: 'Sun', impressions: 3490, clicks: 430 },
  ];

  const fallbackDemographics = [
    { name: 'United States', value: 45, color: '#2563EB' },
    { name: 'United Kingdom', value: 25, color: '#16A34A' },
    { name: 'Canada', value: 15, color: '#D97706' },
    { name: 'Australia', value: 15, color: '#DC2626' },
  ];

  const TRAFFIC_DATA = analyticsData.traffic || fallbackTraffic;
  const DEMOGRAPHICS_DATA = analyticsData.demographics || fallbackDemographics;

  const stats = [
    { label: 'Impressions', value: '18.4K', trend: '+12%', isUp: true, icon: Eye, bg: 'bg-accent-light', color: 'text-accent DEFAULT' },
    { label: 'Clicks', value: '1,240', trend: '+8%', isUp: true, icon: MousePointerClick, bg: 'bg-accent-light', color: 'text-accent DEFAULT' },
    { label: 'Conv. Rate', value: '2.8%', trend: '-0.4%', isUp: false, icon: Filter, bg: 'bg-warn-light', color: 'text-warn' },
    { label: 'Orders', value: '32', trend: '+24%', isUp: true, icon: ShoppingCart, bg: 'bg-accent-light', color: 'text-accent DEFAULT' },
    { label: 'Revenue', value: 'KES 8,450', trend: '+18%', isUp: true, icon: DollarSign, bg: 'bg-accent-light', color: 'text-accent DEFAULT' },
    { label: 'Repeat Buyers', value: '45%', trend: '+5%', isUp: true, icon: RefreshCw, bg: 'bg-accent-light', color: 'text-accent DEFAULT' },
  ];

  const CustomAreaTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-border rounded-lg shadow-md p-3">
          <p className="text-xs font-body font-medium text-ink-secondary mb-1">{payload[0]?.payload?.date}</p>
          <p className="text-sm font-mono font-semibold text-accent DEFAULT">
            Impressions: {payload[0]?.value?.toLocaleString()}
          </p>
          {payload[1] && (
            <p className="text-sm font-mono font-semibold text-info DEFAULT">
              Clicks: {payload[1]?.value?.toLocaleString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-border rounded-lg shadow-md p-3">
          <p className="text-xs font-body font-medium text-ink-secondary mb-1">{payload[0]?.payload?.date}</p>
          <p className="text-sm font-mono font-semibold text-accent DEFAULT">
            Revenue: KES {payload[0]?.value?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-border rounded-lg shadow-md p-3">
          <p className="text-sm font-body font-semibold text-ink-primary">{payload[0]?.name}</p>
          <p className="text-xs font-mono font-semibold text-accent DEFAULT">{payload[0]?.value}% of orders</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light rounded-xl">
              <BarChart3 className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-4xl text-brand-900">Gig analytics</h1>
          </div>
          <p className="text-ink-secondary font-body">Track your performance and identify growth opportunities</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-border rounded-lg p-0.5 flex items-center shadow-sm">
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '3m', label: '3 Months' },
            ].map(tr => (
              <button
                key={tr.id}
                onClick={() => setTimeRange(tr.id)}
                className={`px-4 py-1.5 text-xs font-body font-medium rounded-md transition-all ${
                  timeRange === tr.id
                    ? "bg-brand-900 text-white shadow-sm"
                    : "text-ink-tertiary hover:text-ink-secondary"
                }`}
              >
                {tr.label}
              </button>
            ))}
          </div>
          <button className="flex items-center justify-center w-9 h-9 bg-white border border-border rounded-lg hover:bg-surface-muted transition-colors">
            <Download className="w-4 h-4 text-ink-tertiary" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              whileHover={{ y: -2 }}
              className="bg-white border border-border rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <span className={`text-xs font-mono font-medium px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                  stat.isUp
                    ? "bg-accent-light text-accent-dark"
                    : "bg-danger-light text-danger"
                }`}>
                  {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </span>
              </div>
              <div>
                <h4 className="font-mono font-bold text-xl text-ink-primary">{stat.value}</h4>
                <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mt-0.5">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-6">

          {/* Traffic Trends Area Chart */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-display font-semibold text-base text-brand-900 mb-5">Traffic & engagement trends</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#A8A29E', fontFamily: 'DM Sans' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#A8A29E', fontFamily: 'DM Sans' }}
                  />
                  <Tooltip content={<CustomAreaTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="impressions"
                    name="Impressions"
                    stroke="#16A34A"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorImpressions)"
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    name="Clicks"
                    stroke="#2563EB"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorClicks)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent DEFAULT" />
                <span className="text-xs font-body font-medium text-ink-secondary">Impressions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-info DEFAULT" />
                <span className="text-xs font-body font-medium text-ink-secondary">Clicks</span>
              </div>
            </div>
          </div>

          {/* Revenue Growth Bar Chart */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-display font-semibold text-base text-brand-900 mb-5">Revenue growth (KES)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#A8A29E', fontFamily: 'DM Sans' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#A8A29E', fontFamily: 'DM Sans' }}
                    tickFormatter={(value) => `KES ${value}`}
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#F4F4F1', opacity: 0.4 }} />
                  <Bar
                    dataKey="impressions"
                    name="Revenue"
                    fill="#16A34A"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar - Demographics & Insights */}
        <div className="space-y-6">

          {/* Insights Card */}
          <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-5 text-white shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-light" />
                <h3 className="font-body font-semibold text-white">Performance insights</h3>
              </div>
              <span className="px-2 py-0.5 bg-white/20 rounded-md text-xs font-mono font-medium">3 insights</span>
            </div>

            <div className="space-y-3">
              <div className="bg-white/10 p-3 rounded-xl border border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
                <h4 className="text-sm font-body font-semibold text-white mb-1 flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-accent-light" /> Improve conversion
                </h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  Adding a promotional video could increase conversion by up to 22%
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
                <h4 className="text-sm font-body font-semibold text-white mb-1 flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-accent-light" /> Upsell opportunity
                </h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  35% of buyers ask for faster delivery. Consider adding as premium add-on
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
                <h4 className="text-sm font-body font-semibold text-white mb-1 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-accent-light" /> Keyword ranking
                </h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  Update your description with high-volume keywords to improve search ranking
                </p>
              </div>
            </div>
          </div>

          {/* Demographics Pie Chart */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-display font-semibold text-base text-brand-900 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-accent DEFAULT" /> Top buyer countries
            </h3>

            <div className="h-48 w-full relative mb-5">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DEMOGRAPHICS_DATA}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {DEMOGRAPHICS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-mono font-bold text-2xl text-ink-primary">32</span>
                <span className="text-xs font-body font-medium text-ink-tertiary uppercase">Orders</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              {DEMOGRAPHICS_DATA.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }} />
                    <span className="text-xs font-body font-medium text-ink-secondary">{d.name}</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-ink-primary">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
