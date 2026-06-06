// ClientRevisionRequestPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  X,
  Send,
  Eye,
} from 'lucide-react';

// ─── Mock Data ──────────────────────────────────────────────────────────────
const ORDER = {
  id: '#ORD-9821',
  seller: { name: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?u=alex' },
  revisionsRemaining: 2,
  revisionsTotal: 3,
  delivery: {
    message:
      'Hi Sarah,\n\nHere is the final delivery for the React JS web application. I\'ve included all the source code in the attached ZIP file, and a README with instructions on how to run it locally.\n\nLet me know if you need any revisions. Thank you for your business!',
    files: [
      { name: 'react-app-source-v1.zip', size: '24.5 MB', type: 'zip' },
      { name: 'preview-screenshot.png', size: '1.2 MB', type: 'image' },
      { name: 'README.pdf', size: '450 KB', type: 'pdf' },
    ],
  },
};

// Helper for conditional classes
const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function ClientRevisionRequestPage() {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeFilePreview, setActiveFilePreview] = useState(null);

  const validateFeedback = (text) => {
    if (!text.trim()) return 'Please provide revision feedback.';
    if (text.trim().length < 10) return 'Please provide at least 10 characters of feedback.';
    return null;
  };

  const handleRequestRevision = async (e) => {
    e.preventDefault();
    const error = validateFeedback(feedback);
    if (error) {
      alert(error);
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };
  const buttonTap = { scale: 0.97 };
  const cardHover = {
    rest: { y: 0, boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    hover: {
      y: -3,
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface-soft flex flex-col items-center justify-center p-4 font-body">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-border rounded-2xl shadow-xl p-8 sm:p-12 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-warn-light text-warn rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="w-10 h-10" />
          </div>
          <h2 className="font-display text-2xl font-bold text-brand-900 mb-2">Revision Requested</h2>
          <p className="text-ink-secondary font-medium mb-8">
            The seller has been notified of your changes. The order delivery time has been paused until the revision is provided.
          </p>
          <button className="w-full py-3.5 bg-brand-900 text-white font-semibold rounded-xl shadow-sm hover:bg-brand-800 transition-colors">
            Return to Order Tracking
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-soft font-body py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left Column: Review Delivery */}
        <div className="flex-1 space-y-8">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-accent">
              <span>Order {ORDER.id}</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-brand-900 tracking-tight">
              Review Delivery
            </h1>
          </div>

          {/* Delivery Card */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover={cardHover.hover}
            className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="p-5 border-b border-border bg-surface-soft flex items-center gap-4">
              <img
                src={ORDER.seller.avatar}
                alt="Seller"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-ink-primary">{ORDER.seller.name} delivered your order</h3>
                <p className="text-xs font-medium text-ink-tertiary">Delivered 2 hours ago</p>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <div className="prose text-sm text-ink-secondary whitespace-pre-wrap mb-6">
                {ORDER.delivery.message}
              </div>

              <h4 className="text-sm font-semibold text-ink-primary mb-3 uppercase tracking-wide">
                Delivered Files
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ORDER.delivery.files.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-surface-soft border border-border rounded-xl group hover:border-accent/30 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                      {file.type === 'image' ? (
                        <ImageIcon className="w-5 h-5 text-accent" />
                      ) : file.type === 'pdf' ? (
                        <FileText className="w-5 h-5 text-info" />
                      ) : (
                        <FileText className="w-5 h-5 text-ink-tertiary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-primary truncate">{file.name}</p>
                      <p className="text-xs font-medium text-ink-tertiary">{file.size}</p>
                    </div>
                    {file.type === 'image' && (
                      <button
                        onClick={() => setActiveFilePreview(file)}
                        className="p-2 rounded-lg text-ink-tertiary hover:text-accent opacity-0 group-hover:opacity-100 transition-all"
                        aria-label="Preview image"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Image Preview Panel */}
          <AnimatePresence>
            {activeFilePreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="p-4 bg-surface-soft border-b border-border flex justify-between items-center">
                  <span className="text-sm font-semibold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-accent" /> {activeFilePreview.name}
                  </span>
                  <button
                    onClick={() => setActiveFilePreview(null)}
                    className="p-1 rounded-md hover:bg-surface-muted transition-colors"
                    aria-label="Close preview"
                  >
                    <X className="w-4 h-4 text-ink-tertiary" />
                  </button>
                </div>
                <div className="p-6 flex justify-center bg-surface-soft/50">
                  <div className="relative inline-block border border-border rounded-lg shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"
                      alt="Preview"
                      className="max-w-full rounded"
                    />
                    {/* Static annotation pin (no looping animation) */}
                    <div className="absolute top-[30%] left-[45%] w-6 h-6 bg-warn text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md border-2 border-white">
                      1
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Revision Request Form */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="sticky top-8 bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
            {/* Form Header */}
            <div className="p-6 border-b border-border bg-warn-light">
              <h2 className="font-display text-xl font-bold text-warn flex items-center gap-2 mb-1">
                <RefreshCw className="w-5 h-5" /> Request a Revision
              </h2>
              <p className="text-sm text-warn-dark font-medium">
                Not quite right? Outline what needs to be changed.
              </p>
            </div>

            {/* Revisions Remaining Badge */}
            <div className="px-6 py-4 border-b border-border bg-surface-soft flex justify-between items-center">
              <span className="text-sm font-semibold text-ink-primary">Revisions Remaining</span>
              <div className="flex gap-1">
                {Array.from({ length: ORDER.revisionsTotal }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-3 h-3 rounded-full',
                      i < ORDER.revisionsRemaining ? 'bg-warn' : 'bg-surface-muted'
                    )}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleRequestRevision} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-ink-primary mb-2">
                  What needs to be changed?
                </label>
                <textarea
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Be as specific as possible. Point out exact files, colors, wording, or functionality that requires adjusting..."
                  className="w-full min-h-[160px] border border-border rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent resize-none bg-white text-ink-primary placeholder:text-ink-tertiary"
                />
              </div>

              {/* Guidelines Info */}
              <div className="flex items-start gap-3 p-4 bg-surface-soft rounded-xl border border-border">
                <AlertCircle className="w-4 h-4 text-ink-tertiary shrink-0 mt-0.5" />
                <p className="text-xs text-ink-tertiary leading-relaxed">
                  Revisions must fall within the scope of the original requirements. Completely new features may require purchasing an extra.
                </p>
              </div>

              <motion.button
                whileTap={buttonTap}
                type="submit"
                disabled={isSubmitting || !feedback.trim()}
                className="w-full py-3.5 bg-warn hover:bg-warn-dark text-white font-semibold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>Submitting <span className="animate-pulse">...</span></>
                ) : (
                  <>Submit Revision Request <Send className="w-4 h-4" /></>
                )}
              </motion.button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm font-medium text-ink-tertiary hover:text-ink-primary transition-colors"
                >
                  Actually, I accept the delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
