import React from 'react';
import { 
  Download, 
  History, 
  Search, 
  Filter, 
  User as UserIcon, 
  Shield, 
  Activity, 
  MapPin, 
  Globe 
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import Card from '../../../components/ui/Card';
import UserAvatar from '../shared/UserAvatar';
import Skeleton from '../../../components/ui/Skeleton';
import { format, parseISO } from 'date-fns';

const AUDIT_DATA = [
  { id: 1, action: 'Account Suspended', performer: 'Otieno Kamau', role: 'Super Admin', date: '2024-05-01T10:30:00Z', ip: '197.232.12.42', location: 'Nairobi, KE', details: 'Manual suspension due to fraud investigation #FI-402.' },
  { id: 2, action: 'KYC Document Rejected', performer: 'Wanjiru Mwangi', role: 'Moderator', date: '2024-04-28T14:15:00Z', ip: '41.80.201.5', location: 'Mombasa, KE', details: 'ID Front blurry and illegible. Requested resubmission.' },
  { id: 3, action: 'Wallet Unfrozen', performer: 'Kamau Njoroge', role: 'Finance Admin', date: '2024-04-25T09:00:00Z', ip: '197.136.2.14', location: 'Nairobi, KE', details: 'Dispute resolved in favor of the freelancer. Funds released.' },
  { id: 4, action: 'Profile Bio Updated', performer: 'Self', role: 'User', date: '2024-04-20T16:45:00Z', ip: '105.163.22.108', location: 'Kisumu, KE', details: 'Updated professional summary and skills list.' },
  { id: 5, action: 'Login Successful', performer: 'Self', role: 'User', date: '2024-04-20T16:40:00Z', ip: '105.163.22.108', location: 'Kisumu, KE', details: 'Login via Chrome on MacOS.' },
];

/**
 * A comprehensive, immutable audit log for a specific user account.
 */
const ProfileAuditTab = ({ user }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-up duration-500">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-surface-dark border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search size={18} className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search audit events..." 
            className="w-full h-12 pl-12 pr-4 bg-surface dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm font-medium outline-none focus:border-brand-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 h-12 bg-surface dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">
            <Filter size={16} />
            Filter Type
          </button>
          <button className="flex items-center gap-2 px-6 h-12 bg-surface-dark text-white border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-600 transition-all shadow-lg shadow-zinc-900/10">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Timeline Table */}
      <div className="bg-white dark:bg-surface-dark border border-zinc-100 dark:border-zinc-800 rounded-[40px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface/50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
              <th className="pl-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Timestamp</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Governance Action</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Performed By</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Meta & Location</th>
              <th className="pr-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {AUDIT_DATA.map((item) => (
              <tr key={item.id} className="group hover:bg-surface/50 dark:hover:bg-zinc-800/20 transition-all">
                <td className="pl-8 py-5">
                   <div className="flex flex-col">
                      <span className="text-xs font-black text-zinc-900 dark:text-white">
                         {format(parseISO(item.date), 'MMM dd, yyyy')}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400">
                         {format(parseISO(item.date), 'HH:mm:ss')}
                      </span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className={cn(
                     "inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                     item.action.includes('Suspended') || item.action.includes('Rejected') 
                       ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20" 
                       : "bg-emerald-50 text-success dark:bg-emerald-950/20"
                   )}>
                      {item.action}
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                      {item.performer === 'Self' ? (
                        <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                           <UserIcon size={14} />
                        </div>
                      ) : (
                        <UserAvatar name={item.performer} size="sm" />
                      )}
                      <div>
                         <p className="text-xs font-black text-zinc-900 dark:text-white">{item.performer}</p>
                         <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">{item.role}</p>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500">
                         <Globe size={12} className="text-zinc-300" />
                         {item.ip}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500">
                         <MapPin size={12} className="text-zinc-300" />
                         {item.location}
                      </div>
                   </div>
                </td>
                <td className="pr-8 py-5 min-w-[300px]">
                   <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                      "{item.details}"
                   </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfileAuditTab;
