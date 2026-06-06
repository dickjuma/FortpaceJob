// src/pages/freelancer/CertificationsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, BadgeCheck, Plus, X, Upload, Download, Edit2, Trash2,
  Clock, AlertCircle, CheckCircle, Eye, EyeOff, Lock, Star,
  Zap, Target, TrendingUp, Shield, ChevronDown, Calendar,
  FileText, Image, RefreshCw, ExternalLink, Tag, Check,
  AlertTriangle, Sparkles
} from 'lucide-react';
import { useFreelancerCertifications, useAddCertification, useDeleteCertification } from '../services/freelancerHooks';

const SKILL_CATEGORIES = [
  "Frontend Development", "Backend Development", "Cloud & DevOps", "Data Science",
  "UI/UX Design", "Mobile Development", "Cybersecurity", "Project Management",
];

const CERT_GRADIENTS = [
  "from-accent DEFAULT to-accent-dark",
  "from-info DEFAULT to-brand-700",
  "from-accent DEFAULT to-warn DEFAULT",
  "from-warn DEFAULT to-danger DEFAULT",
  "from-info DEFAULT to-accent DEFAULT",
];

const ACHIEVEMENT_BADGES = [
  {
    id: 1, name: "Top Rated", icon: Star, color: "text-warn DEFAULT", bg: "bg-warn-light",
    description: "Maintain a 4.8+ rating", unlocked: true, progress: 100,
  },
  {
    id: 2, name: "Fast Delivery", icon: Zap, color: "text-accent DEFAULT", bg: "bg-accent-light",
    description: "Deliver 95% of jobs on time", unlocked: true, progress: 100,
  },
  {
    id: 3, name: "100 Projects", icon: Target, color: "text-accent DEFAULT", bg: "bg-accent-light",
    description: "Complete 100 projects", unlocked: false, progress: 67,
  },
  {
    id: 4, name: "Rising Talent", icon: TrendingUp, color: "text-accent DEFAULT", bg: "bg-accent-light",
    description: "Earn 20 five-star reviews", unlocked: true, progress: 100,
  },
  {
    id: 5, name: "Expert Verified", icon: Shield, color: "text-info DEFAULT", bg: "bg-info-light",
    description: "Get 5 certifications verified", unlocked: false, progress: 40,
  },
];

