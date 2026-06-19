import React, { useEffect, useMemo, useState } from 'react';
import { Star, Clock, Check, RefreshCw, ChevronRight, ShieldCheck, Heart, Share2, Award, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useAuthRedirect } from '../../common/utils/authRedirect';
import { gigAPI, getToken } from '../../common/services/api';
import { useSavedGigIds, useToggleSaveGig } from '../../common/hooks/useSavedGig';

const parseFeatures = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : value.split(',').map((item) => item.trim()).filter(Boolean);
    } catch {
      return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
};

const buildPackageOptions = (gig) => {
  if (!gig) return {
    Standard: {
      name: 'Standard',
      price: 0,
      desc: 'Choose this package to get started.',
      delivery: 3,
      revisions: 1,
      features: ['Source files', 'Responsive design'],
    },
  };

  if (Array.isArray(gig.packages) && gig.packages.length > 0) {
    return gig.packages.reduce((acc, pkg, index) => {
      const key = pkg.name || ['Basic', 'Standard', 'Premium'][index] || `Tier ${index + 1}`;
      acc[key] = {
        name: key,
        price: Number(pkg.price || gig.price || 0),
        desc: pkg.description || pkg.shortDescription || gig.description || '',
        delivery: pkg.deliveryTime || gig.deliveryTime || 3,
        revisions: pkg.revisions ?? 1,
        features: parseFeatures(pkg.features).length > 0 ? parseFeatures(pkg.features) : ['Source files', 'Revisions included'],
      };
      return acc;
    }, {});
  }

  return {
    Standard: {
      name: 'Standard',
      price: Number(gig.price || 0),
      desc: gig.description || 'A great gig from our marketplace.',
      delivery: gig.deliveryTime || 3,
      revisions: gig.revisions ?? 1,
      features: ['Fast delivery', 'High quality', 'Editable source files'],
    },
  };
};

export default function GigDetailsPage() {
  const { id: gigId } = useParams();
  const { requireAuth } = useAuthRedirect();
  const { data: savedGigIds } = useSavedGigIds();
  const toggleSaveGig = useToggleSaveGig();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTier, setActiveTier] = useState('Standard');

  const isSaved = savedGigIds?.has?.(gigId) || savedGigIds?.has?.(String(gigId));

  useEffect(() => {
    let mounted = true;

    const loadGig = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await gigAPI.getGig(gigId);
        if (!mounted) return;
        setGig(data);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Unable to load gig details');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadGig();
    return () => {
      mounted = false;
    };
  }, [gigId]);

  const packageOptions = useMemo(() => buildPackageOptions(gig), [gig]);
  const packageKeys = Object.keys(packageOptions);
  const currentTier = packageKeys.includes(activeTier) ? activeTier : packageKeys[0] || 'Standard';
  const tier = packageOptions[currentTier] || packageOptions.Standard;

  const seller = gig?.freelancer || gig?.seller || {
    name: 'Verified seller',
    level: 'Top Rated',
    rating: 4.8,
    reviews: 0,
    activeOrders: 0,
    location: 'Online',
  };

  const gallery = gig?.gallery?.map((item) => item?.url).filter(Boolean) || [gig?.coverImage || gig?.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'];
  const description = gig?.description || gig?.summary || 'Detailed gig information is not available at the moment.';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-24">
        <Loader2 className="w-10 h-10 animate-spin text-[#4C1D95]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white pt-24 px-4 text-center">
        <p className="text-zinc-600 mb-4">{error}</p>
        <Link to="/search/gigs" className="text-[#4C1D95] font-bold hover:underline">Back to gig marketplace</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex text-sm text-gray-500 mb-6 font-medium">
        <Link to="/search/gigs" className="hover:text-[#4C1D95] transition-colors">Gig Marketplace</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{gig?.category || 'General'}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{gig?.title || 'Untitled gig'}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#4C1D95]/10 dark:bg-[#4C1D95]/50 text-[#4C1D95] flex items-center justify-center font-bold mr-2">{seller.name?.charAt(0) || 'G'}</div>
                <span className="font-bold text-gray-900 dark:text-white">{seller.name}</span>
                <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-bold rounded flex items-center">
                  <Award className="w-3 h-3 mr-1" /> {seller.level}
                </span>
              </div>
              <div className="flex items-center font-bold text-gray-900 dark:text-white">
                <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" /> {Number(seller.rating).toFixed(1)} <span className="text-gray-500 font-normal ml-1">({seller.reviews})</span>
              </div>
              <div className="text-gray-500">{seller.activeOrders} Orders in Queue</div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
            <img src={gallery[0]} alt="Gig Preview" className="w-full h-auto object-cover max-h-[500px]" />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About This Gig</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              {description}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-8">
            <div className="flex justify-end mb-4 space-x-2">
              <button
                type="button"
                onClick={() =>
                  requireAuth(() => toggleSaveGig.mutate({ gigId, saved: isSaved }), {
                    returnTo: `/search/gigs/${gigId}`,
                  })
                }
                className={`p-2 border rounded-full transition-colors ${
                  isSaved
                    ? 'border-rose-200 text-rose-600 bg-rose-50'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-surface dark:hover:bg-gray-800'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-full text-gray-500 hover:bg-surface dark:hover:bg-gray-800 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
              <div className="flex border-b border-gray-200 dark:border-gray-800">
                {packageKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTier(key)}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider text-center transition-colors ${currentTier === key ? 'text-[#4C1D95] border-b-2 border-[#4C1D95]/20 bg-[#4C1D95]/5/50 dark:bg-[#4C1D95]/10' : 'text-gray-500 hover:bg-surface dark:hover:bg-gray-800'}`}
                  >
                    {key}
                  </button>
                ))}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{tier.name}</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${tier.price}</p>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">{tier.desc}</p>

                <div className="flex items-center space-x-6 text-sm font-bold text-gray-900 dark:text-white mb-6">
                  <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-gray-400" /> {tier.delivery} Days Delivery</div>
                  <div className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 text-gray-400" /> {tier.revisions === -1 ? 'Unlimited' : tier.revisions} Revisions</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                      <Check className="w-4 h-4 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className="w-full flex items-center justify-center px-6 py-3.5 bg-[#4C1D95] text-white font-bold text-lg rounded-xl hover:bg-[#22C55E] transition-colors shadow-sm shadow-[#4C1D95]/25/30">
                  Continue (${tier.price}) <ChevronRight className="w-5 h-5 ml-2" />
                </button>
                <div className="mt-4 flex items-center justify-center text-xs text-gray-500 font-medium">
                  <ShieldCheck className="w-4 h-4 mr-1 text-green-500" /> Secure Escrow Payment
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


