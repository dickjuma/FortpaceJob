import React, { useState } from 'react';
import { Search, Filter, Heart, Eye, Play, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVideoFeed } from '../../platform/common/hooks/usePublicDiscovery';

const CATEGORIES = ['All', 'Animation', 'Branding', 'Illustration', 'Mobile', 'Print', 'Product Design', 'Typography', 'Web Design'];

const PortfolioShowcase = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { videos, loading } = useVideoFeed(24);

  const items = videos.map((item, index) => ({
    id: item.id || item._id || `portfolio-${index}`,
    title: item.title || item.caption || 'Portfolio work',
    author: item.author?.name || item.freelancerName || item.ownerName || 'Creator',
    image: item.thumbnail || item.coverImage || item.url || '',
    likes: item.likes || item.likeCount || 0,
    views: item.views || item.viewCount || 0,
    type: item.category || item.type || 'Work',
    isVideo: !!(item.url || item.videoUrl),
  }));

  const filtered = activeCategory === 'All'
    ? items
    : items.filter((item) => item.type?.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <>
      <div className="bg-white min-h-screen pt-12 pb-24">
        <div className="container mx-auto px-4 md:px-8">

          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400" />
              <input type="text" placeholder="Search portfolios..." className="w-full bg-surface border border-zinc-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#4C1D95]/20 text-sm font-medium" />
            </div>
            <button type="button" className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 hover:bg-surface transition-colors w-full md:w-auto">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-4 hide-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-colors ${activeCategory === cat ? 'bg-surface-dark text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#4C1D95]" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-zinc-500 font-medium py-16">No portfolio items to show yet.</p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filtered.map((item) => (
                <div key={item.id} className="break-inside-avoid group cursor-pointer">
                  <div className="relative w-full rounded-2xl overflow-hidden mb-3 min-h-[12rem] bg-zinc-100">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center text-zinc-400 text-sm">No preview</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      <h3 className="text-white font-bold text-lg leading-tight truncate pr-4">{item.title}</h3>
                      <Link to={`/portfolio/case-study/${item.id}`} className="text-sm font-bold text-[#4C1D95] hover:text-white transition-colors mt-2">
                        View Case Study &rarr;
                      </Link>
                    </div>
                    {item.isVideo && (
                      <div className="absolute top-4 left-4 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg pointer-events-none">
                        <Play className="w-3 h-3 text-zinc-900 ml-0.5" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-600">
                        {item.author[0]}
                      </div>
                      <span className="text-sm font-bold text-zinc-900">{item.author}</span>
                      <span className="text-xs bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded font-medium">{item.type}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-medium text-zinc-400">
                      <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {item.likes}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {item.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default PortfolioShowcase;


