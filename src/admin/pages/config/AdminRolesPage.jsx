import React from 'react';
import { 
  Shield, UserCheck, Search, Plus, 
  MoreVertical, CheckCircle2, ShieldAlert, Users, Layout
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

const ROLES = [
  { id: '1', name: 'Super Admin', users: 2, permissions: 'All Access', status: 'active' },
  { id: '2', name: 'Finance Manager', users: 5, permissions: 'Ledger, Escrow, Payouts', status: 'active' },
  { id: '3', name: 'Moderator L1', users: 12, permissions: 'Chat, Marketplace Reports', status: 'active' },
  { id: '4', name: 'Support Agent', users: 24, permissions: 'View Only, Ticket Resolve', status: 'active' },
];

export default function AdminRolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-brand-500/10 text-brand-600 rounded-xl shadow-sm">
              <Shield size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Admin Roles & Permissions</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Define administrative roles, manage granular permissions, and assign staff accounts.
          </p>
        </div>
        <button 
          onClick={() => toast.success('Role creation panel opened')}
          className="px-5 py-2.5 bg-surface-dark text-white dark:bg-brand-600 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Create New Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ROLES.map(role => (
          <div key={role.id} className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-brand-500/30 transition-all">
             <div className="flex items-center justify-between mb-8">
                <div className="p-3 bg-brand-50 text-brand-500 rounded-2xl">
                   <UserCheck size={24} />
                </div>
                <button className="text-zinc-400 hover:text-zinc-900">
                   <MoreVertical size={18} />
                </button>
             </div>
             
             <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-2">{role.name}</h3>
             <div className="flex items-center gap-2 mb-6">
                <Users size={14} className="text-zinc-400" />
                <span className="text-xs font-bold text-zinc-500">{role.users} Active Admins</span>
             </div>

             <div className="space-y-3">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Scope</p>
                <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400 italic">
                   "{role.permissions}"
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <button 
                  onClick={() => toast.success(`Managing permissions for ${role.name}`)}
                  className="w-full py-2 bg-surface dark:bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 transition-colors"
                >
                  Edit Permissions
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
