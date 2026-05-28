import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Filter, MoreVertical, 
  ChevronDown, Star, Activity, AlertTriangle, 
  CheckCircle, ArrowUpDown, Lock, Clock, Zap, Eye, Edit3, ShieldOff
} from 'lucide-react';
import { useGigs } from '../../hooks/useMarketplace';
import useMarketplaceStore from '../../store/marketplaceStore';
import { GIG_STATUSES, CATEGORIES } from '../../config/marketplaceConfig';
import { format } from 'date-fns';
import Avatar from '../../components/ui/Avatar';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import MarketplaceDetailModal from '../../components/marketplace/MarketplaceDetailModal';
import MarketplaceEditModal from '../../components/marketplace/MarketplaceEditModal';
import MarketplaceActionModal from '../../components/marketplace/MarketplaceActionModal';
import UserProfileModal from '../../components/users/UserProfileModal';
import UserRankingModal from '../../components/users/UserRankingModal';
import UserFlagModal from '../../components/users/UserFlagModal';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = GIG_STATUSES[status] || GIG_STATUSES.inactive;
  const Icon = config.icon;
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
      config.bg, config.color
    )}>
      <Icon size={12} />
      {config.label}
    </span>
  );
};

export default function GigsManagementPage() {
  const { data: gigsData, isLoading } = useGigs();
  const { filters, setFilter, setPage } = useMarketplaceStore();
  const [selectedIds, setSelectedIds] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [selectedGig, setSelectedGig] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedIds.length === gigsData?.data?.length) {
      setSelectedIds([]);
    } else {
    }
  };

  const handleAction = (action, id) => {
    const gig = gigsData?.data?.find(g => g.id === id);
    if (action === 'View') {
      setSelectedGig(gig);
      setIsViewModalOpen(true);
    } else if (action === 'Edit') {
      setSelectedGig(gig);
      setIsEditModalOpen(true);
    } else if (action === 'Delist') {
      setSelectedGig(gig);
      setIsActionModalOpen(true);
    } else {
      toast.success(`${action} action executed for gig ${id}`);
    }
  };

  const handleUserAction = (type, user) => {
    setSelectedUser(user);
    if (type === 'profile') setIsProfileModalOpen(true);
    if (type === 'ranking') setIsRankingModalOpen(true);
    if (type === 'flag') setIsFlagModalOpen(true);
  };

  const handleBulkAction = (action) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)),
      {
        loading: `Applying ${action} to ${selectedIds.length} gigs...`,
        success: `Successfully updated ${selectedIds.length} gigs`,
        error: 'Failed to update gigs'
      }
    );
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-brand-500/10 text-brand-500 rounded-xl">
              <ShoppingBag size={24} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Gig Management</h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Monitor and manage all active service listings across the platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium hover:bg-surface dark:hover:bg-zinc-800 transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-500">Total Gigs</h3>
            <ShoppingBag size={18} className="text-zinc-400" />
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">{gigsData?.total || 0}</div>
        </div>
        <div className="p-5 bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-500">Active Listings</h3>
            <Zap size={18} className="text-success" />
          </div>
          <div className="text-2xl font-black text-success dark:text-success">
            {gigsData?.data?.filter(g => g.status === 'active').length || 0}
          </div>
        </div>
        <div className="p-5 bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-500">Flagged</h3>
            <AlertTriangle size={18} className="text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {gigsData?.data?.filter(g => g.flagged).length || 0}
          </div>
        </div>
        <div className="p-5 bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-500">Total Revenue</h3>
            <Activity size={18} className="text-violet-500" />
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">KES 4.2M</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
        {/* Filters */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search gigs, freelancers..." 
              value={filters.gigs.search}
              onChange={(e) => setFilter('gigs', 'search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <select 
            value={filters.gigs.status}
            onChange={(e) => setFilter('gigs', 'status', e.target.value)}
            className="px-4 py-2 bg-surface dark:bg-zinc-800 border-none rounded-xl text-sm outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="delisted">Delisted</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="bg-brand-50 dark:bg-brand-500/10 border-b border-brand-100 dark:border-brand-500/20 p-3 flex items-center justify-between px-6">
            <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
              {selectedIds.length} gigs selected
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkAction('Pause')}
                className="px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg text-sm font-medium hover:bg-surface dark:hover:bg-zinc-700"
              >
                Pause Listings
              </button>
              <button 
                onClick={() => handleBulkAction('Delist')}
                className="px-3 py-1.5 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-500/30"
              >
                Delist Listings
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === (gigsData?.data?.length || 0) && selectedIds.length > 0}
                    onChange={toggleAll}
                    className="rounded border-zinc-300 dark:border-zinc-600 text-brand-600 focus:ring-brand-500"
                  />
                </th>
                <th className="p-4 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300">Gig Detail <ArrowUpDown size={12} className="inline ml-1" /></th>
                <th className="p-4 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300">Freelancer <ArrowUpDown size={12} className="inline ml-1" /></th>
                <th className="p-4">Price</th>
                <th className="p-4">Metrics</th>
                <th className="p-4 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300">Status <ArrowUpDown size={12} className="inline ml-1" /></th>
                <th className="p-4 text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div></td>
                    <td className="p-4"><div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded"></div></td>
                    <td className="p-4"><div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div></td>
                    <td className="p-4"><div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div></td>
                    <td className="p-4"><div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div></td>
                    <td className="p-4"><div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div></td>
                    <td className="p-4"><div className="h-6 w-6 bg-zinc-200 dark:bg-zinc-800 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : gigsData?.data?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-500">
                    No gigs found matching your filters.
                  </td>
                </tr>
              ) : (
                gigsData?.data?.map((gig) => (
                  <tr key={gig.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 transition-colors group">
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(gig.id)}
                        onChange={() => toggleSelect(gig.id)}
                        className="rounded border-zinc-300 dark:border-zinc-600 text-brand-600 focus:ring-brand-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
                          <ShoppingBag size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-white max-w-[200px] truncate" title={gig.title}>
                            {gig.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-zinc-500 font-medium">{gig.id}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                              {gig.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div 
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => handleUserAction('profile', { name: gig.freelancerName, id: gig.freelancerId })}
                      >
                        <Avatar name={gig.freelancerName} size="sm" />
                        <div>
                          <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate max-w-[120px] group-hover:text-brand-600 transition-colors">
                            {gig.freelancerName}
                          </p>
                          <div 
                            className="flex items-center gap-1 text-xs text-amber-500 cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-900/20 px-1 rounded transition-colors"
                            onClick={(e) => { e.stopPropagation(); handleUserAction('ranking', { name: gig.freelancerName, id: gig.freelancerId }); }}
                            title="Adjust Ranking"
                          >
                            <Star size={10} className="fill-current" />
                            <span className="font-bold text-zinc-700 dark:text-zinc-300">{gig.rating}</span>
                            <span className="text-zinc-400">({gig.totalReviews})</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-black text-zinc-900 dark:text-white">
                        <span className="text-xs text-zinc-400 mr-1">KES</span>
                        {gig.price.base.toLocaleString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          {gig.orders} Orders <span className="text-zinc-400 font-normal">in queue</span>
                        </p>
                        <div className="flex items-center gap-2 w-24">
                          <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full rounded-full", gig.qualityScore >= 70 ? "bg-success" : gig.qualityScore >= 50 ? "bg-amber-500" : "bg-red-500")}
                              style={{ width: `${gig.qualityScore}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-zinc-500">{gig.qualityScore}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-2 items-start">
                        <StatusBadge status={gig.status} />
                        {gig.flagged && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            <AlertTriangle size={8} /> Flagged
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 pr-2">
                        <button 
                          onClick={() => handleAction('View', gig.id)}
                          className="p-2 text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-300 rounded-xl transition-all shadow-sm border border-brand-100 dark:border-brand-800" title="View Gig"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleAction('Edit', gig.id)}
                          className="p-2 text-zinc-600 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 rounded-xl transition-all shadow-sm border border-zinc-200 dark:border-zinc-700" title="Edit Gig"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleAction('Delist', gig.id)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/40 dark:text-red-300 rounded-xl transition-all shadow-sm border border-red-100 dark:border-red-800" title="Delist Gig"
                        >
                          <ShieldOff size={18} />
                        </button>
                        <button className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl ml-1" title="More Options">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-surface/50 dark:bg-surface-dark/50">
          <p className="text-sm text-zinc-500">
            Showing <span className="font-medium text-zinc-900 dark:text-white">{gigsData?.data?.length || 0}</span> of <span className="font-medium text-zinc-900 dark:text-white">{gigsData?.total || 0}</span> gigs
          </p>
          <div className="flex gap-1">
            <button 
              disabled={gigsData?.page === 1}
              onClick={() => setPage('gigs', (gigsData?.page || 2) - 1)}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium disabled:opacity-50 hover:bg-white dark:hover:bg-zinc-800"
            >
              Previous
            </button>
            <button 
              disabled={gigsData?.page === gigsData?.totalPages}
              onClick={() => setPage('gigs', (gigsData?.page || 0) + 1)}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium disabled:opacity-50 hover:bg-white dark:hover:bg-zinc-800"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <MarketplaceDetailModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        data={selectedGig}
        type="gig"
      />

      <MarketplaceEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        data={selectedGig}
        type="gig"
      />

      <MarketplaceActionModal 
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        data={selectedGig}
        type="delist"
      />

      <UserProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={selectedUser}
        onAction={handleUserAction}
      />

      <UserRankingModal 
        isOpen={isRankingModalOpen}
        onClose={() => setIsRankingModalOpen(false)}
        user={selectedUser}
      />

      <UserFlagModal 
        isOpen={isFlagModalOpen}
        onClose={() => setIsFlagModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
