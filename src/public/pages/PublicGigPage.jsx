import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Clock, RefreshCw, CheckCircle2, ChevronDown,
  ChevronRight, Heart, Share2, ShieldCheck, Play, Loader2,
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import { gigAPI, publicAPI } from '../../common/services/api';
import { useAuthRedirect } from '../../common/utils/authRedirect';

function buildPackageMap(gig) {
  if (Array.isArray(gig?.packages) && gig.packages.length > 0) {
    return gig.packages.reduce((acc, pkg, index) => {
      const key = ['Basic', 'Standard', 'Premium'][index] || pkg.name || `Tier ${index + 1}`;
      acc[key] = {
        price: Number(pkg.price || gig.price || 0),
        desc: pkg.description || gig.description || '',
        days: pkg.deliveryTime || gig.deliveryTime || 3,
        revisions: pkg.revisions ?? 1,
        features: pkg.features || ['Source files', 'Revisions included'],
      };
      return acc;
    }, {});
  }

  const base = Number(gig?.price || 0);
  return {
    Basic: { price: base, desc: gig?.description || '', days: gig?.deliveryTime || 3, revisions: 1, features: ['Delivery included'] },
    Standard: { price: base * 2, desc: gig?.description || '', days: (gig?.deliveryTime || 3) + 2, revisions: 3, features: ['Priority support'] },
    Premium: { price: base * 3, desc: gig?.description || '', days: (gig?.deliveryTime || 3) + 5, revisions: 'Unlimited', features: ['Full scope'] },
  };
}

export default function PublicGigPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { requireAuth } = useAuthRedirect();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePackage, setActivePackage] = useState('Standard');
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        let data;
        if (/^\d+$/.test(String(slug))) {
          data = await gigAPI.getGig(slug);
        } else {
          const res = await publicAPI.searchGigs({ query: slug, limit: 1 });
          const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
          data = items[0];
          if (data?.id) {
            data = await gigAPI.getGig(data.id);
          }
        }
        if (!cancelled) {
          if (!data) throw new Error('Gig not found');
          setGig(data);
          const keys = Object.keys(buildPackageMap(data));
          setActivePackage(keys[1] || keys[0] || 'Standard');
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load gig');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const packages = useMemo(() => (gig ? buildPackageMap(gig) : {}), [gig]);
  const packageKeys = Object.keys(packages);
  const active = packages[activePackage] || packages[packageKeys[0]];
  const faqs = Array.isArray(gig?.faqs) && gig.faqs.length > 0 ? gig.faqs : [];
  const seller = gig?.freelancer || {};
  const gallery = gig?.gallery?.length ? gig.gallery : [{ url: gig?.coverImage || gig?.thumbnail }].filter((g) => g?.url);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#14a800]" />
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 px-4">
        <p className="text-zinc-600 mb-4">{error || 'Gig not found'}</p>
        <Link to="/gigs" className="text-[#14a800] font-bold hover:underline">Browse gigs</Link>
      </div>
    );
  }

  const gigId = gig.id;
  const tierKey = activePackage.toLowerCase();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans pb-24 pt-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-6">
          <Link to="/" className="hover:text-[#14a800]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/gigs" className="hover:text-[#14a800]">Gigs</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-800 truncate">{gig.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 leading-tight mb-6">{gig.title}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <img
                  src={seller.avatar || `https://i.pravatar.cc/150?u=${seller.id || 'seller'}`}
                  alt={seller.name || 'Seller'}
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-bold text-zinc-900 text-sm">{seller.name || 'Verified seller'}</span>
                <span className="text-amber-600 text-sm font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Top Rated
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-bold text-sm">{Number(gig.rating || 5).toFixed(1)}</span>
                <span className="text-zinc-500 text-sm">({gig.totalReviews || 0} reviews)</span>
              </div>
            </div>

            {gallery[0]?.url && (
              <div className="mb-12 relative aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-200">
                <img src={gallery[0].url} alt={gig.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                  <Play className="w-10 h-10 text-white" />
                </div>
              </div>
            )}

            <div className="mb-12 prose max-w-none text-zinc-600">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">About this gig</h2>
              <p className="whitespace-pre-wrap">{gig.description}</p>
            </div>

            {faqs.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-zinc-900 mb-6">FAQ</h2>
                <div className="space-y-4">
                  {faqs.map((item, idx) => (
                    <div key={idx} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full px-6 py-4 flex justify-between items-center text-left font-bold"
                      >
                        {item.question || item.q}
                        <ChevronDown className={cn('w-5 h-5 transition-transform', openFaq === idx && 'rotate-180')} />
                      </button>
                      <AnimatePresence>
                        {openFaq === idx && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="px-6 pb-4 text-zinc-600">
                            {item.answer || item.a}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-[400px] shrink-0">
            <div className="sticky top-28 bg-white rounded-3xl border border-zinc-200 p-1 shadow-xl">
              <div className="flex bg-zinc-100 rounded-2xl p-1 mb-6">
                {packageKeys.map((pkg) => (
                  <button
                    key={pkg}
                    type="button"
                    onClick={() => setActivePackage(pkg)}
                    className={cn(
                      'flex-1 py-3 text-sm font-bold rounded-xl transition-all',
                      activePackage === pkg ? 'bg-white shadow-sm' : 'text-zinc-500'
                    )}
                  >
                    {pkg}
                  </button>
                ))}
              </div>

              <div className="px-5 pb-6">
                <div className="flex justify-between mb-4">
                  <h3 className="text-xl font-bold">{activePackage}</h3>
                  <span className="text-2xl font-black">${active?.price}</span>
                </div>
                <p className="text-sm text-zinc-600 mb-6 line-clamp-3">{active?.desc}</p>
                <div className="flex gap-6 text-sm font-bold text-zinc-700 mb-6 pb-6 border-b">
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {active?.days} days</span>
                  <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4" /> {active?.revisions} revisions</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {(active?.features || []).map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm text-zinc-600">
                      <CheckCircle2 className="w-5 h-5 text-[#14a800]" /> {feat}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() =>
                    requireAuth(() => navigate(`/gigs/checkout/${gigId}?tier=${tierKey}`), {
                      returnTo: `/gig/${slug}`,
                    })
                  }
                  className="w-full py-4 bg-[#14a800] hover:bg-[#118a00] text-white font-bold rounded-xl mb-3"
                >
                  Continue (${active?.price})
                </button>
                <Link
                  to={`/gigs/gig/${gigId}`}
                  className="block w-full py-3 text-center border border-zinc-200 font-bold rounded-xl hover:bg-zinc-50"
                >
                  View full details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
