import React from 'react';
import { Bookmark, Star, ArrowLeft, MessageSquare, Trash2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const MOCK_SHORTLIST = [
  { id: 'APP-2', provider: 'Sarah_Codes', avatar: 'https://i.pravatar.cc/150?img=9', rating: 5.0, reviews: 89, bid: 5500, time: '1 month', country: 'Canada', title: 'Senior React Developer' },
  { id: 'APP-5', provider: 'Alex_Frontend', avatar: 'https://i.pravatar.cc/150?img=12', rating: 4.8, reviews: 156, bid: 4800, time: '3 weeks', country: 'United Kingdom', title: 'Senior React Developer' },
];

const ShortlistedApplicants = () => {
  const { workId } = useParams();

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          
          <Link to={`/find-work/work/${workId || 1}/applications`} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-brand-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to All Applications
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shadow-sm">
              <Bookmark className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-zinc-900">Shortlisted Candidates</h1>
              <p className="text-zinc-600 font-medium">Compare your saved applicants for this job.</p>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm p-6 md:p-8">
            
            {MOCK_SHORTLIST.length === 0 ? (
              <div className="py-20 text-center text-zinc-500">
                <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-medium">No candidates shortlisted yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_SHORTLIST.map(applicant => (
                  <div key={applicant.id} className="border border-zinc-200 rounded-2xl p-6 hover:shadow-md transition-shadow relative">
                    <button className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Remove from shortlist">
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                      <img src={applicant.avatar} alt={applicant.provider} className="w-16 h-16 rounded-full border border-zinc-200" />
                      <div>
                        <h3 className="font-bold text-zinc-900 text-lg">{applicant.provider}</h3>
                        <div className="flex items-center gap-1 font-bold text-zinc-700 text-sm">
                          <Star className="w-4 h-4 text-amber-500 fill-current" /> {applicant.rating} ({applicant.reviews})
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 bg-surface p-4 rounded-xl border border-zinc-100">
                      <div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Proposed Bid</div>
                        <div className="font-black text-success text-lg">${applicant.bid}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Timeline</div>
                        <div className="font-bold text-zinc-900">{applicant.time}</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition-colors text-sm">
                        Hire Now
                      </button>
                      <button className="p-2.5 bg-white border border-zinc-200 hover:bg-surface text-zinc-600 rounded-xl transition-colors">
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </>
  );
};

export default ShortlistedApplicants;
