import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Monitor, Search, Star } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { getFindWorkCategories, getFindWorkJobs } from './findWorkData';

export default function OnlineWorkListings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryOptions = getFindWorkCategories().filter((category) => category.id !== 'local-services');

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [budgetTypes, setBudgetTypes] = useState(['Hourly', 'Fixed']);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [establishedOnly, setEstablishedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const jobs = getFindWorkJobs({
    workMode: 'online',
    query,
    categoryIds: selectedCategories,
    budgetTypes,
    verifiedOnly,
    establishedClientsOnly: establishedOnly,
    sortBy,
  });

  const toggleCategory = (categoryId) => {
    setSelectedCategories((current) =>
      current.includes(categoryId) ? current.filter((item) => item !== categoryId) : [...current, categoryId]
    );
  };

  const toggleBudgetType = (budgetType) => {
    setBudgetTypes((current) =>
      current.includes(budgetType) ? current.filter((item) => item !== budgetType) : [...current, budgetType]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setBudgetTypes(['Hourly', 'Fixed']);
    setVerifiedOnly(false);
    setEstablishedOnly(false);
    setSortBy('recommended');
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (query.trim()) {
      next.set('q', query.trim());
    } else {
      next.delete('q');
    }
    setSearchParams(next);
  };

  return (
    <>
      <div className="bg-surface-dark text-white py-12 border-b border-zinc-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold tracking-wide mb-3 border border-brand-500/30">
                <Monitor className="w-4 h-4" /> ONLINE WORK
              </div>
              <h1 className="text-3xl font-black mb-2">Remote Opportunities</h1>
              <p className="text-zinc-400">Browse classified, searchable, proposal-ready roles for remote specialists.</p>
            </div>

            <form onSubmit={handleSearchSubmit} className="w-full md:w-[30rem] flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -tranzinc-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by keyword, client, or skill..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-brand-500 text-sm font-medium shadow-inner"
                />
              </div>
              <button type="submit" className="px-5 py-3 bg-brand-600 hover:bg-brand-700 rounded-xl text-sm font-bold">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-surface min-h-screen py-8">
        <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-72 shrink-0 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-zinc-900">Filters</h3>
                <button type="button" onClick={resetFilters} className="text-xs font-bold text-brand-600 hover:underline">
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-zinc-700 mb-3">Category</h4>
                  <div className="space-y-2">
                    {categoryOptions.map((category) => (
                      <label key={category.id} className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                        />
                        {category.name}
                      </label>
                    ))}
                  </div>
                </div>

                <hr className="border-zinc-100" />

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

                <hr className="border-zinc-100" />

                <div>
                  <h4 className="text-sm font-bold text-zinc-700 mb-3">Client Quality</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
                        checked={verifiedOnly}
                        onChange={() => setVerifiedOnly((current) => !current)}
                      />
                      Payment Verified
                    </label>
                    <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
                        checked={establishedOnly}
                        onChange={() => setEstablishedOnly((current) => !current)}
                      />
                      Previous Hires (10+)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
              <div>
                <div className="font-bold text-zinc-900">{jobs.length} remote roles found</div>
                <div className="text-sm text-zinc-500">Filtered by classification, client trust, and search relevance.</div>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-600">
                Sort by:
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="bg-transparent font-bold text-zinc-900 outline-none cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="newest">Newest</option>
                  <option value="highest-budget">Highest Budget</option>
                  <option value="most-applicants">Most Applicants</option>
                </select>
              </div>
            </div>

            {jobs.length === 0 ? (
              <div className="bg-white border border-zinc-200 rounded-2xl p-10 text-center shadow-sm">
                <Monitor className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
                <h2 className="text-xl font-bold text-zinc-900 mb-2">No remote jobs match these filters yet.</h2>
                <p className="text-zinc-600 mb-6">Try broadening your category selection or switching the sort and client filters.</p>
                <button type="button" onClick={resetFilters} className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl">
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-md hover:border-brand-300 transition-all group">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider">
                          <span className="text-brand-600">{job.category.name}</span>
                          <span className="text-zinc-300">/</span>
                          <span className="text-zinc-500">{job.specialization}</span>
                        </div>
                        <Link to={job.detailPath} className="text-xl font-bold text-zinc-900 group-hover:text-brand-600 transition-colors mb-2 block">
                          {job.title}
                        </Link>
                        <div className="flex items-center gap-3 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                          <span>{job.budgetType}</span>
                          <span className="text-zinc-300">/</span>
                          <span className="text-zinc-900">{job.budgetLabel}</span>
                          <span className="text-zinc-300">/</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {job.postedLabel}
                          </span>
                        </div>
                        <p className="text-zinc-600 text-sm leading-relaxed mb-4 max-w-3xl">{job.summary}</p>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                            <span key={skill} className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-lg border border-zinc-200">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="w-full md:w-auto md:text-right shrink-0">
                        <Link to={job.detailPath} className="block w-full md:w-auto px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors text-center shadow-sm mb-3">
                          View Job
                        </Link>
                        <div className="text-sm font-bold text-zinc-700 mb-1">{job.applicants} Applicants</div>
                        <div className="flex items-center md:justify-end gap-1 text-xs text-zinc-500 font-medium">
                          {job.client.verified && <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />}
                          Payment verified
                          <span className="text-zinc-300">/</span>
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                          {job.client.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
