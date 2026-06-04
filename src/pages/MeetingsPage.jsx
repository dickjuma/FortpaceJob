import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Video, Loader2, AlertCircle, RefreshCw, User } from 'lucide-react';
import { workAPI } from '../common/services/api';

function normalizeInterviews(response) {
  const raw = response?.data ?? response?.items ?? response ?? [];
  return Array.isArray(raw) ? raw : [];
}

export default function MeetingsPage() {
  const { data: interviews = [], isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['meetings', 'interviews'],
    queryFn: () => workAPI.getInterviews(),
    select: normalizeInterviews,
    staleTime: 60_000,
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Video className="w-6 h-6 text-[#2bb75c]" /> Meetings & Interviews
            </h1>
            <p className="text-sm text-zinc-400 mt-1">Scheduled video calls and interview sessions</p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-sm hover:bg-zinc-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-[#2bb75c]" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 bg-zinc-900/40 rounded-2xl border border-zinc-800">
            <AlertCircle className="w-10 h-10 text-red-400 opacity-60" />
            <p className="text-zinc-400 text-sm">Failed to load meetings.</p>
            <button onClick={() => refetch()} className="text-xs text-[#2bb75c] hover:underline">Retry</button>
          </div>
        ) : interviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 bg-zinc-900/40 rounded-2xl border border-zinc-800">
            <Calendar className="w-12 h-12 text-zinc-600" />
            <p className="text-zinc-400 text-sm">No scheduled meetings yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {interviews.map((item) => {
              const scheduled = item.scheduledAt ? new Date(item.scheduledAt) : null;
              return (
                <div
                  key={item.id}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#2bb75c]/10 text-[#2bb75c] border border-[#2bb75c]/20">
                          {item.status || 'SCHEDULED'}
                        </span>
                        {item.jobId && (
                          <span className="text-xs text-zinc-500">Job {item.jobId}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-white font-medium">
                        <User className="w-4 h-4 text-zinc-500" />
                        {item.freelancerId || item.participantName || 'Interview session'}
                      </div>
                      {scheduled && (
                        <div className="flex items-center gap-4 text-sm text-zinc-400">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {scheduled.toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {scheduled.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}
                      {item.notes && (
                        <p className="text-sm text-zinc-500">{item.notes}</p>
                      )}
                    </div>
                    {item.videoLink && (
                      <a
                        href={item.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2bb75c] hover:bg-[#1d8d38] text-white rounded-xl text-sm font-bold transition-colors shrink-0"
                      >
                        <Video className="w-4 h-4" /> Join Meeting
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

