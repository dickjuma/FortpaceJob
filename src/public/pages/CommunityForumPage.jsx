import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, MessageSquare, ArrowBigUp, TrendingUp, Filter, 
  Pin, CheckCircle2, MoreHorizontal, MessageCircle, Hash
} from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Topics', count: 1245 },
  { id: 'freelancing', name: 'Freelancing Tips', count: 432 },
  { id: 'design', name: 'Design & UI/UX', count: 256 },
  { id: 'development', name: 'Development', count: 312 },
  { id: 'marketing', name: 'Marketing', count: 145 },
  { id: 'showcase', name: 'Portfolio Showcase', count: 98 },
  { id: 'platform', name: 'Forte Platform', count: 24 },
];

const mockPosts = [
  {
    id: 1,
    title: 'How to negotiate rates with enterprise clients?',
    preview: 'I recently landed an interview with a Fortune 500 company for a 6-month contract. They asked for my rates but I usually work with startups. Any advice on how much to mark up my standard hourly?',
    author: { name: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?u=alex' },
    category: 'Freelancing Tips',
    upvotes: 342,
    comments: 56,
    timeAgo: '2 hours ago',
    tags: ['Negotiation', 'Enterprise'],
    isPinned: true,
  },
  {
    id: 2,
    title: 'Best practices for React 19 Server Components',
    preview: 'Has anyone migrated their client heavy dashboard to use Server Components yet? I am seeing mixed results with performance...',
    author: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    category: 'Development',
    upvotes: 215,
    comments: 34,
    timeAgo: '4 hours ago',
    tags: ['React', 'Performance'],
    isResolved: true,
  },
  {
    id: 3,
    title: 'Review my new UX portfolio please! 🎨',
    preview: 'Just finished rebuilding my portfolio using Framer. Would love some brutal feedback on the typography and flow.',
    author: { name: 'Marcus Johnson', avatar: 'https://i.pravatar.cc/150?u=marcus' },
    category: 'Portfolio Showcase',
    upvotes: 189,
    comments: 42,
    timeAgo: '6 hours ago',
    tags: ['UX', 'Review'],
  },
  {
    id: 4,
    title: 'Dealing with scope creep on fixed-price projects',
    preview: 'Client keeps asking for "just one more small change". I want to keep them happy but it\'s eating into my profit margin significantly. How do you handle this gracefully?',
    author: { name: 'Elena Gomez', avatar: 'https://i.pravatar.cc/150?u=elena' },
    category: 'Freelancing Tips',
    upvotes: 456,
    comments: 89,
    timeAgo: '1 day ago',
    tags: ['Client Management', 'Pricing'],
  },
  {
    id: 5,
    title: 'Forte 2.0 Feature Requests thread',
    preview: 'Drop your most wanted features for the next major Forte platform update below!',
    author: { name: 'Forte Team', avatar: 'https://i.pravatar.cc/150?u=admin' },
    category: 'Forte Platform',
    upvotes: 892,
    comments: 234,
    timeAgo: '2 days ago',
    tags: ['Feedback', 'Product'],
    isPinned: true,
  }
];

export default function CommunityForumPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden"
      >
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-brand-500 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-20 w-48 h-48 rounded-full bg-brand-700 opacity-50 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Forte Community</h1>
            <p className="text-brand-100 text-lg mb-6 max-w-xl">
              Connect with thousands of freelancers, share your knowledge, and find answers to your toughest questions.
            </p>
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 transform -tranzinc-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search discussions, topics, or people..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-300 shadow-sm"
              />
            </div>
          </div>
          <div className="w-full md:w-auto flex justify-start md:justify-end">
            <button className="px-6 py-3 bg-white text-brand-600 font-semibold rounded-xl hover:bg-surface transition-colors shadow-sm flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Start Discussion
            </button>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-64 flex-shrink-0"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 sticky top-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-2">Categories</h3>
            <ul className="space-y-1 mb-8">
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeCategory === cat.id 
                        ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 font-medium' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="flex items-center">
                      <Hash className="w-4 h-4 mr-2 opacity-50" />
                      {cat.name}
                    </span>
                    <span className={`text-xs ${activeCategory === cat.id ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'}`}>
                      {cat.count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-2">Trending Tags</h3>
            <div className="flex flex-wrap gap-2 px-2">
              {['React', 'Design', 'Rates', 'Client Comms', 'Next.js', 'Tax Prep'].map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md text-xs hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content Feed */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <button className="flex items-center hover:text-brand-600 dark:hover:text-brand-400 font-medium text-gray-900 dark:text-white transition-colors">
                <TrendingUp className="w-4 h-4 mr-1" /> Trending
              </button>
              <span>•</span>
              <button className="hover:text-gray-900 dark:hover:text-white transition-colors">Newest</button>
              <span>•</span>
              <button className="hover:text-gray-900 dark:hover:text-white transition-colors">Top</button>
            </div>
            <button className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Filter className="w-4 h-4 mr-1" /> Filter
            </button>
          </div>

          {mockPosts.map((post, index) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`bg-white dark:bg-gray-900 rounded-2xl border ${post.isPinned ? 'border-brand-200 dark:border-brand-900/50' : 'border-gray-100 dark:border-gray-800'} shadow-sm p-5 hover:border-gray-300 dark:hover:border-gray-700 transition-colors group cursor-pointer`}
            >
              <div className="flex gap-4">
                {/* Upvote column */}
                <div className="flex flex-col items-center min-w-[40px] gap-1">
                  <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    <ArrowBigUp className="w-6 h-6" />
                  </button>
                  <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">{post.upvotes}</span>
                </div>

                {/* Content column */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <img src={post.author.avatar} alt={post.author.name} className="w-5 h-5 rounded-full" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{post.author.name}</span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className="text-xs text-gray-500">{post.timeAgo}</span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline">{post.category}</span>
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex items-center gap-2">
                    {post.isPinned && <Pin className="w-4 h-4 text-brand-500 fill-brand-500" />}
                    {post.isResolved && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {post.title}
                  </h2>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                    {post.preview}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments} comments</span>
                      </div>
                      <button className="hover:text-gray-900 dark:hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          <div className="pt-4 flex justify-center">
            <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-800 transition-colors">
              Load More Discussions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
