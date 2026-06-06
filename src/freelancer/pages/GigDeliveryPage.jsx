// src/pages/freelancer/GigDeliveryPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, UploadCloud, CheckCircle2, FileText,
  Send, AlertCircle, Image as ImageIcon, Link as LinkIcon, Check
} from 'lucide-react';
import { useOrderById, useUpdateOrderStatus } from '../services/freelancerHooks';

const CHECKLIST = [
  { id: '1', text: 'I have met all the requirements specified by the buyer' },
  { id: '2', text: 'The delivery files are final and ready for review' },
  { id: '3', text: 'I have not included any contact information or external payment links' }
];

export default function GigDeliveryPage() {
  const { orderId } = useParams();
  const { data: orderData, isLoading: loadingOrder, error: orderError } = useOrderById(orderId);
  const updateOrderStatus = useUpdateOrderStatus();

  const [message, setMessage] = useState('Hi Sarah,\n\nHere is the final delivery for the React JS web application. I\'ve included all the source code in the attached ZIP file, and a README with instructions on how to run it locally.\n\nLet me know if you need any revisions. Thank you for your business!');
  const [files, setFiles] = useState([]);
  const [portfolioSample, setPortfolioSample] = useState(false);
  const [checklist, setChecklist] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);

  if (loadingOrder) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orderError) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center p-4">
        <div className="bg-white border border-border rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
          <AlertCircle className="w-10 h-10 text-warn mx-auto mb-4" />
          <h2 className="font-display font-semibold text-xl text-brand-900 mb-2">Unable to load order</h2>
          <p className="text-ink-secondary">Please refresh the page or try again later.</p>
        </div>
      </div>
    );
  }

  const ORDER = orderData?.order ?? orderData?.data ?? orderData;
  const isDelivering = updateOrderStatus.isLoading;
  const orderStatusError = updateOrderStatus.error;

  if (!ORDER) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center p-4">
        <div className="bg-white border border-border rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
          <AlertCircle className="w-10 h-10 text-warn mx-auto mb-4" />
          <h2 className="font-display font-semibold text-xl text-brand-900 mb-2">Order not found</h2>
          <p className="text-ink-secondary">We could not find this order. Please check the link or contact support.</p>
        </div>
      </div>
    );
  }

  const toggleChecklist = (id) => {
    setChecklist(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...uploadedFiles]);
    setShowSuccess({ message: `${uploadedFiles.length} file(s) added` });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleDeliver = (e) => {
    e.preventDefault();
    if (checklist.length !== CHECKLIST.length) return;

    updateOrderStatus.mutate({ orderId, data: { status: 'DELIVERED' } }, {
      onSuccess: () => {
        setIsSuccess(true);
      },
    });
  };

  const allChecked = checklist.length === CHECKLIST.length;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface-soft flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full border border-border"
        >
          <div className="w-20 h-20 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Package className="w-10 h-10 text-accent DEFAULT" />
          </div>
          <h2 className="font-display font-bold text-2xl text-brand-900 mb-2">Order delivered!</h2>
          <p className="text-ink-secondary font-body mb-6">
            Your work has been sent to {ORDER.client.name}. They have 3 days to review.
          </p>
          <button className="w-full py-3 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors">
            Back to dashboard
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
      className="min-h-screen bg-surface-soft py-12 px-4 sm:px-6 flex justify-center items-start"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl w-full">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-mono font-semibold text-accent DEFAULT">Order {ORDER.id}</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-brand-900 mb-2">Deliver your work</h1>
          <p className="text-ink-secondary font-body flex items-center gap-2">
            Deliver your completed work to
            <img
              src={ORDER.client.avatar}
              alt={ORDER.client.name}
              className="w-5 h-5 rounded-full object-cover inline-block"
              width={20}
              height={20}
            />
            {ORDER.client.name}
          </p>
        </div>

        <form onSubmit={handleDeliver}>

          {/* Main Delivery Box */}
          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="p-6 space-y-6">

              {/* Message */}
              <div>
                <label className="text-sm font-body font-semibold text-ink-primary mb-2 block">
                  Message to buyer
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full min-h-[140px] bg-white border border-border rounded-xl p-4 text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none"
                  placeholder="Describe what you have delivered..."
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="text-sm font-body font-semibold text-ink-primary mb-2 block">
                  Delivery files
                </label>
                <label className="w-full border-2 border-dashed border-border bg-surface-soft rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-accent DEFAULT hover:bg-accent-light transition-all text-center group">
                  <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                  <UploadCloud className="w-10 h-10 text-ink-tertiary mb-2 group-hover:text-accent DEFAULT transition-colors" />
                  <h4 className="text-sm font-body font-semibold text-ink-primary mb-1 group-hover:text-accent DEFAULT transition-colors">
                    Upload delivery files
                  </h4>
                  <p className="text-xs font-body text-ink-tertiary max-w-sm">
                    ZIP files recommended for multiple files. Max size: 5GB
                  </p>
                </label>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file, idx) => (
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

              {/* Portfolio Sample Selection */}
              <div className="pt-4 border-t border-border">
                <div
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    portfolioSample
                      ? "border-accent DEFAULT bg-accent-light"
                      : "border-border bg-white hover:border-border-strong"
                  }`}
                  onClick={() => setPortfolioSample(!portfolioSample)}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    portfolioSample ? "bg-accent DEFAULT" : "border-2 border-border bg-white"
                  }`}>
                    {portfolioSample && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-body font-semibold text-ink-primary mb-1 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-accent DEFAULT" /> Add sample to gig gallery
                    </h4>
                    <p className="text-xs font-body text-ink-tertiary leading-relaxed">
                      If the buyer leaves a positive review, this sample can be showcased on your gig page
                    </p>

                    <AnimatePresence>
                      {portfolioSample && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-accent DEFAULT/30"
                        >
                          <div className="w-full h-24 border-2 border-dashed border-accent DEFAULT/30 bg-accent-light/30 rounded-xl flex items-center justify-center text-accent DEFAULT text-xs font-body font-medium hover:border-accent DEFAULT transition-colors cursor-pointer">
                            <UploadCloud className="w-4 h-4 mr-2" /> Upload watermarked image
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checklist & Submit */}
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
            <h3 className="text-sm font-body font-semibold text-ink-primary mb-5 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-warn" /> Delivery checklist
            </h3>

            <div className="space-y-3 mb-6">
              {CHECKLIST.map(item => {
                const isChecked = checklist.includes(item.id);
                return (
                  <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        isChecked
                          ? "bg-accent DEFAULT border-accent DEFAULT"
                          : "border-border bg-white group-hover:border-accent DEFAULT"
                      }`}
                      onClick={() => toggleChecklist(item.id)}
                    >
                      {isChecked && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm font-body transition-colors ${
                      isChecked ? "text-ink-primary" : "text-ink-tertiary group-hover:text-ink-primary"
                    }`}>
                      {item.text}
                    </span>
                  </label>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={!allChecked || isDelivering}
              className="w-full py-3 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-semibold text-sm transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDelivering ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Delivering...
                </>
              ) : (
                <>
                  Deliver final work <Send className="w-4 h-4" />
                </>
              )}
            </button>

            {orderStatusError && (
              <div className="mt-4 rounded-2xl bg-danger/10 border border-danger p-3 text-sm text-danger">
                {orderStatusError?.message || 'Unable to deliver order. Please try again.'}
              </div>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
}
