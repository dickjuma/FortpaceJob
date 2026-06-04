import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2, TrendingUp, DollarSign, Briefcase, Star,
  Clock, Users, Download, RefreshCw, AlertCircle, Calendar,
  CheckCircle, ArrowUpRight, Award
} from 'lucide-react';
import { useClientAnalytics, useMyContracts, useMyJobs, useWallet, useTransactions } from '../services/clientHooks';
import toast, { Toaster } from 'react-hot-toast';

const DATE_RANGES = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '1Y', days: 365 },
];

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-zinc-400 mt-1">{label}</p>
      {sub && <p className="text-[10px] text-zinc-600 mt-0.5">{sub}</p>}
    </div>
  );
}

function SimpleBar({ value, max, color = 'bg-success' }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function ClientAnalyticsPage() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState(30);

  const { data: analytics, isLoading: analyticsLoading, error: analyticsError, refetch } = useClientAnalytics({ days: dateRange });
  const { data: contractsData } = useMyContracts({ limit: 100 });
  const { data: jobsData } = useMyJobs({ limit: 100 });
  const { data: wallet } = useWallet();
  const { data: txData } = useTransactions({ limit: 200 });

  const contracts = contractsData?.items || [];
  const jobs = jobsData?.items || [];
  const transactions = txData?.items || [];

  // Derive metrics from real data
  const activeContracts = contracts.filter(c => c.status === 'ACTIVE').length;
  const completedContracts = contracts.filter(c => c.status === 'COMPLETED').length;
  const totalContracts = contracts.length;

  const openJobs = jobs.filter(j => j.status === 'OPEN').length;
  const totalJobs = jobs.length;

  const totalSpent = transactions
    .filter(t => ['DEBIT', 'ESCROW'].includes(t.type))
    .reduce((s, t) => s + Number(t.amount || 0), 0);

  const totalReleased = transactions
    .filter(t => t.type === 'RELEASE')
    .reduce((s, t) => s + Number(t.amount || 0), 0);

  const availableBalance = Number(wallet?.availableBalance ?? wallet?.balance ?? 0);
  const lockedBalance = Number(wallet?.lockedBalance ?? wallet?.escrowBalance ?? 0);

  // Proposal stats from jobs
  const totalProposals = jobs.reduce((s, j) => s + (j.proposals?.length || 0), 0);

  // Contract completion rate
  const completionRate = totalContracts > 0 ? Math.round((completedContracts / totalContracts) * 100) : 0;

  // Spending by month (last 6 months from transactions)
  const monthlySpend = (() => {
    const map = {};
    transactions.filter(t => ['DEBIT', 'ESCROW'].includes(t.type)).forEach(t => {
      const key = new Date(t.createdAt).toLocaleString('default', { month: 'short' });
      map[key] = (map[key] || 0) + Number(t.amount || 0);
    });
    return Object.entries(map).slice(-6).map(([month, amount]) => ({ month, amount }));
  })();
  const maxMonthly = Math.max(...monthlySpend.map(m => m.amount), 1);

  // Top categories from jobs
  const categoryMap = {};
  jobs.forEach(j => {
    if (j.category) categoryMap[j.category] = (categoryMap[j.category] || 0) + 1;
  });
  const topCategories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleExport = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Jobs Posted', totalJobs],
      ['Open Jobs', openJobs],
      ['Total Proposals', totalProposals],
      ['Active Contracts', activeContracts],
      ['Completed Contracts', completedContracts],
      ['Completion Rate (%)', completionRate],
      ['Total Spent (KES)', totalSpent],
      ['Available Balance (KES)', availableBalance],
      ['Locked in Escrow (KES)', lockedBalance],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forte-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Analytics exported to CSV');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 overflow-y-auto custom-scrollbar">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-success" /> Analytics
            </h1>
            <p className="text-sm text-zinc-400 mt-1">Real-time insights from your hiring activity</p>
          </div>
          <div className="flex gap-2">
            {/* Date Range Selector */}
            <div className="flex bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
              {DATE_RANGES.map(({ label, days }) => (
                <button
                  key={days}
                  onClick={() => setDateRange(days)}
                  className={`px-3 py-2 text-xs font-bold transition-colors ${
                    dateRange === days ? 'bg-success text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button onClick={refetch} className="p-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={handleExport} className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-300 font-bold hover:bg-zinc-700 transition-colors">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Jobs Posted" value={totalJobs} icon={Briefcase} color="text-success bg-success/10" />
          <StatCard label="Open Jobs" value={openJobs} icon={Clock} color="text-yellow-400 bg-yellow-400/10" />
          <StatCard label="Total Proposals" value={totalProposals} icon={Users} color="text-blue-400 bg-blue-400/10" />
          <StatCard label="Active Contracts" value={activeContracts} icon={CheckCircle} color="text-success bg-success/10" />
          <StatCard label="Completion Rate" value={`${completionRate}%`} icon={Award} color="text-orange-400 bg-orange-400/10" sub={`${completedContracts}/${totalContracts} contracts`} />
          <StatCard label="Total Spent" value={`KES ${totalSpent.toLocaleString()}`} icon={DollarSign} color="text-red-400 bg-red-400/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Spending Chart */}
          <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-white">Monthly Spending (KES)</h2>
              <span className="text-xs text-zinc-500">Last 6 months</span>
            </div>
            {monthlySpend.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-zinc-500 text-sm">
                No spending data in selected period.
              </div>
            ) : (
              <div className="flex items-end gap-3 h-48">
                {monthlySpend.map(({ month, amount }) => {
                  const pct = maxMonthly ? (amount / maxMonthly) * 100 : 0;
                  return (
                    <div key={month} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[10px] text-zinc-500">KES {(amount / 1000).toFixed(0)}k</span>
                      <div className="w-full bg-zinc-800 rounded-t-lg overflow-hidden" style={{ height: '120px' }}>
                        <div
                          className="w-full bg-gradient-to-t from-success to-success rounded-t-lg transition-all duration-700"
                          style={{ height: `${pct}%`, marginTop: 'auto' }}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-400 font-bold">{month}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Wallet Summary */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-white">Wallet Summary</h2>
            <div className="space-y-3">
              {[
                { label: 'Available Balance', value: availableBalance, color: 'text-success', bar: 'bg-success' },
                { label: 'In Escrow', value: lockedBalance, color: 'text-yellow-400', bar: 'bg-yellow-400' },
                { label: 'Total Released', value: totalReleased, color: 'text-blue-400', bar: 'bg-blue-400' },
              ].map(({ label, value, color, bar }) => {
                const max = Math.max(availableBalance, lockedBalance, totalReleased, 1);
                return (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-zinc-400">{label}</span>
                      <span className={`font-bold ${color}`}>KES {value.toLocaleString()}</span>
                    </div>
                    <SimpleBar value={value} max={max} color={bar} />
                  </div>
                );
              })}
            </div>
            <div className="pt-2 border-t border-zinc-800">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Total Spent (All Time)</span>
                <span className="font-bold text-red-400">KES {totalSpent.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={() => navigate('/client/wallet')} className="w-full text-center text-xs font-bold text-success hover:text-white transition-colors">
              Manage Wallet →
            </button>
          </div>
        </div>

        {/* Job & Contract Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Top Job Categories */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <h2 className="font-bold text-white mb-4">Jobs by Category</h2>
            {topCategories.length === 0 ? (
              <p className="text-zinc-500 text-sm">No job category data yet.</p>
            ) : (
              <div className="space-y-3">
                {topCategories.map(([cat, count]) => (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-zinc-300">{cat}</span>
                      <span className="text-zinc-400 font-bold">{count} job{count !== 1 ? 's' : ''}</span>
                    </div>
                    <SimpleBar value={count} max={topCategories[0][1]} color="bg-success" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hiring Funnel */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <h2 className="font-bold text-white mb-4">Hiring Funnel</h2>
            <div className="space-y-4">
              {[
                { label: 'Jobs Posted', value: totalJobs, color: 'bg-success' },
                { label: 'Proposals Received', value: totalProposals, color: 'bg-blue-400' },
                { label: 'Contracts Created', value: totalContracts, color: 'bg-yellow-400' },
                { label: 'Contracts Completed', value: completedContracts, color: 'bg-success' },
              ].map((item, i) => {
                const max = Math.max(totalJobs, 1);
                const widthPct = Math.round((item.value / max) * (100 - i * 15));
                return (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="text-xs text-zinc-400 w-36 shrink-0">{item.label}</span>
                    <div className="flex-1 h-7 bg-zinc-800 rounded-xl overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-xl transition-all duration-700 flex items-center px-3`}
                        style={{ width: `${Math.max(widthPct, 8)}%` }}
                      >
                        <span className="text-xs font-bold text-white">{item.value}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Contracts Table */}
        {contracts.length > 0 && (
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
              <h2 className="font-bold text-white">Recent Contracts</h2>
              <button onClick={() => navigate('/client/contracts')} className="text-xs text-success hover:text-white transition-colors font-bold">View All →</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left px-5 py-3 text-xs text-zinc-500 font-bold">Contract</th>
                    <th className="text-left px-5 py-3 text-xs text-zinc-500 font-bold">Freelancer</th>
                    <th className="text-left px-5 py-3 text-xs text-zinc-500 font-bold">Value</th>
                    <th className="text-left px-5 py-3 text-xs text-zinc-500 font-bold">Status</th>
                    <th className="text-left px-5 py-3 text-xs text-zinc-500 font-bold">Date</th>
                    <th className="text-right px-5 py-3 text-xs text-zinc-500 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {contracts.slice(0, 8).map(c => (
                    <tr key={c.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-white">#{c.id}</td>
                      <td className="px-5 py-3.5 text-zinc-300">{c.freelancer?.name || '—'}</td>
                      <td className="px-5 py-3.5 text-success font-bold">KES {Number(c.totalAmount || 0).toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          c.status === 'ACTIVE' ? 'bg-success/10 text-success border-success/20' :
                          c.status === 'COMPLETED' ? 'bg-#2bb75c]/10 text-blue-400 border-#2bb75c]/20' :
                          c.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          'bg-zinc-500/10 text-zinc-400 border-zinc-600/20'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-zinc-500 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button onClick={() => navigate(`/client/contracts/${c.id}`)} className="flex items-center gap-1 text-xs text-success hover:text-white transition-colors ml-auto">
                          View <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

