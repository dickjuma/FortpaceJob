import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, RotateCcw, ChevronDown, SortAsc, SortDesc, X, Loader2 } from 'lucide-react';
import useUserManagementStore from '../../../store/userManagementStore';
import { USER_STATUSES, KYC_STATUSES, USER_GROUPS } from '../../../config/users/userRoleConfig';

const FilterSelect = ({ label, value, options, onChange }) => (
  <div className="flex flex-col gap-1.5 min-w-[140px]">
    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">{label}</label>
    <div className="relative group">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 pl-3 pr-8 bg-surface dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl text-xs font-bold appearance-none outline-none focus:border-[#4C1D95]/20 transition-all cursor-pointer"
      >
        <option value="">All {label}s</option>
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -tranzinc-y-1/2 text-zinc-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
    </div>
  </div>
);

/**
 * High-fidelity filter bar for the user management tables.
 */
const UserTableFilters = ({ section = 'all' }) => {
  const { filters, setFilter, resetFilters } = useUserManagementStore();
  const currentFilters = filters[section];
  
  const [localSearch, setLocalSearch] = useState(currentFilters.search);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    setIsDebouncing(true);
    const timer = setTimeout(() => {
      setFilter(section, 'search', localSearch);
      setIsDebouncing(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch, section, setFilter]);

  const activeCount = Object.entries(currentFilters).filter(([key, val]) => val !== '' && key !== 'sortBy' && key !== 'sortOrder').length;

  const statusOptions = Object.entries(USER_STATUSES).map(([id, config]) => ({ id, label: config.label }));
  const kycOptions = Object.entries(KYC_STATUSES).map(([id, config]) => ({ id, label: config.label }));
  const groupOptions = Object.entries(USER_GROUPS).map(([id, config]) => ({ id, label: config.label }));

  return (
    <div className="flex flex-col gap-6 mb-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row items-end gap-4">
        {/* Search */}
        <div className="flex flex-col gap-1.5 flex-1 w-full lg:w-auto">
          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Search Directory</label>
          <div className="relative group">
            {isDebouncing ? (
              <Loader2 className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-[#4C1D95] animate-spin" size={18} />
            ) : (
              <Search className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-zinc-400 group-focus-within:text-[#4C1D95] transition-colors" size={18} />
            )}
            <input
              type="text"
              placeholder="Search by name, email, phone or ID..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-10 bg-surface dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm font-medium outline-none focus:border-[#4C1D95]/20 dark:focus:border-[#4C1D95]/20 focus:bg-white dark:focus:bg-surface-dark transition-all shadow-sm"
            />
            {localSearch && (
              <button 
                onClick={() => setLocalSearch('')}
                className="absolute right-4 top-1/2 -tranzinc-y-1/2 text-zinc-300 hover:text-zinc-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2 mb-1">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center bg-surface dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden h-10 shadow-sm">
              <select
                value={currentFilters.sortBy}
                onChange={(e) => setFilter(section, 'sortBy', e.target.value)}
                className="pl-3 pr-2 bg-transparent text-[11px] font-black uppercase tracking-tight outline-none appearance-none cursor-pointer"
              >
                <option value="joinedAt">Joined Date</option>
                <option value="lastSeenAt">Last Active</option>
                <option value="fullName">Full Name</option>
                <option value="riskScore">Risk Level</option>
                <option value="totalEarnings">Total Earnings</option>
              </select>
              <button
                onClick={() => setFilter(section, 'sortOrder', currentFilters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 border-l border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-zinc-500 hover:text-[#4C1D95]"
              >
                {currentFilters.sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-zinc-50 dark:border-zinc-800/50 pt-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg text-zinc-500">
           <SlidersHorizontal size={14} />
           <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
           {activeCount > 0 && (
             <span className="h-4 min-w-[16px] px-1 flex items-center justify-center bg-[#4C1D95] text-white text-[9px] font-black rounded-full">
               {activeCount}
             </span>
           )}
        </div>

        <FilterSelect label="Group" value={currentFilters.userGroup} options={groupOptions} onChange={(v) => setFilter(section, 'userGroup', v)} />
        <FilterSelect label="Status" value={currentFilters.status} options={statusOptions} onChange={(v) => setFilter(section, 'status', v)} />
        <FilterSelect label="KYC" value={currentFilters.kycStatus} options={kycOptions} onChange={(v) => setFilter(section, 'kycStatus', v)} />

        {activeCount > 0 && (
          <button
            onClick={() => {
              setLocalSearch('');
              resetFilters(section);
            }}
            className="flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-rose-500 transition-colors ml-auto"
          >
            <RotateCcw size={14} />
            Reset All
          </button>
        )}
      </div>
    </div>
  );
};

export default UserTableFilters;


