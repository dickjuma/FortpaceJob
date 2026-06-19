import React from 'react';
import FreelancerCard from '../components/marketplace/FreelancerCard';
import { getMarketplaceTalent } from '../../client/pages/find-talent/talentMarketplaceData';

const AgencyDirectory = () => {
  const agencies = getMarketplaceTalent({ provider: 'agency', sortBy: 'rating' });

  return (
    <div className="bg-surface min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mb-10">
          <h1 className="text-4xl font-black text-zinc-900 mb-4">Agency directory</h1>
          <p className="text-lg text-zinc-600">
            Discover vetted agencies and delivery squads inside the same connected marketplace used for profiles, invites, and hiring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {agencies.map((agency) => (
            <FreelancerCard freelancer={agency} key={agency.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgencyDirectory;
