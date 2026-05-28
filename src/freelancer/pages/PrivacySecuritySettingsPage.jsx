import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Key, Globe, LogOut, CheckCircle2, X, Plus, AlertTriangle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

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

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters!');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password verification mismatch!');
      return;
    }

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Syncing new password hashes...',
        success: 'Account security password updated successfully! 🔒',
        error: 'Failed to update password.'
      }
    );
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleToggleMfa = () => {
    setMfaEnabled(!mfaEnabled);
    toast.success(`Multi-Factor Authentication (MFA) is now ${!mfaEnabled ? 'Enabled' : 'Disabled'}`);
  };

  const revokeSession = (id, device) => {
    setSessions(sessions.filter(s => s.id !== id));
    toast.success(`Session terminated: ${device}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-accent-purple" />
            Security Configurations
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Enforce multi-factor authorization, update credentials, and review online active browser sessions.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Change Password Card */}
        <Card className="bg-white border border-border p-6 rounded-2xl shadow-sm">
          <h3 className="text-base font-black text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
            <Key className="w-5 h-5 text-accent-purple" />
            Update Password
          </h3>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1.5">Current Password</label>
              <input 
                type="password" 
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full max-w-md px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-accent-purple text-sm text-text-primary"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1.5">New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-accent-purple text-sm text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1.5">Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-accent-purple text-sm text-text-primary"
                  required
                />
              </div>
            </div>
            <Button type="submit" variant="primary" className="mt-4">Update Password</Button>
          </form>
        </Card>

        {/* 2FA Option Panel */}
        <Card className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h3 className="text-base font-black text-text-primary flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-accent-purple animate-pulse" />
              Two-Factor Authentication (2FA)
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed font-medium max-w-xl">
              Add a layer of security by requiring a verification code sent to your registered contact channel for every login session block.
            </p>
          </div>
          <button 
            onClick={handleToggleMfa}
            className={cn(
              "px-6 py-2.5 font-bold rounded-xl text-xs shadow-sm transition-all border shrink-0",
              mfaEnabled 
                ? "bg-accent-purple/15 border-accent-purple/30 text-accent-purple" 
                : "bg-light-gray border-border text-text-secondary"
            )}
          >
            {mfaEnabled ? 'Enabled (Active)' : 'Disabled'}
          </button>
        </Card>

        {/* Active Sessions */}
        <Card className="bg-white border border-border p-6 rounded-2xl shadow-sm">
          <h3 className="text-base font-black text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
            <Globe className="w-5 h-5 text-accent-purple" />
            Active Online Sessions
          </h3>

          <div className="space-y-4">
            {sessions.map(sess => (
              <div key={sess.id} className="p-4 border border-border/80 rounded-2xl bg-light-gray/25 hover:bg-white hover:shadow-sm transition-all flex justify-between items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-text-primary">{sess.device}</span>
                    {sess.active && (
                      <span className="px-2 py-0.5 rounded bg-success/15 border border-success/20 text-success text-[9px] font-black uppercase tracking-wider">Current Session</span>
                    )}
                  </div>
                  <p className="text-[10px] text-text-secondary font-black uppercase tracking-wider">IP: {sess.ip} • Location: {sess.location}</p>
                </div>
                {!sess.active && (
                  <button 
                    onClick={() => revokeSession(sess.id, sess.device)}
                    className="p-2 text-text-secondary hover:text-accent-red hover:bg-light-gray rounded-xl transition-all"
                    title="Terminate Session"
                  >
                    <LogOut size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
}
