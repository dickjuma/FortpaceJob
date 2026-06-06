import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Users, Filter, Star, CheckCircle2, XCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { proposalAPI, publicAPI, userAPI } from '../../common/services/api';
import { useConfirm } from '../../common/context/ConfirmContext';
import { getFindWorkJobById, subscribeToFindWorkData, syncJobsWithBackend } from './findWorkData';

function extractList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  return [];
}

function mapReviewStatus(status) {
  const value = String(status || 'PENDING').toUpperCase();
  if (value === 'SHORTLISTED') return 'shortlisted';
  if (value === 'PENDING') return 'new';
  return value.toLowerCase();
}

function mapProposalToCard(proposal, profileById) {
  const freelancerId = proposal.freelancerId;
  const profile = profileById[freelancerId] || {};
  const profileData = profile.profile || profile;
  const bid = Number(proposal.bidAmount ?? proposal.amount ?? 0);
  const currency = proposal.currency || 'KES';

  return {
    id: String(proposal.id),
    provider: profileData.displayName || profileData.name || profile.user?.name || 'Professional',
    avatar: profileData.avatar || profileData.avatarUrl || '',
    rating: Number(profileData.rating || 0),
    reviews: Number(profileData.reviewCount || profileData.reviews || 0),
    bid,
    bidLabel: `${currency} ${bid.toLocaleString()}`,
    time: proposal.deliveryDays ? `${proposal.deliveryDays} days` : 'Flexible',
    country: profileData.location || profileData.country || 'Kenya',
    badge: profileData.topRated ? 'Top Rated' : profileData.paymentVerified ? 'Verified' : 'Professional',
    status: mapReviewStatus(proposal.status),
    match: Math.min(99, 70 + Math.round((profileData.rating || 4) * 5)),
    coverLetter: proposal.coverLetter || proposal.message || '',
    freelancerId,
  };
}

