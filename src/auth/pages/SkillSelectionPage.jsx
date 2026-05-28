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

const CATEGORIES = [
  'Web Development', 'Design', 'Marketing', 'Writing', 
  'AI & Machine Learning', 'Mobile Apps', 'Video Editing'
];

const MOCK_SKILLS = [
  { id: 's1', name: 'React.js', category: 'Web Development', trending: true },
  { id: 's2', name: 'Node.js', category: 'Web Development', trending: true },
  { id: 's3', name: 'UI/UX Design', category: 'Design', trending: true },
  { id: 's4', name: 'Figma', category: 'Design', trending: false },
  { id: 's5', name: 'Copywriting', category: 'Writing', trending: false },
  { id: 's6', name: 'SEO', category: 'Marketing', trending: true },
  { id: 's7', name: 'Python', category: 'AI & Machine Learning', trending: true },
  { id: 's8', name: 'Prompt Engineering', category: 'AI & Machine Learning', trending: true },
  { id: 's9', name: 'Flutter', category: 'Mobile Apps', trending: false },
  { id: 's10', name: 'React Native', category: 'Mobile Apps', trending: true },
  { id: 's11', name: 'Premiere Pro', category: 'Video Editing', trending: false },
  { id: 's12', name: 'After Effects', category: 'Video Editing', trending: false },
  { id: 's13', name: 'TypeScript', category: 'Web Development', trending: true },
  { id: 's14', name: 'Next.js', category: 'Web Development', trending: true },
  { id: 's15', name: 'Tailwind CSS', category: 'Web Development', trending: false },
];

const STEPS = ['Account', 'Role', 'Skills', 'Experience', 'Done'];

export default function SkillSelectionPage() {
  const navigate = useNavigate();
  const initialDraft = loadOnboardingDraft();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState(() => {
    if (!Array.isArray(initialDraft.skills)) return [];

    return initialDraft.skills
      .map((skill) => {
        if (typeof skill === 'object' && skill?.id && skill?.name) {
          return skill;
        }

        if (typeof skill !== 'string') return null;

        return MOCK_SKILLS.find((item) => item.name.toLowerCase() === skill.toLowerCase()) || {
          id: skill.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: skill,
          category: 'Custom',
          trending: false,
        };
      })
      .filter(Boolean);
  });
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    saveOnboardingDraft({
      skills: selectedSkills.map(({ id, name, category }) => ({ id, name, category })),
    });
  }, [selectedSkills]);

  const filteredSkills = useMemo(() => {
    return MOCK_SKILLS.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || skill.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const trendingSkills = useMemo(() => MOCK_SKILLS.filter(s => s.trending).slice(0, 5), []);

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

  const handleContinue = () => {
    if (selectedSkills.length === 0) return;
    navigate('/auth/experience-level');
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans selection:bg-brand-500/30 overflow-x-hidden">
      {/* Background Gradients */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
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
                        isCompleted ? "bg-brand-600 text-white" : isCurrent ? "bg-brand-600 text-white ring-4 ring-brand-500/20 scale-110" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                      )}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                    </motion.div>
                    <span className={cn("text-[10px] font-bold uppercase tracking-wide hidden sm:block", isCurrent ? "text-brand-600" : isCompleted ? "text-zinc-500" : "text-zinc-400")}>
                      {step}
                    </span>
                  </div>
                  {!isLast && <div className={cn("h-[2px] w-8 sm:w-16 mx-1 rounded-full", isCompleted ? "bg-brand-600" : "bg-zinc-200 dark:bg-zinc-800")} />}
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
                What are your main <span className="bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent">skills?</span>
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400">
                Add up to 15 skills to help clients find you. This sets up your job feed recommendations.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-brand-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search skills (e.g. React, UX Design...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-white dark:bg-surface-dark border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-white font-medium focus:border-brand-500 focus:ring-0 outline-none transition-all shadow-sm"
              />
              {/* AI Suggestion Button */}
              <button className="absolute right-3 top-1/2 -tranzinc-y-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl text-xs font-bold hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors">
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
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-xl text-sm font-semibold shadow-sm"
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
              {CATEGORIES.map(cat => (
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
                  <TrendingUp className="w-4 h-4 text-brand-500" /> Trending Right Now
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
                            ? "bg-brand-50 border-brand-200 text-brand-700 dark:bg-brand-500/20 dark:border-brand-500/30 dark:text-brand-300" 
                            : "bg-white dark:bg-surface-dark border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-brand-300 hover:shadow-sm"
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
                {filteredSkills.map(skill => {
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
                          ? "bg-brand-50 border-brand-200 text-brand-700 dark:bg-brand-500/20 dark:border-brand-500/30 dark:text-brand-300" 
                          : "bg-white dark:bg-surface-dark border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-brand-300 shadow-sm hover:shadow-md"
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
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-bl-full pointer-events-none" />
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-500" /> Market Insights
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
              className="bg-gradient-to-br from-brand-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-brand-500/20"
            >
              <Sparkles className="w-6 h-6 mb-3 text-brand-200" />
              <h3 className="text-lg font-bold mb-2">Pro Tip</h3>
              <p className="text-sm text-brand-100 leading-relaxed">
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
                className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500 text-white text-sm font-bold rounded-xl shadow-sm transition-all"
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
