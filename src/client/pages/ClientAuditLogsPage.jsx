import React from 'react';
import { ScrollText, ShieldCheck, Activity, AlertTriangle, AlertCircle, Clock, FileText } from 'lucide-react';
import { useWorkspaceActivityLog } from '../services/clientHooks';

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

export default function ClientAuditLogsPage() {
  const { data, isLoading, error, refetch } = useWorkspaceActivityLog({ limit: 100 });
  const events = data?.items || [];
  const security = events.filter((event) => event.source === 'notification' || /SECURITY|LOGIN|AUTH/i.test(event.action || '')).length;
  const hiring = events.filter((event) => event.source === 'job' || event.source === 'contract').length;
  const payment = events.filter((event) => event.source === 'order').length;

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
                  <ScrollText className="h-4 w-4" />
                  Client Workspace
                </div>
                <h1 className="text-2xl font-black tracking-tight sm:text-4xl">Audit Logs</h1>
                <p className="mt-3 max-w-2xl text-sm font-medium text-white/85 sm:text-base">
                  Review client-visible audit trail events across hiring, contracts, payments, and notifications.
                </p>
              </div>
              <div className="hidden rounded-2xl bg-white/15 p-3 backdrop-blur sm:flex">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-b border-gray-200 p-6 sm:grid-cols-3 sm:p-8">
            <StatCard icon={Activity} label="Audit Events" value={events.length} sub="Recent client-visible records" />
            <StatCard icon={FileText} label="Hiring Audit" value={hiring} sub="Jobs, proposals, contracts" />
            <StatCard icon={AlertTriangle} label="Security Signals" value={security} sub="Notifications and security events" />
          </div>

          <div className="p-6 sm:p-8">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />)}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
                <AlertCircle className="mb-3 h-10 w-10" />
                <p className="font-bold">Failed to load audit logs.</p>
                <button onClick={() => refetch()} className="mt-3 rounded-lg bg-[#4C1D95] px-4 py-2 text-sm font-bold text-white">Retry</button>
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
                <ScrollText className="mb-3 h-12 w-12 text-gray-400" />
                <h2 className="text-lg font-black text-gray-900">No audit events yet</h2>
                <p className="mt-2 max-w-md text-sm text-gray-500">Hiring, contract, payment, and notification records will populate this audit trail.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                  <thead className="bg-gray-50 text-left text-xs font-black uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-4">Event</th>
                      <th className="px-5 py-4">Action</th>
                      <th className="px-5 py-4">Entity</th>
                      <th className="px-5 py-4">Payment Events</th>
                      <th className="px-5 py-4 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {events.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <p className="font-bold text-gray-900">{event.title}</p>
                          <p className="mt-1 text-xs text-gray-500">{event.description || 'Audit event recorded.'}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-[#4C1D95]/10 px-2.5 py-1 text-xs font-black text-[#4C1D95]">
                            {event.action}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-gray-700">{event.entity}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-gray-700">{payment}</span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 text-gray-500">
                            <Clock className="h-4 w-4" />
                            {formatTime(event.createdAt)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
