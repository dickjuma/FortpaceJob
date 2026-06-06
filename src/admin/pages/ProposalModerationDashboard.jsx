import React, { useState } from 'react';
import { ShieldAlert, Search, Filter, AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchModerationEvents } from '../api/marketplace/marketplace.api';

export default function ProposalModerationDashboard() {
  const [search, setSearch] = useState('');
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['admin', 'proposalModeration'],
    queryFn: fetchModerationEvents,
    staleTime: 30_000,
    retry: 1,
  });

  const visibleEvents = events.filter((event) => {
    if (!search.trim()) return true;
    const query = search.trim().toLowerCase();
    const haystack = [
      event.title,
      event.description,
      event.type,
      event.status,
      event.client?.name,
      event.clientName,
      event.freelancer?.name,
      event.freelancerName,
      event.reason,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(query);
  });

  const totalFlags = visibleEvents.length;
  const pendingReview = visibleEvents.filter((event) => {
    const status = String(event.status || '').toLowerCase();
    return ['pending', 'new', 'open', 'investigating', 'under_review', 'review'].includes(status);
  }).length;

  const criticalFlags = visibleEvents.filter((event) => {
    const severity = String(event.severity || '').toLowerCase();
    return severity === 'critical' || Number(event.score) > 90;
  }).length;

  const autoRejected = visibleEvents.filter((event) => {
    const action = String(event.action || event.type || '').toLowerCase();
    return action.includes('reject') || action.includes('auto');
  }).length;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-red-600" /> Proposal Moderation Center
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Live flagged proposal events from the backend, with risk scoring and moderation workflow.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Live Flags', value: totalFlags, borderClass: 'border-l-red-500' },
          { label: 'Pending Review', value: pendingReview, borderClass: 'border-l-yellow-500' },
          { label: 'Critical Alerts', value: criticalFlags, borderClass: 'border-l-orange-500' },
          { label: 'Auto-Detected', value: autoRejected, borderClass: 'border-l-emerald-500' },
        ].map((stat) => (
          <div key={stat.label} className={`bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm ${stat.borderClass}`}>
            <h3 className="text-sm font-medium text-gray-500 mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{isLoading ? '…' : stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between gap-4 bg-surface dark:bg-gray-800/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search proposals, events, or users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-[#2bb75c] focus:border-[#2bb75c]/20 text-sm"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-surface transition-colors text-sm font-medium">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4">Event</th>
                <th className="p-4">Score</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Parties</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {Array.from({ length: 7 }).map((cell) => (
                      <td key={cell} className="p-4 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg"></td>
                    ))}
                  </tr>
                ))
              ) : visibleEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    {error ? 'Unable to load moderation events.' : 'No moderation events matched your filter.'}
                  </td>
                </tr>
              ) : (
                visibleEvents.map((event) => {
                  const score = event.score ?? event.confidence ?? 0;
                  const severity = event.severity || event.priority || 'INFO';
                  const status = event.status || event.state || 'UNKNOWN';
                  const createdAt = event.createdAt ? new Date(event.createdAt).toLocaleString() : 'N/A';
                  const parties = [
                    event.freelancer?.name || event.freelancerName,
                    event.client?.name || event.clientName,
                  ]
                    .filter(Boolean)
                    .join(' / ');

                  return (
                    <tr key={event.id || event._id || `${event.type}-${createdAt}`} className="hover:bg-surface dark:hover:bg-gray-800/30 transition-colors">
                      <td className="p-4 font-medium text-gray-900 dark:text-white">{event.title || event.type || event.reason || 'Moderation event'}</td>
                      <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{score}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-black uppercase tracking-wider ${severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : severity === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {severity}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{parties || 'Unknown'}</td>
                      <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{status}</td>
                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{createdAt}</td>
                      <td className="p-4 text-right space-x-2 flex justify-end">
                        <button className="p-2 text-gray-400 hover:text-[#2bb75c] rounded-md transition-colors" title="Review details"><Eye className="w-4 h-4" /></button>
                        <button className="p-2 text-gray-400 hover:text-green-600 rounded-md transition-colors" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                        <button className="p-2 text-gray-400 hover:text-red-600 rounded-md transition-colors" title="Reject"><XCircle className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

