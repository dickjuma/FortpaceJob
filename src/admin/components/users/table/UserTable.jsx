import React from 'react';
import { ChevronUp, ChevronDown, Filter, MoreHorizontal } from 'lucide-react';
import { cn } from '../../../utils/cn';
import UserTableRow from './UserTableRow';
import Skeleton from '../../../components/ui/Skeleton';
import EmptyUserState from '../shared/EmptyUserState';
import useUserManagementStore from '../../../store/userManagementStore';

const TableHeader = ({ label, sortKey, currentSort, onSort, className }) => {
  const isActive = currentSort.key === sortKey;
  return (
    <th 
      className={cn(
        "px-4 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-left select-none",
        sortKey && "cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors",
        className
      )}
      onClick={() => sortKey && onSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortKey && (
          <div className="flex flex-col -space-y-1">
            <ChevronUp size={10} className={cn(isActive && currentSort.order === 'asc' ? "text-[#2bb75c]" : "opacity-20")} />
            <ChevronDown size={10} className={cn(isActive && currentSort.order === 'desc' ? "text-[#2bb75c]" : "opacity-20")} />
          </div>
        )}
      </div>
    </th>
  );
};

/**
 * The main data table component for User Management.
 */
const UserTable = ({ 
  users = [], 
  loading = false, 
  error = null,
  section = 'all'
}) => {
  const { 
    selectedUserIds, 
    selectAllUsers, 
    clearSelection,
    filters,
    setFilter 
  } = useUserManagementStore();

  const currentSort = {
    key: filters[section].sortBy,
    order: filters[section].sortOrder
  };

  const handleSort = (key) => {
    const order = (currentSort.key === key && currentSort.order === 'desc') ? 'asc' : 'desc';
    setFilter(section, 'sortBy', key);
    setFilter(section, 'sortOrder', order);
  };

  const allIds = users.map(u => u.id);
  const isAllSelected = allIds.length > 0 && allIds.every(id => selectedUserIds.includes(id));
  const isSomeSelected = selectedUserIds.length > 0 && !isAllSelected;

  const handleToggleAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAllUsers(allIds);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface/50 dark:bg-zinc-800/50">
            <tr>
              <th className="pl-6 py-4 w-12"><Skeleton className="h-4 w-4 rounded" /></th>
              <th className="px-4 py-4"><Skeleton className="h-3 w-32" /></th>
              <th className="px-4 py-4"><Skeleton className="h-3 w-20" /></th>
              <th className="px-4 py-4"><Skeleton className="h-3 w-20" /></th>
              <th className="px-4 py-4"><Skeleton className="h-3 w-24" /></th>
              <th className="px-4 py-4"><Skeleton className="h-3 w-28" /></th>
              <th className="px-4 py-4 hidden lg:table-cell"><Skeleton className="h-3 w-24" /></th>
              <th className="px-4 py-4 hidden xl:table-cell"><Skeleton className="h-3 w-20" /></th>
              <th className="px-4 py-4 hidden lg:table-cell"><Skeleton className="h-3 w-20" /></th>
              <th className="pr-6 py-4 w-12 text-right"><Skeleton className="h-4 w-4 ml-auto" /></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="h-16 border-b border-zinc-50 dark:border-zinc-800/50">
                <td className="pl-6"><Skeleton className="h-4 w-4 rounded" /></td>
                <td className="px-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-2 w-24" />
                    </div>
                  </div>
                </td>
                <td className="px-4"><Skeleton className="h-4 w-20 rounded-lg" /></td>
                <td className="px-4"><Skeleton className="h-4 w-16 rounded-full" /></td>
                <td className="px-4"><Skeleton className="h-4 w-24 rounded-md" /></td>
                <td className="px-4"><Skeleton className="h-3 w-24" /></td>
                <td className="px-4 hidden lg:table-cell"><Skeleton className="h-6 w-24 rounded-full" /></td>
                <td className="px-4 hidden xl:table-cell"><Skeleton className="h-3 w-16" /></td>
                <td className="px-4 hidden lg:table-cell"><Skeleton className="h-1.5 w-24 rounded-full" /></td>
                <td className="pr-6"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-20 flex flex-col items-center justify-center bg-rose-50/30 dark:bg-rose-950/10 rounded-3xl border border-rose-100 dark:border-rose-900/30">
        <div className="h-16 w-16 bg-rose-100 dark:bg-rose-900/50 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
          <Filter size={32} />
        </div>
        <h3 className="text-xl font-black text-rose-900 dark:text-rose-400 uppercase tracking-tight">Sync Failed</h3>
        <p className="text-rose-600/70 dark:text-rose-500/70 text-sm font-bold mt-1">Failed to fetch user directory. Please check your connection.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2.5 bg-rose-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-600/20"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <EmptyUserState />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="sticky top-0 z-10 bg-surface/80 dark:bg-zinc-800/80 backdrop-blur-md">
            <tr className="border-b border-zinc-100 dark:border-zinc-700">
              <th className="pl-6 py-4 w-12">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={isAllSelected}
                    ref={el => el && (el.indeterminate = isSomeSelected)}
                    onChange={handleToggleAll}
                    className="w-4 h-4 rounded border-zinc-300 text-[#2bb75c] focus:ring-[#2bb75c] cursor-pointer"
                  />
                </div>
              </th>
              <TableHeader label="User Identity" sortKey="fullName" currentSort={currentSort} onSort={handleSort} />
              <TableHeader label="Group / Role" sortKey="userGroup" currentSort={currentSort} onSort={handleSort} />
              <TableHeader label="Account Status" sortKey="status" currentSort={currentSort} onSort={handleSort} />
              <TableHeader label="Verification" sortKey="kycStatus" currentSort={currentSort} onSort={handleSort} />
              <TableHeader label="Metric Performance" sortKey="totalEarnings" currentSort={currentSort} onSort={handleSort} />
              <TableHeader label="Level & Badges" sortKey="level" currentSort={currentSort} onSort={handleSort} className="hidden lg:table-cell" />
              <TableHeader label="Last Active" sortKey="lastSeenAt" currentSort={currentSort} onSort={handleSort} className="hidden xl:table-cell" />
              <TableHeader label="Risk Level" sortKey="riskScore" currentSort={currentSort} onSort={handleSort} className="hidden lg:table-cell" />
              <th className="pr-6 py-4 w-12 text-right">
                <MoreHorizontal size={14} className="text-zinc-300 ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {users.map((user) => (
              <UserTableRow 
                key={user.id} 
                user={user} 
                isSelected={selectedUserIds.includes(user.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;

