import { useState, useRef, useEffect, useCallback } from "react";
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
  Loader2,
} from "lucide-react";

import { useDisputeById, useSubmitEvidence } from "../services/freelancerHooks";

function mapDisputeFromApi(raw) {
  const d = raw?.dispute || raw?.data || raw;
  if (!d || typeof d !== "object") return null;
  const contract = d.contract || {};
  return {
    id: d.id ? `#DSP-${d.id}` : "—",
    status: d.status || "OPEN",
    openedDate: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "—",
    escalationLevel: d.escalationLevel || d.level || "—",
    contract: {
      project: contract.title || contract.projectName || d.projectTitle || "Contract",
      budget: contract.amount ?? d.amount ?? d.resolutionAmount ?? 0,
      clientName: contract.client?.name || d.clientName || "Client",
      deliveryStatus: contract.status || d.deliveryStatus || "—",
      milestones: contract.milestones || [],
    },
    complaint: {
      category: d.reason || d.category || "Dispute",
      explanation: d.description || d.details || "",
      evidence: (d.evidence || d.attachments || []).map((f) => ({
        name: f.name || f.filename || "file",
        type: f.type || "file",
        size: f.size || "",
      })),
    },
    timeline: (d.timeline || d.events || []).map((ev) => ({
      date: ev.date || (ev.createdAt ? new Date(ev.createdAt).toLocaleDateString() : ""),
      event: ev.event || ev.type || "Update",
      description: ev.description || ev.message || "",
      color: "bg-[#2bb75c]",
      dot: "border-[#2bb75c]/20",
    })),
  };
}

const SETTLEMENT_OPTIONS = [
  {
    id: "partial_refund",
    icon: DollarSign,
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    iconColor: "text-yellow-600",
    title: "Offer Partial Refund",
    description: "Refund the undelivered milestone portion to resolve the dispute.",
    badge: "$900 (20%)",
    badgeColor: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  },
  {
    id: "full_refund",
    icon: RefreshCw,
    iconBg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600",
    title: "Offer Full Refund",
    description: "Return the complete contract amount to close this dispute.",
    badge: "$4,500",
    badgeColor: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  },
  {
    id: "request_revision",
    icon: Clock,
    iconBg: "bg-[#2bb75c]/10 dark:bg-[#2bb75c]/30",
    iconColor: "text-[#2bb75c]",
    title: "Request Revision Period",
    description: "Propose a 14-day extension to deliver the final milestone.",
    badge: "14-day extension",
    badgeColor: "bg-[#2bb75c]/10 dark:bg-[#2bb75c]/30 text-[#2bb75c] dark:text-[#2bb75c]",
  },
  {
    id: "reject_dispute",
    icon: XCircle,
    iconBg: "bg-gray-100 dark:bg-gray-800",
    iconColor: "text-gray-600",
    title: "Reject Dispute",
    description: "Contest the client's claim and explain your reasoning.",
    badge: "Provide reason",
    badgeColor: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  },
];

// ─── Evidence File Icon ───────────────────────────────────────────────────────
function EvidenceIcon({ type, size = "w-8 h-8" }) {
  if (type === "image") return <ImageIcon className={`${size} text-[#2bb75c]`} />;
  if (type === "pdf") return <FileText className={`${size} text-red-500`} />;
  return <FileText className={`${size} text-gray-500`} />;
}

