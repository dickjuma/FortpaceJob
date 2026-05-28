import React, { useState } from 'react';
import { 
  Bell, Mail, MessageSquare, ShieldCheck, Clock, Zap, ToggleLeft, ToggleRight, Save, Shield
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

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

  const togglePreference = (key) => {
    setPreferences(prev => {
      const updatedVal = !prev[key];
      toast.success(`Notification preference updated!`);
      return { ...prev, [key]: updatedVal };
    });
  };

  const handleSave = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: 'Syncing notification configurations...',
        success: 'Preferences successfully synced to profile! 🔔',
        error: 'Failed to sync preferences.'
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Bell className="w-8 h-8 text-accent-purple animate-swing" />
            Notification Preferences
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Customize how and when you receive job updates, messaging alerts, and billing notifications.
          </p>
        </div>
        <Button 
          variant="primary" 
          icon={<Save size={18} />}
          onClick={handleSave}
        >
          Save Preferences
        </Button>
      </div>

      <div className="space-y-6">
        
        {/* Email Alerts Section */}
        <Card className="bg-white border border-border p-6 rounded-2xl shadow-sm">
          <h3 className="text-base font-black text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
            <Mail className="w-5 h-5 text-accent-purple" />
            Email Communications
          </h3>
          
          <div className="space-y-4">
            {[
              { key: 'emailJobs', label: 'New Job Recommendations', desc: 'Receive custom digest recommendations aligning with your skill tags.' },
              { key: 'emailInbox', label: 'Direct Messages & Inquiries', desc: 'Get email summaries when clients message you while you are offline.' },
              { key: 'emailContracts', label: 'Milestone & Order Updates', desc: 'Stay updated when a client funds a milestone or requests a revision.' }
            ].map(pref => (
              <div key={pref.key} className="flex items-start justify-between gap-4 p-2.5 rounded-xl hover:bg-light-gray/20 transition-all">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-text-primary">{pref.label}</p>
                  <p className="text-xs text-text-secondary font-medium leading-relaxed max-w-xl">{pref.desc}</p>
                </div>
                <button onClick={() => togglePreference(pref.key)} className="focus:outline-none">
                  {preferences[pref.key] ? (
                    <ToggleRight className="w-8 h-8 text-accent-purple" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-text-secondary" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Real-time Push Section */}
        <Card className="bg-white border border-border p-6 rounded-2xl shadow-sm">
          <h3 className="text-base font-black text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
            <Bell className="w-5 h-5 text-accent-purple" />
            Push notifications
          </h3>
          
          <div className="space-y-4">
            {[
              { key: 'pushInbox', label: 'Inbox Presence Alerts', desc: 'Instant desktop push alert when a potential client messages you.' },
              { key: 'pushContracts', label: 'Real-time Contract Milestones', desc: 'Receive immediate alerts when client deposits or releases escrow.' }
            ].map(pref => (
              <div key={pref.key} className="flex items-start justify-between gap-4 p-2.5 rounded-xl hover:bg-light-gray/20 transition-all">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-text-primary">{pref.label}</p>
                  <p className="text-xs text-text-secondary font-medium leading-relaxed max-w-xl">{pref.desc}</p>
                </div>
                <button onClick={() => togglePreference(pref.key)} className="focus:outline-none">
                  {preferences[pref.key] ? (
                    <ToggleRight className="w-8 h-8 text-accent-purple" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-text-secondary" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Security & System Section */}
        <Card className="bg-white border border-border p-6 rounded-2xl shadow-sm">
          <h3 className="text-base font-black text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
            <Shield className="w-5 h-5 text-accent-purple" />
            Security & Login Verification
          </h3>
          
          <div className="space-y-4">
            {[
              { key: 'smsAlerts', label: 'SMS Critical Notifications', desc: 'Send SMS messages to your registered phone number for secure transaction releases.' },
              { key: 'securityMfa', label: 'Two-Factor Authentication OTP Verification', desc: 'Require authentication codes sent to email/SMS for every administrative console session login.' }
            ].map(pref => (
              <div key={pref.key} className="flex items-start justify-between gap-4 p-2.5 rounded-xl hover:bg-light-gray/20 transition-all">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-text-primary">{pref.label}</p>
                  <p className="text-xs text-text-secondary font-medium leading-relaxed max-w-xl">{pref.desc}</p>
                </div>
                <button onClick={() => togglePreference(pref.key)} className="focus:outline-none">
                  {preferences[pref.key] ? (
                    <ToggleRight className="w-8 h-8 text-accent-purple" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-text-secondary" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
}
