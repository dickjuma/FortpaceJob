import React, { useCallback, useEffect, useState } from 'react';
import { AlertOctagon, Scale, ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useConfirm } from '../../common/context/ConfirmContext';
import { disputeAPI, loadContractOrOrder } from './findWorkWorkflow';
import { validateDisputeDescription } from '../../common/utils/validation';

const DISPUTE_REASONS = [
  'Provider is unresponsive',
  'Work delivered is completely unusable',
  'Provider failed to meet deadline',
  'Work violates copyright or terms of service',
  'Other',
];

const DisputeResolution = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [reasonCategory, setReasonCategory] = useState(DISPUTE_REASONS[0]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [contract, setContract] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { record } = await loadContractOrOrder(orderId);
      setContract(record);
      if (!record) toast.error('Contract not found.');
    } catch (err) {
      toast.error(err.message || 'Could not load contract.');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const descriptionErr = validateDisputeDescription(description);
    if (descriptionErr) {
      toast.error(descriptionErr);
      return;
    }
    if (!contract?.id) {
      toast.error('Contract not found.');
      return;
    }

    const approved = await confirm({
      title: 'Submit dispute?',
      message: 'Filing a dispute pauses the contract and freezes Escrow funds while our team investigates.',
      confirmLabel: 'Submit Dispute',
      variant: 'danger',
    });
    if (!approved) return;

    setSubmitting(true);
    try {
      await disputeAPI.openDispute(contract.id, reasonCategory, description);
      setSubmitted(true);
      toast.success('Dispute lodged successfully.');
      setTimeout(() => navigate('/find-work/my-posted-work'), 3000);
    } catch (err) {
      toast.error(err.message || 'Could not submit dispute.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface min-h-screen py-20 flex flex-col items-center justify-center text-zinc-500">
        <Loader2 className="w-10 h-10 animate-spin text-[#2bb75c] mb-4" />
        <p className="font-medium">Loading contract…</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <>
        <div className="bg-surface min-h-screen py-20 flex items-center justify-center">
          <div className="bg-white border border-zinc-200 rounded-3xl p-10 shadow-xl max-w-md w-full text-center">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Dispute Lodged</h1>
            <p className="text-zinc-600 font-medium mb-8">Our Trust & Safety team has received your dispute. We freeze the Escrow funds while investigating. You will hear from us within 48 hours.</p>
            <div className="text-sm font-bold text-zinc-500 animate-pulse">Redirecting...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <Link to={`/find-work/orders/${orderId}`} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[#2bb75c] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Order
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Lodge a Dispute</h1>
            <p className="text-zinc-600 font-medium">If you and the provider cannot reach an agreement, Fortspace can step in.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-10 shadow-sm">
            <div className="flex items-start gap-4 p-4 bg-rose-50 border border-rose-200 rounded-xl mb-8">
              <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-rose-900">Serious Action Notice</h4>
                <p className="text-sm font-medium text-rose-800 mt-1">Filing a dispute pauses the contract and freezes Escrow. This impacts both parties&apos; accounts. Please ensure you have tried resolving the issue directly with the provider first.</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-zinc-700 mb-2">Primary Reason for Dispute</label>
              <select
                value={reasonCategory}
                onChange={(e) => setReasonCategory(e.target.value)}
                className="w-full px-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-[#2bb75c]/20 focus:outline-none font-medium text-zinc-900 cursor-pointer mb-6"
              >
                {DISPUTE_REASONS.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>

              <label className="block text-sm font-bold text-zinc-700 mb-2">Detailed Explanation</label>
              <textarea
                rows="6"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed timeline of events and why you are disputing this contract..."
                className="w-full p-4 bg-surface border border-zinc-200 rounded-xl focus:border-[#2bb75c]/20 focus:outline-none focus:ring-4 focus:ring-[#2bb75c]/10 font-medium text-zinc-900 resize-y"
              />
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <Link to={`/find-work/orders/${orderId}`} className="px-6 py-3 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-xl transition-colors">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!description || submitting || !contract}
                className={`px-8 py-3 font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 ${description && !submitting && contract ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <AlertOctagon className="w-5 h-5" />}
                Submit Dispute
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DisputeResolution;

