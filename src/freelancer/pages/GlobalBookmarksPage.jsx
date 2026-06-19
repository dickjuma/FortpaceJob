// src/pages/common/GlobalBookmarksPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark, Briefcase, User, Star, Trash2, Globe, ShieldCheck, ChevronRight, X, ArrowUpRight, Check
} from 'lucide-react';
import { useGetBookmarks, useToggleBookmark } from '../services/freelancerHooks';

export default function GlobalBookmarksPage() {
  const { data: response, isLoading } = useGetBookmarks();
  const apiBookmarks = response?.data || response;
  
  const toggleBookmark = useToggleBookmark();

  const fallbackBookmarks = {
    jobs: [
      { id: 1, title: 'Senior React Developer (Next.js focus)', client: 'Vercel Ecosystem', budget: 95, type: 'Hourly Rate' },
      { id: 2, title: 'Figma to React Frontend Specialist', client: 'Stripe Orchestrations', budget: 3500, type: 'Fixed Price' }
    ],
    gigs: [
      { id: 1, title: 'I will build a full-stack SaaS application in React and Node.js', price: 950, rating: 5.0, reviews: 45 }
    ],
    talent: [
      { id: 1, name: 'Elena Rodriguez', title: 'Lead Developer & PM', location: 'London, UK', success: '100%' }
    ]
  };
  
  const bookmarks = apiBookmarks && Object.keys(apiBookmarks).length > 0 ? apiBookmarks : fallbackBookmarks;
  
  const [activeTab, setActiveTab] = useState('jobs');
  const [showSuccess, setShowSuccess] = useState(null);

  const removeBookmark = (id, type, name) => {
    toggleBookmark.mutate({ id, type, isBookmarked: false }, {
      onSuccess: () => {
        setShowSuccess({ message: `Removed: ${name}` });
        setTimeout(() => setShowSuccess(null), 2000);
      }
    });
  };

  const handleAction = (name) => {
    setShowSuccess({ message: `Opening: ${name}` });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const tabs = [
    { key: 'jobs', label: `Jobs (${bookmarks.jobs.length})`, icon: Briefcase },
    { key: 'gigs', label: `Services (${bookmarks.gigs.length})`, icon: Globe },
    { key: 'talent', label: `Profiles (${bookmarks.talent.length})`, icon: User }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-accent-light rounded-xl">
            <Bookmark className="w-6 h-6 text-accent DEFAULT" />
          </div>
          <h1 className="font-display font-bold text-3xl text-brand-900">Global bookmarks</h1>
        </div>
        <p className="text-ink-secondary font-body">Access and manage your saved jobs, services, and profiles</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-xs font-body font-medium uppercase tracking-wide transition-all border-b-2 flex items-center gap-1.5 ${
                isActive
                  ? "border-accent DEFAULT text-accent DEFAULT"
                  : "border-transparent text-ink-tertiary hover:text-ink-primary"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="space-y-3">
        {bookmarks[activeTab].length === 0 ? (
          <div className="text-center py-16 bg-white border border-border rounded-2xl">
            <Bookmark className="w-14 h-14 text-ink-tertiary mx-auto mb-3" />
            <h4 className="font-body font-semibold text-lg text-ink-primary mb-1">No bookmarks saved</h4>
            <p className="text-sm text-ink-secondary">Save jobs or profiles to manage them here</p>
          </div>
        ) : (
          bookmarks[activeTab].map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -2 }}
              className="bg-white border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4 group"
            >
              <div className="flex-1">
                <h3 className="font-body font-semibold text-base text-ink-primary group-hover:text-accent DEFAULT transition-colors">
                  {activeTab === 'jobs' ? item.title : activeTab === 'gigs' ? item.title : item.name}
                </h3>

                {activeTab === 'jobs' && (
                  <p className="text-sm font-body text-ink-secondary mt-1">
                    Client: {item.client} • Budget: KES {item.budget} ({item.type})
                  </p>
                )}

                {activeTab === 'gigs' && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent DEFAULT text-accent DEFAULT" />
                      <span className="text-sm font-body font-semibold text-ink-primary">{item.rating}</span>
                      <span className="text-xs text-ink-tertiary">({item.reviews} reviews)</span>
                    </div>
                    <span className="text-ink-tertiary">•</span>
                    <span className="text-sm font-mono font-semibold text-ink-primary">KES {item.price}</span>
                  </div>
                )}

                {activeTab === 'talent' && (
                  <>
                    <p className="text-sm font-body text-ink-secondary mt-1">{item.title} • {item.location}</p>
                    <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-accent-light rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent DEFAULT" />
                      <span className="text-xs font-body font-medium text-accent-dark">Success: {item.success}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAction(activeTab === 'jobs' ? item.title : activeTab === 'gigs' ? item.title : item.name)}
                  className="p-2 text-ink-tertiary hover:text-accent DEFAULT rounded-lg transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeBookmark(item.id, activeTab, activeTab === 'jobs' ? item.title : activeTab === 'gigs' ? item.title : item.name)}
                  className="p-2 text-ink-tertiary hover:text-danger rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
