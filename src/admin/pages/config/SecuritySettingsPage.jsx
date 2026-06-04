import React from 'react';
import { 
  ShieldCheck, Lock, Eye, EyeOff, 
  Smartphone, ShieldAlert, Key, Globe, RefreshCw, Save, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';
import { Activity } from 'lucide-react';
import AuditLogViewer from '../../components/audit/AuditLogViewer';
import { useSecuritySettings } from '../../hooks/useSettings';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { unwrapAdminResponse } from '../../api/apiClient';
import { SuccessOverlay } from '../../components/ui/AdminModals';

export default function SecuritySettingsPage() {
  const queryClient = useQueryClient();
  const { securitySettings, updateSecuritySettings, isUpdating } = useSecuritySettings();
  const [activeTab, setActiveTab] = React.useState('policy');
  const [successMsg, setSuccessMsg] = React.useState(null);

  const handleMfaToggle = (e) => {
    updateSecuritySettings({ ...securitySettings, mfaRequired: e.target.checked });
  };

  const handleSessionTimeoutChange = (e) => {
    updateSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value });
  };

  const rotateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/settings/security/rotate-api-key');
      return unwrapAdminResponse(res).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'security'] });
      setSuccessMsg('API key rotated successfully. Update all integrations with the new key.');
      toast.success('API key rotated.');
    },
    onError: (e) => toast.error(e?.message || 'Failed to rotate API key.'),
  });

  const handleSave = () => {
    updateSecuritySettings(securitySettings);
    setSuccessMsg('Security policies saved successfully.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-surface-dark text-white rounded-2xl shadow-xl">
            <Lock size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">System Security Policy</h1>
            <p className="text-sm text-zinc-500 font-medium">Configure global security protocols and access controls.</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button 
              onClick={() => setActiveTab(activeTab === 'policy' ? 'audit' : 'policy')}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2",
                activeTab === 'audit' ? "bg-surface-dark text-white dark:bg-[#2bb75c]" : "bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-surface"
              )}
           >
              <Activity size={16} /> {activeTab === 'policy' ? 'Security Audit' : 'Policy Editor'}
           </button>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <AuditLogViewer 
             moduleFilter="AUTH,SECURITY" 
             title="Access & Security Logs"
             description="Monitoring administrative logins, policy changes, and security breaches."
           />
        </div>
      ) : (
        <div className="space-y-6">
        <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-6">Authentication Controls</h3>
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200">Force Multi-Factor Authentication (MFA)</p>
                  <p className="text-xs text-zinc-500">Require all administrative accounts to use 2FA.</p>
                </div>
                <label className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-200 dark:bg-zinc-700 transition-colors cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={securitySettings?.mfaRequired ?? true}
                    onChange={handleMfaToggle}
                    className="sr-only"
                  />
                  <span className={cn(
                    "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm",
                    securitySettings?.mfaRequired ?? true ? "translate-x-6" : "translate-x-1"
                  )} />
                </label>
             </div>
             <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200">Session Timeout</p>
                  <p className="text-xs text-zinc-500">Automatically logout inactive admins after X minutes.</p>
                </div>
                <select 
                  value={securitySettings?.sessionTimeout || '30'}
                  onChange={handleSessionTimeoutChange}
                  className="bg-surface dark:bg-zinc-800 border-none rounded-xl px-4 py-2 text-xs font-bold outline-none"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">1 Hour</option>
                </select>
             </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-6">API & Access Tokens</h3>
          <div className="space-y-4">
             <div className="p-4 bg-surface dark:bg-zinc-800 rounded-2xl flex items-center justify-between border border-dashed border-zinc-300 dark:border-zinc-700">
                <div className="flex items-center gap-3">
                   <Key size={20} className="text-zinc-400" />
                   <div>
                      <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Master API Key</p>
                      <p className="text-sm font-mono font-bold text-zinc-600 dark:text-zinc-300">
                        {securitySettings?.apiKey ? `${securitySettings.apiKey.substring(0, 20)}********` : 'Not configured'}
                      </p>
                   </div>
                </div>
                 <button onClick={() => rotateMutation.mutate()} disabled={rotateMutation.isPending} className="p-2 text-[#2bb75c] hover:bg-[#2bb75c]/5 rounded-xl transition-colors disabled:opacity-50">
                    {rotateMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                 </button>
             </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={isUpdating}
          className="w-full py-4 bg-surface-dark text-white dark:bg-[#2bb75c] rounded-2xl font-black text-sm shadow-xl hover:bg-zinc-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isUpdating ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Save size={16} /> Save Security Changes</>}
        </button>
        {successMsg && <SuccessOverlay isOpen message={successMsg} onClose={() => setSuccessMsg(null)} />}
        </div>
      )}
    </div>
  );
}

