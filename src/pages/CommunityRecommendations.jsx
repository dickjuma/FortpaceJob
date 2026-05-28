import React from 'react';
import { Users, ThumbsUp, MessageSquare, ShieldCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const CommunityRecommendations = () => {
  return (
    <>
      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="w-16 h-16 bg-emerald-100 text-success rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4">Community Recommendations</h1>
            <p className="text-lg text-zinc-600">
              Discover hidden gems highly recommended by peers, past clients, and industry leaders within the Fortspace network.
            </p>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm flex flex-col md:flex-row gap-8">
                
                <div className="md:w-1/3 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-zinc-200 pb-6 md:pb-0 md:pr-6">
                  <img src={`https://ui-avatars.com/api/?name=Freelancer+${i}&background=random`} className="w-24 h-24 rounded-full mb-4 border-4 border-zinc-100" alt="avatar" />
                  <h3 className="text-xl font-bold text-zinc-900 flex items-center justify-center gap-1 mb-1">
                    Alex M. <ShieldCheck className="w-4 h-4 text-brand-500" />
                  </h3>
                  <p className="text-sm text-zinc-500 mb-4">Senior Motion Designer</p>
                  <Link to="/profile" className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-lg transition-colors">
                    View Profile
                  </Link>
                </div>

                <div className="md:w-2/3">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider">
                      Highly Endorsed
                    </span>
                    <span className="text-sm font-medium text-zinc-500">14 Endorsements this month</span>
                  </div>

                  <div className="bg-surface border border-zinc-100 rounded-2xl p-5 mb-4 relative">
                    <div className="absolute top-5 left-5 text-zinc-200">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <p className="text-zinc-600 italic relative z-10 pl-10">
                      "Alex completely transformed our app's onboarding experience. The micro-animations he delivered were flawless, and he communicated perfectly throughout the 2-week sprint. An absolute must-hire for any SaaS company."
                    </p>
                    <div className="flex items-center gap-3 mt-4 pl-10">
                      <img src={`https://ui-avatars.com/api/?name=Client+${i}&background=0D8ABC&color=fff`} className="w-8 h-8 rounded-full" alt="client" />
                      <div>
                        <div className="text-sm font-bold text-zinc-900">Sarah Jenkins</div>
                        <div className="text-xs text-zinc-500">VP of Product, AcmeCorp</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
                    <button className="flex items-center gap-1.5 hover:text-brand-600 transition-colors">
                      <ThumbsUp className="w-4 h-4" /> Upvote Recommendation
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default CommunityRecommendations;
