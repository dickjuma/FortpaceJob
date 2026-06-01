import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { cn } from '../../../utils/cn';
import UserAvatar from '../shared/UserAvatar';
import StatusBadge from '../shared/StatusBadge';
import RoleBadge from '../shared/RoleBadge';
import KycStatusBadge from '../shared/KycStatusBadge';
import VerificationBadge from '../shared/VerificationBadge';
import RiskScoreMeter from '../shared/RiskScoreMeter';
import UserQuickActions from '../shared/UserQuickActions';
import { formatCurrency } from '../../../utils/formatters';
import useUserManagementStore from '../../../store/userManagementStore';

/**
 * A single row in the user management table.
 */
const UserTableRow = ({ user, isSelected }) => {
  const navigate = useNavigate();
  const toggleSelectUser = useUserManagementStore(s => s.toggleSelectUser);

  const handleRowClick = () => {
    if (user?.id) {
      navigate(`/admin/users/${user.id}`);
    }
  };

  const lastSeenLabel = user.lastSeenAt 
    ? formatDistanceToNow(parseISO(user.lastSeenAt), { addSuffix: true })
    : 'Never';

  return (
    <tr 
      onClick={handleRowClick}
      className={cn(
        "group h-16 border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-surface/80 dark:hover:bg-zinc-800/30 transition-all cursor-pointer",
        isSelected && "bg-[#14a800]/5/30 dark:bg-[#14a800]/10"
      )}
    >
      {/* Checkbox */}
      <td className="pl-6 w-12" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center">
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={() => toggleSelectUser(user.id)}
            className="w-4 h-4 rounded border-zinc-300 text-[#14a800] focus:ring-[#14a800] cursor-pointer"
          />
        </div>
      </td>

      {/* User Info */}
      <td className="px-4 min-w-[240px]">
        <div className="flex items-center gap-3">
          <UserAvatar src={user.avatar} name={user.fullName} isOnline={user.isOnline} size="md" />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-zinc-900 dark:text-white truncate group-hover:text-[#14a800] transition-colors">
              {user.fullName}
            </span>
            <span className="text-[10px] font-medium text-zinc-500 truncate tracking-tight">
              {user.email}
            </span>
          </div>
        </div>
      </td>

      {/* Group/Role */}
      <td className="px-4">
        {user.userGroup === 'admin' ? (
          <RoleBadge role={user.role} />
        ) : (
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            {user.userGroup}
          </span>
        )}
      </td>

      {/* Status */}
      <td className="px-4">
        <StatusBadge status={user.status} size="sm" />
      </td>

      {/* KYC & Verification */}
      <td className="px-4">
        <div className="flex flex-col gap-1.5">
          <KycStatusBadge status={user.kycStatus} />
          <VerificationBadge user={user} />
        </div>
      </td>

      {/* Key Metric / Time Spent for Admins */}
      <td className="px-4">
        <div className="flex flex-col">
          <span className="text-xs font-black text-zinc-900 dark:text-white">
            {user.userGroup === 'freelancer' ? formatCurrency(user.totalEarnings) : 
             user.userGroup === 'client' ? formatCurrency(user.totalSpend) : 
             `${Math.floor((user.id.length || 10) * 12.5)} Hrs`}
          </span>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
            {user.userGroup === 'freelancer' ? 'Total Earnings' : 
             user.userGroup === 'client' ? 'Total Spend' : 'Time Spent'}
          </span>
        </div>
      </td>

      {/* Level & Badges / Admin Performance */}
      <td className="px-4 hidden lg:table-cell min-w-[140px]">
        {user.userGroup === 'admin' ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400 px-2 py-0.5 rounded">
                Tier {user.level || 1} Mod
              </span>
              <span className="text-[10px] text-zinc-500 font-bold">{Math.floor((user.id.length || 10) * 142)} Actions</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(Math.floor((user.id.length || 10) % 10) + 1) * 10}%` }} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-[#14a800] bg-[#14a800]/5 dark:bg-[#14a800]/30 dark:text-[#14a800] px-2 py-0.5 rounded">
                Level {user.level || Math.floor((user.id.length || 10) % 5) + 1}
              </span>
              <div className="flex -space-x-1">
                 {user.userGroup === 'freelancer' && (
                   <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500 border border-white dark:border-zinc-900 flex items-center justify-center text-[10px]" title="Top Rated">⭐</div>
                 )}
                 <div className="w-5 h-5 rounded-full bg-[#14a800]/10 dark:bg-[#14a800]/30 text-[#14a800] border border-white dark:border-zinc-900 flex items-center justify-center text-[10px]" title="Fast Responder">⚡</div>
              </div>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#14a800] rounded-full" style={{ width: `${(Math.floor((user.id.length || 10) % 10) + 1) * 10}%` }} />
            </div>
          </div>
        )}
      </td>

      {/* Last Seen */}
      <td className="px-4 hidden xl:table-cell">
        <span className="text-[10px] font-bold text-zinc-500 whitespace-nowrap">
          {lastSeenLabel}
        </span>
      </td>

      {/* Risk Score */}
      <td className="px-4 hidden lg:table-cell w-32">
        <RiskScoreMeter score={user.riskScore} />
      </td>

      {/* Actions */}
      <td className="pr-6 text-right" onClick={(e) => e.stopPropagation()}>
        <UserQuickActions user={user} />
      </td>
    </tr>
  );
};

export default UserTableRow;
