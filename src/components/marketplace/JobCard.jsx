import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Clock } from 'lucide-react';

export default function JobCard({ job }) {
  if (!job) return null;

  const isLocal = job.workMode === 'local';

  return (
    <article className="group flex flex-col h-full bg-white border border-zinc-200 rounded-xl p-5 hover:border-[#2bb75c]/40 hover:shadow-sm transition-all">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wide text-[#2bb75c]">
          {job.category?.name || 'General'}
        </span>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isLocal ? 'bg-amber-50 text-amber-700' : 'bg-zinc-100 text-zinc-600'
          }`}
        >
          {isLocal ? 'Local' : 'Remote'}
        </span>
      </div>

      <h3 className="font-semibold text-zinc-900 text-base leading-snug line-clamp-2 group-hover:text-[#1d8d38] mb-2">
        {job.title}
      </h3>

      {job.summary && (
        <p className="text-sm text-zinc-500 line-clamp-2 mb-4 flex-1">{job.summary}</p>
      )}

      <div className="flex items-center justify-between text-xs text-zinc-500 mt-auto pt-3 border-t border-zinc-100">
        <span className="font-bold text-zinc-900">{job.budgetLabel}</span>
        <div className="flex items-center gap-3">
          {job.applicants != null && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {job.applicants}
            </span>
          )}
          {job.locationLabel && (
            <span className="flex items-center gap-1 truncate max-w-[100px]">
              <MapPin className="w-3.5 h-3.5 shrink-0" /> {job.locationLabel}
            </span>
          )}
          {job.postedHoursAgo != null && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {job.postedHoursAgo}h
            </span>
          )}
        </div>
      </div>

      <Link
        to={job.detailPath || `/find-work/work/${job.id}`}
        className="mt-4 block text-center py-2.5 rounded-lg bg-zinc-900 text-white text-sm font-bold group-hover:bg-[#2bb75c] transition-colors"
      >
        View job
      </Link>
    </article>
  );
}

