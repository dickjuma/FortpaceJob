import React from 'react';
import { AlertTriangle, MapPin, ShieldCheck, Wrench } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import OnsiteWorkerCard from '../components/marketplace/OnsiteWorkerCard';
import { useMarketplaceTalent, useTalentCategories } from '../common/services/talentHooks';
import { getTalentCategoryById } from './find-talent/talentMarketplaceData';

const CategoryDetailsOnsite = () => {
  const { category } = useParams();
  useTalentCategories('onsite');
  const categoryData = getTalentCategoryById(category);

  const { data: workers = [], isLoading } = useMarketplaceTalent({
    categoryIds: categoryData ? [categoryData.id] : category ? [category] : [],
    mode: 'onsite',
    sortBy: 'recommended',
  });

  if (!categoryData && !isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-20">
        <div className="bg-white rounded-3xl border border-zinc-200 p-10 text-center">
          <h1 className="text-3xl font-black text-zinc-900 mb-3">Category not found</h1>
          <Link className="text-[#4C1D95] font-bold" to="/categories">
            Back to categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-emerald-900 text-white pt-16 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),_transparent_30%)]" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-success font-medium mb-4">
              <Link className="hover:text-emerald-300" to="/categories">
                Categories
              </Link>
              <span>/</span>
              <span>{categoryData?.name || category}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              {categoryData?.heroTitle || categoryData?.name}
            </h1>
            <p className="text-lg text-emerald-100/80 mb-8 max-w-2xl">
              {categoryData?.heroDescription || categoryData?.description}
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 max-w-2xl border border-white/20">
              <div className="font-semibold mb-2">Popular service areas</div>
              <div className="flex flex-wrap gap-2">
                {['Nairobi', 'Mombasa', 'Kisumu'].map((city) => (
                  <Link
                    key={city}
                    className="px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
                    to={`/search-results?mode=onsite&location=${encodeURIComponent(city)}&category=${category}`}
                  >
                    {city}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
            <Wrench className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="font-bold text-zinc-900 mb-2">Verified trades</h3>
            <p className="text-sm text-zinc-600">On-site professionals with identity and skill checks.</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
            <MapPin className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="font-bold text-zinc-900 mb-2">Local dispatch</h3>
            <p className="text-sm text-zinc-600">Book field workers near your project location.</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="font-bold text-zinc-900 mb-2">Escrow protected</h3>
            <p className="text-sm text-zinc-600">Milestone payments held until work is approved.</p>
          </div>
        </div>

        {isLoading ? (
          <p className="text-zinc-500">Loading professionals…</p>
        ) : workers.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 flex gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h3 className="font-bold text-amber-900">No on-site matches yet</h3>
              <p className="text-sm text-amber-800 mt-1">Try broadening your location or browse all on-site talent.</p>
              <Link to="/onsite" className="inline-block mt-3 text-[#4C1D95] font-bold">
                Browse on-site directory
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker) => (
              <OnsiteWorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryDetailsOnsite;


