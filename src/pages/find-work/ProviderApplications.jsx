import React, { useEffect, useState } from 'react';
import { CheckCircle2, ChevronRight, FileText, Loader2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getProviderApplications,
  subscribeToFindWorkData,
  syncApplicationsWithBackend,
} from './findWorkData';

function renderStatusBadge(status) {
  switch (status) {
    case 'pending':
      return <span className="px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold uppercase tracking-wider">Pending</span>;
    case 'interviewing':
      return <span className="px-3 py-1 bg-[#2bb75c]/10 text-[#2bb75c] border border-[#2bb75c]/20 rounded-lg text-xs font-bold uppercase tracking-wider">Interviewing</span>;
    case 'accepted':
      return (
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Hired
        </span>
      );
    case 'rejected':
      return <span className="px-3 py-1 bg-zinc-100 text-zinc-600 border border-zinc-200 rounded-lg text-xs font-bold uppercase tracking-wider">Declined</span>;
    default:
      return null;
  }
}

export default function ProviderApplications() {
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    let mounted = true;

    const refresh = () => {
      if (mounted) setApplications(getProviderApplications());
    };

    setLoading(true);
    syncApplicationsWithBackend()
      .finally(() => {
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

  const activeApps = applications.filter((application) => ['pending', 'interviewing', 'accepted', 'shortlisted'].includes(application.status));
  const archivedApps = applications.filter((application) => ['rejected', 'withdrawn'].includes(application.status));
  const displayApps = activeTab === 'active' ? activeApps : archivedApps;

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-[#2bb75c]/10 text-[#2bb75c] rounded-xl flex items-center justify-center shadow-sm">
              <FileText className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-zinc-900">My Proposals</h1>
              <p className="text-zinc-600 font-medium">Track proposals synced from your Fort Space account.</p>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="flex border-b border-zinc-200 bg-surface/50">
              <button
                type="button"
                onClick={() => setActiveTab('active')}
                className={`flex-1 sm:flex-none px-8 py-4 font-bold text-sm transition-colors border-b-2 ${
                  activeTab === 'active' ? 'border-[#2bb75c]/20 text-[#2bb75c] bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-surface'
                }`}
              >
                Active Proposals ({activeApps.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('archived')}
                className={`flex-1 sm:flex-none px-8 py-4 font-bold text-sm transition-colors border-b-2 ${
                  activeTab === 'archived' ? 'border-zinc-600 text-zinc-900 bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-surface'
                }`}
              >
                Archived ({archivedApps.length})
              </button>
            </div>

            <div className="divide-y divide-zinc-100">
              {loading ? (
                <div className="py-20 text-center text-zinc-500">
                  <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin text-[#2bb75c]" />
                  <p className="font-medium">Loading your proposals...</p>
                </div>
              ) : displayApps.length === 0 ? (
                <div className="py-20 text-center text-zinc-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-medium">No proposals in this section.</p>
                  <Link to="/find-work" className="inline-block mt-4 text-[#2bb75c] font-bold hover:underline">
                    Browse open jobs
                  </Link>
                </div>
              ) : (
                displayApps.map((application) => (
                  <div key={application.id} className="p-6 hover:bg-surface transition-colors group">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="mb-2">{renderStatusBadge(application.status)}</div>
                        <Link to={application.job.detailPath} className="text-xl font-bold text-zinc-900 hover:text-[#2bb75c] transition-colors mb-1 block">
                          {application.job.title}
                        </Link>
                        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-zinc-500">
                          <span className="text-zinc-900 font-bold">{application.job.client.name}</span>
                          <span className="text-zinc-300">/</span>
                          <span>Bid: <strong className="text-zinc-900">{application.amountLabel}</strong> ({application.typeLabel})</span>
                          <span className="text-zinc-300">/</span>
                          <span>Submitted {application.submittedLabel}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap md:flex-nowrap gap-2 w-full md:w-auto mt-4 md:mt-0">
                        {application.status === 'interviewing' ? (
                          <Link to="/messages" className="flex-1 md:flex-none px-6 py-2.5 bg-[#2bb75c] hover:bg-[#1d8d38] text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
                            <MessageCircle className="w-4 h-4" /> Message
                          </Link>
                        ) : null}
                        {application.status === 'pending' ? (
                          <Link to={`/find-work/my-applications/${application.id}/withdraw`} className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-zinc-300 hover:bg-surface text-zinc-700 font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
                            Withdraw
                          </Link>
                        ) : null}
                        {application.status === 'accepted' && application.orderId ? (
                          <Link to={`/find-work/orders/${application.orderId}`} className="flex-1 md:flex-none px-4 py-2.5 bg-success hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-colors">
                            View Order
                          </Link>
                        ) : null}
                        <Link to={application.job.detailPath} className="p-2.5 border border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors hidden md:flex items-center justify-center">
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

