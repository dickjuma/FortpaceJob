import React, { useEffect, useMemo, useState } from 'react';
import { Briefcase, CheckCircle2, Eye, Loader2, MoreVertical, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getClientPostedJobs,
  subscribeToFindWorkData,
  syncPostedJobsWithBackend,
} from './findWorkData';

function getStatusColor(status) {
  switch (status) {
    case 'open':
      return 'bg-[#14a800]/10 text-[#14a800] border-[#14a800]/20';
    case 'in_progress':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'completed':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'closed':
      return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    default:
      return 'bg-zinc-100 text-zinc-700';
  }
}

function getStatusLabel(status) {
  return status.replace('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function ClientPostedWork() {
  const [activeTab, setActiveTab] = useState('open');
  const [loading, setLoading] = useState(true);
  const [postings, setPostings] = useState([]);

  useEffect(() => {
    let mounted = true;
    const refresh = () => {
      if (mounted) setPostings(getClientPostedJobs());
    };

    setLoading(true);
    syncPostedJobsWithBackend().finally(() => {
      if (mounted) {
        refresh();
        setLoading(false);
      }
    });

    const unsubscribe = subscribeToFindWorkData(refresh);
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const visibleJobs = postings.filter((posting) => posting.status === activeTab);

  const stats = useMemo(() => {
    const totalApplications = postings.reduce((sum, posting) => sum + (posting.job?.applicants || 0), 0);
    const averageBudget = postings.length
      ? Math.round(postings.reduce((sum, posting) => sum + (posting.job?.budgetValue || 0), 0) / postings.length)
      : 0;
    const hired = postings.filter((posting) => posting.hire || posting.status === 'completed').length;
    const hireRate = postings.length ? Math.round((hired / postings.length) * 100) : 0;
    return { totalApplications, averageBudget, hireRate };
  }, [postings]);

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-zinc-900 mb-1">My Job Postings</h1>
              <p className="text-zinc-600 font-medium">Manage open jobs, review applications, and track active contracts from the shared marketplace model.</p>
            </div>
            <Link to="/post-job" className="px-6 py-3 bg-[#14a800] hover:bg-[#118a00] text-white font-bold rounded-xl shadow-sm transition-colors">
              Post a New Job
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="text-sm font-bold text-zinc-500 mb-1">Total Jobs Posted</div>
              <div className="text-3xl font-black text-zinc-900">{postings.length}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="text-sm font-bold text-zinc-500 mb-1">Total Applications</div>
              <div className="text-3xl font-black text-[#14a800]">{stats.totalApplications}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="text-sm font-bold text-zinc-500 mb-1">Avg Budget</div>
              <div className="text-3xl font-black text-success">KES {stats.averageBudget.toLocaleString()}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="text-sm font-bold text-zinc-500 mb-1">Hire Rate</div>
              <div className="text-3xl font-black text-[#14a800]">{stats.hireRate}%</div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="flex overflow-x-auto border-b border-zinc-200 hide-scrollbar bg-surface/50">
              {['open', 'in_progress', 'completed', 'closed'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 font-bold text-sm whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab ? 'border-[#14a800]/20 text-[#14a800] bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-surface'
                  }`}
                >
                  {getStatusLabel(tab)} ({postings.filter((posting) => posting.status === tab).length})
                </button>
              ))}
            </div>

            <div className="p-0">
              {loading ? (
                <div className="py-16 text-center text-zinc-500">
                  <Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin text-[#14a800]" />
                  Loading your posted jobs...
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface hidden md:table-header-group border-b border-zinc-200">
                    <tr>
                      <th className="p-6 font-bold text-zinc-500 text-sm">Job Posting</th>
                      <th className="p-6 font-bold text-zinc-500 text-sm text-center">Applicants</th>
                      <th className="p-6 font-bold text-zinc-500 text-sm text-center">Views</th>
                      <th className="p-6 font-bold text-zinc-500 text-sm">Status</th>
                      <th className="p-6 font-bold text-zinc-500 text-sm text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 block md:table-row-group">
                    {visibleJobs.map((posting) => (
                      <tr key={posting.job.id} className="hover:bg-surface transition-colors block md:table-row border-b md:border-b-0 border-zinc-100 last:border-0 p-4 md:p-0">
                        <td className="p-2 md:p-6 block md:table-cell">
                          <Link to={posting.job.detailPath} className="font-bold text-lg text-zinc-900 hover:text-[#14a800] transition-colors mb-1 block">
                            {posting.job.title}
                          </Link>
                          <div className="text-sm text-zinc-500 font-medium">
                            {posting.job.budgetLabel} / {posting.job.postedLabel}
                          </div>
                          {posting.hire ? (
                            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-success bg-emerald-50 px-2.5 py-1 rounded-lg inline-flex">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Hired: {posting.hire}
                            </div>
                          ) : null}
                        </td>

                        <td className="p-2 md:p-6 md:text-center block md:table-cell">
                          <div className="md:hidden text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Applicants</div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#14a800]/5 text-[#14a800] font-bold rounded-lg border border-[#14a800]/20">
                            <Users className="w-4 h-4" /> {posting.job.applicants}
                          </div>
                        </td>

                        <td className="p-2 md:p-6 md:text-center block md:table-cell">
                          <div className="md:hidden text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Views</div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 text-zinc-600 font-bold rounded-lg border border-zinc-200">
                            <Eye className="w-4 h-4" /> {posting.views}
                          </div>
                        </td>

                        <td className="p-2 md:p-6 block md:table-cell">
                          <span className={`px-3 py-1 border rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap inline-block ${getStatusColor(posting.status)}`}>
                            {getStatusLabel(posting.status)}
                          </span>
                        </td>

                        <td className="p-2 md:p-6 md:text-right block md:table-cell">
                          <div className="flex items-center md:justify-end gap-2 mt-2 md:mt-0">
                            {posting.status === 'open' ? (
                              <Link to={`/find-work/work/${posting.job.id}/applications`} className="px-4 py-2 bg-[#14a800] hover:bg-[#118a00] text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                                Review
                              </Link>
                            ) : null}
                            {posting.status === 'in_progress' && posting.orderId ? (
                              <Link to={`/find-work/orders/${posting.orderId}`} className="px-4 py-2 bg-surface-dark hover:bg-zinc-800 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                                Contract
                              </Link>
                            ) : null}
                            <button type="button" className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 rounded-lg transition-colors">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {visibleJobs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-zinc-500 font-medium">
                          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-20" />
                          No jobs found in this status.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
