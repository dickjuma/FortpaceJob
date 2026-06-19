import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Quote, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../common/services/api';
import { extractList } from '../common/utils/apiHelpers';
import AvatarInitials from '../common/components/AvatarInitials';

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicAPI
      .getPlatformReviews()
      .then((raw) => {
        const reviews = extractList(raw);
        setStories(
          reviews.map((review, index) => ({
            id: review.id || `story-${index}`,
            freelancer: {
              name: review.freelancerName || review.authorName || 'Professional',
              role: review.role || 'Freelancer',
              avatar: review.avatar || '',
            },
            client: { name: review.clientName || 'Client' },
            title: review.title || review.comment?.slice(0, 60) || 'Successful project delivery',
            summary: review.comment || review.body || '',
            category: review.category || 'Services',
            stat: review.rating ? `${review.rating}★` : '',
            image: review.image || '',
          }))
        );
      })
      .catch(() => setStories([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = stories[0];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4">Success Stories</h1>
        <p className="text-zinc-600 text-lg max-w-2xl mx-auto">Real outcomes from freelancers and clients on Fort Space.</p>
      </motion.div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-10 h-10 mx-auto animate-spin text-[#4C1D95]" />
        </div>
      ) : stories.length === 0 ? (
        <div className="py-20 text-center bg-white border border-dashed border-zinc-300 rounded-2xl">
          <Quote className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
          <p className="font-bold text-zinc-700">No published success stories yet.</p>
          <Link to="/find-talent" className="inline-block mt-4 text-[#4C1D95] font-bold hover:underline">
            Explore talent
          </Link>
        </div>
      ) : (
        <>
          {featured ? (
            <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden mb-12 shadow-sm">
              <div className="p-8 md:p-12">
                <span className="text-xs font-bold text-[#4C1D95] uppercase tracking-wider">{featured.category}</span>
                <h2 className="text-3xl font-black text-zinc-900 mt-2 mb-4">{featured.title}</h2>
                <p className="text-zinc-600 font-medium mb-6">{featured.summary}</p>
                <div className="flex items-center gap-3">
                  <AvatarInitials name={featured.freelancer.name} imageUrl={featured.freelancer.avatar} className="w-12 h-12" />
                  <div>
                    <div className="font-bold text-zinc-900">{featured.freelancer.name}</div>
                    <div className="text-sm text-zinc-500">{featured.freelancer.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.slice(1).map((story) => (
              <article key={story.id} className="bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <span className="text-xs font-bold text-zinc-400 uppercase">{story.category}</span>
                {story.stat ? <div className="text-[#4C1D95] font-black text-lg mt-1">{story.stat}</div> : null}
                <h3 className="font-bold text-zinc-900 text-lg mt-2 mb-2">{story.title}</h3>
                <p className="text-sm text-zinc-600 line-clamp-3 mb-4">{story.summary}</p>
                <div className="flex items-center gap-2">
                  <AvatarInitials name={story.freelancer.name} imageUrl={story.freelancer.avatar} className="w-8 h-8" />
                  <span className="text-sm font-bold text-zinc-700">{story.freelancer.name}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-[#4C1D95] text-white font-bold rounded-xl hover:bg-[#22C55E]">
              Start your success story <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}


