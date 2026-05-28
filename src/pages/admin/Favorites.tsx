// @ts-nocheck
import React from 'react';
import { Card } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Heart, Star } from 'lucide-react';

const favoriteTalents = [
  { id: '1', name: 'Diana Prince', role: 'Senior UX Designer', rating: 4.9, rate: '$65/hr', tags: ['Figma', 'UI/UX', 'Mobile'] },
  { id: '2', name: 'Evan Wright', role: 'Full Stack Engineer', rating: 5.0, rate: '$85/hr', tags: ['React', 'Node.js', 'AWS'] },
];

export const FavoritesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Favorites</h1>
        <p className="text-text-secondary mt-1">Talent and freelancers you have bookmarked.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {favoriteTalents.map(talent => (
          <Card key={talent.id} hover className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <Avatar name={talent.name} size="md" />
                <div>
                  <h3 className="text-lg font-bold text-navy">{talent.name}</h3>
                  <p className="text-sm text-text-secondary">{talent.role}</p>
                </div>
              </div>
              <button className="text-accent-red hover:bg-red-50 p-2 rounded-full transition-colors">
                <Heart size={20} className="fill-accent-red" />
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
              {talent.tags.map(tag => (
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
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
