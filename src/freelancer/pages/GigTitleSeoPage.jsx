import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Check, AlertCircle, TrendingUp, BarChart3, 
  Search, Tag, Layers, SearchCheck, Info
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

// Mock Data
const CATEGORIES = ['Web Development', 'Design', 'Writing', 'Marketing'];
const SUBCATEGORIES = {
  'Web Development': ['Frontend Development', 'Backend Development', 'Full Stack', 'CMS Development'],
  'Design': ['UI/UX Design', 'Logo Design', 'Illustration'],
};

const SUGGESTED_KEYWORDS = ['React JS', 'Tailwind', 'Next.js', 'Responsive UI', 'Figma to React', 'Web App'];
const TRENDING_KEYWORDS = [
  { term: 'SaaS Dashboard', volume: 'High', trend: '+12%' },
  { term: 'AI Integration', volume: 'Very High', trend: '+45%' },
  { term: 'Framer Motion', volume: 'Medium', trend: '+8%' },
];

export default function GigTitleSeoPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [metaDesc, setMetaDesc] = useState('');

  const [seoScore, setSeoScore] = useState(0);

  // Simple Mock SEO Scoring Logic
  useEffect(() => {
    let score = 0;
    if (title.length > 15 && title.length < 60) score += 30; // Optimal length
    if (title.toLowerCase().includes('i will')) score += 10;
    if (category && subcategory) score += 20;
    if (tags.length >= 3) score += 20;
    if (metaDesc.length > 50) score += 20;
    setSeoScore(score);
  }, [title, category, subcategory, tags, metaDesc]);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim() && tags.length < 5) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const addSuggestedTag = (tag) => {
    if (tags.length < 5 && !tags.includes(tag.toLowerCase())) {
      setTags([...tags, tag.toLowerCase()]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full font-sans">
      
      {/* Main Form Area */}
      <div className="flex-1 w-full space-y-8">
        
        {/* Title Section */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Gig Title</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                As your Gig storefront, your title is the most important place to include keywords that buyers would likely use to search for a service like yours.
              </p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#14a800]/5 dark:bg-[#14a800]/10 text-[#14a800] dark:text-[#14a800] rounded-xl text-xs font-bold hover:bg-[#14a800]/10 transition-colors shrink-0">
              <Sparkles className="w-3.5 h-3.5" /> Optimize Title
            </button>
          </div>

          <div className="relative">
            <textarea
              rows="3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="I will do something I'm really good at..."
              className={cn(
                "w-full p-4 bg-surface dark:bg-zinc-800/50 border rounded-2xl text-2xl font-extrabold text-zinc-900 dark:text-white resize-none outline-none transition-all focus:ring-2",
                title.length > 80 ? "border-rose-300 focus:ring-rose-500" : "border-zinc-200 dark:border-zinc-700 focus:border-[#14a800]/20 focus:ring-[#14a800]"
              )}
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              {title.length > 0 && title.length < 15 && (
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Too short
                </span>
              )}
              {title.length >= 15 && title.length <= 60 && (
                <span className="text-xs font-bold text-success flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Just right
                </span>
              )}
              {title.length > 80 && (
                <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Too long
                </span>
              )}
              <span className={cn(
                "text-sm font-bold",
                title.length > 80 ? "text-rose-500" : "text-zinc-400"
              )}>
                {title.length}/80 max
              </span>
            </div>
          </div>
        </div>

        {/* Category Section */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Category & Placement</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Choose the category and sub-category most suitable for your Gig.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-400" /> Primary Category
              </label>
              <select 
                value={category}
                onChange={(e) => { setCategory(e.target.value); setSubcategory(''); }}
                className="w-full p-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:border-[#14a800]/20 focus:ring-1 focus:ring-[#14a800]"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-400" /> Subcategory
              </label>
              <select 
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                disabled={!category}
                className="w-full p-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:border-[#14a800]/20 focus:ring-1 focus:ring-[#14a800] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select a subcategory</option>
                {category && SUBCATEGORIES[category]?.map(sc => <option key={sc} value={sc}>{sc}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Search Tags & Meta Description */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Search Tags & SEO</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Tag your Gig with keywords related to your service. This helps buyers find you in search.
          </p>

          <div className="space-y-6">
            {/* Tags Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-zinc-400" /> Positive Keywords
                </label>
                <span className="text-xs font-bold text-zinc-400">{tags.length}/5 tags</span>
              </div>
              
              <div className="p-2 bg-surface dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl flex flex-wrap gap-2 items-center focus-within:border-[#14a800]/20 focus-within:ring-1 focus-within:ring-#14a800] transition-all">
                <AnimatePresence>
                  {tags.map(tag => (
                    <motion.span 
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="px-3 py-1.5 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
                    >
                      {tag}
                      <button onClick={() => removeTag(tag)} className="text-zinc-400 hover:text-rose-500 focus:outline-none">
                        &times;
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
                <input 
                  type="text" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  disabled={tags.length >= 5}
                  placeholder={tags.length >= 5 ? "Maximum 5 tags reached" : "Type and press Enter..."}
                  className="flex-1 min-w-[150px] bg-transparent outline-none text-sm font-medium text-zinc-900 dark:text-white px-2 py-1 placeholder:text-zinc-400 disabled:opacity-50"
                />
              </div>

              {/* Suggestions */}
              <div className="mt-3">
                <p className="text-xs font-semibold text-zinc-500 mb-2">Suggested tags based on your category:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_KEYWORDS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => addSuggestedTag(tag)}
                      disabled={tags.includes(tag.toLowerCase()) || tags.length >= 5}
                      className="px-3 py-1 text-xs font-bold bg-[#14a800]/5 dark:bg-[#14a800]/10 text-[#14a800] dark:text-[#14a800] rounded-lg hover:bg-[#14a800]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SEO Meta Description */}
            <div>
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2 mb-2">
                <SearchCheck className="w-4 h-4 text-zinc-400" /> SEO Meta Description
              </label>
              <textarea
                rows="3"
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                placeholder="Briefly describe your gig for search engine results pages (Google, Bing)..."
                className="w-full p-3 bg-surface dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-900 dark:text-white resize-none outline-none focus:border-[#14a800]/20 focus:ring-1 focus:ring-[#14a800] transition-all"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Aim for 120-160 characters
                </span>
                <span className={cn(
                  "text-xs font-bold",
                  metaDesc.length < 120 ? "text-amber-500" : metaDesc.length > 160 ? "text-rose-500" : "text-success"
                )}>
                  {metaDesc.length}/160
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Sidebar - Analytics & SEO Insight */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
        
        {/* Live SEO Score Widget */}
        <div className="bg-surface-dark rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#14a800]/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-[#14a800]" />
            <h3 className="text-sm font-bold text-white">Live SEO Score</h3>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                <motion.circle 
                  cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  className={cn(
                    "transition-all duration-1000 ease-out",
                    seoScore < 50 ? "text-rose-500" : seoScore < 80 ? "text-amber-400" : "text-success"
                  )}
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 251.2" }}
                  animate={{ strokeDasharray: `${(seoScore / 100) * 251.2} 251.2` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{seoScore}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Check className={cn("w-4 h-4", title.length >= 15 ? "text-success" : "text-zinc-600")} />
              <span className={title.length >= 15 ? "text-zinc-200" : "text-zinc-500"}>Optimal title length</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className={cn("w-4 h-4", category && subcategory ? "text-success" : "text-zinc-600")} />
              <span className={category && subcategory ? "text-zinc-200" : "text-zinc-500"}>Category selected</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className={cn("w-4 h-4", tags.length >= 3 ? "text-success" : "text-zinc-600")} />
              <span className={tags.length >= 3 ? "text-zinc-200" : "text-zinc-500"}>3+ Search tags added</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className={cn("w-4 h-4", metaDesc.length > 50 ? "text-success" : "text-zinc-600")} />
              <span className={metaDesc.length > 50 ? "text-zinc-200" : "text-zinc-500"}>Meta description detailed</span>
            </div>
          </div>
        </div>

        {/* Trending Keywords Box */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#14a800]" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Trending in Web Dev</h3>
          </div>
          
          <div className="space-y-3">
            {TRENDING_KEYWORDS.map((kw, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-surface dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700/50">
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-white mb-0.5">{kw.term}</div>
                  <div className="text-[10px] font-semibold text-zinc-500">Vol: {kw.volume}</div>
                </div>
                <div className="text-xs font-bold text-success dark:text-success bg-emerald-50 dark:bg-success/10 px-2 py-1 rounded-md">
                  {kw.trend}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-zinc-500 mt-4 leading-relaxed">
            Consider including these trending keywords in your title or tags if they match your service. High volume keywords receive more traffic.
          </p>
        </div>

      </div>

    </div>
  );
}
