import React from 'react';
import { Award, CheckCircle2, Fingerprint, ShieldCheck } from 'lucide-react';
import FreelancerCard from '../components/marketplace/FreelancerCard';
import { getMarketplaceTalent } from './find-talent/talentMarketplaceData';

const VerifiedTalents = () => {
  const talent = getMarketplaceTalent({ verifiedOnly: true, sortBy: 'rating' });

  return (
    <>
      <div className="bg-surface-dark text-white pt-20 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-success/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-[#14a800]/20 blur-3xl" />

        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-emerald-500/30 text-success font-bold tracking-wide text-sm mb-6">
              <ShieldCheck className="w-4 h-4 fill-current" /> FORTSPACE VERIFIED
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">Hire with absolute confidence</h1>
            <p className="text-lg md:text-xl text-zinc-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              These profiles are pulled from the shared marketplace data and filtered to verified talent only.
            </p>
          </div>

          <div className="w-full max-w-md lg:w-96 flex-shrink-0 bg-zinc-800/50 backdrop-blur border border-zinc-700 p-6 rounded-2xl">
            <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-success" /> Verification stack
            </h3>
            <ul className="space-y-4">
              {[
                'Government ID and identity check',
                'Payment and trust-layer validation',
                'Marketplace trust signals carried into search, profile, and hire flows',
              ].map((item) => (
                <li className="flex items-start gap-3" key={item}>
                  <div className="w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <div className="text-zinc-300 text-sm">{item}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-surface min-h-screen py-16 border-t border-emerald-500/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-success" /> Verified professionals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
            {talent.map((entry) => (
              <FreelancerCard freelancer={entry} key={entry.id} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifiedTalents;
