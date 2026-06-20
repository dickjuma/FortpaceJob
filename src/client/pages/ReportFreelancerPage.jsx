// ReportFreelancerPage.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { userAPI } from '../../platform/common/services/api';
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { disputeDescriptionRule } from "../../platform/common/utils/validationRules";
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

const cn = (...classes) => classes.filter(Boolean).join(' ');

const REPORT_CATEGORIES = [
  {
    id: "fraud",
    label: "Fraud",
    icon: AlertTriangle,
    color: "text-danger",
    bg: "bg-danger-light",
    border: "border-danger",
    description: "Intentional deception, false identity, or scam behavior.",
  },
  {
    id: "fake_delivery",
    label: "Fake Delivery",
    icon: Package,
    color: "text-warn",
    bg: "bg-warn-light",
    border: "border-warn",
    description: "Work submitted does not match what was agreed upon.",
  },
  {
    id: "poor_communication",
    label: "Poor Communication",
    icon: MessageSquare,
    color: "text-warn",
    bg: "bg-warn-light",
    border: "border-warn",
    description: "Unresponsive, rude, or unprofessional communication.",
  },
  {
    id: "harassment",
    label: "Harassment",
    icon: Shield,
    color: "text-accent",
    bg: "bg-accent-light",
    border: "border-accent",
    description: "Threatening, intimidating, or abusive behavior.",
  },
  {
    id: "spam",
    label: "Spam",
    icon: Mail,
    color: "text-accent",
    bg: "bg-accent-light",
    border: "border-accent",
    description: "Unsolicited messages, promotions, or irrelevant content.",
  },
  {
    id: "copyright",
    label: "Copyright Violation",
    icon: Copyright,
    color: "text-info",
    bg: "bg-info-light",
    border: "border-info",
    description: "Use of copyrighted materials without permission.",
  },
  {
    id: "missed_deadlines",
    label: "Missed Deadlines",
    icon: Clock,
    color: "text-warn",
    bg: "bg-warn-light",
    border: "border-warn",
    description: "Repeatedly failing to deliver work on agreed dates.",
  },
  {
    id: "payment_manipulation",
    label: "Payment Manipulation",
    icon: DollarSign,
    color: "text-accent",
    bg: "bg-accent-light",
    border: "border-accent",
    description: "Unauthorized charges, refund abuse, or payment fraud.",
  },
  {
    id: "offensive_behavior",
    label: "Offensive Behavior",
    icon: Flag,
    color: "text-danger",
    bg: "bg-danger-light",
    border: "border-danger",
    description: "Discriminatory, hateful, or highly inappropriate conduct.",
  },
  {
    id: "other",
    label: "Other",
    icon: HelpCircle,
    color: "text-ink-secondary",
    bg: "bg-surface-muted",
    border: "border-border",
    description: "Something not covered by the categories above.",
  },
];

const SEVERITY_OPTIONS = [
  {
    id: "low",
    label: "Low",
    description: "Minor issue, not urgent",
    color: "text-accent",
    bg: "bg-accent-light",
    border: "border-accent",
    dot: "bg-accent",
  },
  {
    id: "medium",
    label: "Medium",
    description: "Moderate impact on work",
    color: "text-warn",
    bg: "bg-warn-light",
    border: "border-warn",
    dot: "bg-warn",
  },
  {
    id: "high",
    label: "High",
    description: "Significant harm or loss",
    color: "text-warn",
    bg: "bg-warn-light",
    border: "border-warn",
    dot: "bg-warn",
  },
  {
    id: "critical",
    label: "Critical",
    description: "Immediate action required",
    color: "text-danger",
    bg: "bg-danger-light",
    border: "border-danger",
    dot: "bg-danger",
  },
];

const SAFETY_INFO = [
  {
    icon: AlertCircle,
    color: "text-danger",
    bg: "bg-danger-light",
    title: "False Reports Policy",
    text: "Submitting false or misleading reports may result in account suspension. Only report genuine violations.",
  },
  {
    icon: Lock,
    color: "text-accent",
    bg: "bg-accent-light",
    title: "Your Privacy",
    text: "Your identity will remain confidential throughout this process. The freelancer will not know who filed the report.",
  },
  {
    icon: Eye,
    color: "text-accent",
    bg: "bg-accent-light",
    title: "Review Timeline",
    text: "Our Trust & Safety team reviews all reports within 2-3 business days. Complex cases may take up to 7 days.",
  },
];

const STORAGE_KEY = "forte_report_draft";

