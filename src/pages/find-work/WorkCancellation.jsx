import React, { useCallback, useEffect, useState } from 'react';
import { XOctagon, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useConfirm } from '../../common/context/ConfirmContext';
import {
  cancelJobOrContract,
  formatMoney,
  loadContractOrOrder,
  loadJobContext,
} from './findWorkWorkflow';
import { validateRequired, validateTermsAccepted } from '../../common/utils/validation';

const REASON_LABELS = {
  unresponsive: 'Provider is unresponsive',
  timeline: 'Provider cannot meet the timeline',
  not_needed: 'Work is no longer needed',
  other: 'Other',
};

const WorkCancellation = () => {
  const { workId } = useParams();
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [reason, setReason] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [contextKind, setContextKind] = useState(null);
  const [refundAmount, setRefundAmount] = useState(0);
  const [currency, setCurrency] = useState('KES');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const contractResult = await loadContractOrOrder(workId);
      if (contractResult.kind === 'contract' && contractResult.record) {
        setContextKind('contract');
        setRefundAmount(Number(contractResult.record.totalAmount ?? contractResult.record.amount ?? 0));
        setCurrency(contractResult.record.currency || 'KES');
        return;
      }

      const job = await loadJobContext(workId);
      if (job) {
        setContextKind('job');
        setRefundAmount(Number(job.budget ?? job.budgetMax ?? 0));
        setCurrency(job.currency || 'KES');
        return;
      }

      toast.error('Could not find this job or contract.');
    } catch (err) {
      toast.error(err.message || 'Could not load cancellation details.');
    } finally {
      setLoading(false);
    }
  }, [workId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reasonErr = validateRequired(reason, 'Cancellation reason');
    const termsErr = validateTermsAccepted(agreed);
    const validationError = reasonErr || termsErr;
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const approved = await confirm({
      title: 'Request cancellation?',
      message: contextKind === 'contract'
        ? 'The provider will have 48 hours to accept or decline this cancellation request.'
        : 'This will cancel the job posting. Active proposals may be withdrawn.',
      confirmLabel: 'Request Cancellation',
      variant: 'danger',
    });
    if (!approved) return;

    setSubmitting(true);
    try {
      const reasonText = REASON_LABELS[reason] || reason;
      await cancelJobOrContract(workId, reasonText);
      toast.success('Cancellation request submitted.');
      navigate('/find-work/my-posted-work');
    } catch (err) {
      toast.error(err.message || 'Could not submit cancellation.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface min-h-screen py-20 flex flex-col items-center justify-center text-zinc-500">
        <Loader2 className="w-10 h-10 animate-spin text-[#2bb75c] mb-4" />
        <p className="font-medium">Loading cancellation details…</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <Link to={`/find-work/orders/${workId}`} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[#2bb75c] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Order
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Cancel {contextKind === 'contract' ? 'Contract' : 'Job'}</h1>
            <p className="text-zinc-600 font-medium">
              Request a mutual cancellation{contextKind === 'contract' ? ' and refund for this active contract' : ' for this job posting'}.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
              {contextKind === 'contract' && (
                <div className="flex items-center justify-between p-4 bg-surface border border-zinc-200 rounded-xl mb-8">
                  <div>
                    <div className="text-sm font-bold text-zinc-500 mb-1">Escrow Refund Estimate</div>
                    <div className="text-xs text-zinc-400">Assuming provider accepts the cancellation</div>
                  </div>
                  <div className="text-2xl font-black text-zinc-900">{formatMoney(refundAmount, currency)}</div>
                </div>
              )}

              <div className="mb-8">
                <label className="block text-sm font-bold text-zinc-700 mb-2">Reason for Cancellation</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-rose-500 focus:outline-none font-medium text-zinc-900 cursor-pointer"
                >
                  <option value="" disabled>Select a reason...</option>
                  <option value="unresponsive">Provider is unresponsive</option>
                  <option value="timeline">Provider cannot meet the timeline</option>
                  <option value="not_needed">Work is no longer needed</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5 rounded border-zinc-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <div>
                    <div className="font-bold text-rose-900">I understand the cancellation policy</div>
                    <div className="text-sm font-medium text-rose-800 mt-1">
                      By submitting this request, the provider has 48 hours to accept or decline the cancellation. If they decline, the contract will enter dispute resolution. Fortspace processing fees (5%) are non-refundable.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link to={`/find-work/orders/${workId}`} className="px-6 py-3 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-xl transition-colors">
                Keep Contract Open
              </Link>
              <button
                type="submit"
                disabled={!agreed || !reason || submitting}
                className={`px-8 py-3 font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 ${agreed && reason && !submitting ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <XOctagon className="w-5 h-5" />}
                Request Cancellation
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default WorkCancellation;