function formatDate(dateStr) {
  if (!dateStr) return "No expiry";
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
      transition={{ duration: 0.2 }}
      className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col"
    >
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
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-body font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30`}>
              {cert.status === "Verified" ? <BadgeCheck className="w-3.5 h-3.5" /> : cert.status === "Pending" ? <Clock className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              {cert.status}
            </span>
          </div>
        </div>
        <div className="mt-4 relative">
          <h3 className="text-white font-body font-semibold text-sm leading-tight">{cert.name}</h3>
          <p className="text-white/80 text-xs mt-1 font-body">{cert.issuer}</p>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        {expiring && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 bg-warn-light border border-warn DEFAULT rounded-lg px-3 py-2 mb-3"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-warn flex-shrink-0" />
            <span className="text-xs text-warn font-body font-medium">Expiring soon — renew</span>
          </motion.div>
        )}

        <div className="mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-muted text-ink-secondary text-xs font-body">
            <Tag className="w-3 h-3" />
            {cert.category}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
          <div>
            <p className="text-ink-tertiary font-body mb-0.5">Issued</p>
            <p className="text-ink-primary font-body font-medium">{formatDate(cert.issueDate)}</p>
          </div>
          <div>
            <p className="text-ink-tertiary font-body mb-0.5">Expires</p>
            <p className={`font-body font-medium ${expired ? "text-danger" : expiring ? "text-warn" : "text-ink-primary"}`}>
              {cert.expiryDate ? formatDate(cert.expiryDate) : "No expiry"}
            </p>
          </div>
        </div>

        <div className="mb-4 flex-1">
          <p className="text-xs text-ink-tertiary font-body mb-2">Validates skills</p>
          <div className="flex flex-wrap gap-1.5">
            {cert.skills.map(skill => (
              <span key={skill} className="text-xs px-2 py-0.5 bg-accent-light text-accent-dark rounded-md border border-accent DEFAULT">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-3 py-2 border-t border-border">
          <span className="text-xs text-ink-secondary font-body flex items-center gap-1.5">
            {cert.publicVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {cert.publicVisible ? "Visible on profile" : "Hidden from profile"}
          </span>
          <button
            onClick={() => onTogglePublic(cert.id)}
            className={`relative w-10 h-5 rounded-full transition-colors ${cert.publicVisible ? "bg-accent DEFAULT" : "bg-border"}`}
          >
            <motion.div
              className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
              animate={{ left: cert.publicVisible ? "1.25rem" : "0.125rem" }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onView(cert)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-brand-900 hover:bg-brand-800 text-white rounded-lg text-xs font-body font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
          <button
            onClick={() => onEdit(cert)}
            className="p-2 border border-border hover:bg-surface-muted rounded-lg transition-colors text-ink-secondary hover:text-accent DEFAULT focus:outline-none focus:ring-2 focus:ring-brand-900"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(cert.id)}
            className="p-2 border border-border hover:bg-danger-light rounded-lg transition-colors text-ink-secondary hover:text-danger focus:outline-none focus:ring-2 focus:ring-danger"
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
  const fileRef = React.useRef();

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

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

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
          }, 500);
        }, 300);
      }
      setUploadProgress(Math.min(prog, 100));
    }, 200);
  };

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
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl border border-border shadow-xl w-full max-w-lg my-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="font-display font-semibold text-lg text-brand-900">Add certification</h3>
            <p className="text-sm text-ink-secondary font-body mt-0.5">Upload and verify your credentials</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-muted transition-colors">
            <X className="w-5 h-5 text-ink-secondary" />
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
                className="w-20 h-20 bg-accent-light rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle className="w-10 h-10 text-accent DEFAULT" />
              </motion.div>
              <h4 className="font-body font-semibold text-lg text-ink-primary">Certification added!</h4>
              <p className="text-ink-secondary mt-2 text-sm">Your certification has been submitted for verification</p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-body font-medium text-ink-primary mb-1.5">
                  Certificate name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); setErrors(x => ({ ...x, name: "" })); }}
                  className={`w-full h-10 px-3 rounded-lg border ${errors.name ? "border-danger" : "border-border"} bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent`}
                />
                {errors.name && <p className="text-danger text-xs mt-1 font-body">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-ink-primary mb-1.5">
                  Issuing organization <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={form.issuer}
                  onChange={(e) => { setForm(f => ({ ...f, issuer: e.target.value })); setErrors(x => ({ ...x, issuer: "" })); }}
                  className={`w-full h-10 px-3 rounded-lg border ${errors.issuer ? "border-danger" : "border-border"} bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent`}
                />
                {errors.issuer && <p className="text-danger text-xs mt-1 font-body">{errors.issuer}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-body font-medium text-ink-primary mb-1.5">
                    Issue date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.issueDate}
                    onChange={(e) => { setForm(f => ({ ...f, issueDate: e.target.value })); setErrors(x => ({ ...x, issueDate: "" })); }}
                    className={`w-full h-10 px-3 rounded-lg border ${errors.issueDate ? "border-danger" : "border-border"} bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent`}
                  />
                  {errors.issueDate && <p className="text-danger text-xs mt-1 font-body">{errors.issueDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-ink-primary mb-1.5">Expiry date</label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    disabled={form.noExpiry}
                    onChange={(e) => setForm(f => ({ ...f, expiryDate: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent disabled:opacity-50"
                  />
                  <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.noExpiry}
                      onChange={(e) => setForm(f => ({ ...f, noExpiry: e.target.checked, expiryDate: "" }))}
                      className="rounded text-accent DEFAULT focus:ring-accent DEFAULT"
                    />
                    <span className="text-xs text-ink-tertiary font-body">No expiry date</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-ink-primary mb-1.5">
                  Skill category <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) => { setForm(f => ({ ...f, category: e.target.value })); setErrors(x => ({ ...x, category: "" })); }}
                    className={`w-full h-10 px-3 rounded-lg border ${errors.category ? "border-danger" : "border-border"} bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent appearance-none`}
                  >
                    <option value="">Select category</option>
                    {SKILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-tertiary pointer-events-none" />
                </div>
                {errors.category && <p className="text-danger text-xs mt-1 font-body">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-ink-primary mb-1.5">
                  Upload certificate <span className="text-ink-tertiary font-normal">(PDF or image)</span>
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    dragOver
                      ? "border-accent DEFAULT bg-accent-light"
                      : "border-border hover:border-accent DEFAULT hover:bg-surface-muted"
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
                        <FileText className="w-8 h-8 text-danger" />
                      ) : (
                        <Image className="w-8 h-8 text-accent DEFAULT" />
                      )}
                      <div className="text-left">
                        <p className="text-sm font-body font-medium text-ink-primary">{form.file.name}</p>
                        <p className="text-xs text-ink-tertiary">{(form.file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setForm(f => ({ ...f, file: null })); }}
                        className="ml-2 p-1 rounded-full hover:bg-surface-muted"
                      >
                        <X className="w-4 h-4 text-ink-tertiary" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-ink-tertiary mx-auto mb-2" />
                      <p className="text-sm text-ink-secondary font-body">Drag & drop or <span className="text-accent DEFAULT">browse</span></p>
                      <p className="text-xs text-ink-tertiary mt-1 font-body">PDF, PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {uploading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-ink-secondary font-body">Uploading...</span>
                    <span className="text-accent DEFAULT font-body font-medium">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-accent DEFAULT rounded-full"
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </motion.div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-border rounded-xl text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2.5 bg-brand-900 hover:bg-brand-800 disabled:opacity-60 text-white rounded-xl font-body font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Processing...</>
                  ) : (
                    <><Plus className="w-4 h-4" /> Add certification</>
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
        className="bg-white rounded-2xl border border-border shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-display font-semibold text-brand-900">{cert.name}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-muted transition-colors">
            <X className="w-5 h-5 text-ink-secondary" />
          </button>
        </div>

        <div className={`bg-gradient-to-br ${cert.gradient} min-h-64 flex items-center justify-center p-8 relative overflow-hidden`}>
          <div className="relative bg-white/15 backdrop-blur-sm border border-white/30 rounded-2xl p-8 text-center max-w-md w-full">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-white font-display font-bold text-xl mb-2">{cert.name}</h2>
            <p className="text-white/80 text-sm mb-4 font-body">Issued by {cert.issuer}</p>
            <div className="flex justify-center gap-4 text-xs text-white/70">
              <div>
                <p className="font-medium text-white/90">Issue date</p>
                <p>{formatDate(cert.issueDate)}</p>
              </div>
              {cert.expiryDate && (
                <div>
                  <p className="font-medium text-white/90">Valid until</p>
                  <p>{formatDate(cert.expiryDate)}</p>
                </div>
              )}
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
              <BadgeCheck className="w-4 h-4 text-white" />
              <span className="text-white text-xs font-body font-medium">{cert.status}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {cert.skills.slice(0, 4).map(s => (
              <span key={s} className="text-xs px-2 py-0.5 bg-accent-light text-accent-dark rounded-md">{s}</span>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-900 hover:bg-brand-800 text-white rounded-xl text-sm font-body font-medium transition-colors">
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
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -2 }}
      className={`bg-white border border-border rounded-2xl shadow-sm p-4 flex flex-col items-center text-center relative overflow-hidden ${!badge.unlocked ? "opacity-75" : ""}`}
    >
      {badge.unlocked && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent DEFAULT to-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <div className={`w-14 h-14 ${badge.bg} rounded-full flex items-center justify-center mb-3 relative`}>
        <Icon className={`w-7 h-7 ${badge.color}`} />
        {!badge.unlocked && (
          <div className="absolute inset-0 bg-surface-muted/60 rounded-full flex items-center justify-center">
            <Lock className="w-5 h-5 text-ink-tertiary" />
          </div>
        )}
        {badge.unlocked && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-accent DEFAULT rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + index * 0.06, type: "spring" }}
          >
            <Check className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </div>
      <p className={`text-sm font-body font-semibold mb-1 ${badge.unlocked ? "text-ink-primary" : "text-ink-secondary"}`}>
        {badge.name}
      </p>
      <p className="text-xs text-ink-tertiary font-body mb-3">{badge.description}</p>
      {!badge.unlocked && (
        <div className="w-full">
          <div className="flex justify-between text-xs text-ink-tertiary mb-1">
            <span>Progress</span>
            <span>{badge.progress}%</span>
          </div>
          <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-accent DEFAULT`}
              initial={{ width: 0 }}
              animate={{ width: `${badge.progress}%` }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
            />
          </div>
        </div>
      )}
      {badge.unlocked && (
        <span className="text-xs font-body font-medium text-accent DEFAULT flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Earned
        </span>
      )}
    </motion.div>
  );
}

