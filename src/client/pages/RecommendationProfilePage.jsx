// ClientRecommendationProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  CheckCircle,
  Save,
  RefreshCw,
  Building2,
  Globe,
  Users,
  DollarSign,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { profileAPI } from '../../common/services/api';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function ClientRecommendationProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    companyDescription: '',
    industry: 'TECHNOLOGY',
    companySize: 'MEDIUM',
    hiringType: 'FREELANCE',
    budget: 50000,
    preferredWorkingHours: '9AM - 5PM',
    timezone: 'UTC+3',
  });

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await profileAPI.getMyProfile();
        if (res.success && res.user?.profile) {
          const p = res.user.profile;
          setFormData({
            companyName: p.companyName || '',
            companyDescription: p.companyDescription || '',
            industry: p.industry || 'TECHNOLOGY',
            companySize: p.companySize || 'MEDIUM',
            hiringType: p.hiringType || 'FREELANCE',
            budget: p.budget || 50000,
            preferredWorkingHours: p.preferredWorkingHours || '9AM - 5PM',
            timezone: p.timezone || 'UTC+3',
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        showToast('error', 'Could not load company profile.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await profileAPI.updateMyProfile({
        companyName: formData.companyName,
        companyDescription: formData.companyDescription,
        industry: formData.industry,
        companySize: formData.companySize,
        hiringType: formData.hiringType,
        budget: parseFloat(formData.budget),
        preferredWorkingHours: formData.preferredWorkingHours,
        timezone: formData.timezone,
      });
      if (res.success) {
        showToast('success', 'Company profile saved successfully');
      } else {
        showToast('error', 'Failed to save company profile');
      }
    } catch (err) {
      showToast('error', err.message || 'Error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const getMissingTips = () => {
    const tips = [];
    if (!formData.companyName.trim()) tips.push('Add your company or workspace name to establish trust with freelancers.');
    if (formData.companyDescription.trim().length < 30) tips.push('Provide a detailed company description to help freelancers understand your business.');
    if (formData.budget < 10000) tips.push('Consider increasing your budget range to attract more experienced freelancers.');
    return tips;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };
  const buttonTap = { scale: 0.97 };

  const tips = getMissingTips();
  const completionPercent = Math.min(
    (Object.values(formData).filter(v => typeof v === 'string' ? v.trim() : v).length / 8) * 100,
    100
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light text-accent rounded-xl">
              <Briefcase size={24} />
            </div>
            <h1 className="font-display text-3xl font-bold text-brand-900">Company Hiring Preferences</h1>
          </div>
          <p className="text-ink-secondary text-sm">
            Configure your company profile to help freelancers understand your business and find the right talent for your projects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Completion & Tips */}
          <div className="space-y-6">
            {/* Completion Card */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-white border border-border rounded-2xl p-6 shadow-sm"
            >
              <h3 className="font-display font-bold text-brand-900 text-sm uppercase tracking-wide mb-4">
                Profile Completion
              </h3>
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" className="stroke-surface-muted" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    className="stroke-accent transition-all duration-500"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364}
                    strokeDashoffset={364 - (364 * completionPercent) / 100}
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-bold text-ink-primary">{Math.round(completionPercent)}%</span>
                  <p className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wide mt-0.5">Complete</p>
                </div>
              </div>
              <p className="text-xs text-ink-tertiary text-center mt-4">
                Complete your company profile to attract the right freelancers.
              </p>
            </motion.div>

            {/* Tips Card */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-white border border-border rounded-2xl p-6 shadow-sm"
            >
              <h3 className="font-display font-bold text-brand-900 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                <AlertCircle size={16} className="text-accent" /> Suggestions
              </h3>
              {tips.length === 0 ? (
                <div className="flex gap-3 text-accent">
                  <CheckCircle size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-ink-primary">Great job!</h4>
                    <p className="text-xs text-ink-tertiary mt-1">Your company profile is complete and ready.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {tips.map((tip, idx) => (
                    <div key={idx} className="flex gap-3 text-warn">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <p className="text-xs text-ink-tertiary">{tip}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white border border-border rounded-2xl shadow-sm p-6 sm:p-8"
            >
              <h2 className="font-display text-xl font-bold text-brand-900 mb-6">Company Profile</h2>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wide mb-1.5">
                      Company / Workspace Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Acme SaaS Labs"
                      className="w-full h-10 border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                      value={formData.companyName}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wide mb-1.5">
                      Industry
                    </label>
                    <select
                      className="w-full h-10 border border-border rounded-lg px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-900"
                      value={formData.industry}
                      onChange={(e) => handleChange('industry', e.target.value)}
                    >
                      <option value="TECHNOLOGY">Technology & Software</option>
                      <option value="FINANCE">Finance & Fintech</option>
                      <option value="MARKETING">Marketing & Advertising</option>
                      <option value="HEALTHCARE">Healthcare & Medicine</option>
                      <option value="RETAIL">Retail & E-Commerce</option>
                    </select>
                  </div>

                  {/* Hiring Type */}
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wide mb-1.5">
                      Hiring Model
                    </label>
                    <div className="grid grid-cols-3 gap-2 bg-surface-soft p-1 rounded-lg border border-border">
                      {['FULL_TIME', 'FREELANCE', 'CONTRACT'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleChange('hiringType', type)}
                          className={cn(
                            "py-1.5 text-xs font-medium rounded-md uppercase tracking-wide transition-colors",
                            formData.hiringType === type
                              ? "bg-accent text-white shadow-sm"
                              : "text-ink-secondary hover:text-accent hover:bg-surface-muted"
                          )}
                        >
                          {type === 'FULL_TIME' ? 'Full Time' : type.toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Company Size */}
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wide mb-1.5">
                      Company Size
                    </label>
                    <select
                      className="w-full h-10 border border-border rounded-lg px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-900"
                      value={formData.companySize}
                      onChange={(e) => handleChange('companySize', e.target.value)}
                    >
                      <option value="STARTUP">Startup (&lt; 10 Employees)</option>
                      <option value="MEDIUM">SME (10 - 100 Employees)</option>
                      <option value="ENTERPRISE">Enterprise (&gt; 100 Employees)</option>
                    </select>
                  </div>

                  {/* Preferred Working Hours */}
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wide mb-1.5">
                      Preferred Working Hours
                    </label>
                    <select
                      className="w-full h-10 border border-border rounded-lg px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-900"
                      value={formData.preferredWorkingHours}
                      onChange={(e) => handleChange('preferredWorkingHours', e.target.value)}
                    >
                      <option value="9AM - 5PM">Standard Business (9AM - 5PM)</option>
                      <option value="FLEXIBLE">Fully Flexible Schedules</option>
                      <option value="NIGHT_SHIFT">Night Shifts (Global Overlap)</option>
                    </select>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wide mb-1.5">
                      Timezone
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., UTC+3"
                      className="w-full h-10 border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                      value={formData.timezone}
                      onChange={(e) => handleChange('timezone', e.target.value)}
                    />
                  </div>

                  {/* Budget Range */}
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-semibold text-ink-secondary uppercase tracking-wide">
                        Default Project Budget (KES)
                      </label>
                      <span className="text-sm font-bold text-accent">KES {formData.budget.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="1000000"
                      step="5000"
                      className="w-full accent-accent h-1.5 bg-surface-muted rounded-full appearance-none cursor-pointer"
                      value={formData.budget}
                      onChange={(e) => handleChange('budget', Number(e.target.value))}
                    />
                    <div className="flex justify-between text-xs text-ink-tertiary mt-1">
                      <span>KES 1,000</span>
                      <span>KES 1,000,000</span>
                    </div>
                  </div>

                  {/* Company Description */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wide mb-1.5">
                      Company Description
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Describe your company, typical projects, and the type of talent you're looking for..."
                      className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none"
                      value={formData.companyDescription}
                      onChange={(e) => handleChange('companyDescription', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <motion.button
                    whileTap={buttonTap}
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Profile
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
            style={{
              backgroundColor:
                toast.type === 'success'
                  ? 'rgb(220, 252, 231)'
                  : 'rgb(254, 226, 226)',
              color:
                toast.type === 'success'
                  ? 'rgb(21, 128, 61)'
                  : 'rgb(185, 28, 28)',
            }}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
