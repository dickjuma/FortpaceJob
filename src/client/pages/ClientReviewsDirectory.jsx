import React from 'react';
import { Star, ThumbsUp, MapPin, Building2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const ClientReviewsDirectory = () => {
  const { data: directoryData } = useQuery({
    queryKey: ['client', 'directory'],
    queryFn: async () => {
      return [
        { id: '1', client: 'AcmeCorp', loc: 'San Francisco, CA', jobs: 45, rating: 4.9, review: "Consistently find the best React talent here. Communication is seamless." },
        { id: '2', client: 'Vault Finance', loc: 'London, UK', jobs: 12, rating: 5.0, review: "We hired a completely remote security team through Fortspace. The talent quality is enterprise-grade." },
        { id: '3', client: 'Global Logistics', loc: 'Berlin, DE', jobs: 89, rating: 4.8, review: "The onsite dispatch feature saved us during an emergency outage. Excellent platform." }
      ];
    }
  });
  const items = directoryData || [];
  return (
    <>
      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          
          <div className="mb-12">
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Client Reviews Directory</h1>
            <p className="text-zinc-600">Browse verified feedback from top enterprise companies hiring on Fortspace.</p>
          </div>

          <div className="space-y-6">
            {[
              { client: 'AcmeCorp', loc: 'San Francisco, CA', jobs: 45, rating: 4.9, review: "Consistently find the best React talent here. Communication is seamless." },
              { client: 'Vault Finance', loc: 'London, UK', jobs: 12, rating: 5.0, review: "We hired a completely remote security team through Fortspace. The talent quality is enterprise-grade." },
              { client: 'Global Logistics', loc: 'Berlin, DE', jobs: 89, rating: 4.8, review: "The onsite dispatch feature saved us during an emergency outage. Excellent platform." }
            ].map((item, i) => (
              <div key={i} className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-600 font-bold text-xl border border-zinc-200">
                      {item.client.charAt(0)}
                    </div>
                    <div>
                      <Link to="/client/profile/" className="font-bold text-xl text-zinc-900 hover:text-[#4C1D95] transition-colors">
                        {item.client}
                      </Link>
                      <div className="flex items-center gap-3 text-sm text-zinc-500 mt-1">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {item.loc}</span>
                        <span>•</span>
                        <span>{item.jobs} Jobs Posted</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 font-bold text-amber-700">
                    <Star className="w-4 h-4 fill-current text-amber-500" /> {item.rating} Avg Rating
                  </div>
                </div>

                <div className="bg-surface p-6 rounded-2xl border border-zinc-100 text-zinc-700 italic">
                  "{item.review}"
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default ClientReviewsDirectory;



