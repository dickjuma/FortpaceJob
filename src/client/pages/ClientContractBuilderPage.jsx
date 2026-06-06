// ClientContractBuilderPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ShieldCheck,
  Download,
  Plus,
  CheckCircle,
  Clock,
  Search,
  ChevronRight,
  Edit2,
  AlertTriangle,
} from 'lucide-react';

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function ClientContractBuilderPage() {
  const [template, setTemplate] = useState('Standard NDA');
  const [vendorName, setVendorName] = useState('Sarah Jenkins');
  const [scopeOfWork, setScopeOfWork] = useState(
    'Create premium interactive CSS animations and geofenced telemetry panels.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!vendorName.trim() || !scopeOfWork.trim()) {
      showToast('error', 'Please complete all credential fields.');
      return;
    }

    setIsGenerating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    showToast('success', 'Contract drafted successfully! Dispatched for signature center approval.');
    setIsGenerating(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };
  const buttonTap = { scale: 0.97 };

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6 mb-8">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-brand-900 tracking-tight">
              Contract Builder & NDA Generator
            </h1>
            <p className="text-ink-secondary text-sm mt-1">
              Draft legally compliant agreements, automatically append Standard NDA clauses, and dispatch documents for e-signatures.
            </p>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Side: Drafting Form */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              variants={itemVariants}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm"
            >
              <h3 className="flex items-center gap-2 font-display font-bold text-brand-900 text-sm uppercase tracking-wide mb-4">
                <Edit2 size={18} className="text-accent" /> Agreement Drafting Desk
              </h3>
              <form onSubmit={handleGenerate} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                      Document Agreement Template
                    </label>
                    <select
                      value={template}
                      onChange={(e) => setTemplate(e.target.value)}
                      className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white text-ink-primary"
                    >
                      <option value="Standard NDA">Standard Non-Disclosure Agreement (NDA)</option>
                      <option value="MSA Contract">Master Services Agreement (MSA)</option>
                      <option value="Milestone Escrow">Milestone-Based Escrow Agreement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                      Vendor Legal Name
                    </label>
                    <input
                      type="text"
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                      placeholder="Enter legal name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                    Scope of Work (SOW) & Deliverables Details
                  </label>
                  <textarea
                    rows={4}
                    value={scopeOfWork}
                    onChange={(e) => setScopeOfWork(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent resize-none"
                    placeholder="Describe the project scope, deliverables, and milestones..."
                  />
                </div>
                <motion.button
                  whileTap={buttonTap}
                  type="submit"
                  disabled={isGenerating}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>Processing...</>
                  ) : (
                    <>Generate Legal Agreement</>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Right Side: Checklist */}
          <div className="space-y-6">
            <motion.div
              variants={itemVariants}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm"
            >
              <h3 className="flex items-center gap-2 font-display font-bold text-accent text-sm uppercase tracking-wide mb-4">
                <ShieldCheck size={18} /> Legal Clearance Checklist
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-ink-secondary">Standard NDA Annex:</span>
                  <span className="font-semibold text-accent">APPENDED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-secondary">Withholding tax VAT rules:</span>
                  <span className="font-semibold text-accent">RESOLVED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-secondary">Disputes arbitration state:</span>
                  <span className="font-mono text-ink-primary">Nairobi / HSL-Secure</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Tip Card */}
            <motion.div
              variants={itemVariants}
              className="bg-accent-light border border-accent/20 rounded-2xl p-6"
            >
              <h4 className="flex items-center gap-2 font-display font-bold text-accent-dark text-sm mb-2">
                <FileText size={16} /> Need help?
              </h4>
              <p className="text-sm text-ink-primary">
                All contracts include standard clauses compliant with Kenyan law. For custom terms, contact legal support.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
            style={{
              backgroundColor:
                toast.type === 'success'
                  ? 'rgb(220, 252, 231)'
                  : toast.type === 'error'
                  ? 'rgb(254, 226, 226)'
                  : 'rgb(219, 234, 254)',
              color:
                toast.type === 'success'
                  ? 'rgb(21, 128, 61)'
                  : toast.type === 'error'
                  ? 'rgb(185, 28, 28)'
                  : 'rgb(29, 78, 216)',
            }}
          >
            {toast.type === 'success' && <CheckCircle size={16} />}
            {toast.type === 'error' && <AlertTriangle size={16} />}
            {toast.type === 'info' && <ShieldCheck size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
