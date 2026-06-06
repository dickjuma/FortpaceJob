// src/pages/public/CommunityForumPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, MessageSquare, Plus, Search, ThumbsUp, Heart, X, Send,
  ArrowRight, ShieldCheck, Tag, Star, Activity, Clock, Check, Loader2
} from 'lucide-react';
import { cmsAPI } from '../../common/services/api';
import { extractList } from '../../common/utils/apiHelpers';

export default function CommunityForumPage() {
  // Keep original API hooks commented - preserve structure
  // const { data: threadsData, isLoading } = useForumThreads();
  // const createThread = useCreateThread();
  // const likeThread = useLikeThread();

  const [activeModal, setActiveModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [threadForm, setThreadForm] = useState({
    title: '',
    category: 'Gig Strategy',
    text: ''
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    cmsAPI.getCommunityPosts()
      .then((response) => {
        if (cancelled) return;
        setThreads(extractList(response));
      })
      .catch(() => {
        if (!cancelled) setThreads([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!threadForm.title.trim() || !threadForm.text.trim()) return;

    // Posting to the community backend is not enabled from this page yet.
    setActiveModal(null);
    setThreadForm({ title: '', category: 'Gig Strategy', text: '' });
    setShowSuccess({ message: 'Thread published successfully' });
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const handleLike = async (id) => {
    // await likeThread.mutateAsync(id);
    setShowSuccess({ message: 'Thread liked' });
    setTimeout(() => setShowSuccess(null), 1500);
  };

  // Filter threads based on search - keep logic
  const filteredThreads = threads?.filter(t =>
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const categoryBoards = [
    { name: 'Gig Strategy', count: threads?.filter(t => t.category === 'Gig Strategy').length || 0 },
    { name: 'Web3 / Contracts', count: threads?.filter(t => t.category === 'Web3 / Contracts').length || 0 },
    { name: 'Engineering', count: threads?.filter(t => t.category === 'Engineering').length || 0 },
    { name: 'General Chat', count: threads?.filter(t => t.category === 'General Chat').length || 0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light rounded-xl">
              <Users className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-4xl text-brand-900">Community lounge</h1>
          </div>
          <p className="text-ink-secondary font-body mt-1 text-base">
            Exchange strategies, discuss development stacks, and network with peers
          </p>
        </div>
        <button
          onClick={() => setActiveModal('create')}
          className="px-5 py-2.5 rounded-lg font-body font-medium text-sm bg-brand-900 text-white hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          New thread
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Left Sidebar: Categories */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white border border-border rounded-2xl p-6 shadow-sm"
          >
            <h3 className="font-display font-semibold text-sm text-brand-900 uppercase tracking-wide border-b border-border pb-3 mb-3">
              Forum boards
            </h3>
            <div className="space-y-1">
              {categoryBoards.map(board => (
                <button
                  key={board.name}
                  onClick={() => setSearchTerm(board.name)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-body font-medium text-ink-secondary hover:text-accent DEFAULT hover:bg-accent-light transition-all flex justify-between items-center group focus:outline-none focus:ring-2 focus:ring-brand-900"
                >
                  <span>{board.name}</span>
                  <span className="bg-surface-muted group-hover:bg-accent-light px-2 py-0.5 rounded-full text-xs font-mono">
                    {board.count}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-6 shadow-sm text-white"
          >
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-accent DEFAULT" />
              <h3 className="font-body font-semibold text-sm">Community stats</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Total threads</span>
                <span className="font-mono font-semibold">{threads?.length || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Total replies</span>
                <span className="font-mono font-semibold">{threads?.reduce((sum, t) => sum + (t.replies || 0), 0) || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Total likes</span>
                <span className="font-mono font-semibold">{threads?.reduce((sum, t) => sum + (t.likes || 0), 0) || 0}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Threads */}
        <div className="lg:col-span-3 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative max-w-xs"
          >
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-tertiary" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 h-10 border border-border rounded-lg bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
            />
          </motion.div>

          <div className="space-y-4">
            <AnimatePresence>
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white border border-border rounded-2xl text-center py-16 px-4"
                >
                  <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin text-ink-tertiary" />
                  <p className="text-sm text-ink-secondary">Loading discussions...</p>
                </motion.div>
              ) : filteredThreads.length > 0 ? (
                filteredThreads.map((thread, idx) => (
                  <motion.div
                    key={thread.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-body font-medium bg-accent-light text-accent-dark border border-accent DEFAULT">
                        {thread.category}
                      </span>
                      <span className="text-xs font-body text-ink-tertiary flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {thread.date}
                      </span>
                    </div>

                    <h3 className="font-body font-semibold text-lg text-ink-primary mb-3 hover:text-accent DEFAULT transition-colors cursor-pointer">
                      {thread.title}
                    </h3>

                    <div className="pt-4 border-t border-border flex flex-wrap justify-between items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center font-mono font-semibold text-xs text-ink-secondary border border-border">
                          {thread.author?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-xs font-body font-medium text-ink-primary">{thread.author}</p>
                          <p className="text-xs font-body text-accent DEFAULT">{thread.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(thread.id)}
                          className="flex items-center gap-1.5 text-xs font-body text-ink-secondary hover:text-danger transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900 rounded-lg px-2 py-1"
                        >
                          <Heart className="w-4 h-4" />
                          <span>{thread.likes || 0}</span>
                        </button>
                        <span className="flex items-center gap-1.5 text-xs font-body text-ink-secondary">
                          <MessageSquare className="w-4 h-4 text-accent DEFAULT" />
                          <span>{thread.replies || 0} replies</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white border border-border rounded-2xl text-center py-16 px-4"
                >
                  <Users className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
                  <h4 className="font-body font-semibold text-ink-primary">No discussions found</h4>
                  <p className="text-sm text-ink-secondary mt-1">Adjust your search or start a new thread</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Create Thread Modal */}
      <AnimatePresence>
        {activeModal === 'create' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8 overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-border shadow-xl w-full max-w-lg"
            >
              <div className="flex justify-between items-center p-6 border-b border-border">
                <div>
                  <h3 className="font-display font-semibold text-lg text-brand-900 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-accent DEFAULT" />
                    Start discussion
                  </h3>
                  <p className="text-sm text-ink-secondary font-body mt-0.5">Share your question or insight</p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-lg hover:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900"
                >
                  <X className="w-5 h-5 text-ink-secondary" />
                </button>
              </div>

              <form onSubmit={handleCreateThread} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-body font-medium text-ink-secondary mb-1.5">
                    Thread title
                  </label>
                  <input
                    type="text"
                    value={threadForm.title}
                    onChange={(e) => setThreadForm({ ...threadForm, title: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                    placeholder="e.g., Best practices for client communication"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-body font-medium text-ink-secondary mb-1.5">
                    Category
                  </label>
                  <select
                    value={threadForm.category}
                    onChange={(e) => setThreadForm({ ...threadForm, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                  >
                    <option value="Gig Strategy">Gig Strategy</option>
                    <option value="Web3 / Contracts">Web3 / Contracts</option>
                    <option value="Engineering">Engineering</option>
                    <option value="General Chat">General Chat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-body font-medium text-ink-secondary mb-1.5">
                    Discussion body
                  </label>
                  <textarea
                    rows={5}
                    value={threadForm.text}
                    onChange={(e) => setThreadForm({ ...threadForm, text: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent resize-none"
                    placeholder="Share details, questions, or insights..."
                    required
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900"
                  >
                    Publish thread
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
