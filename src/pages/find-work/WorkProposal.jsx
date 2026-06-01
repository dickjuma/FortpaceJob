import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, Briefcase, Clock, DollarSign, Paperclip, Send, Loader2 } from 'lucide-react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { proposalAPI } from '../../common/services/api';
import { useAuthStore } from '../../common/authStore';
import { useFindWorkJob } from '../../common/services/findWorkHooks';
import { useCheckoutFees } from '../../common/hooks/useCheckoutFees';
import QuotaPaywallModal from '../../components/subscription/QuotaPaywallModal';
import { useSubscriptionGate } from '../../common/hooks/useSubscriptionGate';
import {
  validateCoverLetter,
  validatePositiveNumber,
} from '../../common/utils/validation';

function parseDeliveryDays(estimate) {
  const match = String(estimate || '').match(/(\d+)/);
  return match ? Math.min(365, Math.max(1, parseInt(match[1], 10))) : 7;
}

export default function WorkProposal() {
  const { workId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const { data: job, isLoading, isError } = useFindWorkJob(workId);
  const [bidAmount, setBidAmount] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState('1 - 2 weeks');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { checkAndConsume, paywallOpen, closePaywall, paywallMeta } = useSubscriptionGate();
  const { breakdown } = useCheckoutFees(Number(bidAmount || 0), 'ESCROW_RELEASE');
  const fee = breakdown.platformFee;
  const payout = breakdown.providerNet;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#14a800]" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="bg-zinc-50 min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <Briefcase className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
          <h1 className="text-3xl font-black text-zinc-900 mb-2">This job is no longer available</h1>
          <p className="text-zinc-600 mb-6">We could not load the job details required to submit a proposal.</p>
          <Link to="/find-work" className="px-6 py-3 bg-[#14a800] hover:bg-[#118a00] text-white font-bold rounded-xl">
            Back to Find Work
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }

    if (String(user?.role || '').toUpperCase() !== 'FREELANCER') {
      toast.error('Only freelancer accounts can submit proposals.');
      return;
    }

    const coverErr = validateCoverLetter(message, 50);
    if (coverErr) {
      toast.error(coverErr);
      return;
    }

    const amountErr = validatePositiveNumber(bidAmount, 'Bid amount');
    if (amountErr) {
      toast.error(amountErr);
      return;
    }

    const amount = Number(bidAmount);

    setSubmitting(true);
    try {
      const allowed = await checkAndConsume('job_application');
      if (!allowed) {
        setSubmitting(false);
        return;
      }
      await proposalAPI.submitProposal({
        jobId: workId,
        title: `Proposal: ${job.title}`,
        coverLetter: message.trim(),
        bidAmount: amount.toFixed(2),
        deliveryDays: parseDeliveryDays(deliveryEstimate),
        currency: 'USD',
      });
      toast.success('Proposal submitted successfully');
      navigate('/find-work/my-applications');
    } catch (err) {
      toast.error(err.message || 'Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <QuotaPaywallModal
        open={paywallOpen}
        onClose={closePaywall}
        title={paywallMeta.title}
        message={paywallMeta.message}
        quotaType={paywallMeta.quotaType}
      />
      <div className="bg-zinc-50 min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <Link to={job.detailPath} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[#14a800] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Job Details
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Submit a Proposal</h1>
            <p className="text-zinc-600 font-medium">Your proposal will be sent to the client for review.</p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm mb-8">
            <h2 className="font-bold text-lg text-zinc-900 mb-1">{job.title}</h2>
            <p className="text-sm text-zinc-500">{job.category?.name} · {job.budgetLabel}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
              <label className="block text-sm font-bold text-zinc-700 mb-2">Your bid (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#14a800]/20 focus:border-[#14a800]"
                  placeholder="e.g. 500"
                />
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
              <label className="block text-sm font-bold text-zinc-700 mb-2">Delivery timeline</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <select
                  value={deliveryEstimate}
                  onChange={(e) => setDeliveryEstimate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#14a800]/20"
                >
                  <option>Less than 1 week</option>
                  <option>1 - 2 weeks</option>
                  <option>2 - 4 weeks</option>
                  <option>1 - 2 months</option>
                </select>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
              <label className="block text-sm font-bold text-zinc-700 mb-2">Cover letter</label>
              <textarea
                required
                minLength={50}
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-4 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#14a800]/20 resize-none"
                placeholder="Explain why you're the best fit for this job (min. 50 characters)..."
              />
              <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1">
                <Paperclip className="w-3 h-3" /> Attachments can be added after the client responds.
              </p>
            </div>

            <div className="bg-[#14a800]/5 border border-[#14a800]/20 rounded-2xl p-5 flex gap-3">
              <AlertCircle className="w-5 h-5 text-[#14a800] shrink-0" />
              <div className="text-sm">
                <p className="font-bold text-zinc-900">You'll receive ${payout.toFixed(2)} after fees</p>
                <p className="text-zinc-600">
                  {breakdown.platformPercent}% Forte Vault fee ({fee.toFixed(2)}) applies when this project is released from escrow.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#14a800] hover:bg-[#118a00] text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Submit Proposal <Send className="w-5 h-5" /></>}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
