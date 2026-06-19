import React from 'react';
import FreelancerCard from '../components/marketplace/FreelancerCard';
import { getMarketplaceTalent } from '../../client/pages/find-talent/talentMarketplaceData';

const RisingTalents = () => {
  const talent = getMarketplaceTalent({ sortBy: 'recommended' }).filter((entry) => entry.risingTalent);

  return (
    <div className="bg-surface min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mb-10">
          <h1 className="text-4xl font-black text-zinc-900 mb-4">Rising talent</h1>
          <p className="text-lg text-zinc-600">
            Emerging marketplace talent with strong trust signals and early performance momentum, all powered by the same shared profile model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {talent.map((entry) => (
            <FreelancerCard freelancer={entry} key={entry.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RisingTalents;
