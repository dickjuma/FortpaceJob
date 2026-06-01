import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { userAPI } from '../../common/services/api';
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { disputeDescriptionRule } from "../../common/utils/validationRules";
import {
  AlertTriangle,
  Package,
  MessageSquare,
  Shield,
  Mail,
  Copyright,
  Clock,
  DollarSign,
  Flag,
  HelpCircle,
  ChevronRight,
  Star,
  CheckCircle,
  X,
  Upload,
  FileText,
  Image,
  Film,
  File,
  AlertCircle,
  Info,
  Lock,
  Eye,
  Check,
  Loader2,
} from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const REPORT_CATEGORIES = [
  {
    id: "fraud",
    label: "Fraud",
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-400",
    description: "Intentional deception, false identity, or scam behavior.",
  },
  {
    id: "fake_delivery",
    label: "Fake Delivery",
    icon: Package,
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-400",
    description: "Work submitted does not match what was agreed upon.",
  },
  {
    id: "poor_communication",
    label: "Poor Communication",
    icon: MessageSquare,
    color: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-400",
    description: "Unresponsive, rude, or unprofessional communication.",
  },
  {
    id: "harassment",
    label: "Harassment",
    icon: Shield,
    color: "text-[#14a800]",
    bg: "bg-[#14a800]/5 dark:bg-[#14a800]/20",
    border: "border-[#14a800]/50",
    description: "Threatening, intimidating, or abusive behavior.",
  },
  {
    id: "spam",
    label: "Spam",
    icon: Mail,
    color: "text-[#14a800]",
    bg: "bg-[#14a800]/5 dark:bg-[#14a800]/20",
    border: "border-[#14a800]/20",
    description: "Unsolicited messages, promotions, or irrelevant content.",
  },
  {
    id: "copyright",
    label: "Copyright Violation",
    icon: Copyright,
    color: "text-teal-500",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    border: "border-teal-400",
    description: "Use of copyrighted materials without permission.",
  },
  {
    id: "missed_deadlines",
    label: "Missed Deadlines",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-400",
    description: "Repeatedly failing to deliver work on agreed dates.",
  },
  {
    id: "payment_manipulation",
    label: "Payment Manipulation",
    icon: DollarSign,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-400",
    description: "Unauthorized charges, refund abuse, or payment fraud.",
  },
  {
    id: "offensive_behavior",
    label: "Offensive Behavior",
    icon: Flag,
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-400",
    description: "Discriminatory, hateful, or highly inappropriate conduct.",
  },
  {
    id: "other",
    label: "Other",
    icon: HelpCircle,
    color: "text-gray-500",
    bg: "bg-surface dark:bg-gray-800",
    border: "border-gray-400",
    description: "Something not covered by the categories above.",
  },
];

const SEVERITY_OPTIONS = [
  {
    id: "low",
    label: "Low",
    description: "Minor issue, not urgent",
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-400",
    dot: "bg-green-500",
  },
  {
    id: "medium",
    label: "Medium",
    description: "Moderate impact on work",
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-400",
    dot: "bg-yellow-500",
  },
  {
    id: "high",
    label: "High",
    description: "Significant harm or loss",
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-400",
    dot: "bg-orange-500",
  },
  {
    id: "critical",
    label: "Critical",
    description: "Immediate action required",
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-400",
    dot: "bg-red-500",
  },
];

const SAFETY_INFO = [
  {
    icon: AlertCircle,
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-900/20",
    title: "False Reports Policy",
    text: "Submitting false or misleading reports may result in account suspension. Only report genuine violations.",
  },
  {
    icon: Lock,
    color: "text-[#14a800]",
    bg: "bg-[#14a800]/5 dark:bg-[#14a800]/20",
    title: "Your Privacy",
    text: "Your identity will remain confidential throughout this process. The freelancer will not know who filed the report.",
  },
  {
    icon: Eye,
    color: "text-[#14a800]",
    bg: "bg-[#14a800]/5 dark:bg-[#14a800]/20",
    title: "Review Timeline",
    text: "Our Trust & Safety team reviews all reports within 2-3 business days. Complex cases may take up to 7 days.",
  },
];

const STORAGE_KEY = "forte_report_draft";

