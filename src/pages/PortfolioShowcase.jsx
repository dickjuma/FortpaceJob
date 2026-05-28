import React, { useState } from 'react';
import { Search, Filter, Heart, Eye, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_PORTFOLIOS = [
  { id: 1, title: 'Fintech Mobile App Redesign', author: 'Sarah W.', image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', height: 'h-64', likes: 245, views: '1.2k', type: 'Design' },
  { id: 2, title: 'E-commerce React Dashboard', author: 'David C.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', height: 'h-96', likes: 189, views: '890', type: 'Development' },
  { id: 3, title: 'Brand Identity Concept', author: 'Elena R.', image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', height: 'h-72', likes: 532, views: '3.4k', type: 'Branding' },
  { id: 4, title: 'Product Launch Video', author: 'Mike T.', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', height: 'h-64', likes: 112, views: '540', type: 'Video', isVideo: true },
  { id: 5, title: 'SaaS Landing Page', author: 'TechFlow Agency', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', height: 'h-80', likes: 320, views: '2.1k', type: 'Web' },
  { id: 6, title: '3D Product Rendering', author: 'Alex B.', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', height: 'h-96', likes: 890, views: '5.6k', type: '3D' },
];

const CATEGORIES = ['All', 'Animation', 'Branding', 'Illustration', 'Mobile', 'Print', 'Product Design', 'Typography', 'Web Design'];

const PortfolioShowcase = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <>
      <div className="bg-white min-h-screen pt-12 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400" />
              <input type="text" placeholder="Search portfolios..." className="w-full bg-surface border border-zinc-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-brand-500 text-sm font-medium" />
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 hover:bg-surface transition-colors w-full md:w-auto">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          {/* Categories Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-4 hide-scrollbar">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-colors ${activeCategory === cat ? 'bg-surface-dark text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry Grid (Approximated with CSS columns) */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {MOCK_PORTFOLIOS.map(item => (
              <div key={item.id} className="break-inside-avoid group cursor-pointer">
                <div className={`relative w-full rounded-2xl overflow-hidden mb-3 ${item.height}`}>
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-white font-bold text-lg leading-tight truncate pr-4">{item.title}</h3>
                      <button className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white hover:text-rose-500 transition-colors flex-shrink-0">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                    <Link to={`/portfolio/case-study/${item.id}`} className="text-sm font-bold text-brand-300 hover:text-white transition-colors">
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
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.author)}&background=random`} className="w-6 h-6 rounded-full" alt="avatar" />
                    <span className="text-sm font-bold text-zinc-900">{item.author}</span>
                    <span className="text-xs bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium text-zinc-400">
                    <span className="flex items-center gap-1 hover:text-rose-500 transition-colors"><Heart className="w-3.5 h-3.5" /> {item.likes}</span>
                    <span className="flex items-center gap-1 hover:text-brand-500 transition-colors"><Eye className="w-3.5 h-3.5" /> {item.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="px-8 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold rounded-xl transition-colors">
              Load More Projects
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default PortfolioShowcase;