const ViewApplications = () => {
  const { workId } = useParams();
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('match');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [applications, setApplications] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await syncJobsWithBackend({ limit: 100 });
      const cachedJob = getFindWorkJobById(workId);
      if (cachedJob?.title) {
        setJobTitle(cachedJob.title);
      }

      const [jobResponse, proposalsResponse] = await Promise.all([
        publicAPI.getJobById(workId).catch(() => null),
        proposalAPI.getProposalsForRequest(workId),
      ]);

      if (jobResponse?.title) {
        setJobTitle(jobResponse.title);
      }

      const proposals = extractList(proposalsResponse);
      const freelancerIds = [...new Set(proposals.map((p) => p.freelancerId).filter(Boolean))];
      const profileEntries = await Promise.all(
        freelancerIds.map(async (id) => {
          try {
            const profile = await userAPI.getProfile(id);
            return [id, profile];
          } catch {
            return [id, null];
          }
        })
      );
      const profileById = Object.fromEntries(profileEntries);
      setApplications(proposals.map((proposal) => mapProposalToCard(proposal, profileById)));
    } catch (err) {
      toast.error(err.message || 'Could not load applications.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [workId]);

  useEffect(() => {
    loadData();
    return subscribeToFindWorkData(() => {
      const job = getFindWorkJobById(workId);
      if (job?.title) setJobTitle(job.title);
    });
  }, [loadData, workId]);

  const summary = useMemo(() => {
    const shortlisted = applications.filter((app) => app.status === 'shortlisted').length;
    return { total: applications.length, shortlisted };
  }, [applications]);

  const displayedApps = useMemo(() => {
    let list = applications.filter((app) => (filter === 'all' ? true : app.status === filter));

    list = [...list].sort((a, b) => {
      if (sort === 'price_low') return a.bid - b.bid;
      if (sort === 'price_high') return b.bid - a.bid;
      if (sort === 'rating') return b.rating - a.rating;
      return b.match - a.match;
    });

    return list;
  }, [applications, filter, sort]);

  const handleShortlist = async (proposalId) => {
    setActionId(proposalId);
    try {
      await proposalAPI.updateProposalStatus(proposalId, 'shortlisted');
      toast.success('Applicant shortlisted.');
      await loadData();
    } catch (err) {
      toast.error(err.message || 'Could not shortlist applicant.');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (proposalId) => {
    const approved = await confirm({
      title: 'Reject application?',
      message: 'This freelancer will be notified that their proposal was declined.',
      confirmLabel: 'Reject',
      variant: 'danger',
    });
    if (!approved) return;

    setActionId(proposalId);
    try {
      await proposalAPI.updateProposalStatus(proposalId, 'rejected');
      toast.success('Application rejected.');
      await loadData();
    } catch (err) {
      toast.error(err.message || 'Could not reject application.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">

          <Link to="/find-work/my-posted-work" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[#4C1D95] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to My Jobs
          </Link>

          <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-zinc-900 mb-2">Review Applications</h1>
              <div className="text-zinc-600 font-medium">{jobTitle || 'Loading job...'}</div>
            </div>
            <div className="flex gap-4 text-center">
              <div className="bg-surface px-6 py-3 rounded-xl border border-zinc-100">
                <div className="text-2xl font-black text-[#4C1D95]">{summary.total}</div>
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total</div>
              </div>
              <div className="bg-surface px-6 py-3 rounded-xl border border-zinc-100">
                <div className="text-2xl font-black text-amber-500">{summary.shortlisted}</div>
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Shortlisted</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">

            <div className="lg:w-64 shrink-0 space-y-6">
              <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
                <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><Filter className="w-4 h-4" /> Views</h3>

                <div className="space-y-2">
                  <button onClick={() => setFilter('all')} type="button" className={`w-full text-left px-3 py-2 rounded-lg font-bold text-sm transition-colors ${filter === 'all' ? 'bg-[#4C1D95]/5 text-[#4C1D95]' : 'text-zinc-600 hover:bg-surface'}`}>
                    All Applications
                  </button>
                  <button onClick={() => setFilter('new')} type="button" className={`w-full text-left px-3 py-2 rounded-lg font-bold text-sm transition-colors ${filter === 'new' ? 'bg-[#4C1D95]/5 text-[#4C1D95]' : 'text-zinc-600 hover:bg-surface'}`}>
                    New / Unread
                  </button>
                  <button onClick={() => setFilter('shortlisted')} type="button" className={`w-full text-left px-3 py-2 rounded-lg font-bold text-sm transition-colors ${filter === 'shortlisted' ? 'bg-amber-50 text-amber-700' : 'text-zinc-600 hover:bg-surface'}`}>
                    Shortlisted
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
                <h3 className="font-bold text-zinc-900 mb-4">Sort By</h3>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-zinc-200 rounded-lg text-sm font-bold text-zinc-700 outline-none cursor-pointer"
                >
                  <option value="match">Best Match</option>
                  <option value="price_low">Lowest Price</option>
                  <option value="price_high">Highest Price</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              {loading ? (
                <div className="bg-white border border-zinc-200 rounded-3xl py-20 text-center shadow-sm">
                  <Loader2 className="w-10 h-10 text-[#4C1D95] animate-spin mx-auto mb-4" />
                  <p className="text-zinc-600 font-medium">Loading applications...</p>
                </div>
              ) : displayedApps.length === 0 ? (
                <div className="bg-white border border-zinc-200 rounded-3xl py-20 text-center shadow-sm">
                  <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-zinc-900 mb-1">No applications found</h3>
                  <p className="text-zinc-500 font-medium">Try adjusting your filters or check back when freelancers apply.</p>
                </div>
              ) : (
                displayedApps.map((app) => (
                  <div key={app.id} className="bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-md transition-shadow group relative overflow-hidden">
                    {app.status === 'shortlisted' && (
                      <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                        Shortlisted
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-6">

                      <div className="md:w-1/3 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-zinc-100 pb-6 md:pb-0 md:pr-6 shrink-0">
                        {app.avatar ? (
                          <img src={app.avatar} alt={app.provider} className="w-20 h-20 rounded-full mb-3 object-cover" />
                        ) : (
                          <div className="w-20 h-20 rounded-full mb-3 bg-[#4C1D95]/10 text-[#4C1D95] flex items-center justify-center text-2xl font-black">
                            {app.provider.charAt(0)}
                          </div>
                        )}
                        <h3 className="font-bold text-zinc-900 text-lg mb-1">{app.provider}</h3>
                        <div className="text-xs font-bold text-[#4C1D95] bg-[#4C1D95]/5 px-2 py-0.5 rounded uppercase tracking-wider mb-2">{app.badge}</div>
                        <div className="flex items-center gap-1 font-bold text-zinc-700 text-sm mb-1">
                          <Star className="w-4 h-4 text-amber-500 fill-current" /> {app.rating || '—'} ({app.reviews})
                        </div>
                        <div className="text-xs font-medium text-zinc-500">{app.country}</div>

                        <div className="mt-4 w-full">
                          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 text-left">Match Score</div>
                          <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-success" style={{ width: `${app.match}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap gap-6 mb-4 bg-surface p-4 rounded-xl border border-zinc-100">
                            <div>
                              <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Bid Amount</div>
                              <div className="text-xl font-black text-success">{app.bidLabel}</div>
                            </div>
                            <div>
                              <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Delivery Time</div>
                              <div className="text-xl font-black text-zinc-900">{app.time}</div>
                            </div>
                          </div>

                          <p className="text-sm font-medium text-zinc-700 line-clamp-3 mb-4">
                            {app.coverLetter || 'No cover letter provided.'}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-4">
                          <Link to="/messages" className="flex-1 px-4 py-2 bg-[#4C1D95] hover:bg-[#22C55E] text-white text-sm font-bold rounded-lg shadow-sm transition-colors text-center">
                            Message
                          </Link>
                          {app.status !== 'shortlisted' ? (
                            <button
                              type="button"
                              disabled={actionId === app.id}
                              onClick={() => handleShortlist(app.id)}
                              className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg shadow-sm transition-colors disabled:opacity-60"
                            >
                              Shortlist
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => navigate(`/find-work/work/${workId}/hire`)}
                            className="flex-1 px-4 py-2 bg-success hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Hire
                          </button>
                          <button
                            type="button"
                            disabled={actionId === app.id}
                            onClick={() => handleReject(app.id)}
                            className="px-3 py-2 bg-white border border-zinc-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-zinc-400 rounded-lg transition-colors disabled:opacity-60"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
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
};

export default ViewApplications;


