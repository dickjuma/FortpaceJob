import React, { useCallback, useEffect, useState } from 'react';
import { PackageCheck, DollarSign, Download, ShieldCheck, Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  contractAPI,
  formatMoney,
  loadContractOrOrder,
  loadFreelancerProfile,
} from './findWorkWorkflow';

const WorkCompletion = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { record } = await loadContractOrOrder(orderId);
      if (!record) {
        toast.error('Contract not found.');
        return;
      }
      setContract(record);
      const freelancerId = record.freelancerId || record.providerId;
      if (freelancerId) {
        loadFreelancerProfile(freelancerId).then(setProvider);
      }
    } catch (err) {
      toast.error(err.message || 'Could not load delivery.');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currency = contract?.currency || 'KES';
  const releaseAmount = Number(contract?.totalAmount ?? contract?.amount ?? 0);
  const providerName = provider?.displayName || provider?.name || contract?.freelancerName || 'Provider';
  const deliveryFiles = contract?.deliveryFiles || contract?.files || [];
  const deliveryNote = contract?.deliveryNote || contract?.deliveryMessage || '';

  const handleApprove = async () => {
    if (!agreed || !contract?.id) return;

    setSubmitting(true);
    try {
      await contractAPI.acceptDelivery(contract.id);
      toast.success('Payment released. Contract completed.');
      navigate(`/find-work/orders/${orderId}/review`);
    } catch (err) {
      toast.error(err.message || 'Could not accept delivery.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface min-h-screen py-20 flex flex-col items-center justify-center text-zinc-500">
        <Loader2 className="w-10 h-10 animate-spin text-[#2bb75c] mb-4" />
        <p className="font-medium">Loading delivery…</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="mb-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-success rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageCheck className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Review Final Delivery</h1>
            <p className="text-zinc-600 font-medium">{providerName} has submitted the final work. Review and release payment.</p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm mb-8">
            <div className="p-6 md:p-8 border-b border-zinc-100">
              <h2 className="text-xl font-bold text-zinc-900 mb-4">Submitted Files</h2>

              {deliveryFiles.length === 0 ? (
                <p className="text-sm font-medium text-zinc-500">No files attached to this delivery yet.</p>
              ) : (
                deliveryFiles.map((file, index) => (
                  <div key={file.id || index} className="flex items-center justify-between p-4 bg-surface border border-zinc-200 rounded-xl mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#2bb75c]/10 text-[#2bb75c] rounded-lg flex items-center justify-center font-black text-xs">FILE</div>
                      <div>
                        <div className="font-bold text-zinc-900">{file.name || file.filename || `Deliverable ${index + 1}`}</div>
                        <div className="text-xs text-zinc-500 font-medium">{file.size || 'Uploaded recently'}</div>
                      </div>
                    </div>
                    {file.url && (
                      <a href={file.url} target="_blank" rel="noreferrer" className="p-2 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-600 rounded-lg transition-colors">
                        <Download className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                ))
              )}

              {deliveryNote && (
                <div className="bg-[#2bb75c]/5 border border-[#2bb75c]/20 rounded-xl p-4 mt-4">
                  <h4 className="font-bold text-[#2bb75c] text-sm mb-1">Message from {providerName}:</h4>
                  <p className="text-sm text-[#2bb75c]">{deliveryNote}</p>
                </div>
              )}
            </div>

            <div className="p-6 md:p-8 bg-surface/50">
              <h2 className="text-xl font-bold text-zinc-900 mb-6">Payment Release</h2>

              <div className="max-w-sm mx-auto bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm text-center mb-6">
                <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Escrow Release Amount</div>
                <div className="text-4xl font-black text-success flex items-center justify-center gap-1">
                  {formatMoney(releaseAmount, currency)}
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm mb-8">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5 rounded border-zinc-300 text-success focus:ring-emerald-500 cursor-pointer"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <div>
                    <div className="font-bold text-zinc-900">I am satisfied with the delivery</div>
                    <div className="text-sm font-medium text-zinc-500 mt-1">
                      By checking this box, you instruct Fortspace Escrow to release {formatMoney(releaseAmount, currency)} to {providerName}. This action cannot be undone and marks the contract as completed.
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate(`/find-work/orders/${orderId}/revise`)}
                  className="px-6 py-3 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-bold rounded-xl transition-colors"
                >
                  Request Revision
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={!agreed || submitting}
                  className={`px-8 py-3 font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 ${agreed && !submitting ? 'bg-success hover:bg-emerald-700 text-white' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                  Approve & Release Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkCompletion;

