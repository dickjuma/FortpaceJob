import React, { useEffect, useState } from 'react';
import { Star, Filter, List, Grid, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { publicAPI } from '../../common/services/api';
import { extractList, gigCardFromApi } from '../../common/utils/apiHelpers';

const GigsByCategory = () => {
  const { categorySlug } = useParams();
  const [viewMode, setViewMode] = useState('grid');
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    publicAPI
      .searchGigs({ category: categorySlug, limit: 24 })
      .then((raw) => {
        if (!cancelled) setGigs(extractList(raw).map(gigCardFromApi));
      })
      .catch(() => {
        if (!cancelled) setGigs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  return (
    <>
      <div className="bg-white border-b border-zinc-200 py-10 pt-24">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="text-sm font-medium text-zinc-500 mb-4 uppercase tracking-wider">
            {categorySlug ? categorySlug.replace(/-/g, ' ') : 'Category'}
          </div>
          <h1 className="text-4xl font-black text-zinc-900 mb-4 capitalize">
            {categorySlug ? categorySlug.replace(/-/g, ' ') : 'Services'}
          </h1>
        </div>
      </div>

      <div className="bg-surface min-h-screen py-8">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl flex flex-col md:flex-row gap-8">

          <div className="w-full md:w-64 shrink-0 space-y-6">
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
              <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</h3>
              <p className="text-sm text-zinc-500">Refine results using search filters on the gigs search page.</p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
              <span className="font-bold text-zinc-900">{loading ? 'Loading…' : `${gigs.length} services available`}</span>
              <div className="flex border border-zinc-200 rounded-lg overflow-hidden">
                <button type="button" onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-zinc-100 text-success' : 'bg-white text-zinc-400'}`}><Grid className="w-4 h-4" /></button>
                <button type="button" onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-zinc-100 text-success' : 'bg-white text-zinc-400'}`}><List className="w-4 h-4" /></button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#14a800]" />
              </div>
            ) : gigs.length === 0 ? (
              <p className="text-center text-zinc-500 font-medium py-16">No gigs found in this category.</p>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
                {gigs.map((gig) => (
                  <Link key={gig.id} to={`/gigs/gig/${gig.id}`} className={`bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all group flex cursor-pointer ${viewMode === 'list' ? 'flex-row h-48' : 'flex-col'}`}>
                    <div className={`${viewMode === 'list' ? 'w-48 shrink-0' : 'h-48'} overflow-hidden relative bg-zinc-100`}>
                      {gig.img ? (
                        <img src={gig.img} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : null}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
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

        </div>
      </div>
    </>
  );
};

export default GigsByCategory;
