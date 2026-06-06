// src/pages/freelancer/RecommendationProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Save,
  RefreshCw,
  Award,
  TrendingUp,
  AlertCircle,
  Briefcase,
  Clock,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { profileAPI } from '../../common/services/api';

// ---------- Shared UI Components (inline) ----------
const Button = ({ children, variant = 'primary', disabled = false, className = '', onClick, type = 'button' }) => {
  const base = 'px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-brand-900 text-white hover:bg-brand-800 disabled:opacity-40',
    ghost: 'border border-brand-900 text-brand-900 hover:bg-surface-muted disabled:opacity-40',
    danger: 'bg-danger text-white hover:bg-red-700 disabled:opacity-40',
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

const Card = ({ children, className = '', hover = true }) => (
  <motion.div
    whileHover={hover ? { y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' } : {}}
    transition={{ duration: 0.2 }}
    className={`bg-white border border-border rounded-2xl p-6 shadow-sm ${className}`}
  >
    {children}
  </motion.div>
);

const Input = ({ label, value, onChange, type = 'text', placeholder, error, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-xs font-medium text-ink-secondary mb-1.5 font-body">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white ${error ? 'border-danger' : ''}`}
      {...props}
    />
    {error && <p className="text-danger text-xs mt-1">{error}</p>}
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows = 4 }) => (
  <div className="mb-4">
    {label && <label className="block text-xs font-medium text-ink-secondary mb-1.5 font-body">{label}</label>}
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-border rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="mb-4">
    {label && <label className="block text-xs font-medium text-ink-secondary mb-1.5 font-body">{label}</label>}
    <select
      value={value}
      onChange={onChange}
      className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-surface-muted text-ink-secondary',
    success: 'bg-accent-light text-accent-dark',
    warning: 'bg-warn-light text-warn',
    danger: 'bg-danger-light text-danger',
    info: 'bg-info-light text-info',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Spinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-8 h-8 border-4 border-border border-t-brand-900 rounded-full animate-spin" />
  </div>
);

// ---------- Main Component ----------
export default function RecommendationProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    professionalTitle: '',
    bio: '',
    hourlyRate: 30,
    yearsOfExperience: 3,
    skillLevel: 'INTERMEDIATE',
    workModePreference: 'NO_PREFERENCE',
    preferredProjectType: 'LONG_TERM',
    availableHours: 40,
    timezone: 'UTC+3',
  });

  const [completionScore, setCompletionScore] = useState(0);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await profileAPI.getMyProfile();
        if (res.success && res.user?.profile) {
          const p = res.user.profile;
          setProfileId(p.id);
          setFormData({
            professionalTitle: p.professionalTitle || '',
            bio: p.bio || '',
            hourlyRate: p.hourlyRate || 30,
            yearsOfExperience: p.yearsOfExperience || 3,
            skillLevel: p.skillLevel || 'INTERMEDIATE',
            workModePreference: p.workModePreference || 'NO_PREFERENCE',
            preferredProjectType: p.preferredProjectType || 'LONG_TERM',
            availableHours: p.availableHours || 40,
            timezone: p.timezone || 'UTC+3',
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setToast({ type: 'error', message: 'Could not load profile data.' });
        setTimeout(() => setToast(null), 3000);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Calculate completion score (non‑AI, just field completion)
  useEffect(() => {
    let score = 0;
    if (formData.professionalTitle.trim()) score += 15;
    if (formData.bio.trim().length > 50) score += 25;
    else if (formData.bio.trim().length > 20) score += 15;
    else if (formData.bio.trim().length > 0) score += 5;
    if (formData.hourlyRate > 0) score += 15;
    if (formData.yearsOfExperience > 0) score += 10;
    if (formData.skillLevel) score += 10;
    if (formData.preferredProjectType) score += 10;
    if (formData.workModePreference) score += 5;
    if (formData.availableHours > 0) score += 5;
    setCompletionScore(Math.min(score, 100));
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await profileAPI.updateMyProfile({
        professionalTitle: formData.professionalTitle,
        bio: formData.bio,
        hourlyRate: parseFloat(formData.hourlyRate),
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        skillLevel: formData.skillLevel,
        workModePreference: formData.workModePreference,
        preferredProjectType: formData.preferredProjectType,
        availableHours: parseInt(formData.availableHours),
        timezone: formData.timezone,
      });

      if (res.success) {
        setToast({ type: 'success', message: 'Profile saved successfully!' });
        setTimeout(() => setToast(null), 3000);
      } else {
        setToast({ type: 'error', message: 'Failed to save profile.' });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Error occurred while saving.' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const getMissingTips = () => {
    const tips = [];
    if (!formData.professionalTitle.trim()) tips.push('Add a professional title to help clients understand your expertise.');
    if (formData.bio.trim().length < 50) tips.push('Write a more detailed bio (at least 50 characters) to showcase your skills.');
    if (formData.skillLevel === 'INTERMEDIATE' && formData.yearsOfExperience > 5) {
      tips.push('Consider updating your skill level to EXPERT based on your experience.');
    }
    if (!formData.workModePreference || formData.workModePreference === 'NO_PREFERENCE') {
      tips.push('Specify your work mode preference (remote or onsite) to get better matches.');
    }
    return tips;
  };

  if (loading) return <Spinner />;

  const tips = getMissingTips();
  const isComplete = tips.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8 pb-12 px-4 sm:px-6 lg:px-8"
    >
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-md text-sm font-medium ${
              toast.type === 'success' ? 'bg-accent text-white' : 'bg-danger text-white'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light text-accent-dark rounded-xl">
              <Briefcase className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-display font-bold text-brand-900">Profile settings</h1>
          </div>
          <p className="text-sm text-ink-secondary">
            Complete your profile to improve your visibility and increase your chances of being hired.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Score and tips */}
        <div className="space-y-6">
          <Card className="text-center p-6">
            <h3 className="text-sm font-medium text-ink-secondary uppercase tracking-wide mb-4">
              Profile completion
            </h3>
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#E7E5E4" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * completionScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-mono font-bold text-brand-900">{completionScore}%</span>
                <p className="text-xs text-ink-secondary mt-1">complete</p>
              </div>
            </div>
            {isComplete ? (
              <div className="mt-4 flex items-center justify-center gap-2 text-accent">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Fully complete</span>
              </div>
            ) : (
              <p className="text-xs text-ink-tertiary mt-4">
                Complete all sections to reach 100%
              </p>
            )}
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-ink-secondary uppercase tracking-wide mb-4 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Suggestions
            </h3>
            {isComplete ? (
              <div className="flex gap-3 text-accent">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-ink-primary">Profile complete</p>
                  <p className="text-xs text-ink-secondary mt-1">
                    Your profile is fully filled out. Keep it updated to stay relevant.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {tips.map((tip, idx) => (
                  <div key={idx} className="flex gap-3 text-warn">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="text-xs text-ink-secondary">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right column: Form */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-display font-semibold text-brand-900 mb-6">Professional details</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <Input
                    label="Professional title"
                    value={formData.professionalTitle}
                    onChange={(e) => handleChange('professionalTitle', e.target.value)}
                    placeholder="e.g., Senior React Developer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5 font-body">Skill level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['ENTRY', 'INTERMEDIATE', 'EXPERT'].map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => handleChange('skillLevel', level)}
                        className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                          formData.skillLevel === level
                            ? 'bg-brand-900 text-white border-brand-900'
                            : 'bg-white text-ink-secondary border-border hover:border-brand-900'
                        }`}
                      >
                        {level.charAt(0) + level.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5 font-body">Work preference</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['ONLINE', 'ONSITE', 'NO_PREFERENCE'].map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => handleChange('workModePreference', mode)}
                        className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                          formData.workModePreference === mode
                            ? 'bg-brand-900 text-white border-brand-900'
                            : 'bg-white text-ink-secondary border-border hover:border-brand-900'
                        }`}
                      >
                        {mode === 'NO_PREFERENCE' ? 'Any' : mode === 'ONLINE' ? 'Remote' : 'Onsite'}
                      </button>
                    ))}
                  </div>
                </div>

                <Select
                  label="Project type"
                  value={formData.preferredProjectType}
                  onChange={(e) => handleChange('preferredProjectType', e.target.value)}
                  options={[
                    { value: 'SHORT_TERM', label: 'Short term (< 3 months)' },
                    { value: 'LONG_TERM', label: 'Long term (> 3 months)' },
                    { value: 'FIXED_PRICE', label: 'Fixed price projects' },
                    { value: 'HOURLY', label: 'Hourly contracts' },
                  ]}
                />

                <Select
                  label="Timezone"
                  value={formData.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  options={[
                    { value: 'UTC+3', label: 'UTC+3 (Nairobi)' },
                    { value: 'UTC+2', label: 'UTC+2 (Cairo)' },
                    { value: 'UTC+0', label: 'UTC+0 (London)' },
                    { value: 'UTC-5', label: 'UTC-5 (New York)' },
                    { value: 'UTC-8', label: 'UTC-8 (Los Angeles)' },
                  ]}
                />

                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5 font-body">Hourly rate (USD)</label>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-ink-tertiary" />
                    <input
                      type="range"
                      min="10"
                      max="300"
                      step="5"
                      value={formData.hourlyRate}
                      onChange={(e) => handleChange('hourlyRate', parseInt(e.target.value))}
                      className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-brand-900"
                    />
                    <span className="text-sm font-mono font-semibold text-brand-900 min-w-[60px]">
                      ${formData.hourlyRate}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5 font-body">Weekly available hours</label>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-ink-tertiary" />
                    <input
                      type="range"
                      min="5"
                      max="80"
                      step="5"
                      value={formData.availableHours}
                      onChange={(e) => handleChange('availableHours', parseInt(e.target.value))}
                      className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-brand-900"
                    />
                    <span className="text-sm font-mono font-semibold text-brand-900 min-w-[60px]">
                      {formData.availableHours}h
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5 font-body">Years of experience</label>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-ink-tertiary" />
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={formData.yearsOfExperience}
                      onChange={(e) => handleChange('yearsOfExperience', parseInt(e.target.value))}
                      className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-brand-900"
                    />
                    <span className="text-sm font-mono font-semibold text-brand-900 min-w-[60px]">
                      {formData.yearsOfExperience}y
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Textarea
                    label="Bio"
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    placeholder="Tell clients about your expertise, experience, and what makes you unique..."
                    rows={5}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
