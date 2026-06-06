// src/pages/freelancer/FreelancerProposalSubmissionPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Sparkles, UploadCloud, Clock,
  DollarSign, CheckSquare, Shield, ChevronLeft,
  Paperclip, Image as ImageIcon, Briefcase, Check
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFreelancerJobById, useCreateProposal } from '../services/freelancerHooks';

export default function FreelancerProposalSubmissionPage() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { data: job, isLoading: jobLoading, error: jobError } = useFreelancerJobById(jobId);
  const submitProposal = useCreateProposal();

  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState(4500);
  const [duration, setDuration] = useState('Less than 1 month');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [showSuccess, setShowSuccess] = useState(null);

  const isSubmitting = submitProposal.isLoading;
  const serviceFee = bidAmount * 0.1;
  const youReceive = bidAmount - serviceFee;

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const handleSubmit = () => {
    if (!coverLetter.trim()) {
      setShowSuccess({ message: 'Please write a cover letter', isError: true });
      setTimeout(() => setShowSuccess(null), 2000);
      return;
    }

    const durationMap = {
      'Less than 1 month': 30,
      '1 to 3 months': 60,
      '3 to 6 months': 120,
      'More than 6 months': 180,
    };

    setShowSuccess(null);
    submitProposal.mutate(
      {
        jobId,
        coverLetter,
        bidAmount,
        deliveryDays: durationMap[duration] || 30,
        currency: job?.currency || 'KES',
      },
      {
        onSuccess: () => {
          setShowSuccess({ message: 'Proposal submitted successfully!' });
          setTimeout(() => {
            setShowSuccess(null);
            navigate('/freelancer/proposals');
          }, 2000);
        },
        onError: () => {
          setShowSuccess({ message: 'Unable to submit proposal', isError: true });
          setTimeout(() => setShowSuccess(null), 2000);
        },
      }
    );
  };

  if (jobLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-soft">
        <div className="w-12 h-12 border-2 border-accent DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (jobError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-soft text-center px-4">
        <p className="text-ink-secondary mb-4">Unable to load job details. Please try again later.</p>
        <button
          onClick={() => navigate('/freelancer/jobs')}
          className="px-4 py-2 rounded-lg bg-brand-900 text-white hover:bg-brand-800 transition-colors"
        >
          Back to jobs
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-surface-soft pb-16"
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

      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-body font-medium text-ink-tertiary hover:text-ink-primary transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" /> Back to job details
          </button>
          <h1 className="font-display font-bold text-2xl text-brand-900">Submit a proposal</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">

        {/* Main Proposal Form */}
        <div className="flex-1 space-y-6">

          {/* Job Summary Card */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-body font-semibold text-lg text-ink-primary mb-2">{job?.title || 'Build a React Native E-Commerce App'}</h2>
            <div className="flex flex-wrap gap-3 text-sm font-body text-ink-secondary mb-4 pb-4 border-b border-border">
              <span className="bg-surface-muted px-2 py-0.5 rounded-md">{job?.category || 'Mobile Development'}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job?.duration || 'Less than 1 month'}</span>
              <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {job?.budgetLabel || job?.budget || 'KES 3,000 - 5,000'}</span>
            </div>
            <p className="text-sm font-body text-ink-secondary">
              {job?.description || 'We are looking for an experienced React Native developer to build out the mobile version of our existing web e-commerce platform. Must have experience with Redux, Stripe, and push notifications.'}
            </p>
          </div>

          {/* Pricing & Terms */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-display font-semibold text-lg text-brand-900 mb-5">Terms & pricing</h2>

            <div className="space-y-5">
              {/* Bid Amount */}
              <div className="flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center">
                <div className="flex-1">
                  <h3 className="font-body font-semibold text-ink-primary">What is the full amount you'd like to bid?</h3>
                  <p className="text-xs font-body text-ink-tertiary">Client's budget is KES 3,000 - 5,000</p>
                </div>
                <div className="relative w-full sm:w-56 shrink-0">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-tertiary font-body text-sm">KES</span>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="w-full pl-12 pr-4 h-11 bg-white border border-border rounded-xl font-mono font-semibold text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900 text-right"
                  />
                </div>
              </div>

              {/* Service Fee */}
              <div className="flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center">
                <div className="flex-1">
                  <h3 className="font-body font-medium text-ink-secondary">10% freelancer service fee</h3>
                  <p className="text-xs font-body text-ink-tertiary">This fee helps us run the platform</p>
                </div>
                <div className="w-full sm:w-56 text-right font-mono font-semibold text-ink-secondary">
                  -KES {serviceFee.toLocaleString()}
                </div>
              </div>

              {/* You'll Receive */}
              <div className="flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center pt-5 border-t border-border">
                <div className="flex-1">
                  <h3 className="font-body font-semibold text-lg text-ink-primary">You'll receive</h3>
                  <p className="text-xs font-body text-ink-tertiary">Estimated amount after fees</p>
                </div>
                <div className="relative w-full sm:w-56 shrink-0">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent DEFAULT font-body text-sm">KES</span>
                  <div className="w-full pl-12 pr-4 h-11 bg-accent-light border border-accent DEFAULT rounded-xl font-mono font-bold text-accent-dark flex items-center justify-end">
                    {youReceive.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="pt-5 border-t border-border">
                <h3 className="font-body font-semibold text-ink-primary mb-3">How long will this project take?</h3>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full sm:w-64 h-11 px-4 bg-white border border-border rounded-xl text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                >
                  <option>Less than 1 month</option>
                  <option>1 to 3 months</option>
                  <option>3 to 6 months</option>
                  <option>More than 6 months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-display font-semibold text-lg text-brand-900">Cover letter</h2>
              <button className="flex items-center gap-2 text-sm font-body font-medium text-accent DEFAULT hover:bg-accent-light px-3 py-1.5 rounded-lg transition-colors">
                <Sparkles className="w-4 h-4" /> Enhance
              </button>
            </div>

            <textarea
              rows={8}
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              placeholder="Hi! I am a senior React Native developer with 5+ years of experience..."
              className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm font-body text-ink-primary placeholder-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand-900 resize-y"
            />
            <p className="text-xs text-ink-tertiary font-body mt-2">
              {coverLetter.length} characters • Minimum 100 recommended
            </p>

            {/* Attachments */}
            <div className="border-t border-border mt-6 pt-6">
              <h3 className="font-body font-semibold text-ink-primary mb-3">Attachments</h3>
              <label className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-accent DEFAULT hover:bg-accent-light transition-all group">
                <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                <UploadCloud className="w-8 h-8 text-ink-tertiary group-hover:text-accent DEFAULT mb-2 transition-colors" />
                <p className="text-sm font-body font-medium text-ink-primary group-hover:text-accent DEFAULT transition-colors">
                  Upload files or drag and drop
                </p>
                <p className="text-xs font-body text-ink-tertiary mt-1">PDF, JPG, PNG, DOCX up to 25MB</p>
              </label>

              {attachedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-surface-soft rounded-lg border border-border">
                      <Paperclip className="w-4 h-4 text-accent DEFAULT" />
                      <span className="text-sm font-body text-ink-primary">{file.name}</span>
                      <span className="text-xs font-mono text-ink-tertiary ml-auto">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-lg font-body font-medium text-sm text-ink-secondary hover:text-ink-primary hover:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit proposal'
              )}
            </button>
          </div>
        </div>

        {/* Right Sidebar: Tips & Safety */}
        <div className="w-full lg:w-80 shrink-0 space-y-5">

          {/* Trust & Safety */}
          <div className="bg-brand-900 rounded-2xl p-5 text-white shadow-sm">
            <h3 className="font-body font-semibold flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-accent-light" /> Trust & safety
            </h3>
            <p className="text-sm font-body text-white/80 mb-4">
              Never share personal contact information before a contract is started. Keep all communication and payments on Forte.
            </p>
            <button className="text-xs font-body font-medium text-accent-light hover:text-white transition-colors">
              Read our trust policy →
            </button>
          </div>

          {/* Proposal Tips */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-body font-semibold text-ink-primary mb-4">Proposal tips</h3>
            <ul className="space-y-3 text-sm font-body text-ink-secondary">
              <li className="flex items-start gap-2">
                <CheckSquare className="w-4 h-4 text-accent DEFAULT shrink-0 mt-0.5" />
                <span>Read the job description carefully and reference specific details</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckSquare className="w-4 h-4 text-accent DEFAULT shrink-0 mt-0.5" />
                <span>Attach relevant portfolio items that match the client's needs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckSquare className="w-4 h-4 text-accent DEFAULT shrink-0 mt-0.5" />
                <span>End with a question to encourage a response</span>
              </li>
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="bg-accent-light border border-accent DEFAULT rounded-2xl p-5">
            <h3 className="font-body font-semibold text-accent-dark mb-2">Did you know?</h3>
            <p className="text-sm font-body text-accent-dark">
              Proposals with a personalized cover letter are <strong className="font-semibold">2.5x more likely</strong> to receive a response.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
