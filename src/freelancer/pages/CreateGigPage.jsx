// src/pages/freelancer/CreateGigPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, DollarSign, Clock, CheckCircle, ChevronRight,
  Image as ImageIcon, Plus, X, Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CreateGigPage() {
  const [step, setStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);

  const [gigData, setGigData] = useState({
    title: '',
    category: 'Programming & Tech',
    tags: '',
    description: '',
    packages: {
      basic: { name: 'Basic Package', description: '', deliveryTime: '3 Days', revisions: '1', price: '' },
      standard: { name: 'Standard Package', description: '', deliveryTime: '7 Days', revisions: '3', price: '' },
      premium: { name: 'Premium Package', description: '', deliveryTime: '14 Days', revisions: 'Unlimited', price: '' }
    },
    images: []
  });

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setIsPublished(true);
      setShowSuccess({ message: 'Gig published successfully' });
      setTimeout(() => setShowSuccess(null), 3000);
    }, 1500);
  };

  const handleNext = () => {
    if (step === 1 && !gigData.title.trim()) {
      setShowSuccess({ message: 'Please enter a gig title', isError: true });
      setTimeout(() => setShowSuccess(null), 2000);
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const updatePackage = (tier, field, value) => {
    setGigData(prev => ({
      ...prev,
      packages: {
        ...prev.packages,
        [tier]: { ...prev.packages[tier], [field]: value }
      }
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success Toast */}
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
      <div className="mb-8">
        <Link
          to="/freelancer/gigs"
          className="text-sm font-body font-medium text-accent DEFAULT hover:text-accent-dark mb-4 inline-block transition-colors"
        >
          ← Back to my gigs
        </Link>
        <h1 className="font-display font-bold text-4xl text-brand-900">Create a new gig</h1>
        <p className="text-sm text-ink-secondary font-body mt-1">Package your services into ready-to-buy tiers</p>
      </div>

      {/* Progress Steps */}
      <div className="flex mb-8 gap-2">
        {['Overview', 'Pricing', 'Gallery', 'Publish'].map((label, idx) => (
          <div key={idx} className="flex-1">
            <div className={`h-1.5 w-full rounded-full mb-2 transition-colors ${
              step > idx ? 'bg-accent DEFAULT' : step === idx + 1 ? 'bg-accent-light border border-accent DEFAULT' : 'bg-border'
            }`} />
            <p className={`text-xs font-body font-medium text-center ${
              step > idx ? 'text-accent DEFAULT' : step === idx + 1 ? 'text-ink-primary' : 'text-ink-tertiary'
            }`}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Main Form Card */}
      <div className="bg-white border border-border rounded-2xl shadow-sm p-8">
        <AnimatePresence mode="wait">
          {!isPublished ? (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Overview */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-body font-medium text-ink-primary mb-2">
                      Gig title
                    </label>
                    <div className="flex items-center text-xl font-body font-semibold text-ink-primary mb-2 flex-wrap">
                      <span className="mr-2 text-ink-tertiary">I will</span>
                      <input
                        type="text"
                        value={gigData.title}
                        onChange={(e) => setGigData({ ...gigData, title: e.target.value })}
                        placeholder="build a custom enterprise dashboard"
                        className="flex-1 min-w-[200px] border-b-2 border-border bg-transparent py-2 focus:border-accent DEFAULT focus:outline-none focus:ring-0 placeholder-ink-tertiary font-body"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-body font-medium text-ink-primary mb-2">
                        Category
                      </label>
                      <select
                        value={gigData.category}
                        onChange={(e) => setGigData({ ...gigData, category: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                      >
                        <option>Programming & Tech</option>
                        <option>Design</option>
                        <option>Writing</option>
                        <option>Marketing</option>
                        <option>Video & Animation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium text-ink-primary mb-2">
                        Search tags
                      </label>
                      <input
                        type="text"
                        value={gigData.tags}
                        onChange={(e) => setGigData({ ...gigData, tags: e.target.value })}
                        placeholder="react, tailwind, dashboard"
                        className="w-full h-11 px-4 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium text-ink-primary mb-2">
                      Description
                    </label>
                    <textarea
                      rows={6}
                      value={gigData.description}
                      onChange={(e) => setGigData({ ...gigData, description: e.target.value })}
                      placeholder="Describe what makes your service unique..."
                      className="w-full px-4 py-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Pricing Tiers */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-display font-semibold text-xl text-brand-900 mb-6">
                    Scope & pricing tiers
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {['basic', 'standard', 'premium'].map((tier, idx) => {
                      const tierNames = { basic: 'Basic', standard: 'Standard', premium: 'Premium' };
                      const packageData = gigData.packages[tier];
                      return (
                        <div key={tier} className="border border-border rounded-2xl p-5 bg-white shadow-sm">
                          <h3 className="font-body font-semibold text-lg text-ink-primary mb-4">
                            {tierNames[tier]}
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-body font-medium text-ink-secondary mb-1">
                                Package name
                              </label>
                              <input
                                type="text"
                                value={packageData.name}
                                onChange={(e) => updatePackage(tier, 'name', e.target.value)}
                                className="w-full h-9 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-body font-medium text-ink-secondary mb-1">
                                Description
                              </label>
                              <textarea
                                rows={3}
                                value={packageData.description}
                                onChange={(e) => updatePackage(tier, 'description', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none"
                              />
                            </div>
                            <div className="flex gap-3">
                              <div className="flex-1">
                                <label className="block text-xs font-body font-medium text-ink-secondary mb-1">
                                  Delivery
                                </label>
                                <select
                                  value={packageData.deliveryTime}
                                  onChange={(e) => updatePackage(tier, 'deliveryTime', e.target.value)}
                                  className="w-full h-9 px-2 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900"
                                >
                                  <option>1 Day</option>
                                  <option>3 Days</option>
                                  <option>7 Days</option>
                                  <option>14 Days</option>
                                  <option>30 Days</option>
                                </select>
                              </div>
                              <div className="flex-1">
                                <label className="block text-xs font-body font-medium text-ink-secondary mb-1">
                                  Revisions
                                </label>
                                <select
                                  value={packageData.revisions}
                                  onChange={(e) => updatePackage(tier, 'revisions', e.target.value)}
                                  className="w-full h-9 px-2 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900"
                                >
                                  <option>0</option>
                                  <option>1</option>
                                  <option>3</option>
                                  <option>5</option>
                                  <option>Unlimited</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-body font-medium text-ink-secondary mb-1">
                                Price (KES)
                              </label>
                              <input
                                type="number"
                                value={packageData.price}
                                onChange={(e) => updatePackage(tier, 'price', e.target.value)}
                                placeholder="50000"
                                className="w-full h-11 px-3 rounded-lg border border-border bg-white text-ink-primary text-lg font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-brand-900"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Gallery */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="font-display font-semibold text-xl text-brand-900 mb-6">
                    Gallery showcase
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="aspect-video bg-surface-muted rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-surface-soft hover:border-accent DEFAULT transition-all group"
                      >
                        <ImageIcon className="w-8 h-8 text-ink-tertiary mb-2 group-hover:text-accent DEFAULT transition-colors" />
                        <span className="text-sm font-body font-medium text-ink-tertiary group-hover:text-accent DEFAULT transition-colors">
                          Upload image {i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-ink-tertiary font-body text-center mt-4">
                    Upload high-quality images that showcase your work (JPG, PNG, max 5MB)
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            /* Step 4: Success */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center py-12"
            >
              <div className="w-20 h-20 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-accent DEFAULT" />
              </div>
              <h2 className="font-display font-bold text-2xl text-brand-900 mb-2">
                Gig published successfully!
              </h2>
              <p className="text-ink-secondary font-body max-w-md mx-auto mb-8">
                Your gig is now visible in the marketplace. Clients can now purchase your services instantly.
              </p>
              <Link to="/freelancer/gigs/analytics">
                <button className="px-6 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors shadow-sm">
                  View gig analytics
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {!isPublished && (
          <div className="mt-10 pt-6 border-t border-border flex justify-between">
            <button
              onClick={handleBack}
              disabled={isPublishing || step === 1}
              className={`px-6 py-2.5 rounded-lg font-body font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900 ${
                step === 1
                  ? 'invisible'
                  : 'border border-border text-ink-primary hover:bg-surface-muted'
              } ${isPublishing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Back
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-900"
              >
                Save & continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="px-8 py-2.5 rounded-lg bg-accent DEFAULT text-white hover:bg-accent-dark font-body font-medium text-sm transition-colors inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent DEFAULT disabled:opacity-40 cursor-not-allowed"
              >
                {isPublishing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Publish gig
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
