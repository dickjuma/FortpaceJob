import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import FreelancerCard from '../components/marketplace/FreelancerCard';
import {
  getMarketplaceTalent,
  getTalentCategoryById,
} from './find-talent/talentMarketplaceData';

const CategoryDetailsOnline = () => {
  const { category } = useParams();
  const categoryData = getTalentCategoryById(category);
  const talent = getMarketplaceTalent({
    categoryIds: categoryData ? [categoryData.id] : [],
    mode: 'online',
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
      <div className="bg-surface-dark text-white pt-16 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_35%)]" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-brand-400 font-medium mb-4">
              <Link className="hover:text-brand-300" to="/categories">
                Categories
              </Link>
              <span>/</span>
              <span>{categoryData.name}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{categoryData.heroTitle}</h1>
            <p className="text-lg text-zinc-300 mb-8 max-w-2xl">{categoryData.heroDescription}</p>
            <div className="flex flex-wrap gap-4">
              <Link className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-medium transition-colors" to={`/search-results?category=${categoryData.id}&mode=online`}>
                Browse Talent
              </Link>
              <Link className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-medium transition-colors border border-white/20" to="/recommended-talent">
                See best matches
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-zinc-900 mb-6">Popular specializations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoryData.subcategories.map((subcategory) => (
              <Link
                className="bg-surface border border-zinc-200 hover:border-brand-500 rounded-xl p-5 flex flex-col items-center justify-center text-center group transition-colors"
                key={subcategory}
                to={`/search-results?q=${encodeURIComponent(subcategory)}&category=${categoryData.id}&mode=online`}
              >
                <span className="font-semibold text-zinc-700 group-hover:text-zinc-900">{subcategory}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 mb-2">Active experts</h2>
              <p className="text-zinc-500">Live marketplace talent pulled from the shared category data.</p>
            </div>
            <Link className="hidden md:flex items-center font-medium text-brand-600 hover:text-brand-700" to={`/search-results?category=${categoryData.id}&mode=online`}>
              View full results <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {talent.map((entry) => (
              <FreelancerCard freelancer={entry} key={entry.id} />
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-8 border border-zinc-200">
          <h3 className="text-xl font-bold text-zinc-900 mb-6">Typical range</h3>
          <div className="bg-white p-5 rounded-xl border border-brand-100 shadow-sm ring-1 ring-brand-500/10">
            <div className="text-brand-600 font-medium mb-1">Marketplace pricing signal</div>
            <div className="text-2xl font-bold text-zinc-900">{categoryData.hourlyRange}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryDetailsOnline;
