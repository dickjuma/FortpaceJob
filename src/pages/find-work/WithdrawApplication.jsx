import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { proposalAPI } from '../../common/services/api';
import { getProviderApplications, syncApplicationsWithBackend } from './findWorkData';

const WithdrawApplication = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    let mounted = true;
    syncApplicationsWithBackend().finally(() => {
      if (!mounted) return;
      const match = getProviderApplications().find((entry) => entry.id === String(appId));
      setApplication(match || null);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [appId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!agreed || submitting) return;

    setSubmitting(true);
    try {
      await proposalAPI.withdrawProposal(appId);
      toast.success('Proposal withdrawn.');
      navigate('/find-work/my-applications');
    } catch (err) {
      toast.error(err.message || 'Could not withdraw proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">

          <Link to="/find-work/my-applications" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[#14a800] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Applications
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Withdraw Application</h1>
            <p className="text-zinc-600 font-medium">Remove your proposal from consideration for this job.</p>
          </div>

          {loading ? (
            <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center text-zinc-500">
              <Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin text-[#14a800]" />
              Loading proposal details...
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm mb-6">

                <div className="bg-surface border border-zinc-200 rounded-xl p-4 mb-8">
                  <div className="text-sm font-bold text-zinc-500 mb-1">Proposal For:</div>
                  <div className="font-bold text-zinc-900 text-lg">
                    {application?.job?.title || 'Job posting'}
                  </div>
                  <div className="text-sm text-zinc-600 mt-1">
                    Submitted {application?.submittedLabel || 'recently'} • Bid: {application?.amountLabel || '—'}
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900">Are you sure?</h4>
                    <p className="text-sm font-medium text-amber-800 mt-1">Withdrawing an application cannot be undone. The client will no longer be able to hire you for this specific posting.</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Reason for withdrawal (Optional)</label>
                  <select className="w-full px-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-zinc-500 focus:outline-none font-medium text-zinc-900 cursor-pointer">
                    <option value="">Select a reason...</option>
                    <option value="no_longer_available">I am no longer available</option>
                    <option value="hired_elsewhere">I was hired for another job</option>
                    <option value="changed_mind">I changed my mind</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-zinc-300 text-[#14a800] focus:ring-[#14a800]/20"
                  />
                  <span className="text-sm font-medium text-zinc-700">I understand this action is permanent and cannot be reversed.</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!agreed || submitting}
                className="w-full py-4 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                Confirm Withdrawal
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default WithdrawApplication;
