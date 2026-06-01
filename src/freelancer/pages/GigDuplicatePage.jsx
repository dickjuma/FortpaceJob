import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, Check, AlertCircle, FileText, Image as ImageIcon,
  DollarSign, ListChecks, ChevronRight, Settings,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

// Mock Data
const GIG_TO_CLONE = {
  id: 1,
  title: 'I will build a responsive modern React JS web application',
  category: 'Web Development',
  image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'
};

const CLONE_OPTIONS = [
  { id: 'title_desc', label: 'Title & Description', icon: FileText, default: true },
  { id: 'pricing', label: 'Pricing Packages', icon: DollarSign, default: true },
  { id: 'media', label: 'Gallery & Video', icon: ImageIcon, default: false },
  { id: 'requirements', label: 'Buyer Requirements', icon: ListChecks, default: true },
];

export default function GigDuplicatePage() {
  const [selectedOptions, setSelectedOptions] = useState(
    CLONE_OPTIONS.filter(o => o.default).map(o => o.id)
  );
  const [newTitle, setNewTitle] = useState(`${GIG_TO_CLONE.title} (Copy)`);
  const [isCloning, setIsCloning] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const toggleOption = (id) => {
    setSelectedOptions(prev => 
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  };

  const handleDuplicate = () => {
    setIsCloning(true);
    setTimeout(() => {
      setIsCloning(false);
      setIsDone(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans flex items-center justify-center py-12 px-4 sm:px-6">
      
      <div className="max-w-2xl w-full">
        
        {/* Minimal Utility Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#14a800]/10 dark:bg-[#14a800]/20 text-[#14a800] dark:text-[#14a800] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Copy className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Duplicate Gig</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-2 max-w-sm mx-auto">
            Clone an existing gig to save time when creating similar services.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-xl">
          
          {isDone ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-success/20 text-success dark:text-success rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Gig Duplicated Successfully!</h2>
              <p className="text-zinc-500 mb-8">Your new gig has been saved as a draft. You can now edit it before publishing.</p>
              <div className="flex items-center justify-center gap-4">
                <button className="px-6 py-2.5 bg-[#14a800] text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#118a00] transition-colors">
                  Edit New Gig
                </button>
                <button className="px-6 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-bold rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  Back to Dashboard
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8">
              
              {/* Source Gig Preview */}
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Source Gig</h3>
                <div className="flex items-center gap-4 p-4 bg-surface dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                  <img src={GIG_TO_CLONE.image} alt="Thumbnail" className="w-16 h-12 rounded-lg object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1">{GIG_TO_CLONE.title}</h4>
                    <span className="text-xs font-medium text-zinc-500">{GIG_TO_CLONE.category}</span>
                  </div>
                </div>
              </div>

              {/* New Title Input */}
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">New Gig Title</h3>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-4 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#14a800] transition-all"
                />
              </div>

              {/* Clone Settings */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">What to copy</h3>
                  <button onClick={() => setSelectedOptions(CLONE_OPTIONS.map(o => o.id))} className="text-xs font-bold text-[#14a800] hover:text-[#14a800]">Select All</button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CLONE_OPTIONS.map(option => {
                    const isSelected = selectedOptions.includes(option.id);
                    return (
                      <div 
                        key={option.id}
                        onClick={() => toggleOption(option.id)}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors",
                          isSelected ? "border-[#14a800]/20 bg-[#14a800]/5 dark:bg-[#14a800]/10" : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-surface-dark hover:border-zinc-300 dark:hover:border-zinc-600"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0",
                          isSelected ? "bg-[#14a800] border-[#14a800]/20" : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800"
                        )}>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <option.icon className={cn("w-5 h-5", isSelected ? "text-[#14a800]" : "text-zinc-400")} />
                        <span className={cn("text-sm font-bold", isSelected ? "text-[#14a800] dark:text-[#14a800]" : "text-zinc-600 dark:text-zinc-400")}>
                          {option.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Duplicate Warning */}
              {selectedOptions.includes('title_desc') && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                    Make sure to modify the cloned title and description before publishing. Identical duplicate gigs may be removed from search results.
                  </p>
                </div>
              )}

              {/* Action */}
              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                <button 
                  onClick={handleDuplicate}
                  disabled={isCloning}
                  className="w-full sm:w-auto px-8 py-3 bg-surface-dark dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-tranzinc-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCloning ? (
                    <>Duplicating <span className="animate-pulse">...</span></>
                  ) : (
                    <>Duplicate Gig <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
