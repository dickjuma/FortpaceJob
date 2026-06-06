// src/pages/freelancer/GigTitleSeoPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Check, AlertCircle, TrendingUp, BarChart3,
  Search, Tag, Layers, SearchCheck, Info, X
} from 'lucide-react';

const CATEGORIES = ['Web Development', 'Design', 'Writing', 'Marketing'];
const SUBCATEGORIES = {
  'Web Development': ['Frontend Development', 'Backend Development', 'Full Stack', 'CMS Development'],
  'Design': ['UI/UX Design', 'Logo Design', 'Illustration'],
  'Writing': ['Content Writing', 'Copywriting', 'Technical Writing'],
  'Marketing': ['SEO', 'Social Media', 'Email Marketing'],
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
  const [showSuccess, setShowSuccess] = useState(null);

  useEffect(() => {
    let score = 0;
    if (title.length >= 15 && title.length <= 60) score += 30;
    if (title.toLowerCase().includes('i will')) score += 10;
    if (category && subcategory) score += 20;
    if (tags.length >= 3) score += 20;
    if (metaDesc.length >= 50) score += 20;
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
      setShowSuccess({ message: `Added tag: ${tag}` });
      setTimeout(() => setShowSuccess(null), 1500);
    }
  };

  const handleOptimizeTitle = () => {
    setShowSuccess({ message: 'Title optimization suggestions would appear here' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const getScoreColor = () => {
    if (seoScore < 50) return 'text-danger';
    if (seoScore < 80) return 'text-warn';
    return 'text-accent DEFAULT';
  };

  const getScoreRingColor = () => {
    if (seoScore < 50) return 'stroke-danger';
    if (seoScore < 80) return 'stroke-warn';
    return 'stroke-accent DEFAULT';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">

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

      {/* Main Form Area */}
      <div className="flex-1 w-full space-y-6">

        {/* Title Section */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <div>
              <h2 className="font-display font-semibold text-lg text-brand-900 mb-1">Gig title</h2>
              <p className="text-sm font-body text-ink-secondary">
                Your title is the most important place to include keywords that buyers search for.
              </p>
            </div>
            <button
              onClick={handleOptimizeTitle}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-light text-accent-dark rounded-lg text-xs font-body font-medium hover:bg-accent-light/80 transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" /> Optimize title
            </button>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="I will do something I'm really good at..."
              className={`w-full p-4 bg-white border rounded-xl text-xl font-body font-medium text-ink-primary resize-none outline-none focus:ring-2 focus:ring-brand-900 transition-all ${
                title.length > 80 ? "border-danger focus:ring-danger" : "border-border"
              }`}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              {title.length > 0 && title.length < 15 && (
                <span className="text-xs font-body font-medium text-warn flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Too short
                </span>
              )}
              {title.length >= 15 && title.length <= 60 && (
                <span className="text-xs font-body font-medium text-accent DEFAULT flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Optimal
                </span>
              )}
              {title.length > 80 && (
                <span className="text-xs font-body font-medium text-danger flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Too long
                </span>
              )}
              <span className={`text-xs font-mono ${title.length > 80 ? "text-danger" : "text-ink-tertiary"}`}>
                {title.length}/80
              </span>
            </div>
          </div>
        </div>

        {/* Category Section */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-display font-semibold text-lg text-brand-900 mb-1">Category & placement</h2>
          <p className="text-sm font-body text-ink-secondary mb-5">
            Choose the category and sub-category most suitable for your gig.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-body font-medium text-ink-primary flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent DEFAULT" /> Primary category
              </label>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setSubcategory(''); }}
                className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-body font-medium text-ink-primary flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent DEFAULT" /> Subcategory
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                disabled={!category}
                className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select a subcategory</option>
                {category && SUBCATEGORIES[category]?.map(sc => <option key={sc} value={sc}>{sc}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Search Tags & SEO */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-display font-semibold text-lg text-brand-900 mb-1">Search tags & SEO</h2>
          <p className="text-sm font-body text-ink-secondary mb-5">
            Tag your gig with keywords related to your service. This helps buyers find you.
          </p>

          <div className="space-y-5">
            {/* Tags Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-body font-medium text-ink-primary flex items-center gap-2">
                  <Tag className="w-4 h-4 text-accent DEFAULT" /> Positive keywords
                </label>
                <span className="text-xs font-mono text-ink-tertiary">{tags.length}/5 tags</span>
              </div>

              <div className="p-2 bg-white border border-border rounded-lg flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-brand-900 transition-all">
                <AnimatePresence>
                  {tags.map(tag => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="px-2.5 py-1 bg-accent-light text-accent-dark text-xs font-body font-medium rounded-md flex items-center gap-1"
                    >
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-danger transition-colors">
                        <X className="w-3 h-3" />
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
                  className="flex-1 min-w-[150px] bg-transparent outline-none text-sm font-body text-ink-primary px-2 py-1 placeholder:text-ink-tertiary disabled:opacity-50"
                />
              </div>

              {/* Suggestions */}
              <div className="mt-3">
                <p className="text-xs font-body font-medium text-ink-tertiary mb-2">Suggested tags:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_KEYWORDS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => addSuggestedTag(tag)}
                      disabled={tags.includes(tag.toLowerCase()) || tags.length >= 5}
                      className="px-2.5 py-1 text-xs font-body font-medium bg-accent-light text-accent-dark rounded-md hover:bg-accent-light/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SEO Meta Description */}
            <div>
              <label className="text-sm font-body font-medium text-ink-primary flex items-center gap-2 mb-2">
                <SearchCheck className="w-4 h-4 text-accent DEFAULT" /> SEO meta description
              </label>
              <textarea
                rows={3}
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                placeholder="Briefly describe your gig for search engine results..."
                className="w-full px-4 py-3 bg-white border border-border rounded-lg text-sm font-body text-ink-primary resize-none focus:outline-none focus:ring-2 focus:ring-brand-900"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-ink-tertiary flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Aim for 120-160 characters
                </span>
                <span className={`text-xs font-mono font-medium ${
                  metaDesc.length < 120 ? "text-warn" : metaDesc.length > 160 ? "text-danger" : "text-accent DEFAULT"
                }`}>
                  {metaDesc.length}/160
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 shrink-0 space-y-5">

        {/* Live SEO Score */}
        <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-accent-light" />
            <h3 className="text-sm font-body font-semibold text-white">Live SEO score</h3>
          </div>

          <div className="flex justify-center mb-5">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/20" />
                <motion.circle
                  cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                  className={getScoreRingColor()}
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 251.2" }}
                  animate={{ strokeDasharray: `${(seoScore / 100) * 251.2} 251.2` }}
                  transition={{ duration: 0.6 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`font-mono font-bold text-3xl ${getScoreColor()}`}>{seoScore}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Check className={`w-4 h-4 ${title.length >= 15 && title.length <= 60 ? "text-accent-light" : "text-white/30"}`} />
              <span className={title.length >= 15 && title.length <= 60 ? "text-white" : "text-white/50"}>
                Optimal title length
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className={`w-4 h-4 ${category && subcategory ? "text-accent-light" : "text-white/30"}`} />
              <span className={category && subcategory ? "text-white" : "text-white/50"}>
                Category selected
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className={`w-4 h-4 ${tags.length >= 3 ? "text-accent-light" : "text-white/30"}`} />
              <span className={tags.length >= 3 ? "text-white" : "text-white/50"}>
                3+ search tags
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className={`w-4 h-4 ${metaDesc.length >= 50 ? "text-accent-light" : "text-white/30"}`} />
              <span className={metaDesc.length >= 50 ? "text-white" : "text-white/50"}>
                Meta description detailed
              </span>
            </div>
          </div>
        </div>

        {/* Trending Keywords */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-accent DEFAULT" />
            <h3 className="text-sm font-body font-semibold text-ink-primary">Trending in Web Dev</h3>
          </div>

          <div className="space-y-2">
            {TRENDING_KEYWORDS.map((kw, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-surface-soft rounded-lg border border-border">
                <div>
                  <div className="text-xs font-body font-semibold text-ink-primary mb-0.5">{kw.term}</div>
                  <div className="text-xs font-body text-ink-tertiary">Vol: {kw.volume}</div>
                </div>
                <div className="text-xs font-mono font-semibold text-accent-dark bg-accent-light px-2 py-0.5 rounded">
                  {kw.trend}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-ink-tertiary mt-4 leading-relaxed">
            Consider including trending keywords in your title if they match your service.
          </p>
        </div>

        {/* Quick Tip */}
        <div className="bg-accent-light border border-accent DEFAULT rounded-xl p-4">
          <h4 className="text-sm font-body font-semibold text-accent-dark mb-1">Pro tip</h4>
          <p className="text-xs text-accent-dark">
            Use specific keywords that describe exactly what you offer. Generic terms are harder to rank for.
          </p>
        </div>
      </div>
    </div>
  );
}