// ─── Toast Banner ─────────────────────────────────────────────────────────────
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
      className="fixed top-6 left-1/2 -tranzinc-x-1/2 z-50 flex items-center gap-3 bg-green-600 text-white rounded-2xl shadow-2xl px-6 py-4 max-w-md w-full mx-4"
    >
      <CheckCircle className="w-5 h-5 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-semibold text-sm">Response Submitted</p>
        <p className="text-xs text-green-100">Our team will review your response within 24 hours.</p>
      </div>
      <button onClick={onClose} className="p-1 rounded-lg hover:bg-green-700 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DisputeResponsePage() {
  const { id } = useParams();
  const { data, isLoading, error } = useDisputeById(id);
  const submitEvidence = useSubmitEvidence();
  const dispute = mapDisputeFromApi(data);

  const [responseText, setResponseText] = useState("");
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [previewEvidence, setPreviewEvidence] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const canSubmit = responseText.trim().length >= 100 && selectedSettlement !== null;

  // ─── Formatting Toolbar ────────────────────────────────────────────────────
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

  // ─── File Attachment ───────────────────────────────────────────────────────
  const addAttachments = (files) => {
    const entries = Array.from(files).map((f) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    setAttachedFiles((prev) => [...prev, ...entries]);
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      await submitEvidence.mutateAsync({
        disputeId: id,
        data: {
          type: "freelancer_response",
          content: responseText,
          description: selectedSettlement
        }
      });
      setShowSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  // ─── Save Draft ────────────────────────────────────────────────────────────
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
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#2bb75c]" />
      </div>
    );
  }

  if (error || !dispute) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <p className="text-zinc-600 mb-4">Dispute not found or unavailable.</p>
        <Link to="/freelancer/disputes" className="text-[#2bb75c] font-bold">
          Back to disputes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">

      {/* ── Toast ── */}
      <AnimatePresence>
        {showSuccess && <SuccessToast onClose={() => setShowSuccess(false)} />}
      </AnimatePresence>

      {/* ── Breadcrumb ── */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-6"
      >
        <Link to="/freelancer/dashboard" className="hover:text-[#2bb75c] transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/freelancer/disputes" className="hover:text-[#2bb75c] transition-colors">Disputes</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-white font-medium">{dispute.id}</span>
      </motion.nav>

      {/* ── Dispute Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{dispute.id}</h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                {dispute.status}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                <Shield className="w-3 h-3" />
                {dispute.escalationLevel}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <CalendarDays className="w-4 h-4" />
              <span>Opened {dispute.openedDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">Response due in 3 days</span>
          </div>
        </div>
      </motion.div>

      {/* ── Two Column Layout ── */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0 space-y-8">

          {/* ── Contract Info ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Contract Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Project</p>
                <p className="font-semibold text-gray-900 dark:text-white">{dispute.contract.project}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Budget</p>
                <p className="font-semibold text-gray-900 dark:text-white">${dispute.contract.budget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Client</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-[#1d8d38] flex items-center justify-center text-white text-xs font-bold">
                    SM
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">{dispute.contract.clientName}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Delivery Status</p>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                  {dispute.contract.deliveryStatus}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Milestones</p>
              <div className="space-y-2">
                {dispute.contract.milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {m.delivered ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${m.delivered ? "text-gray-700 dark:text-gray-300" : "text-red-500 dark:text-red-400"}`}>
                      {m.name}
                    </span>
                    {!m.delivered && (
                      <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                        Not delivered
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Client Complaint ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Client Complaint</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                <AlertTriangle className="w-3 h-3" />
                {dispute.complaint.category}
              </span>
            </div>
            <div className="bg-surface dark:bg-gray-800 rounded-xl p-4 mb-5">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {dispute.complaint.explanation}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Attached Evidence ({dispute.complaint.evidence.length} files)</p>
              <div className="space-y-2">
                {dispute.complaint.evidence.map((ev, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-3 bg-surface dark:bg-gray-800 rounded-xl p-3 cursor-pointer group"
                    onClick={() => setPreviewEvidence(ev)}
                  >
                    <EvidenceIcon type={ev.type} size="w-6 h-6" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{ev.name}</p>
                      <p className="text-xs text-gray-500">{ev.size}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); setPreviewEvidence(ev); }}
                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Timeline ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Contract Timeline</h2>
            <div className="relative">
              {dispute.timeline.map((ev, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full border-2 ${ev.dot} bg-white dark:bg-gray-900 z-10 flex-shrink-0 mt-0.5`} />
                    {i < dispute.timeline.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-1 mb-1" />
                    )}
                  </div>
                  <div className={`pb-${i < dispute.timeline.length - 1 ? "6" : "0"}`} style={{ paddingBottom: i < dispute.timeline.length - 1 ? "1.5rem" : 0 }}>
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{ev.event}</span>
                      <span className="text-xs text-gray-400">{ev.date}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{ev.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Response Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Your Response</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Provide a detailed explanation of your perspective. Minimum 100 characters required.
            </p>

            {/* Formatting Toolbar */}
            <div className="flex items-center gap-1 p-2 bg-surface dark:bg-gray-800 rounded-t-xl border border-b-0 border-gray-200 dark:border-gray-700">
              <button
                onClick={() => applyFormat("bold")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
                Bold
              </button>
              <button
                onClick={() => applyFormat("italic")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
                Italic
              </button>
              <button
                onClick={() => applyFormat("quote")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Quote"
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
              className="w-full rounded-b-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#2bb75c] transition-colors font-mono"
            />

            <div className="flex items-center justify-between mt-2 mb-4">
              <AnimatePresence>
                {responseText.length > 0 && responseText.length < 100 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-yellow-500"
                  >
                    {100 - responseText.length} more characters needed
                  </motion.p>
                )}
                {responseText.length >= 100 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-green-500 flex items-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3" /> Response looks good
                  </motion.p>
                )}
                {responseText.length === 0 && <span />}
              </AnimatePresence>
              <span className={`text-xs ml-auto ${responseText.length > 4500 ? "text-red-500" : "text-gray-400"}`}>
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 hover:border-[#2bb75c]/20 hover:text-[#2bb75c] hover:bg-[#2bb75c]/5 dark:hover:bg-[#2bb75c]/10 transition-all"
              >
                <Paperclip className="w-4 h-4" />
                Attach Supporting Files
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
                        className="flex items-center gap-2 bg-surface dark:bg-gray-800 rounded-lg px-3 py-2"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-700 dark:text-gray-300 truncate flex-1">{f.name}</span>
                        <span className="text-xs text-gray-400">{formatBytes(f.size)}</span>
                        <button
                          onClick={() => setAttachedFiles((p) => p.filter((a) => a.id !== f.id))}
                          className="p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
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

          {/* ── Settlement Options ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Settlement Proposal</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Choose how you'd like to resolve this dispute.
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
                    transition={{ delay: 0.06 * i }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSettlement(opt.id)}
                    className={`relative flex flex-col gap-3 p-5 rounded-xl border-2 text-left cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#2bb75c]/20 bg-[#2bb75c]/5 dark:bg-[#2bb75c]/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
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
                            className="w-5 h-5 rounded-full bg-[#2bb75c] flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${isSelected ? "text-[#2bb75c] dark:text-[#2bb75c]" : "text-gray-900 dark:text-white"}`}>
                        {opt.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-snug">{opt.description}</p>
                    </div>
                    <span className={`self-start text-xs font-medium px-2.5 py-1 rounded-full ${opt.badgeColor}`}>
                      {opt.badge}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* ── Mobile Submit (visible on mobile only) ── */}
          <div className="lg:hidden space-y-3 pb-8">
            <motion.button
              whileHover={canSubmit ? { scale: 1.01 } : {}}
              whileTap={canSubmit ? { scale: 0.99 } : {}}
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                canSubmit
                  ? "bg-[#2bb75c] hover:bg-[#1d8d38] text-white shadow-sm"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
              Submit Response
            </motion.button>
            <button
              onClick={handleSaveDraft}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-800 transition-colors"
            >
              {savingDraft ? (
                <><Check className="w-4 h-4 text-green-500" /> Saved!</>
              ) : (
                <><Save className="w-4 h-4" /> Save Draft</>
              )}
            </button>
          </div>
        </div>

        {/* ── Sticky Sidebar ── */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-6 space-y-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5"
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Dispute Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Amount at Stake</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">$4,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <CalendarDays className="w-4 h-4" />
                    <span className="text-sm">Days Since Opened</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">7</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Response Deadline</span>
                  </div>
                  <span className="text-sm font-bold text-red-600">3 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Escalation</span>
                  </div>
                  <span className="text-sm font-bold text-orange-600">Level 2</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Settlement</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedSettlement
                      ? SETTLEMENT_OPTIONS.find((s) => s.id === selectedSettlement)?.title.split(" ").slice(0, 2).join(" ")
                      : <span className="text-gray-400">None</span>}
                  </span>
                </div>
              </div>

              {/* Response Progress */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Response length</span>
                  <span>{responseText.length}/100 min</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${Math.min((responseText.length / 100) * 100, 100)}%` }}
                    className={`h-full rounded-full ${responseText.length >= 100 ? "bg-green-500" : "bg-[#2bb75c]"}`}
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
              <motion.button
                whileHover={canSubmit ? { scale: 1.02 } : {}}
                whileTap={canSubmit ? { scale: 0.98 } : {}}
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  canSubmit
                    ? "bg-[#2bb75c] hover:bg-[#1d8d38] text-white shadow-sm"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
                Submit Response
              </motion.button>

              <button
                onClick={handleSaveDraft}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-800 transition-colors"
              >
                {savingDraft ? (
                  <><Check className="w-4 h-4 text-green-500" /> Draft Saved!</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Draft</>
                )}
              </button>

              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#2bb75c] dark:hover:text-[#2bb75c] hover:bg-[#2bb75c]/5 dark:hover:bg-[#2bb75c]/10 transition-colors">
                <Users className="w-4 h-4" />
                Request Mediation
              </button>
            </motion.div>

            {/* Validation Hint */}
            {!canSubmit && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-4"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">To submit:</p>
                    <ul className="text-xs text-amber-600 dark:text-amber-500 space-y-0.5">
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
              className="bg-[#2bb75c]/5 dark:bg-[#2bb75c]/20 rounded-xl border border-[#2bb75c]/20 dark:border-[#2bb75c]/20 p-4"
            >
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#2bb75c] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[#2bb75c] dark:text-[#2bb75c] mb-1">Forte Protects You</p>
                  <p className="text-xs text-[#2bb75c] dark:text-[#2bb75c] leading-snug">
                    Your response will be reviewed by our team. All evidence is considered before any decision is made.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Evidence Preview Modal ── */}
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
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 max-w-lg w-full overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <EvidenceIcon type={previewEvidence.type} size="w-5 h-5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{previewEvidence.name}</p>
                    <p className="text-xs text-gray-500">{previewEvidence.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#2bb75c]/5 dark:bg-[#2bb75c]/20 text-[#2bb75c] hover:bg-[#2bb75c]/10 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                  <button
                    onClick={() => setPreviewEvidence(null)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-8 flex flex-col items-center justify-center min-h-60 bg-surface dark:bg-gray-800">
                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center mb-4">
                  <EvidenceIcon type={previewEvidence.type} size="w-10 h-10" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {previewEvidence.type === "image"
                    ? "Image preview not available in this environment."
                    : "Document preview not available in this environment."}
                </p>
                <p className="text-xs text-gray-400 mt-1 text-center">Download the file to view its contents.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

