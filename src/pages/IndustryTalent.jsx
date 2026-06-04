import React from 'react';
import { Link } from 'react-router-dom';
import { getIndustrySpotlights } from './find-talent/talentMarketplaceData';

const IndustryTalent = () => {
  const industries = getIndustrySpotlights();

  return (
    <div className="bg-surface min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mb-10">
          <h1 className="text-4xl font-black text-zinc-900 mb-4">Industry talent</h1>
          <p className="text-lg text-zinc-600">
            Explore role clusters shaped around common hiring patterns in SaaS, healthcare, retail, and real estate.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {industries.map((industry) => (
            <Link
              className="bg-white rounded-3xl p-8 border border-zinc-200 hover:border-[#2bb75c]/50 hover:shadow-xl transition-all group flex flex-col"
              key={industry.id}
              to={`/search-results?q=${encodeURIComponent(industry.name)}`}
            >
              <div className="text-sm uppercase tracking-[0.2em] text-zinc-500 font-bold mb-4">{industry.name}</div>
              <div className="text-zinc-700 leading-relaxed">{industry.summary}</div>
              <div className="mt-6 text-[#2bb75c] font-bold">Explore talent</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndustryTalent;

