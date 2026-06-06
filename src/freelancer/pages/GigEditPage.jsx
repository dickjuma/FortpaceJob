// src/pages/freelancer/GigEditPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  RefreshCw, Send, ChevronLeft, Check,
  History, Settings, MoreHorizontal, FileText, Image as ImageIcon,
  DollarSign, AlignLeft, Info, Check as CheckIcon
} from 'lucide-react';
import { gigAPI } from '../../common/services/api';

const defaultGig = {
  title: '',
  description: '',
};

export default function GigEditPage() {
  const { gigId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState('—');
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [showSuccess, setShowSuccess] = useState(null);

  const queryClient = useQueryClient();

  const { data: fetchedGig, isLoading, error } = useQuery({
    queryKey: ['freelancer', 'gig', gigId],
    queryFn: () => gigAPI.getGig(gigId),
    enabled: !!gigId,
    staleTime: 1000 * 60,
  });

  const updateGig = useMutation({
    mutationFn: ({ gigId, data }) => gigAPI.updateGig(gigId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freelancer', 'gig', gigId] });
      queryClient.invalidateQueries({ queryKey: ['freelancer', 'gigs', 'my'] });
    },
  });

  const gig = fetchedGig?.gig ?? fetchedGig?.data ?? fetchedGig ?? defaultGig;

  useEffect(() => {
    if (gig) {
      setTitle(gig.title || '');
      setDescription(gig.description || '');
    }
  }, [gig]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateGig.mutateAsync({ gigId, data: { title, description } });
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setHasChanges(false);
      setShowSuccess({ message: 'Gig updated successfully' });
    } catch {
      setShowSuccess({ message: 'Could not save gig. Try again.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setShowSuccess(null), 2000);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setHasChanges(true);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-ink-secondary mb-4">Could not load this gig</p>
        <Link to="/freelancer/gigs" className="text-accent DEFAULT font-body font-medium hover:text-accent-dark">
          Back to services
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'content', label: 'Gig content', icon: FileText },
    { id: 'pricing', label: 'Pricing & scope', icon: DollarSign },
    { id: 'media', label: 'Gallery & media', icon: ImageIcon },
    { id: 'settings', label: 'Settings & SEO', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <CheckIcon className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-border px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/freelancer/gigs"
            className="text-ink-tertiary hover:text-ink-primary flex items-center gap-1 text-sm font-body font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to services
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 text-xs font-body text-ink-tertiary">
            {isSaving ? (
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 animate-spin" /> Saving...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-accent DEFAULT" /> Saved at {lastSaved}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 text-ink-tertiary hover:text-ink-primary rounded-lg hover:bg-surface-muted transition-colors">
            <History className="w-4 h-4" />
          </button>
          <button className="p-2 text-ink-tertiary hover:text-ink-primary rounded-lg hover:bg-surface-muted transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-border mx-1" />
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 text-xs font-body font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            Save changes
          </button>
        </div>
      </header>

      <div className="flex-1 flex max-w-6xl mx-auto w-full">

        {/* Left Sidebar */}
        <div className="w-64 border-r border-border py-8 px-4 hidden md:block">
          <div className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-body font-medium transition-colors ${
                    isActive
                      ? "bg-accent-light text-accent DEFAULT"
                      : "text-ink-tertiary hover:text-ink-primary hover:bg-surface-muted"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-accent DEFAULT" : "text-ink-tertiary"}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor Workspace */}
        <div className="flex-1 max-w-3xl p-8 sm:p-10 lg:p-12">

          <AnimatePresence mode="wait">
            {activeTab === 'content' && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Title Editor */}
                <div className="mb-10 group">
                  <div className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AlignLeft className="w-3.5 h-3.5" /> Gig title
                  </div>
                  <textarea
                    value={title}
                    onChange={handleTitleChange}
                    className="w-full font-display font-bold text-3xl sm:text-4xl text-brand-900 bg-transparent border-none outline-none resize-none placeholder:text-ink-tertiary focus:ring-0"
                    rows={2}
                    placeholder="Gig title..."
                  />
                </div>

                {/* Description Editor */}
                <div className="group">
                  <div className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FileText className="w-3.5 h-3.5" /> Description
                  </div>
                  <textarea
                    value={description}
                    onChange={handleDescriptionChange}
                    className="w-full min-h-[400px] text-base font-body text-ink-primary bg-transparent border-none outline-none resize-none leading-relaxed placeholder:text-ink-tertiary focus:ring-0"
                    placeholder="Describe your gig in detail..."
                  />
                </div>
              </motion.div>
            )}

            {/* Placeholder for other tabs */}
            {activeTab !== 'content' && (
              <motion.div
                key="other"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-20 text-center"
              >
                <div className="w-16 h-16 bg-surface-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-ink-tertiary" />
                </div>
                <h3 className="font-body font-semibold text-xl text-ink-primary mb-2 capitalize">
                  {activeTab} settings
                </h3>
                <p className="text-ink-secondary max-w-sm mx-auto">
                  This section contains settings for {activeTab}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Info */}
      <div className="fixed bottom-6 right-6 flex items-center gap-2 p-3 bg-white border border-border rounded-xl shadow-lg">
        <Info className="w-4 h-4 text-accent DEFAULT" />
        <span className="text-xs font-body font-medium text-ink-secondary">Click any text to edit instantly</span>
      </div>
    </div>
  );
}
