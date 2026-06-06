import React from 'react';
import { Link } from 'react-router-dom';
import { getPublicProfileUrl } from '../../../utils/publicProfileLinks';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Eye, 
  ExternalLink, 
  Star,
  DollarSign,
  Briefcase,
  UserCheck,
  Activity
} from 'lucide-react';
import UserAvatar from '../shared/UserAvatar';
import StatusBadge from '../shared/StatusBadge';
import KycStatusBadge from '../shared/KycStatusBadge';
import VerificationBadge from '../shared/VerificationBadge';
import { formatCurrency } from '../../../utils/formatters';
import { format, parseISO } from 'date-fns';

const HeaderStat = ({ icon: Icon, label, value, color }) => (
  <div className="flex flex-col gap-1 items-center sm:items-start px-6 border-l border-zinc-100 dark:border-zinc-800 first:border-l-0">
    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400">
      <Icon size={12} className={color} />
      {label}
    </div>
    <div className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter">
      {value}
    </div>
  </div>
);

/**
 * High-fidelity profile header card for the User deep-dive view.
 */
const UserProfileHeader = ({ user }) => {
  const joinedDate = format(parseISO(user.joinedAt), 'MMM dd, yyyy');
  const publicUrl = getPublicProfileUrl(user);

  return (
    <div className="bg-white dark:bg-surface-dark border border-zinc-100 dark:border-zinc-800 rounded-[40px] p-8 lg:p-10 shadow-sm relative overflow-hidden group">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 h-64 w-64 bg-[#2bb75c]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-48 w-48 bg-[#2bb75c]/5 rounded-full -ml-24 -mb-24 blur-2xl" />

      <div className="flex flex-col xl:flex-row items-center xl:items-start gap-10 relative z-10">
        {/* Identity Section */}
        <div className="flex flex-col items-center xl:items-start text-center xl:text-left gap-6 shrink-0">
          <UserAvatar 
            src={user.avatar} 
            name={user.fullName} 
            isOnline={user.isOnline} 
            size="2xl" 
            className="shadow-2xl shadow-[#2bb75c]/25/10"
          />
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight leading-none">
              {user.fullName}
            </h2>
            <p className="text-zinc-500 font-medium italic">{user.email}</p>
            <div className="flex flex-wrap items-center justify-center xl:justify-start gap-3 mt-4">
              <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                <MapPin size={12} />
                {user.city}, {user.country}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                <Calendar size={12} />
                Joined {joinedDate}
              </div>
            </div>
          </div>
        </div>

        {/* Stats & Actions Section */}
        <div className="flex-1 flex flex-col gap-10 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap justify-center md:justify-start gap-y-6">
              {user.userGroup === 'freelancer' && (
                <>
                  <HeaderStat icon={Star} label="Rating" value={user.rating} color="text-amber-500" />
                  <HeaderStat icon={DollarSign} label="Total Earnings" value={formatCurrency(user.totalEarnings)} color="text-success" />
                  <HeaderStat icon={Briefcase} label="Contracts" value={user.completedContracts} color="text-[#2bb75c]" />
                  <HeaderStat icon={UserCheck} label="Success" value={`${user.successRate}%`} color="text-[#2bb75c]" />
                </>
              )}
              {user.userGroup === 'client' && (
                <>
                  <HeaderStat icon={DollarSign} label="Total Spend" value={formatCurrency(user.totalSpend)} color="text-[#2bb75c]" />
                  <HeaderStat icon={Briefcase} label="Jobs Posted" value={user.totalJobsPosted} color="text-[#2bb75c]" />
                  <HeaderStat icon={UserCheck} label="Hire Rate" value={`${user.hireRate}%`} color="text-success" />
                </>
              )}
              {user.userGroup === 'admin' && (
                <>
                  <HeaderStat icon={ShieldCheck} label="Actions Today" value={user.actionsToday} color="text-[#2bb75c]" />
                  <HeaderStat icon={Activity} label="Login Count" value={user.loginCount} color="text-[#2bb75c]" />
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
               <StatusBadge status={user.status} size="md" className="h-10 px-6" />
               <KycStatusBadge status={user.kycStatus} className="h-10 px-4" />
            </div>
          </div>

          <div className="mt-auto pt-10 border-t border-zinc-50 dark:border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <VerificationBadge user={user} className="scale-125 origin-left" />
            
            <div className="flex items-center gap-3 flex-wrap justify-center xl:justify-end">
              {publicUrl && (
                <Link
                  to={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-black uppercase tracking-widest text-[#2bb75c] hover:bg-[#2bb75c]/5 transition-colors"
                >
                  <ExternalLink size={14} />
                  Public profile
                </Link>
              )}
              <Link
                to={`/admin/users/${user.id}?tab=audit`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                <Eye size={14} />
                Audit trail
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Removed duplicate Activity definition as it's now imported directly

export default UserProfileHeader;

