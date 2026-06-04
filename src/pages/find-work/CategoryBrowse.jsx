import React, { useEffect, useState } from 'react';
import { ArrowRight, BrainCircuit, Briefcase, ChevronRight, Code, MapPin, Monitor, Palette, TrendingUp } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getFindWorkCategories, getFindWorkCategoryById, getFindWorkJobs, subscribeToFindWorkData } from './findWorkData';
import { syncJobsWithBackend } from './findWorkWorkflow';

const CATEGORY_ICONS = {
  'web-development': Code,
  'design-creative': Palette,
  'marketing-sales': TrendingUp,
  'data-ai': BrainCircuit,
  'local-services': MapPin,
};

export default function CategoryBrowse() {
  const { categoryId } = useParams();
  const [, setSynced] = useState(0);
  const categories = getFindWorkCategories();
  const activeCategory = categoryId ? getFindWorkCategoryById(categoryId) : null;
  const activeJobs = activeCategory ? getFindWorkJobs({ categoryId: activeCategory.id, sortBy: 'recommended' }).slice(0, 6) : [];

  useEffect(() => {
    syncJobsWithBackend({ limit: 100 }).finally(() => setSynced((n) => n + 1));
    return subscribeToFindWorkData(() => setSynced((n) => n + 1));
  }, []);

  if (!categoryId) {
    return (
      <>
        <div className="bg-[#2bb75c] text-white py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2bb75c]/20 rounded-full blur-3xl -mr-40 -mt-40" />
          <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-6xl">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-8">
              <Link to="/find-work" className="hover:text-white">Find Work</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Categories</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">Browse work by category</h1>
            <p className="text-xl text-zinc-300 max-w-3xl">
              Every category now has real counts, specializations, and route-level detail pages that feed into search and job discovery.
            </p>
          </div>
        </div>

        <div className="bg-surface min-h-screen py-16">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.id] || Briefcase;
            return (
              <Link
                key={category.id}
                to={category.path}
                className="group bg-white rounded-lg border border-gray-200 p-5 hover:border-[#2bb75c]/50 hover:shadow-md transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${category.accentClass} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h2 className="text-base font-bold text-gray-900 group-hover:text-[#1d8d38] transition-colors leading-snug">{category.name}</h2>
                  <span className="text-sm font-bold text-[#2bb75c] whitespace-nowrap">{category.openJobs}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{category.summary}</p>
                <div className="flex items-center gap-1 text-sm font-semibold text-[#2bb75c] group-hover:gap-2 transition-all">
                  Explore category <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
          </div>
        </div>
      </>
    );
  }

  if (!activeCategory) {
    return (
      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <Monitor className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
          <h1 className="text-3xl font-black text-zinc-900 mb-2">Category not found</h1>
          <p className="text-zinc-600 mb-6">This category does not exist in the current find-work catalog.</p>
          <Link to="/find-work/categories" className="px-6 py-3 bg-[#2bb75c] hover:bg-[#1d8d38] text-white font-bold rounded-xl">
            Browse Categories
          </Link>
        </div>
      </div>
    );
  }

  const ActiveIcon = CATEGORY_ICONS[activeCategory.id] || Monitor;

  return (
    <>
      <div className="bg-[#2bb75c] text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2bb75c]/20 rounded-full blur-3xl -mr-40 -mt-40" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-5xl">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-8">
            <Link to="/find-work" className="hover:text-white">Find Work</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/find-work/categories" className="hover:text-white">Categories</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{activeCategory.name}</span>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl ${activeCategory.accentClass}`}>
              <ActiveIcon className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-2">{activeCategory.name}</h1>
              <p className="text-xl text-zinc-300">{activeCategory.longDescription}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 mb-16">
            <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Specializations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCategory.specializations.map((specialization) => (
                  <Link
                    key={specialization}
                    to={`/find-work/search?q=${encodeURIComponent(specialization)}&type=${activeCategory.id === 'local-services' ? 'local' : 'online'}`}
                    className="bg-surface border border-zinc-200 rounded-2xl p-5 hover:shadow-sm hover:border-[#2bb75c]/50 transition-all group"
                  >
                    <h3 className="font-bold text-zinc-900 group-hover:text-[#2bb75c] transition-colors">{specialization}</h3>
                    <p className="text-sm text-zinc-500 font-medium mt-1">Search matching opportunities instantly</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-[#1d8d38] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="relative z-10">
                <div className="text-sm font-bold uppercase tracking-widest text-blue-100 mb-4">Category Snapshot</div>
                <div className="text-5xl font-black mb-2">{activeCategory.openJobs}</div>
                <div className="text-blue-100 font-medium mb-6">Open jobs in {activeCategory.name}</div>
                <p className="text-blue-50 mb-8">
                  Use this category hub to jump into filtered search or head directly into the highest-priority jobs below.
                </p>
                <Link to={`/find-work/search?type=${activeCategory.id === 'local-services' ? 'local' : 'online'}&q=${encodeURIComponent(activeCategory.name)}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2bb75c] font-bold rounded-xl hover:bg-surface transition-colors shadow-lg">
                  Search this category <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Live opportunities</h2>
                <p className="text-zinc-600">The strongest jobs currently mapped to this category.</p>
              </div>
              <Link to={`/find-work/search?type=${activeCategory.id === 'local-services' ? 'local' : 'online'}&q=${encodeURIComponent(activeCategory.name)}`} className="text-[#2bb75c] font-bold text-sm hover:underline">
                View all matching jobs
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeJobs.map((job) => (
                <Link key={job.id} to={job.detailPath} className="bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-md hover:border-[#2bb75c]/50 transition-all group">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${job.workMode === 'local' ? 'text-amber-600' : 'text-[#2bb75c]'}`}>
                      {job.workModeLabel}
                    </span>
                    <span className="text-xs font-bold text-zinc-400">{job.postedLabel}</span>
                  </div>
                  <h3 className="font-bold text-lg text-zinc-900 mb-2 group-hover:text-[#2bb75c] transition-colors">{job.title}</h3>
                  <p className="text-zinc-600 text-sm mb-4">{job.summary}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-black text-zinc-900">{job.budgetLabel}</span>
                    <span className="text-zinc-500 font-medium">{job.client.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

