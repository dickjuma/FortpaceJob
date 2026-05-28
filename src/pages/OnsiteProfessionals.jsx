import React from 'react';
import { AlertTriangle, ChevronDown, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import FilterSidebar from '../components/marketplace/FilterSidebar';
import OnsiteWorkerCard from '../components/marketplace/OnsiteWorkerCard';
import { getMarketplaceTalent, getTalentCategories } from './find-talent/talentMarketplaceData';

function toggleListValue(values, nextValue) {
  return values.includes(nextValue) ? values.filter((value) => value !== nextValue) : [...values, nextValue];
}

const OnsiteProfessionals = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const location = searchParams.get('location') || 'San Francisco, CA';
  const sortBy = searchParams.get('sort') || 'recommended';
  const urgent = searchParams.get('urgent') === 'true';
  const rate = searchParams.get('rate') || 'all';
  const availability = searchParams.get('availability') || 'all';
  const categoryIds = searchParams.getAll('category');
  const badgeIds = searchParams.getAll('badge');
  const distanceIds = searchParams.getAll('distance');

  const workers = getMarketplaceTalent({
    query,
    mode: 'onsite',
    categoryIds,
    badges: badgeIds,
    rate,
    availability,
    location,
    urgent,
    sortBy,
  }).filter((worker) => {
    if (!distanceIds.length) {
      return true;
    }

    const maxDistance = Math.min(...distanceIds.map((distance) => Number(distance)));
    return worker.distance <= maxDistance;
  });

  const setParamState = (next) => {
    const params = new URLSearchParams(searchParams);
    next(params);
    setSearchParams(params);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextQuery = String(formData.get('query') || '').trim();
    const nextLocation = String(formData.get('location') || '').trim() || 'San Francisco, CA';
    const params = new URLSearchParams(searchParams);
    if (nextQuery) {
      params.set('q', nextQuery);
    } else {
      params.delete('q');
    }
    params.set('location', nextLocation);
    setSearchParams(params);
  };

  const featuredWorker = workers[0];

  return (
    <>
      <div className="bg-emerald-900 pt-8 pb-12 border-b border-emerald-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Hire Local Onsite Professionals</h1>
            <p className="text-emerald-100/80 text-lg mb-8">
              Search nearby field talent with real trust filters, service areas, and dynamic profile routes for local hiring.
            </p>

            <form className="bg-white rounded-xl p-2 shadow-lg flex flex-col md:flex-row gap-2 max-w-4xl" onSubmit={submitSearch}>
              <div className="flex-1 flex items-center px-4 py-2.5 bg-surface rounded-lg">
                <Search className="w-5 h-5 text-zinc-400 mr-3" />
                <input
                  className="w-full bg-transparent border-none outline-none text-zinc-800"
                  defaultValue={query}
                  name="query"
                  placeholder="What service do you need?"
                  type="text"
                />
              </div>
              <div className="flex-1 flex items-center px-4 py-2.5 bg-surface rounded-lg">
                <MapPin className="w-5 h-5 text-zinc-400 mr-3" />
                <input
                  className="w-full bg-transparent border-none outline-none text-zinc-800"
                  defaultValue={location}
                  name="location"
                  placeholder="City or neighborhood"
                  type="text"
                />
              </div>
              <button className="bg-success hover:bg-emerald-700 text-white px-8 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap shadow-sm" type="submit">
                Search Local
              </button>
            </form>

            <div className="mt-4 flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-white font-medium cursor-pointer">
                <input
                  checked={urgent}
                  className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500/20 cursor-pointer"
                  onChange={(event) => setParamState((params) => params.set('urgent', String(event.target.checked)))}
                  type="checkbox"
                />
                <span className="flex items-center gap-1 text-rose-200">
                  <AlertTriangle className="w-4 h-4" /> Need emergency service
                </span>
              </label>
            </div>
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
                { id: 'background checked', label: 'Background Checked' },
                { id: 'license verified', label: 'License Verified' },
                { id: 'emergency ready', label: 'Emergency Ready' },
              ]}
              categories={getTalentCategories('onsite').map((category) => ({
                id: category.id,
                label: category.name,
                count: getMarketplaceTalent({ mode: 'onsite', categoryIds: [category.id] }).length,
              }))}
              distances={[
                { id: '5', label: 'Within 5 miles' },
                { id: '10', label: 'Within 10 miles' },
                { id: '25', label: 'Within 25 miles' },
              ]}
              onAvailabilityChange={(value) => setParamState((params) => params.set('availability', value))}
              onClear={() => setSearchParams(new URLSearchParams())}
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
              onToggleDistance={(value) =>
                setParamState((params) => {
                  const nextValues = toggleListValue(params.getAll('distance'), value);
                  params.delete('distance');
                  nextValues.forEach((entry) => params.append('distance', entry));
                })
              }
              selectedAvailability={availability}
              selectedBadgeIds={badgeIds}
              selectedCategoryIds={categoryIds}
              selectedDistanceIds={distanceIds}
              selectedRate={rate}
              type="onsite"
            />
          </div>

          <div className="flex-1">
            <div className="w-full h-48 bg-zinc-200 rounded-xl mb-6 relative overflow-hidden border border-zinc-300">
              <img
                alt="Map view"
                className="w-full h-full object-cover opacity-60"
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/70 to-transparent p-6 flex flex-col justify-end">
                <div className="bg-white/90 backdrop-blur rounded-xl px-4 py-3 shadow-lg max-w-sm">
                  <div className="font-bold text-zinc-900">{featuredWorker ? featuredWorker.name : 'Local coverage active'}</div>
                  <div className="text-sm text-zinc-600">
                    {featuredWorker ? `${featuredWorker.distance} miles away • ETA ${featuredWorker.eta}` : 'Browse verified onsite professionals near your service area.'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="text-zinc-600 font-medium">
                <span className="text-zinc-900 font-bold">{workers.length}</span> onsite professionals near {location}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <select
                    className="w-full sm:w-auto appearance-none bg-white border border-zinc-200 text-zinc-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-sm cursor-pointer"
                    onChange={(event) => setParamState((params) => params.set('sort', event.target.value))}
                    value={sortBy}
                  >
                    <option value="recommended">Recommended</option>
                    <option value="rating">Highest Rated</option>
                    <option value="response">Fastest Response</option>
                    <option value="rate_low">Lowest Price</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>

                <button className="lg:hidden p-2 border border-zinc-200 rounded-lg text-zinc-600 hover:bg-surface" type="button">
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              {workers.map((worker) => (
                <OnsiteWorkerCard key={worker.id} worker={worker} />
              ))}
            </div>

            {workers.length === 0 ? (
              <div className="bg-white border border-dashed border-zinc-300 rounded-2xl p-10 text-center text-zinc-600">
                No onsite professionals matched those filters. Try broadening the service radius or turning off emergency-only filtering.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default OnsiteProfessionals;
