import React from 'react';
import { Star, ThumbsUp, MessageSquare, Filter } from 'lucide-react';

const MOCK_REVIEWS = [
  {
    id: 1,
    client: 'Acme Corp',
    project: 'E-commerce Redesign',
    rating: 5,
    date: '2 weeks ago',
    text: 'Sarah was absolutely incredible to work with. She understood our requirements perfectly and delivered the React frontend ahead of schedule. Her code is clean, well-documented, and highly performant.',
    cost: '$2k - $5k',
    duration: '1 month'
  },
  {
    id: 2,
    client: 'StartupX',
    project: 'SaaS Dashboard Integration',
    rating: 5,
    date: '1 month ago',
    text: 'Extremely professional and communicative. We had some complex state management issues in our dashboard and Sarah resolved them in just a few days. Will definitely hire again.',
    cost: '< $1k',
    duration: '1 week'
  },
  {
    id: 3,
    client: 'GlobalTech Solutions',
    project: 'Node.js API Optimization',
    rating: 4,
    date: '3 months ago',
    text: 'Great work optimizing our database queries and API endpoints. The system runs much faster now. Communication was good, though there was a slight delay in one of the milestones.',
    cost: '$5k - $10k',
    duration: '2 months'
  }
];

const Reviews = () => {
  return (
    <>
      <div className="bg-surface py-12 border-b border-zinc-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">Sarah's Reviews</h1>
              <p className="text-zinc-600">What clients are saying about their experience working with Sarah.</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-zinc-200 flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-zinc-900 flex items-center justify-center gap-1">
                  4.9 <Star className="w-6 h-6 text-amber-400 fill-current" />
                </div>
                <div className="text-sm text-zinc-500 mt-1">124 Reviews</div>
              </div>
              <div className="w-px h-12 bg-zinc-200"></div>
              <div className="space-y-1 w-48">
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} className="flex items-center gap-2 text-xs text-zinc-600">
                    <span className="w-3">{star}</span>
                    <Star className="w-3 h-3 text-zinc-400 fill-current" />
                    <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-400 rounded-full" 
                        style={{ width: star === 5 ? '85%' : star === 4 ? '10%' : star === 3 ? '5%' : '0%' }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-zinc-900">124 Reviews</h2>
          <button className="flex items-center gap-2 text-sm font-medium text-zinc-600 bg-surface border border-zinc-200 px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors">
            <Filter className="w-4 h-4" /> Filter / Sort
          </button>
        </div>

        <div className="space-y-6 max-w-4xl">
          {MOCK_REVIEWS.map(review => (
            <div key={review.id} className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                <div>
                  <h3 className="font-bold text-zinc-900 text-lg mb-1">{review.project}</h3>
                  <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
                    <span className="font-medium text-zinc-700">{review.client}</span>
                    <span>•</span>
                    <span>{review.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-bold border border-amber-200">
                  {review.rating}.0 <Star className="w-4 h-4 fill-current text-amber-500" />
                </div>
              </div>
              
              <p className="text-zinc-700 mb-6 leading-relaxed">
                "{review.text}"
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm bg-surface p-4 rounded-xl">
                <div>
                  <span className="text-zinc-500 block text-xs">Cost</span>
                  <span className="font-semibold text-zinc-900">{review.cost}</span>
                </div>
                <div className="w-px bg-zinc-200 hidden sm:block"></div>
                <div>
                  <span className="text-zinc-500 block text-xs">Duration</span>
                  <span className="font-semibold text-zinc-900">{review.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 max-w-4xl flex justify-center">
          <button className="px-6 py-3 border border-zinc-200 font-medium text-zinc-700 rounded-xl hover:bg-surface transition-colors">
            Load More Reviews
          </button>
        </div>
      </div>
    </>
  );
};

export default Reviews;
