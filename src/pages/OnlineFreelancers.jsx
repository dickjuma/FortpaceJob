import React, { useEffect, useState } from 'react';
import { ChevronDown, Search, SlidersHorizontal, Zap, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FilterSidebar from '../components/marketplace/FilterSidebar';
import FreelancerCard from '../components/marketplace/FreelancerCard';
import { useMarketplaceTalent, useTalentCategories } from '../common/services/talentHooks';
import { getTalentCategories, getMarketplaceTalent } from './find-talent/talentMarketplaceData';

function toggleListValue(values, nextValue) {
  return values.includes(nextValue) ? values.filter((value) => value !== nextValue) : [...values, nextValue];
}

const OnlineFreelancers = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort') || 'recommended';
  const rate = searchParams.get('rate') || 'all';
  const provider = searchParams.get('provider') || 'all';
  const availability = searchParams.get('availability') || 'all';
  const categoryIds = searchParams.getAll('category');
  const badgeIds = searchParams.getAll('badge');
  const locationIds = searchParams.getAll('location');

  const locationMap = {
    us: 'United States',
    uk: 'United Kingdom',
    eu: 'Europe',
    africa: 'Africa',
  };

  const location = locationIds.length ? locationMap[locationIds[0]] || '' : '';

  const { data: talent = [], isLoading } = useMarketplaceTalent({
    query,
    mode: 'online',
    categoryIds,
    badges: badgeIds,
    rate,
    availability,
    provider,
    location,
    sortBy,
  });

  useTalentCategories('online');

  const categories = getTalentCategories('online');

  const setParamState = (next) => {
    const params = new URLSearchParams(searchParams);
    next(params);
    setSearchParams(params);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextQuery = String(formData.get('query') || '').trim();
    setParamState((params) => {
      if (nextQuery) {
        params.set('q', nextQuery);
      } else {
        params.delete('q');
      }
    });
  };

  return (
    <>
      <div className="bg-surface-dark pt-8 pb-12 border-b border-zinc-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Hire Online Freelancers</h1>
            <p className="text-zinc-400 text-lg mb-8">
              Browse connected remote talent profiles with working search, trust filters, invite flows, and dynamic profile routes.
            </p>

            <form className="bg-white rounded-xl p-2 shadow-lg flex flex-col md:flex-row gap-2 max-w-3xl" onSubmit={submitSearch}>
              <div className="flex-1 flex items-center px-4 py-2.5 bg-surface rounded-lg">
                <Search className="w-5 h-5 text-zinc-400 mr-3" />
                <input
                  className="w-full bg-transparent border-none outline-none text-zinc-800"
                  defaultValue={query}
                  name="query"
                  placeholder="Search by skills, title, or keyword..."
                  type="text"
                />
              </div>
              <button className="bg-[#2bb75c] hover:bg-[#1d8d38] text-white px-6 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap" type="submit">
                Find Freelancers
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-72 flex-shrink-0">
            <FilterSidebar
              availabilityOptions={[
                { id: 'now', label: 'Available Now' },
                { id: 'week', label: 'Available This Week' },
              ]}
              badgeOptions={[
                { id: 'top rated', label: 'Top Rated' },
                { id: 'identity verified', label: 'Identity Verified' },
                { id: 'enterprise ready', label: 'Enterprise Ready' },
              ]}
              categories={getTalentCategories('online').map((category) => ({
                id: category.id,
                label: category.name,
                count: getMarketplaceTalent({ mode: 'online', categoryIds: [category.id] }).length,
              }))}
              onAvailabilityChange={(value) => setParamState((params) => params.set('availability', value))}
              onClear={() => {
                const nextParams = new URLSearchParams();
                if (query) {
                  nextParams.set('q', query);
                }
                setSearchParams(nextParams);
              }}
              onProviderChange={(value) => setParamState((params) => params.set('provider', value))}
              onRateChange={(value) => setParamState((params) => params.set('rate', value))}
              onToggleBadge={(value) =>
                setParamState((params) => {
                  const nextValues = toggleListValue(params.getAll('badge'), value);
                  params.delete('badge');
                  nextValues.forEach((entry) => params.append('badge', entry));
                })
              }
              onToggleCategory={(value) =>
                setParamState((params) => {
                  const nextValues = toggleListValue(params.getAll('category'), value);
                  params.delete('category');
                  nextValues.forEach((entry) => params.append('category', entry));
                })
              }
              onToggleLocation={(value) =>
                setParamState((params) => {
                  const nextValues = toggleListValue(params.getAll('location'), value);
                  params.delete('location');
                  nextValues.forEach((entry) => params.append('location', entry));
                })
              }
              providerOptions={[
                { id: 'freelancer', label: 'Freelancers' },
                { id: 'agency', label: 'Agencies' },
              ]}
              selectedAvailability={availability}
              selectedBadgeIds={badgeIds}
              selectedCategoryIds={categoryIds}
              selectedLocationIds={locationIds}
              selectedProvider={provider}
              selectedRate={rate}
              type="online"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="text-zinc-600 font-medium">
                Showing <span className="text-zinc-900 font-bold">{talent.length}</span> remote professionals
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  className="flex items-center gap-2 bg-[#2bb75c]/5 text-[#2bb75c] px-3 py-1.5 rounded-lg border border-[#2bb75c]/20 mr-2"
                  onClick={() => navigate('/recommended-talent')}
                  type="button"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold">See AI matches</span>
                </button>

                <div className="relative flex-1 sm:flex-none">
                  <select
                    className="w-full sm:w-auto appearance-none bg-white border border-zinc-200 text-zinc-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2bb75c]/20 focus:border-[#2bb75c]/20 font-medium text-sm cursor-pointer"
                    onChange={(event) => setParamState((params) => params.set('sort', event.target.value))}
                    value={sortBy}
                  >
                    <option value="recommended">Recommended</option>
                    <option value="rating">Highest Rated</option>
                    <option value="rate_low">Lowest Price</option>
                    <option value="rate_high">Highest Price</option>
                    <option value="response">Fastest Response</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>

                <button className="lg:hidden p-2 border border-zinc-200 rounded-lg text-zinc-600 hover:bg-surface" type="button">
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div key={`skeleton-${index}`} className="bg-white border border-zinc-200 rounded-2xl p-6 animate-pulse h-72" />
                  ))
                : talent.map((freelancer) => (
                    <FreelancerCard freelancer={freelancer} key={freelancer.id} />
                  ))}
            </div>

            {!isLoading && talent.length === 0 ? (
              <div className="bg-white border border-dashed border-zinc-300 rounded-2xl p-10 text-center text-zinc-600">
                No talent matched those filters. Try removing a trust badge, widening the rate band, or switching to hybrid talent.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default OnlineFreelancers;

