import React from 'react';
import { Trophy, Star, Medal, Loader2 } from 'lucide-react';
import { usePublicFreelancers } from '../../platform/common/hooks/usePublicDiscovery';

const FreelancerLeaderboard = () => {
  const { talent, loading } = usePublicFreelancers({ limit: 20, sortBy: 'rating' });

  return (
    <>
      <div className="bg-surface-dark text-white py-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-amber-400" />
          <h1 className="text-4xl font-black mb-4">Freelancer Leaderboard</h1>
          <p className="text-zinc-300 max-w-xl mx-auto">Top performers ranked by client ratings and completed work.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12 max-w-4xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#4C1D95]" />
          </div>
        ) : talent.length === 0 ? (
          <p className="text-center text-zinc-500 font-medium py-16">Leaderboard data is not available yet.</p>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-surface border-b border-zinc-200">
                <tr>
                  <th className="p-4 text-left text-sm font-bold text-zinc-500">Rank</th>
                  <th className="p-4 text-left text-sm font-bold text-zinc-500">Freelancer</th>
                  <th className="p-4 text-center text-sm font-bold text-zinc-500">Rating</th>
                  <th className="p-4 text-right text-sm font-bold text-zinc-500">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {talent.map((leader, i) => (
                  <tr key={leader.id} className="hover:bg-surface/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-black text-lg text-zinc-900">
                        {i < 3 ? <Medal className={`w-5 h-5 ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-zinc-400' : 'text-orange-600'}`} /> : null}
                        #{i + 1}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-zinc-900">{leader.name}</div>
                      <div className="text-sm text-zinc-500">{leader.title}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold"><Star className="w-4 h-4 text-amber-500 fill-current" /> {leader.rating.toFixed(1)}</span>
                      <div className="text-xs text-zinc-400">{leader.reviews} reviews</div>
                    </td>
                    <td className="p-4 text-right font-bold text-zinc-900">${leader.hourlyRate}/hr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default FreelancerLeaderboard;


