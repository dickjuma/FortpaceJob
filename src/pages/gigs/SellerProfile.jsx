import React, { useEffect, useState } from 'react';
import { Star, MapPin, Clock, Shield, MessageCircle, ChevronRight, Verified, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { gigAPI, publicAPI, userAPI } from '../../common/services/api';
import { extractList, gigCardFromApi, talentCardFromApi } from '../../common/utils/apiHelpers';

const SellerProfile = () => {
  const { sellerSlug } = useParams();
  const [seller, setSeller] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        let profile = null;
        try {
          profile = await userAPI.getProfile(sellerSlug);
        } catch {
          const search = await publicAPI.searchFreelancers({ q: sellerSlug, limit: 1 });
          const list = extractList(search?.talents || search?.data || search);
          if (list[0]) profile = list[0];
        }

        if (!cancelled && profile) {
          setSeller(talentCardFromApi(profile));
        }

        const gigsRaw = await gigAPI.getGigs({ sellerId: sellerSlug, freelancerId: sellerSlug, limit: 12 });
        if (!cancelled) setGigs(extractList(gigsRaw).map(gigCardFromApi));
      } catch {
        if (!cancelled) {
          setSeller(null);
          setGigs([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (sellerSlug) load();
    return () => {
      cancelled = true;
    };
  }, [sellerSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-[#14a800]" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface py-20">
        <p className="text-zinc-600 mb-4">Seller profile not found.</p>
        <Link to="/gigs" className="text-[#14a800] font-bold hover:underline">Back to marketplace</Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl flex flex-col lg:flex-row gap-8">

          <div className="lg:w-1/3 shrink-0">
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
              <div className="flex flex-col items-center text-center relative mb-6">
                <div className="relative inline-block mb-4">
                  {seller.imageUrl ? (
                    <img src={seller.imageUrl} alt={seller.name} className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-zinc-200 flex items-center justify-center text-3xl font-bold text-zinc-600">
                      {seller.name[0]}
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-black text-zinc-900 mb-1 flex items-center justify-center gap-2">
                  {seller.name}
                  {seller.verified && <Verified className="w-5 h-5 text-[#14a800] fill-current bg-white rounded-full" />}
                </h1>
                <p className="text-zinc-600 font-medium mb-3">{seller.title}</p>
                <div className="flex items-center justify-center gap-2 mb-4 text-sm font-bold text-zinc-900">
                  <Star className="w-4 h-4 text-amber-500 fill-current" /> {seller.rating.toFixed(1)}{' '}
                  <span className="text-zinc-400 font-medium">({seller.reviews} reviews)</span>
                </div>
                {seller.verified && (
                  <div className="inline-block px-3 py-1 bg-amber-50 text-amber-700 font-bold text-xs uppercase tracking-wider rounded-lg border border-amber-200">
                    Top Rated Seller
                  </div>
                )}
              </div>

              <button type="button" className="w-full py-4 bg-success hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mb-6">
                <MessageCircle className="w-5 h-5" /> Contact Me
              </button>

              <div className="space-y-4 pt-6 border-t border-zinc-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2 text-zinc-500 font-medium"><MapPin className="w-4 h-4" /> From</span>
                  <span className="font-bold text-zinc-900">{seller.location}</span>
                </div>
                {seller.hourlyRate > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 text-zinc-500 font-medium"><Shield className="w-4 h-4" /> Hourly rate</span>
                    <span className="font-bold text-zinc-900">${seller.hourlyRate}/hr</span>
                  </div>
                )}
              </div>
            </div>

            {seller.skills?.length > 0 && (
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-zinc-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {seller.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-zinc-100 text-zinc-600 text-sm font-medium rounded-lg border border-zinc-200">
                      {typeof skill === 'string' ? skill : skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center justify-between">
                Active Gigs
                <span className="text-sm font-bold text-success bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  {gigs.length} Gigs
                </span>
              </h2>

              {gigs.length === 0 ? (
                <p className="text-zinc-500 font-medium">No active gigs listed yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gigs.map((gig) => (
                    <Link key={gig.id} to={`/gigs/gig/${gig.id}`} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all group flex flex-col cursor-pointer">
                      <div className="h-40 overflow-hidden relative bg-zinc-100">
                        {gig.img && <img src={gig.img} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-medium text-zinc-900 mb-3 line-clamp-2 group-hover:text-success transition-colors leading-relaxed">
                          {gig.title}
                        </h3>
                        <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between">
                          <div className="flex items-center gap-1 font-bold text-zinc-900 text-sm">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                            {gig.rating} <span className="text-zinc-400 font-medium">({gig.reviews})</span>
                          </div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                            From <span className="text-base text-zinc-900 ml-0.5">${gig.price}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-zinc-900">Reviews</h2>
                {gigs[0] && (
                  <Link to={`/gigs/${gigs[0].id}/reviews`} className="text-success font-bold text-sm hover:underline flex items-center">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
              <p className="text-zinc-500 text-sm">See gig-specific reviews from the gig detail page.</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default SellerProfile;
