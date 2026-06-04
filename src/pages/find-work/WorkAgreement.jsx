import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FileSignature, ShieldCheck, DollarSign, Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  extractList,
  formatMoney,
  hireFromProposal,
  loadFreelancerProfile,
  loadJobContext,
  proposalAPI,
} from './findWorkWorkflow';
import { validateRequired, validateTermsAccepted } from '../../common/utils/validation';

const WorkAgreement = () => {
  const { workId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [selectedProposalId, setSelectedProposalId] = useState('');
  const [provider, setProvider] = useState(null);

  const queryProposalId = searchParams.get('proposal') || searchParams.get('proposalId');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [jobRecord, proposalsResponse] = await Promise.all([
        loadJobContext(workId),
        proposalAPI.getProposalsForRequest(workId),
      ]);
      setJob(jobRecord);
      const list = extractList(proposalsResponse);
      setProposals(list);

      const preferred =
        queryProposalId ||
        list.find((p) => String(p.status || '').toUpperCase() === 'SHORTLISTED')?.id ||
        list[0]?.id;
      if (preferred) setSelectedProposalId(String(preferred));
    } catch (err) {
      toast.error(err.message || 'Could not load hire details.');
    } finally {
      setLoading(false);
    }
  }, [workId, queryProposalId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectedProposal = useMemo(
    () => proposals.find((p) => String(p.id) === String(selectedProposalId)),
    [proposals, selectedProposalId]
  );

  useEffect(() => {
    if (!selectedProposal?.freelancerId) {
      setProvider(null);
      return;
    }
    loadFreelancerProfile(selectedProposal.freelancerId).then(setProvider);
  }, [selectedProposal?.freelancerId]);

  const currency = selectedProposal?.currency || job?.currency || 'KES';
  const bidAmount = Number(selectedProposal?.bidAmount ?? selectedProposal?.amount ?? job?.budget ?? 0);
  const processingFee = Math.round(bidAmount * 0.05);
  const totalEscrow = bidAmount + processingFee;
  const deliveryLabel = selectedProposal?.deliveryDays
    ? `${selectedProposal.deliveryDays} days`
    : job?.duration || 'Flexible';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const proposalErr = validateRequired(selectedProposalId, 'Proposal');
    const termsErr = validateTermsAccepted(agreed);
    const validationError = proposalErr || termsErr;
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const contract = await hireFromProposal(workId, selectedProposalId);
      const contractId = contract?.id || contract?.data?.id;
      toast.success('Contract created. Redirecting to order…');
      navigate(`/find-work/orders/${contractId}`);
    } catch (err) {
      toast.error(err.message || 'Could not complete hire.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface min-h-screen py-20 flex flex-col items-center justify-center text-zinc-500">
        <Loader2 className="w-10 h-10 animate-spin text-[#2bb75c] mb-4" />
        <p className="font-medium">Loading contract details…</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <Link to={`/find-work/work/${workId}/applications`} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[#2bb75c] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Applications
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Review Contract & Hire</h1>
            <p className="text-zinc-600 font-medium">Review the final terms before initiating the contract with Escrow.</p>
          </div>

          {proposals.length > 1 && (
            <div className="bg-white border border-zinc-200 rounded-2xl p-4 mb-6 shadow-sm">
              <label className="block text-sm font-bold text-zinc-700 mb-2">Select proposal</label>
              <select
                value={selectedProposalId}
                onChange={(e) => setSelectedProposalId(e.target.value)}
                className="w-full px-4 py-3 bg-surface border border-zinc-200 rounded-xl font-medium text-zinc-900 cursor-pointer"
              >
                {proposals.map((p) => (
                  <option key={p.id} value={p.id}>
                    Proposal {p.id} — {formatMoney(p.bidAmount ?? p.amount, p.currency || currency)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!selectedProposal ? (
            <div className="bg-white border border-zinc-200 rounded-3xl p-10 text-center shadow-sm">
              <p className="text-zinc-600 font-medium">No proposals available to hire.</p>
              <Link to={`/find-work/work/${workId}/applications`} className="inline-block mt-4 text-[#2bb75c] font-bold hover:underline">
                View applications
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <img
                    src={provider?.avatar || provider?.avatarUrl || 'https://i.pravatar.cc/150?img=11'}
                    alt="Provider"
                    className="w-16 h-16 rounded-full border-2 border-zinc-100 object-cover"
                  />
                  <div>
                    <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Hiring</div>
                    <h3 className="font-black text-zinc-900 text-xl">
                      {provider?.displayName || provider?.name || 'Professional'}
                    </h3>
                  </div>
                </div>
                <div className="w-full md:w-px h-px md:h-16 bg-zinc-200" />
                <div className="text-center md:text-right w-full md:w-auto">
                  <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">For Job</div>
                  <h3 className="font-bold text-zinc-900 line-clamp-1">{job?.title || 'Job posting'}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                  <h3 className="font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-success" /> Financial Terms
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                      <span className="font-medium text-zinc-600">Agreed Amount (Fixed)</span>
                      <span className="font-black text-zinc-900 text-lg">{formatMoney(bidAmount, currency)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                      <span className="font-medium text-zinc-600">Client Processing Fee (5%)</span>
                      <span className="font-bold text-zinc-500">{formatMoney(processingFee, currency)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-zinc-900">Total Escrow Deposit</span>
                      <span className="font-black text-success text-2xl">{formatMoney(totalEscrow, currency)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                  <h3 className="font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#2bb75c]" /> Timeline & Delivery
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                      <span className="font-medium text-zinc-600">Expected Delivery</span>
                      <span className="font-bold text-zinc-900">{deliveryLabel}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                      <span className="font-medium text-zinc-600">Start Date</span>
                      <span className="font-bold text-zinc-900">Immediate</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-medium text-zinc-600">Contract Status</span>
                      <span className="font-bold text-zinc-900 text-lg">Pending funding</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
                <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#2bb75c]" /> Fortspace Protection
                </h3>
                <div className="prose prose-sm prose-slate max-w-none mb-6">
                  <p>By clicking &quot;Fund & Hire&quot;, your payment will be securely held in Fortspace Escrow. The funds will only be released to the freelancer once you have reviewed and approved the completed work.</p>
                  <p>If the freelancer fails to deliver or the work does not meet the agreed requirements, you are protected by our Dispute Resolution process and may be entitled to a full refund.</p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer p-4 bg-surface border border-zinc-200 rounded-xl hover:border-[#2bb75c]/50 transition-colors">
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5 rounded border-zinc-300 text-[#2bb75c] focus:ring-[#2bb75c] cursor-pointer"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <div>
                    <div className="font-bold text-zinc-900">I agree to the terms of the contract</div>
                    <div className="text-sm font-medium text-zinc-500 mt-1">
                      I authorize Fortspace to charge my default payment method for the total amount of {formatMoney(totalEscrow, currency)}.
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-xl transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!agreed || submitting}
                  className={`px-8 py-3 font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 ${agreed && !submitting ? 'bg-success hover:bg-emerald-700 text-white' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSignature className="w-5 h-5" />}
                  Fund Contract & Hire
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default WorkAgreement;

