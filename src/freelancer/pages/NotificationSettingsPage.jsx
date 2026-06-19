// src/pages/freelancer/NotificationSettingsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Mail, MessageSquare, ShieldCheck, Clock, Zap,
  ToggleLeft, ToggleRight, Save, Shield, Check
} from 'lucide-react';
import { useUpdateFreelancerSettings } from '../services/freelancerHooks';

export default function NotificationSettingsPage() {
  const [preferences, setPreferences] = useState({
    emailJobs: true,
    emailInbox: true,
    emailContracts: true,
    pushInbox: true,
    pushContracts: false,
    smsAlerts: false,
    securityMfa: true
  });
  const [showSuccess, setShowSuccess] = useState(null);
  const updateSettings = useUpdateFreelancerSettings();

  const togglePreference = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    setShowSuccess({ message: 'Preference updated' });
    setTimeout(() => setShowSuccess(null), 1500);
  };

  const handleSave = () => {
    updateSettings.mutate({ notifications: preferences }, {
      onSuccess: () => {
        setShowSuccess({ message: 'Preferences saved successfully' });
        setTimeout(() => setShowSuccess(null), 2000);
      }
    });
  };

  const PreferenceRow = ({ title, description, isEnabled, onToggle }) => (
    <div className="flex items-start justify-between gap-4 p-3 rounded-xl hover:bg-surface-soft transition-all">
      <div>
        <p className="text-sm font-body font-semibold text-ink-primary">{title}</p>
        <p className="text-xs font-body text-ink-tertiary leading-relaxed max-w-xl">{description}</p>
      </div>
      <button onClick={onToggle} className="focus:outline-none focus:ring-2 focus:ring-brand-900 rounded-full">
        {isEnabled ? (
          <ToggleRight className="w-7 h-7 text-accent DEFAULT" />
        ) : (
          <ToggleLeft className="w-7 h-7 text-ink-tertiary" />
        )}
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light rounded-xl">
              <Bell className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Notification preferences</h1>
          </div>
          <p className="text-ink-secondary font-body">
            Customize how and when you receive job updates, messages, and billing notifications
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors inline-flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save preferences
        </button>
      </div>

      <div className="space-y-5">

        {/* Email Alerts Section */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <Mail className="w-5 h-5 text-accent DEFAULT" />
            <h3 className="font-body font-semibold text-base text-ink-primary">Email communications</h3>
          </div>

          <div className="space-y-2">
            <PreferenceRow
              title="New job recommendations"
              description="Receive digest recommendations matching your skills"
              isEnabled={preferences.emailJobs}
              onToggle={() => togglePreference('emailJobs')}
            />
            <PreferenceRow
              title="Direct messages & inquiries"
              description="Get email summaries when clients message you"
              isEnabled={preferences.emailInbox}
              onToggle={() => togglePreference('emailInbox')}
            />
            <PreferenceRow
              title="Milestone & order updates"
              description="Stay updated when a client funds a milestone or requests a revision"
              isEnabled={preferences.emailContracts}
              onToggle={() => togglePreference('emailContracts')}
            />
          </div>
        </div>

        {/* Push Notifications Section */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <Bell className="w-5 h-5 text-accent DEFAULT" />
            <h3 className="font-body font-semibold text-base text-ink-primary">Push notifications</h3>
          </div>

          <div className="space-y-2">
            <PreferenceRow
              title="Inbox presence alerts"
              description="Desktop push alert when a client messages you"
              isEnabled={preferences.pushInbox}
              onToggle={() => togglePreference('pushInbox')}
            />
            <PreferenceRow
              title="Real-time contract milestones"
              description="Alerts when client deposits or releases escrow"
              isEnabled={preferences.pushContracts}
              onToggle={() => togglePreference('pushContracts')}
            />
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <Shield className="w-5 h-5 text-accent DEFAULT" />
            <h3 className="font-body font-semibold text-base text-ink-primary">Security & verification</h3>
          </div>

          <div className="space-y-2">
            <PreferenceRow
              title="SMS critical notifications"
              description="Send SMS for secure transaction releases"
              isEnabled={preferences.smsAlerts}
              onToggle={() => togglePreference('smsAlerts')}
            />
            <PreferenceRow
              title="Two-factor authentication"
              description="Require OTP for administrative console sessions"
              isEnabled={preferences.securityMfa}
              onToggle={() => togglePreference('securityMfa')}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
