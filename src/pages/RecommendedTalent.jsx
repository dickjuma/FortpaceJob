import React from 'react';
import { ShieldCheck, Target, ThumbsUp, Zap } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import FreelancerCard from '../components/marketplace/FreelancerCard';
import { getClientOpenings, getRecommendedTalent } from './find-talent/talentMarketplaceData';

const RecommendedTalent = () => {
  const [searchParams] = useSearchParams();
  const openings = getClientOpenings();
  const jobId = searchParams.get('jobId') || openings[0].id;
  const job = openings.find((entry) => entry.id === jobId) || openings[0];
  const recommended = getRecommendedTalent(jobId);

  return (
    <>
      <div className="bg-surface-dark pt-16 pb-20 border-b border-zinc-800">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 font-medium mb-6">
            <Zap className="w-4 h-4 fill-current" />
            Fortspace AI Match
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Handpicked for your hiring brief</h1>
          <p className="text-zinc-400 text-lg mb-8">
            Based on the opening <span className="text-white font-semibold">"{job.title}"</span>, the marketplace has ranked candidates with shared skills, verified trust signals, and active availability.
          </p>
          <div className="flex justify-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2 text-zinc-300 bg-white/5 px-4 py-2 rounded-lg">
              <Target className="w-4 h-4 text-success" />
              Skill overlap scoring
            </div>
            <div className="flex items-center gap-2 text-zinc-300 bg-white/5 px-4 py-2 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              Verified trust layer
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommended.map((entry) => (
            <div className="relative group" key={entry.id}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity blur-sm" />
              <div className="relative bg-white rounded-xl h-full flex flex-col">
                <div className="p-4 border-b border-zinc-100 bg-surface/80 rounded-t-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-success font-bold text-sm">
                      <ThumbsUp className="w-4 h-4" />
                      {entry.matchScore}% Match
                    </div>
                    <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-200 px-2 py-1 rounded">
                      {entry.availability}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600 leading-snug">
                    <span className="font-semibold text-zinc-900">Why recommended:</span> Shared coverage across {job.requiredSkills.slice(0, 3).join(', ')}, strong trust signals, and current availability.
                  </p>
                </div>
                <div className="flex-grow rounded-b-xl overflow-hidden border-x border-b border-zinc-200">
                  <FreelancerCard freelancer={entry} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-zinc-600 mb-6">Want a broader list?</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link className="bg-white border border-zinc-200 hover:bg-surface text-zinc-700 px-6 py-3 rounded-xl font-medium transition-colors shadow-sm" to={`/search-results?q=${encodeURIComponent(job.requiredSkills[0])}`}>
              Refine search manually
            </Link>
            <Link className="bg-surface-dark hover:bg-zinc-800 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md" to="/ai-match">
              Generate new AI brief
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecommendedTalent;
