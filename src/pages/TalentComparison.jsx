import React from 'react';
import { MapPin, Star } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { getFeaturedTalent, getTalentByIds } from './find-talent/talentMarketplaceData';

const TalentComparison = () => {
  const [searchParams] = useSearchParams();
  const ids = (searchParams.get('ids') || '').split(',').filter(Boolean);
  const talents = ids.length ? getTalentByIds(ids) : getFeaturedTalent().slice(0, 3);

  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-zinc-900">Talent comparison</h1>
            <p className="text-zinc-600 mt-2">Compare live marketplace talent using the same shared profile dataset.</p>
          </div>
          <Link className="px-5 py-3 rounded-xl bg-surface-dark text-white font-semibold hover:bg-zinc-800" to="/search-results">
            Add more talent
          </Link>
        </div>

        <div className="overflow-x-auto bg-white rounded-3xl border border-zinc-200 shadow-sm">
          <table className="w-full min-w-[960px]">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="p-6 text-left text-zinc-500 text-sm font-semibold">Compare</th>
                {talents.map((talent) => (
                  <th className="p-6 border-l border-zinc-100 min-w-[260px] text-left align-top" key={talent.id}>
                    <Link className="font-bold text-zinc-900 hover:text-[#2bb75c] transition-colors text-lg" to={`/talent/${talent.id}`}>
                      {talent.name}
                    </Link>
                    <div className="text-sm text-zinc-500 mt-1">{talent.title}</div>
                    <div className="text-sm font-bold text-zinc-900 mt-4">${talent.hourlyRate}/hr</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-100">
                <td className="p-6 font-semibold text-zinc-700">Rating</td>
                {talents.map((talent) => (
                  <td className="p-6 border-l border-zinc-100" key={`rating-${talent.id}`}>
                    <div className="flex items-center gap-2 text-zinc-900 font-semibold">
                      <Star className="w-4 h-4 text-amber-500 fill-current" /> {talent.rating}
                    </div>
                    <div className="text-sm text-zinc-500 mt-1">{talent.reviews} reviews</div>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-zinc-100">
                <td className="p-6 font-semibold text-zinc-700">Job success</td>
                {talents.map((talent) => (
                  <td className="p-6 border-l border-zinc-100 text-zinc-900 font-semibold" key={`success-${talent.id}`}>
                    {talent.jobSuccess}%
                  </td>
                ))}
              </tr>
              <tr className="border-b border-zinc-100">
                <td className="p-6 font-semibold text-zinc-700">Location</td>
                {talents.map((talent) => (
                  <td className="p-6 border-l border-zinc-100" key={`location-${talent.id}`}>
                    <div className="flex items-center gap-2 text-zinc-700">
                      <MapPin className="w-4 h-4 text-zinc-400" /> {talent.location}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-zinc-100">
                <td className="p-6 font-semibold text-zinc-700">Availability</td>
                {talents.map((talent) => (
                  <td className="p-6 border-l border-zinc-100 text-zinc-700" key={`availability-${talent.id}`}>
                    {talent.availability}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-zinc-100">
                <td className="p-6 font-semibold text-zinc-700">Skills</td>
                {talents.map((talent) => (
                  <td className="p-6 border-l border-zinc-100" key={`skills-${talent.id}`}>
                    <div className="flex flex-wrap gap-2">
                      {talent.skills.slice(0, 5).map((skill) => (
                        <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-xs font-medium text-zinc-600" key={skill}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-6 font-semibold text-zinc-700">Actions</td>
                {talents.map((talent) => (
                  <td className="p-6 border-l border-zinc-100" key={`action-${talent.id}`}>
                    <div className="flex gap-3">
                      <Link className="inline-block w-full text-center px-4 py-2 bg-surface-dark hover:bg-zinc-800 text-white text-sm font-bold rounded-lg transition-colors" to={`/talent/${talent.id}/hire`}>
                        Hire
                      </Link>
                      <Link className="inline-block w-full text-center px-4 py-2 border border-zinc-300 text-zinc-700 text-sm font-bold rounded-lg hover:bg-surface transition-colors" to={`/talent/${talent.id}`}>
                        Profile
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TalentComparison;

