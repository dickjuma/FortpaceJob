// src/pages/freelancer/CertificationManagementPage.jsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, CheckCircle, Clock, Eye, EyeOff,
  Trash2, Shield, Search, Filter, AlertCircle, BadgeCheck, Check
} from 'lucide-react';
import { useFreelancerCertifications, useAddCertification, useDeleteCertification } from '../services/freelancerHooks';

export default function CertificationManagementPage() {
  const { data: certificationsData = [], isLoading: isLoadingCerts } = useFreelancerCertifications();
  const addCertification = useAddCertification();
  const deleteCertification = useDeleteCertification();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);
  const [visibilityOverrides, setVisibilityOverrides] = useState({});
  const fileInputRef = useRef(null);

  const certifications = Array.isArray(certificationsData)
    ? certificationsData
    : certificationsData?.items ?? [];

  if (isLoadingCerts) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="h-6 mb-4 rounded-full bg-surface-muted animate-pulse w-48" />
        <div className="space-y-3">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-24 rounded-2xl bg-surface-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const getVisibility = (id, defaultValue = true) => {
    if (id in visibilityOverrides) return visibilityOverrides[id];
    const cert = certifications.find(c => c.id === id);
    return cert ? cert.visibility ?? defaultValue : defaultValue;
  };

  const toggleVisibility = (id) => {
    setVisibilityOverrides(prev => ({ ...prev, [id]: !getVisibility(id) }));
    setShowSuccess({ message: 'Visibility updated' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCertification.mutateAsync(id);
      setShowSuccess({ message: 'Certification removed' });
      setTimeout(() => setShowSuccess(null), 3000);
    } catch (error) {
      setShowSuccess({ message: error.message || 'Failed to remove certification' });
      setTimeout(() => setShowSuccess(null), 3000);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const newCert = {
        name: file.name.replace(/\.[^/.]+$/, ""),
        issuer: 'Pending Verification',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: null,
        credentialId: `PENDING-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        status: 'pending',
        visibility: true,
        fileName: file.name,
        fileType: file.type,
      };
      await addCertification.mutateAsync(newCert);
      setShowSuccess({ message: 'Certificate uploaded successfully' });
    } catch (error) {
      setShowSuccess({ message: error.message || 'Upload failed' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setShowSuccess(null), 3000);
    }
  };

  const filteredCerts = certifications.filter(cert =>
    cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const verifiedCount = certifications.filter(c => String(c.status).toLowerCase() === 'verified').length;
  const pendingCount = certifications.filter(c => String(c.status).toLowerCase() === 'pending').length;

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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light rounded-xl">
              <BadgeCheck className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-4xl text-brand-900">Certifications</h1>
          </div>
          <p className="text-ink-secondary font-body mt-1 text-base">
            Manage your professional credentials and build trust with clients
          </p>
        </div>
        <button
          onClick={handleUploadClick}
          disabled={isUploading}
          className="px-5 py-2.5 rounded-lg font-body font-medium text-sm bg-brand-900 text-white hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 disabled:opacity-40 cursor-not-allowed inline-flex items-center gap-2 transition-all"
        >
          {isUploading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {isUploading ? 'Uploading...' : 'Upload certificate'}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Active certifications', value: certifications.length, icon: FileText, color: 'accent', bg: 'bg-accent-light' },
          { label: 'Verified credentials', value: verifiedCount, icon: Shield, color: 'accent', bg: 'bg-accent-light' },
          { label: 'Pending verification', value: pendingCount, icon: Clock, color: 'warn', bg: 'bg-warn-light' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${stat.bg} text-${stat.color} DEFAULT`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-body font-medium text-ink-secondary">{stat.label}</p>
              <p className="font-mono font-semibold text-2xl text-ink-primary">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Table Header with Filters */}
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-display font-semibold text-lg text-brand-900">Your credentials</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-tertiary" />
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 h-9 border border-border rounded-lg bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-muted">
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Certification</th>
                <th className="px-6 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Dates</th>
                <th className="px-6 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Visibility</th>
                <th className="px-6 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence>
                {filteredCerts.length > 0 ? (
                  filteredCerts.map((cert, idx) => (
                    <motion.tr
                      key={cert.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-surface-soft transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-accent-light rounded-lg shrink-0 mt-0.5">
                            <FileText className="w-4 h-4 text-accent DEFAULT" />
                          </div>
                          <div>
                            <p className="font-body font-medium text-ink-primary text-sm">{cert.name}</p>
                            <p className="text-xs font-body text-ink-secondary mt-0.5">{cert.issuer}</p>
                            <p className="text-xs font-mono text-ink-tertiary mt-1">{cert.credentialId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {cert.status === 'verified' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-body font-medium bg-accent-light text-accent-dark border border-accent DEFAULT">
                            <CheckCircle className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-body font-medium bg-warn-light text-warn border border-warn DEFAULT">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-body text-ink-secondary">
                          <span className="text-ink-tertiary">Issued:</span> {new Date(cert.issueDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs font-body text-ink-secondary mt-1">
                          <span className="text-ink-tertiary">Expires:</span> {cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : 'Never'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleVisibility(cert.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-body font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900 ${
                            getVisibility(cert.id, cert.visibility)
                              ? 'bg-surface-muted text-ink-primary hover:bg-surface-soft'
                              : 'bg-white border border-border text-ink-tertiary hover:bg-surface-muted'
                          }`}
                        >
                          {getVisibility(cert.id, cert.visibility) ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {getVisibility(cert.id, cert.visibility) ? 'Public' : 'Hidden'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(cert.id)}
                          className="p-1.5 text-ink-tertiary hover:text-danger hover:bg-danger-light rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-danger"
                          title="Delete certification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle className="w-10 h-10 text-ink-tertiary mb-3" />
                        <p className="font-body font-medium text-ink-primary">No certifications found</p>
                        <p className="text-sm text-ink-secondary mt-1">Adjust your search or upload a new certificate</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
