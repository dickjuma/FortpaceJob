import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import FreelancerCard from '../components/marketplace/FreelancerCard';
import { useMarketplaceTalent, useTalentCategories } from '../common/services/talentHooks';
import { getTalentCategoryById } from './find-talent/talentMarketplaceData';

const CategoryDetailsOnline = () => {
  const { category } = useParams();
  useTalentCategories('online');
  const categoryData = getTalentCategoryById(category);

  const { data: talent = [], isLoading } = useMarketplaceTalent({
    categoryIds: categoryData ? [categoryData.id] : category ? [category] : [],
    mode: 'online',
    sortBy: 'recommended',
  });

  if (!categoryData && !isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-20">
        <div className="bg-white rounded-3xl border border-zinc-200 p-10 text-center">
          <h1 className="text-3xl font-black text-zinc-900 mb-3">Category not found</h1>
          <Link className="text-[#2bb75c] font-bold" to="/categories">
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
            <div className="flex items-center gap-3 text-[#2bb75c] font-medium mb-4">
              <Link className="hover:text-[#2bb75c]" to="/categories">
                Categories
              </Link>
              <span>/</span>
              <span>{categoryData?.name || category}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              {categoryData?.heroTitle || categoryData?.name}
            </h1>
            <p className="text-lg text-zinc-300 mb-8 max-w-2xl">
              {categoryData?.heroDescription || categoryData?.description}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-zinc-900">Online professionals</h2>
          <Link to={`/search-results?mode=online&category=${category}`} className="text-[#2bb75c] font-bold flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {isLoading ? (
          <p className="text-zinc-500">Loading talent…</p>
        ) : talent.length === 0 ? (
          <p className="text-zinc-500">No online professionals in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {talent.map((entry) => (
              <FreelancerCard key={entry.id} freelancer={entry} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryDetailsOnline;

