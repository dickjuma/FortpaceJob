import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, PenTool, TrendingUp, Clock, AlertCircle, 
  CheckCircle, Play, XCircle, Award, ChevronLeft, ChevronRight,
  ShieldAlert, RefreshCcw, Search, Filter, Star
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

import { useAvailableSkillTests, useSubmitSkillTest } from '../services/freelancerHooks';
import { useConfirm } from '../../common/context/ConfirmContext';

const CATEGORY_ICONS = { dev: Code, design: PenTool, marketing: TrendingUp, development: Code };

export default function SkillTestsPage() {
  const { confirm } = useConfirm();
  const [view, setView] = useState('marketplace'); // 'marketplace', 'exam', 'results'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Exam State
  const [activeTest, setActiveTest] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examScore, setExamScore] = useState(null);

  const { data: testData, isLoading } = useAvailableSkillTests();
  const submitSkillTest = useSubmitSkillTest();
  
  const TESTS = testData?.data?.tests || [];
  const QUESTIONS = testData?.data?.questions || [];

  const testCategories = useMemo(() => {
    const cats = [{ id: 'all', name: 'All Tests', icon: null }];
    const seen = new Set();
    for (const test of TESTS) {
      const cat = test.category || 'general';
      if (seen.has(cat)) continue;
      seen.add(cat);
      cats.push({
        id: cat,
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        icon: CATEGORY_ICONS[cat.toLowerCase()] || Code,
      });
    }
    return cats;
  }, [TESTS]);

  const filteredTests = TESTS.filter(test => {
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          test.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const startExam = (test) => {
    setActiveTest(test);
    setCurrentQuestionIdx(0);
    setAnswers({});
    setTimeLeft(test.duration * 60);
    setView('exam');
  };

  const handleExitExam = async () => {
    const ok = await confirm({
      title: 'Exit assessment',
      message: 'Leave this test? Your progress will be lost and cannot be recovered.',
      confirmLabel: 'Exit test',
      critical: true,
    });
    if (ok) setView('marketplace');
  };

  const submitExam = async () => {
    let correct = 0;
    QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correct++;
    });
    const finalScore = Math.round((correct / QUESTIONS.length) * 100);
    const passed = finalScore >= activeTest.passScore;
    setExamScore(finalScore);
    setView('results');
    
    // Save result to backend
    try {
      await submitSkillTest.mutateAsync({
        testId: activeTest.id,
        score: finalScore,
        passed,
        badgeEarned: passed
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let timer;
    if (view === 'exam' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (view === 'exam' && timeLeft === 0) {
      submitExam();
    }
    return () => clearInterval(timer);
  }, [view, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const renderMarketplace = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Hero Section */}
      <div className="bg-[#222222] rounded-[32px] p-8 md:p-12 text-white shadow-xl relative overflow-hidden border border-white/10 group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-success/20 blur-[80px] rounded-full -tranzinc-y-1/2 tranzinc-x-1/3 pointer-events-none group-hover:bg-success/30 transition-colors" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[60px] rounded-full tranzinc-y-1/3 -tranzinc-x-1/4 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">Validate your skills.<br/>Stand out to clients.</h1>
          <p className="text-zinc-400 text-lg mb-8 font-medium max-w-2xl">Take Forte skill tests to earn badges, boost your trust score, and rank higher in client searches. Top performers see a 40% increase in profile views.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md group/input">
              <Search className="absolute left-5 top-1/2 -tranzinc-y-1/2 w-5 h-5 text-zinc-400 group-focus-within/input:text-success transition-colors" />
              <input 
                type="text" 
                placeholder="Search for skills (e.g., React, Python)" 
                className="w-full pl-14 pr-4 py-4 rounded-2xl text-white bg-white/5 border border-white/10 focus:outline-none focus:border-success focus:ring-1 focus:ring-success font-medium placeholder:text-zinc-500 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-success hover:bg-success/90 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-[#2bb75c]/20 whitespace-nowrap">
              Explore Tests
            </button>
          </div>
        </div>
      </div>

      {/* Categories & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-4">
        <div className="flex overflow-x-auto pb-2 w-full md:w-auto gap-3 scrollbar-hide">
          {testCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 border",
                selectedCategory === cat.id 
                  ? 'bg-success/20 text-success border-success/50 shadow-sm' 
                  : 'bg-white dark:bg-white/5 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/10 dark:hover:text-white'
              )}
            >
              {cat.icon && <cat.icon className="w-4 h-4" />}
              {cat.name}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredTests.map((test, idx) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-[#222222] rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all overflow-hidden flex flex-col relative group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-success/10 transition-colors"></div>
            
            <div className="p-8 flex-1 flex flex-col relative z-10">
              <div className="flex justify-between items-start mb-6">
                <span className={cn(
                  "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                  test.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500' :
                  test.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
                  'bg-rose-500/10 text-rose-500'
                )}>
                  {test.difficulty}
                </span>
                {test.popular && (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-lg">
                    <Star className="w-3 h-3 fill-current" /> Popular
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-4 line-clamp-2 tracking-tight">{test.title}</h3>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {test.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-widest bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 px-2.5 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto grid grid-cols-3 gap-4 border-t border-zinc-100 dark:border-white/10 pt-6">
                <div className="text-center">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1 flex items-center justify-center gap-1"><Clock className="w-3 h-3" /> Time</div>
                  <div className="font-black text-zinc-900 dark:text-white text-lg">{test.duration}m</div>
                </div>
                <div className="text-center border-l border-zinc-100 dark:border-white/10">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">Questions</div>
                  <div className="font-black text-zinc-900 dark:text-white text-lg">{test.questionsCount}</div>
                </div>
                <div className="text-center border-l border-zinc-100 dark:border-white/10">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">Pass Score</div>
                  <div className="font-black text-zinc-900 dark:text-white text-lg text-emerald-500">{test.passScore}%</div>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-zinc-50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/10 relative z-10">
              <button 
                onClick={() => startExam(test)}
                className="w-full py-3.5 bg-white dark:bg-[#222222] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white font-bold rounded-xl hover:bg-success hover:text-white hover:border-success transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                Start Test <Play className="w-4 h-4 fill-current" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderExam = () => {
    const question = QUESTIONS[currentQuestionIdx];
    const isLast = currentQuestionIdx === QUESTIONS.length - 1;
    const progress = ((currentQuestionIdx + 1) / QUESTIONS.length) * 100;

    if (!question) return null;

    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto pt-8">
        <div className="bg-white dark:bg-[#222222] rounded-t-[32px] border border-zinc-200 dark:border-white/10 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 sticky top-0 z-20 shadow-sm">
          <div>
            <h2 className="font-black text-zinc-900 dark:text-white text-2xl tracking-tight">{activeTest?.title}</h2>
            <div className="text-sm flex items-center gap-2 mt-3">
              <span className="flex items-center gap-1.5 bg-rose-500/10 text-rose-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-500/20">
                <ShieldAlert className="w-3.5 h-3.5" /> Anti-cheat active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-black tracking-widest mb-1">Time Remaining</span>
              <span className={`text-4xl font-black ${timeLeft < 300 ? 'text-rose-500 animate-pulse' : 'text-zinc-900 dark:text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <button 
              onClick={handleExitExam}
              className="text-xs font-bold text-zinc-500 hover:text-rose-500 border border-zinc-200 dark:border-white/10 px-4 py-2 rounded-xl transition-colors uppercase tracking-widest"
            >
              Exit
            </button>
          </div>
        </div>

        <div className="w-full bg-zinc-100 dark:bg-white/5 h-2 relative z-10 overflow-hidden">
          <motion.div className="h-full bg-success" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>

        <div className="bg-white dark:bg-[#222222] border-x border-b border-zinc-200 dark:border-white/10 rounded-b-[32px] shadow-sm min-h-[500px] flex flex-col relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-success/5 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="p-8 md:p-12 flex-1 relative z-10">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-black text-success uppercase tracking-widest bg-success/10 px-3 py-1.5 rounded-lg">
                Question {currentQuestionIdx + 1} of {QUESTIONS.length}
              </span>
            </div>
            
            <h3 className="text-3xl text-zinc-900 dark:text-white font-black mb-12 leading-tight tracking-tight">
              {question.text}
            </h3>

            <div className="space-y-4">
              {question.options.map((opt, idx) => (
                <label 
                  key={idx} 
                  className={cn(
                    "flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all group",
                    answers[currentQuestionIdx] === idx 
                      ? 'border-success bg-success/10' 
                      : 'border-zinc-100 dark:border-white/5 hover:border-success/50 hover:bg-zinc-50 dark:hover:bg-white/5'
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                    answers[currentQuestionIdx] === idx ? "border-success bg-success" : "border-zinc-300 dark:border-zinc-600 group-hover:border-success/50"
                  )}>
                    {answers[currentQuestionIdx] === idx && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className={cn(
                    "ml-4 text-lg font-bold transition-colors",
                    answers[currentQuestionIdx] === idx ? "text-success" : "text-zinc-700 dark:text-zinc-200"
                  )}>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-8 border-t border-zinc-100 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 flex justify-between items-center relative z-10">
            <button 
              onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
              className="flex items-center gap-2 px-6 py-3 font-bold text-sm text-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white rounded-xl transition-all uppercase tracking-widest border border-transparent hover:border-zinc-200 dark:hover:border-white/10"
            >
              <ChevronLeft size={18} /> Previous
            </button>
            
            <div className="hidden md:flex gap-3 bg-white dark:bg-[#222222] p-3 rounded-2xl border border-zinc-200 dark:border-white/10">
              {QUESTIONS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    idx === currentQuestionIdx ? 'bg-success scale-150 shadow-md shadow-[#2bb75c]/50' :
                    answers[idx] !== undefined ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20'
                  )}
                  title={`Question ${idx + 1}`}
                />
              ))}
            </div>

            {isLast ? (
              <button 
                onClick={submitExam}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-sm uppercase tracking-widest"
              >
                Submit Exam <CheckCircle size={18} />
              </button>
            ) : (
              <button 
                onClick={() => setCurrentQuestionIdx(prev => Math.min(QUESTIONS.length - 1, prev + 1))}
                className="flex items-center gap-2 px-8 py-3 bg-success hover:bg-success/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-[#2bb75c]/20 text-sm uppercase tracking-widest"
              >
                Next <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderResults = () => {
    const passed = examScore >= activeTest?.passScore;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto pt-8">
        <div className="bg-white dark:bg-[#222222] rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-xl overflow-hidden relative">
          
          <div className={cn(
            "p-12 text-center text-white relative overflow-hidden",
            passed ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' : 'bg-gradient-to-br from-rose-500 to-orange-600'
          )}>
            <div className="absolute inset-0 bg-white/5 opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
            
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="w-28 h-28 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-md shadow-2xl border border-white/20 rotate-3"
            >
              {passed ? <Award size={56} className="text-white drop-shadow-lg" /> : <XCircle size={56} className="text-white drop-shadow-lg" />}
            </motion.div>
            <h2 className="text-4xl font-black mb-3 tracking-tight drop-shadow-md">{passed ? 'Congratulations!' : 'Keep Learning!'}</h2>
            <p className="text-white/90 text-lg font-medium max-w-md mx-auto">
              {passed ? `You successfully passed the ${activeTest?.title} certification.` : `You did not pass the ${activeTest?.title} this time. Review and try again!`}
            </p>
          </div>

          <div className="p-12 relative z-10 bg-white dark:bg-[#222222]">
            <div className="flex justify-center mb-12 relative">
              <svg className="w-48 h-48 transform -rotate-90 drop-shadow-xl">
                <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-zinc-100 dark:text-white/5" />
                <motion.circle 
                  cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="16" fill="transparent" strokeDasharray="527.7" strokeDashoffset={527.7 - (527.7 * examScore) / 100}
                  className={passed ? 'text-emerald-500' : 'text-rose-500'}
                  initial={{ strokeDashoffset: 527.7 }} animate={{ strokeDashoffset: 527.7 - (527.7 * examScore) / 100 }} transition={{ duration: 1.5, delay: 0.5 }} strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">{examScore}%</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-1">Score</span>
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-white/5 rounded-[24px] p-8 mb-10 border border-zinc-100 dark:border-white/10">
              <h4 className="font-black text-zinc-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Performance Summary</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">Required to pass</span>
                  <span className="font-black text-lg text-zinc-900 dark:text-white">{activeTest?.passScore}%</span>
                </div>
                <div className="w-full h-px bg-zinc-200 dark:bg-white/10"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">Time taken</span>
                  <span className="font-black text-lg text-zinc-900 dark:text-white">{formatTime((activeTest?.duration * 60) - timeLeft)}</span>
                </div>
                <div className="w-full h-px bg-zinc-200 dark:bg-white/10"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">Questions attempted</span>
                  <span className="font-black text-lg text-zinc-900 dark:text-white">{Object.keys(answers).length} / {QUESTIONS.length}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setView('marketplace')}
                className="flex-1 py-4 px-4 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-white font-bold rounded-2xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-all text-sm uppercase tracking-widest"
              >
                Back to Tests
              </button>
              {passed ? (
                <button className="flex-1 py-4 px-4 bg-success text-white font-bold rounded-2xl hover:bg-success/90 transition-all shadow-lg shadow-[#2bb75c]/20 text-sm uppercase tracking-widest">
                  View Certificate
                </button>
              ) : (
                <button 
                  onClick={() => startExam(activeTest)}
                  className="flex-1 py-4 px-4 bg-success text-white font-bold rounded-2xl hover:bg-success/90 transition-all shadow-lg shadow-[#2bb75c]/20 flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
                >
                  <RefreshCcw size={18} /> Retake Test
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {view === 'marketplace' && <motion.div key="marketplace" exit={{ opacity: 0, y: -20 }}>{renderMarketplace()}</motion.div>}
        {view === 'exam' && <motion.div key="exam" exit={{ opacity: 0, y: -20 }}>{renderExam()}</motion.div>}
        {view === 'results' && <motion.div key="results" exit={{ opacity: 0, y: -20 }}>{renderResults()}</motion.div>}
      </AnimatePresence>
    </div>
  );
}

