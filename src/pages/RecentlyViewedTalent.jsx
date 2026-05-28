import React from 'react';
import { Clock, Eye } from 'lucide-react';
import FreelancerCard from '../components/marketplace/FreelancerCard';
import { getRecentlyViewedTalent } from './find-talent/talentMarketplaceData';

const RecentlyViewedTalent = () => {
  const talent = getRecentlyViewedTalent();

  return (
    <div className="bg-surface min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center gap-3 mb-8 border-b border-zinc-200 pb-6">
          <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-zinc-900">Recently viewed</h1>
            <p className="text-zinc-600">These profiles now come directly from the shared marketplace model.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
          {talent.map((entry) => (
            <div className="relative" key={entry.id}>
              <div className="absolute -top-3 left-4 bg-surface-dark text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-md z-10 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Viewed {entry.recentViewedHoursAgo} hour{entry.recentViewedHoursAgo > 1 ? 's' : ''} ago
              </div>
              <FreelancerCard freelancer={entry} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewedTalent;
