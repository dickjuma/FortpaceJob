// ClientProfilePage.jsx
// Self-contained Client Profile page with design tokens, framer-motion animations,
// and local mock data. No external dependencies.
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Edit2,
  Camera,
  Building,
  MapPin,
  Globe,
  Mail,
  Phone,
  Star,
  Briefcase,
  CheckCircle,
  Calendar,
  Save,
  X,
  Loader2,
  AlertCircle,
  DollarSign,
} from 'lucide-react';
import { useMyProfile, useUpdateProfile } from '../services/clientHooks';

// ----------------------------------------------------------------------
// Client Account Types (mock, originally from constants)
// ----------------------------------------------------------------------
const CLIENT_ACCOUNT_TYPES = [
  { id: 'INDIVIDUAL', label: 'Individual', description: 'For solo clients hiring occasionally' },
  { id: 'SME', label: 'Small Business', description: 'For teams hiring regularly' },
  { id: 'CORPORATE', label: 'Corporate', description: 'For large organizations with high volume' },
];

const normalizeClientType = (type) => {
  if (type === 'SME' || type === 'CORPORATE') return type;
  return 'INDIVIDUAL';
};

// Helper for conditional classes
const cn = (...classes) => classes.filter(Boolean).join(' ');


export default function ClientProfilePage() {
  const { data: profile, isLoading, error } = useMyProfile();
  const updateProfile = useUpdateProfile();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [clientType, setClientType] = useState('INDIVIDUAL');
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [isDepositing, setIsDepositing] = useState(false);

useEffect(() => {
    if (profile) {
      const defaultType = normalizeClientType(profile?.accountType || profile?.clientType || profile?.clientProfile?.accountType);
      setClientType(defaultType);
    }
  }, [profile]);

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const startEdit = () => {
    const p = profile;
    const cp = p?.clientProfile || {};
    setClientType(normalizeClientType(p?.accountType || cp?.clientType || p?.clientType));
    setEditForm({
      firstName: p?.firstName || '',
      lastName: p?.lastName || '',
      bio: p?.bio || cp?.companyBio || '',
      phone: p?.phone || '',
      location: cp?.location || '',
      website: cp?.website || '',
      companyName: cp?.companyName || '',
      industry: cp?.industry || '',
      companySize: cp?.companySize || '',
    });
    setEditing(true);
    setFormErrors({});
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditForm(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!editForm?.firstName?.trim()) errors.firstName = 'First name is required.';
    if (!editForm?.lastName?.trim()) errors.lastName = 'Last name is required.';
    if (clientType !== 'INDIVIDUAL' && !editForm?.companyName?.trim()) {
      errors.companyName = 'Company name is required for business accounts.';
    }
    if (editForm?.website && !/^https?:\/\/[\w\-]+(\.[\w\-]+)+([\w\-\._~:/?#[\]@!$&'()*+,;=.]+)?$/.test(editForm.website)) {
      errors.website = 'Please enter a valid website URL (https://...).';
    }
    if (editForm?.phone && !/^\+?[0-9]{7,15}$/.test(editForm.phone)) {
      errors.phone = 'Please enter a valid phone number with country code.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showToast('error', 'Please fix the highlighted fields before saving.');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phone: editForm.phone,
        bio: editForm.bio,
        companyName: editForm.companyName,
        location: editForm.location,
        website: editForm.website,
        industry: editForm.industry,
        companySize: editForm.companySize,
        companyBio: editForm.bio,
      };
      await updateProfile.mutateAsync(payload);
      setEditing(false);
      setEditForm(null);
      showToast('success', 'Profile saved successfully.');
    } catch (err) {
      showToast('error', err?.message || 'Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const amount = formData.get('amount');
    const phone = formData.get('phone');
    if (!amount || !phone) {
      showToast('error', 'Enter amount and M-Pesa number');
      return;
    }
    setIsDepositing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    showToast('success', `STK Push sent to ${phone}! Enter PIN to complete.`);
    e.target.reset();
    setIsDepositing(false);
  };

  // Derived data
  const p = profile;
  const cp = p?.clientProfile || {};
  const displayName = `${p?.firstName || ''} ${p?.lastName || ''}`.trim() || p?.username || 'Client';
  const initials = displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

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
  const cardHover = {
    rest: { y: 0, boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    hover: { y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', transition: { duration: 0.2 } },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (error || !p) {
    return (
      <div className="min-h-screen bg-surface-soft flex flex-col items-center justify-center gap-4 p-6">
        <AlertCircle size={48} className="text-danger opacity-60" />
        <p className="text-ink-secondary">Failed to load profile.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  const inputClass = (field) =>
    cn(
      'w-full rounded-lg px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2',
      formErrors[field]
        ? 'border-danger bg-danger-light text-danger focus:ring-danger/20'
        : 'border-border bg-white text-ink-primary focus:ring-brand-900 focus:border-transparent'
    );

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Client Account Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-border rounded-2xl p-5 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-ink-tertiary uppercase tracking-wide mb-3">
            Client account type
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {CLIENT_ACCOUNT_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                disabled={!editing && clientType !== type.id}
                onClick={() => editing && setClientType(type.id)}
                className={cn(
                  'text-left p-4 rounded-xl border-2 transition-all',
                  clientType === type.id
                    ? 'border-accent bg-accent-light'
                    : 'border-border bg-white opacity-70',
                  editing ? 'cursor-pointer hover:border-accent/50' : 'cursor-default'
                )}
              >
                <p className="font-semibold text-ink-primary text-sm">{type.label}</p>
                <p className="text-xs text-ink-tertiary mt-1">{type.description}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
        >
          {/* Cover */}
          <div className="h-28 bg-gradient-to-r from-accent/30 via-accent/20 to-brand-900/40 relative">
            <div className="absolute inset-0 bg-brand-900/20" />
          </div>

          {/* Avatar + Info */}
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-8 relative z-10">
              <div className="flex items-end gap-4">
                <div className="w-20 h-20 rounded-xl bg-brand-900 border-4 border-white flex items-center justify-center text-2xl font-bold text-white shadow-sm overflow-hidden">
                  {p.avatar ? (
                    <img src={p.avatar} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="pb-1">
                  <h1 className="font-display text-xl font-bold text-brand-900">{displayName}</h1>
                  <p className="text-sm text-ink-secondary mt-0.5">{cp?.companyName || p.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {p.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-accent">
                        <CheckCircle size={12} /> Verified
                      </span>
                    )}
                    {p.role && (
                      <span className="text-[10px] text-ink-tertiary ml-2">• {p.role}</span>
                    )}
                  </div>
                </div>
              </div>
              {!editing ? (
                <motion.button
                  whileTap={buttonTap}
                  onClick={startEdit}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-border bg-white text-ink-primary rounded-lg text-sm font-medium hover:bg-surface-soft transition-colors"
                >
                  <Edit2 size={14} /> Edit Profile
                </motion.button>
              ) : (
                <div className="flex gap-2">
                  <motion.button
                    whileTap={buttonTap}
                    onClick={cancelEdit}
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-border bg-white text-ink-primary rounded-lg text-xs font-medium hover:bg-surface-soft transition-colors"
                  >
                    <X size={14} /> Cancel
                  </motion.button>
                  <motion.button
                    whileTap={buttonTap}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { label: 'Jobs Posted', value: cp?.totalJobsPosted ?? '—', icon: Briefcase, color: 'text-accent' },
            { label: 'Total Hires', value: cp?.totalHires ?? '—', icon: CheckCircle, color: 'text-accent' },
            { label: 'Active Jobs', value: cp?.activeJobsCount ?? '—', icon: Star, color: 'text-warn' },
            { label: 'Member Since', value: p.createdAt ? new Date(p.createdAt).getFullYear() : '—', icon: Calendar, color: 'text-info' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={cardHover.hover}
              className="bg-white border border-border rounded-2xl p-4 text-center shadow-sm"
            >
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <p className="text-lg font-bold text-ink-primary">{stat.value}</p>
              <p className="text-xs text-ink-tertiary mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Profile Details Form / View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-5"
        >
          <h2 className="font-display text-lg font-bold text-brand-900">Profile Details</h2>
          {editing ? (
            <div className="space-y-4">
              {Object.keys(formErrors).length > 0 && (
                <div className="rounded-xl border border-danger-light bg-danger-light p-3 text-sm text-danger">
                  Please fix the highlighted fields before saving.
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-ink-tertiary mb-1.5 block">
                    First Name
                  </label>
                  <input
                    value={editForm.firstName}
                    onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))}
                    className={inputClass('firstName')}
                    aria-invalid={Boolean(formErrors.firstName)}
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-xs text-danger">{formErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-ink-tertiary mb-1.5 block">
                    Last Name
                  </label>
                  <input
                    value={editForm.lastName}
                    onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))}
                    className={inputClass('lastName')}
                    aria-invalid={Boolean(formErrors.lastName)}
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-xs text-danger">{formErrors.lastName}</p>
                  )}
                </div>
              </div>
              {(clientType === 'SME' || clientType === 'CORPORATE') && (
                <>
                  <div>
                    <label className="text-xs font-medium text-ink-tertiary mb-1.5 block">
                      Company Name
                    </label>
                    <input
                      value={editForm.companyName}
                      onChange={(e) => setEditForm((f) => ({ ...f, companyName: e.target.value }))}
                      className={inputClass('companyName')}
                      aria-invalid={Boolean(formErrors.companyName)}
                    />
                    {formErrors.companyName && (
                      <p className="mt-1 text-xs text-danger">{formErrors.companyName}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-ink-tertiary mb-1.5 block">
                        Industry
                      </label>
                      <input
                        value={editForm.industry}
                        onChange={(e) => setEditForm((f) => ({ ...f, industry: e.target.value }))}
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-ink-tertiary mb-1.5 block">
                        Company Size
                      </label>
                      <input
                        value={editForm.companySize}
                        onChange={(e) => setEditForm((f) => ({ ...f, companySize: e.target.value }))}
                        placeholder="e.g. 11-50"
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                      />
                    </div>
                  </div>
                </>
              )}
              <div>
                <label className="text-xs font-medium text-ink-tertiary mb-1.5 block">
                  Bio / About
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-ink-tertiary mb-1.5 block">
                    Phone
                  </label>
                  <input
                    value={editForm.phone}
                    onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                    className={inputClass('phone')}
                    aria-invalid={Boolean(formErrors.phone)}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-xs text-danger">{formErrors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-ink-tertiary mb-1.5 block">
                    Location
                  </label>
                  <input
                    value={editForm.location}
                    onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))}
                    className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-ink-tertiary mb-1.5 block">
                  Website
                </label>
                <input
                  value={editForm.website}
                  onChange={(e) => setEditForm((f) => ({ ...f, website: e.target.value }))}
                  placeholder="https://..."
                  className={inputClass('website')}
                  aria-invalid={Boolean(formErrors.website)}
                />
                {formErrors.website && (
                  <p className="mt-1 text-xs text-danger">{formErrors.website}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {p.bio || cp?.companyBio ? (
                <div>
                  <p className="text-xs font-medium text-ink-tertiary mb-1">About</p>
                  <p className="text-sm text-ink-primary leading-relaxed">{p.bio || cp?.companyBio}</p>
                </div>
              ) : (
                <p className="text-sm text-ink-tertiary italic">
                  No bio added yet. Click "Edit Profile" to add one.
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {[
                  { label: 'Email', value: p.email, icon: Mail },
                  { label: 'Phone', value: p.phone || '—', icon: Phone },
                  { label: 'Location', value: cp?.location || '—', icon: MapPin },
                  { label: 'Website', value: cp?.website || '—', icon: Globe },
                  { label: 'Company', value: cp?.companyName || '—', icon: Building },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-soft border border-border flex items-center justify-center shrink-0">
                      <Icon size={14} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wide">
                        {label}
                      </p>
                      <p className="text-sm text-ink-primary">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Wallet & Deposits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-5"
        >
          <h2 className="font-display text-lg font-bold text-brand-900 flex items-center gap-2">
            <DollarSign size={20} className="text-accent" /> Wallet & Deposits
          </h2>
          <p className="text-sm text-ink-secondary">
            Add funds to your escrow wallet via M-Pesa to hire talent.
          </p>
          <form onSubmit={handleDeposit} className="bg-surface-soft border border-border rounded-xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-ink-tertiary mb-1.5 block">
                  Amount (KES)
                </label>
                <input
                  name="amount"
                  type="number"
                  min="10"
                  placeholder="e.g. 5000"
                  className="w-full h-10 border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-tertiary mb-1.5 block">
                  M-Pesa Phone Number
                </label>
                <input
                  name="phone"
                  placeholder="e.g. 254700000000"
                  className="w-full h-10 border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                  required
                />
              </div>
            </div>
            <motion.button
              whileTap={buttonTap}
              type="submit"
              disabled={isDepositing}
              className="px-5 py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              {isDepositing ? 'Processing...' : 'Deposit via M-Pesa'}
            </motion.button>
            <p className="text-[10px] text-ink-tertiary mt-2">
              Enter your Safaricom number starting with 254. A prompt will appear on your phone to enter your M-Pesa PIN.
            </p>
          </form>
        </motion.div>
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
                  : toast.type === 'error'
                  ? 'rgb(254, 226, 226)'
                  : 'rgb(219, 234, 254)',
              color:
                toast.type === 'success'
                  ? 'rgb(21, 128, 61)'
                  : toast.type === 'error'
                  ? 'rgb(185, 28, 28)'
                  : 'rgb(29, 78, 216)',
            }}
          >
            {toast.type === 'success' && <CheckCircle size={16} />}
            {toast.type === 'error' && <AlertCircle size={16} />}
            {toast.type === 'info' && <AlertCircle size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

