import React, { useState } from 'react';
import {
  Building,
  CheckCircle2,
  ChevronDown,
  Grid,
  List,
  Map,
  MapPin,
  Play,
  Search,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import FilterSidebar from '../components/marketplace/FilterSidebar';
import FreelancerCard from '../components/marketplace/FreelancerCard';
import OnsiteWorkerCard from '../components/marketplace/OnsiteWorkerCard';
import {
  formatCompactNumber,
  getFeaturedTalent,
  getMarketplaceTalent,
  getRecentMarketplaceActivity,
  getTalentCategories,
  subscribeToTalentData,
  syncTalentWithBackend,
} from './find-talent/talentMarketplaceData';

function toggleListValue(values, nextValue) {
  return values.includes(nextValue) ? values.filter((value) => value !== nextValue) : [...values, nextValue];
}

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [, setDataVersion] = useState(0);

  React.useEffect(() => {
    const unsubscribe = subscribeToTalentData(() => setDataVersion((version) => version + 1));
    syncTalentWithBackend();
    return unsubscribe;
  }, []);
  const query = searchParams.get('q') || '';
  const location = searchParams.get('location') || '';
  const mode = searchParams.get('mode') || 'all';
  const sortBy = searchParams.get('sort') || 'recommended';
  const rate = searchParams.get('rate') || 'all';
  const provider = searchParams.get('provider') || 'all';
  const availability = searchParams.get('availability') || 'all';
  const categoryIds = searchParams.getAll('category');
  const badgeIds = searchParams.getAll('badge');
  const locationIds = searchParams.getAll('locationFilter');

  const locationMap = {
    us: 'United States',
    uk: 'United Kingdom',
    eu: 'Europe',
    africa: 'Africa',
  };

  const resolvedLocation = location || (locationIds.length ? locationMap[locationIds[0]] || '' : '');
  const talent = getMarketplaceTalent({
    query,
    mode,
    categoryIds,
    badges: badgeIds,
    rate,
    availability,
    provider,
    location: resolvedLocation,
    sortBy,
  });
  const featuredTalent = getFeaturedTalent();
  const activity = getRecentMarketplaceActivity();

  const setParamState = (next) => {
    const params = new URLSearchParams(searchParams);
    next(params);
    setSearchParams(params);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextQuery = String(formData.get('query') || '').trim();
    const nextLocation = String(formData.get('location') || '').trim();
    const nextMode = String(formData.get('mode') || 'all');
    const params = new URLSearchParams(searchParams);
    if (nextQuery) {
      params.set('q', nextQuery);
    } else {
      params.delete('q');
    }
    if (nextLocation) {
      params.set('location', nextLocation);
    } else {
      params.delete('location');
    }
    params.set('mode', nextMode);
    setSearchParams(params);
  };

  const categories = getTalentCategories(mode === 'onsite' ? 'onsite' : mode === 'online' ? 'online' : 'all');

  return (
    <>
      <div className="bg-surface-dark text-white pt-20 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-[#2bb75c]/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-[#2bb75c]/20 blur-3xl" />

        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Talent search that connects discovery, evaluation, and hiring in one flow
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Browse trusted professionals, agencies, and onsite specialists with live filters, routed profiles, compare support, and hiring actions.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-medium text-zinc-300 mb-8">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-success" /> Verified professionals</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-success" /> Dynamic profile routing</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-success" /> Invite and hire flows</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link className="px-8 py-4 bg-[#2bb75c] hover:bg-[#1d8d38] text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/50" to="/recommended-talent">
                Explore AI matches
              </Link>
              <Link className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-colors" to="/saved">
                Review saved talent
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
            <div className="aspect-[4/3] bg-gradient-to-tr from-zinc-800 to-zinc-800/50 rounded-2xl border border-zinc-700/50 shadow-2xl overflow-hidden relative group">
              <img
                alt="Team collaborating"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                  <img alt="Featured talent" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&w=128&q=80" />
                </div>
                <div>
                  <div className="font-bold text-white">Live marketplace signal</div>
                  <div className="text-xs text-[#2bb75c]">{activity[0]?.action}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-8 relative z-20">
        <form className="bg-white rounded-2xl shadow-xl border border-zinc-200 p-2 md:p-3 flex flex-col md:flex-row gap-2" onSubmit={submitSearch}>
          <div className="flex-1 flex items-center bg-surface rounded-xl px-4 py-3 border border-zinc-200 hover:border-[#2bb75c]/50 focus-within:border-[#2bb75c]/20 focus-within:bg-white transition-colors">
            <Search className="w-5 h-5 text-zinc-400 mr-3" />
            <input
              className="w-full bg-transparent border-none outline-none text-zinc-900 font-medium placeholder:text-zinc-500 placeholder:font-normal"
              defaultValue={query}
              name="query"
              placeholder="Search developers, designers, marketers, onsite workers..."
              type="text"
            />
          </div>
          <div className="w-full md:w-64 flex items-center bg-surface rounded-xl px-4 py-3 border border-zinc-200 hover:border-[#2bb75c]/50 focus-within:border-[#2bb75c]/20 focus-within:bg-white transition-colors">
            <MapPin className="w-5 h-5 text-zinc-400 mr-3" />
            <input
              className="w-full bg-transparent border-none outline-none text-zinc-900 font-medium placeholder:text-zinc-500 placeholder:font-normal"
              defaultValue={location}
              name="location"
              placeholder="Any location"
              type="text"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-surface border border-zinc-200 rounded-xl px-4 py-3 text-zinc-700 font-medium outline-none hover:border-[#2bb75c]/50 transition-colors hidden sm:block" defaultValue={mode} name="mode">
              <option value="all">Remote and onsite</option>
              <option value="online">Remote only</option>
              <option value="onsite">Onsite only</option>
              <option value="hybrid">Hybrid only</option>
            </select>
            <button className="w-full sm:w-auto px-8 py-3 bg-[#2bb75c] hover:bg-[#1d8d38] text-white font-bold rounded-xl transition-colors whitespace-nowrap" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-10 border-b border-zinc-200">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 hide-scrollbar">
          <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap mr-2">Popular:</span>
          {categories.map((category) => (
            <button
              className="px-4 py-2 rounded-full border border-zinc-200 bg-white text-zinc-700 text-sm font-medium hover:bg-surface hover:border-[#2bb75c]/20 hover:text-[#2bb75c] transition-colors whitespace-nowrap flex items-center gap-2"
              key={category.id}
              onClick={() =>
                setParamState((params) => {
                  params.delete('category');
                  params.append('category', category.id);
                })
              }
              type="button"
            >
              {category.name} <span className="text-zinc-400 text-xs font-normal">{formatCompactNumber(getMarketplaceTalent({ categoryIds: [category.id], mode: category.kind }).length)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-72 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24">
              <FilterSidebar
                badgeOptions={[
                  { id: 'top rated', label: 'Top Rated' },
                  { id: 'identity verified', label: 'Identity Verified' },
                  { id: 'enterprise ready', label: 'Enterprise Ready' },
                ]}
                categories={categories.map((category) => ({
                  id: category.id,
                  label: category.name,
                  count: getMarketplaceTalent({ categoryIds: [category.id], mode: category.kind }).length,
                }))}
                onAvailabilityChange={(value) => setParamState((params) => params.set('availability', value))}
                onClear={() => {
                  const params = new URLSearchParams();
                  if (query) {
                    params.set('q', query);
                  }
                  if (location) {
                    params.set('location', location);
                  }
                  if (mode !== 'all') {
                    params.set('mode', mode);
                  }
                  setSearchParams(params);
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
                    const nextValues = toggleListValue(params.getAll('locationFilter'), value);
                    params.delete('locationFilter');
                    nextValues.forEach((entry) => params.append('locationFilter', entry));
                  })
                }
                selectedAvailability={availability}
                selectedBadgeIds={badgeIds}
                selectedCategoryIds={categoryIds}
                selectedLocationIds={locationIds}
                selectedProvider={provider}
                selectedRate={rate}
                type={mode === 'onsite' ? 'onsite' : 'online'}
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-900">{talent.length} talent matches found</h2>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-xs font-medium">{mode === 'all' ? 'Remote and onsite' : mode}</span>
                  {badgeIds.map((badge) => (
                    <span className="px-3 py-1 bg-[#2bb75c]/5 text-[#2bb75c] border border-[#2bb75c]/20 rounded-full text-xs font-medium" key={badge}>
                      {badge}
                    </span>
                  ))}
                  {categoryIds.length ? (
                    <button className="text-xs text-zinc-500 hover:text-zinc-900" onClick={() => setParamState((params) => params.delete('category'))} type="button">
                      Clear categories
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <select
                    className="w-full appearance-none bg-white border border-zinc-200 rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium text-zinc-700 outline-none hover:bg-surface focus:border-[#2bb75c]/20"
                    onChange={(event) => setParamState((params) => params.set('sort', event.target.value))}
                    value={sortBy}
                  >
                    <option value="recommended">Recommended</option>
                    <option value="rating">Highest Rated</option>
                    <option value="rate_low">Lowest Price</option>
                    <option value="rate_high">Highest Price</option>
                    <option value="response">Fastest Response</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>

                <div className="flex bg-zinc-100 p-1 rounded-lg border border-zinc-200">
                  <button className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#2bb75c]' : 'text-zinc-500 hover:text-zinc-700'}`} onClick={() => setViewMode('grid')} type="button">
                    <Grid className="w-4 h-4" />
                  </button>
                  <button className={`p-1.5 rounded-md ${viewMode === 'compact' ? 'bg-white shadow-sm text-[#2bb75c]' : 'text-zinc-500 hover:text-zinc-700'}`} onClick={() => setViewMode('compact')} type="button">
                    <List className="w-4 h-4" />
                  </button>
                  <button className={`p-1.5 rounded-md ${viewMode === 'map' ? 'bg-white shadow-sm text-[#2bb75c]' : 'text-zinc-500 hover:text-zinc-700'}`} onClick={() => setViewMode('map')} type="button">
                    <Map className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                {talent.map((entry) =>
                  entry.modes.includes('onsite') && !entry.modes.includes('online') ? (
                    <OnsiteWorkerCard key={entry.id} worker={entry} />
                  ) : (
                    <FreelancerCard freelancer={entry} key={entry.id} />
                  )
                )}
              </div>
            ) : null}

            {viewMode === 'compact' ? (
              <div className="space-y-4 mb-12">
                {talent.map((entry) => (
                  <div className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col md:flex-row gap-5 items-start md:items-center" key={entry.id}>
                    <div className="flex-1">
                      <Link className="text-xl font-bold text-zinc-900 hover:text-[#2bb75c] transition-colors" to={`/talent/${entry.id}`}>
                        {entry.name}
                      </Link>
                      <div className="text-zinc-600 mt-1">{entry.title}</div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {entry.skills.slice(0, 4).map((skill) => (
                          <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium" key={skill}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-zinc-900">${entry.hourlyRate}/hr</div>
                      <div className="text-sm text-zinc-500">{entry.availability}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {viewMode === 'map' ? (
              <div className="bg-zinc-200 rounded-2xl h-[600px] w-full mb-12 flex items-center justify-center border border-zinc-300">
                <div className="text-center p-6 bg-white/90 backdrop-blur rounded-xl shadow-lg">
                  <Map className="w-8 h-8 text-[#2bb75c] mx-auto mb-3" />
                  <h3 className="font-bold text-zinc-900">Map view active</h3>
                  <p className="text-sm text-zinc-600">
                    {talent.filter((entry) => entry.modes.includes('onsite')).length} onsite professionals are available in the current result set.
                  </p>
                </div>
              </div>
            ) : null}

            {talent.length === 0 ? (
              <div className="bg-white border border-dashed border-zinc-300 rounded-2xl p-10 text-center text-zinc-600 mb-12">
                No talent matched those filters yet. Try broadening the location, clearing a badge, or switching between remote and onsite modes.
              </div>
            ) : null}

            <div className="mb-16 bg-gradient-to-br from-zinc-900 to-blue-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <Star className="w-64 h-64 text-white" />
              </div>
              <div className="relative z-10 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2bb75c]/20 text-[#2bb75c] text-xs font-bold uppercase tracking-wider mb-4 border border-[#2bb75c]/20/30">
                  Top 1% Talent
                </div>
                <h2 className="text-3xl font-bold mb-2">Featured marketplace leaders</h2>
                <p className="text-[#2bb75c]">Elite talent and agencies linked into the same live hiring flows.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {featuredTalent.slice(0, 2).map((entry, index) => (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xl text-zinc-900 flex flex-col sm:flex-row group hover:-tranzinc-y-1 transition-transform duration-300" key={entry.id}>
                    <div className="w-full sm:w-2/5 h-48 sm:h-auto relative">
                      <img
                        alt={entry.name}
                        className="w-full h-full object-cover"
                        src={index === 0 ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&w=400&q=80' : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&w=400&q=80'}
                      />
                      <div className="absolute inset-0 bg-surface-dark/20 group-hover:bg-transparent transition-colors" />
                      {entry.providerType === 'agency' ? (
                        <div className="absolute top-3 left-3 bg-[#2bb75c] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                          Agency
                        </div>
                      ) : (
                        <div className="absolute bottom-3 left-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 text-[#2bb75c] ml-1" />
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-1 mb-1">
                        <h3 className="font-bold text-lg leading-tight group-hover:text-[#2bb75c] transition-colors">{entry.name}</h3>
                        {entry.providerType === 'agency' ? <Building className="w-4 h-4 text-[#2bb75c]" /> : <ShieldCheck className="w-4 h-4 text-[#2bb75c]" />}
                      </div>
                      <p className="text-sm text-zinc-600 mb-3 line-clamp-1">{entry.title}</p>
                      <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 mb-4">
                        <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> {entry.rating}</div>
                        <div>${entry.hourlyRate}/hr</div>
                      </div>
                      <Link className="w-full py-2 bg-zinc-100 text-center text-zinc-700 rounded-lg text-sm font-bold group-hover:bg-[#2bb75c]/5 group-hover:text-[#2bb75c] transition-colors" to={`/talent/${entry.id}`}>
                        View Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-zinc-900 text-lg">Live marketplace activity</h3>
                <span className="flex items-center gap-2 text-sm text-success font-medium">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> Live
                </span>
              </div>
              <div className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                {activity.map((entry) => (
                  <div className="flex items-center gap-3 w-full" key={entry.actor}>
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 border border-zinc-200">
                      <span className="text-xs font-bold text-zinc-500">{entry.actor.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="text-sm text-zinc-700">
                        <span className="font-bold text-zinc-900">{entry.actor}</span> {entry.action}
                      </div>
                      <div className="text-xs text-zinc-400">{entry.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="py-20 bg-surface border-t border-zinc-200 rounded-3xl text-center px-6">
              <h2 className="text-3xl md:text-5xl font-black text-zinc-900 mb-6">Build your team today</h2>
              <p className="text-zinc-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                Compare saved talent, open a profile, invite the right candidate, and move directly into hiring setup without losing context.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link className="px-8 py-4 bg-[#2bb75c] text-white hover:bg-[#1d8d38] font-bold rounded-xl transition-colors shadow-lg" to="/saved">
                  Open saved collections
                </Link>
                <Link className="px-8 py-4 bg-white border border-zinc-300 text-zinc-700 hover:bg-surface font-bold rounded-xl transition-colors" to="/shortlist">
                  Review shortlist
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResults;

