// ClientCompanyProfilePage.jsx
// A self-contained, production-ready React component for the Client Company Profile page.
// Uses Tailwind CSS, framer-motion, lucide-react. No external UI libraries.
// All API calls are mocked with console logs and fallbacks.

import React, { useEffect, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { profileAPI } from "../../platform/common/services/api";

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------
const getProfileSummary = (user, profile) => {
  return {
    companyName: profile.companyName || user.displayName || user.name || '',
    website: profile.website || '',
    hqLocation: profile.hqLocation || '',
    companyDescription: profile.companyDescription || '',
    linkedin: profile.linkedin || '',
    twitter: profile.twitter || '',
    github: profile.github || '',
  };
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function ClientCompanyProfilePage() {
  const [activeTab, setActiveTab] = useState("edit"); // 'edit' | 'preview'
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    hqLocation: '',
    companyDescription: '',
    avatar: '',
    coverPhoto: '',
    linkedin: '',
    twitter: '',
    github: '',
    hiringType: '',
    budget: '',
    timezone: '',
    preferredWorkingHours: '',
  });
  const [verification, setVerification] = useState({
    businessRegistration: "pending", // 'verified' | 'pending' | 'missing'
    taxCertificate: "pending",
  });
  const queryClient = useQueryClient();
  
  const [saveMessage, setSaveMessage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(null); // 'logo' | 'banner'

  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const taxInputRef = useRef(null);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["client", "companyProfile"],
    queryFn: async () => {
      const res = await profileAPI.getMyProfile();
      // For client profiles, the backend returns a merged flat object.
      const userProfile = res || {};
      const summary = getProfileSummary(res || {}, userProfile);
      return { userProfile, summary };
    },
  });

  useEffect(() => {
    if (profileData) {
      const { userProfile, summary } = profileData;
      setFormData({
        companyName: summary.companyName || userProfile.companyName || '',
        industry: userProfile.industry || '',
        companySize: userProfile.companySize || userProfile.teamSize || '',
        website: summary.website || '',
        hqLocation: summary.hqLocation || userProfile.hqLocation || '',
        companyDescription: summary.companyDescription || userProfile.companyDescription || '',
        avatar: userProfile.avatar || userProfile.companyLogo || 'https://ui-avatars.com/api/?name=Company&background=0F172A&color=fff&size=128',
        coverPhoto: userProfile.coverPhoto || 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&h=300&fit=crop',
        linkedin: summary.linkedin || userProfile.linkedin || '',
        twitter: summary.twitter || userProfile.twitter || '',
        github: summary.github || userProfile.github || '',
        hiringType: userProfile.hiringType || '',
        budget: userProfile.budget || '',
        timezone: userProfile.timezone || '',
        preferredWorkingHours: userProfile.preferredWorkingHours || '',
      });
      setVerification({
        businessRegistration: userProfile.businessVerified
          ? "verified"
          : "pending",
        taxCertificate: userProfile.taxVerified ? "verified" : "pending",
      });
    }
  }, [profileData]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => profileAPI.updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client", "companyProfile"] });
      setSaveMessage({ type: "success", text: "Profile saved successfully" });
      setTimeout(() => setSaveMessage(null), 3000);
    },
    onError: () => {
      setSaveMessage({
        type: "error",
        text: "Failed to save. Please try again.",
      });
      setTimeout(() => setSaveMessage(null), 3000);
    },
  });

  const handleSave = () => {
    // Only send fields that Prisma accepts
    const payload = {
      companyName: formData.companyName,
      industry: formData.industry,
      companySize: formData.companySize,
      website: formData.website,
      hqLocation: formData.hqLocation,
      companyDescription: formData.companyDescription,
      linkedin: formData.linkedin,
      twitter: formData.twitter,
      github: formData.github,
      hiringType: formData.hiringType,
      budget: formData.budget ? parseFloat(formData.budget) : null,
      timezone: formData.timezone,
      preferredWorkingHours: formData.preferredWorkingHours,
    };
    updateProfileMutation.mutate(payload);
  };

  const handleImageUpload = async (type, file) => {
    setUploadingImage(type);
    try {
      const response =
        type === "logo"
          ? await profileAPI.uploadCompanyLogo(file)
          : await profileAPI.uploadCoverPhoto(file);

      const imageUrl =
        type === 'logo'
          ? response?.user?.profile?.avatar || response?.user?.avatar || response?.url
          : response?.user?.profile?.coverPhoto || response?.user?.coverPhoto || response?.url;

      const stateKey = type === 'logo' ? 'avatar' : 'coverPhoto';
      setFormData((prev) => ({ ...prev, [stateKey]: imageUrl }));
      setSaveMessage({ type: 'success', text: `${type === 'logo' ? 'Logo' : 'Banner'} updated` });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: "error", text: `Failed to upload ${type}` });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setUploadingImage(null);
    }
  };

  const handleTaxUpload = async (file) => {
    try {
      await profileAPI.uploadTaxCertificate(file);
      setVerification((prev) => ({ ...prev, taxCertificate: "pending" }));
      setSaveMessage({
        type: "success",
        text: "Tax certificate uploaded. Under review.",
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: "Upload failed. Please try again.",
      });
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const onLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload("logo", file);
  };

  const onBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload("banner", file);
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
      transition: { duration: 0.4, ease: "easeOut" },
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
            <p className="text-ink-secondary mt-1">
              Build a trusted brand to attract the best freelancers.
            </p>
          </div>

          <div className="flex bg-surface-muted p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "edit"
                  ? "bg-white text-brand-900 shadow-sm"
                  : "text-ink-secondary hover:text-ink-primary"
              }`}
              aria-label="Edit profile mode"
            >
              <Settings size={18} /> Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "preview"
                  ? "bg-white text-brand-900 shadow-sm"
                  : "text-ink-secondary hover:text-ink-primary"
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
                saveMessage.type === "success"
                  ? "bg-accent-light text-accent-dark"
                  : "bg-danger-light text-danger"
              }`}
            >
              {saveMessage.text}
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === "edit" ? (
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
                  src={formData.coverPhoto}
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
                    src={formData.avatar}
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
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                    placeholder="Acme Inc."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                    Category (Industry)
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) =>
                      setFormData({ ...formData, industry: e.target.value })
                    }
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white"
                  >
                    <option value="">Select Category</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Media & Entertainment">Media & Entertainment</option>
                    <option value="Design & Creative">Design & Creative</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                    Company Size
                  </label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
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
                    value={formData.hqLocation}
                    onChange={(e) => setFormData({ ...formData, hqLocation: e.target.value })}
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
                    value={formData.companyDescription}
                    onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
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
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                    placeholder="https://acme.com"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                    Hiring Type
                  </label>
                  <select
                    value={formData.hiringType}
                    onChange={(e) => setFormData({ ...formData, hiringType: e.target.value })}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white"
                  >
                    <option value="">Select type</option>
                    <option value="FREELANCE">Freelance</option>
                    <option value="FULL_TIME">Full-Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                    Hiring Budget (Total)
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                    placeholder="e.g. 50000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                    Timezone
                  </label>
                  <input
                    type="text"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                    placeholder="e.g. EST, UTC+3"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                    Preferred Working Hours
                  </label>
                  <input
                    type="text"
                    value={formData.preferredWorkingHours}
                    onChange={(e) => setFormData({ ...formData, preferredWorkingHours: e.target.value })}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                    placeholder="e.g. 9 AM - 5 PM EST"
                  />
                </div>

                <div className="md:col-span-2 mt-4">
                  <h3 className="text-sm font-semibold text-ink-primary mb-3">Social Profiles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">LinkedIn</label>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                        placeholder="https://linkedin.com/company/acme"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Twitter</label>
                      <input
                        type="url"
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                        placeholder="https://twitter.com/acme"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Github</label>
                      <input
                        type="url"
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                        placeholder="https://github.com/acme"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-border flex justify-end">
                <motion.button
                  whileTap={buttonTap}
                  onClick={handleSave}
                  disabled={updateProfileMutation.isPending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-900 text-white rounded-lg font-medium text-sm hover:bg-brand-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {updateProfileMutation.isPending && <Loader2 size={16} className="animate-spin" />}
                  {updateProfileMutation.isPending ? "Saving..." : "Save Profile Info"}
                </motion.button>
              </div>
            </motion.section>

            {/* Verification Center */}
            <motion.section
              variants={itemVariants}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-display font-bold text-brand-900 mb-6 flex items-center gap-2">
                <ShieldCheck size={24} className="text-accent" /> Verification
                Center
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Business Registration Card */}
                <div className="border border-border rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-ink-primary">
                        Business Registration
                      </h3>
                      {verification.businessRegistration === "verified" ? (
                        <CheckCircle2 size={20} className="text-accent" />
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warn-light text-warn">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-tertiary mb-4">
                      {verification.businessRegistration === "verified"
                        ? "Verified on May 10, 2026"
                        : "Submit your business registration document to get verified"}
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
                      <h3 className="font-medium text-ink-primary">
                        Tax Certificate
                      </h3>
                      {verification.taxCertificate === "verified" ? (
                        <CheckCircle2 size={20} className="text-accent" />
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warn-light text-warn">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-tertiary mb-4">
                      Upload your VAT/Tax certificate to get the Verified
                      Business badge.
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
                  src={formData.coverPhoto}
                  alt="Company banner"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-6 lg:px-8 pb-6 relative">
                <div className="flex flex-wrap justify-between items-end gap-4">
                  <img
                    src={formData.avatar}
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
                    {formData.companyName || 'Company Name'}
                    <CheckCircle2 size={24} className="text-accent" />
                  </h1>
                  <p className="text-lg text-ink-secondary mt-1">
                    {formData.industry || "Industry not specified"}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-ink-tertiary mt-4">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} /> {formData.hqLocation || 'Location not specified'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={16} /> {formData.companySize || 'Size not specified'}
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
                  <h2 className="font-display text-xl font-bold text-brand-900 mb-4">
                    About
                  </h2>
                  <p className="text-ink-primary whitespace-pre-wrap">
                    {formData.companyDescription || 'No company description provided yet.'}
                  </p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="bg-white border border-border rounded-2xl p-6 shadow-sm"
                >
                  <h2 className="font-display text-xl font-bold text-brand-900 mb-4 flex items-center gap-2">
                    <Briefcase size={20} className="text-accent" /> Open Roles
                    (3)
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
                        <p className="text-sm text-ink-tertiary mt-1">
                          Full-time contract • $50-$80/hr
                        </p>
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
                  <h2 className="font-display text-xl font-bold text-brand-900 mb-4">
                    Hiring Stats
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-ink-tertiary">
                          Total Spent
                        </span>
                        <span className="text-sm font-semibold text-ink-primary">
                          $45k+
                        </span>
                      </div>
                      <div className="w-full bg-surface-muted h-1.5 rounded-full overflow-hidden">
                        <div className="w-[80%] bg-accent h-full rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-ink-tertiary">
                          Hire Rate
                        </span>
                        <span className="text-sm font-semibold text-ink-primary">
                          72%
                        </span>
                      </div>
                      <div className="w-full bg-surface-muted h-1.5 rounded-full overflow-hidden">
                        <div className="w-[72%] bg-accent h-full rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={20} className="text-warn fill-warn" />
                      <span className="text-lg font-bold text-ink-primary">
                        4.9
                      </span>
                      <span className="text-xs font-medium text-ink-tertiary">
                        (42 reviews)
                      </span>
                    </div>
                    <p className="text-xs text-ink-tertiary">
                      Highly rated by freelancers.
                    </p>
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
