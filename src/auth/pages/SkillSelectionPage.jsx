import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Check, Sparkles, TrendingUp, DollarSign, 
  ChevronRight, ChevronLeft, X, Layers, Activity,
  Briefcase
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import { loadOnboardingDraft, saveOnboardingDraft } from '../utils/onboardingDraft';
import TaxonomyRolePicker from '../components/TaxonomyRolePicker';
import { onboardingAPI, publicAPI } from '../../common/services/api';
import { extractList } from '../../common/utils/apiHelpers';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'All', 'Web Development', 'Design', 'Marketing', 'Writing',
  'AI & Machine Learning', 'Mobile Apps', 'Video Editing',
];

function flattenSkillsFromTree(raw) {
  const tree = extractList(raw?.sections || raw?.data || raw);
  const skills = [];
  for (const section of tree) {
    const sectionName = section.name || section.title || 'General';
    for (const group of section.groups || []) {
      for (const role of group.roles || []) {
        for (const skill of role.skills || []) {
          const name = typeof skill === 'string' ? skill : skill.name;
          if (!name) continue;
          skills.push({
            id: skill.id || skill.slug || `${role.slug}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name,
            category: sectionName,
            trending: !!(skill.trending || role.trending),
          });
        }
        if (role.name && !(role.skills || []).length) {
          skills.push({
            id: role.slug || role.id,
            name: role.name,
            category: sectionName,
            trending: false,
          });
        }
      }
    }
  }
  const seen = new Set();
  return skills.filter((s) => {
    const key = s.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const STEPS = ['Account', 'Role', 'Skills', 'Experience', 'Done'];

export default function SkillSelectionPage() {
  const navigate = useNavigate();
  const initialDraft = loadOnboardingDraft();
  const [searchQuery, setSearchQuery] = useState('');
  const [catalogSkills, setCatalogSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState(() => {
    if (!Array.isArray(initialDraft.skills)) return [];
    return initialDraft.skills
      .map((skill) => {
        if (typeof skill === 'object' && skill?.id && skill?.name) return skill;
        if (typeof skill !== 'string') return null;
        return {
          id: skill.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: skill,
          category: 'Custom',
          trending: false,
        };
      })
      .filter(Boolean);
  });
  const [activeCategory, setActiveCategory] = useState('All');
  const [taxonomySelection, setTaxonomySelection] = useState(() => initialDraft.taxonomy || null);

  useEffect(() => {
    let cancelled = false;
    publicAPI
      .getCategoryTree()
      .then((raw) => {
        if (!cancelled) setCatalogSkills(flattenSkillsFromTree(raw));
      })
      .catch(() => {
        if (!cancelled) setCatalogSkills([]);
      })
      .finally(() => {
        if (!cancelled) setSkillsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    saveOnboardingDraft({
      skills: selectedSkills.map(({ id, name, category }) => ({ id, name, category })),
      taxonomy: taxonomySelection,
    });
  }, [selectedSkills, taxonomySelection]);

  const categoryOptions = useMemo(() => {
    const cats = ['All', ...new Set(catalogSkills.map((s) => s.category).filter(Boolean))];
    return cats.length > 1 ? cats : ['All', ...CATEGORIES.filter((c) => c !== 'All')];
  }, [catalogSkills]);

  const filteredSkills = useMemo(() => {
    return catalogSkills.filter((skill) => {
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || skill.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, catalogSkills]);

  const trendingSkills = useMemo(() => catalogSkills.filter((s) => s.trending).slice(0, 5), [catalogSkills]);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => {
      if (prev.find(s => s.id === skill.id)) {
        return prev.filter(s => s.id !== skill.id);
      }
      if (prev.length >= 15) return prev; // Max 15 skills
      return [...prev, skill];
    });
  };

  const removeSkill = (id) => {
    setSelectedSkills(prev => prev.filter(s => s.id !== id));
  };

  const handleContinue = async () => {
    if (!taxonomySelection?.roleSlug) {
      toast.error('Choose your primary role from the Forte taxonomy.');
      return;
    }
    if (selectedSkills.length === 0) {
      toast.error('Add at least one skill.');
      return;
    }
    try {
      await onboardingAPI.completeStep('category', {
        roleSlug: taxonomySelection.roleSlug,
        roleName: taxonomySelection.roleName,
        sectionSlug: taxonomySelection.sectionSlug,
        primaryCategoryId: taxonomySelection.primaryCategoryId,
        workMode: taxonomySelection.workMode,
        skills: selectedSkills.map((s) => s.name),
        displayName: initialDraft.fullName,
      });
      await onboardingAPI.completeStep('skills', { skills: selectedSkills.map((s) => s.name) });
    } catch (err) {
      console.warn('[SkillSelection] onboarding sync', err);
    }
    navigate('/auth/experience-level');
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans selection:bg-[#14a800]/30 overflow-x-hidden">
      {/* Background Gradients */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#14a800]/10 blur-[120px]" />
        <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] rounded-full bg-#14a800]/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#14a800] rounded-xl flex items-center justify-center shadow-lg shadow-[#14a800]/25/30">
              <Briefcase className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Forte.</span>
          </motion.div>
        </div>

        {/* Progress Stepper */}
        <div className="w-full max-w-4xl mx-auto px-4 mb-8">
          <div className="flex items-center justify-center gap-0">
            {STEPS.map((step, idx) => {
              const isCompleted = idx < 2;
              const isCurrent = idx === 2;
              const isLast = idx === STEPS.length - 1;
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-1">
                    <motion.div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
                        isCompleted ? "bg-[#14a800] text-white" : isCurrent ? "bg-[#14a800] text-white ring-4 ring-#14a800]/20 scale-110" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                      )}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                    </motion.div>
                    <span className={cn("text-[10px] font-bold uppercase tracking-wide hidden sm:block", isCurrent ? "text-[#14a800]" : isCompleted ? "text-zinc-500" : "text-zinc-400")}>
                      {step}
                    </span>
                  </div>
                  {!isLast && <div className={cn("h-[2px] w-8 sm:w-16 mx-1 rounded-full", isCompleted ? "bg-[#14a800]" : "bg-zinc-200 dark:bg-zinc-800")} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16 flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column - Selection Area */}
          <div className="flex-1 w-full min-w-0 space-y-6">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
                What is your <span className="bg-gradient-to-r from-[#14a800] to-violet-600 bg-clip-text text-transparent">primary role?</span>
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400">
                Pick your industry and trade — then add skills so clients and our matcher can find you.
              </p>
            </div>

            <div className="bg-white dark:bg-surface-dark border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 mb-6">
              <TaxonomyRolePicker value={taxonomySelection} onChange={setTaxonomySelection} />
            </div>

            {/* Search Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-[#14a800] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search skills (e.g. React, UX Design...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-white dark:bg-surface-dark border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-white font-medium focus:border-[#14a800]/20 focus:ring-0 outline-none transition-all shadow-sm"
              />
              {/* AI Suggestion Button */}
              <button className="absolute right-3 top-1/2 -tranzinc-y-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-[#14a800]/5 dark:bg-[#14a800]/10 text-[#14a800] dark:text-[#14a800] rounded-xl text-xs font-bold hover:bg-[#14a800]/10 dark:hover:bg-[#14a800]/20 transition-colors">
                <Sparkles className="w-3.5 h-3.5" /> Auto-Suggest
              </button>
            </div>

            {/* Selected Skills */}
            <AnimatePresence>
              {selectedSkills.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Selected Skills</span>
                    <span className={cn("text-xs font-bold", selectedSkills.length === 15 ? "text-rose-500" : "text-zinc-400")}>
                      {selectedSkills.length} / 15
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {selectedSkills.map(skill => (
                        <motion.span
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          key={`selected-${skill.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#14a800] text-white rounded-xl text-sm font-semibold shadow-sm"
                        >
                          {skill.name}
                          <button onClick={() => removeSkill(skill.id)} className="p-0.5 hover:bg-black/20 rounded-md transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Category Filter */}
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <button
                onClick={() => setActiveCategory('All')}
                className={cn(
                  "whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all",
                  activeCategory === 'All' ? "bg-surface-dark dark:bg-white text-white dark:text-zinc-900" : "bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                )}
              >
                All Categories
              </button>
              {categoryOptions.filter((c) => c !== 'All').map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all",
                    activeCategory === cat ? "bg-surface-dark dark:bg-white text-white dark:text-zinc-900" : "bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Trending / Popular Skills (Only show when not searching) */}
            {!searchQuery && activeCategory === 'All' && (
              <div className="mb-6">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#14a800]" /> Trending Right Now
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingSkills.map(skill => {
                    const isSelected = selectedSkills.some(s => s.id === skill.id);
                    return (
                      <button
                        key={`trending-${skill.id}`}
                        onClick={() => toggleSkill(skill)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
                          isSelected 
                            ? "bg-[#14a800]/5 border-[#14a800]/20 text-[#14a800] dark:bg-[#14a800]/20 dark:border-[#14a800]/20/30 dark:text-[#14a800]" 
                            : "bg-white dark:bg-surface-dark border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-[#14a800]/50 hover:shadow-sm"
                        )}
                      >
                        {skill.name}
                        {isSelected && <Check className="inline w-3.5 h-3.5 ml-1.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Skill Grid */}
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                {searchQuery ? 'Search Results' : 'Suggested Skills'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillsLoading ? (
                  <div className="w-full flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[#14a800]" />
                  </div>
                ) : filteredSkills.map(skill => {
                  const isSelected = selectedSkills.some(s => s.id === skill.id);
                  return (
                    <motion.button
                      layout
                      key={`grid-${skill.id}`}
                      onClick={() => toggleSkill(skill)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
                        isSelected 
                          ? "bg-[#14a800]/5 border-[#14a800]/20 text-[#14a800] dark:bg-[#14a800]/20 dark:border-[#14a800]/20/30 dark:text-[#14a800]" 
                          : "bg-white dark:bg-surface-dark border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-[#14a800]/50 shadow-sm hover:shadow-md"
                      )}
                    >
                      {skill.name}
                      {isSelected ? <Check className="inline w-3.5 h-3.5 ml-1.5" /> : <span className="inline-block w-4 h-4 ml-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] flex items-center justify-center text-zinc-400 font-bold">+</span>}
                    </motion.button>
                  );
                })}
                {filteredSkills.length === 0 && (
                  <p className="text-sm text-zinc-500 p-4">No skills found matching "{searchQuery}". Try a different term.</p>
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar - Insights */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#14a800]/10 rounded-bl-full pointer-events-none" />
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#14a800]" /> Market Insights
              </h3>
              
              <div className="space-y-4">
                <div className="bg-surface dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-700/50">
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide mb-1">Top Skill Combo</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">React + Node.js</p>
                  <div className="flex items-center gap-1 mt-1 text-success dark:text-success">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">+24% demand this month</span>
                  </div>
                </div>

                <div className="bg-surface dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-700/50">
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide mb-1">Avg. Hourly Rate</p>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-zinc-400" />
                    <span className="text-lg font-black text-zinc-900 dark:text-white">45 - 85</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">For your selected skills</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-[#14a800] to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-[#14a800]/25/20"
            >
              <Sparkles className="w-6 h-6 mb-3 text-[#14a800]" />
              <h3 className="text-lg font-bold mb-2">Pro Tip</h3>
              <p className="text-sm text-[#14a800] leading-relaxed">
                Freelancers with 5+ verified skills receive <span className="font-bold text-white">3x more interview invites</span>. Be specific with your expertise!
              </p>
            </motion.div>
          </div>

        </div>

        {/* Sticky Footer Actions */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-zinc-500 hidden sm:block">
                {selectedSkills.length} skills selected
              </span>
              <button 
                onClick={handleContinue}
                disabled={selectedSkills.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#14a800] hover:bg-[#118a00] disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500 text-white text-sm font-bold rounded-xl shadow-sm transition-all"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
