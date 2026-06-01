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

            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -tranzinc-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-[#14a800]/20 font-medium text-lg shadow-sm"
                  placeholder="Search jobs, clients, skills, or categories..."
                />
              </div>
              <button type="submit" className="px-8 py-4 bg-[#14a800] hover:bg-[#118a00] text-white font-bold rounded-xl transition-colors shadow-sm">
                Search
              </button>
            </form>
          </div>

          <div className="flex gap-2 border-b border-zinc-200 mb-8 overflow-x-auto hide-scrollbar">
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
                    ? 'border-[#14a800]/20 text-[#14a800]'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-64 shrink-0 space-y-6">
              <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Filters
                  </h3>
                  <button type="button" onClick={resetFilters} className="text-xs font-bold text-[#14a800] hover:underline">
                    Clear All
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-700 mb-3">Job Type</h4>
                    <div className="space-y-2">
                      {['Hourly', 'Fixed'].map((budgetType) => (
                        <label key={budgetType} className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-zinc-300 text-[#14a800] focus:ring-[#14a800]"
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
                            className="rounded border-zinc-300 text-[#14a800]"
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
                            className="rounded border-zinc-300 text-[#14a800]"
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
                  <button type="button" onClick={resetFilters} className="px-6 py-3 bg-[#14a800] hover:bg-[#118a00] text-white font-bold rounded-xl">
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {results.map((job) => (
                    <div key={job.id} className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#14a800]/50 transition-all duration-200 flex flex-col h-full">
                      <div className="p-4 flex-1 flex flex-col">
                        {/* Category & Urgent Badge */}
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#14a800]">{job.category.name}</span>
                          {job.urgent && (
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold uppercase rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <Link to={job.detailPath} className="font-semibold text-base text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-[#118a00] transition-colors">
                          {job.title}
                        </Link>

                        {/* Summary */}
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed flex-1">
                          {job.summary}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                          <span className={`px-2 py-0.5 rounded-full font-semibold ${job.workMode === 'local' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                            {job.workMode === 'local' ? '📍 Local' : '🌐 Online'}
                          </span>
                          <span className="font-medium text-gray-700">{job.budgetType}: {job.budgetLabel}</span>
                        </div>
                      </div>

                      {/* Bottom Bar */}
                      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/50 mt-auto">
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-gray-400" />
                              <span className="font-bold text-gray-900">{job.applicants}</span>
                            </span>
                            {job.client.verified && (
                              <span className="flex items-center gap-1 text-[#118a00] font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                              </span>
                            )}
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            {job.budgetLabel}
                          </div>
                        </div>
                        <Link
                          to={job.proposalPath}
                          className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-900 hover:bg-[#14a800] text-white text-sm font-bold rounded-lg transition-colors"
                        >
                          Apply Now <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
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
