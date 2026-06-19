import React from 'react';
import { CheckCircle2, Star, TrendingUp, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import FreelancerCard from '../components/marketplace/FreelancerCard';
import { getMarketplaceTalent } from '../../client/pages/find-talent/talentMarketplaceData';

const TopRatedTalents = () => {
  const talent = getMarketplaceTalent({ sortBy: 'rating' }).filter((entry) => entry.topRated);

  return (
    <>
      <div className="bg-surface-dark text-white pt-20 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-600/20 via-zinc-900 to-zinc-900" />

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-3xl">
          <div className="w-20 h-20 bg-amber-500/20 border-2 border-amber-500/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
            <Trophy className="w-10 h-10 text-amber-400" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">Top rated marketplace talent</h1>
          <p className="text-lg md:text-xl text-zinc-300 mb-8">
            These profiles are ranked directly from the shared marketplace dataset using rating, review depth, and trust signals.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-amber-200">
            <div className="flex items-center gap-2"><Star className="w-5 h-5 fill-current" /> Elite satisfaction signals</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Verified trust layer</div>
            <div className="flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Active hiring readiness</div>
          </div>
        </div>
      </div>

      <div className="bg-surface min-h-screen py-16 border-t border-amber-500/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
            {talent.map((entry) => (
              <FreelancerCard freelancer={entry} key={entry.id} />
            ))}
          </div>

          <div className="bg-gradient-to-r from-amber-600 to-amber-500 rounded-3xl p-10 text-white text-center shadow-xl shadow-amber-900/20">
            <h2 className="text-3xl font-black mb-4">Need a managed elite team?</h2>
            <p className="text-amber-100 mb-8 max-w-2xl mx-auto text-lg">
              Use the connected marketplace to search top rated talent, compare them, and move into hiring without breaking context.
            </p>
            <Link className="px-8 py-4 bg-white text-amber-600 font-bold rounded-xl shadow-lg hover:bg-surface transition-colors inline-block" to="/enterprise">
              Contact enterprise sales
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopRatedTalents;
