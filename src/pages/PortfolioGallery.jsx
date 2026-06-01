import React from 'react';
import { Play } from 'lucide-react';

const PORTFOLIO_ITEMS = [
  { id: 1, title: 'Fintech Dashboard UX', category: 'Web Design', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', isVideo: false },
  { id: 2, title: 'E-commerce Mobile App', category: 'App Development', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', isVideo: false },
  { id: 3, title: 'Brand Identity Redesign', category: 'Branding', image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', isVideo: true },
  { id: 4, title: 'Healthcare CRM System', category: 'Software Architecture', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', isVideo: false },
  { id: 5, title: 'SaaS Landing Page', category: 'Web Development', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', isVideo: false },
  { id: 6, title: 'Smart Home IoT Interface', category: 'UI/UX Design', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', isVideo: false },
];

const PortfolioGallery = () => {
  return (
    <>
      <div className="bg-surface py-12 border-b border-zinc-200">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Sarah's Portfolio</h1>
          <p className="text-lg text-zinc-600 max-w-2xl">
            A curated collection of past projects, case studies, and creative work.
          </p>
          
          <div className="flex flex-wrap gap-2 mt-8">
            <button className="px-4 py-2 bg-surface-dark text-white rounded-full text-sm font-medium">All Projects</button>
            <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-600 hover:bg-surface rounded-full text-sm font-medium transition-colors">Web Design</button>
            <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-600 hover:bg-surface rounded-full text-sm font-medium transition-colors">App Development</button>
            <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-600 hover:bg-surface rounded-full text-sm font-medium transition-colors">Branding</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        {/* Masonry-style Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {PORTFOLIO_ITEMS.map(item => (
            <div key={item.id} className="break-inside-avoid group cursor-pointer">
              <div className="relative rounded-2xl overflow-hidden mb-3">
                <img src={item.image} alt={item.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-surface-dark/0 group-hover:bg-surface-dark/40 transition-colors duration-300 flex items-center justify-center">
                  {item.isVideo && (
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-zinc-900 ml-1" />
                    </div>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-zinc-900 group-hover:text-[#14a800] transition-colors">{item.title}</h3>
              <p className="text-sm text-zinc-500">{item.category}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button className="px-8 py-3 bg-white border border-zinc-200 text-zinc-700 font-bold rounded-xl shadow-sm hover:bg-surface transition-colors">
            Load More Projects
          </button>
        </div>
      </div>
    </>
  );
};

export default PortfolioGallery;
