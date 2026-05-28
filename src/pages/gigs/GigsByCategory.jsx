import React, { useState } from 'react';
import { Star, Filter, ChevronDown, List, Grid } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const MOCK_GIGS = Array(12).fill(null).map((_, i) => ({
  id: i,
  title: ['I will design a unique minimalist logo', 'I will create a stunning UI UX design', 'I will develop a custom WordPress website', 'I will write SEO optimized articles'][i % 4],
  seller: { name: 'CreatorPro', rating: 4.9, reviews: 104 + i * 10, tier: ['Top Rated', 'Level 2', 'New Seller'][i % 3] },
  price: 25 + (i * 15),
  delivery: [1, 3, 5, 7][i % 4],
  img: `https://images.unsplash.com/photo-${['1626785774573-4b799315345d', '1555066931-4365d14bab8c', '1460925895917-afdab827c52f'][i%3]}?auto=format&fit=crop&w=400&q=80`
}));

const GigsByCategory = () => {
  const { categorySlug } = useParams();
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  return (
    <>
      
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 py-10 pt-24">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="text-sm font-medium text-zinc-500 mb-4 uppercase tracking-wider">
            Graphics & Design / {categorySlug || 'Logo Design'}
          </div>
          <h1 className="text-4xl font-black text-zinc-900 mb-4 capitalize">
            {categorySlug ? categorySlug.replace('-', ' ') : 'Logo Design'} Services
          </h1>
          <p className="text-zinc-600 max-w-2xl text-lg">Stand out from the crowd with a custom logo that perfectly captures your brand's essence and leaves a lasting impression.</p>
        </div>
      </div>

      <div className="bg-surface min-h-screen py-8">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 shrink-0 space-y-6">
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
              <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-zinc-700 mb-3">Service Options</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                      <input type="checkbox" className="rounded border-zinc-300 text-success focus:ring-emerald-500" /> Vector File Included
                    </label>
                    <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                      <input type="checkbox" className="rounded border-zinc-300 text-success focus:ring-emerald-500" /> 3D Mockup
                    </label>
                  </div>
                </div>
                
                <hr className="border-zinc-100" />

                <div>
                  <h4 className="text-sm font-bold text-zinc-700 mb-3">Seller Details</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                      <input type="checkbox" className="rounded border-zinc-300 text-success focus:ring-emerald-500" /> Top Rated Seller
                    </label>
                    <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                      <input type="checkbox" className="rounded border-zinc-300 text-success focus:ring-emerald-500" /> English Speaking
                    </label>
                  </div>
                </div>

                <hr className="border-zinc-100" />

                <div>
                  <h4 className="text-sm font-bold text-zinc-700 mb-3">Budget</h4>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-emerald-500" />
                    <input type="number" placeholder="Max" className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-emerald-500" />
                  </div>
                </div>

                <hr className="border-zinc-100" />

                <div>
                  <h4 className="text-sm font-bold text-zinc-700 mb-3">Delivery Time</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                      <input type="radio" name="delivery" className="border-zinc-300 text-success focus:ring-emerald-500" /> Up to 24 hours
                    </label>
                    <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                      <input type="radio" name="delivery" className="border-zinc-300 text-success focus:ring-emerald-500" /> Up to 3 days
                    </label>
                    <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                      <input type="radio" name="delivery" className="border-zinc-300 text-success focus:ring-emerald-500" /> Any
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
              <span className="font-bold text-zinc-900">12,400 services available</span>
              <div className="flex items-center gap-4">
                <select className="bg-transparent text-sm font-bold text-zinc-700 outline-none cursor-pointer">
                  <option>Sort by: Recommended</option>
                  <option>Sort by: Best Selling</option>
                  <option>Sort by: Newest Arrivals</option>
                </select>
                <div className="flex border border-zinc-200 rounded-lg overflow-hidden">
                  <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode==='grid' ? 'bg-zinc-100 text-success' : 'bg-white text-zinc-400 hover:text-zinc-900'}`}><Grid className="w-4 h-4" /></button>
                  <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode==='list' ? 'bg-zinc-100 text-success' : 'bg-white text-zinc-400 hover:text-zinc-900'}`}><List className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
              {MOCK_GIGS.map(gig => (
                <Link key={gig.id} to={`/gigs/gig/${gig.id}`} className={`bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all group flex cursor-pointer ${viewMode === 'list' ? 'flex-row h-48' : 'flex-col'}`}>
                  <div className={`${viewMode === 'list' ? 'w-48 shrink-0' : 'h-48'} overflow-hidden relative`}>
                    <img src={gig.img} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-zinc-200 rounded-full"></div>
                      <span className="text-sm font-bold text-zinc-700">{gig.seller.name}</span>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded ml-auto">{gig.seller.tier}</span>
                    </div>
                    <h3 className="font-medium text-zinc-900 mb-4 line-clamp-2 group-hover:text-success transition-colors leading-relaxed">
                      {gig.title}
                    </h3>
                    
                    <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
                      <div className="flex items-center gap-1 font-bold text-zinc-900">
                        <Star className="w-4 h-4 text-amber-500 fill-current" />
                        {gig.seller.rating} <span className="text-zinc-400 font-medium text-sm">({gig.seller.reviews})</span>
                      </div>
                      <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        From <span className="text-lg text-zinc-900 ml-1">${gig.price}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(page => (
                  <button key={page} className={`w-10 h-10 rounded-full font-bold transition-colors ${page === 1 ? 'bg-success text-white shadow-md' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-surface'}`}>
                    {page}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default GigsByCategory;
