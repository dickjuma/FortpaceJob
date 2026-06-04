import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Paperclip, ArrowLeft, Send, Loader2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { contractAPI, loadContractOrOrder } from './findWorkWorkflow';
import { validateRevisionFeedback } from '../../common/utils/validation';

const WorkRevision = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    const feedbackErr = validateRevisionFeedback(description);
    if (feedbackErr) {
      toast.error(feedbackErr);
      return;
    }
    if (!contract?.id) {
      toast.error('Contract not found.');
      return;
    }

    setSubmitting(true);
    try {
      await contractAPI.requestRevision(contract.id, description);
      toast.success('Revision request sent.');
      navigate(`/find-work/orders/${orderId}`);
    } catch (err) {
      toast.error(err.message || 'Could not send revision request.');
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

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <Link to={`/find-work/orders/${orderId}`} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[#2bb75c] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Order
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Request a Revision</h1>
            <p className="text-zinc-600 font-medium">Explain what needs to be changed in the submitted delivery.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
              <RefreshCw className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900">Revision Guidelines</h4>
                <p className="text-sm font-medium text-amber-800 mt-1">Be as specific as possible. Point out exact timestamps, page numbers, or visual details that need adjusting so the provider can fix them quickly.</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-zinc-700 mb-2">What needs to be changed?</label>
              <textarea
                rows="6"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., The color on the hero section should be darker, and please fix the typo on page 3..."
                className="w-full p-4 bg-surface border border-zinc-200 rounded-xl focus:border-[#2bb75c]/20 focus:outline-none focus:ring-4 focus:ring-[#2bb75c]/10 font-medium text-zinc-900 resize-y"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-zinc-700 mb-2">Attach Examples or Marked-up Files (Optional)</label>
              <div className="border-2 border-dashed border-zinc-300 bg-surface rounded-xl p-6 text-center hover:bg-zinc-100 transition-colors cursor-pointer group">
                <Paperclip className="w-6 h-6 text-zinc-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-bold text-zinc-700">Drop files here or click to browse</div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link to={`/find-work/orders/${orderId}`} className="px-6 py-3 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-xl transition-colors">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!description || submitting}
                className={`px-8 py-3 font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 ${description && !submitting ? 'bg-[#2bb75c] hover:bg-[#1d8d38] text-white' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Send Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default WorkRevision;