function FileIcon({ type }) {
  if (type.startsWith("image/")) return <Image className="w-5 h-5 text-accent" />;
  if (type.startsWith("video/")) return <Film className="w-5 h-5 text-accent" />;
  if (type === "application/pdf") return <FileText className="w-5 h-5 text-danger" />;
  return <File className="w-5 h-5 text-ink-tertiary" />;
}

function StarRating({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= Math.round(value) ? "text-warn fill-warn" : "text-ink-tertiary"}`}
        />
      ))}
      <span className="ml-1 text-sm font-medium text-ink-primary">{value}</span>
    </div>
  );
}

export default function ReportFreelancerPage() {
  const { freelancerId } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!freelancerId) {
      setProfileLoading(false);
      return;
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
    return () => { cancelled = true; };
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

  useEffect(() => {
    try {
      const draft = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (draft.description) setValue("description", draft.description);
      if (draft.category) setSelectedCategory(draft.category);
      if (draft.severity) setSelectedSeverity(draft.severity);
    } catch {}
  }, [setValue]);

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

  const canSubmit = selectedCategory && selectedSeverity && descriptionValue.length >= 50 && !submitDisabled;

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

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-body min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-white border border-border rounded-2xl shadow-sm p-10 max-w-lg w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="w-20 h-20 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-accent-dark" />
          </motion.div>
          <h2 className="font-display text-2xl font-bold text-brand-900 mb-2">Report Submitted</h2>
          <p className="text-ink-secondary mb-6">Your report has been received by our Trust & Safety team.</p>
          <div className="bg-surface-soft rounded-xl p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink-tertiary">Ticket Number</span>
              <span className="font-mono font-semibold text-accent">{ticketNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-tertiary">Estimated Review</span>
              <span className="font-medium text-ink-primary">2-3 business days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-tertiary">Severity</span>
              <span className="font-medium text-ink-primary capitalize">{selectedSeverity}</span>
            </div>
          </div>
          <p className="text-xs text-ink-tertiary mb-6">You'll receive an email update when we take action. Keep this ticket number for reference.</p>
          <Link to="/client/dashboard" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white rounded-lg px-6 py-3 font-medium transition-colors">
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-body">
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1 text-sm text-ink-tertiary mb-6"
      >
        <Link to="/client/dashboard" className="hover:text-accent transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/client/contracts" className="hover:text-accent transition-colors">Contracts</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-ink-primary font-medium">Report Freelancer</span>
      </motion.nav>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-900 mb-1">Report Freelancer</h1>
        <p className="text-ink-secondary">Help us maintain a safe and trusted marketplace.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white border border-border rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-sm font-semibold text-ink-tertiary uppercase tracking-wide mb-4">Reporting About</h2>
            {profileLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
            ) : !freelancer ? (
              <p className="text-ink-secondary text-sm">Freelancer profile could not be loaded.</p>
            ) : (
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {freelancer.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-ink-primary">{freelancer.name}</h3>
                    <span className="text-sm text-ink-tertiary">{freelancer.username}</span>
                  </div>
                  <StarRating value={freelancer.rating} />
                  {freelancer.contract && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-surface-soft rounded-xl p-3">
                        <p className="text-xs text-ink-tertiary mb-0.5">Contract</p>
                        <p className="text-sm font-medium text-ink-primary truncate">{freelancer.contract.title}</p>
                      </div>
                      <div className="bg-surface-soft rounded-xl p-3">
                        <p className="text-xs text-ink-tertiary mb-0.5">Amount</p>
                        <p className="text-sm font-medium text-ink-primary">{freelancer.contract.amount}</p>
                      </div>
                      <div className="bg-surface-soft rounded-xl p-3">
                        <p className="text-xs text-ink-tertiary mb-0.5">Contract ID</p>
                        <p className="text-sm font-mono font-medium text-accent">{freelancer.contract.id}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0 text-center">
                  <div className="w-14 h-14 rounded-full bg-accent-light border-2 border-accent/20 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-accent-dark">{freelancer.trustScore}</span>
                  </div>
                  <p className="text-xs text-ink-tertiary mt-1">Trust</p>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-border rounded-2xl shadow-sm p-6"
          >
            <h2 className="font-display text-lg font-semibold text-brand-900 mb-1">Report Category</h2>
            <p className="text-sm text-ink-secondary mb-5">Select the category that best describes the issue.</p>
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
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "relative flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer",
                      isSelected ? `${cat.bg} ${cat.border}` : "border-border hover:border-accent/30 bg-white"
                    )}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? cat.bg : "bg-surface-muted"} flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${isSelected ? cat.color : "text-ink-tertiary"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${isSelected ? "text-ink-primary" : "text-ink-primary"}`}>{cat.label}</p>
                      <p className="text-xs text-ink-tertiary mt-0.5 leading-snug">{cat.description}</p>
                    </div>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0"
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white border border-border rounded-2xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-display text-lg font-semibold text-brand-900">Detailed Description</h2>
              <span className="text-xs text-ink-tertiary">Auto-saved</span>
            </div>
            <p className="text-sm text-ink-secondary mb-4">Describe the issue in detail. Include dates, context, and specific incidents.</p>
            <div className="relative">
              <textarea
                {...register("description", { ...disputeDescriptionRule, maxLength: { value: 2000, message: "Description cannot exceed 2000 characters." } })}
                rows={7}
                maxLength={2000}
                placeholder="Describe the issue in detail... (minimum 50 characters)"
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-sm text-ink-primary bg-white placeholder-ink-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-brand-900 transition-colors",
                  errors.description ? "border-danger" : "border-border"
                )}
              />
              <div className="flex items-center justify-between mt-2">
                <AnimatePresence>
                  {errors.description && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-danger flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.description.message}
                    </motion.p>
                  )}
                  {!errors.description && descriptionValue.length > 0 && descriptionValue.length < 50 && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-warn">
                      {50 - descriptionValue.length} more characters needed
                    </motion.p>
                  )}
                  {!errors.description && descriptionValue.length >= 50 && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-accent flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Looks good
                    </motion.p>
                  )}
                  {descriptionValue.length === 0 && <span />}
                </AnimatePresence>
                <span className={`text-xs ml-auto ${descriptionValue.length > 1800 ? "text-danger" : "text-ink-tertiary"}`}>
                  {descriptionValue.length} / 2000
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-border rounded-2xl shadow-sm p-6"
          >
            <h2 className="font-display text-lg font-semibold text-brand-900 mb-1">Evidence</h2>
            <p className="text-sm text-ink-secondary mb-5">Upload screenshots, PDFs, videos, or other relevant files. (Optional but recommended)</p>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
                dragging ? "border-accent bg-accent-light" : "border-border hover:border-accent/30 hover:bg-surface-soft"
              )}
            >
              <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,application/pdf" className="hidden" onChange={(e) => addFiles(e.target.files)} />
              <motion.div animate={{ scale: dragging ? 1.02 : 1 }}>
                <Upload className={`w-10 h-10 mx-auto mb-3 ${dragging ? "text-accent" : "text-ink-tertiary"}`} />
                <p className="text-sm font-medium text-ink-primary">{dragging ? "Drop files here" : "Drag & drop files, or click to browse"}</p>
                <p className="text-xs text-ink-tertiary mt-1">Images, PDFs, Videos • Max 20MB each</p>
              </motion.div>
            </div>

            <AnimatePresence>
              {uploadedFiles.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 space-y-3">
                  {uploadedFiles.map((f) => {
                    const prog = uploadProgress[f.id] || 0;
                    return (
                      <motion.div key={f.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center gap-3 bg-surface-soft rounded-xl p-3 border border-border">
                        {f.preview ? (
                          <img src={f.preview} alt={f.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-surface-muted flex items-center justify-center flex-shrink-0"><FileIcon type={f.type} /></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink-primary truncate">{f.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${prog}%` }} className="h-full bg-accent rounded-full" />
                            </div>
                            <span className="text-xs text-ink-tertiary flex-shrink-0">{prog < 100 ? `${prog}%` : formatBytes(f.size)}</span>
                          </div>
                        </div>
                        <button onClick={() => removeFile(f.id)} className="p-1.5 rounded-lg hover:bg-danger-light text-ink-tertiary hover:text-danger transition-colors flex-shrink-0">
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white border border-border rounded-2xl shadow-sm p-6"
          >
            <h2 className="font-display text-lg font-semibold text-brand-900 mb-1">Severity Level</h2>
            <p className="text-sm text-ink-secondary mb-5">How severely has this issue impacted you?</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SEVERITY_OPTIONS.map((sev, i) => {
                const isSelected = selectedSeverity === sev.id;
                return (
                  <motion.button
                    key={sev.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSeverity(sev.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer",
                      isSelected ? `${sev.bg} ${sev.border}` : "border-border hover:border-accent/30"
                    )}
                  >
                    <div className={`w-3 h-3 rounded-full ${sev.dot}`} />
                    <span className={`text-sm font-semibold ${isSelected ? sev.color : "text-ink-primary"}`}>{sev.label}</span>
                    <span className="text-xs text-ink-tertiary text-center leading-tight">{sev.description}</span>
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {SAFETY_INFO.map((info, i) => {
              const Icon = info.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }} className={`${info.bg} rounded-xl p-4 border border-border`}>
                  <Icon className={`w-5 h-5 ${info.color} mb-2`} />
                  <h4 className="text-sm font-semibold text-ink-primary mb-1">{info.title}</h4>
                  <p className="text-xs text-ink-tertiary leading-snug">{info.text}</p>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex items-center justify-between gap-4 pb-8"
          >
            <Link to="/client/contracts" className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors">Cancel</Link>
            <motion.button
              whileHover={canSubmit ? { scale: 1.02 } : {}}
              whileTap={canSubmit ? { scale: 0.98 } : {}}
              onClick={handleSubmit(onAttemptSubmit, () => onAttemptSubmit())}
              disabled={!canSubmit}
              className={cn(
                "flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm transition-all",
                canSubmit ? "bg-danger hover:bg-danger-dark text-white shadow-sm" : "bg-surface-muted text-ink-tertiary cursor-not-allowed"
              )}
            >
              {submitDisabled && cooldown > 0 ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Wait {cooldown}s</>
              ) : (
                <><AlertTriangle className="w-4 h-4" /> Submit Report</>
              )}
            </motion.button>
          </motion.div>

          {(!selectedCategory || !selectedSeverity || descriptionValue.length < 50) && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-ink-tertiary text-right -mt-6 pb-4">
              {!selectedCategory && "• Select a category  "}
              {!selectedSeverity && "• Select a severity  "}
              {descriptionValue.length < 50 && `• Description needs ${50 - descriptionValue.length} more characters`}
            </motion.p>
          )}
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-border rounded-2xl shadow-sm p-5 sticky top-6"
          >
            <h3 className="text-sm font-semibold text-ink-primary mb-4">Report Summary</h3>
            <div className="space-y-3">
              <div><p className="text-xs text-ink-tertiary mb-0.5">Reporting</p><p className="text-sm font-medium text-ink-primary">{freelancer?.name || '—'}</p></div>
              <div><p className="text-xs text-ink-tertiary mb-0.5">Category</p><p className="text-sm font-medium text-ink-primary">{selectedCategory ? REPORT_CATEGORIES.find((c) => c.id === selectedCategory)?.label : <span className="text-ink-tertiary">Not selected</span>}</p></div>
              <div><p className="text-xs text-ink-tertiary mb-0.5">Severity</p><p className="text-sm font-medium text-ink-primary capitalize">{selectedSeverity || <span className="text-ink-tertiary">Not selected</span>}</p></div>
              <div><p className="text-xs text-ink-tertiary mb-0.5">Description</p><div className="flex items-center gap-2"><div className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden"><motion.div animate={{ width: `${Math.min((descriptionValue.length / 50) * 100, 100)}%` }} className="h-full bg-accent rounded-full" /></div><span className="text-xs text-ink-tertiary">{Math.min(descriptionValue.length, 50)}/50</span></div></div>
              <div><p className="text-xs text-ink-tertiary mb-0.5">Evidence Files</p><p className="text-sm font-medium text-ink-primary">{uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""}</p></div>
            </div>
            <div className="mt-5 pt-4 border-t border-border"><div className="flex items-start gap-2 text-xs text-ink-tertiary"><Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /><span>Draft auto-saved every time you make changes.</span></div></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-warn-light rounded-2xl border border-warn/20 p-5"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-warn mb-1">Before You Submit</p>
                <ul className="text-xs text-warn space-y-1">
                  <li>• Ensure all information is accurate</li>
                  <li>• False reports violate our Terms of Service</li>
                  <li>• Include relevant evidence when possible</li>
                  <li>• Contact support if this is urgent</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

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
              className="bg-white rounded-2xl shadow-xl border border-border max-w-md w-full p-8"
            >
              <div className="w-14 h-14 rounded-full bg-danger-light flex items-center justify-center mx-auto mb-5">
                <AlertTriangle className="w-7 h-7 text-danger" />
              </div>
              <h3 className="font-display text-xl font-bold text-brand-900 text-center mb-2">Submit This Report?</h3>
              <p className="text-sm text-ink-secondary text-center mb-2">
                You are about to report <span className="font-semibold text-ink-primary">{freelancer?.name}</span> for{" "}
                <span className="font-semibold text-ink-primary">{REPORT_CATEGORIES.find((c) => c.id === selectedCategory)?.label}</span>.
              </p>
              <p className="text-xs text-ink-tertiary text-center mb-6">Our Trust & Safety team will review this within 2-3 business days. This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-3 rounded-xl border border-border text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors">Go Back</button>
                <button onClick={onConfirmSubmit} className="flex-1 px-4 py-3 rounded-xl bg-danger hover:bg-danger-dark text-white text-sm font-semibold transition-colors">Yes, Submit Report</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
