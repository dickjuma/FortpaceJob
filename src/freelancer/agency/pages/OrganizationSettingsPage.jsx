import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Palette, ShieldCheck, Users, DollarSign, KeyRound, Webhook, Save, Upload } from 'lucide-react';
import { useAgencySettings } from '../services/agencyHooks';

const Section = ({ icon: Icon, title, description, children }) => (
  <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
    <div className="flex items-start gap-4 mb-5">
      <div className="p-3 rounded-xl bg-[#4C1D95]/10 text-[#4C1D95]"><Icon className="w-5 h-5" /></div>
      <div>
        <h3 className="font-display font-bold text-xl text-brand-900">{title}</h3>
        <p className="text-sm text-ink-secondary mt-1">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

export default function OrganizationSettingsPage() {
  const { data, isLoading } = useAgencySettings();
  const settings = data || {
    companyName: 'Acme Digital Agency',
    billingEmail: 'billing@acmeagency.com',
    sso: 'Enabled',
    apiKeys: 2,
    webhooks: 3,
  };
  const [form, setForm] = useState(settings);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#4C1D95]/10 rounded-xl"><Building2 className="w-6 h-6 text-[#4C1D95]" /></div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Organization settings</h1>
          </div>
          <p className="text-ink-secondary">Configure company profile, branding, security, policies, billing, SSO, API keys, and webhooks.</p>
        </div>
        <button className="rounded-xl bg-[#4C1D95] px-5 py-2.5 text-sm font-bold text-white inline-flex items-center gap-2"><Save className="w-4 h-4" /> Save settings</button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-40 rounded-2xl bg-surface-muted animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-6">
          <Section icon={Building2} title="Company profile" description="Core organization details used across contracts and invoices.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block text-sm"><span className="font-bold text-ink-primary">Company name</span><input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="mt-2 w-full rounded-xl border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-900" /></label>
              <label className="block text-sm"><span className="font-bold text-ink-primary">Billing email</span><input value={form.billingEmail} onChange={(e) => setForm({ ...form, billingEmail: e.target.value })} className="mt-2 w-full rounded-xl border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-900" /></label>
            </div>
          </Section>

          <Section icon={Palette} title="Branding" description="Upload logo, brand colors, and public agency presentation assets.">
            <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center">
              <Upload className="w-8 h-8 text-ink-tertiary mx-auto mb-3" />
              <p className="font-bold text-ink-primary">Upload brand kit</p>
              <p className="text-sm text-ink-secondary mt-1">Logo, color palette, and media guidelines</p>
            </div>
          </Section>

          <Section icon={ShieldCheck} title="Security policies" description="Control password, 2FA, session, and data access policies.">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['Require 2FA', 'Enforce SSO', 'Session timeout'].map((policy) => (
                <label key={policy} className="rounded-xl border border-border p-4 flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#4C1D95]" />
                  <span className="font-bold text-ink-primary text-sm">{policy}</span>
                </label>
              ))}
            </div>
          </Section>

          <Section icon={Users} title="Team policies" description="Define onboarding, offboarding, and role assignment rules.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block text-sm"><span className="font-bold text-ink-primary">Default role</span><select className="mt-2 w-full rounded-xl border border-border px-3 py-2"><option>Member</option><option>Manager</option><option>Viewer</option></select></label>
              <label className="block text-sm"><span className="font-bold text-ink-primary">Approval required</span><select className="mt-2 w-full rounded-xl border border-border px-3 py-2"><option>Yes</option><option>No</option></select></label>
            </div>
          </Section>

          <Section icon={DollarSign} title="Billing preferences" description="Manage payout methods, invoice recipients, and billing cycles.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block text-sm"><span className="font-bold text-ink-primary">Billing cycle</span><select className="mt-2 w-full rounded-xl border border-border px-3 py-2"><option>Monthly</option><option>Quarterly</option></select></label>
              <label className="block text-sm"><span className="font-bold text-ink-primary">Currency</span><select className="mt-2 w-full rounded-xl border border-border px-3 py-2"><option>USD</option><option>KES</option><option>EUR</option></select></label>
            </div>
          </Section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section icon={KeyRound} title="API keys" description="Manage secure integration access.">
              <p className="text-sm text-ink-secondary mb-3">{form.apiKeys} active API keys</p>
              <button className="rounded-xl border border-border px-4 py-2 text-sm font-bold text-ink-primary">Create API key</button>
            </Section>
            <Section icon={Webhook} title="Webhooks" description="Receive event notifications for agency workflows.">
              <p className="text-sm text-ink-secondary mb-3">{form.webhooks} active webhook endpoints</p>
              <button className="rounded-xl border border-border px-4 py-2 text-sm font-bold text-ink-primary">Manage webhooks</button>
            </Section>
          </div>

          <Section icon={ShieldCheck} title="SSO configuration" description="Configure identity provider settings for enterprise login.">
            <div className="rounded-xl bg-surface-soft border border-border p-4">
              <p className="text-sm text-ink-secondary">Current SSO status: <span className="font-bold text-success">{form.sso}</span></p>
              <button className="mt-4 rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-bold text-white">Configure SSO</button>
            </div>
          </Section>
        </div>
      )}
    </motion.div>
  );
}
