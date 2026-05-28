import React from 'react';
import { Star, ThumbsUp, Filter, MessageCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const MOCK_REVIEWS = Array(8).fill(null).map((_, i) => ({
  id: i,
  buyer: `Client_${Math.floor(Math.random() * 1000)}`,
  avatar: `https://i.pravatar.cc/50?img=${i+30}`,
  country: ['United States', 'United Kingdom', 'Canada', 'Australia'][i % 4],
  date: `${i + 1} week(s) ago`,
  rating: i % 5 === 0 ? 4 : 5,
  comment: 'Outstanding work! The seller was highly communicative, understood my exact requirements, and delivered a flawless product well before the deadline. I will definitely be hiring them again for future projects.',
  helpful: Math.floor(Math.random() * 20),
  sellerResponse: i % 3 === 0 ? 'Thank you so much! It was a pleasure working with you.' : null
}));

const GigReviews = () => {
  const { gigId } = useParams();

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          
          <div className="mb-6">
            <Link to={`/gigs/gig/${gigId || 1}`} className="text-success font-bold text-sm hover:underline">
              &larr; Back to Gig Details
            </Link>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-10 shadow-sm mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black text-zinc-900 mb-2">Gig Reviews</h1>
              <div className="text-zinc-600 font-medium">I will design a unique minimalist logo for your business</div>
            </div>
            
            <div className="w-px h-24 bg-zinc-200 hidden md:block mx-4"></div>
            
            <div className="flex items-center gap-6 text-center md:text-left">
              <div>
                <div className="text-5xl font-black text-zinc-900 mb-1 flex items-center justify-center md:justify-start gap-2">
                  4.9 <Star className="w-8 h-8 text-amber-500 fill-current" />
                </div>
                <div className="text-sm font-bold text-zinc-500">1,024 Total Reviews</div>
              </div>
              
              <div className="space-y-1 text-sm font-medium text-zinc-600">
                <div className="flex items-center gap-2"><span className="w-8 text-right">5 Star</span> <div className="w-32 h-2 bg-zinc-100 rounded-full overflow-hidden"><div className="w-[90%] h-full bg-amber-500"></div></div> <span className="w-8">940</span></div>
                <div className="flex items-center gap-2"><span className="w-8 text-right">4 Star</span> <div className="w-32 h-2 bg-zinc-100 rounded-full overflow-hidden"><div className="w-[8%] h-full bg-amber-500"></div></div> <span className="w-8">80</span></div>
                <div className="flex items-center gap-2"><span className="w-8 text-right">3 Star</span> <div className="w-32 h-2 bg-zinc-100 rounded-full overflow-hidden"><div className="w-[1%] h-full bg-amber-500"></div></div> <span className="w-8">4</span></div>
                <div className="flex items-center gap-2"><span className="w-8 text-right">2 Star</span> <div className="w-32 h-2 bg-zinc-100 rounded-full overflow-hidden"></div> <span className="w-8">0</span></div>
                <div className="flex items-center gap-2"><span className="w-8 text-right">1 Star</span> <div className="w-32 h-2 bg-zinc-100 rounded-full overflow-hidden"></div> <span className="w-8">0</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-200 bg-surface flex flex-wrap justify-between items-center gap-4">
              <div className="flex gap-2">
                <select className="px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-bold text-zinc-700 outline-none cursor-pointer">
                  <option>Most Relevant</option>
                  <option>Most Recent</option>
                </select>
                <select className="px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-bold text-zinc-700 outline-none cursor-pointer">
                  <option>All Ratings</option>
                  <option>5 Stars Only</option>
                  <option>Negative Only</option>
                </select>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {MOCK_REVIEWS.map(review => (
                <div key={review.id} className="pb-8 border-b border-zinc-100 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <img src={review.avatar} alt="Buyer" className="w-12 h-12 rounded-full" />
                      <div>
                        <div className="font-bold text-zinc-900">{review.buyer}</div>
                        <div className="text-xs font-medium text-zinc-500">{review.country}</div>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-zinc-400">{review.date}</div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-amber-500 fill-current' : 'text-zinc-200'}`} />
                    ))}
                  </div>
                  
                  <p className="text-zinc-700 leading-relaxed mb-4">
                    {review.comment}
                  </p>

                  {review.sellerResponse && (
                    <div className="ml-10 mb-4 p-4 bg-surface border border-zinc-100 rounded-tr-xl rounded-b-xl rounded-tl-sm relative">
                      <div className="absolute -left-2 top-0 text-zinc-300">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M12 0H0L12 12V0Z"/></svg>
                      </div>
                      <div className="font-bold text-sm text-zinc-900 mb-1 flex items-center gap-2">
                        Seller's Response
                      </div>
                      <p className="text-sm text-zinc-600">{review.sellerResponse}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-500 mr-2">Helpful?</span>
                    <button className="flex items-center gap-1 px-2.5 py-1.5 bg-surface hover:bg-zinc-100 text-zinc-600 text-xs font-bold rounded-lg border border-zinc-200 transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" /> Yes {review.helpful > 0 && `(${review.helpful})`}
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-center pt-4">
                <button className="px-6 py-3 bg-white border border-zinc-300 hover:bg-surface text-zinc-900 font-bold rounded-xl shadow-sm transition-colors">
                  Load More Reviews
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default GigReviews;
