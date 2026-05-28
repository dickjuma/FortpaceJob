import React from 'react';
import { 
  Shield, 
  Activity, 
  Lock, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Settings,
  History
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { ADMIN_ROLES, MODULE_PERMISSIONS } from '../../../config/users/userRoleConfig';

const PermissionGroup = ({ module, permissions, userPermissions }) => (
  <div className="space-y-4">
    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{module}</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {permissions.map(perm => {
        const hasAccess = userPermissions.includes(perm.id);
        return (
          <div 
            key={perm.id} 
            className={cn(
              "flex items-center justify-between p-3 rounded-xl border transition-all",
              hasAccess 
                ? "border-emerald-100 bg-emerald-50/30 dark:border-emerald-900/30 dark:bg-emerald-950/10" 
                : "border-zinc-100 bg-surface/50 dark:border-zinc-800 dark:bg-surface-dark/30 opacity-60"
            )}
          >
            <span className={cn("text-xs font-bold", hasAccess ? "text-emerald-700 dark:text-success" : "text-zinc-500")}>
              {perm.label}
            </span>
            {hasAccess ? (
              <CheckCircle2 size={14} className="text-success" />
            ) : (
              <XCircle size={14} className="text-zinc-300" />
            )}
          </div>
        );
      })}
    </div>
  </div>
);

/**
 * Detailed Overview panel for Internal Admin profiles.
 */
const AdminProfilePanel = ({ user, activeTab }) => {
  const roleConfig = ADMIN_ROLES[user.role];
  
  if (activeTab === 'permissions') {
    const groupedPermissions = MODULE_PERMISSIONS.reduce((acc, perm) => {
      if (!acc[perm.module]) acc[perm.module] = [];
      acc[perm.module].push(perm);
      return acc;
    }, {});

    return (
      <div className="space-y-8 animate-in fade-in slide-up duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Access Control</h3>
            <p className="text-zinc-500 font-medium text-xs mt-1">Granular module permissions for this staff account.</p>
          </div>
          <button className="px-4 py-2 bg-surface-dark text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-600 transition-all">
            Modify Permissions
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {Object.entries(groupedPermissions).map(([module, perms]) => (
            <PermissionGroup 
              key={module} 
              module={module} 
              permissions={perms} 
              userPermissions={user.permissions || []} 
            />
          ))}
        </div>
      </div>
    );
  }

  if (activeTab !== 'overview') return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Role & Summary */}
      <div className="lg:col-span-2 space-y-8">
        <Card>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-surface dark:bg-zinc-800 text-zinc-400">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">Internal Role</h3>
                <p className="text-xs font-bold text-zinc-500">System Governance & Operations</p>
              </div>
            </div>
            <Badge variant="brand" className="px-4 py-1.5">{roleConfig?.label}</Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Access Level</p>
              <p className="text-2xl font-black text-zinc-900 dark:text-white">Tier {roleConfig?.level || 1}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Active Perma-id</p>
              <p className="text-2xl font-black text-brand-600 truncate">{user.id.split('-')[1]}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Account State</p>
              <p className="text-2xl font-black text-success">Secured</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-8">
            <div className="p-1.5 rounded-lg bg-surface dark:bg-zinc-800 text-zinc-400">
              <History size={16} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">Recent Governance Actions</h3>
          </div>
          <div className="space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-surface/50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/50">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 bg-white dark:bg-surface-dark rounded-xl flex items-center justify-center text-brand-600 shadow-sm border border-zinc-100 dark:border-zinc-800">
                        <ActivityIcon size={20} />
                     </div>
                     <div>
                        <p className="text-xs font-black text-zinc-900 dark:text-white">{user.lastAction}</p>
                        <p className="text-[10px] font-bold text-zinc-500">Target User: USR-100{42 + i}</p>
                     </div>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">2h ago</span>
               </div>
             ))}
          </div>
        </Card>
      </div>

      {/* Right: Security & Metrics */}
      <div className="space-y-8">
        <Card>
           <div className="flex items-center gap-2 mb-6">
              <Activity size={16} className="text-zinc-400" />
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white">Operational Metrics</h3>
           </div>
           <div className="space-y-6">
              <div>
                 <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Daily Quota Usage</span>
                    <span className="text-[10px] font-black text-zinc-900 dark:text-white">{user.actionsToday} / 500</span>
                 </div>
                 <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(user.actionsToday / 500) * 100}%` }} />
                 </div>
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                 <span className="text-zinc-500">Total System Logins</span>
                 <span className="text-zinc-900 dark:text-white">{user.loginCount}</span>
              </div>
           </div>
        </Card>

        <Card className="bg-surface-dark text-white border-none shadow-xl shadow-zinc-900/20">
           <div className="flex items-center gap-2 mb-6">
              <Lock size={16} className="text-brand-400" />
              <h3 className="text-xs font-black uppercase tracking-widest text-brand-400">Security Credentials</h3>
           </div>
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <span className="text-[10px] font-bold text-zinc-400">2FA Status</span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-success">Active</span>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-[10px] font-bold text-zinc-400">Hardware Key</span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-success">Enrolled</span>
              </div>
              <div className="h-px bg-white/10 my-2" />
              <button className="w-full h-11 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-[9px] font-black uppercase tracking-widest">
                 Reset Password
              </button>
              <button className="w-full h-11 rounded-xl bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all">
                 Deactivate Staff
              </button>
           </div>
        </Card>
      </div>
    </div>
  );
};

const ActivityIcon = ({ size }) => <Activity size={size} />;

export default AdminProfilePanel;
