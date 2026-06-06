import React, { useCallback, useEffect, useState } from 'react';
import { TrendingUp, BarChart2, Users, DollarSign, Loader2 } from 'lucide-react';
import { formatMoney, workAPI } from './findWorkWorkflow';

const WorkAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await workAPI.getAnalytics();
      setAnalytics(response?.data || response);
    } catch {
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalSpend = Number(analytics?.totalSpend ?? 0);
  const talentHired = Number(analytics?.completedContracts ?? analytics?.hires ?? 0);
  const avgJobCost = Number(analytics?.avgContractValue ?? 0);
  const hireRate = Number(analytics?.hireRate ?? 0);
  const jobsPosted = Number(analytics?.jobsPosted ?? 0);
  const monthlySpend = analytics?.monthlySpend || [];

  if (loading) {
    return (
      <div className="bg-surface min-h-screen py-20 flex flex-col items-center justify-center text-zinc-500">
        <Loader2 className="w-10 h-10 animate-spin text-[#4C1D95] mb-4" />
        <p className="font-medium">Loading analytics…</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-[#4C1D95]/10 text-[#4C1D95] rounded-xl flex items-center justify-center shadow-sm">
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
              <div className="text-3xl font-black text-zinc-900">{formatMoney(totalSpend)}</div>
              <div className="text-sm font-bold text-success mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> {analytics?.activeContracts ?? 0} active contracts
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#4C1D95]/10 text-[#4C1D95] rounded-lg"><Users className="w-5 h-5" /></div>
                <div className="font-bold text-zinc-500">Talent Hired</div>
              </div>
              <div className="text-3xl font-black text-zinc-900">{talentHired}</div>
              <div className="text-sm font-bold text-[#4C1D95] mt-2">{jobsPosted} jobs posted</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><BarChart2 className="w-5 h-5" /></div>
                <div className="font-bold text-zinc-500">Avg Job Cost</div>
              </div>
              <div className="text-3xl font-black text-zinc-900">{formatMoney(avgJobCost)}</div>
              <div className="text-sm font-medium text-zinc-500 mt-2">Per completed contract</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#4C1D95]/10 text-[#4C1D95] rounded-lg"><TrendingUp className="w-5 h-5" /></div>
                <div className="font-bold text-zinc-500">Hire Rate</div>
              </div>
              <div className="text-3xl font-black text-zinc-900">{hireRate}%</div>
              <div className="text-sm font-medium text-zinc-500 mt-2">Of posted jobs filled</div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Recent Contract Spend</h3>
            <p className="text-zinc-500 mb-8">Breakdown from your latest contracts.</p>
            {monthlySpend.length === 0 ? (
              <div className="h-64 bg-surface border-2 border-dashed border-zinc-200 rounded-2xl flex items-center justify-center">
                <span className="text-zinc-400 font-bold">No spend data yet</span>
              </div>
            ) : (
              <div className="space-y-4">
                {monthlySpend.map((entry, index) => (
                  <div key={entry.index ?? index} className="flex items-center justify-between p-4 bg-surface border border-zinc-200 rounded-xl">
                    <span className="font-bold text-zinc-700">{entry.month || `Period ${index + 1}`}</span>
                    <span className="font-black text-zinc-900">{formatMoney(entry.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkAnalytics;


