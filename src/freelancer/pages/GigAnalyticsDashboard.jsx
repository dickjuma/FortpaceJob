import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Eye, DollarSign, Package, ChevronLeft, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const salesData = [
  { name: 'Jan', sales: 400, views: 2400 },
  { name: 'Feb', sales: 300, views: 1398 },
  { name: 'Mar', sales: 500, views: 3800 },
  { name: 'Apr', sales: 450, views: 3908 },
  { name: 'May', sales: 800, views: 4800 },
  { name: 'Jun', sales: 650, views: 3800 },
];

export default function GigAnalyticsDashboard() {
  const stats = [
    { name: 'Total Revenue', value: '$12.4K', change: '+24%', icon: DollarSign, color: 'text-green-600' },
    { name: 'Active Orders', value: '5', change: '+2', icon: ShoppingCart, color: 'text-[#2bb75c]' },
    { name: 'Gig Views (30d)', value: '14.2K', change: '+45%', icon: Eye, color: 'text-[#2bb75c]' },
    { name: 'Conversion Rate', value: '4.8%', change: '+1.2%', icon: TrendingUp, color: 'text-[#2bb75c]' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-8">
        <Link to="/freelancer/gigs" className="text-sm font-medium text-[#2bb75c] hover:text-[#2bb75c] mb-4 inline-flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to My Gigs
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Package className="w-8 h-8 mr-3 text-[#2bb75c]" /> Gig Business Analytics
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your marketplace performance, gig views, and conversion rates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-surface dark:bg-gray-800 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Revenue Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Chart */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Gig Views</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip cursor={{fill: '#F3F4F6', opacity: 0.4}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                <Bar dataKey="views" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

