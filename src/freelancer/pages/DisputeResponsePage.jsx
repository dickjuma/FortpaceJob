// src/pages/freelancer/DisputeResponsePage.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  FileText,
  Image as ImageIcon,
  Bold,
  Italic,
  Quote,
  Paperclip,
  RefreshCw,
  X,
  Save,
  Send,
  Users,
  CalendarDays,
  Shield,
  ChevronDown,
  Eye,
  Check,
  AlertCircle,
} from "lucide-react";

import { useDisputeById, useDisputeEvidence, useSubmitEvidence } from "../services/freelancerHooks";

const SETTLEMENT_OPTIONS = [
  {
    id: "partial_refund",
    icon: DollarSign,
    iconBg: "bg-warn-light",
    iconColor: "text-warn",
    title: "Offer partial refund",
    description: "Refund the undelivered milestone portion to resolve the dispute",
    badge: "$900 (20%)",
    badgeColor: "bg-warn-light text-warn",
  },
  {
    id: "full_refund",
    icon: RefreshCw,
    iconBg: "bg-danger-light",
    iconColor: "text-danger",
    title: "Offer full refund",
    description: "Return the complete contract amount to close this dispute",
    badge: "$4,500",
    badgeColor: "bg-danger-light text-danger",
  },
  {
    id: "request_revision",
    icon: Clock,
    iconBg: "bg-accent-light",
    iconColor: "text-accent DEFAULT",
    title: "Request revision period",
    description: "Propose a 14-day extension to deliver the final milestone",
    badge: "14-day extension",
    badgeColor: "bg-accent-light text-accent-dark",
  },
  {
    id: "reject_dispute",
    icon: XCircle,
    iconBg: "bg-surface-muted",
    iconColor: "text-ink-secondary",
    title: "Reject dispute",
    description: "Contest the client's claim and explain your reasoning",
    badge: "Provide reason",
    badgeColor: "bg-surface-muted text-ink-secondary",
  },
];

const defaultDispute = {
  id: '',
  status: 'OPEN',
  openedDate: 'N/A',
  escalationLevel: 'Level 1',
  contract: {
    project: 'Contract details unavailable',
    budget: 0,
    clientName: 'Client',
    deliveryStatus: 'Pending',
    milestones: [],
  },
  complaint: {
    category: 'Dispute details unavailable',
    explanation: 'No dispute details available yet.',
    evidence: [],
  },
  timeline: [],
};

function EvidenceIcon({ type, size = "w-8 h-8" }) {
  if (type === "image") return <ImageIcon className={`${size} text-accent DEFAULT`} />;
  if (type === "pdf") return <FileText className={`${size} text-danger`} />;
  return <FileText className={`${size} text-ink-tertiary`} />;
}

