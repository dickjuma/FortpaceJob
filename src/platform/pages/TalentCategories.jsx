import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCompactNumber, getMarketplaceTalent, getTalentCategories } from '../../client/pages/find-talent/talentMarketplaceData';

const TalentCategories = () => {
  const categories = getTalentCategories('all');

  return (
    <>
      <div className="bg-surface-dark pt-16 pb-20 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#4C1D95]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#4C1D95]/10 blur-3xl" />

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Explore connected <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">talent categories</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Every category now links into a live marketplace slice with routed profiles, filters, shortlist support, and invite flows.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const count = getMarketplaceTalent({ categoryIds: [category.id], mode: category.kind }).length;
            return (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                key={category.id}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link
                  className="group block bg-white rounded-3xl p-6 border border-zinc-200 hover:border-transparent hover:shadow-2xl hover:-tranzinc-y-2 transition-all duration-300 h-full relative overflow-hidden"
                  to={`/categories/${category.kind}/${category.id}`}
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold mb-4">{category.kind}</div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3 group-hover:text-[#4C1D95] transition-colors">{category.name}</h3>
                  <p className="text-zinc-600 mb-6">{category.description}</p>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-zinc-500">{formatCompactNumber(count)} active profiles</span>
                    <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-[#4C1D95] group-hover:tranzinc-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-24">
          <h2 className="text-2xl font-bold text-zinc-900 mb-8 text-center">Trending searches</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['React', 'Design Systems', 'SEO', 'EV Chargers', 'Machine Learning', 'Implementation', 'Smart Home Setup', 'Analytics'].map((skill) => (
              <Link
                className="px-5 py-2.5 bg-surface border border-zinc-200 rounded-full text-zinc-700 font-medium hover:bg-surface-dark hover:text-white hover:border-zinc-900 transition-colors"
                key={skill}
                to={`/search-results?q=${encodeURIComponent(skill)}`}
              >
                {skill}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TalentCategories;


