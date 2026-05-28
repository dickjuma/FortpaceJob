import React, { useState } from 'react';
import { 
  Trophy, Search, Star, MoreVertical,
  ArrowUpDown, Filter, Award, TrendingUp, AlertTriangle, User, ArrowUpCircle, Flag
} from 'lucide-react';
import { useMarketplaceStats } from '../../hooks/useMarketplace';
import useMarketplaceStore from '../../store/marketplaceStore';
import Avatar from '../../components/ui/Avatar';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import UserProfileModal from '../../components/users/UserProfileModal';
import UserRankingModal from '../../components/users/UserRankingModal';
import UserFlagModal from '../../components/users/UserFlagModal';

// We'll generate a quick mocked list of freelancers for the rankings since it's not explicitly in the API yet.
const MOCK_RANKINGS = Array.from({ length: 20 }, (_, i) => ({
  id: `FRL-${100 + i}`,
  name: i % 2 === 0 ? `Kamau Mwangi ${i}` : `Wanjiru Ndungu ${i}`,
  rank: i + 1,
  rating: (5.0 - (i * 0.05)).toFixed(1),
  totalReviews: 100 - (i * 3),
  earnings: 5000000 - (i * 150000),
  completedContracts: 50 - i,
  completionRate: 100 - Math.floor(i / 2),
  responseTime: i < 5 ? '< 1 hr' : i < 15 ? '< 12 hrs' : '> 24 hrs',
  riskScore: Math.floor(Math.random() * 30), // 0-100
}));

export default function RankingsPage() {
  const [search, setSearch] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserAction = (type, user) => {
    setSelectedUser(user);
    if (type === 'profile') setIsProfileModalOpen(true);
    if (type === 'ranking') setIsRankingModalOpen(true);
    if (type === 'flag') setIsFlagModalOpen(true);
  };

  const filtered = MOCK_RANKINGS.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-yellow-500/10 text-yellow-600 rounded-xl">
              <Trophy size={24} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Freelancer Rankings</h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Monitor top performing talent and algorithmic ranking distribution.
          </p>
        </div>
        <button className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium hover:bg-surface">
          Export CSV
        </button>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search freelancers..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <select className="px-4 py-2 bg-surface dark:bg-zinc-800 border-none rounded-xl text-sm outline-none cursor-pointer">
            <option>Rank By Earnings</option>
            <option>Rank By Rating</option>
            <option>Rank By Completion Rate</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 w-12 text-center">Rank</th>
                <th className="p-4">Freelancer</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Earnings (KES)</th>
                <th className="p-4">Completion</th>
                <th className="p-4">Response Time</th>
                <th className="p-4">Risk Score</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {filtered.map(freelancer => (
                <tr key={freelancer.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20">
                  <td className="p-4 text-center">
                    <span className={cn("inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                      freelancer.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                      freelancer.rank === 2 ? "bg-zinc-200 text-zinc-700" :
                      freelancer.rank === 3 ? "bg-orange-100 text-orange-700" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                    )}>
                      {freelancer.rank}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={freelancer.name} size="sm" />
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">{freelancer.name}</p>
                        <p className="text-xs text-zinc-500">{freelancer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={14} className="fill-current" />
                      <span className="font-bold">{freelancer.rating}</span>
                      <span className="text-xs text-zinc-400">({freelancer.totalReviews})</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-zinc-900 dark:text-white">
                    {freelancer.earnings.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-success">{freelancer.completionRate}%</span>
                  </td>
                  <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {freelancer.responseTime}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", freelancer.riskScore > 20 ? "bg-red-500" : "bg-success")} style={{ width: `${Math.max(10, freelancer.riskScore)}%` }} />
                      </div>
                      <span className="text-xs font-medium text-zinc-500">{freelancer.riskScore}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleUserAction('profile', freelancer)}
                        className="p-1.5 text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:hover:bg-brand-900/40 rounded-lg transition-colors tooltip-trigger" 
                        title="View Profile"
                      >
                        <User size={16} />
                      </button>
                      <button 
                        onClick={() => handleUserAction('ranking', freelancer)}
                        className="p-1.5 text-success bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 rounded-lg transition-colors tooltip-trigger" 
                        title="Adjust Ranking"
                      >
                        <ArrowUpCircle size={16} />
                      </button>
                      <button 
                        onClick={() => handleUserAction('flag', freelancer)}
                        className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors tooltip-trigger" 
                        title="Flag User"
                      >
                        <Flag size={16} />
                      </button>
                      <button className="p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg ml-1" title="More Options">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
