// src/pages/freelancer/FreelancerDeliveryPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, UploadCloud, CheckCircle2, Link as LinkIcon,
  MessageSquare, FileText, FileBadge, Info,
  ChevronRight, Clock, AlertCircle, Check, X
} from 'lucide-react';

const HISTORY = [
  { id: 1, type: 'submission', title: 'Initial Draft', date: 'May 16, 2026', status: 'Revision Requested' },
  { id: 2, type: 'revision', title: 'Client Feedback', date: 'May 17, 2026', comment: 'Please adjust the header layout.' },
];

export default function FreelancerDeliveryPage() {
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [checklist, setChecklist] = useState({ source: false, assets: false, instructions: false });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
    setShowSuccess({ message: `${files.length} file(s) added` });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!deliveryMessage.trim() || uploadedFiles.length === 0) {
      setShowSuccess({ message: 'Please add a delivery message and at least one file', isError: true });
      setTimeout(() => setShowSuccess(null), 3000);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess({ message: 'Delivery submitted successfully!' });
      setTimeout(() => setShowSuccess(null), 3000);
    }, 1500);
  };

  const allChecked = checklist.source && checklist.assets && checklist.instructions;

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
          <div className="flex items-center gap-2 text-xs font-body font-medium text-ink-tertiary mb-3">
            <a href="#" className="hover:text-accent DEFAULT transition-colors">Contracts</a>
            <ChevronRight className="w-3 h-3" />
            <a href="#" className="hover:text-accent DEFAULT transition-colors">E-Commerce App</a>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-light rounded-xl">
                  <Package className="w-6 h-6 text-accent DEFAULT" />
                </div>
                <h1 className="font-display font-bold text-2xl text-brand-900">Submit final delivery</h1>
              </div>
              <p className="text-sm font-body text-ink-secondary mt-1">
                Client: Sarah Mitchell • Contract: #CTR-2024-8821
              </p>
            </div>

            <div className="flex items-center gap-3 bg-warn-light border border-warn DEFAULT px-4 py-2 rounded-xl">
              <Clock className="w-5 h-5 text-warn" />
              <div>
                <p className="text-xs font-body font-semibold text-warn uppercase tracking-wide">Due in</p>
                <p className="text-sm font-mono font-bold text-warn">2 days, 4 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">

        {/* Main Delivery Form */}
        <div className="flex-1 space-y-6">

          {/* Delivery Details */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-display font-semibold text-lg text-brand-900 mb-5">Delivery details</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-body font-medium text-ink-primary mb-2">
                  Delivery message
                </label>
                <p className="text-xs font-body text-ink-tertiary mb-3">
                  Explain what you have delivered and any instructions for the client
                </p>
                <textarea
                  rows={5}
                  value={deliveryMessage}
                  onChange={(e) => setDeliveryMessage(e.target.value)}
                  placeholder="Hi Sarah, I've attached the final zip file containing..."
                  className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm font-body text-ink-primary placeholder-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent resize-y"
                />
              </div>

              {/* File Upload */}
              <div>
                <h3 className="text-sm font-body font-medium text-ink-primary mb-3">Attach files</h3>
                <label className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-accent DEFAULT hover:bg-accent-light transition-all group">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-6 h-6 text-accent DEFAULT" />
                  </div>
                  <p className="text-sm font-body font-medium text-ink-primary mb-1">
                    Drag & drop files or <span className="text-accent DEFAULT">browse</span>
                  </p>
                  <p className="text-xs font-body text-ink-tertiary">ZIP, PDF, Source files up to 5GB</p>
                </label>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-surface-soft rounded-lg border border-border">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-accent DEFAULT" />
                          <span className="text-sm font-body text-ink-primary">{file.name}</span>
                          <span className="text-xs font-mono text-ink-tertiary">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(idx)}
                          className="p-1 rounded hover:bg-danger-light transition-colors"
                        >
                          <X className="w-4 h-4 text-ink-tertiary hover:text-danger" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* External Link */}
              <div>
                <h3 className="text-sm font-body font-medium text-ink-primary mb-3">External links (optional)</h3>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
                  <input
                    type="url"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    placeholder="https://figma.com/file/..."
                    className="w-full pl-10 pr-4 h-10 bg-white border border-border rounded-xl text-sm font-body text-ink-primary placeholder-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Checklist */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-display font-semibold text-lg text-brand-900 mb-2">Delivery checklist</h2>
            <p className="text-sm font-body text-ink-secondary mb-5">
              Make sure you have included everything required by the contract
            </p>

            <div className="space-y-3">
              {[
                { id: 'source', label: 'Source files included', description: 'Original project files (Figma, PSD, Code)' },
                { id: 'assets', label: 'Final assets included', description: 'Exported deliverables ready for use' },
                { id: 'instructions', label: 'Instructions added', description: 'Clear steps on how to use or install the files' }
              ].map(item => (
                <label
                  key={item.id}
                  className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                    checklist[item.id]
                      ? 'border-accent DEFAULT bg-accent-light'
                      : 'border-border hover:bg-surface-soft'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-0.5 rounded border-border text-accent DEFAULT focus:ring-accent DEFAULT"
                    checked={checklist[item.id]}
                    onChange={() => setChecklist(p => ({ ...p, [item.id]: !p[item.id] }))}
                  />
                  <div>
                    <h4 className="font-body font-semibold text-sm text-ink-primary">{item.label}</h4>
                    <p className="text-xs font-body text-ink-tertiary">{item.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-2">
            <button className="px-6 py-2.5 rounded-lg font-body font-medium text-sm text-ink-secondary hover:text-ink-primary hover:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-semibold text-sm transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  Submit delivery
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-5">

          {/* Delivery Process */}
          <div className="bg-brand-900 rounded-2xl p-5 text-white shadow-sm">
            <h3 className="font-body font-semibold flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-accent-light" /> Delivery process
            </h3>
            <ul className="space-y-3 text-sm font-body text-white/80">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 font-mono font-bold text-xs text-white">1</div>
                You submit the final work with all requirements
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 font-mono font-bold text-xs text-white">2</div>
                The client has 3 days to review and approve
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 font-mono font-bold text-xs text-white">3</div>
                Once approved, payment is released to your wallet
              </li>
            </ul>
          </div>

          {/* Delivery History */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-body font-semibold text-ink-primary flex items-center gap-2 mb-5">
              <Clock className="w-5 h-5 text-accent DEFAULT" /> Delivery history
            </h3>

            <div className="space-y-4 relative before:absolute before:left-2.5 before:top-0 before:bottom-0 before:w-0.5 before:bg-border">
              {HISTORY.map((item, i) => (
                <div key={item.id} className="relative flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-white border-2 border-accent DEFAULT flex items-center justify-center shrink-0 z-10 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-accent DEFAULT" />
                  </div>
                  <div>
                    <h4 className="font-body font-semibold text-sm text-ink-primary">{item.title}</h4>
                    <span className="text-xs font-mono text-ink-tertiary">{item.date}</span>
                    {item.comment && (
                      <div className="mt-2 p-3 bg-surface-soft rounded-xl text-sm font-body text-ink-secondary border border-border">
                        "{item.comment}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Validation Summary */}
          <div className="bg-surface-soft border border-border rounded-2xl p-5">
            <h3 className="font-body font-semibold text-ink-primary mb-3">Ready to submit?</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-body">
                {deliveryMessage.trim() ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent DEFAULT" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-ink-tertiary" />
                )}
                <span className={deliveryMessage.trim() ? 'text-accent-dark' : 'text-ink-tertiary'}>
                  Delivery message added
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-body">
                {uploadedFiles.length > 0 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent DEFAULT" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-ink-tertiary" />
                )}
                <span className={uploadedFiles.length > 0 ? 'text-accent-dark' : 'text-ink-tertiary'}>
                  {uploadedFiles.length} file(s) attached
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-body">
                {allChecked ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent DEFAULT" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-ink-tertiary" />
                )}
                <span className={allChecked ? 'text-accent-dark' : 'text-ink-tertiary'}>
                  All checklist items complete
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
