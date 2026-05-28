import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, RefreshCw, Send, ChevronLeft, Check, 
  History, Settings, MoreHorizontal, FileText, Image as ImageIcon,
  DollarSign, AlignLeft, Info
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

// Minimal inline editing approach like Notion
export default function GigEditPage() {
  const [title, setTitle] = useState('I will build a responsive modern React JS web application');
  const [description, setDescription] = useState('Hi there! I am a senior React developer with 5+ years of experience. I specialize in building fast, accessible, and beautiful web applications using modern technologies like React, Tailwind CSS, and Framer Motion.\n\nWhat you will get:\n- Clean, maintainable code\n- Fully responsive design\n- SEO optimization\n- Fast load times\n\nPlease message me before placing an order so we can discuss your specific requirements.');
  
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState('Just now');
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('content'); // content, pricing, media, settings

  // Simulate auto-save
  useEffect(() => {
    if (hasChanges) {
      setIsSaving(true);
      const timer = setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
        setHasChanges(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [title, description, hasChanges]);

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans flex flex-col">
      
      {/* Notion-style Top Bar */}
      <header className="sticky top-0 z-50 bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 text-sm font-bold transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
            {isSaving ? (
              <span className="flex items-center gap-1.5"><RefreshCw className="w-3 h-3 animate-spin" /> Saving...</span>
            ) : (
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3" /> Saved at {lastSaved}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" title="Version History">
            <History className="w-4 h-4" />
          </button>
          <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" title="More options">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
          <button className="flex items-center gap-2 px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors">
            Update Gig <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex max-w-[1200px] mx-auto w-full">
        
        {/* Left Sidebar (Minimal Navigation) */}
        <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 py-8 px-4 hidden md:block">
          <div className="space-y-1">
            {[
              { id: 'content', label: 'Gig Content', icon: FileText },
              { id: 'pricing', label: 'Pricing & Scope', icon: DollarSign },
              { id: 'media', label: 'Gallery & Media', icon: ImageIcon },
              { id: 'settings', label: 'Settings & SEO', icon: Settings },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-colors",
                  activeTab === tab.id ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-surface dark:hover:bg-zinc-800/50"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-brand-500" : "text-zinc-400")} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editor Workspace */}
        <div className="flex-1 max-w-[800px] p-8 sm:p-12 lg:p-20">
          
          <AnimatePresence mode="wait">
            {activeTab === 'content' && (
              <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                
                {/* Title Editable */}
                <div className="mb-12 group">
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AlignLeft className="w-3.5 h-3.5" /> Gig Title
                  </div>
                  <textarea
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setHasChanges(true); }}
                    className="w-full text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white bg-transparent border-none outline-none resize-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                    rows="2"
                    placeholder="Gig Title..."
                  />
                </div>

                {/* Description Editable */}
                <div className="group">
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FileText className="w-3.5 h-3.5" /> Description
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); setHasChanges(true); }}
                    className="w-full min-h-[500px] text-base font-medium text-zinc-700 dark:text-zinc-300 bg-transparent border-none outline-none resize-none leading-relaxed placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                    placeholder="Describe your gig in detail..."
                  />
                </div>
              </motion.div>
            )}

            {activeTab !== 'content' && (
              <motion.div key="other" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="py-20 text-center">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 capitalize">{activeTab} Settings</h3>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-6">This section acts as a quick inline editor for the specific module.</p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
      
      {/* Floating Info */}
      <div className="fixed bottom-6 right-6 flex items-center gap-2 p-3 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg">
        <Info className="w-4 h-4 text-brand-500" />
        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Click any text to edit instantly.</span>
      </div>

    </div>
  );
}
