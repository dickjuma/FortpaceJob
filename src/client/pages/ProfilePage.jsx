// ProfilePage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Globe,
  MapPin,
  ShieldCheck,
  User,
  Workflow,
  ArrowRight,
  CreditCard,
  BadgeCheck,
  Settings,
} from 'lucide-react';
import { useAuthStore } from '../../common/authStore';
import { profileAPI } from '../../common/services/api';
import { getProfileSummary } from '../../common/utils/profile';

const Field = ({ label, value }) => (
  <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
    <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary">{label}</p>
    <p className="mt-2 text-sm font-medium text-ink-primary">{value || 'Not set'}</p>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};
const buttonTap = { scale: 0.97 };

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await profileAPI.getMyProfile();
        if (!active) return;
        setProfile(res?.user || null);
      } catch (err) {
        if (!active) return;
        setError(err?.message || 'Failed to load profile');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const summary = useMemo(() => getProfileSummary(profile || user || {}, profile?.profile || profile || {}), [profile, user]);
  const stats = useMemo(() => [
    { label: 'Account Type', value: summary.persona, icon: User },
    { label: 'Location', value: summary.location, icon: MapPin },
    { label: 'Industry', value: summary.industry || 'General', icon: Briefcase },
    { label: 'Verified', value: profile?.isVerified ? 'Yes' : 'Pending', icon: BadgeCheck },
  ], [profile?.isVerified, summary]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-danger/20 bg-danger-light p-4 text-sm text-danger">
        {error}
      </div>
    );
  }

  const profileData = profile?.profile || profile || {};
  const displayName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || summary.displayName || 'Client';

  return (
    <div className="space-y-8 pb-10">
      {/* Header Card */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="rounded-2xl border border-border bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-dark text-white shadow-md">
              {displayName.charAt(0).toUpperCase() || <User className="h-8 w-8" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-brand-900">{displayName}</h1>
                <span className="inline-flex rounded-full bg-accent-light px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-dark">
                  {summary.persona}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-secondary">
                {summary.title || 'Profile ready for hiring and collaboration'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-ink-tertiary">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {summary.location || 'Location not set'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="h-4 w-4" /> {profile?.email || user?.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />{' '}
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Recent member'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/client/recommendation-profile"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-soft"
            >
              <Settings className="h-4 w-4" /> Recommendation profile
            </Link>
            <Link
              to="/client/profile-intelligence"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark shadow-sm"
            >
              <Workflow className="h-4 w-4" /> Company profile
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
            className="rounded-xl border border-border bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-tertiary">
                {stat.label}
              </p>
              <stat.icon className="h-4 w-4 text-accent" />
            </div>
            <p className="mt-3 text-sm font-semibold text-ink-primary">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile Information */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-border bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-brand-900">Profile Information</h2>
              <span className="inline-flex rounded-full bg-accent-light px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent-dark">
                Live data
              </span>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name" value={displayName} />
              <Field label="Persona" value={summary.persona} />
              <Field label="Company name" value={summary.companyName || profileData.companyName} />
              <Field label="Company size" value={profileData.companySize || profileData.teamSize || 'Not set'} />
              <Field label="Industry" value={summary.industry || profileData.industry} />
              <Field label="Website" value={profileData.website || 'Not set'} />
            </div>
          </motion.div>

          {/* Role-specific details */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-border bg-white p-6 shadow-sm"
          >
            <h2 className="font-display text-lg font-bold text-brand-900">Role-specific details</h2>
            {summary.accountType === 'INDIVIDUAL' ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Preferred engagement" value={profileData.preferredHiringModel || profileData.hiringType || 'Freelance'} />
                <Field label="Availability" value={profileData.availability || 'Open for projects'} />
                <Field label="Top skills" value={summary.skills.slice(0, 4).join(', ') || 'Add your skills'} />
                <Field label="Languages" value={summary.languages.map((l) => l.name).join(', ') || 'Add languages'} />
              </div>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Business structure" value={summary.accountType} />
                <Field label="Team size" value={summary.teamSize || profileData.companySize || 'Not set'} />
                <Field label="Registration number" value={summary.registrationNumber || 'Not set'} />
                <Field label="Hiring model" value={profileData.hiringType || 'FREELANCE'} />
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Trust Signals */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-border bg-white p-6 shadow-sm"
          >
            <h2 className="font-display text-lg font-bold text-brand-900">Trust signals</h2>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-surface-soft p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">Identity</p>
                  <p className="mt-1 text-sm font-medium text-ink-primary">Verified account profile</p>
                </div>
                <CheckCircle2 className={`h-5 w-5 ${profile?.isVerified ? 'text-accent' : 'text-ink-tertiary'}`} />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-surface-soft p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">Security</p>
                  <p className="mt-1 text-sm font-medium text-ink-primary">Sessions and password controls</p>
                </div>
                <ShieldCheck className="h-5 w-5 text-accent" />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-surface-soft p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">Payments</p>
                  <p className="mt-1 text-sm font-medium text-ink-primary">Wallet and escrow-ready</p>
                </div>
                <CreditCard className="h-5 w-5 text-accent" />
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-border bg-white p-6 shadow-sm"
          >
            <h2 className="font-display text-lg font-bold text-brand-900">Quick links</h2>
            <div className="mt-5 space-y-3">
              <Link
                to="/client/messages"
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-soft"
              >
                Messages <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/client/contracts"
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-soft"
              >
                Contracts <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/client/favorites"
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-soft"
              >
                Favorites <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
