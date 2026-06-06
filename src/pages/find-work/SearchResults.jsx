import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Filter, MapPin, Search, Star, Zap, ArrowRight, Users } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { getFindWorkJobs, subscribeToFindWorkData, syncJobsWithBackend } from './findWorkData';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState(initialType);
  const [budgetTypes, setBudgetTypes] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [, setDataVersion] = useState(0);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setActiveTab(searchParams.get('type') || 'all');
  }, [searchParams]);

  useEffect(() => {
    const unsubscribe = subscribeToFindWorkData(() => setDataVersion((version) => version + 1));
    syncJobsWithBackend();
    return unsubscribe;
  }, []);

  const results = getFindWorkJobs({
    query,
    workMode: activeTab,
    budgetTypes,
    experienceLevels,
    urgentOnly,
    sortBy,
  });

  const counts = {
    all: getFindWorkJobs({ query }).length,
    online: getFindWorkJobs({ query, workMode: 'online' }).length,
    local: getFindWorkJobs({ query, workMode: 'local' }).length,
  };

  const activeFilters = [
    ...budgetTypes,
    ...experienceLevels,
    ...(urgentOnly ? ['Urgent only'] : []),
  ];

  const updateParams = (nextTab, nextQuery) => {
    const next = new URLSearchParams();
    if (nextQuery.trim()) {
      next.set('q', nextQuery.trim());
    }
    next.set('type', nextTab);
    setSearchParams(next);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    updateParams(activeTab, query);
  };

  const toggleBudgetType = (budgetType) => {
    setBudgetTypes((current) =>
      current.includes(budgetType) ? current.filter((item) => item !== budgetType) : [...current, budgetType]
    );
  };

  const toggleExperience = (experienceLevel) => {
    setExperienceLevels((current) =>
      current.includes(experienceLevel) ? current.filter((item) => item !== experienceLevel) : [...current, experienceLevel]
    );
  };

  const resetFilters = () => {
    setBudgetTypes([]);
    setExperienceLevels([]);
    setUrgentOnly(false);
    setSortBy('recommended');
  };

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-zinc-900 mb-4">Search Results{query ? ` for "${query}"` : ''}</h1>

            <form onSubmit={handleSearchSubmit} className="bg-white border border-zinc-200 rounded-3xl shadow-xl p-4 grid gap-4 md:grid-cols-[1.7fr_auto]">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent focus:outline-none focus:border-[#4C1D95]/20 border border-transparent rounded-2xl font-medium text-lg"
                  placeholder="Search jobs, clients, skills, or categories..."
                />
              </div>
              <button type="submit" className="px-8 py-4 bg-[#4C1D95] hover:bg-[#22C55E] text-white font-bold rounded-2xl transition-colors shadow-lg">
                Search
              </button>
            </form>
            <div className="mt-4 rounded-3xl bg-[#effaf3] border border-[#d7f9e3] p-4 text-sm text-zinc-700 flex flex-col sm:flex-row items-center gap-3">
              <span className="font-semibold text-[#4C1D95]">Smart work search</span>
              <span>Use a role, brief, or category to surface prioritized job matches with richer client signals.</span>
              <span className="inline-flex items-center gap-2 text-[#22C55E] font-bold">
                <CheckCircle2 className="w-4 h-4" /> Verified taxonomy-backed results
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { id: 'all', label: `All Results (${counts.all})` },
              { id: 'online', label: `Online Work (${counts.online})` },
              { id: 'local', label: `Local / Onsite (${counts.local})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  updateParams(tab.id, query);
                }}
                className={`px-6 py-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#4C1D95]/20 text-[#4C1D95]'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-72 shrink-0 space-y-6 lg:sticky lg:top-24">
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Filters
                  </h3>
                  <button type="button" onClick={resetFilters} className="text-xs font-semibold text-[#4C1D95] hover:underline">
                    Clear
                  </button>
                </div>

                {activeFilters.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activeFilters.map((filter) => (
                      <span key={filter} className="px-3 py-2 rounded-full bg-[#effaf3] text-xs font-semibold text-[#1f7b46]">
                        {filter}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-zinc-500 mb-4">No filters active yet.</div>
                )}

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-700 mb-3">Job Type</h4>
                    <div className="space-y-2">
                      {['Hourly', 'Fixed'].map((budgetType) => (
                        <label key={budgetType} className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-zinc-300 text-[#4C1D95] focus:ring-[#4C1D95]"
                            checked={budgetTypes.includes(budgetType)}
                            onChange={() => toggleBudgetType(budgetType)}
                          />
                          {budgetType}
                        </label>
                      ))}
                    </div>
                  </div>

                  {activeTab === 'local' ? (
                    <>
                      <hr className="border-zinc-100" />
                      <div>
                        <h4 className="text-sm font-bold text-zinc-700 mb-3">Dispatch Priority</h4>
                        <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-zinc-300 text-[#4C1D95]"
                            checked={urgentOnly}
                            onChange={() => setUrgentOnly((current) => !current)}
                          />
                          Urgent work only
                        </label>
                      </div>
                    </>
                  ) : null}

                  <hr className="border-zinc-100" />

                  <div>
                    <h4 className="text-sm font-bold text-zinc-700 mb-3">Experience Level</h4>
                    <div className="space-y-2">
                      {['Intermediate', 'Expert'].map((experienceLevel) => (
                        <label key={experienceLevel} className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-zinc-300 text-[#4C1D95]"
                            checked={experienceLevels.includes(experienceLevel)}
                            onChange={() => toggleExperience(experienceLevel)}
                          />
                          {experienceLevel}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center bg-white rounded-2xl border border-zinc-200 p-4 shadow-sm">
                <div className="text-sm text-zinc-500">
                  <span className="font-bold text-zinc-900">{results.length}</span> matching opportunities
                </div>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="bg-transparent text-sm font-bold text-zinc-700 outline-none cursor-pointer"
                >
                  <option value="recommended">Sort by: Recommended</option>
                  <option value="newest">Sort by: Newest</option>
                  <option value="highest-budget">Sort by: Highest Budget</option>
                  <option value="most-applicants">Sort by: Most Applicants</option>
                </select>
              </div>

              {results.length === 0 ? (
                <div className="bg-white border border-zinc-200 rounded-2xl p-10 text-center shadow-sm">
                  <Search className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-zinc-900 mb-2">No results matched this search.</h2>
                  <p className="text-zinc-600 mb-6">Try a broader keyword, another tab, or fewer active filters.</p>
                  <button type="button" onClick={resetFilters} className="px-6 py-3 bg-[#4C1D95] hover:bg-[#22C55E] text-white font-bold rounded-xl">
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {results.map((job) => (
                    <Link key={job.id} to={job.detailPath} className="group block bg-white rounded-3xl border border-zinc-200 overflow-hidden hover:shadow-2xl hover:border-[#4C1D95]/50 transition-all duration-200 h-full">
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4 gap-3">
                          <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#4C1D95]">{job.category.name}</span>
                          {job.urgent && (
                            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                              Urgent
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-xl text-zinc-900 mb-3 leading-snug transition-colors group-hover:text-[#22C55E]">{job.title}</h3>

                        <p className="text-sm text-zinc-600 mb-5 line-clamp-3 leading-relaxed flex-1">{job.summary}</p>

                        <div className="flex flex-wrap gap-2 items-center text-xs font-semibold text-zinc-600 mb-5">
                          <span className={`px-3 py-2 rounded-full ${job.workMode === 'local' ? 'bg-amber-50 text-amber-800' : 'bg-blue-50 text-blue-800'}`}>
                            {job.workMode === 'local' ? 'Local' : 'Online'}
                          </span>
                          <span className="px-3 py-2 rounded-full bg-[#eef6ff] text-blue-700">{job.budgetType}</span>
                          <span className="px-3 py-2 rounded-full bg-[#f3fdf4] text-[#1f7b46]">{job.budgetLabel}</span>
                        </div>

                        <div className="mt-auto pt-4 border-t border-zinc-100">
                          <div className="flex items-center justify-between text-sm text-zinc-500">
                            <span>{job.client.name}</span>
                            <span>{job.postedLabel}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


