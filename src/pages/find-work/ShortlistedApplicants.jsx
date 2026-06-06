import React, { useCallback, useEffect, useState } from 'react';
import { Bookmark, Star, ArrowLeft, MessageSquare, Trash2, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { proposalAPI, publicAPI, userAPI } from '../../common/services/api';
import { syncJobsWithBackend } from './findWorkData';

function extractList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
}

const ShortlistedApplicants = () => {
  const { workId } = useParams();
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await syncJobsWithBackend({ limit: 100 });
      const [jobResponse, proposalsResponse] = await Promise.all([
        publicAPI.getJobById(workId).catch(() => null),
        proposalAPI.getProposalsForRequest(workId),
      ]);
      if (jobResponse?.title) setJobTitle(jobResponse.title);

      const profiles = {};
      const shortlisted = extractList(proposalsResponse).filter(
        (p) => String(p.status || '').toUpperCase() === 'SHORTLISTED'
      );

      await Promise.all(
        shortlisted.map(async (proposal) => {
          if (!proposal.freelancerId || profiles[proposal.freelancerId]) return;
          try {
            profiles[proposal.freelancerId] = await userAPI.getProfile(proposal.freelancerId);
          } catch {
            profiles[proposal.freelancerId] = null;
          }
        })
      );

      setApplicants(
        shortlisted.map((proposal) => {
          const profile = profiles[proposal.freelancerId]?.profile || profiles[proposal.freelancerId] || {};
          const bid = Number(proposal.bidAmount || 0);
          return {
            id: String(proposal.id),
            provider: profile.displayName || profile.name || 'Professional',
            avatar: profile.avatar || '',
            rating: Number(profile.rating || 0),
            reviews: Number(profile.reviewCount || 0),
            bid,
            bidLabel: `${proposal.currency || 'KES'} ${bid.toLocaleString()}`,
            time: proposal.deliveryDays ? `${proposal.deliveryDays} days` : 'Flexible',
            country: profile.location || 'Kenya',
            title: jobResponse?.title || jobTitle || 'Job posting',
          };
        })
      );
    } catch (err) {
      toast.error(err.message || 'Could not load shortlisted applicants.');
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  }, [workId, jobTitle]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRemove = async (proposalId) => {
    try {
      await proposalAPI.updateProposalStatus(proposalId, 'rejected');
      toast.success('Removed from shortlist.');
      await loadData();
    } catch (err) {
      toast.error(err.message || 'Could not update shortlist.');
    }
  };

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">

          <Link to={`/find-work/work/${workId}/applications`} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[#4C1D95] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to All Applications
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shadow-sm">
              <Bookmark className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-zinc-900">Shortlisted Candidates</h1>
              <p className="text-zinc-600 font-medium">{jobTitle || 'Compare saved applicants for this job.'}</p>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm p-6 md:p-8">
            {loading ? (
              <div className="py-20 text-center text-zinc-500">
                <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin text-[#4C1D95]" />
                <p className="font-medium">Loading shortlisted candidates...</p>
              </div>
            ) : applicants.length === 0 ? (
              <div className="py-20 text-center text-zinc-500">
                <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-medium">No candidates shortlisted yet.</p>
                <Link to={`/find-work/work/${workId}/applications`} className="inline-block mt-4 text-[#4C1D95] font-bold hover:underline">
                  Review all applications
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applicants.map((applicant) => (
                  <div key={applicant.id} className="border border-zinc-200 rounded-2xl p-6 hover:shadow-md transition-shadow relative">
                    <button
                      type="button"
                      onClick={() => handleRemove(applicant.id)}
                      className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove from shortlist"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                      {applicant.avatar ? (
                        <img src={applicant.avatar} alt={applicant.provider} className="w-16 h-16 rounded-full border border-zinc-200 object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-full border border-zinc-200 bg-[#4C1D95]/10 text-[#4C1D95] flex items-center justify-center text-xl font-black">
                          {applicant.provider.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-zinc-900 text-lg">{applicant.provider}</h3>
                        <div className="flex items-center gap-1 text-sm font-bold text-zinc-600">
                          <Star className="w-4 h-4 text-amber-500 fill-current" /> {applicant.rating} ({applicant.reviews})
                        </div>
                        <div className="text-xs font-medium text-zinc-500">{applicant.country}</div>
                      </div>
                    </div>

                    <div className="bg-surface p-4 rounded-xl border border-zinc-100 mb-6">
                      <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Bid</div>
                      <div className="text-xl font-black text-success">{applicant.bidLabel}</div>
                      <div className="text-sm font-medium text-zinc-600 mt-1">Delivery: {applicant.time}</div>
                    </div>

                    <div className="flex gap-2">
                      <Link to="/messages" className="flex-1 px-4 py-2.5 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                        <MessageSquare className="w-4 h-4" /> Message
                      </Link>
                      <Link to={`/find-work/work/${workId}/hire`} className="flex-1 px-4 py-2.5 bg-[#4C1D95] hover:bg-[#22C55E] text-white font-bold rounded-xl transition-colors text-sm text-center">
                        Hire
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
};

export default ShortlistedApplicants;


