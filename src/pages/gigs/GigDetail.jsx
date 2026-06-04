import React, { useEffect, useMemo, useState } from 'react';
import { Star, Clock, RefreshCw, Check, MessageSquare, ChevronRight, Share2, Heart, Loader2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthRedirect } from '../../common/utils/authRedirect';
import { gigAPI } from '../../common/services/api';
import { useSavedGigIds, useToggleSaveGig } from '../../common/hooks/useSavedGig';

const GigDetail = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const [activeTier, setActiveTier] = useState('standard');
  const { requireAuth } = useAuthRedirect();
  const { data: savedGigIds } = useSavedGigIds();
  const toggleSaveGig = useToggleSaveGig();
  const isSaved = savedGigIds?.has?.(gigId) || savedGigIds?.has?.(String(gigId));
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadGig = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const data = await gigAPI.getGig(gigId);
        if (!cancelled) setGig(data || null);
      } catch (err) {
        if (!cancelled) {
          setGig(null);
          setLoadError(err.message || 'Failed to load gig');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadGig();
    return () => {
      cancelled = true;
    };
  }, [gigId]);

  const packageOptions = useMemo(() => {
    if (!gig) return {};
    if (Array.isArray(gig.packages) && gig.packages.length > 0) {
      return gig.packages.reduce((acc, pkg, index) => {
        const key = pkg.slug || ['basic', 'standard', 'premium'][index] || `tier-${index + 1}`;
        acc[key] = {
          name: pkg.name || key.charAt(0).toUpperCase() + key.slice(1),
          price: pkg.price || gig.price || 0,
          desc: pkg.description || pkg.shortDescription || gig.description || '',
          delivery: pkg.deliveryTime || gig.deliveryTime || 2,
          revisions: pkg.revisions ?? 'Unlimited',
        };
        return acc;
      }, {});
    }
    if (gig.price != null) {
      return {
        standard: {
          name: 'Standard',
          price: gig.price,
          desc: gig.description || '',
          delivery: gig.deliveryTime || 2,
          revisions: gig.revisions ?? 'Unlimited',
        },
      };
    }
    return {};
  }, [gig]);

  const tierKeys = Object.keys(packageOptions);
  const resolvedActiveTier = tierKeys.includes(activeTier) ? activeTier : tierKeys[0];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#2bb75c]" />
      </div>
    );
  }

  if (loadError || !gig) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white pt-24 px-4">
        <p className="text-zinc-600 mb-4">{loadError || 'Gig not found'}</p>
        <Link to="/gigs" className="text-[#2bb75c] font-bold hover:underline">Back to marketplace</Link>
      </div>
    );
  }

  const currentGig = gig;

  return (
    <>
      <div className="bg-white min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 mb-6">
            <Link to="/gigs" className="hover:text-success">Gigs</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/gigs/category/graphics-design" className="hover:text-success">Graphics & Design</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-zinc-900">Logo Design</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* Left Content */}
            <div className="lg:w-2/3 space-y-8">
              
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4 leading-tight">
                  {currentGig.title}
                </h1>
                
                <div className="flex items-center gap-4 text-sm mb-6 pb-6 border-b border-zinc-100">
                  <div className="flex items-center gap-2 font-bold text-zinc-900">
                    {currentGig.freelancer?.avatar || currentGig.seller?.avatar ? (
                      <img src={currentGig.freelancer?.avatar || currentGig.seller?.avatar} alt="Seller" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600">
                        {(currentGig.freelancer?.name || 'S')[0]}
                      </div>
                    )}
                    {currentGig.freelancer?.name || 'Verified seller'} <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Top Rated</span>
                  </div>
                  <div className="w-px h-4 bg-zinc-200"></div>
                  <div className="flex items-center gap-1 font-bold text-zinc-900">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    {Number(currentGig.rating || 0).toFixed(1)} <span className="text-zinc-400 font-medium underline cursor-pointer">({currentGig.totalReviews || 0} reviews)</span>
                  </div>
                  <div className="w-px h-4 bg-zinc-200"></div>
                  <div className="font-medium text-zinc-500">{currentGig.totalSales || 0} Orders in Queue</div>
                </div>
              </div>

              {/* Gallery Image */}
              <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-sm">
                {(currentGig.coverImage || currentGig.thumbnail || currentGig.gallery?.[0]?.url) ? (
                  <img src={currentGig.coverImage || currentGig.thumbnail || currentGig.gallery?.[0]?.url} alt="Gig Gallery" className="w-full aspect-video object-cover" />
                ) : (
                  <div className="w-full aspect-video bg-zinc-100 flex items-center justify-center text-zinc-400 font-medium">No preview image</div>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-4">About This Gig</h2>
                <div className="prose prose-slate max-w-none text-zinc-700 space-y-4">
                  <p>{currentGig.description}</p>
                  <p>A polished gig page should tell buyers what they are getting, how quickly they will get it, and why the seller is a safe choice.</p>
                  <p><strong>Why me?</strong></p>
                  <ul className="list-disc pl-5">
                    <li>Reliable and Premium support</li>
                    <li>Fast and professional service</li>
                    <li>Copyrights will be with the customer</li>
                    <li>Get source and editable files ai, eps, psd, pdf and High-quality files</li>
                  </ul>
                  <p>Minimalist Logo | Minimal | Professional | Modern | Text | Vintage | Badge | Hand drawn | Feminine | Signature | Custom Design</p>
                </div>
              </div>

              <hr className="border-zinc-200" />

              {/* Seller Profile Card */}
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-6">About The Seller</h2>
                <div className="bg-surface border border-zinc-200 rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                  {currentGig.freelancer?.avatar || currentGig.seller?.avatar ? (
                    <img src={currentGig.freelancer?.avatar || currentGig.seller?.avatar} alt="Seller" className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-zinc-200 flex items-center justify-center text-2xl font-bold text-zinc-600">
                      {(currentGig.freelancer?.name || 'S')[0]}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-zinc-900 mb-1">{currentGig.freelancer?.name || 'Verified seller'}</h3>
                    <p className="text-zinc-600 font-medium mb-3">Brand Identity Specialist</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm font-bold text-zinc-900 mb-4">
                      <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500 fill-current" /> {Number(currentGig.rating || 0).toFixed(1)} ({currentGig.totalReviews || 0} reviews)</span>
                      <span className="px-2 py-0.5 bg-zinc-200 rounded-md">From: United States</span>
                    </div>
                    <button className="px-6 py-2.5 bg-white border border-zinc-900 text-zinc-900 hover:bg-surface-dark hover:text-white font-bold rounded-xl transition-colors">
                      Contact Me
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Sidebar - Pricing */}
            <div className="lg:w-1/3">
              <div className="sticky top-24 border border-zinc-200 rounded-3xl bg-white shadow-xl overflow-hidden">
                {tierKeys.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 font-medium">
                    Pricing packages are not available for this gig yet.
                  </div>
                ) : (
                  <>
                    <div className="flex border-b border-zinc-100 bg-surface">
                      {tierKeys.map((tier) => (
                        <button
                          key={tier}
                          onClick={() => setActiveTier(tier)}
                          className={`flex-1 py-4 font-bold text-sm text-center transition-colors capitalize ${resolvedActiveTier === tier ? 'bg-white border-t-2 border-t-emerald-500 text-success shadow-[0_-2px_0_0_transparent_inset]' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-xl text-zinc-900">{packageOptions[resolvedActiveTier].name} Package</h3>
                        <div className="text-3xl font-black text-zinc-900">${packageOptions[resolvedActiveTier].price}</div>
                      </div>

                      <p className="text-zinc-600 font-medium text-sm mb-6 min-h-16">
                        {packageOptions[resolvedActiveTier].desc}
                      </p>

                      <div className="flex items-center gap-6 text-sm font-bold text-zinc-700 mb-6 pb-6 border-b border-zinc-100">
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {packageOptions[resolvedActiveTier].delivery} Days Delivery</span>
                        <span className="flex items-center gap-1.5"><RefreshCw className="w-4 h-4" /> {packageOptions[resolvedActiveTier].revisions} Revisions</span>
                      </div>

                      <button
                        className="w-full py-4 bg-success hover:bg-emerald-700 text-white font-bold rounded-xl text-lg shadow-md transition-colors flex items-center justify-center gap-2 mb-3"
                        onClick={() =>
                          requireAuth(() => navigate(`/gigs/checkout/${gigId}?tier=${resolvedActiveTier}`), {
                            returnTo: `/gigs/gig/${gigId}`,
                            state: { intent: 'purchase-gig', gigId, tier: resolvedActiveTier },
                          })
                        }
                        type="button"
                      >
                        Continue (${packageOptions[resolvedActiveTier].price}) <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    requireAuth(
                      () =>
                        toggleSaveGig.mutate({
                          gigId: gigId || currentGig.id,
                          saved: isSaved,
                        }),
                      { returnTo: `/gigs/gig/${gigId}` }
                    )
                  }
                  className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                    isSaved ? 'text-rose-600' : 'text-zinc-500 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />{' '}
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[#2bb75c] transition-colors">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default GigDetail;