export default function CertificationsPage() {
  const { data: certsData = [], isLoading: isLoadingCerts } = useFreelancerCertifications();
  const addCertification = useAddCertification();
  const deleteCertification = useDeleteCertification();
  const [showAdd, setShowAdd] = useState(false);
  const [previewCert, setPreviewCert] = useState(null);
  const [editCert, setEditCert] = useState(null);
  const [visibilityOverrides, setVisibilityOverrides] = useState({});
  const [toast, setToast] = useState(null);

  const certs = Array.isArray(certsData) ? certsData : certsData?.items ?? [];

  if (isLoadingCerts) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="h-6 mb-4 rounded-full bg-surface-muted animate-pulse w-48" />
        <div className="space-y-3">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-72 rounded-3xl bg-surface-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const getVisibility = (id, defaultValue = true) => {
    if (id in visibilityOverrides) return visibilityOverrides[id];
    const cert = certs.find(c => c.id === id);
    return cert ? cert.publicVisible ?? defaultValue : defaultValue;
  };

  const pendingCount = certs.filter(c => String(c.status).toLowerCase() === "pending").length;
  const verifiedCount = certs.filter(c => String(c.status).toLowerCase() === "verified").length;
  const expiringCount = certs.filter(c => isExpiringSoon(c.expiryDate)).length;

  const handleAdd = async (cert) => {
    try {
      await addCertification.mutateAsync({
        ...cert,
        publicVisible: cert.publicVisible ?? true,
      });
      setToast({ type: 'success', message: 'Certification added successfully' });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Could not add certification' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCertification.mutateAsync(id);
      setToast({ type: 'success', message: 'Certification removed successfully' });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Unable to delete certification' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleTogglePublic = (id) => {
    setVisibilityOverrides(prev => ({ ...prev, [id]: !getVisibility(id) }));
  };

  const renderedCerts = certs.map(cert => ({
    ...cert,
    publicVisible: getVisibility(cert.id, cert.publicVisible),
  }));

  const filteredCerts = renderedCerts;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-6 right-6 z-50 rounded-2xl px-4 py-3 text-sm font-medium ${toast.type === 'error' ? 'bg-danger text-white' : 'bg-accent text-white'}`}
        >
          {toast.message}
        </motion.div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light rounded-xl">
              <Award className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-4xl text-brand-900">Certifications & badges</h1>
          </div>
          <p className="text-ink-secondary font-body mt-1 text-base">
            Showcase your verified expertise and professional credentials
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAdd(true)}
          className="px-5 py-2.5 rounded-lg font-body font-medium text-sm bg-brand-900 text-white hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-900 inline-flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add certification
        </motion.button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: "Verified", value: verifiedCount, icon: BadgeCheck, bg: "bg-accent-light", color: "text-accent DEFAULT" },
          { label: "Pending", value: pendingCount, icon: Clock, bg: "bg-warn-light", color: "text-warn DEFAULT" },
          { label: "Total", value: certs.length, icon: Award, bg: "bg-surface-muted", color: "text-ink-primary" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4"
            >
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-body font-medium text-ink-secondary">{stat.label}</p>
                <p className="font-mono font-semibold text-2xl text-ink-primary">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pending Verification Banner */}
      <AnimatePresence>
        {pendingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-3 bg-warn-light border border-warn DEFAULT rounded-xl p-4 mb-6"
          >
            <div className="w-8 h-8 bg-warn-light rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-warn" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-body font-semibold text-warn">
                You have {pendingCount} certification{pendingCount > 1 ? "s" : ""} pending verification
              </p>
              <p className="text-xs text-warn/80 font-body mt-0.5">
                Our team reviews submissions within 2–3 business days
              </p>
            </div>
            <span className="text-xs font-body font-medium text-warn bg-warn-light px-2.5 py-1 rounded-full">
              Under review
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
            className="flex items-center gap-3 bg-warn-light border border-warn DEFAULT rounded-xl p-4 mb-6"
          >
            <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0" />
            <p className="text-sm font-body font-medium text-warn">
              {expiringCount} certification{expiringCount > 1 ? "s are" : " is"} expiring within 30 days — renew soon
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Certifications Grid */}
      {certs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center bg-white border border-border rounded-2xl"
        >
          <div className="w-20 h-20 bg-surface-muted rounded-2xl flex items-center justify-center mb-4">
            <Award className="w-10 h-10 text-ink-tertiary" />
          </div>
          <h3 className="font-body font-semibold text-lg text-ink-primary mb-2">No certifications yet</h3>
          <p className="text-ink-secondary text-sm mb-6">Add your first certification to showcase your skills</p>
          <button
            onClick={() => setShowAdd(true)}
            className="px-5 py-2.5 rounded-lg font-body font-medium text-sm bg-brand-900 text-white hover:bg-brand-800 inline-flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add certification
          </button>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-semibold text-xl text-brand-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent DEFAULT" />
              Achievement badges
            </h2>
            <p className="text-sm text-ink-secondary font-body mt-0.5">Earn badges by completing milestones</p>
          </div>
          <span className="text-sm font-body font-medium text-ink-secondary">
            {ACHIEVEMENT_BADGES.filter(b => b.unlocked).length}/{ACHIEVEMENT_BADGES.length} earned
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
    </motion.div>
  );
}
