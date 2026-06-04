import React, { useEffect, useState } from 'react';
import { gigAPI } from '../../common/services/api';

export default function GigsPage() {
  const [gigs, setGigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGigs();
  }, []);

  const loadGigs = async () => {
    try {
      const data = await gigAPI.getGigs(); 
      setGigs(data.gigs || data.data || []);
    } catch (err) {
      setError('Failed to load gigs');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading available gigs...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Browse Services</h1>
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Search services..." 
            className="rounded-md border-gray-300 dark:border-gray-600 bg-surface-white dark:bg-surface-dark focus:border-[#2bb75c]/20 focus:ring-[#2bb75c]"
          />
          <button className="bg-[#2bb75c] hover:bg-[#2bb75c] text-white px-4 py-2 rounded-md transition-colors">
            Search
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-surface-dark-secondary rounded-xl shadow">
            No gigs available at the moment.
          </div>
        ) : (
          gigs.map(gig => (
            <div key={gig.id} className="bg-white dark:bg-surface-dark-secondary rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow">
              {gig.imageUrl ? (
                <img src={gig.imageUrl} alt={gig.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate" title={gig.title}>{gig.title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {gig.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ${gig.price}
                  </span>
                  <button className="text-[#2bb75c] hover:text-[#2bb75c] text-sm font-medium">
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

