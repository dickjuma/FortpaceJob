import React from 'react';
import { Send, Clock, FileText, CheckCircle, ChevronLeft, Building, Pencil, Eye, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useProposalById } from '../services/freelancerHooks';

export default function ProposalDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useProposalById(id);

  const proposal = data?.proposal || data?.data || data;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#14a800]" />
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <p className="text-zinc-600 mb-4">Proposal not found or unavailable.</p>
        <Link to="/freelancer/proposals" className="text-[#14a800] font-bold">
          Back to proposals
        </Link>
      </div>
    );
  }

  const jobTitle = proposal.job?.title || proposal.jobTitle || 'Job';
  const clientName =
    proposal.job?.client?.companyName ||
    proposal.client?.name ||
    proposal.clientName ||
    'Client';
  const status = proposal.status || 'SUBMITTED';
  const coverLetter = proposal.coverLetter || proposal.message || proposal.description || '';

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <Toaster position="top-center" />
      <div className="mb-8">
        <Link to="/freelancer/proposals" className="text-sm font-medium text-[#14a800] hover:underline mb-4 inline-flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to proposals
        </Link>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mt-2">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">{jobTitle}</h1>
            <p className="text-sm text-zinc-500 mt-1 flex items-center gap-1">
              <Building className="w-4 h-4" /> {clientName}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#14a800]/10 text-[#14a800] text-xs font-bold uppercase">
            {status}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-zinc-900 mb-3">Cover letter</h2>
          <p className="text-sm text-zinc-600 whitespace-pre-wrap leading-relaxed">{coverLetter || 'No cover letter provided.'}</p>
        </div>
        <div className="space-y-4">
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-zinc-400 uppercase mb-2">Bid</p>
            <p className="text-lg font-black text-zinc-900">
              {proposal.proposedPrice != null
                ? `KES ${Number(proposal.proposedPrice).toLocaleString()}`
                : proposal.bid || '—'}
            </p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-zinc-400 uppercase mb-2">Submitted</p>
            <p className="text-sm font-semibold text-zinc-700">
              {proposal.createdAt ? new Date(proposal.createdAt).toLocaleString() : '—'}
            </p>
          </div>
          {proposal.jobId && (
            <Link
              to={`/freelancer/job/${proposal.jobId}`}
              className="block text-center py-3 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-[#14a800] transition-colors"
            >
              View job posting
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
