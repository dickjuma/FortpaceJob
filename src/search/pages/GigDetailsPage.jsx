import React, { useState } from 'react';
import { Star, Clock, Check, RefreshCw, ChevronRight, ShieldCheck, Heart, Share2, Award } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useAuthRedirect } from '../../common/utils/authRedirect';
import { useSavedGigIds, useToggleSaveGig } from '../../common/hooks/useSavedGig';

export default function GigDetailsPage() {
  const { id: gigId = 'gig-001' } = useParams();
  const { requireAuth } = useAuthRedirect();
  const { data: savedGigIds } = useSavedGigIds();
  const toggleSaveGig = useToggleSaveGig();
  const isSaved = savedGigIds?.has?.(gigId);
  const [activeTier, setActiveTier] = useState('standard');

  const gig = {
    title: 'I will build a custom enterprise React dashboard',
    seller: { name: 'Alex Johnson', level: 'Top Rated', rating: 4.9, reviews: 124, activeOrders: 3, location: 'United States' },
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'],
    description: 'Are you looking for a production-ready, enterprise-grade admin dashboard? I specialize in building highly scalable React applications using TailwindCSS, Redux, and Recharts. This gig guarantees a pixel-perfect, responsive UI that integrates seamlessly with your backend API.',
    tiers: {
      basic: { name: 'Basic Dashboard', price: 500, delivery: 7, revisions: 2, desc: 'Up to 3 pages, basic charts, and responsive layout. No API integration.', features: ['3 Pages', 'Responsive Design', 'Source Code'] },
      standard: { name: 'Standard Enterprise', price: 1200, delivery: 14, revisions: 4, desc: 'Up to 7 pages, advanced Recharts, state management, and API integration.', features: ['7 Pages', 'Responsive Design', 'API Integration', 'State Management', 'Source Code'] },
      premium: { name: 'Full SaaS Platform', price: 2500, delivery: 21, revisions: -1, desc: 'Complete frontend architecture for SaaS. Unlimited pages, auth flows, advanced analytics.', features: ['Unlimited Pages', 'API Integration', 'Authentication Flow', 'Advanced Analytics', 'Source Code', 'Priority Support'] }
    }
  };

  const tier = gig.tiers[activeTier];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex text-sm text-gray-500 mb-6 font-medium">
        <Link to="/search/gigs" className="hover:text-[#4C1D95] transition-colors">Gig Marketplace</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Programming & Tech</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{gig.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#4C1D95]/10 dark:bg-[#4C1D95]/50 text-[#4C1D95] flex items-center justify-center font-bold mr-2">{gig.seller.name[0]}</div>
                <span className="font-bold text-gray-900 dark:text-white">{gig.seller.name}</span>
                <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-bold rounded flex items-center">
                  <Award className="w-3 h-3 mr-1" /> {gig.seller.level}
                </span>
              </div>
              <div className="flex items-center font-bold text-gray-900 dark:text-white">
                <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" /> {gig.seller.rating} <span className="text-gray-500 font-normal ml-1">({gig.seller.reviews})</span>
              </div>
              <div className="text-gray-500">{gig.seller.activeOrders} Orders in Queue</div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
            <img src={gig.images[0]} alt="Gig Preview" className="w-full h-auto object-cover max-h-[500px]" />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About This Gig</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              {gig.description}
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
                {Object.keys(gig.tiers).map(key => (
                  <button 
                    key={key} 
                    onClick={() => setActiveTier(key)}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider text-center transition-colors ${activeTier === key ? 'text-[#4C1D95] border-b-2 border-[#4C1D95]/20 bg-[#4C1D95]/5/50 dark:bg-[#4C1D95]/10' : 'text-gray-500 hover:bg-surface dark:hover:bg-gray-800'}`}
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
                  {tier.features.map(feature => (
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


