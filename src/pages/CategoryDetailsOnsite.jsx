import React from 'react';
import { AlertTriangle, MapPin, ShieldCheck, Wrench } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import OnsiteWorkerCard from '../components/marketplace/OnsiteWorkerCard';
import { getMarketplaceTalent, getTalentCategoryById } from './find-talent/talentMarketplaceData';

const CategoryDetailsOnsite = () => {
  const { category } = useParams();
  const categoryData = getTalentCategoryById(category);
  const workers = getMarketplaceTalent({
    categoryIds: categoryData ? [categoryData.id] : [],
    mode: 'onsite',
    sortBy: 'recommended',
  });

  if (!categoryData) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-20">
        <div className="bg-white rounded-3xl border border-zinc-200 p-10 text-center">
          <h1 className="text-3xl font-black text-zinc-900 mb-3">Category not found</h1>
          <Link className="text-brand-600 font-bold" to="/categories">
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
              <span>{categoryData.name}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{categoryData.heroTitle}</h1>
            <p className="text-lg text-emerald-100/80 mb-8 max-w-2xl">{categoryData.heroDescription}</p>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 max-w-2xl border border-white/20">
              <div className="font-semibold mb-2">Popular service areas</div>
              <div className="flex flex-wrap gap-2">
                {['San Francisco', 'Oakland', 'San Jose'].map((city) => (
                  <Link
                    className="px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
                    key={city}
                    to={`/onsite?location=${encodeURIComponent(city)}&category=${categoryData.id}`}
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
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 order-2 lg:order-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900">{categoryData.name} near San Francisco</h2>
                <p className="text-zinc-500 mt-2">Live onsite professionals with service area, distance, and ETA data.</p>
              </div>
              <Link className="px-4 py-2 bg-surface-dark text-white font-bold text-sm rounded-lg" to={`/search-results?category=${categoryData.id}&mode=onsite`}>
                Search all
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {workers.map((worker) => (
                <OnsiteWorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          </div>

          <div className="w-full lg:w-80 flex-shrink-0 order-1 lg:order-2">
            <div className="bg-zinc-200 rounded-2xl h-64 w-full mb-6 relative overflow-hidden border border-zinc-300">
              <img
                alt="Map"
                className="w-full h-full object-cover opacity-70"
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-surface-dark text-white px-5 py-2.5 rounded-lg shadow-lg font-medium text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Live service-area preview
                </div>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 text-rose-600 font-bold mb-3">
                <AlertTriangle className="w-5 h-5" />
                Emergency service
              </div>
              <p className="text-sm text-rose-800 mb-4">
                Need immediate help? Filter the marketplace to available-now pros and jump straight into routed profile review.
              </p>
              <Link className="w-full block text-center py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition-colors shadow-sm" to={`/onsite?urgent=true&category=${categoryData.id}`}>
                Show emergency-ready pros
              </Link>
            </div>

            <div className="bg-surface border border-zinc-200 rounded-2xl p-6">
              <h3 className="font-bold text-zinc-900 mb-4">Fortspace trust signals</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-success flex-shrink-0" />
                  <div className="text-sm text-zinc-600">
                    <strong className="text-zinc-900 block">Background checked</strong>
                    Identity and safety screening for local pros.
                  </div>
                </li>
                <li className="flex gap-3">
                  <Wrench className="w-5 h-5 text-brand-500 flex-shrink-0" />
                  <div className="text-sm text-zinc-600">
                    <strong className="text-zinc-900 block">Service verified</strong>
                    Skill and service-area validation before listing.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryDetailsOnsite;
