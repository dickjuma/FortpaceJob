import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, CheckCircle, Clock, Eye, EyeOff, 
  Trash2, Shield, Search, Filter, AlertCircle, BadgeCheck 
} from 'lucide-react';

import { useFreelancerCertifications, useAddCertification, useDeleteCertification } from '../services/freelancerHooks';
import { useConfirm } from '../../common/context/ConfirmContext';
import toast from 'react-hot-toast';

export default function CertificationManagementPage() {
  const { confirm } = useConfirm();
  const { data: certificationsData, isLoading } = useFreelancerCertifications();
  const addCertification = useAddCertification();
  const deleteCertification = useDeleteCertification();

  const certifications = certificationsData?.data || [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const toggleVisibility = async (id) => {
    // Visibility toggle not yet in backend, simulating it or ignoring for now.
    console.log("Toggle visibility", id);
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete certification',
      message: 'Remove this certification from your profile? This cannot be undone.',
      confirmLabel: 'Delete',
      critical: true,
    });
    if (!ok) return;
    try {
      await deleteCertification.mutateAsync(id);
      toast.success('Certification removed.');
    } catch (err) {
      toast.error(err?.message || 'Could not delete certification.');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        await addCertification.mutateAsync({
          name: file.name.replace(/\.[^/.]+$/, ""),
          issuer: 'Uploaded Document',
          issueDate: new Date().toISOString().split('T')[0],
          credentialId: 'Pending Verification'
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const filteredCerts = certifications.filter(cert => 
    cert.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans min-h-screen bg-surface dark:bg-gray-950">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BadgeCheck className="w-8 h-8 text-[#2bb75c]" />
            Certifications
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your professional credentials and verify them to build trust with clients.
          </p>
        </div>
        <button 
          onClick={handleUploadClick}
          className="flex items-center justify-center gap-2 bg-[#2bb75c] hover:bg-[#1d8d38] text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
          {isUploading ? 'Uploading...' : 'Upload Certificate'}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Active Certifications', value: certifications.length, icon: FileText, color: 'text-[#2bb75c]', bg: 'bg-[#2bb75c]/5 dark:bg-[#2bb75c]/20' },
          { label: 'Verified Credentials', value: certifications.filter(c => c.status === 'verified').length, icon: Shield, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Pending Verification', value: certifications.filter(c => c.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex items-center gap-4"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Credentials</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -tranzinc-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search certificates..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-surface dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[#2bb75c] focus:border-[#2bb75c]/20 outline-none text-gray-900 dark:text-white w-full sm:w-64 transition-all"
              />
            </div>
            <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-800 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Certification</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Visibility</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <AnimatePresence>
                {filteredCerts.length > 0 ? (
                  filteredCerts.map((cert) => (
                    <motion.tr 
                      key={cert.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="hover:bg-surface/50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-[#2bb75c]/5 dark:bg-[#2bb75c]/20 text-[#2bb75c] rounded-lg shrink-0 mt-0.5">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{cert.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{cert.issuer}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono">{cert.credentialId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {cert.status === 'verified' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800/30">
                            <CheckCircle className="w-3.5 h-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30">
                            <Clock className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-900 dark:text-gray-300">
                          <span className="text-gray-500 dark:text-gray-500">Issued:</span> {new Date(cert.issueDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-900 dark:text-gray-300 mt-1">
                          <span className="text-gray-500 dark:text-gray-500">Expires:</span> {cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <button 
                          onClick={() => toggleVisibility(cert.id)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            cert.visibility 
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700' 
                              : 'bg-surface text-gray-400 hover:bg-gray-100 dark:bg-gray-800/50 dark:text-gray-500 dark:hover:bg-gray-800'
                          }`}
                        >
                          {cert.visibility ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          {cert.visibility ? 'Public' : 'Hidden'}
                        </button>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => handleDelete(cert.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete Certificate"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <AlertCircle className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="text-base font-medium">No certifications found</p>
                        <p className="text-sm mt-1">Try adjusting your search or upload a new certificate.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

