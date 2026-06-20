import React from 'react';
import { History, Activity, Briefcase, FileSignature, CreditCard, Bell, AlertCircle } from 'lucide-react';
import { useWorkspaceActivityLog } from '../services/clientHooks';

const ICONS = {
  JOB: Briefcase,
  CONTRACT: FileSignature,
  ORDER: CreditCard,
  NOTIFICATION: Bell,
};

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#4C1D95] to-[#22C55E] text-white">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-2xl font-black text-gray-900">{value}</p>
      <p className="text-sm font-bold text-gray-700">{label}</p>
      <p className="mt-1 text-xs font-medium text-gray-500">{sub}</p>
    </div>
  );
}

export default function ClientActivityLogsPage() {
  const { data, isLoading, error, refetch } = useWorkspaceActivityLog({ limit: 100 });
  const events = data?.items || [];
  const jobs = events.filter((event) => event.source === 'job').length;
  const contracts = events.filter((event) => event.source === 'contract').length;
  const orders = events.filter((event) => event.source === 'order').length;

  const formatTime = (value) => {
    if (!value) return 'Unknown time';
    return new Intl.DateTimeFormat('en-KE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  };

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-[#4C1D95] to-[#22C55E] p-6 text-white sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                  <History className="h-4 w-4" />
                  Client Workspace
                </div>
                <h1 className="text-2xl font-black tracking-tight sm:text-4xl">Activity Logs</h1>
                <p className="mt-3 max-w-2xl text-sm font-medium text-white/85 sm:text-base">
                  Track workspace activity from projects, contracts, gig orders, and notifications in one timeline.
                </p>
              </div>
              <div className="hidden rounded-2xl bg-white/15 p-3 backdrop-blur sm:flex">
                <Activity className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-b border-gray-200 p-6 sm:grid-cols-3 sm:p-8">
            <StatCard icon={Activity} label="Recent Events" value={events.length} sub="Latest client-visible activity" />
            <StatCard icon={Briefcase} label="Project Events" value={jobs} sub="Jobs and proposals" />
            <StatCard icon={FileSignature} label="Contract Events" value={contracts + orders} sub="Contracts, orders, payments" />
          </div>

          <div className="p-6 sm:p-8">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />)}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
                <AlertCircle className="mb-3 h-10 w-10" />
                <p className="font-bold">Failed to load activity logs.</p>
                <button onClick={() => refetch()} className="mt-3 rounded-lg bg-[#4C1D95] px-4 py-2 text-sm font-bold text-white">Retry</button>
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
                <History className="mb-3 h-12 w-12 text-gray-400" />
                <h2 className="text-lg font-black text-gray-900">No activity yet</h2>
                <p className="mt-2 max-w-md text-sm text-gray-500">Project, contract, order, and notification events will appear here as your workspace updates.</p>
              </div>
            ) : (
              <div className="relative space-y-4">
                {events.map((event) => {
                  const Icon = ICONS[event.entity] || Activity;
                  return (
                    <div key={event.id} className="relative grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 md:grid-cols-[auto_1fr_auto] md:items-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4C1D95]/10 text-[#4C1D95]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-black text-gray-900">{event.title}</p>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-gray-500">{event.action}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{event.description || 'Workspace event recorded.'}</p>
                      </div>
                      <div className="text-right text-xs font-medium text-gray-500">
                        <p>{formatTime(event.createdAt)}</p>
                        <p className="mt-1 uppercase tracking-wide">{event.source}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
