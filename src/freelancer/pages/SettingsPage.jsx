import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Lock, ShieldCheck, Laptop, Bell, Eye, Save, Check, KeyRound,
} from 'lucide-react';
import { useAuthStore } from '../../platform/common/authStore';
import { useFreelancerProfile, useUpdateFreelancerProfile } from '../services/freelancerHooks';

const Section = ({ icon: Icon, title, description, children }) => (
  <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
    <div className="flex items-start gap-4 mb-6">
      <div className="p-3 rounded-xl bg-accent-light text-accent-dark">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-display font-bold text-xl text-brand-900">{title}</h3>
        <p className="text-sm text-ink-secondary mt-1">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

const Toggle = ({ label, description, checked, onChange }) => (
  <label className="flex items-center justify-between gap-4 rounded-xl border border-border p-4">
    <div>
      <p className="font-body font-bold text-ink-primary">{label}</p>
      <p className="text-xs text-ink-secondary mt-1">{description}</p>
    </div>
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-[#4C1D95]" />
  </label>
);

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { data: profile } = useFreelancerProfile();
  const updateProfile = useUpdateFreelancerProfile();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    headline: '',
    bio: '',
  });

  React.useEffect(() => {
    if (user || profile) {
      setForm(prev => ({
        ...prev,
        firstName: user?.firstName || profile?.firstName || '',
        lastName: user?.lastName || profile?.lastName || '',
        email: user?.email || profile?.email || '',
        headline: profile?.headline || '',
        bio: profile?.bio || '',
      }));
    }
  }, [user, profile]);
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
    privacy: true,
  });

  const save = () => {
    updateProfile.mutate(form, { onSuccess: () => window.scrollTo({ top: 0, behavior: 'smooth' }) });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light rounded-xl"><User className="w-6 h-6 text-accent DEFAULT" /></div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Settings</h1>
          </div>
          <p className="text-ink-secondary">Manage profile, security, devices, notification preferences, and privacy.</p>
        </div>
      </div>

      <div className="space-y-6">
        <Section icon={User} title="Profile settings" description="Update the public-facing details clients see when evaluating your work.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block text-sm">
              <span className="font-bold text-ink-primary">First name</span>
              <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="mt-2 w-full rounded-xl border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-900" />
            </label>
            <label className="block text-sm">
              <span className="font-bold text-ink-primary">Last name</span>
              <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="mt-2 w-full rounded-xl border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-900" />
            </label>
            <label className="block md:col-span-2 text-sm">
              <span className="font-bold text-ink-primary">Professional headline</span>
              <input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} className="mt-2 w-full rounded-xl border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-900" />
            </label>
            <label className="block md:col-span-2 text-sm">
              <span className="font-bold text-ink-primary">Bio</span>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={5} className="mt-2 w-full rounded-xl border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-900" />
            </label>
          </div>
          <div className="flex justify-end mt-5">
            <button disabled={updateProfile.isPending} onClick={save} className="rounded-xl bg-brand-900 px-5 py-2.5 text-sm font-bold text-white inline-flex items-center gap-2 disabled:opacity-50">
              <Save className="w-4 h-4" /> Save profile
            </button>
          </div>
        </Section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section icon={Lock} title="Password" description="Change your password and keep your account secure.">
            <div className="space-y-4">
              <label className="block text-sm">
                <span className="font-bold text-ink-primary">Current password</span>
                <input type="password" className="mt-2 w-full rounded-xl border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-900" />
              </label>
              <label className="block text-sm">
                <span className="font-bold text-ink-primary">New password</span>
                <input type="password" className="mt-2 w-full rounded-xl border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-900" />
              </label>
              <button className="rounded-xl border border-brand-900 px-5 py-2.5 text-sm font-bold text-brand-900">Update password</button>
            </div>
          </Section>

          <Section icon={ShieldCheck} title="Two-factor authentication" description="Add an extra verification layer for sign-ins and sensitive actions.">
            <div className="rounded-xl bg-surface-soft border border-border p-4 space-y-3">
              <p className="text-sm text-ink-secondary">2FA is currently {profile?.twoFactorEnabled ? 'enabled' : 'not enabled'}.</p>
              <button className="rounded-xl bg-brand-900 px-4 py-2 text-sm font-bold text-white">
                {profile?.twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
              </button>
            </div>
          </Section>
        </div>

        <Section icon={Laptop} title="Devices" description="Review active sessions and revoke devices you no longer use.">
          <div className="space-y-3">
            {[1, 2].map((device) => (
              <div key={device} className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-border p-4">
                <div>
                  <p className="font-bold text-ink-primary">Chrome on macOS</p>
                  <p className="text-xs text-ink-secondary">Last active {device === 1 ? 'just now' : '3 days ago'} · Nairobi, Kenya</p>
                </div>
                {device === 1 && <span className="rounded-full bg-accent-light text-accent-dark px-2.5 py-1 text-xs font-bold">Current device</span>}
                {device !== 1 && <button className="text-sm font-bold text-danger">Revoke</button>}
              </div>
            ))}
          </div>
        </Section>

        <Section icon={Bell} title="Notification preferences" description="Choose how and when ForteSpace contacts you.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Toggle label="Email notifications" description="Receive contract, proposal, and payment updates." checked={preferences.email} onChange={(email) => setPreferences({ ...preferences, email })} />
            <Toggle label="Push notifications" description="Get instant workspace alerts." checked={preferences.push} onChange={(push) => setPreferences({ ...preferences, push })} />
            <Toggle label="SMS alerts" description="Receive withdrawal and security alerts." checked={preferences.sms} onChange={(sms) => setPreferences({ ...preferences, sms })} />
            <Toggle label="Marketing emails" description="Product updates and growth opportunities." checked={preferences.marketing} onChange={(marketing) => setPreferences({ ...preferences, marketing })} />
          </div>
        </Section>

        <Section icon={Eye} title="Privacy" description="Control profile visibility and data sharing settings.">
          <div className="space-y-3">
            <Toggle label="Public profile visibility" description="Allow clients to discover and view your profile." checked={preferences.privacy} onChange={(privacy) => setPreferences({ ...preferences, privacy })} />
            <Toggle label="Show earnings insights" description="Display verified earning milestones on your profile." checked={false} onChange={() => {}} />
            <button className="rounded-xl border border-border px-5 py-2.5 text-sm font-bold text-ink-primary">Download my data</button>
          </div>
        </Section>

        <Section icon={KeyRound} title="API keys and webhooks" description="Manage developer access for integrations and automation.">
          <div className="rounded-xl border border-border p-4 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-ink-primary">Production API key</p>
                <p className="text-xs text-ink-secondary">Last rotated 30 days ago</p>
              </div>
              <button className="rounded-xl border border-border px-3 py-2 text-xs font-bold">Rotate key</button>
            </div>
            <div className="rounded-lg bg-surface-soft p-3 text-xs text-ink-secondary">
              Webhook endpoint: <span className="font-mono">https://api.example.com/fortespace/webhooks</span>
            </div>
          </div>
        </Section>
      </div>

      <AnimatePresence>
        {updateProfile.isPending && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="fixed bottom-6 right-6 z-50 rounded-xl bg-accent-dark px-4 py-3 text-sm font-bold text-white inline-flex items-center gap-2">
            <Check className="w-4 h-4" /> Saving settings...
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
