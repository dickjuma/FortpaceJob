// src/pages/freelancer/DisputesPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertOctagon, CheckCircle2, Clock, UploadCloud, MessageSquare,
  Send, User, ShieldCheck, HelpCircle, FileText, ArrowRight, ShieldAlert, Sparkles, Check, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMyDisputes } from '../services/freelancerHooks';

export default function DisputesPage() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(null);

  const { data: disputes = [], isLoading } = useMyDisputes();

  const handleOpenDispute = () => {
    setShowSuccess({ message: 'Dispute ticket generated successfully' });
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const updatedCase = { ...selectedCase };
    updatedCase.chatHistory.push({
      sender: 'You',
      text: chatMessage,
      time: 'Just now'
    });

    setSelectedCase(updatedCase);
    setChatMessage('');
    setShowSuccess({ message: 'Response sent to mediator' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setEvidenceFiles([...evidenceFiles, f]);
      setShowSuccess({ message: `Evidence uploaded: ${f.name}` });
      setTimeout(() => setShowSuccess(null), 2000);
    }
  };

  const handleAcceptProposal = () => {
    setShowSuccess({ message: 'AI compromise proposal accepted' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleFreezeEscrow = () => {
    setShowSuccess({ message: 'Escrow balance frozen pending review' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-8 w-64 bg-surface-muted rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-surface-muted rounded-2xl animate-pulse"></div>)}
            </div>
            <div className="lg:col-span-2">
              <div className="h-96 bg-surface-muted rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-danger-light rounded-xl">
              <ShieldAlert className="w-6 h-6 text-danger" />
            </div>
            <h1 className="font-display font-bold text-4xl text-brand-900">Mediation & dispute hub</h1>
          </div>
          <p className="text-sm text-ink-secondary font-body mt-1">
            Resolve milestone conflicts, escalate issues, and request escrow releases
          </p>
        </div>

        <button
          onClick={handleOpenDispute}
          className="px-5 py-2.5 rounded-lg font-body font-medium text-sm bg-danger text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-danger inline-flex items-center gap-2 transition-all"
        >
          <AlertOctagon className="w-4 h-4" />
          Initiate dispute
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Side: Cases List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-display font-semibold text-sm text-brand-900 uppercase tracking-wide border-b border-border pb-3 mb-4">
              Mediation ledgers
            </h3>

            <div className="space-y-3">
              {disputes.length === 0 ? (
                <div className="text-center py-8">
                  <ShieldAlert className="w-10 h-10 text-ink-tertiary mx-auto mb-2" />
                  <p className="text-sm font-body text-ink-secondary">No active disputes</p>
                </div>
              ) : (
                disputes.map((disp, idx) => (
                  <motion.button
                    key={disp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedCase(disp)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedCase?.id === disp.id
                        ? "border-danger bg-danger-light"
                        : "border-border hover:border-border-strong hover:bg-surface-soft"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full mb-2">
                      <span className="text-xs font-body font-medium text-ink-secondary">
                        {disp.type}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-body font-medium ${
                        disp.status === 'OPEN'
                          ? 'bg-danger-light text-danger'
                          : 'bg-warn-light text-warn'
                      }`}>
                        {disp.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-body font-semibold text-sm text-ink-primary">{disp.reason}</h4>
                      <p className="text-xs font-mono text-ink-tertiary mt-1">Case #{disp.id} • {disp.date}</p>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Selected Case Details */}
        <div className="lg:col-span-2">
          {selectedCase ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-border rounded-2xl shadow-sm p-6 space-y-6"
            >
              <Link
                to={`/freelancer/disputes/${selectedCase.id}`}
                className="inline-flex items-center gap-2 text-sm font-body font-medium text-accent DEFAULT hover:text-accent-dark transition-colors"
              >
                Open full workspace <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Header stats */}
              <div className="flex flex-wrap justify-between items-start gap-4 border-b border-border pb-4">
                <div>
                  <span className="inline-flex text-xs font-body font-medium text-ink-secondary bg-surface-muted px-2 py-0.5 rounded-md">
                    Mediation tier: {selectedCase.escalationLevel}
                  </span>
                  <h3 className="font-display font-semibold text-xl text-brand-900 mt-2">{selectedCase.reason}</h3>
                  <p className="text-sm font-body text-ink-secondary">Contract: {selectedCase.contractId}</p>
                </div>
                <button
                  onClick={handleFreezeEscrow}
                  className="px-4 py-2 rounded-lg border border-danger text-danger hover:bg-danger-light font-body font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-danger"
                >
                  Freeze escrow
                </button>
              </div>

              {/* Description */}
              <div className="bg-surface-soft p-4 rounded-xl border border-border">
                <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                  Dispute statement
                </p>
                <p className="text-sm font-body text-ink-primary leading-relaxed">
                  "{selectedCase.description}"
                </p>
              </div>

              {/* AI Mediation Suggestion */}
              <div className="bg-accent-light border border-accent DEFAULT rounded-xl p-4 space-y-2">
                <h4 className="font-body font-semibold text-xs text-accent-dark flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> Mediation proposal
                </h4>
                <p className="text-xs font-body text-accent-dark leading-relaxed">
                  Based on completion metrics, standard resolution suggests releasing <strong className="font-semibold">85% milestone value</strong> to freelancer and issuing <strong className="font-semibold">15% partial refund</strong> to client.
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleAcceptProposal}
                    className="px-3 py-1 rounded-lg bg-accent DEFAULT text-white hover:bg-accent-dark text-xs font-body font-medium transition-colors"
                  >
                    Accept proposal
                  </button>
                </div>
              </div>

              {/* Evidence Upload */}
              <div className="space-y-3">
                <h4 className="font-body font-semibold text-sm text-ink-primary uppercase tracking-wide">
                  Submit evidence
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-accent DEFAULT hover:bg-accent-light cursor-pointer transition-all flex flex-col items-center justify-center min-h-[100px]">
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                    <UploadCloud className="w-6 h-6 text-accent DEFAULT mb-1.5" />
                    <span className="text-xs font-body font-medium text-ink-primary">Upload supporting files</span>
                  </label>

                  <div className="border border-border bg-surface-soft rounded-xl p-3 space-y-1.5">
                    <span className="text-xs font-body font-medium text-ink-tertiary block border-b border-border pb-1 mb-1">
                      Uploaded evidence
                    </span>
                    {evidenceFiles.length === 0 ? (
                      <span className="text-xs font-body text-ink-tertiary italic">No files uploaded yet</span>
                    ) : (
                      evidenceFiles.map((f, i) => (
                        <div key={i} className="flex justify-between text-xs font-body">
                          <span className="truncate max-w-[120px] text-ink-primary">{f.name}</span>
                          <span className="text-accent DEFAULT text-xs">Ready</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Chat Mediation Timeline */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="font-body font-semibold text-sm text-ink-primary uppercase tracking-wide flex items-center gap-1">
                  <MessageSquare className="w-4 h-4 text-accent DEFAULT" /> Mediation stream
                </h4>

                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                  {selectedCase.chatHistory.map((ch, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl max-w-[80%] text-sm font-body leading-relaxed ${
                        ch.sender === 'You'
                          ? "bg-accent-light text-accent-dark ml-auto"
                          : "bg-surface-muted text-ink-primary"
                      }`}
                    >
                      <span className="block text-xs font-body font-medium mb-1">
                        {ch.sender} • {ch.time}
                      </span>
                      {ch.text}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Send response to mediator..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-3 rounded-lg bg-brand-900 text-white hover:bg-brand-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-border rounded-2xl shadow-sm p-8 flex flex-col items-center justify-center text-center min-h-[400px]"
            >
              <ShieldAlert className="w-12 h-12 text-ink-tertiary mb-3" />
              <h4 className="font-body font-semibold text-lg text-ink-primary">Select a dispute</h4>
              <p className="text-sm text-ink-secondary mt-1 max-w-[280px]">
                Choose an active dispute from the sidebar to view details and respond
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
