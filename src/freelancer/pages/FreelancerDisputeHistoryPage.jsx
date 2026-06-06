// src/pages/freelancer/FreelancerDisputeHistoryPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, FileText, Clock, AlertTriangle,
  CheckCircle2, Upload, MessageSquare, ChevronRight,
  ShieldAlert, DollarSign, Check
} from 'lucide-react';

const DISPUTES = [
  {
    id: '#DSP-0921',
    contract: 'Mobile App Redesign',
    client: 'Global Tech LLC',
    amount: 2400,
    status: 'In Review',
    deadline: 'May 24, 2026',
    date: 'May 14, 2026',
    isActive: true,
    timeline: 2
  },
  {
    id: '#DSP-0845',
    contract: 'E-commerce API Integration',
    client: 'Sarah Mitchell',
    amount: 1200,
    status: 'Resolved in your favor',
    date: 'Apr 02, 2026',
    isActive: false,
    ruling: 'Based on the evidence provided (commit logs and delivery timestamp), the mediator found that all milestone requirements were met. Full funds have been released to your wallet.'
  }
];

export default function FreelancerDisputeHistoryPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [showSuccess, setShowSuccess] = useState(null);

  const handleRespond = (disputeId) => {
    setShowSuccess({ message: `Responding to dispute ${disputeId}` });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleOfferSettlement = (disputeId) => {
    setShowSuccess({ message: `Settlement offer form would open for ${disputeId}` });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleDownloadRuling = () => {
    setShowSuccess({ message: 'Downloading ruling PDF' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const activeDisputes = DISPUTES.filter(d => d.isActive);
  const resolvedDisputes = DISPUTES.filter(d => !d.isActive);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-surface-soft pb-16"
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

      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-danger-light rounded-xl">
                  <Scale className="w-6 h-6 text-danger" />
                </div>
                <h1 className="font-display font-bold text-3xl text-brand-900">Dispute center</h1>
              </div>
              <p className="text-ink-secondary font-body">Track active disputes, upload evidence, and view resolution history</p>
            </div>

            <div className="flex bg-surface-muted p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-5 py-1.5 rounded-md text-sm font-body font-medium transition-all ${
                  activeTab === 'active'
                    ? 'bg-white text-ink-primary shadow-sm'
                    : 'text-ink-tertiary hover:text-ink-secondary'
                }`}
              >
                Active ({activeDisputes.length})
              </button>
              <button
                onClick={() => setActiveTab('resolved')}
                className={`px-5 py-1.5 rounded-md text-sm font-body font-medium transition-all ${
                  activeTab === 'resolved'
                    ? 'bg-white text-ink-primary shadow-sm'
                    : 'text-ink-tertiary hover:text-ink-secondary'
                }`}
              >
                Resolved ({resolvedDisputes.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">

        {/* Left Column: Dispute List */}
        <div className="flex-1 space-y-5">
          {(activeTab === 'active' ? activeDisputes : resolvedDisputes).map((dispute, idx) => (
            <motion.div
              key={dispute.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-border bg-surface-soft">
                <div className="flex flex-wrap gap-4 justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h2 className="font-body font-semibold text-lg text-ink-primary">{dispute.contract}</h2>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-body font-medium ${
                        dispute.status === 'In Review'
                          ? 'bg-warn-light text-warn border border-warn DEFAULT'
                          : 'bg-accent-light text-accent-dark border border-accent DEFAULT'
                      }`}>
                        {dispute.status}
                      </span>
                    </div>
                    <p className="text-sm font-body text-ink-secondary">
                      Client: {dispute.client} • Opened {dispute.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                      Amount in escrow
                    </p>
                    <p className="font-mono font-semibold text-2xl text-ink-primary flex items-center gap-1 justify-end">
                      KES {dispute.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {dispute.isActive ? (
                <div className="p-5">
                  {/* Timeline */}
                  <div className="mb-6">
                    <h3 className="text-sm font-body font-semibold text-ink-primary mb-4">Resolution timeline</h3>
                    <div className="relative flex justify-between">
                      <div className="absolute top-4 left-0 right-0 h-0.5 bg-border -z-10 rounded-full" />
                      <div className="absolute top-4 left-0 w-1/2 h-0.5 bg-warn -z-10 rounded-full" />

                      {[
                        { step: 1, label: 'Opened', completed: true },
                        { step: 2, label: 'Mediation', completed: true },
                        { step: 3, label: 'Arbitration', completed: false },
                        { step: 4, label: 'Resolved', completed: false }
                      ].map((item) => (
                        <div key={item.step} className="flex flex-col items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-semibold ${
                            item.completed
                              ? 'bg-warn text-white'
                              : 'bg-surface-muted text-ink-tertiary'
                          }`}>
                            {item.completed ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                          </div>
                          <span className={`text-xs font-body font-medium ${
                            item.completed ? 'text-warn' : 'text-ink-tertiary'
                          }`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Required Banner */}
                  <div className="bg-warn-light border border-warn DEFAULT rounded-xl p-4 flex gap-3 mb-5">
                    <Clock className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-body font-semibold text-warn">Action required: submit evidence</h4>
                      <p className="text-xs font-body text-warn/80 mt-1">
                        You have until {dispute.deadline} to submit your response and supporting documents. Failure to respond may result in an automatic ruling.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleRespond(dispute.id)}
                      className="flex-1 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900"
                    >
                      Respond & upload evidence
                    </button>
                    <button
                      onClick={() => handleOfferSettlement(dispute.id)}
                      className="px-5 py-2.5 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900"
                    >
                      Offer settlement
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-accent-light/20">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent-light text-accent DEFAULT flex items-center justify-center shrink-0">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-body font-semibold text-ink-primary">Ruling summary</h4>
                      <p className="text-sm font-body text-ink-secondary mt-1">{dispute.ruling}</p>
                      <button
                        onClick={handleDownloadRuling}
                        className="mt-3 text-xs font-body font-medium text-accent DEFAULT hover:text-accent-dark flex items-center gap-1 transition-colors"
                      >
                        Download official ruling PDF <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {(activeTab === 'active' ? activeDisputes : resolvedDisputes).length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-white border border-border rounded-2xl"
            >
              <ShieldAlert className="w-16 h-16 text-ink-tertiary mx-auto mb-4" />
              <h3 className="font-body font-semibold text-xl text-ink-primary mb-2">No {activeTab} disputes</h3>
              <p className="text-ink-secondary">You're doing great! Keep up the good work.</p>
            </motion.div>
          )}
        </div>

        {/* Right Column: Info & Resources */}
        <div className="w-full lg:w-80 shrink-0 space-y-5">

          {/* Protection Policy */}
          <div className="bg-brand-900 rounded-2xl p-5 text-white shadow-sm">
            <h3 className="font-body font-semibold mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-accent-light" /> Protection policy
            </h3>
            <p className="text-sm font-body text-white/80 mb-4 leading-relaxed">
              Forte holds contract funds in escrow. If a client disputes your work, the funds remain frozen until mediation is complete.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm font-body text-white/80">
                <CheckCircle2 className="w-4 h-4 text-accent-light shrink-0 mt-0.5" />
                100% payment guarantee for tracked work
              </li>
              <li className="flex items-start gap-2 text-sm font-body text-white/80">
                <CheckCircle2 className="w-4 h-4 text-accent-light shrink-0 mt-0.5" />
                Escrow protection for fixed-price milestones
              </li>
            </ul>
          </div>

          {/* Need Help */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-body font-semibold text-ink-primary mb-4">Need help?</h3>
            <div className="space-y-2">
              <button className="w-full p-3 rounded-xl border border-border flex items-center gap-3 hover:bg-surface-soft transition-all text-left group focus:outline-none focus:ring-2 focus:ring-brand-900">
                <FileText className="w-5 h-5 text-accent DEFAULT shrink-0" />
                <div>
                  <div className="text-sm font-body font-semibold text-ink-primary group-hover:text-accent DEFAULT transition-colors">
                    Dispute guidelines
                  </div>
                  <div className="text-xs font-body text-ink-tertiary">What evidence to submit</div>
                </div>
              </button>
              <button className="w-full p-3 rounded-xl border border-border flex items-center gap-3 hover:bg-surface-soft transition-all text-left group focus:outline-none focus:ring-2 focus:ring-brand-900">
                <MessageSquare className="w-5 h-5 text-accent DEFAULT shrink-0" />
                <div>
                  <div className="text-sm font-body font-semibold text-ink-primary group-hover:text-accent DEFAULT transition-colors">
                    Contact mediation
                  </div>
                  <div className="text-xs font-body text-ink-tertiary">Average response: 24hrs</div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Tip */}
          <div className="bg-accent-light border border-accent DEFAULT rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-accent-dark shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-body font-semibold text-accent-dark mb-1">Pro tip</h4>
                <p className="text-xs font-body text-accent-dark">
                  Always keep communication within the platform and document all deliverables. This strengthens your case during disputes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
