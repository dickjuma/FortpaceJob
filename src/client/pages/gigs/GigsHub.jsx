import React, { useState } from 'react';
import { Search, Star, TrendingUp, Sparkles, Monitor, Palette, Code, Video, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useFeaturedGigs, useGigCategories } from '../../../platform/common/hooks/useGigsMarketplace';

const CATEGORY_ICONS = [Palette, Code, Video, Monitor];

const GigsHub = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { gigs: featuredGigs, loading: isLoadingGigs } = useFeaturedGigs({ limit: 8, sortBy: 'rating' });
  const { categories, loading: isLoadingCategories } = useGigCategories();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search) navigate(`/gigs/search?q=${search}`);
  };

  return (
    <>
      <div className="bg-[#4C1D95] text-white pt-24 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-success rounded-full blur-[100px]"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#4C1D95] rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-5xl text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6">Find the perfect <i className="font-serif">freelance</i> services for your business</h1>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto bg-white rounded-xl p-2 flex items-center shadow-2xl mb-8">
            <Search className="w-6 h-6 text-zinc-400 ml-4 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Try 'build mobile app'"
              className="w-full py-3 text-zinc-900 text-lg bg-transparent focus:outline-none font-medium placeholder:text-zinc-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="px-8 py-3 bg-success hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors whitespace-nowrap">
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
            <span className="text-zinc-300">Popular:</span>
            {['Website Design', 'WordPress', 'Logo Design', 'AI Services'].map((tag) => (
              <button key={tag} onClick={() => navigate(`/gigs/search?q=${tag}`)} className="px-4 py-1.5 border border-white/30 rounded-full hover:bg-white hover:text-zinc-900 transition-colors">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-zinc-900 mb-8 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500" /> Browse by Category
            </h2>
            {isLoadingCategories ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#4C1D95]" />
              </div>
            ) : categories.length === 0 ? (
              <p className="text-center text-zinc-500 font-medium py-8">No categories available yet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((cat, index) => {
                  const Icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];
                  return (
                    <Link key={cat.id} to={`/gigs/category/${cat.id}`} className="bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-lg hover:-tranzinc-y-1 transition-all group text-center cursor-pointer">
                      <div className="w-16 h-16 mx-auto bg-emerald-50 text-success rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-zinc-900 mb-1">{cat.name}</h3>
                      <div className="text-sm font-medium text-zinc-500">{cat.count} gigs</div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-[#4C1D95]" /> Trending Services
              </h2>
              <Link to="/gigs/search?trending=true" className="text-success font-bold hover:underline text-sm">See All</Link>
            </div>

            {isLoadingGigs ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-[#4C1D95]" />
              </div>
            ) : featuredGigs.length === 0 ? (
              <p className="text-center text-zinc-500 font-medium py-12">No featured gigs available right now.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredGigs.map((gig) => (
                  <Link key={gig.id} to={`/gigs/gig/${gig.id}`} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-zinc-300 transition-all group flex flex-col cursor-pointer">
                    <div className="h-48 overflow-hidden relative bg-zinc-100">
                      {gig.img ? (
                        <img src={gig.img} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm font-medium">No image</div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-zinc-200 rounded-full"></div>
                        <span className="text-sm font-bold text-zinc-700">{gig.seller}</span>
                      </div>
                      <h3 className="font-medium text-zinc-900 mb-4 line-clamp-2 group-hover:text-success transition-colors leading-relaxed">
                        {gig.title}
                      </h3>

                      <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
                        <div className="flex items-center gap-1 font-bold text-zinc-900">
                          <Star className="w-4 h-4 text-amber-500 fill-current" />
                          {gig.rating} <span className="text-zinc-400 font-medium text-sm">({gig.reviews})</span>
                        </div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                          From <span className="text-lg text-zinc-900 ml-1">${gig.price}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="mt-20 bg-emerald-900 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
            <div className="relative z-10 md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Turn your skills into a profitable business.</h2>
              <p className="text-emerald-100 text-lg mb-8">Join our community of top freelancers. Package your services into gigs and start earning today.</p>
              <Link to="/gigs/create" className="px-8 py-4 bg-success hover:bg-success text-white font-bold rounded-xl transition-colors shadow-lg text-lg">
                Become a Seller
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default GigsHub;


