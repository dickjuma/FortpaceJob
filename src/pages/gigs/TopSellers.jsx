import React from 'react';
import { Trophy, Star, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTopSellers } from '../../common/hooks/useGigsMarketplace';
import { talentCardFromApi } from '../../common/utils/apiHelpers';

const TopSellers = () => {
  const { sellers, loading } = useTopSellers(10);

  return (
    <>
      <div className="bg-surface-dark text-white py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl text-center">
          <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Top Rated Sellers</h1>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">Discover the highest-performing, most reliable freelancers on Fortspace, ranked by client satisfaction.</p>
        </div>
      </div>

      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">

          <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#2bb75c]" />
              </div>
            ) : sellers.length === 0 ? (
              <p className="text-center text-zinc-500 font-medium py-20">No top sellers to display yet.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface border-b border-zinc-200">
                  <tr>
                    <th className="p-6 font-bold text-zinc-500 text-sm">Rank</th>
                    <th className="p-6 font-bold text-zinc-500 text-sm">Seller Details</th>
                    <th className="p-6 font-bold text-zinc-500 text-sm hidden sm:table-cell">Category</th>
                    <th className="p-6 font-bold text-zinc-500 text-sm text-center">Stats</th>
                    <th className="p-6 font-bold text-zinc-500 text-sm text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {sellers.map((raw, index) => {
                    const seller = talentCardFromApi(raw, index);
                    const rank = index + 1;
                    const sellerId = seller.id;
                    return (
                      <tr key={sellerId} className="hover:bg-surface transition-colors group">
                        <td className="p-6">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${rank === 1 ? 'bg-amber-100 text-amber-600' : rank === 2 ? 'bg-zinc-200 text-zinc-700' : rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-surface text-zinc-400'}`}>
                            #{rank}
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            {seller.imageUrl ? (
                              <img src={seller.imageUrl} alt={seller.name} className="w-12 h-12 rounded-full border border-zinc-200 object-cover" />
                            ) : (
                              <div className="w-12 h-12 rounded-full border border-zinc-200 bg-zinc-100 flex items-center justify-center font-bold text-zinc-600">
                                {seller.name[0]}
                              </div>
                            )}
                            <div>
                              <Link to={`/seller/${sellerId}`} className="font-bold text-zinc-900 text-lg hover:text-success transition-colors block">
                                {seller.name}
                              </Link>
                              <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                                {seller.verified ? 'Top Rated' : 'Seller'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 hidden sm:table-cell">
                          <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-sm font-medium rounded-lg border border-zinc-200">
                            {seller.title}
                          </span>
                        </td>
                        <td className="p-6 text-center">
                          <div className="flex items-center justify-center gap-1 font-black text-zinc-900 mb-1">
                            <Star className="w-4 h-4 text-amber-500 fill-current" /> {seller.rating.toFixed(1)}
                          </div>
                          <div className="text-xs font-medium text-zinc-500">{seller.reviews} reviews</div>
                        </td>
                        <td className="p-6 text-right">
                          <Link to={`/seller/${sellerId}`} className="inline-flex items-center justify-center p-3 bg-white border border-zinc-200 text-zinc-600 hover:text-success hover:border-emerald-300 rounded-xl transition-colors shadow-sm">
                            <ChevronRight className="w-5 h-5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default TopSellers;

