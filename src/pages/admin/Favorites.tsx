// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Heart, Star } from 'lucide-react';
import { api } from '../../common/services/api';

export const FavoritesPage = () => {
  const [favoriteTalents, setFavoriteTalents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    api
      .get('/admin_rbc/favorites')
      .then(({ data }) => {
        if (!active) return;
        setFavoriteTalents(data.items || data.favorites || []);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || 'Unable to load favorites.');
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#222222]">Favorites</h1>
        <p className="text-text-secondary mt-1">Talent and freelancers you have bookmarked.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-100 p-8 text-center text-zinc-500 animate-pulse">
          Loading favorites...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favoriteTalents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-border">
              <p className="text-text-secondary">No favorite talents found.</p>
            </div>
          ) : (
            favoriteTalents.map((talent) => (
              <Card key={talent.id} hover className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar name={talent.name} size="md" />
                    <div>
                      <h3 className="text-lg font-bold text-[#222222]">{talent.name}</h3>
                      <p className="text-sm text-text-secondary">{talent.role}</p>
                    </div>
                  </div>
                  <button className="text-[#e63946] hover:bg-red-50 p-2 rounded-full transition-colors">
                    <Heart size={20} className="fill-[#e63946]" />
                  </button>
                </div>

                <div className="flex items-center space-x-4 mb-4 text-sm font-medium">
                  <div className="flex items-center text-warning">
                    <Star size={16} className="fill-warning mr-1" />
                    {talent.rating}
                  </div>
                  <div className="text-text-primary">{talent.rate}</div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {(talent.tags || []).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-light-gray text-text-primary text-xs rounded-md font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1">View Profile</Button>
                  <Button variant="primary" className="flex-1">Invite to Job</Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
