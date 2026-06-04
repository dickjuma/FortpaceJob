import React, { useEffect, useState } from 'react';
import { gigAPI } from '../../common/services/api';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function GigsPage() {
  const [gigs, setGigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGigs();
  }, []);

  const loadGigs = async () => {
    try {
      // Assuming a getMyGigs exists or we filter getGigs
      const data = await gigAPI.getGigs({ myGigs: true }); 
      setGigs(data.gigs || data.data || []);
    } catch (err) {
      setError('Failed to load gigs');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading gigs...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">My Services (Gigs)</h1>
        <Link to="/freelancer/gigs/create">
          <button className="bg-[#2bb75c] hover:bg-[#2bb75c] text-white px-4 py-2 rounded-md transition-colors">
            Create New Gig
          </button>
        </Link>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-surface-dark-secondary rounded-xl shadow">
            You haven't created any gigs yet.
          </div>
        ) : (
          gigs.map(gig => (
            <div key={gig.id} className="bg-white dark:bg-surface-dark-secondary rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow">
              {gig.imageUrl && (
                <img src={gig.imageUrl} alt={gig.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate" title={gig.title}>{gig.title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {gig.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    KES {gig.price * 100} 
                  </span>
                  <button 
                    onClick={() => toast('Opening editor...', { icon: '✏️' })}
                    className="text-[#2bb75c] hover:text-[#2bb75c] text-sm font-medium"
                  >
                    Edit Gig
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

