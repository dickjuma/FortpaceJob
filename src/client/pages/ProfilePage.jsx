import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</p>
    <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">{value || 'Not set'}</p>
  </div>
);

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
  const stats = useMemo(() => ([
    { label: 'Account Type', value: summary.persona, icon: User },
    { label: 'Location', value: summary.location, icon: MapPin },
    { label: 'Industry', value: summary.industry || 'General', icon: Briefcase },
    { label: 'Verified', value: profile?.isVerified ? 'Yes' : 'Pending', icon: BadgeCheck },
  ]), [profile?.isVerified, summary]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-success border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>;
  }

  const profileData = profile?.profile || profile || {};

  return (
    <div className="space-y-8 pb-10">
      <div className="rounded-[28px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-success to-success text-white shadow-lg">
              {summary.displayName?.[0]?.toUpperCase() || <User className="h-8 w-8" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-zinc-900 dark:text-white">{summary.displayName}</h1>
                <span className="rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-success">
                  {summary.persona}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {summary.title || 'Profile ready for hiring and collaboration'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {summary.location}</span>
                <span className="inline-flex items-center gap-1.5"><Globe className="h-4 w-4" /> {profile?.email || user?.email}</span>
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Recent member'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/client/recommendation-profile" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-sm font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900">
              <Settings className="h-4 w-4" /> Recommendation profile
            </Link>
            <Link to="/client/profile-intelligence" className="inline-flex items-center gap-2 rounded-xl bg-success px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#14a800]/20 hover:bg-success">
              <Workflow className="h-4 w-4" /> Company profile
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</p>
              <stat.icon className="h-4 w-4 text-success" />
            </div>
            <p className="mt-3 text-sm font-bold text-zinc-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">Profile Information</h2>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                Live data
              </span>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name" value={[profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || summary.displayName} />
              <Field label="Persona" value={summary.persona} />
              <Field label="Company name" value={summary.companyName || profileData.companyName} />
              <Field label="Company size" value={profileData.companySize || profileData.teamSize || 'Not set'} />
              <Field label="Industry" value={summary.industry || profileData.industry} />
              <Field label="Website" value={profileData.website || 'Not set'} />
            </div>
          </section>

          <section className="rounded-[28px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
            <h2 className="text-lg font-black text-zinc-900 dark:text-white">Role-specific details</h2>
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
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
            <h2 className="text-lg font-black text-zinc-900 dark:text-white">Trust signals</h2>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 p-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Identity</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">Verified account profile</p>
                </div>
                <CheckCircle2 className={`h-5 w-5 ${profile?.isVerified ? 'text-emerald-500' : 'text-zinc-400'}`} />
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 p-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Security</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">Sessions and password controls</p>
                </div>
                <ShieldCheck className="h-5 w-5 text-success" />
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 p-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Payments</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">Wallet and escrow-ready</p>
                </div>
                <CreditCard className="h-5 w-5 text-success" />
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
            <h2 className="text-lg font-black text-zinc-900 dark:text-white">Quick links</h2>
            <div className="mt-5 space-y-3">
              <Link to="/client/messages" className="flex items-center justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                Messages <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/client/contracts" className="flex items-center justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                Contracts <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/client/favorites" className="flex items-center justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                Favorites <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
