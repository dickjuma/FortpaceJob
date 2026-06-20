// ClientCompliancePage.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Download,
  Plus,
  CheckCircle,
  Clock,
  Search,
  ChevronRight,
  X,
} from 'lucide-react';

// ----------------------------------------------------------------------
// Mock Data & Helpers
// ----------------------------------------------------------------------


// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function ClientCompliancePage() {
    const queryClient = useQueryClient();
  const { data: documentsData } = useQuery({
    queryKey: ['client', 'compliance'],
    queryFn: async () => {
      return [
        { id: 'DOC-001', name: 'Master Services Agreement (MSA)', type: 'Legal', status: 'Signed & Active', date: '2026-01-15' },
        { id: 'DOC-002', name: 'Standard Non-Disclosure Agreement (NDA)', type: 'Compliance', status: 'Signed & Active', date: '2026-02-10' },
        { id: 'DOC-003', name: 'KRA Tax pin certification (Acme Solutions)', type: 'Taxation', status: 'Pending Verification', date: '2026-05-20' },
        { id: 'DOC-004', name: 'Director ID verification payload', type: 'Verification', status: 'Signed & Active', date: '2026-03-01' }
      ];
    }
  });
  const documents = documentsData || [];
  const [verifyingDocId, setVerifyingDocId] = useState(null);
  const [toast, setToast] = useState(null); // { type, message }

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const verifyMutation = useMutation({
    mutationFn: async (docId) => {
      await new Promise(resolve => setTimeout(resolve, 1800));
      return docId;
    },
    onSuccess: (docId) => {
      queryClient.setQueryData(['client', 'compliance'], old => old.map(d => d.id === docId ? { ...d, status: 'Signed & Active' } : d));
      showToast('success', 'KRA Tax Certificate successfully validated! Compliance status: GREEN.');
      setVerifyingDocId(null);
    }
  });

  const handleVerifyKra = (docId) => {
    setVerifyingDocId(docId);
    verifyMutation.mutate(docId);
  };

  const handleAddDocument = () => {
    showToast('info', 'New compliance template initialized.');
  };

  const handleDownload = (docName) => {
    showToast('success', `Dispatching PDF template download for ${docName}...`);
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
  const tableRowVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };
  const buttonTap = { scale: 0.97 };

  const pendingCount = documents.filter((d) => d.status === 'Pending Verification').length;
  const activeCount = documents.filter((d) => d.status === 'Signed & Active').length;

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6 mb-8">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-brand-900 tracking-tight">
              Compliance & Legal Center
            </h1>
            <p className="text-ink-secondary text-sm mt-1">
              Audit company registrations, manage automated NDA contracts, and inspect KRA tax clearance certificates.
            </p>
          </div>
          <motion.button
            whileTap={buttonTap}
            onClick={handleAddDocument}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors shadow-sm"
          >
            <Plus size={16} /> Add Compliance Doc
          </motion.button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Metrics & Warnings */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Audit Checklist Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm"
            >
              <h3 className="flex items-center gap-2 font-display font-bold text-brand-900 text-sm uppercase tracking-wide mb-4">
                <ShieldCheck size={18} className="text-accent" /> Audit Checklist
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink-secondary">MSA Signed:</span>
                  <span className="font-semibold text-accent">COMPLETED</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink-secondary">Director KYC:</span>
                  <span className="font-semibold text-accent">COMPLETED</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink-secondary">Tax Clearance PIN:</span>
                  <span className="font-semibold text-warn">PENDING AUDIT</span>
                </div>
              </div>
            </motion.div>

            {/* Tax Warning Card */}
            <motion.div
              variants={itemVariants}
              className="bg-warn-light border border-warn/20 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-warn/10 rounded-full blur-2xl"></div>
              <h4 className="flex items-center gap-2 font-display font-bold text-warn text-sm uppercase tracking-wide mb-3">
                <AlertTriangle size={16} /> Tax Verification Warning
              </h4>
              <p className="text-sm text-ink-primary leading-relaxed">
                Your corporate wallet releases are currently locked to a KES 150,000 threshold limit
                until KRA tax PIN verification is verified.
              </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              variants={itemVariants}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm"
            >
              <h3 className="font-display font-bold text-brand-900 text-sm uppercase tracking-wide mb-4">
                Document Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-accent">{activeCount}</div>
                  <div className="text-xs text-ink-tertiary">Active / Signed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-warn">{pendingCount}</div>
                  <div className="text-xs text-ink-tertiary">Pending Verification</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Documents Table */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2"
          >
            <motion.div
              variants={itemVariants}
              className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-border">
                <h3 className="font-display font-bold text-brand-900 text-sm uppercase tracking-wide flex items-center gap-2">
                  <FileText size={18} className="text-accent" /> Legal Compliance Documents ({documents.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface-muted/30">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-ink-tertiary uppercase tracking-wide">
                        Document Info
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-ink-tertiary uppercase tracking-wide">
                        Classification
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-ink-tertiary uppercase tracking-wide">
                        Last Modified
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-ink-tertiary uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-ink-tertiary uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {documents.map((doc, idx) => (
                      <motion.tr
                        key={doc.id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-surface-soft transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-ink-primary">{doc.name}</div>
                          <span className="text-[10px] font-mono text-ink-tertiary uppercase">
                            {doc.id}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-ink-secondary text-sm">{doc.type}</td>
                        <td className="px-6 py-4 text-ink-secondary font-mono text-sm">
                          {doc.date}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              doc.status === 'Signed & Active'
                                ? 'bg-accent-light text-accent-dark'
                                : 'bg-warn-light text-warn'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {doc.status === 'Pending Verification' ? (
                            <motion.button
                              whileTap={buttonTap}
                              onClick={() => handleVerifyKra(doc.id)}
                              disabled={verifyingDocId === doc.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {verifyingDocId === doc.id ? (
                                <>Verifying...</>
                              ) : (
                                <>Verify iTax Clearance</>
                              )}
                            </motion.button>
                          ) : (
                            <motion.button
                              whileTap={buttonTap}
                              onClick={() => handleDownload(doc.name)}
                              className="inline-flex items-center gap-1 text-ink-tertiary hover:text-accent transition-colors text-xs font-medium"
                            >
                              <Download size={14} /> Download PDF
                            </motion.button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        </div>
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

