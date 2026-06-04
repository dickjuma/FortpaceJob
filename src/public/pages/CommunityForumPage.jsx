import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageSquare, ArrowBigUp, Pin, CheckCircle2, Loader2 } from 'lucide-react';
import { cmsAPI } from '../../common/services/api';
import { extractList } from '../../common/utils/apiHelpers';
import AvatarInitials from '../../common/components/AvatarInitials';

const categories = [
  { id: 'all', name: 'All Topics' },
  { id: 'freelancing', name: 'Freelancing Tips' },
  { id: 'development', name: 'Development' },
  { id: 'platform', name: 'Forte Platform' },
];

export default function CommunityForumPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    cmsAPI.getCommunityPosts({ category: activeCategory === 'all' ? '' : activeCategory })
      .then((raw) => {
        if (!cancelled) setPosts(extractList(raw));
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  const filtered = posts.filter((post) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return [post.title, post.preview, post.category].join(' ').toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#2bb75c] rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
        <h1 className="text-3xl md:text-4xl font-black mb-2">Community Forum</h1>
        <p className="text-white/80 font-medium max-w-2xl">Discuss freelancing, share portfolios, and get platform updates from the Fort Space community.</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                activeCategory === cat.id ? 'bg-[#2bb75c]/10 text-[#2bb75c]' : 'text-zinc-600 hover:bg-surface'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </aside>

        <div className="flex-1">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions..."
              className="w-full pl-12 pr-4 py-3 border border-zinc-200 rounded-xl outline-none focus:border-[#2bb75c]/30"
            />
          </div>

          {loading ? (
            <div className="py-20 text-center text-zinc-500">
              <Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin text-[#2bb75c]" />
              Loading discussions...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center bg-white border border-dashed border-zinc-300 rounded-2xl">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
              <p className="font-bold text-zinc-700">No posts yet in this category.</p>
              <p className="text-sm text-zinc-500 mt-2">Be the first to start a conversation when posting is enabled for your account.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((post) => (
                <article key={post.id} className="bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="text-center shrink-0">
                      <button type="button" className="flex flex-col items-center text-zinc-500 hover:text-[#2bb75c]">
                        <ArrowBigUp className="w-6 h-6" />
                        <span className="font-bold text-sm">{post.upvotes || 0}</span>
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {post.isPinned ? <Pin className="w-4 h-4 text-amber-500" /> : null}
                        {post.isResolved ? <CheckCircle2 className="w-4 h-4 text-success" /> : null}
                        <span className="text-xs font-bold text-[#2bb75c] bg-[#2bb75c]/5 px-2 py-0.5 rounded">{post.category}</span>
                        <span className="text-xs text-zinc-400">{post.timeAgo || post.createdAt}</span>
                      </div>
                      <h2 className="text-xl font-bold text-zinc-900 mb-2">{post.title}</h2>
                      <p className="text-zinc-600 text-sm mb-4 line-clamp-2">{post.preview}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AvatarInitials name={post.author?.name} imageUrl={post.author?.avatar} className="w-8 h-8" />
                          <span className="text-sm font-bold text-zinc-700">{post.author?.name || 'Member'}</span>
                        </div>
                        <span className="text-sm text-zinc-500 font-medium">{post.comments || 0} comments</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

