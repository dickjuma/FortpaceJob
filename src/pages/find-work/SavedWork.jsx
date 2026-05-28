import React, { useState } from 'react';
import { Bookmark, Clock, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSavedFindWorkJobs } from './findWorkData';

export default function SavedWork() {
  const [savedJobs, setSavedJobs] = useState(getSavedFindWorkJobs());

  const handleRemove = (jobId) => {
    setSavedJobs((current) => current.filter((job) => job.id !== jobId));
  };

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center shadow-sm">
              <Bookmark className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-zinc-900">Saved Jobs</h1>
              <p className="text-zinc-600 font-medium">Keep track of high-priority opportunities you want to revisit quickly.</p>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm min-h-[400px]">
            {savedJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-400 py-20">
                <Bookmark className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-bold text-zinc-500 mb-4">No saved jobs yet.</p>
                <Link to="/find-work" className="px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors">
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedJobs.map((job) => (
                  <div key={job.id} className="border border-zinc-100 rounded-2xl p-5 hover:border-brand-200 hover:shadow-sm transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                    <div className="flex-1">
                      <Link to={job.detailPath} className="text-lg font-bold text-zinc-900 hover:text-brand-600 transition-colors mb-1 block">
                        {job.title}
                      </Link>
                      <div className="flex items-center gap-3 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 flex-wrap">
                        <span className={job.workMode === 'local' ? 'text-success' : 'text-brand-600'}>{job.workModeLabel}</span>
                        <span className="text-zinc-300">/</span>
                        <span className="text-zinc-900">{job.budgetLabel}</span>
                        <span className="text-zinc-300">/</span>
                        <span className="text-zinc-500">{job.client.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                        <Clock className="w-3.5 h-3.5" /> Saved {job.savedAtLabel}
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleRemove(job.id)}
                        className="p-3 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-zinc-200 hover:border-rose-200 sm:border-transparent bg-white sm:bg-transparent shadow-sm sm:shadow-none flex-1 sm:flex-none flex justify-center"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <Link to={job.proposalPath} className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors flex-1 sm:flex-none text-center shadow-sm">
                        Apply
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
