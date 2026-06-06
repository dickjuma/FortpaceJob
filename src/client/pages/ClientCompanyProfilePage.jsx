// ClientCompanyProfilePage.jsx
// A self-contained, production-ready React component for the Client Company Profile page.
// Uses Tailwind CSS, framer-motion, lucide-react. No external UI libraries.
// All API calls are mocked with console logs and fallbacks.

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Link as LinkIcon,
  Users,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Star,
  Briefcase,
  UploadCloud,
  Settings,
  Eye,
  Loader2,
} from 'lucide-react';
import { profileAPI } from '../../common/services/api';

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------
const getProfileSummary = (user, profile) => {
  return {
    companyName: profile.companyName || user.displayName,
    website: profile.website,
    location: profile.location,
    bio: profile.companyDescription,
  };
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function ClientCompanyProfilePage() {
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    size: '',
    website: '',
    location: '',
    description: '',
    logo: '',
    banner: '',
  });
  const [verification, setVerification] = useState({
    businessRegistration: 'pending', // 'verified' | 'pending' | 'missing'
    taxCertificate: 'pending',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null); // { type, text }
  const [uploadingImage, setUploadingImage] = useState(null); // 'logo' | 'banner'

  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const taxInputRef = useRef(null);

  // Load profile data
  useEffect(() => {
    let active = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await profileAPI.getMyProfile();
        if (!active) return;
        const userProfile = res?.user?.profile || res?.user || {};
        const summary = getProfileSummary(res?.user || {}, userProfile);
        setFormData({
          name: summary.companyName || userProfile.companyName || '',
          industry: userProfile.industry || '',
          size: userProfile.companySize || userProfile.teamSize || '',
          website: summary.website || '',
          location: summary.location || '',
          description: summary.bio || userProfile.companyDescription || '',
          logo:
            userProfile.companyLogo ||
            userProfile.avatar ||
            'https://ui-avatars.com/api/?name=Company&background=0F172A&color=fff&size=128',
          banner:
            userProfile.coverPhoto ||
            'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&h=300&fit=crop',
        });
        // Mock verification status from API (if exists)
        setVerification({
          businessRegistration: userProfile.businessVerified ? 'verified' : 'pending',
          taxCertificate: userProfile.taxVerified ? 'verified' : 'pending',
        });
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await profileAPI.updateProfile(formData);
      setSaveMessage({ type: 'success', text: 'Profile saved successfully' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to save. Please try again.' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (type, file) => {
    setUploadingImage(type);
    try {
      const response =
        type === 'logo'
          ? await profileAPI.uploadCompanyLogo(file)
          : await profileAPI.uploadCoverPhoto(file);

      const imageUrl =
        type === 'logo'
          ? response?.user?.profile?.companyLogo || response?.user?.companyLogo || response?.url
          : response?.user?.profile?.coverPhoto || response?.user?.coverPhoto || response?.url;

      setFormData((prev) => ({ ...prev, [type]: imageUrl }));
      setSaveMessage({ type: 'success', text: `${type === 'logo' ? 'Logo' : 'Banner'} updated` });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: `Failed to upload ${type}` });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setUploadingImage(null);
    }
  };

  const handleTaxUpload = async (file) => {
    try {
      await profileAPI.uploadTaxCertificate(file);
      setVerification((prev) => ({ ...prev, taxCertificate: 'pending' }));
      setSaveMessage({ type: 'success', text: 'Tax certificate uploaded. Under review.' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Upload failed. Please try again.' });
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const onLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload('logo', file);
  };

  const onBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload('banner', file);
  };

  const onTaxChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleTaxUpload(file);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-900 animate-spin" />
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };
  const buttonTap = { scale: 0.97 };

  return (
    <div className="min-h-screen bg-surface-soft font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 lg:mb-12">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-brand-900 tracking-tight">
              Company Profile
            </h1>
            <p className="text-ink-secondary mt-1">Build a trusted brand to attract the best freelancers.</p>
          </div>

          <div className="flex bg-surface-muted p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'edit'
                  ? 'bg-white text-brand-900 shadow-sm'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
              aria-label="Edit profile mode"
            >
              <Settings size={18} /> Edit Profile
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'preview'
                  ? 'bg-white text-brand-900 shadow-sm'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
              aria-label="Public preview mode"
            >
              <Eye size={18} /> Public Preview
            </button>
          </div>
        </div>

        {/* Toast Message */}
        <AnimatePresence>
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-sm font-medium shadow-md ${
                saveMessage.type === 'success'
                  ? 'bg-accent-light text-accent-dark'
                  : 'bg-danger-light text-danger'
              }`}
            >
              {saveMessage.text}
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'edit' ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Branding Assets Card */}
            <motion.section
              variants={itemVariants}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm overflow-hidden relative"
            >
              {/* Banner */}
              <div className="absolute top-0 left-0 right-0 h-48 bg-surface-muted overflow-hidden group">
                <img
                  src={formData.banner}
                  alt="Company banner"
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                />
                <button
                  onClick={() => bannerInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white font-medium gap-2"
                  aria-label="Change cover image"
                >
                  <Camera size={20} /> Change Cover
                </button>
                <input
                  type="file"
                  ref={bannerInputRef}
                  onChange={onBannerChange}
                  accept="image/*"
                  className="hidden"
                  aria-label="Upload banner image"
                />
              </div>

              {/* Logo */}
              <div className="relative mt-28 flex items-center justify-between">
                <div className="relative group">
                  <img
                    src={formData.logo}
                    alt="Company logo"
                    className="w-28 h-28 rounded-2xl border-4 border-white shadow-sm object-cover bg-white"
                  />
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-2xl"
                    aria-label="Change logo"
                  >
                    <Camera size={24} className="text-white" />
                  </button>
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={onLogoChange}
                    accept="image/*"
                    className="hidden"
                    aria-label="Upload logo"
                  />
                </div>
                {uploadingImage && (
                  <div className="text-xs text-ink-tertiary flex items-center gap-1">
                    <Loader2 size={14} className="animate-spin" /> Uploading...
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                    placeholder="Acme Inc."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                    placeholder="Technology, Healthcare, etc."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                    Company Size
                  </label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white"
                  >
                    <option value="">Select size</option>
                    <option>1-10 employees</option>
                    <option>11-50 employees</option>
                    <option>51-200 employees</option>
                    <option>201-500 employees</option>
                    <option>500+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                    placeholder="New York, NY"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                    About Us
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent resize-none"
                    placeholder="Describe your company mission, culture, and values..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                    placeholder="https://acme.com"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-border flex justify-end">
                <motion.button
                  whileTap={buttonTap}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-900 text-white rounded-lg font-medium text-sm hover:bg-brand-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSaving && <Loader2 size={16} className="animate-spin" />}
                  {isSaving ? 'Saving...' : 'Save Profile Info'}
                </motion.button>
              </div>
            </motion.section>

            {/* Verification Center */}
            <motion.section
              variants={itemVariants}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-display font-bold text-brand-900 mb-6 flex items-center gap-2">
                <ShieldCheck size={24} className="text-accent" /> Verification Center
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Business Registration Card */}
                <div className="border border-border rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-ink-primary">Business Registration</h3>
                      {verification.businessRegistration === 'verified' ? (
                        <CheckCircle2 size={20} className="text-accent" />
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warn-light text-warn">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-tertiary mb-4">
                      {verification.businessRegistration === 'verified'
                        ? 'Verified on May 10, 2026'
                        : 'Submit your business registration document to get verified'}
                    </p>
                  </div>
                  <button className="text-sm font-medium text-ink-tertiary hover:text-ink-primary transition-colors text-left">
                    Update Document
                  </button>
                </div>

                {/* Tax Certificate Card */}
                <div className="border border-border rounded-xl p-4 flex flex-col justify-between bg-surface-soft">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-ink-primary">Tax Certificate</h3>
                      {verification.taxCertificate === 'verified' ? (
                        <CheckCircle2 size={20} className="text-accent" />
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warn-light text-warn">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-tertiary mb-4">
                      Upload your VAT/Tax certificate to get the Verified Business badge.
                    </p>
                  </div>
                  <button
                    onClick={() => taxInputRef.current?.click()}
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
                  >
                    <UploadCloud size={16} /> Upload PDF
                  </button>
                  <input
                    type="file"
                    ref={taxInputRef}
                    onChange={onTaxChange}
                    accept=".pdf"
                    className="hidden"
                    aria-label="Upload tax certificate PDF"
                  />
                </div>
              </div>
            </motion.section>
          </motion.div>
        ) : (
          /* Public Preview */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Hero Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="h-48 w-full bg-surface-muted">
                <img
                  src={formData.banner}
                  alt="Company banner"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-6 lg:px-8 pb-6 relative">
                <div className="flex flex-wrap justify-between items-end gap-4">
                  <img
                    src={formData.logo}
                    alt="Company logo"
                    className="w-28 h-28 rounded-2xl border-4 border-white shadow-sm object-cover bg-white -mt-14"
                  />
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={buttonTap}
                      className="px-5 py-2 border border-brand-900 text-brand-900 rounded-lg font-medium text-sm hover:bg-surface-soft transition-colors"
                    >
                      Follow
                    </motion.button>
                    <motion.button
                      whileTap={buttonTap}
                      className="px-5 py-2 bg-brand-900 text-white rounded-lg font-medium text-sm hover:bg-brand-800 transition-colors"
                    >
                      View Open Jobs
                    </motion.button>
                  </div>
                </div>
                <div className="mt-4">
                  <h1 className="font-display text-3xl lg:text-4xl font-bold text-brand-900 flex items-center gap-2">
                    {formData.name || 'Company Name'}
                    <CheckCircle2 size={24} className="text-accent" />
                  </h1>
                  <p className="text-lg text-ink-secondary mt-1">
                    {formData.industry || 'Industry not specified'}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-ink-tertiary mt-4">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} /> {formData.location || 'Location not specified'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={16} /> {formData.size || 'Size not specified'}
                    </span>
                    {formData.website && (
                      <a
                        href={formData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-accent hover:underline"
                      >
                        <LinkIcon size={16} /> Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  variants={itemVariants}
                  className="bg-white border border-border rounded-2xl p-6 shadow-sm"
                >
                  <h2 className="font-display text-xl font-bold text-brand-900 mb-4">About</h2>
                  <p className="text-ink-primary whitespace-pre-wrap">
                    {formData.description || 'No company description provided yet.'}
                  </p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="bg-white border border-border rounded-2xl p-6 shadow-sm"
                >
                  <h2 className="font-display text-xl font-bold text-brand-900 mb-4 flex items-center gap-2">
                    <Briefcase size={20} className="text-accent" /> Open Roles (3)
                  </h2>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="p-4 border border-border rounded-xl hover:border-accent/30 transition-colors cursor-pointer group"
                      >
                        <h3 className="font-medium text-ink-primary group-hover:text-accent transition-colors">
                          Senior React Developer
                        </h3>
                        <p className="text-sm text-ink-tertiary mt-1">Full-time contract • $50-$80/hr</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <motion.div
                  variants={itemVariants}
                  className="bg-white border border-border rounded-2xl p-6 shadow-sm"
                >
                  <h2 className="font-display text-xl font-bold text-brand-900 mb-4">Hiring Stats</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-ink-tertiary">Total Spent</span>
                        <span className="text-sm font-semibold text-ink-primary">$45k+</span>
                      </div>
                      <div className="w-full bg-surface-muted h-1.5 rounded-full overflow-hidden">
                        <div className="w-[80%] bg-accent h-full rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-ink-tertiary">Hire Rate</span>
                        <span className="text-sm font-semibold text-ink-primary">72%</span>
                      </div>
                      <div className="w-full bg-surface-muted h-1.5 rounded-full overflow-hidden">
                        <div className="w-[72%] bg-accent h-full rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={20} className="text-warn fill-warn" />
                      <span className="text-lg font-bold text-ink-primary">4.9</span>
                      <span className="text-xs font-medium text-ink-tertiary">(42 reviews)</span>
                    </div>
                    <p className="text-xs text-ink-tertiary">Highly rated by freelancers.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
