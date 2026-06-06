// src/pages/freelancer/SkillTestsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  PenTool,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  Play,
  XCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  Search,
  Star,
  X,
} from 'lucide-react';

import { useAvailableSkillTests, useSubmitSkillTest } from '../services/freelancerHooks';

// ---------- Shared UI Components ----------
const Button = ({ children, variant = 'primary', disabled = false, className = '', onClick, type = 'button' }) => {
  const base = 'px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-brand-900 text-white hover:bg-brand-800 disabled:opacity-40',
    ghost: 'border border-brand-900 text-brand-900 hover:bg-surface-muted disabled:opacity-40',
    outline: 'border border-border text-ink-primary hover:bg-surface-muted disabled:opacity-40',
    success: 'bg-accent text-white hover:bg-accent-dark disabled:opacity-40',
    danger: 'bg-danger text-white hover:bg-red-700 disabled:opacity-40',
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

const Card = ({ children, className = '', hover = true }) => (
  <motion.div
    whileHover={hover ? { y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' } : {}}
    transition={{ duration: 0.2 }}
    className={`bg-white border border-border rounded-2xl p-6 shadow-sm ${className}`}
  >
    {children}
  </motion.div>
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-surface-muted text-ink-secondary',
    success: 'bg-accent-light text-accent-dark',
    warning: 'bg-warn-light text-warn',
    danger: 'bg-danger-light text-danger',
    info: 'bg-info-light text-info',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Input = ({ value, onChange, placeholder, className = '', icon: Icon }) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />}
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white ${Icon ? 'pl-9' : ''} ${className}`}
    />
  </div>
);

const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', isDestructive = false }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-md z-50"
        >
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-display font-bold text-brand-900">{title}</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-ink-secondary">{message}</p>
          </div>
          <div className="p-6 pt-0 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant={isDestructive ? 'danger' : 'primary'} onClick={onConfirm}>{confirmText}</Button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ---------- Constants ----------
const CATEGORY_ICONS = {
  dev: Code,
  design: PenTool,
  marketing: TrendingUp,
  development: Code,
};

// ---------- Main Component ----------
export default function SkillTestsPage() {
  const [view, setView] = useState('marketplace'); // 'marketplace', 'exam', 'results'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [exitModalOpen, setExitModalOpen] = useState(false);

  // Exam state
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
    const cats = [{ id: 'all', name: 'All', icon: null }];
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

  const handleExitExam = () => {
    setExitModalOpen(true);
  };

  const confirmExit = () => {
    setExitModalOpen(false);
    setView('marketplace');
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

    try {
      await submitSkillTest.mutateAsync({
        testId: activeTest.id,
        score: finalScore,
        passed,
        badgeEarned: passed,
      });
    } catch (e) {
      // silent fail for demo
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

  const getDifficultyVariant = (difficulty) => {
    if (difficulty === 'Easy') return 'success';
    if (difficulty === 'Medium') return 'warning';
    return 'danger';
  };

  // ---------- Marketplace View ----------
  const renderMarketplace = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 pb-12"
    >
      {/* Hero */}
      <div className="bg-brand-900 rounded-2xl p-8 text-white">
        <h1 className="text-3xl lg:text-4xl font-display font-bold mb-3">
          Validate your skills
        </h1>
        <p className="text-white/80 text-base mb-6 max-w-2xl">
          Take skill tests to earn badges and increase your visibility to clients.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for skills (e.g., React, Python)"
            icon={Search}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 pb-2">
        {testCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-brand-900 text-white'
                : 'bg-white border border-border text-ink-secondary hover:bg-surface-muted'
            }`}
          >
            {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Tests grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-border border-t-brand-900 rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <Card key={test.id} className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <Badge variant={getDifficultyVariant(test.difficulty)}>
                  {test.difficulty}
                </Badge>
                {test.popular && (
                  <Badge variant="warning" className="gap-1">
                    <Star className="w-3 h-3" /> Popular
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-display font-semibold text-brand-900 mb-2">
                {test.title}
              </h3>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {test.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="default">{tag}</Badge>
                ))}
              </div>
              <div className="mt-auto grid grid-cols-3 gap-3 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-[10px] font-medium text-ink-tertiary uppercase mb-1 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" /> Time
                  </div>
                  <div className="font-mono font-semibold text-ink-primary">{test.duration}m</div>
                </div>
                <div className="text-center border-l border-border">
                  <div className="text-[10px] font-medium text-ink-tertiary uppercase mb-1">Questions</div>
                  <div className="font-mono font-semibold text-ink-primary">{test.questionsCount}</div>
                </div>
                <div className="text-center border-l border-border">
                  <div className="text-[10px] font-medium text-ink-tertiary uppercase mb-1">Pass</div>
                  <div className="font-mono font-semibold text-accent">{test.passScore}%</div>
                </div>
              </div>
              <Button
                variant="primary"
                className="w-full mt-4"
                onClick={() => startExam(test)}
              >
                <Play className="w-4 h-4" /> Start test
              </Button>
            </Card>
          ))}
        </div>
      )}
      {filteredTests.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
          <p className="text-ink-secondary">No tests match your criteria.</p>
        </div>
      )}
    </motion.div>
  );

  // ---------- Exam View ----------
  const renderExam = () => {
    const question = QUESTIONS[currentQuestionIdx];
    const isLast = currentQuestionIdx === QUESTIONS.length - 1;
    const progress = ((currentQuestionIdx + 1) / QUESTIONS.length) * 100;

    if (!question) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-display font-semibold text-brand-900">
                {activeTest?.title}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] font-medium text-ink-tertiary uppercase">Time left</div>
                <div className={`font-mono font-bold text-xl ${timeLeft < 60 ? 'text-danger' : 'text-brand-900'}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>
              <Button variant="outline" onClick={handleExitExam} className="text-sm">
                Exit
              </Button>
            </div>
          </div>

          <div className="w-full h-1 bg-border">
            <motion.div
              className="h-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-6">
            <div className="mb-6">
              <span className="text-xs font-medium text-ink-tertiature">
                Question {currentQuestionIdx + 1} of {QUESTIONS.length}
              </span>
            </div>
            <h3 className="text-xl font-display font-semibold text-ink-primary mb-6">
              {question.text}
            </h3>

            <div className="space-y-3">
              {question.options.map((opt, idx) => (
                <label
                  key={idx}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    answers[currentQuestionIdx] === idx
                      ? 'border-accent bg-accent-light'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      answers[currentQuestionIdx] === idx
                        ? 'border-accent bg-accent'
                        : 'border-border'
                    }`}
                  >
                    {answers[currentQuestionIdx] === idx && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className={`ml-3 text-sm font-medium ${
                    answers[currentQuestionIdx] === idx ? 'text-accent-dark' : 'text-ink-primary'
                  }`}>
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-border flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            <div className="flex gap-2">
              {QUESTIONS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentQuestionIdx
                      ? 'w-4 bg-accent'
                      : answers[idx] !== undefined
                      ? 'bg-accent-light'
                      : 'bg-border'
                  }`}
                  aria-label={`Go to question ${idx + 1}`}
                />
              ))}
            </div>
            {isLast ? (
              <Button variant="success" onClick={submitExam}>
                Submit <CheckCircle className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => setCurrentQuestionIdx(prev => Math.min(QUESTIONS.length - 1, prev + 1))}
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  // ---------- Results View ----------
  const renderResults = () => {
    const passed = examScore >= activeTest?.passScore;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <div className={`text-center p-8 rounded-t-2xl ${passed ? 'bg-accent-light' : 'bg-danger-light'}`}>
            <div className="w-20 h-20 rounded-full bg-white mx-auto mb-4 flex items-center justify-center">
              {passed ? (
                <Award className="w-10 h-10 text-accent" />
              ) : (
                <XCircle className="w-10 h-10 text-danger" />
              )}
            </div>
            <h2 className="text-2xl font-display font-bold text-brand-900 mb-2">
              {passed ? 'Congratulations!' : 'Keep learning'}
            </h2>
            <p className="text-ink-secondary">
              {passed
                ? `You passed the ${activeTest?.title} certification.`
                : `You did not pass ${activeTest?.title} this time.`}
            </p>
          </div>

          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="#E7E5E4"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke={passed ? '#16A34A' : '#DC2626'}
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray="402"
                    strokeDashoffset={402}
                    initial={{ strokeDashoffset: 402 }}
                    animate={{ strokeDashoffset: 402 - (402 * examScore) / 100 }}
                    transition={{ duration: 1 }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-mono font-bold text-brand-900">{examScore}%</span>
                  <span className="text-[10px] font-medium text-ink-tertiary">Score</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8 p-4 bg-surface-soft rounded-xl">
              <div className="flex justify-between text-sm">
                <span className="text-ink-secondary">Required to pass</span>
                <span className="font-semibold text-ink-primary">{activeTest?.passScore}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-secondary">Time taken</span>
                <span className="font-mono font-semibold text-ink-primary">
                  {formatTime((activeTest?.duration * 60) - timeLeft)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-secondary">Questions answered</span>
                <span className="font-semibold text-ink-primary">{Object.keys(answers).length} / {QUESTIONS.length}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setView('marketplace')} className="flex-1">
                Back to tests
              </Button>
              {passed ? (
                <Button variant="success" className="flex-1">
                  View certificate
                </Button>
              ) : (
                <Button variant="primary" onClick={() => startExam(activeTest)} className="flex-1">
                  Retake test
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Modal
        isOpen={exitModalOpen}
        onClose={() => setExitModalOpen(false)}
        onConfirm={confirmExit}
        title="Exit assessment"
        message="Leave this test? Your progress will be lost and cannot be recovered."
        confirmText="Exit test"
        isDestructive
      />
      <AnimatePresence mode="wait">
        {view === 'marketplace' && renderMarketplace()}
        {view === 'exam' && renderExam()}
        {view === 'results' && renderResults()}
      </AnimatePresence>
    </div>
  );
}
