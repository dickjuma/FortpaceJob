import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Filter, MapPin, Search, Star, Zap } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { getFindWorkJobs } from './findWorkData';

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

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setActiveTab(searchParams.get('type') || 'all');
  }, [searchParams]);

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
                  className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-brand-500 font-medium text-lg shadow-sm"
                  placeholder="Search jobs, clients, skills, or categories..."
                />
              </div>
              <button type="submit" className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-sm">
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
                    ? 'border-brand-600 text-brand-600'
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
                  <button type="button" onClick={resetFilters} className="text-xs font-bold text-brand-600 hover:underline">
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
                            className="rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
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
                            className="rounded border-zinc-300 text-brand-600"
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
                            className="rounded border-zinc-300 text-brand-600"
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
                  <button type="button" onClick={resetFilters} className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl">
                    Reset Filters
                  </button>
                </div>
              ) : (
                results.map((job) => (
                  <div key={job.id} className="bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-md hover:border-brand-300 transition-all group">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        {job.urgent ? (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider rounded-lg mb-3 border border-rose-200">
                            <Zap className="w-3.5 h-3.5 fill-current" /> Urgent Dispatch
                          </div>
                        ) : null}

                        <Link to={job.detailPath} className="text-xl font-bold text-zinc-900 group-hover:text-brand-600 transition-colors mb-2 block">
                          {job.title}
                        </Link>

                        <div className="flex items-center gap-3 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                          <span className={job.workMode === 'local' ? 'text-success' : 'text-brand-600'}>{job.workModeLabel}</span>
                          <span className="text-zinc-300">/</span>
                          <span className="text-zinc-900">{job.budgetType}: {job.budgetLabel}</span>
                        </div>

                        <p className="text-zinc-600 text-sm leading-relaxed mb-4 max-w-2xl">{job.summary}</p>

                        <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {job.postedLabel}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> {job.locationLabel}
                          </span>
                          <span className="px-2 py-1 bg-zinc-100 rounded-lg text-zinc-700 font-bold">{job.experienceLevel}</span>
                        </div>
                      </div>

                      <div className="w-full md:w-auto md:text-right shrink-0 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100">
                        <div className="flex items-center md:justify-end gap-1 text-xs text-zinc-500 font-medium mb-3">
                          {job.client.verified ? <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" /> : null}
                          {job.client.verified ? 'Payment verified' : 'Growing client'}
                          <span className="text-zinc-300">/</span>
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> {job.client.rating}
                        </div>
                        <Link to={job.proposalPath} className="block w-full md:w-auto px-6 py-2.5 bg-surface-dark hover:bg-zinc-800 text-white font-bold rounded-xl transition-colors text-center shadow-sm">
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
