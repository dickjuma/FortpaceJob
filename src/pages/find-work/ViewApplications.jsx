import React, { useState } from 'react';
import { Users, Filter, Star, CheckCircle2, XCircle, ArrowLeft, FileText, ChevronDown } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const MOCK_APPS = [
  { id: 'APP-1', provider: 'DevMasterPro', avatar: 'https://i.pravatar.cc/150?img=11', rating: 4.9, reviews: 142, bid: 6000, time: '3 weeks', country: 'United States', badge: 'Top Rated', status: 'new', match: 98 },
  { id: 'APP-2', provider: 'Sarah_Codes', avatar: 'https://i.pravatar.cc/150?img=9', rating: 5.0, reviews: 89, bid: 5500, time: '1 month', country: 'Canada', badge: 'Verified', status: 'shortlisted', match: 92 },
  { id: 'APP-3', provider: 'GlobalTech Agency', avatar: 'https://i.pravatar.cc/150?img=33', rating: 4.7, reviews: 412, bid: 7500, time: '2 weeks', country: 'India', badge: 'Agency', status: 'new', match: 85 },
];

const ViewApplications = () => {
  const { workId } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all, new, shortlisted
  const [sort, setSort] = useState('match'); // match, price_low, price_high, rating

  const displayedApps = MOCK_APPS.filter(app => filter === 'all' ? true : app.status === filter);

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          
          <Link to="/find-work/my-posted-work" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-brand-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to My Jobs
          </Link>

          <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-zinc-900 mb-2">Review Applications</h1>
              <div className="text-zinc-600 font-medium">Senior React Developer for Dashboard Rebuild</div>
            </div>
            <div className="flex gap-4 text-center">
              <div className="bg-surface px-6 py-3 rounded-xl border border-zinc-100">
                <div className="text-2xl font-black text-brand-600">12</div>
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total</div>
              </div>
              <div className="bg-surface px-6 py-3 rounded-xl border border-zinc-100">
                <div className="text-2xl font-black text-amber-500">3</div>
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Shortlisted</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Filters */}
            <div className="lg:w-64 shrink-0 space-y-6">
              <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
                <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><Filter className="w-4 h-4" /> Views</h3>
                
                <div className="space-y-2">
                  <button onClick={() => setFilter('all')} className={`w-full text-left px-3 py-2 rounded-lg font-bold text-sm transition-colors ${filter === 'all' ? 'bg-brand-50 text-brand-700' : 'text-zinc-600 hover:bg-surface'}`}>
                    All Applications
                  </button>
                  <button onClick={() => setFilter('new')} className={`w-full text-left px-3 py-2 rounded-lg font-bold text-sm transition-colors ${filter === 'new' ? 'bg-brand-50 text-brand-700' : 'text-zinc-600 hover:bg-surface'}`}>
                    New / Unread
                  </button>
                  <button onClick={() => setFilter('shortlisted')} className={`w-full text-left px-3 py-2 rounded-lg font-bold text-sm transition-colors ${filter === 'shortlisted' ? 'bg-amber-50 text-amber-700' : 'text-zinc-600 hover:bg-surface'}`}>
                    Shortlisted
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
                <h3 className="font-bold text-zinc-900 mb-4">Sort By</h3>
                <select 
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-zinc-200 rounded-lg text-sm font-bold text-zinc-700 outline-none cursor-pointer"
                >
                  <option value="match">Best Match</option>
                  <option value="price_low">Lowest Price</option>
                  <option value="price_high">Highest Price</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>

            {/* Application List */}
            <div className="flex-1 space-y-6">
              {displayedApps.length === 0 ? (
                <div className="bg-white border border-zinc-200 rounded-3xl py-20 text-center shadow-sm">
                  <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-zinc-900 mb-1">No applications found</h3>
                  <p className="text-zinc-500 font-medium">Try adjusting your filters.</p>
                </div>
              ) : (
                displayedApps.map(app => (
                  <div key={app.id} className="bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-md transition-shadow group relative overflow-hidden">
                    {app.status === 'shortlisted' && (
                      <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                        Shortlisted
                      </div>
                    )}
                    
                    <div className="flex flex-col md:flex-row gap-6">
                      
                      {/* Provider Info */}
                      <div className="md:w-1/3 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-zinc-100 pb-6 md:pb-0 md:pr-6 shrink-0">
                        <img src={app.avatar} alt={app.provider} className="w-20 h-20 rounded-full mb-3" />
                        <h3 className="font-bold text-zinc-900 text-lg mb-1">{app.provider}</h3>
                        <div className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded uppercase tracking-wider mb-2">{app.badge}</div>
                        <div className="flex items-center gap-1 font-bold text-zinc-700 text-sm mb-1">
                          <Star className="w-4 h-4 text-amber-500 fill-current" /> {app.rating} ({app.reviews})
                        </div>
                        <div className="text-xs font-medium text-zinc-500">{app.country}</div>
                        
                        <div className="mt-4 w-full">
                          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 text-left">AI Match Score</div>
                          <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-success" style={{ width: `${app.match}%` }}></div>
                          </div>
                        </div>
                      </div>

                      {/* Proposal Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap gap-6 mb-4 bg-surface p-4 rounded-xl border border-zinc-100">
                            <div>
                              <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Bid Amount</div>
                              <div className="text-xl font-black text-success">${app.bid}</div>
                            </div>
                            <div>
                              <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Delivery Time</div>
                              <div className="text-xl font-black text-zinc-900">{app.time}</div>
                            </div>
                          </div>
                          
                          <p className="text-sm font-medium text-zinc-700 line-clamp-3 mb-4">
                            "Hello! I am a senior React developer with 5 years of experience building complex enterprise dashboards. I've reviewed your requirements and I'm highly confident I can deliver a performant, pixel-perfect rebuild using Tailwind..."
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-4">
                          <button className="flex-1 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors">
                            Message
                          </button>
                          <button onClick={() => navigate(`/find-work/work/${workId}/hire`)} className="flex-1 px-4 py-2 bg-success hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Hire
                          </button>
                          <button className="px-4 py-2 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
                            <FileText className="w-4 h-4" /> View Full
                          </button>
                          <button className="px-3 py-2 bg-white border border-zinc-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-zinc-400 rounded-lg transition-colors" title="Reject">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default ViewApplications;
