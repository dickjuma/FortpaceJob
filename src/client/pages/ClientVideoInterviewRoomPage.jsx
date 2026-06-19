import React from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Video,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useInterviews } from '../services/clientHooks';

function formatDate(value) {
  if (!value) return 'Not scheduled';
  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function StatCard({ icon: Icon, label, value, sub, tone = 'from-[#4C1D95] to-[#22C55E]' }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${tone} text-white`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-2xl font-black text-gray-900">{value}</p>
      <p className="text-sm font-bold text-gray-700">{label}</p>
      <p className="mt-1 text-xs font-medium text-gray-500">{sub}</p>
    </div>
  );
}

export default function ClientVideoInterviewRoomPage() {
  const { data, isLoading, error, refetch } = useInterviews({ limit: 50 });
  const interviews = data?.items || [];
  const upcoming = interviews.filter((item) => !['COMPLETED', 'CANCELLED'].includes(item.status));
  const completed = interviews.filter((item) => item.status === 'COMPLETED');

  const copyLink = (link) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    toast.success('Interview link copied');
  };

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-[#4C1D95] to-[#22C55E] p-6 text-white sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                  <Video className="h-4 w-4" />
                  Client Workspace
                </div>
                <h1 className="text-2xl font-black tracking-tight sm:text-4xl">Video Interview Room</h1>
                <p className="mt-3 max-w-2xl text-sm font-medium text-white/85 sm:text-base">
                  Review scheduled interviews, open live meeting links, and move candidates through your hiring workflow.
                </p>
              </div>
              <Link
                to="/client/interviews"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#4C1D95] transition hover:bg-white/90"
              >
                <Plus className="h-4 w-4" />
                Manage Interviews
              </Link>
            </div>
          </div>

          <div className="grid gap-4 border-b border-gray-200 p-6 sm:grid-cols-3 sm:p-8">
            <StatCard icon={Calendar} label="Scheduled" value={interviews.length} sub="Interview records" />
            <StatCard icon={PlayCircle} label="Upcoming" value={upcoming.length} sub="Open or pending sessions" />
            <StatCard icon={CheckCircle2} label="Completed" value={completed.length} sub="Finished interviews" />
          </div>

          <div className="p-6 sm:p-8">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />)}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
                <AlertCircle className="mb-3 h-10 w-10" />
                <p className="font-bold">Failed to load interviews.</p>
                <button onClick={() => refetch()} className="mt-3 rounded-lg bg-[#4C1D95] px-4 py-2 text-sm font-bold text-white">Retry</button>
              </div>
            ) : interviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
                <Video className="mb-3 h-12 w-12 text-gray-400" />
                <h2 className="text-lg font-black text-gray-900">No interviews yet</h2>
                <p className="mt-2 max-w-md text-sm text-gray-500">Schedule an interview from the interview manager to see it here.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                  <thead className="bg-gray-50 text-left text-xs font-black uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-4">Candidate</th>
                      <th className="px-5 py-4">Role / Type</th>
                      <th className="px-5 py-4">Time</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {interviews.map((item) => {
                      const candidate = item.freelancer?.user || item.freelancer || item.candidate || {};
                      const name = candidate.name || [candidate.firstName, candidate.lastName].filter(Boolean).join(' ') || 'Candidate';
                      const isUpcoming = !['COMPLETED', 'CANCELLED'].includes(item.status);
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4C1D95]/10 font-black text-[#4C1D95]">
                                {String(name).slice(0, 1).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{name}</p>
                                <p className="text-xs text-gray-500">{item.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-900">{item.role || item.title || 'Interview'}</p>
                            <p className="text-xs text-gray-500">{item.type || 'Video interview'}</p>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="h-4 w-4" />
                              {formatDate(item.scheduledAt || item.date)}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${isUpcoming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                              {item.status || 'SCHEDULED'}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              {item.meetingLink && (
                                <button
                                  onClick={() => copyLink(item.meetingLink)}
                                  className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                                >
                                  Copy Link
                                </button>
                              )}
                              {item.meetingLink ? (
                                <a
                                  href={item.meetingLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 rounded-lg bg-[#4C1D95] px-3 py-2 text-xs font-bold text-white hover:bg-[#4C1D95]/90"
                                >
                                  Open Room
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-xs font-bold text-gray-500">
                                  <Users className="h-3.5 w-3.5" />
                                  No link
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