function SuccessToast({ onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60 }}
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 bg-accent-dark text-white rounded-2xl shadow-xl px-6 py-4 max-w-md w-full mx-4"
    >
      <CheckCircle className="w-5 h-5 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-body font-semibold text-sm">Response submitted</p>
        <p className="text-xs text-accent-light">Our team will review your response within 24 hours</p>
      </div>
      <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export default function DisputeResponsePage() {
  const { id } = useParams();
  const { data: disputeData, isLoading: disputeLoading, error } = useDisputeById(id);
  const { data: evidenceData, isLoading: evidenceLoading } = useDisputeEvidence(id);
  const submitEvidence = useSubmitEvidence();

  const isLoading = disputeLoading || evidenceLoading;
  const disputeBody = disputeData || {};
  const dispute = {
    id: disputeBody.id || defaultDispute.id,
    status: disputeBody.status || defaultDispute.status,
    openedDate: disputeBody.createdAt ? new Date(disputeBody.createdAt).toLocaleDateString() : defaultDispute.openedDate,
    escalationLevel: disputeBody.escalationLevel || disputeBody.level || defaultDispute.escalationLevel,
    contract: {
      project: disputeBody.contract?.project || disputeBody.contract?.title || disputeBody.title || defaultDispute.contract.project,
      budget: disputeBody.contract?.budget || disputeBody.amount || 0,
      clientName: disputeBody.contract?.clientName || disputeBody.client?.name || defaultDispute.contract.clientName,
      deliveryStatus: disputeBody.contract?.deliveryStatus || disputeBody.contract?.status || disputeBody.status || defaultDispute.contract.deliveryStatus,
      milestones: disputeBody.contract?.milestones || defaultDispute.contract.milestones,
    },
    complaint: {
      category: disputeBody.complaint?.category || disputeBody.reason || defaultDispute.complaint.category,
      explanation: disputeBody.complaint?.explanation || disputeBody.description || defaultDispute.complaint.explanation,
      evidence: evidenceData || disputeBody.complaint?.evidence || defaultDispute.complaint.evidence,
    },
    timeline: disputeBody.timeline || defaultDispute.timeline,
  };

  const [responseText, setResponseText] = useState("");
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [previewEvidence, setPreviewEvidence] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const canSubmit = responseText.trim().length >= 100 && selectedSettlement !== null;

  const applyFormat = useCallback((type) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = responseText.slice(start, end);
    let replacement = "";
    if (type === "bold") replacement = `**${selected || "bold text"}**`;
    else if (type === "italic") replacement = `_${selected || "italic text"}_`;
    else if (type === "quote") replacement = `\n> ${selected || "quoted text"}\n`;
    const next = responseText.slice(0, start) + replacement + responseText.slice(end);
    setResponseText(next);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  }, [responseText]);

  const addAttachments = (files) => {
    const entries = Array.from(files).map((f) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    setAttachedFiles((prev) => [...prev, ...entries]);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      await submitEvidence.mutateAsync({
        disputeId: id,
        data: {
          message: responseText,
          settlement: selectedSettlement,
          attachments: attachedFiles.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
          })),
        },
      });

      setResponseText("");
      setSelectedSettlement(null);
      setAttachedFiles([]);
      setShowSuccess({ message: 'Response submitted successfully' });
    } catch (submitError) {
      setShowSuccess({ message: submitError?.message || 'Failed to submit response' });
    }
  };

  const handleSaveDraft = () => {
    setSavingDraft(true);
    setTimeout(() => setSavingDraft(false), 1500);
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-accent DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || (!disputeData && !isLoading)) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 text-center">
        <AlertCircle className="w-10 h-10 text-danger mx-auto mb-3" />
        <p className="text-ink-secondary mb-4">Dispute not found or unavailable</p>
        <Link to="/freelancer/disputes" className="text-accent DEFAULT font-body font-medium hover:text-accent-dark">
          Back to disputes
        </Link>
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
      <AnimatePresence>
        {showSuccess && <SuccessToast onClose={() => setShowSuccess(false)} />}
      </AnimatePresence>

      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1 text-sm font-body text-ink-secondary mb-6"
      >
        <Link to="/freelancer/dashboard" className="hover:text-accent DEFAULT transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/freelancer/disputes" className="hover:text-accent DEFAULT transition-colors">Disputes</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-ink-primary font-medium">{dispute.id}</span>
      </motion.nav>

      {/* Dispute Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-border rounded-2xl shadow-sm p-6 mb-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="font-display font-bold text-2xl text-brand-900">{dispute.id}</h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body font-medium bg-warn-light text-warn border border-warn DEFAULT">
                <span className="w-1.5 h-1.5 rounded-full bg-warn animate-pulse" />
                {dispute.status}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-body font-medium bg-warn-light text-warn border border-warn DEFAULT">
                <Shield className="w-3 h-3" />
                {dispute.escalationLevel}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-body text-ink-secondary">
              <CalendarDays className="w-4 h-4" />
              <span>Opened {dispute.openedDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warn" />
            <span className="text-sm text-warn font-body font-medium">Response due in 3 days</span>
          </div>
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* Contract Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white border border-border rounded-2xl shadow-sm p-6"
          >
            <h2 className="font-display font-semibold text-lg text-brand-900 mb-5">Contract overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <p className="text-xs font-body font-medium text-ink-tertiary mb-1">Project</p>
                <p className="font-body font-semibold text-ink-primary">{dispute.contract.project}</p>
              </div>
              <div>
                <p className="text-xs font-body font-medium text-ink-tertiary mb-1">Budget</p>
                <p className="font-mono font-semibold text-ink-primary">KES {dispute.contract.budget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-body font-medium text-ink-tertiary mb-1">Client</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-accent-light flex items-center justify-center text-accent-dark text-xs font-mono font-semibold">
                    {dispute.contract.clientName.charAt(0)}
                  </div>
                  <p className="font-body font-semibold text-ink-primary">{dispute.contract.clientName}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-body font-medium text-ink-tertiary mb-1">Delivery status</p>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-body font-medium bg-warn-light text-warn">
                  {dispute.contract.deliveryStatus}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-body font-medium text-ink-tertiary mb-3">Milestones</p>
              <div className="space-y-2">
                {dispute.contract.milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {m.delivered ? (
                      <CheckCircle className="w-4 h-4 text-accent DEFAULT flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-danger flex-shrink-0" />
                    )}
                    <span className={`text-sm font-body ${m.delivered ? "text-ink-secondary" : "text-danger"}`}>
                      {m.name}
                    </span>
                    {!m.delivered && (
                      <span className="text-xs bg-danger-light text-danger px-2 py-0.5 rounded-full">
                        Not delivered
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Client Complaint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-border rounded-2xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg text-brand-900">Client complaint</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-body font-medium bg-danger-light text-danger border border-danger DEFAULT">
                <AlertTriangle className="w-3 h-3" />
                {dispute.complaint.category}
              </span>
            </div>
            <div className="bg-surface-soft rounded-xl p-4 mb-5">
              <p className="text-sm font-body text-ink-primary leading-relaxed">
                {dispute.complaint.explanation}
              </p>
            </div>
            <div>
              <p className="text-xs font-body font-medium text-ink-tertiary mb-3">
                Attached evidence ({dispute.complaint.evidence.length} files)
              </p>
              <div className="space-y-2">
                {dispute.complaint.evidence.map((ev, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-3 bg-surface-soft rounded-xl p-3 cursor-pointer group"
                    onClick={() => setPreviewEvidence(ev)}
                  >
                    <EvidenceIcon type={ev.type} size="w-5 h-5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body font-medium text-ink-primary truncate">{ev.name}</p>
                      <p className="text-xs font-body text-ink-tertiary">{ev.size}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg hover:bg-surface-muted transition-colors">
                        <Eye className="w-4 h-4 text-ink-tertiary" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-surface-muted transition-colors">
                        <Download className="w-4 h-4 text-ink-tertiary" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white border border-border rounded-2xl shadow-sm p-6"
          >
            <h2 className="font-display font-semibold text-lg text-brand-900 mb-5">Contract timeline</h2>
            <div className="relative">
              {dispute.timeline.map((ev, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 border-accent DEFAULT bg-white z-10 flex-shrink-0 mt-1`} />
                    {i < dispute.timeline.length - 1 && (
                      <div className="w-0.5 flex-1 bg-border mt-1 mb-1" />
                    )}
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm font-body font-semibold text-ink-primary">{ev.event}</span>
                      <span className="text-xs font-body text-ink-tertiary">{ev.date}</span>
                    </div>
                    <p className="text-xs font-body text-ink-tertiary">{ev.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Response Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-border rounded-2xl shadow-sm p-6"
          >
            <h2 className="font-display font-semibold text-lg text-brand-900 mb-1">Your response</h2>
            <p className="text-sm font-body text-ink-secondary mb-4">
              Provide a detailed explanation of your perspective. Minimum 100 characters required.
            </p>

            {/* Formatting Toolbar */}
            <div className="flex items-center gap-1 p-2 bg-surface-soft rounded-t-xl border border-b-0 border-border">
              <button
                onClick={() => applyFormat("bold")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-body font-medium text-ink-secondary hover:bg-white hover:text-ink-primary transition-colors"
              >
                <Bold className="w-3.5 h-3.5" />
                Bold
              </button>
              <button
                onClick={() => applyFormat("italic")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-body font-medium text-ink-secondary hover:bg-white hover:text-ink-primary transition-colors"
              >
                <Italic className="w-3.5 h-3.5" />
                Italic
              </button>
              <button
                onClick={() => applyFormat("quote")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-body font-medium text-ink-secondary hover:bg-white hover:text-ink-primary transition-colors"
              >
                <Quote className="w-3.5 h-3.5" />
                Quote
              </button>
            </div>

            <textarea
              ref={textareaRef}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              rows={9}
              placeholder="Explain your side of the story. Include relevant context, what was delivered, any communication issues, and how you'd like to resolve this..."
              className="w-full rounded-b-xl border border-border px-4 py-3 text-sm font-body text-ink-primary bg-white placeholder-ink-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-brand-900 transition-colors"
            />

            <div className="flex items-center justify-between mt-2 mb-4">
              <AnimatePresence>
                {responseText.length > 0 && responseText.length < 100 && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-warn">
                    {100 - responseText.length} more characters needed
                  </motion.p>
                )}
                {responseText.length >= 100 && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-accent DEFAULT flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Response looks good
                  </motion.p>
                )}
                {responseText.length === 0 && <span />}
              </AnimatePresence>
              <span className={`text-xs ml-auto ${responseText.length > 4500 ? "text-danger" : "text-ink-tertiary"}`}>
                {responseText.length} / 5000
              </span>
            </div>

            {/* File Attachment */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => addAttachments(e.target.files)}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border text-sm font-body text-ink-secondary hover:border-accent DEFAULT hover:text-accent DEFAULT hover:bg-accent-light transition-all"
              >
                <Paperclip className="w-4 h-4" />
                Attach supporting files
              </button>
              <AnimatePresence>
                {attachedFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 space-y-2"
                  >
                    {attachedFiles.map((f) => (
                      <motion.div
                        key={f.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center gap-2 bg-surface-soft rounded-lg px-3 py-2"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-ink-tertiary" />
                        <span className="text-xs font-body text-ink-primary truncate flex-1">{f.name}</span>
                        <span className="text-xs font-mono text-ink-tertiary">{formatBytes(f.size)}</span>
                        <button
                          onClick={() => setAttachedFiles((p) => p.filter((a) => a.id !== f.id))}
                          className="p-0.5 rounded hover:bg-danger-light text-ink-tertiary hover:text-danger transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Settlement Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white border border-border rounded-2xl shadow-sm p-6"
          >
            <h2 className="font-display font-semibold text-lg text-brand-900 mb-1">Settlement proposal</h2>
            <p className="text-sm font-body text-ink-secondary mb-5">
              Choose how you'd like to resolve this dispute
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SETTLEMENT_OPTIONS.map((opt, i) => {
                const Icon = opt.icon;
                const isSelected = selectedSettlement === opt.id;
                return (
                  <motion.button
                    key={opt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedSettlement(opt.id)}
                    className={`relative flex flex-col gap-3 p-5 rounded-xl border-2 text-left cursor-pointer transition-all ${
                      isSelected
                        ? "border-accent DEFAULT bg-accent-light"
                        : "border-border hover:border-border-strong"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-10 h-10 rounded-xl ${opt.iconBg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${opt.iconColor}`} />
                      </div>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="w-5 h-5 rounded-full bg-accent DEFAULT flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div>
                      <p className={`font-body font-semibold text-sm ${isSelected ? "text-accent DEFAULT" : "text-ink-primary"}`}>
                        {opt.title}
                      </p>
                      <p className="text-xs font-body text-ink-secondary mt-1 leading-snug">{opt.description}</p>
                    </div>
                    <span className={`self-start text-xs font-body font-medium px-2.5 py-1 rounded-full ${opt.badgeColor}`}>
                      {opt.badge}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Mobile Submit */}
          <div className="lg:hidden space-y-3 pb-8">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-body font-semibold text-sm transition-all ${
                canSubmit
                  ? "bg-brand-900 text-white hover:bg-brand-800"
                  : "bg-surface-muted text-ink-tertiary cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
              Submit response
            </button>
            <button
              onClick={handleSaveDraft}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm font-body font-medium text-ink-primary hover:bg-surface-muted transition-colors"
            >
              {savingDraft ? (
                <><Check className="w-4 h-4 text-accent DEFAULT" /> Saved!</>
              ) : (
                <><Save className="w-4 h-4" /> Save draft</>
              )}
            </button>
          </div>
        </div>

        {/* Sticky Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-6 space-y-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-border rounded-2xl shadow-sm p-5"
            >
              <h3 className="font-body font-semibold text-sm text-ink-primary mb-4">Dispute summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-ink-secondary">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-body">Amount at stake</span>
                  </div>
                  <span className="text-sm font-mono font-semibold text-ink-primary">KES 4,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-ink-secondary">
                    <CalendarDays className="w-4 h-4" />
                    <span className="text-sm font-body">Days since opened</span>
                  </div>
                  <span className="text-sm font-mono font-semibold text-ink-primary">7</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-ink-secondary">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-body">Response deadline</span>
                  </div>
                  <span className="text-sm font-mono font-semibold text-danger">3 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-ink-secondary">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-body">Escalation</span>
                  </div>
                  <span className="text-sm font-mono font-semibold text-warn">Level 2</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-ink-secondary">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-body">Settlement</span>
                  </div>
                  <span className="text-sm font-body font-medium text-ink-primary">
                    {selectedSettlement
                      ? SETTLEMENT_OPTIONS.find((s) => s.id === selectedSettlement)?.title.split(" ").slice(0, 2).join(" ")
                      : <span className="text-ink-tertiary">None selected</span>}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between text-xs font-body text-ink-tertiary mb-1.5">
                  <span>Response length</span>
                  <span>{responseText.length}/100 min</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${Math.min((responseText.length / 100) * 100, 100)}%` }}
                    className={`h-full rounded-full ${responseText.length >= 100 ? "bg-accent DEFAULT" : "bg-accent-light"}`}
                  />
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-3"
            >
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-body font-semibold text-sm transition-all ${
                  canSubmit
                    ? "bg-brand-900 text-white hover:bg-brand-800"
                    : "bg-surface-muted text-ink-tertiary cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
                Submit response
              </button>

              <button
                onClick={handleSaveDraft}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm font-body font-medium text-ink-primary hover:bg-surface-muted transition-colors"
              >
                {savingDraft ? (
                  <><Check className="w-4 h-4 text-accent DEFAULT" /> Draft saved!</>
                ) : (
                  <><Save className="w-4 h-4" /> Save draft</>
                )}
              </button>

              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-body font-medium text-ink-secondary hover:text-accent DEFAULT hover:bg-accent-light transition-colors">
                <Users className="w-4 h-4" />
                Request mediation
              </button>
            </motion.div>

            {/* Validation Hint */}
            {!canSubmit && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-warn-light rounded-xl border border-warn DEFAULT p-4"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-warn flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-body font-semibold text-warn mb-1">To submit:</p>
                    <ul className="text-xs text-warn space-y-0.5">
                      {responseText.length < 100 && (
                        <li>• Write at least 100 characters</li>
                      )}
                      {!selectedSettlement && (
                        <li>• Select a settlement option</li>
                      )}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-accent-light rounded-xl border border-accent DEFAULT p-4"
            >
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-accent DEFAULT flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-body font-semibold text-accent-dark mb-1">Forte protects you</p>
                  <p className="text-xs text-accent-dark leading-snug">
                    Your response will be reviewed by our team. All evidence is considered before any decision is made.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Evidence Preview Modal */}
      <AnimatePresence>
        {previewEvidence && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setPreviewEvidence(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl border border-border max-w-lg w-full overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <EvidenceIcon type={previewEvidence.type} size="w-5 h-5" />
                  <div>
                    <p className="text-sm font-body font-semibold text-ink-primary">{previewEvidence.name}</p>
                    <p className="text-xs font-body text-ink-tertiary">{previewEvidence.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-body font-medium bg-accent-light text-accent-dark hover:bg-accent-light/80 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                  <button
                    onClick={() => setPreviewEvidence(null)}
                    className="p-1.5 rounded-lg hover:bg-surface-muted transition-colors"
                  >
                    <X className="w-4 h-4 text-ink-tertiary" />
                  </button>
                </div>
              </div>
              <div className="p-8 flex flex-col items-center justify-center min-h-60 bg-surface-soft">
                <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4">
                  <EvidenceIcon type={previewEvidence.type} size="w-10 h-10" />
                </div>
                <p className="text-sm font-body text-ink-secondary text-center">
                  Preview not available. Download to view the file.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
