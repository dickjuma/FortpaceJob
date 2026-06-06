// src/pages/freelancer/PrivacySecuritySettingsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, ShieldAlert, Key, Globe, LogOut, CheckCircle2, X, Plus, AlertTriangle, Check
} from 'lucide-react';

export default function PrivacySecuritySettingsPage() {
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome on macOS (10.15)', ip: '192.168.1.42', location: 'San Francisco, CA', active: true },
    { id: 2, device: 'Mobile Client (iOS 19)', ip: '10.0.0.12', location: 'Los Angeles, CA', active: false }
  ]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [showSuccess, setShowSuccess] = useState(null);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 8) {
      setShowSuccess({ message: 'Password must be at least 8 characters', isError: true });
      setTimeout(() => setShowSuccess(null), 2000);
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setShowSuccess({ message: 'Passwords do not match', isError: true });
      setTimeout(() => setShowSuccess(null), 2000);
      return;
    }

    setShowSuccess({ message: 'Password updated successfully' });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleToggleMfa = () => {
    setMfaEnabled(!mfaEnabled);
    setShowSuccess({ message: `2FA ${!mfaEnabled ? 'enabled' : 'disabled'}` });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const revokeSession = (id, device) => {
    setSessions(sessions.filter(s => s.id !== id));
    setShowSuccess({ message: `Session terminated: ${device}` });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success/Error Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2 ${
              showSuccess.isError ? 'bg-danger text-white' : 'bg-accent-dark text-white'
            }`}
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-accent-light rounded-xl">
            <ShieldCheck className="w-6 h-6 text-accent DEFAULT" />
          </div>
          <h1 className="font-display font-bold text-3xl text-brand-900">Security settings</h1>
        </div>
        <p className="text-ink-secondary font-body">Manage your account security, passwords, and active sessions</p>
      </div>

      <div className="space-y-6">

        {/* Change Password Card */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-border mb-5">
            <Key className="w-5 h-5 text-accent DEFAULT" />
            <h3 className="font-body font-semibold text-base text-ink-primary">Update password</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1.5">
                Current password
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full max-w-md h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
              <div>
                <label className="block text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1.5">
                  New password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1.5">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors"
            >
              Update password
            </button>
          </form>
        </div>

        {/* 2FA Card */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-accent DEFAULT" />
              <h3 className="font-body font-semibold text-base text-ink-primary">Two-factor authentication (2FA)</h3>
            </div>
            <p className="text-sm text-ink-secondary max-w-xl">
              Add an extra layer of security by requiring a verification code for each login
            </p>
          </div>
          <button
            onClick={handleToggleMfa}
            className={`px-5 py-2 rounded-lg text-sm font-body font-medium transition-colors ${
              mfaEnabled
                ? "bg-accent-light text-accent-dark border border-accent DEFAULT"
                : "bg-surface-muted text-ink-tertiary hover:text-ink-primary"
            }`}
          >
            {mfaEnabled ? 'Enabled ✓' : 'Disabled'}
          </button>
        </div>

        {/* Active Sessions */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-border mb-4">
            <Globe className="w-5 h-5 text-accent DEFAULT" />
            <h3 className="font-body font-semibold text-base text-ink-primary">Active sessions</h3>
          </div>

          <div className="space-y-3">
            {sessions.map((sess, idx) => (
              <motion.div
                key={sess.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 border border-border rounded-xl bg-surface-soft flex justify-between items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-body font-semibold text-sm text-ink-primary">{sess.device}</span>
                    {sess.active && (
                      <span className="px-2 py-0.5 rounded-full bg-accent-light text-accent-dark text-xs font-body font-medium">
                        Current session
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-tertiary">IP: {sess.ip} • Location: {sess.location}</p>
                </div>
                {!sess.active && (
                  <button
                    onClick={() => revokeSession(sess.id, sess.device)}
                    className="p-1.5 text-ink-tertiary hover:text-danger rounded-lg transition-colors"
                    title="Terminate session"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Security Tip */}
        <div className="bg-accent-light border border-accent DEFAULT rounded-xl p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-accent-dark shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-body font-semibold text-accent-dark mb-1">Security tip</h4>
              <p className="text-xs text-accent-dark">
                Always use a strong, unique password and enable 2FA for maximum account protection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
