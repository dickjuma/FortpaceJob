import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Handshake, DollarSign, Clock, Send, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  extractList,
  formatMoney,
  loadFreelancerProfile,
  loadJobContext,
  loadProposal,
  proposalAPI,
} from './findWorkWorkflow';
import {
  validateMinLength,
  validatePositiveNumber,
  validateRequired,
} from '../../common/utils/validation';

const CounterOffer = () => {
  const { workId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryProposalId = searchParams.get('proposal') || searchParams.get('proposalId');

  const [budget, setBudget] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [proposal, setProposal] = useState(null);
  const [provider, setProvider] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [selectedProposalId, setSelectedProposalId] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await loadJobContext(workId);
      const proposalsResponse = await proposalAPI.getProposalsForRequest(workId);
      const list = extractList(proposalsResponse);
      setProposals(list);

      const preferredId = queryProposalId || list[0]?.id;
      if (!preferredId) {
        setProposal(null);
        return;
      }

      setSelectedProposalId(String(preferredId));
      const record = (await loadProposal(preferredId)) || list.find((p) => String(p.id) === String(preferredId));
      setProposal(record);
      if (record) {
        setBudget(String(record.bidAmount ?? record.amount ?? ''));
        setDeliveryDays(String(record.deliveryDays || ''));
      }
      if (record?.freelancerId) {
        loadFreelancerProfile(record.freelancerId).then(setProvider);
      }
    } catch (err) {
      toast.error(err.message || 'Could not load proposal.');
    } finally {
      setLoading(false);
    }
  }, [workId, queryProposalId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleProposalChange = async (proposalId) => {
    setSelectedProposalId(proposalId);
    const record = (await loadProposal(proposalId)) || proposals.find((p) => String(p.id) === String(proposalId));
    setProposal(record);
    if (record) {
      setBudget(String(record.bidAmount ?? record.amount ?? ''));
      setDeliveryDays(String(record.deliveryDays || ''));
      if (record.freelancerId) {
        loadFreelancerProfile(record.freelancerId).then(setProvider);
      }
    }
  };

  const originalAmount = useMemo(
    () => Number(proposal?.bidAmount ?? proposal?.amount ?? 0),
    [proposal]
  );
  const currency = proposal?.currency || 'KES';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const proposalErr = validateRequired(selectedProposalId, 'Proposal');
    const budgetErr = validatePositiveNumber(budget, 'Counter offer amount');
    const messageErr = validateMinLength(message, 10, 'Message');
    const validationError = proposalErr || budgetErr || messageErr;
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await proposalAPI.counterOffer(selectedProposalId, {
        amount: Number(budget),
        message,
        deliveryDays: deliveryDays ? Number(deliveryDays) : undefined,
      });
      toast.success('Counter offer sent.');
      navigate(`/find-work/work/${workId}/applications`);
    } catch (err) {
      toast.error(err.message || 'Could not send counter offer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface min-h-screen py-20 flex flex-col items-center justify-center text-zinc-500">
        <Loader2 className="w-10 h-10 animate-spin text-[#14a800] mb-4" />
        <p className="font-medium">Loading proposal…</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <Link to={`/find-work/work/${workId}/applications`} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[#14a800] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Applications
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Make a Counter Offer</h1>
            <p className="text-zinc-600 font-medium">Propose different terms to the freelancer before hiring.</p>
          </div>

          {!proposal ? (
            <div className="bg-white border border-zinc-200 rounded-3xl p-10 text-center shadow-sm">
              <p className="text-zinc-600 font-medium">No proposals available for a counter offer.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {proposals.length > 1 && (
                <div className="bg-white border border-zinc-200 rounded-2xl p-4 mb-6 shadow-sm">
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Select proposal</label>
                  <select
                    value={selectedProposalId}
                    onChange={(e) => handleProposalChange(e.target.value)}
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

              <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
                <h2 className="text-xl font-bold text-zinc-900 mb-6">Original Proposal</h2>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-4 bg-surface border border-zinc-200 rounded-xl mb-8">
                  <div className="flex items-center gap-4">
                    <img
                      src={provider?.avatar || provider?.avatarUrl || 'https://i.pravatar.cc/150?img=11'}
                      alt="Provider"
                      className="w-12 h-12 rounded-full border border-zinc-200 object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-zinc-900">{provider?.displayName || provider?.name || 'Professional'}</h3>
                      <div className="text-sm font-medium text-zinc-500">
                        Proposed: {proposal.deliveryDays ? `${proposal.deliveryDays} days delivery` : 'Flexible timeline'}
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-zinc-400 line-through">
                    {formatMoney(originalAmount, currency)}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-zinc-900 mb-6">Your Counter Offer</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-2">New Budget</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-zinc-400"><DollarSign className="w-5 h-5" /></span>
                      <input
                        type="number"
                        required
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-[#14a800]/20 focus:outline-none focus:ring-4 focus:ring-[#14a800]/10 font-bold text-zinc-900 text-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-2">Delivery Days (Optional)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-zinc-400"><Clock className="w-5 h-5" /></span>
                      <input
                        type="number"
                        min="1"
                        value={deliveryDays}
                        onChange={(e) => setDeliveryDays(e.target.value)}
                        placeholder={proposal.deliveryDays ? String(proposal.deliveryDays) : 'Days'}
                        className="w-full pl-12 pr-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-[#14a800]/20 focus:outline-none focus:ring-4 focus:ring-[#14a800]/10 font-bold text-zinc-900"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Message to Freelancer</label>
                  <textarea
                    rows="4"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Explain why you are proposing these new terms..."
                    className="w-full p-4 bg-surface border border-zinc-200 rounded-xl focus:border-[#14a800]/20 focus:outline-none focus:ring-4 focus:ring-[#14a800]/10 font-medium text-zinc-900 resize-y"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Link to={`/find-work/work/${workId}/applications`} className="px-6 py-3 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-xl transition-colors">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={!budget || !message || submitting}
                  className={`px-8 py-3 font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 ${budget && message && !submitting ? 'bg-[#14a800] hover:bg-[#118a00] text-white' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Handshake className="w-5 h-5" />}
                  Send Counter Offer
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default CounterOffer;
