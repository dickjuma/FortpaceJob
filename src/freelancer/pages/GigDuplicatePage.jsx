// src/pages/freelancer/GigDuplicatePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy, Check, AlertCircle, FileText, Image as ImageIcon,
  DollarSign, ListChecks, ChevronRight, Settings,
  ArrowRight
} from 'lucide-react';
import { useFreelancerGigById, useCreateGig } from '../services/freelancerHooks';

const CLONE_OPTIONS = [
  { id: 'title_desc', label: 'Title & Description', icon: FileText, default: true },
  { id: 'pricing', label: 'Pricing Packages', icon: DollarSign, default: true },
  { id: 'media', label: 'Gallery & Video', icon: ImageIcon, default: false },
  { id: 'requirements', label: 'Buyer Requirements', icon: ListChecks, default: true },
];

export default function GigDuplicatePage() {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const { data: gigData, isLoading: loadingGig, error: gigError } = useFreelancerGigById(gigId);
  const createGig = useCreateGig();

  const [selectedOptions, setSelectedOptions] = useState(
    CLONE_OPTIONS.filter(o => o.default).map(o => o.id)
  );
  const [newTitle, setNewTitle] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);
  const [createdGigId, setCreatedGigId] = useState(null);
  const [createError, setCreateError] = useState(null);

  const currentGig = gigData?.gig ?? gigData?.data ?? gigData ?? {};

  useEffect(() => {
    if (!newTitle && currentGig?.title) {
      setNewTitle(`${currentGig.title} (Copy)`);
    }
  }, [currentGig?.title, newTitle]);

  const toggleOption = (id) => {
    setSelectedOptions(prev =>
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedOptions(CLONE_OPTIONS.map(o => o.id));
    setShowSuccess({ message: 'All options selected' });
    setTimeout(() => setShowSuccess(null), 1500);
  };

  const handleDuplicate = () => {
    setCreateError(null);
    const payload = {
      title: newTitle || `${currentGig.title || 'Untitled gig'} (Copy)`,
      description: selectedOptions.includes('title_desc') ? currentGig.description : '',
      category: currentGig.category,
      status: 'draft',
      packages: selectedOptions.includes('pricing')
        ? currentGig.packages || (currentGig.package ? [currentGig.package] : [])
        : [],
      gallery: selectedOptions.includes('media')
        ? currentGig.gallery || currentGig.images || []
        : [],
      requirements: selectedOptions.includes('requirements')
        ? currentGig.requirements || currentGig.buyerRequirements || []
        : [],
    };

    createGig.mutate(payload, {
      onSuccess: (data) => {
        setCreatedGigId(data?.id || data?.gigId || null);
        setIsDone(true);
        setShowSuccess({ message: 'Gig duplicated successfully!' });
        setTimeout(() => setShowSuccess(null), 2000);
      },
      onError: (error) => {
        const message = error?.message || 'Unable to duplicate gig';
        setCreateError(message);
        setShowSuccess({ message, isError: true });
        setTimeout(() => setShowSuccess(null), 3000);
      },
    });
  };

  const handleEditGig = () => {
    if (createdGigId) {
      navigate(`/freelancer/gigs/${createdGigId}/edit`);
    } else if (gigId) {
      navigate(`/freelancer/gigs/${gigId}/edit`);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/freelancer/gigs');
  };

  if (loadingGig) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (gigError) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center p-4">
        <div className="bg-white border border-border rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
          <AlertCircle className="w-10 h-10 text-warn mx-auto mb-4" />
          <h2 className="font-display font-semibold text-xl text-brand-900 mb-2">Unable to load gig</h2>
          <p className="text-ink-secondary">We couldn't fetch the gig data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-surface-soft flex items-center justify-center py-12 px-4 sm:px-6"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2 ${showSuccess.isError ? 'bg-danger text-white' : 'bg-accent-dark text-white'}`}>
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl w-full">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-light rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Copy className="w-8 h-8 text-accent DEFAULT" />
          </div>
          <h1 className="font-display font-bold text-3xl text-brand-900">Duplicate gig</h1>
          <p className="text-sm text-ink-secondary font-body mt-2 max-w-sm mx-auto">
            Clone an existing gig to save time when creating similar services
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-lg">

          {isDone ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-20 h-20 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-5">
                <Check className="w-10 h-10 text-accent DEFAULT" />
              </div>
              <h2 className="font-display font-semibold text-2xl text-brand-900 mb-2">Gig duplicated successfully!</h2>
              <p className="text-ink-secondary font-body mb-6">
                Your new gig has been saved as a draft. You can now edit it before publishing.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleEditGig}
                  className="px-6 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors"
                >
                  Edit new gig
                </button>
                <button
                  onClick={handleBackToDashboard}
                  className="px-6 py-2.5 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors"
                >
                  Back to dashboard
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">

              {/* Source Gig Preview */}
              <div>
                <h3 className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-2">
                  Source gig
                </h3>
                <div className="flex items-center gap-4 p-4 rounded-3xl border border-border bg-surface-soft">
                  <img
                    src={currentGig.image || currentGig.coverImage}
                    alt={currentGig.title}
                    className="w-20 h-20 rounded-3xl object-cover"
                  />
                  <div>
                    <h4 className="font-body font-semibold text-ink-primary text-lg">{currentGig.title || 'Untitled gig'}</h4>
                    <p className="text-sm text-ink-tertiary">{currentGig.category || 'Service category'}</p>
                  </div>
                </div>
              </div>

              {/* Clone Details */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-body font-semibold text-ink-primary mb-2">New gig title</label>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter new gig title"
                    className="w-full h-12 px-4 rounded-2xl border border-border bg-white text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {CLONE_OPTIONS.map(option => {
                    const isSelected = selectedOptions.includes(option.id);
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => toggleOption(option.id)}
                        className={`flex items-center gap-3 p-4 rounded-3xl border transition-all text-left ${
                          isSelected ? 'border-accent DEFAULT bg-accent-light' : 'border-border bg-white hover:border-border-strong'
                        }`}>
                        <div className={`w-10 h-10 rounded-3xl flex items-center justify-center ${isSelected ? 'bg-accent DEFAULT text-white' : 'bg-surface-muted text-ink-tertiary'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-body font-semibold text-ink-primary">{option.label}</div>
                          <p className="text-xs text-ink-tertiary">{option.id === 'title_desc' ? 'Copy title and description' : option.id === 'pricing' ? 'Copy packages and pricing' : option.id === 'media' ? 'Copy images and videos' : 'Copy buyer facing requirements'}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {createError && (
                  <div className="rounded-2xl bg-danger/10 border border-danger p-4 text-sm text-danger">
                    {createError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleDuplicate}
                  disabled={createGig.isLoading}
                  className="w-full py-3 rounded-2xl bg-brand-900 text-white hover:bg-brand-800 font-body font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createGig.isLoading ? 'Duplicating...' : 'Create duplicate gig'}
                </button>

                <div className="border-t border-border pt-4 text-sm text-ink-secondary">
                  <p className="mb-2">Cloning helps you reuse a successful gig structure while keeping your new draft separate.</p>
                  <p>After duplication you can edit pricing, delivery, and requirements without affecting the original gig.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}


