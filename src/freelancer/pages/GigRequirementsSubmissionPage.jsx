// src/pages/client/GigRequirementsSubmissionPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, UploadCloud, Link as LinkIcon, CheckCircle2,
  Clock, AlertCircle, Save, Send, ShieldCheck, Check
} from 'lucide-react';
import { useOrderById, useUpdateOrderStatus } from '../services/freelancerHooks';

export default function GigRequirementsSubmissionPage() {
  const { orderId } = useParams();
  const { data: orderData, isLoading: loadingOrder, error: orderError } = useOrderById(orderId);
  const updateOrderStatus = useUpdateOrderStatus();
  const [formData, setFormData] = useState({
    description: '',
    industry: '',
    files: [],
    url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);

  const ORDER = orderData?.order ?? orderData?.data ?? orderData;

  if (loadingOrder) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orderError) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-center">
        <p className="text-ink-secondary">Unable to load order requirements.</p>
      </div>
    );
  }

  if (!ORDER) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-center">
        <p className="text-ink-secondary">Order not found. Please check the link or try again later.</p>
      </div>
    );
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, files: [...prev.files, ...files] }));
    setShowSuccess({ message: `${files.length} file(s) added` });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleSaveDraft = () => {
    setShowSuccess({ message: 'Draft saved successfully' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      setShowSuccess({ message: 'Please describe your project', isError: true });
      setTimeout(() => setShowSuccess(null), 2000);
      return;
    }
    setIsSubmitting(true);
    updateOrderStatus.mutate(
      { orderId, data: { status: 'ACTIVE' } },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          setIsSubmitted(true);
          setShowSuccess({ message: 'Requirements submitted. Order is now active.' });
          setTimeout(() => setShowSuccess(null), 2500);
        },
        onError: () => {
          setIsSubmitting(false);
          setShowSuccess({ message: 'Failed to submit requirements. Please try again.', isError: true });
          setTimeout(() => setShowSuccess(null), 2500);
        }
      }
    );
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-surface-soft flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full border border-border"
        >
          <div className="w-20 h-20 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-5">
            <Clock className="w-10 h-10 text-accent DEFAULT" />
          </div>
          <h2 className="font-display font-bold text-2xl text-brand-900 mb-2">Order started!</h2>
          <p className="text-ink-secondary font-body mb-6">
            The seller has received your requirements. The {ORDER.deliveryDays}-day delivery countdown has begun.
          </p>
          <button className="w-full py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors">
            Go to order track
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-surface-soft py-12 px-4 sm:px-6"
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

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-mono font-semibold text-accent DEFAULT">Order {ORDER.id}</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-brand-900 mb-2">Submit requirements</h1>
          <p className="text-ink-secondary font-body">
            Please provide the details below so {ORDER.seller.name} can start working on your order.
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-warn-light border border-warn DEFAULT rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warn shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-body font-semibold text-warn mb-1">Order timer is paused</h4>
            <p className="text-xs text-warn/80 leading-relaxed">
              The delivery countdown will not begin until you submit all required information.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-border rounded-2xl shadow-lg overflow-hidden">

          <form onSubmit={handleSubmit}>
            <div className="p-6 sm:p-8 space-y-8">

              {/* Question 1: Description */}
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-7 h-7 rounded-full bg-accent-light text-accent DEFAULT flex items-center justify-center font-mono font-bold text-sm shrink-0 mt-0.5">1</div>
                  <label className="font-body font-semibold text-base text-ink-primary">
                    Please describe your project in detail.
                    <span className="text-danger ml-1">*</span>
                  </label>
                </div>
                <div className="pl-10">
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter project details..."
                    className="w-full min-h-[140px] bg-white border border-border rounded-xl p-4 text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none"
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-xs font-mono text-ink-tertiary">{formData.description.length} characters</span>
                  </div>
                </div>
              </div>

              {/* Question 2: Industry */}
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-7 h-7 rounded-full bg-accent-light text-accent DEFAULT flex items-center justify-center font-mono font-bold text-sm shrink-0 mt-0.5">2</div>
                  <label className="font-body font-semibold text-base text-ink-primary">
                    What industry is this project for?
                    <span className="text-ink-tertiary text-sm font-normal ml-2">(Optional)</span>
                  </label>
                </div>
                <div className="pl-10">
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    placeholder="e.g., Healthcare, E-commerce, Finance..."
                    className="w-full h-11 px-4 bg-white border border-border rounded-xl text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                  />
                </div>
              </div>

              {/* Question 3: File Upload */}
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-7 h-7 rounded-full bg-accent-light text-accent DEFAULT flex items-center justify-center font-mono font-bold text-sm shrink-0 mt-0.5">3</div>
                  <label className="font-body font-semibold text-base text-ink-primary">
                    Please attach your brand guidelines and logo files.
                    <span className="text-danger ml-1">*</span>
                  </label>
                </div>
                <div className="pl-10">
                  <label className="w-full border-2 border-dashed border-border bg-surface-soft rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-accent DEFAULT hover:bg-accent-light transition-all text-center group">
                    <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                    <UploadCloud className="w-10 h-10 text-ink-tertiary mb-2 group-hover:text-accent DEFAULT transition-colors" />
                    <h4 className="text-sm font-body font-medium text-ink-primary mb-1 group-hover:text-accent DEFAULT transition-colors">
                      Click to upload or drag & drop
                    </h4>
                    <p className="text-xs font-body text-ink-tertiary">SVG, PNG, JPG or PDF (max. 50MB)</p>
                  </label>

                  {formData.files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.files.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-surface-soft rounded-lg border border-border">
                          <FileText className="w-4 h-4 text-accent DEFAULT" />
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

              {/* Question 4: URL */}
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-7 h-7 rounded-full bg-accent-light text-accent DEFAULT flex items-center justify-center font-mono font-bold text-sm shrink-0 mt-0.5">4</div>
                  <label className="font-body font-semibold text-base text-ink-primary">
                    Do you have any inspiration websites?
                    <span className="text-ink-tertiary text-sm font-normal ml-2">(Optional)</span>
                  </label>
                </div>
                <div className="pl-10">
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({...formData, url: e.target.value})}
                      placeholder="https://..."
                      className="w-full h-11 pl-11 pr-4 bg-white border border-border rounded-xl text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-surface-soft border-t border-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-body font-medium text-ink-tertiary">
                <ShieldCheck className="w-4 h-4 text-accent DEFAULT" />
                Information is securely shared with the seller
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors"
                >
                  <Save className="w-4 h-4" /> Save draft
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.description.trim()}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Start order <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
