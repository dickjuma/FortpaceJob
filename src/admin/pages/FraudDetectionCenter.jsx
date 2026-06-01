import React from 'react';
import { ShieldAlert, Fingerprint, Activity, Users, AlertOctagon, ChevronLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import apiClient, { unwrapAdminResponse } from '../api/apiClient';

export default function FraudDetectionCenter() {
  const { data: fraudStats, isLoading: statsLoading, refetch } = useQuery({
    queryKey: ['admin', 'fraud-stats'],
    queryFn: async () => {
      const res = await apiClient.get('/fraud/stats');
      return unwrapAdminResponse(res).data || {};
    },
    staleTime: 60_000,
    refetchInterval: 120_000,
  });

  const { data: fraudTrend, isLoading: trendLoading } = useQuery({
    queryKey: ['admin', 'fraud-trend'],
    queryFn: async () => {
      const res = await apiClient.get('/fraud/trend?days=7');
      const d = unwrapAdminResponse(res).data;
      return Array.isArray(d) ? d : [];
    },
    staleTime: 60_000,
  });

  const { data: vectorData, isLoading: vectorLoading } = useQuery({
    queryKey: ['admin', 'fraud-vectors'],
    queryFn: async () => {
      const res = await apiClient.get('/fraud/vectors');
      const d = unwrapAdminResponse(res).data;
      return Array.isArray(d) ? d : [];
    },
    staleTime: 120_000,
  });

  const threatLevel = fraudStats?.threatLevel || 'UNKNOWN';
  const threatColor =
    threatLevel === 'CRITICAL' ? 'text-red-600' :
    threatLevel === 'ELEVATED' ? 'text-orange-500' :
    threatLevel === 'MODERATE' ? 'text-amber-500' :
    'text-emerald-600';

  const chartData = trendLoading || !fraudTrend?.length
    ? []
    : fraudTrend;

  const vectors = vectorLoading || !vectorData?.length
    ? []
    : vectorData;

  const maxVector = vectors.length > 0 ? Math.max(...vectors.map(v => v.count || 0)) : 1;

  const VECTOR_COLORS = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-[#14a800]', 'bg-#14a800]'];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link to="/admin/moderation" className="text-sm font-medium text-[#14a800] hover:text-[#14a800] mb-4 inline-flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Moderation
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Fingerprint className="w-8 h-8 mr-3 text-red-600" /> Fraud Detection & Intelligence
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time AI monitoring for duplicate accounts, mass bidding, and escrow circumvention.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={statsLoading}
          className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <RefreshCw size={18} className={statsLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl flex items-center justify-center mr-4 shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Threat Level</p>
            <p className={`text-2xl font-bold ${threatColor}`}>
              {statsLoading ? '…' : threatLevel}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl flex items-center justify-center mr-4 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Blocked Bids (7d)</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {statsLoading ? '…' : (fraudStats?.blockedBids7d ?? fraudStats?.blocked7d ?? '—')}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center">
          <div className="w-12 h-12 bg-[#14a800]/10 dark:bg-[#14a800]/30 text-[#14a800] rounded-xl flex items-center justify-center mr-4 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Suspended Accounts</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {statsLoading ? '…' : (fraudStats?.suspendedAccounts ?? fraudStats?.suspended ?? '—')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Trend Chart */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Threat Mitigation Velocity</h2>
          {trendLoading ? (
            <div className="h-80 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
          ) : chartData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-zinc-400 text-sm">No trend data available</div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                  <Line type="monotone" dataKey="attempts" name="Total Detected" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="blocked" name="Auto Blocked" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Top Fraud Vectors */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Fraud Vector Types</h2>
          {vectorLoading ? (
            <div className="space-y-4">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="h-10 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
              ))}
            </div>
          ) : vectors.length === 0 ? (
            <div className="py-10 text-center text-zinc-400 text-sm">No fraud vector data available.</div>
          ) : (
            <div className="space-y-4">
              {vectors.map((vector, idx) => (
                <div key={vector.type || idx}>
                  <div className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    <span>{vector.type || vector.name || 'Unknown vector'}</span>
                    <span>{(vector.count || 0).toLocaleString()} incidents</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className={`${VECTOR_COLORS[idx % VECTOR_COLORS.length]} h-2 rounded-full transition-all duration-700`}
                      style={{ width: `${((vector.count || 0) / maxVector) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {fraudStats?.activeCountermeasure && (
            <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl">
              <h4 className="text-sm font-bold text-red-800 dark:text-red-400 mb-1 flex items-center">
                <ShieldAlert className="w-4 h-4 mr-1" /> Active Countermeasure
              </h4>
              <p className="text-xs text-red-700 dark:text-red-500">
                {fraudStats.activeCountermeasure}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
