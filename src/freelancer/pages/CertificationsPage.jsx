import { useState, useRef, useCallback, useEffect } from "react";
import { useFreelancerCertifications } from '../services/freelancerHooks';
import { extractList } from '../../common/utils/apiHelpers';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import {
  Award, BadgeCheck, Plus, X, Upload, Download, Edit2, Trash2,
  Clock, AlertCircle, CheckCircle, Eye, EyeOff, Lock, Star,
  Zap, Target, TrendingUp, Shield, ChevronDown, Calendar,
  FileText, Image, RefreshCw, ExternalLink, Tag, Check,
  AlertTriangle, Sparkles
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SKILL_CATEGORIES = [
  "Frontend Development", "Backend Development", "Cloud & DevOps", "Data Science",
  "UI/UX Design", "Mobile Development", "Cybersecurity", "Project Management",
];

const CERT_GRADIENTS = [
  "from-#2bb75c] to-[#1d8d38]",
  "from-green-500 to-teal-600",
  "from-[#2bb75c] to-pink-600",
  "from-orange-500 to-red-500",
  "from-teal-500 to-cyan-600",
  "from-yellow-500 to-orange-500",
];

const ACHIEVEMENT_BADGES = [
  {
    id: 1, name: "Top Rated", icon: Star, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30",
    description: "Maintain a 4.8+ rating", unlocked: true, progress: 100,
  },
  {
    id: 2, name: "Fast Delivery", icon: Zap, color: "text-[#2bb75c]", bg: "bg-[#2bb75c]/10 dark:bg-[#2bb75c]/30",
    description: "Deliver 95% of jobs on time", unlocked: true, progress: 100,
  },
  {
    id: 3, name: "100 Projects", icon: Target, color: "text-[#2bb75c]", bg: "bg-[#2bb75c]/10 dark:bg-[#2bb75c]/30",
    description: "Complete 100 projects", unlocked: false, progress: 67,
  },
  {
    id: 4, name: "Rising Talent", icon: TrendingUp, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30",
    description: "Earn 20 five-star reviews", unlocked: true, progress: 100,
  },
  {
    id: 5, name: "Expert Verified", icon: Shield, color: "text-teal-500", bg: "bg-teal-100 dark:bg-teal-900/30",
    description: "Get 5 certifications verified", unlocked: false, progress: 40,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return "No Expiry";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isExpiringSoon(dateStr) {
  if (!dateStr) return false;
  const days = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
  return days > 0 && days <= 30;
}

function isExpired(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

const STATUS_STYLES = {
  Verified: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Pending:  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Expired:  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

// ─── Shimmer Animation CSS ────────────────────────────────────────────────────

const shimmerStyle = {
  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
  backgroundSize: "200% 100%",
  animation: "shimmer 2s infinite",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function CertCard({ cert, onView, onEdit, onDelete, onTogglePublic }) {
  const expiring = isExpiringSoon(cert.expiryDate);
  const expired = isExpired(cert.expiryDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", damping: 20 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col"
    >
      {/* Gradient Header */}
      <div className={`bg-gradient-to-br ${cert.gradient} p-5 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-2 w-24 h-24 rounded-full bg-white/30 blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/20 blur-lg" />
        </div>
        <div className="relative flex items-start justify-between">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-1">
            {/* Verification badge */}
            <div className="relative">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30`}>
                {cert.status === "Verified" ? <BadgeCheck className="w-3.5 h-3.5" /> : cert.status === "Pending" ? <Clock className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {cert.status}
              </span>
              {cert.status === "Verified" && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={shimmerStyle}
                  animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 relative">
          <h3 className="text-white font-semibold text-sm leading-tight">{cert.name}</h3>
          <p className="text-white/80 text-xs mt-1">{cert.issuer}</p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Expiry warning */}
        {expiring && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/40 rounded-lg px-3 py-2 mb-3"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
            <span className="text-xs text-orange-700 dark:text-orange-400 font-medium">Expiring Soon — Renew</span>
          </motion.div>
        )}

        {/* Category */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium">
            <Tag className="w-3 h-3" />
            {cert.category}
          </span>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
          <div>
            <p className="text-gray-400 dark:text-gray-500 mb-0.5">Issued</p>
            <p className="text-gray-700 dark:text-gray-300 font-medium">{formatDate(cert.issueDate)}</p>
          </div>
          <div>
            <p className="text-gray-400 dark:text-gray-500 mb-0.5">Expires</p>
            <p className={`font-medium ${expired ? "text-red-600 dark:text-red-400" : expiring ? "text-orange-600 dark:text-orange-400" : "text-gray-700 dark:text-gray-300"}`}>
              {cert.expiryDate ? formatDate(cert.expiryDate) : "No Expiry"}
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4 flex-1">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Validates Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {cert.skills.map(skill => (
              <span key={skill} className="text-xs px-2 py-0.5 bg-[#2bb75c]/5 dark:bg-[#2bb75c]/20 text-[#2bb75c] dark:text-[#2bb75c] rounded-md border border-[#2bb75c]/20 dark:border-[#2bb75c]/20/40">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Public toggle */}
        <div className="flex items-center justify-between mb-3 py-2 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            {cert.publicVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {cert.publicVisible ? "Visible on profile" : "Hidden from profile"}
          </span>
          <button
            onClick={() => onTogglePublic(cert.id)}
            className={`relative w-10 h-5 rounded-full transition-colors ${cert.publicVisible ? "bg-[#2bb75c]" : "bg-gray-300 dark:bg-gray-600"}`}
          >
            <motion.div
              className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
              animate={{ left: cert.publicVisible ? "1.25rem" : "0.125rem" }}
              transition={{ type: "spring", damping: 20 }}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onView(cert)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#2bb75c] hover:bg-[#1d8d38] text-white rounded-lg text-xs font-medium transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
          <button
            onClick={() => onEdit(cert)}
            className="p-2 border border-gray-200 dark:border-gray-700 hover:bg-surface dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 hover:text-[#2bb75c]"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(cert.id)}
            className="p-2 border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-gray-500 hover:text-red-600"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function AddCertModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "", issuer: "", issueDate: "", expiryDate: "",
    noExpiry: false, category: "", file: null,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Certificate name is required";
    if (!form.issuer.trim()) e.issuer = "Issuing organization is required";
    if (!form.issueDate) e.issueDate = "Issue date is required";
    if (!form.category) e.category = "Skill category is required";
    return e;
  };

  const handleFile = (file) => {
    if (file && (file.type.startsWith("image/") || file.type === "application/pdf")) {
      setForm(f => ({ ...f, file }));
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setUploading(true);
    let prog = 0;
    const iv = setInterval(() => {
      prog += Math.random() * 25;
      if (prog >= 100) {
        prog = 100;
        clearInterval(iv);
        setTimeout(() => {
          setUploading(false);
          setSuccess(true);
          setTimeout(() => {
            onAdd({
              id: Date.now(),
              name: form.name,
              issuer: form.issuer,
              issueDate: form.issueDate,
              expiryDate: form.noExpiry ? null : form.expiryDate || null,
              category: form.category,
              status: "Pending",
              gradient: CERT_GRADIENTS[Math.floor(Math.random() * CERT_GRADIENTS.length)],
              skills: [],
              publicVisible: true,
              credentialUrl: "#",
            });
            onClose();
          }, 1200);
        }, 300);
      }
      setUploadProgress(Math.min(prog, 100));
    }, 200);
  };

  const field = (label, name, type = "text", required = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => { setForm(f => ({ ...f, [name]: e.target.value })); setErrors(x => ({ ...x, [name]: "" })); }}
        className={`w-full px-4 py-2.5 rounded-xl border ${errors[name] ? "border-red-400" : "border-gray-200 dark:border-gray-700"} bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2bb75c] text-sm transition`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl w-full max-w-lg my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Certification</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Upload and verify your credentials</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-12 px-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, delay: 0.1 }}
                className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle className="w-10 h-10 text-green-600" />
              </motion.div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Certification Added!</h4>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Your certification has been submitted for verification.</p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} className="p-6 space-y-4">
              {field("Certificate Name", "name", "text", true)}
              {field("Issuing Organization", "issuer", "text", true)}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Issue Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={form.issueDate}
                    onChange={(e) => { setForm(f => ({ ...f, issueDate: e.target.value })); setErrors(x => ({ ...x, issueDate: "" })); }}
                    className={`w-full px-3 py-2.5 rounded-xl border ${errors.issueDate ? "border-red-400" : "border-gray-200 dark:border-gray-700"} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2bb75c] text-sm`}
                  />
                  {errors.issueDate && <p className="text-red-500 text-xs mt-1">{errors.issueDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Expiry Date</label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    disabled={form.noExpiry}
                    onChange={(e) => setForm(f => ({ ...f, expiryDate: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2bb75c] text-sm disabled:opacity-50"
                  />
                  <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.noExpiry}
                      onChange={(e) => setForm(f => ({ ...f, noExpiry: e.target.checked, expiryDate: "" }))}
                      className="rounded text-[#2bb75c]"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">No expiry date</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Skill Category <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) => { setForm(f => ({ ...f, category: e.target.value })); setErrors(x => ({ ...x, category: "" })); }}
                    className={`w-full px-4 py-2.5 rounded-xl border ${errors.category ? "border-red-400" : "border-gray-200 dark:border-gray-700"} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2bb75c] appearance-none text-sm`}
                  >
                    <option value="">Select category</option>
                    {SKILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Upload Certificate <span className="text-gray-400 font-normal">(PDF or image)</span></label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    dragOver
                      ? "border-[#2bb75c]/20 bg-[#2bb75c]/5 dark:bg-[#2bb75c]/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-[#2bb75c]/20 hover:bg-surface dark:hover:bg-gray-800"
                  }`}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                  {form.file ? (
                    <div className="flex items-center justify-center gap-2">
                      {form.file.type === "application/pdf" ? (
                        <FileText className="w-8 h-8 text-red-500" />
                      ) : (
                        <Image className="w-8 h-8 text-[#2bb75c]" />
                      )}
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{form.file.name}</p>
                        <p className="text-xs text-gray-400">{(form.file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setForm(f => ({ ...f, file: null })); }}
                        className="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Drag & drop or <span className="text-[#2bb75c]">browse</span></p>
                      <p className="text-xs text-gray-400 mt-1">PDF, PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
                    <span className="text-[#2bb75c] font-medium">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-[#2bb75c] rounded-full"
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </motion.div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-800 font-medium text-sm transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2.5 bg-[#2bb75c] hover:bg-[#1d8d38] disabled:opacity-60 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Processing...</>
                  ) : (
                    <><Plus className="w-4 h-4" /> Add Certification</>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function CertPreviewModal({ cert, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">{cert.name}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Preview Area */}
        <div className={`bg-gradient-to-br ${cert.gradient} min-h-64 flex items-center justify-center p-8 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-5">
            {[...Array(6)].map((_, i) => (
              <Award key={i} className="absolute text-white" style={{ width: 80 + i * 20, height: 80 + i * 20, top: `${(i * 30) % 80}%`, left: `${(i * 40) % 90}%`, opacity: 0.3 }} />
            ))}
          </div>
          <div className="relative bg-white/15 backdrop-blur-sm border border-white/30 rounded-2xl p-8 text-center max-w-md w-full">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-white font-bold text-xl mb-2">{cert.name}</h2>
            <p className="text-white/80 text-sm mb-4">Issued by {cert.issuer}</p>
            <div className="flex justify-center gap-4 text-xs text-white/70">
              <div>
                <p className="font-medium text-white/90">Issue Date</p>
                <p>{formatDate(cert.issueDate)}</p>
              </div>
              {cert.expiryDate && (
                <div>
                  <p className="font-medium text-white/90">Valid Until</p>
                  <p>{formatDate(cert.expiryDate)}</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
              <BadgeCheck className="w-4 h-4 text-white" />
              <span className="text-white text-xs font-medium">{cert.status}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {cert.skills.slice(0, 4).map(s => (
              <span key={s} className="text-xs px-2 py-0.5 bg-[#2bb75c]/5 dark:bg-[#2bb75c]/20 text-[#2bb75c] dark:text-[#2bb75c] rounded-md">{s}</span>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2bb75c] hover:bg-[#1d8d38] text-white rounded-xl text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BadgeCard({ badge, index }) {
  const Icon = badge.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 + index * 0.06 }}
      whileHover={{ y: -2 }}
      className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 flex flex-col items-center text-center relative overflow-hidden ${!badge.unlocked ? "opacity-75" : ""}`}
    >
      {badge.unlocked && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <div className={`w-14 h-14 ${badge.bg} rounded-full flex items-center justify-center mb-3 relative`}>
        <Icon className={`w-7 h-7 ${badge.color}`} />
        {!badge.unlocked && (
          <div className="absolute inset-0 bg-gray-100/60 dark:bg-gray-800/60 rounded-full flex items-center justify-center">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
        )}
        {badge.unlocked && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + index * 0.06, type: "spring" }}
          >
            <Check className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </div>
      <p className={`text-sm font-semibold mb-1 ${badge.unlocked ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
        {badge.name}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{badge.description}</p>
      {!badge.unlocked && (
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{badge.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${badge.color.replace("text-", "bg-")}`}
              initial={{ width: 0 }}
              animate={{ width: `${badge.progress}%` }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
      {badge.unlocked && (
        <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Earned
        </span>
      )}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CertificationsPage() {
  const { data: certsData, isLoading: certsLoading, refetch } = useFreelancerCertifications();
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    const list = extractList(certsData).map((c, i) => ({
      id: c.id || c._id || i,
      name: c.name || c.title,
      issuer: c.issuer || c.issuingOrganization || '',
      issueDate: c.issueDate || c.issuedAt,
      expiryDate: c.expiryDate || c.expiresAt || null,
      category: c.category || 'General',
      status: c.status || 'Pending',
      gradient: CERT_GRADIENTS[i % CERT_GRADIENTS.length],
      skills: c.skills || [],
      publicVisible: c.publicVisible !== false,
      credentialUrl: c.credentialUrl || c.url || '#',
    }));
    setCerts(list);
  }, [certsData]);
  const [showAdd, setShowAdd] = useState(false);
  const [previewCert, setPreviewCert] = useState(null);
  const [editCert, setEditCert] = useState(null);

  const pendingCount = certs.filter(c => c.status === "Pending").length;
  const verifiedCount = certs.filter(c => c.status === "Verified").length;
  const expiringCount = certs.filter(c => isExpiringSoon(c.expiryDate)).length;

  const handleAdd = (cert) => {
    setCerts(prev => [cert, ...prev]);
  };

  const handleDelete = (id) => {
    setCerts(prev => prev.filter(c => c.id !== id));
  };

  const handleTogglePublic = (id) => {
    setCerts(prev => prev.map(c => c.id === id ? { ...c, publicVisible: !c.publicVisible } : c));
  };

  // Profile completion segments for progress bar
  const completionSegments = [
    { label: "Basic Info", pct: 30, color: "bg-[#2bb75c]" },
    { label: "Certifications", pct: 25, color: "bg-green-500" },
    { label: "Portfolio", pct: 20, color: "bg-[#2bb75c]" },
    { label: "Skills", pct: 10, color: "bg-orange-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans min-h-screen bg-surface dark:bg-gray-950">
      {/* Global shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certifications & Badges</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Showcase your verified expertise</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2bb75c] hover:bg-[#1d8d38] text-white rounded-xl font-medium text-sm transition-colors shadow-sm shadow-blue-200 dark:shadow-none"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </motion.button>
      </motion.div>

      {/* Profile Completion */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Profile Completion</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Complete your profile to attract more clients</p>
          </div>
          <span className="text-2xl font-bold text-[#2bb75c]">85%</span>
        </div>
        <div className="flex rounded-full overflow-hidden h-3 bg-gray-200 dark:bg-gray-700 gap-0.5">
          {completionSegments.map((seg, i) => (
            <motion.div
              key={seg.label}
              className={`h-full ${seg.color} first:rounded-l-full`}
              initial={{ width: 0 }}
              animate={{ width: `${seg.pct}%` }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: "easeOut" }}
              title={`${seg.label}: ${seg.pct}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {completionSegments.map(seg => (
            <div key={seg.label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${seg.color}`} />
              <span className="text-xs text-gray-500 dark:text-gray-400">{seg.label} ({seg.pct}%)</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Pending Verification Banner */}
      <AnimatePresence>
        {pendingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/40 rounded-xl p-4 mb-4"
          >
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/40 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                You have {pendingCount} certification{pendingCount > 1 ? "s" : ""} pending verification
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-0.5">
                Our team reviews submissions within 2–3 business days.
              </p>
            </div>
            <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/40 px-2.5 py-1 rounded-full">
              Under Review
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expiry Warning Banner */}
      <AnimatePresence>
        {expiringCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/40 rounded-xl p-4 mb-6"
          >
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
            <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
              {expiringCount} certification{expiringCount > 1 ? "s are" : " is"} expiring within 30 days — renew soon to keep your profile strong.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Verified", value: verifiedCount, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20", icon: BadgeCheck },
          { label: "Pending", value: pendingCount, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20", icon: Clock },
          { label: "Total", value: certs.length, color: "text-[#2bb75c]", bg: "bg-[#2bb75c]/5 dark:bg-[#2bb75c]/20", icon: Award },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-3 flex items-center gap-3"
            >
              <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-4.5 h-4.5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Certifications Grid */}
      {certs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
            <Award className="w-10 h-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No certifications yet</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Add your first certification to showcase your skills</p>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2bb75c] hover:bg-[#1d8d38] text-white rounded-xl font-medium text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Certification
          </button>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <AnimatePresence>
            {certs.map(cert => (
              <CertCard
                key={cert.id}
                cert={cert}
                onView={setPreviewCert}
                onEdit={setEditCert}
                onDelete={handleDelete}
                onTogglePublic={handleTogglePublic}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Achievement Badges Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Achievement Badges
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Earn badges by completing milestones on Forte</p>
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {ACHIEVEMENT_BADGES.filter(b => b.unlocked).length}/{ACHIEVEMENT_BADGES.length} Earned
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {ACHIEVEMENT_BADGES.map((badge, i) => <BadgeCard key={badge.id} badge={badge} index={i} />)}
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showAdd && <AddCertModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
      </AnimatePresence>
      <AnimatePresence>
        {previewCert && <CertPreviewModal cert={previewCert} onClose={() => setPreviewCert(null)} />}
      </AnimatePresence>
    </div>
  );
}

