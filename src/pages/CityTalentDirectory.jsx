import React from 'react';
import { Link } from 'react-router-dom';
import { getCityDirectory } from './find-talent/talentMarketplaceData';

const CityTalentDirectory = () => {
  const cities = getCityDirectory();

  return (
    <div className="bg-surface min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mb-10">
          <h1 className="text-4xl font-black text-zinc-900 mb-4">City talent directory</h1>
          <p className="text-lg text-zinc-600">
            Browse city-level supply for onsite, hybrid, and support-heavy work using the same shared marketplace coverage.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {cities.map((city) => (
            <Link
              className="bg-white rounded-3xl p-6 border border-zinc-200 hover:border-brand-300 hover:shadow-xl transition-all"
              key={city.city}
              to={`/search-results?location=${encodeURIComponent(city.city)}&mode=all`}
            >
              <div className="text-2xl font-black text-zinc-900">{city.city}</div>
              <div className="text-sm text-zinc-500 mt-2">{city.count} active profiles</div>
              <div className="flex flex-wrap gap-2 mt-4">
                {city.specialties.map((specialty) => (
                  <span className="px-3 py-1 rounded-full bg-zinc-100 text-xs font-medium text-zinc-600" key={specialty}>
                    {specialty}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CityTalentDirectory;
