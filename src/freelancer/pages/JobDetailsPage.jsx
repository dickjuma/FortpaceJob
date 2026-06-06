// src/pages/freelancer/JobDetailsPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Clock, DollarSign, Briefcase, Bookmark, Share2,
  ShieldCheck, Star, Paperclip, ChevronRight, FileText, CheckCircle2,
  AlertCircle, UploadCloud, Check
} from 'lucide-react';
import {
  useFreelancerJobById,
  useCreateProposal,
  useSaveJob,
  useUnsaveJob,
  useSavedJobs,
} from '../services/freelancerHooks';

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: job, isLoading: loading } = useFreelancerJobById(id);
  const { data: savedJobsList = [] } = useSavedJobs();
  const submitProposalMutation = useCreateProposal();
  const saveJobMutation = useSaveJob();
  const unsaveJobMutation = useUnsaveJob();

  const [proposalText, setProposalText] = useState('');
  const [showSuccess, setShowSuccess] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const savedJobIds = useMemo(
    () => new Set(savedJobsList.map((item) => String(item?.id ?? item?.jobId ?? item))),
    [savedJobsList]
  );

  useEffect(() => {
    if (id) {
      setIsSaved(savedJobIds.has(String(id)));
    }
  }, [id, savedJobIds]);

  const handleApply = () => {
    if (!proposalText.trim()) {
      setShowSuccess({ message: 'Please write a cover letter first', isError: true });
      setTimeout(() => setShowSuccess(null), 2000);
      return;
    }

    submitProposalMutation.mutate(
      { jobId: id, coverLetter: proposalText, bidAmount: 0, deliveryDays: 7 },
      {
        onSuccess: () => {
          setShowSuccess({ message: 'Proposal submitted successfully' });
          setTimeout(() => setShowSuccess(null), 2000);
          navigate('/freelancer/proposals');
        },
        onError: () => {
          setShowSuccess({ message: 'Unable to submit proposal', isError: true });
          setTimeout(() => setShowSuccess(null), 2000);
        },
      }
    );
  };

  const toggleSaveJob = async () => {
    if (!id) return;
    if (isSaved) {
      unsaveJobMutation.mutate(id, {
        onSuccess: () => {
          setIsSaved(false);
          setShowSuccess({ message: 'Removed from saved jobs' });
          setTimeout(() => setShowSuccess(null), 2000);
        },
      });
    } else {
      saveJobMutation.mutate(id, {
        onSuccess: () => {
          setIsSaved(true);
          setShowSuccess({ message: 'Job saved' });
          setTimeout(() => setShowSuccess(null), 2000);
        },
      });
    }
  };

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
    }
    setShowSuccess({ message: 'Link copied to clipboard' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-8 w-32 bg-surface-muted rounded-lg animate-pulse"></div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div className="h-48 bg-surface-muted rounded-2xl animate-pulse"></div>
              <div className="h-64 bg-surface-muted rounded-2xl animate-pulse"></div>
            </div>
            <div className="w-full lg:w-96 space-y-6">
              <div className="h-72 bg-surface-muted rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-secondary">Job not found</p>
      </div>
    );
  }

  const handleScrollToProposal = () => {
    document.getElementById('proposal-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success/Error Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2 ${
              showSuccess.isError ? 'bg-danger text-white' : 'bg-accent-dark text-white'
            }`}
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Navigation */}
      <div className="flex items-center gap-4 text-sm font-body font-medium text-ink-tertiary mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 hover:text-ink-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to search
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column */}
        <div className="flex-1 w-full space-y-5">

          {/* Job Header */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h1 className="font-display font-bold text-2xl text-brand-900 mb-4 leading-tight">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-body text-ink-secondary pb-5 mb-5 border-b border-border">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-ink-tertiary" /> {job.createdAt}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-ink-tertiary" /> {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-ink-tertiary" /> {job.type}
              </span>
            </div>

            <div className="text-ink-secondary font-body leading-relaxed whitespace-pre-wrap mb-6">
              {job.description}
            </div>

            {/* Attachments */}
            {job.attachments && job.attachments.length > 0 && (
              <div className="mb-6">
                <h3 className="font-body font-semibold text-ink-primary mb-3">Attachments</h3>
                <div className="flex flex-wrap gap-3">
                  {job.attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-surface-soft cursor-pointer hover:border-accent DEFAULT transition-all">
                      <div className="p-1.5 bg-white rounded-md border border-border">
                        <FileText className="w-4 h-4 text-accent DEFAULT" />
                      </div>
                      <div>
                        <p className="text-xs font-body font-medium text-ink-primary">{file.name}</p>
                        <p className="text-xs text-ink-tertiary">{file.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div>
                <h3 className="font-body font-semibold text-ink-primary mb-3">Required skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map(skill => (
                    <span key={skill} className="text-xs font-body font-medium bg-accent-light text-accent-dark px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Milestones */}
          {job.milestones && job.milestones.length > 0 && (
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-body font-semibold text-lg text-ink-primary mb-5 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent DEFAULT" /> Project milestones
              </h3>
              <div className="space-y-4">
                {job.milestones.map((milestone, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-surface-soft rounded-xl border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center font-mono font-semibold text-accent-dark text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-body font-semibold text-ink-primary">{milestone.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-ink-primary">KES {milestone.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proposal Form */}
          <div id="proposal-form" className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-body font-semibold text-lg text-ink-primary mb-4 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-accent DEFAULT" /> Quick proposal
            </h3>
            <div className="space-y-4">
              <textarea
                className="w-full h-32 p-4 rounded-xl border border-border bg-white text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none"
                placeholder="Write a brief cover letter outlining why you are the best fit for this role..."
                value={proposalText}
                onChange={(e) => setProposalText(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleApply}
                  className="px-5 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors"
                >
                  Submit proposal
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-96 shrink-0 space-y-5">

          {/* Action Card */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm sticky top-24">
            <div className="space-y-3">
              <button
                onClick={handleScrollToProposal}
                className="w-full py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors"
              >
                Apply now
              </button>
              <button
                onClick={toggleSaveJob}
                className={`w-full py-2.5 rounded-lg border transition-colors font-body font-medium text-sm flex items-center justify-center gap-2 ${
                  isSaved
                    ? "border-accent DEFAULT text-accent DEFAULT bg-accent-light"
                    : "border-border text-ink-primary hover:bg-surface-muted"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? "fill-accent DEFAULT" : ""}`} />
                {isSaved ? 'Saved' : 'Save job'}
              </button>
              <button
                onClick={handleShare}
                className="w-full py-2.5 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Share job
              </button>
            </div>

            <div className="mt-5 pt-5 border-t border-border">
              <div className="text-center mb-4">
                <DollarSign className="w-6 h-6 text-accent DEFAULT mx-auto mb-1" />
                <span className="font-mono font-bold text-xl text-ink-primary">{job.budget}</span>
                <p className="text-xs text-ink-tertiary uppercase tracking-wide mt-0.5">{job.type}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 p-3 bg-surface-soft rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-ink-tertiary" />
                  <div>
                    <p className="text-xs text-ink-tertiary uppercase tracking-wide">Experience</p>
                    <p className="text-sm font-body font-semibold text-ink-primary">{job.experienceLevel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-ink-tertiary" />
                  <div>
                    <p className="text-xs text-ink-tertiary uppercase tracking-wide">Duration</p>
                    <p className="text-sm font-body font-semibold text-ink-primary">{job.projectLength}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Profile */}
          {job.client && (
            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
              <h3 className="font-body font-semibold text-ink-primary mb-4 text-sm uppercase tracking-wide">About the client</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-body font-semibold text-ink-primary flex items-center gap-2">
                    {job.client.name}
                    {job.client.verified && <ShieldCheck className="w-4 h-4 text-accent DEFAULT" />}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3.5 h-3.5 fill-accent DEFAULT text-accent DEFAULT" />
                    <span className="text-sm font-body font-semibold text-ink-primary">{job.client.rating || 'New'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-ink-tertiary">Location</span>
                    <span className="font-body font-medium text-ink-primary">{job.client.location}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-ink-tertiary">Member since</span>
                    <span className="font-body font-medium text-ink-primary">
                      {job.client.createdAt ? new Date(job.client.createdAt).getFullYear() : 'Recent'}
                    </span>
                  </div>
                </div>

                {job.client.paymentVerified && (
                  <div className="mt-3 p-3 bg-accent-light rounded-lg flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent DEFAULT shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-body font-semibold text-accent-dark">Payment method verified</p>
                      <p className="text-xs text-accent-dark">This client has a verified payment method</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