// ─── File Icon Helper ─────────────────────────────────────────────────────────
function FileIcon({ type }) {
  if (type.startsWith("image/")) return <Image className="w-5 h-5 text-[#14a800]" />;
  if (type.startsWith("video/")) return <Film className="w-5 h-5 text-[#14a800]" />;
  if (type === "application/pdf") return <FileText className="w-5 h-5 text-red-500" />;
  return <File className="w-5 h-5 text-gray-500" />;
}

// ─── Stars ────────────────────────────────────────────────────────────────────
function StarRating({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= Math.round(value) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
      <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">{value}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ReportFreelancerPage() {
  const { freelancerId } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!freelancerId) {
      setProfileLoading(false);
      return undefined;
    }
    let cancelled = false;
    userAPI
      .getProfile(freelancerId)
      .then((profile) => {
        if (cancelled) return;
        const name = profile?.displayName || profile?.name || 'Freelancer';
        setFreelancer({
          id: freelancerId,
          name,
          username: profile?.username ? `@${profile.username}` : '',
          initials: name.slice(0, 2).toUpperCase(),
          rating: Number(profile?.rating || 0),
          trustScore: profile?.trustScore || profile?.trust || 0,
          contract: profile?.activeContract || null,
        });
      })
      .catch(() => {
        if (!cancelled) setFreelancer(null);
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [freelancerId]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const fileInputRef = useRef(null);
  const cooldownRef = useRef(null);

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { description: "" },
  });

  const descriptionValue = watch("description") || "";

  // Load draft from localStorage
  useEffect(() => {
    try {
      const draft = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (draft.description) setValue("description", draft.description);
      if (draft.category) setSelectedCategory(draft.category);
      if (draft.severity) setSelectedSeverity(draft.severity);
    } catch {}
  }, [setValue]);

  // Auto-save draft
  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            description: descriptionValue,
            category: selectedCategory,
            severity: selectedSeverity,
          })
        );
      } catch {}
    }, 600);
    return () => clearTimeout(handler);
  }, [descriptionValue, selectedCategory, selectedSeverity]);

  // Cooldown ticker
  useEffect(() => {
    if (cooldown > 0) {
      cooldownRef.current = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(cooldownRef.current);
            setSubmitDisabled(false);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(cooldownRef.current);
  }, [cooldown]);

  const canSubmit =
    selectedCategory &&
    selectedSeverity &&
    descriptionValue.length >= 50 &&
    !submitDisabled;

  // ─── File Handling ──────────────────────────────────────────────────────────
  const simulateUpload = useCallback((fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
    }, 200);
  }, []);

  const addFiles = useCallback(
    (newFiles) => {
      const allowed = ["image/", "video/", "application/pdf"];
      const valid = Array.from(newFiles).filter((f) =>
        allowed.some((t) => f.type.startsWith(t) || f.type === t)
      );
      const entries = valid.map((f) => ({
        id: `${Date.now()}-${Math.random()}`,
        file: f,
        name: f.name,
        size: f.size,
        type: f.type,
        preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
      }));
      setUploadedFiles((prev) => [...prev, ...entries]);
      entries.forEach((e) => simulateUpload(e.id));
    },
    [simulateUpload]
  );

  const removeFile = (id) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
    setUploadProgress((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────
  const onAttemptSubmit = () => {
    if (!canSubmit) return;
    setShowConfirm(true);
  };

  const onConfirmSubmit = () => {
    const rnd = Math.floor(1000 + Math.random() * 9000);
    setTicketNumber(`#RPT-2024-${rnd}`);
    setShowConfirm(false);
    setSubmitted(true);
    setSubmitDisabled(true);
    setCooldown(5);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ─── Success State ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-10 max-w-lg w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Report Submitted</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your report has been received by our Trust & Safety team.
          </p>
          <div className="bg-surface dark:bg-gray-800 rounded-xl p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Ticket Number</span>
              <span className="font-mono font-semibold text-[#14a800]">{ticketNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Estimated Review</span>
              <span className="font-medium text-gray-900 dark:text-white">2-3 business days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Severity</span>
              <span className="font-medium text-gray-900 dark:text-white capitalize">{selectedSeverity}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-6">
            You'll receive an email update when we take action. Keep this ticket number for reference.
          </p>
          <Link
            to="/client/dashboard"
            className="inline-flex items-center gap-2 bg-[#14a800] hover:bg-[#118a00] text-white rounded-lg px-6 py-3 font-medium transition-colors"
          >
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      {/* ── Breadcrumb ── */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-6"
      >
        <Link to="/client/dashboard" className="hover:text-[#14a800] transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/client/contracts" className="hover:text-[#14a800] transition-colors">Contracts</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-white font-medium">Report Freelancer</span>
      </motion.nav>

      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Report Freelancer</h1>
        <p className="text-gray-500 dark:text-gray-400">Help us maintain a safe and trusted marketplace.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left Column ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* ── Freelancer Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
          >
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Reporting About
            </h2>
            {profileLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-[#14a800]" />
              </div>
            ) : !freelancer ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Freelancer profile could not be loaded.</p>
            ) : (
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#14a800] to-[#118a00] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {freelancer.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{freelancer.name}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{freelancer.username}</span>
                </div>
                <StarRating value={freelancer.rating} />
                {freelancer.contract && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-surface dark:bg-gray-800 rounded-xl p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Contract</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{freelancer.contract.title}</p>
                  </div>
                  <div className="bg-surface dark:bg-gray-800 rounded-xl p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Amount</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{freelancer.contract.amount}</p>
                  </div>
                  <div className="bg-surface dark:bg-gray-800 rounded-xl p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Contract ID</p>
                    <p className="text-sm font-mono font-medium text-[#14a800]">{freelancer.contract.id}</p>
                  </div>
                </div>
                )}
              </div>
              <div className="flex-shrink-0 text-center">
                <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/20 border-2 border-green-300 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-green-600">{freelancer.trustScore}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Trust</p>
              </div>
            </div>
            )}
          </motion.div>

          {/* ── Category Selection ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Report Category</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Select the category that best describes the issue.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REPORT_CATEGORIES.map((cat, i) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`relative flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? `${cat.bg} ${cat.border}`
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? cat.bg : "bg-gray-100 dark:bg-gray-800"} flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${isSelected ? cat.color : "text-gray-500"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                        {cat.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{cat.description}</p>
                    </div>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${cat.color.replace("text-", "bg-").replace("-500", "-500").replace("-600", "-600")}`}
                          style={{ backgroundColor: "currentColor" }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* ── Description ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Detailed Description</h2>
              <span className="text-xs text-gray-400">
                Auto-saved
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Describe the issue in detail. Include dates, context, and specific incidents.
            </p>
            <div className="relative">
              <textarea
                {...register("description", {
                  ...disputeDescriptionRule,
                  maxLength: { value: 2000, message: "Description cannot exceed 2000 characters." },
                })}
                rows={7}
                maxLength={2000}
                placeholder="Describe the issue in detail... (minimum 50 characters)"
                className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#14a800] transition-colors ${
                  errors.description ? "border-red-400" : "border-gray-200 dark:border-gray-700"
                }`}
              />
              <div className="flex items-center justify-between mt-2">
                <AnimatePresence>
                  {errors.description && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.description.message}
                    </motion.p>
                  )}
                  {!errors.description && descriptionValue.length > 0 && descriptionValue.length < 50 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-yellow-500"
                    >
                      {50 - descriptionValue.length} more characters needed
                    </motion.p>
                  )}
                  {!errors.description && descriptionValue.length >= 50 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-green-500 flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" /> Looks good
                    </motion.p>
                  )}
                  {descriptionValue.length === 0 && <span />}
                </AnimatePresence>
                <span className={`text-xs ml-auto ${descriptionValue.length > 1800 ? "text-red-500" : "text-gray-400"}`}>
                  {descriptionValue.length} / 2000
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── Evidence Upload ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Evidence</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Upload screenshots, PDFs, videos, or other relevant files. (Optional but recommended)
            </p>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragging
                  ? "border-[#14a800]/20 bg-[#14a800]/5 dark:bg-[#14a800]/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-[#14a800]/20 hover:bg-surface dark:hover:bg-gray-800"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,application/pdf"
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
              <motion.div animate={{ scale: dragging ? 1.05 : 1 }}>
                <Upload className={`w-10 h-10 mx-auto mb-3 ${dragging ? "text-[#14a800]" : "text-gray-400"}`} />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {dragging ? "Drop files here" : "Drag & drop files, or click to browse"}
                </p>
                <p className="text-xs text-gray-400 mt-1">Images, PDFs, Videos • Max 20MB each</p>
              </motion.div>
            </div>

            {/* File List */}
            <AnimatePresence>
              {uploadedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 space-y-3"
                >
                  {uploadedFiles.map((f) => {
                    const prog = uploadProgress[f.id] || 0;
                    return (
                      <motion.div
                        key={f.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center gap-3 bg-surface dark:bg-gray-800 rounded-xl p-3"
                      >
                        {f.preview ? (
                          <img src={f.preview} alt={f.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                            <FileIcon type={f.type} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{f.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${prog}%` }}
                                className="h-full bg-[#14a800] rounded-full"
                              />
                            </div>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {prog < 100 ? `${prog}%` : formatBytes(f.size)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(f.id)}
                          className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Severity ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Severity Level</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">How severely has this issue impacted you?</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SEVERITY_OPTIONS.map((sev, i) => {
                const isSelected = selectedSeverity === sev.id;
                return (
                  <motion.button
                    key={sev.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedSeverity(sev.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? `${sev.bg} ${sev.border}`
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${sev.dot}`} />
                    <span className={`text-sm font-semibold ${isSelected ? sev.color : "text-gray-700 dark:text-gray-300"}`}>
                      {sev.label}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 text-center leading-tight">
                      {sev.description}
                    </span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-4 h-4 rounded-full bg-[#14a800] flex items-center justify-center"
                      >
                        <Check className="w-2.5 h-2.5 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* ── Safety Info ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {SAFETY_INFO.map((info, i) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i }}
                  className={`${info.bg} rounded-xl p-4 border border-gray-100 dark:border-gray-800`}
                >
                  <Icon className={`w-5 h-5 ${info.color} mb-2`} />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{info.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{info.text}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* ── Submit ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex items-center justify-between gap-4 pb-8"
          >
            <Link
              to="/client/contracts"
              className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </Link>
            <motion.button
              whileHover={canSubmit ? { scale: 1.02 } : {}}
              whileTap={canSubmit ? { scale: 0.98 } : {}}
              onClick={handleSubmit(onAttemptSubmit, () => onAttemptSubmit())}
              disabled={!canSubmit}
              className={`flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm transition-all ${
                canSubmit
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-sm"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              }`}
            >
              {submitDisabled && cooldown > 0 ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Wait {cooldown}s
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  Submit Report
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Validation hint */}
          {(!selectedCategory || !selectedSeverity || descriptionValue.length < 50) && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-gray-400 text-right -mt-6 pb-4"
            >
              {!selectedCategory && "• Select a category  "}
              {!selectedSeverity && "• Select a severity  "}
              {descriptionValue.length < 50 && `• Description needs ${50 - descriptionValue.length} more characters`}
            </motion.p>
          )}
        </div>

        {/* ── Right Sidebar ── */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 sticky top-6"
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Report Summary</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Reporting</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{freelancer.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Category</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedCategory
                    ? REPORT_CATEGORIES.find((c) => c.id === selectedCategory)?.label
                    : <span className="text-gray-400">Not selected</span>}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Severity</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {selectedSeverity || <span className="text-gray-400">Not selected</span>}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Description</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${Math.min((descriptionValue.length / 50) * 100, 100)}%` }}
                      className="h-full bg-[#14a800] rounded-full"
                    />
                  </div>
                  <span className="text-xs text-gray-500">{Math.min(descriptionValue.length, 50)}/50</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Evidence Files</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""}</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>Draft auto-saved every time you make changes.</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-5"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">Before You Submit</p>
                <ul className="text-xs text-amber-600 dark:text-amber-500 space-y-1">
                  <li>• Ensure all information is accurate</li>
                  <li>• False reports violate our ToS</li>
                  <li>• Include relevant evidence when possible</li>
                  <li>• Contact support if this is urgent</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 max-w-md w-full p-8"
            >
              <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-5">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">Submit This Report?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-2">
                You are about to report <span className="font-semibold text-gray-900 dark:text-white">{freelancer.name}</span> for{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {REPORT_CATEGORIES.find((c) => c.id === selectedCategory)?.label}
                </span>.
              </p>
              <p className="text-xs text-gray-400 text-center mb-6">
                Our Trust & Safety team will review this within 2-3 business days. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-800 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={onConfirmSubmit}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
                >
                  Yes, Submit Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
