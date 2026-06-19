// src/pages/freelancer/SkillsManagementPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Search,
  Plus,
  X,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  BarChart3,
  Check,
  PlayCircle,
  AlertCircle,
} from 'lucide-react';
import { useFreelancerProfile, useUpdateFreelancerProfile } from '../services/freelancerHooks';

// ---------- Shared UI Components (inline) ----------
const Button = ({ children, variant = 'primary', disabled = false, className = '', onClick, type = 'button' }) => {
  const base = 'px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-brand-900 text-white hover:bg-brand-800 disabled:opacity-40',
    ghost: 'border border-brand-900 text-brand-900 hover:bg-surface-muted disabled:opacity-40',
    outline: 'border border-border text-ink-primary hover:bg-surface-muted disabled:opacity-40',
    success: 'bg-accent text-white hover:bg-accent-dark disabled:opacity-40',
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

// ---------- Predefined taxonomy ----------
const TAXONOMY = [
  'React', 'Node.js', 'TypeScript', 'GraphQL', 'AWS', 'Docker', 'Kubernetes',
  'Next.js', 'Python', 'Tailwind CSS', 'PostgreSQL', 'MongoDB', 'Figma',
  'Solidity', 'Web3.js', 'Go', 'Redis', 'CI/CD', 'Machine Learning', 'TensorFlow',
];

// ---------- Main Component ----------
export default function SkillsManagementPage() {
  const { data: profile } = useFreelancerProfile();
  const updateProfile = useUpdateFreelancerProfile();
  
  const [skills, setSkills] = useState([]);

  React.useEffect(() => {
    if (profile?.skills) {
      if (Array.isArray(profile.skills)) {
        // Handle case where it's an array of strings or objects
        const mappedSkills = profile.skills.map(s => 
          typeof s === 'string' 
            ? { name: s, level: 'Intermediate', verified: false, endorsedCount: 0 }
            : s
        );
        setSkills(mappedSkills);
      } else if (typeof profile.skills === 'string') {
        try {
          const parsed = JSON.parse(profile.skills);
          setSkills(parsed.map(s => 
            typeof s === 'string' 
              ? { name: s, level: 'Intermediate', verified: false, endorsedCount: 0 }
              : s
          ));
        } catch (e) {
          setSkills([]);
        }
      }
    }
  }, [profile]);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // Assessment modal states
  const [testModalSkill, setTestModalSkill] = useState(null);
  const [testStep, setTestStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const addSkill = async (e) => {
    e.preventDefault();
    const cleanName = newSkillName.trim();
    if (!cleanName) return;

    if (skills.some((s) => s.name.toLowerCase() === cleanName.toLowerCase())) {
      setToast({ type: 'error', message: 'Skill already added' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const newSkill = {
      name: cleanName,
      level: newSkillLevel,
      verified: false,
      endorsedCount: 0,
    };
    
    const newSkills = [...skills, newSkill];
    try {
      await updateProfile.mutateAsync({ skills: newSkills });
      setSkills(newSkills);
      setNewSkillName('');
      setSearchQuery('');
      setToast({ type: 'success', message: `Added ${cleanName}` });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to add skill' });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const removeSkill = async (name) => {
    const newSkills = skills.filter((s) => s.name !== name);
    try {
      await updateProfile.mutateAsync({ skills: newSkills });
      setSkills(newSkills);
      setToast({ type: 'success', message: `Removed ${name}` });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to remove skill' });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleEndorse = async (name) => {
    const newSkills = skills.map((s) => (s.name === name ? { ...s, endorsedCount: s.endorsedCount + 1 } : s));
    try {
      await updateProfile.mutateAsync({ skills: newSkills });
      setSkills(newSkills);
      setToast({ type: 'success', message: `Endorsed ${name}` });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to endorse skill' });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const startVerificationTest = (skill) => {
    setTestModalSkill(skill);
    setTestStep(0);
    setSelectedAnswer(null);
  };

  const completeTest = async () => {
    // Correct answer index is 1 (second option)
    if (selectedAnswer === 1) {
      const newSkills = skills.map((s) =>
        s.name === testModalSkill.name ? { ...s, verified: true } : s
      );
      try {
        await updateProfile.mutateAsync({ skills: newSkills });
        setSkills(newSkills);
        setTestStep(2);
        setToast({ type: 'success', message: `${testModalSkill.name} verified!` });
      } catch (err) {
        setToast({ type: 'error', message: 'Failed to save verification' });
      }
      setTimeout(() => setToast(null), 3000);
    } else {
      setToast({ type: 'error', message: 'Incorrect answer. Please try again later.' });
      setTimeout(() => setToast(null), 3000);
      setTestModalSkill(null);
    }
  };

  const filteredTaxonomy = TAXONOMY.filter(
    (item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !skills.some((s) => s.name.toLowerCase() === item.toLowerCase())
  );

  const expertCount = skills.filter((s) => s.level === 'Expert').length;
  const intermediateCount = skills.filter((s) => s.level === 'Intermediate').length;
  const beginnerCount = skills.filter((s) => s.level === 'Beginner').length;
  const totalSkills = skills.length;

  const distribution = [
    { label: 'Expert', count: expertCount, color: 'bg-accent' },
    { label: 'Intermediate', count: intermediateCount, color: 'bg-warn' },
    { label: 'Beginner', count: beginnerCount, color: 'bg-info' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-md text-sm font-medium flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-accent text-white' : 'bg-danger text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light text-accent-dark rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-display font-bold text-brand-900">Skills directory</h1>
          </div>
          <p className="text-sm text-ink-secondary">
            Manage your verified capabilities, proficiency levels, and endorsements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Add Skill Form */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-base font-display font-semibold text-brand-900 mb-4 flex items-center gap-2 border-b border-border pb-3">
              <Plus className="w-5 h-5 text-accent" />
              Add skill
            </h3>

            <form onSubmit={addSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-secondary uppercase tracking-wide mb-1.5">
                  Skill name
                </label>
                <Input
                  value={newSkillName}
                  onChange={(e) => {
                    setNewSkillName(e.target.value);
                    setSearchQuery(e.target.value);
                  }}
                  placeholder="e.g., Docker, Next.js"
                  icon={Search}
                  required
                />
                {newSkillName.trim() && filteredTaxonomy.length > 0 && (
                  <div className="mt-2 border border-border rounded-lg max-h-36 overflow-y-auto">
                    <div className="p-2 space-y-1">
                      <p className="text-[10px] font-medium text-ink-tertiary px-2 pb-1 border-b border-border">
                        Suggestions
                      </p>
                      {filteredTaxonomy.map((tax) => (
                        <button
                          key={tax}
                          type="button"
                          onClick={() => {
                            setNewSkillName(tax);
                            setSearchQuery('');
                          }}
                          className="w-full text-left px-2 py-1.5 text-xs font-medium text-ink-primary hover:bg-surface-muted rounded-lg flex justify-between items-center"
                        >
                          {tax}
                          <ChevronRight className="w-3 h-3 text-ink-tertiary" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-secondary uppercase tracking-wide mb-1.5">
                  Proficiency level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'Intermediate', 'Expert'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setNewSkillLevel(level)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                        newSkillLevel === level
                          ? 'border-accent bg-accent-light text-accent-dark'
                          : 'border-border bg-white text-ink-secondary hover:bg-surface-muted'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" variant="success" className="w-full">
                <Plus className="w-4 h-4" />
                Add skill
              </Button>
            </form>
          </Card>

          {/* Expertise Distribution */}
          <Card className="bg-brand-900 text-white">
            <h3 className="text-sm font-display font-semibold tracking-wide mb-4 flex items-center gap-2 pb-3 border-b border-white/20">
              <BarChart3 className="w-4 h-4 text-accent" />
              Expertise distribution
            </h3>
            <div className="space-y-3">
              {distribution.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{item.label}</span>
                    <span className="font-mono">{item.count}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: totalSkills ? `${(item.count / totalSkills) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Skills List */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-base font-display font-semibold text-brand-900 mb-4 flex justify-between items-center border-b border-border pb-3">
              <span>Active skills ({skills.length})</span>
            </h3>

            <div className="space-y-3">
              {skills.length === 0 ? (
                <div className="text-center py-12">
                  <HelpCircle className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
                  <p className="text-ink-secondary">No skills added yet. Add your first skill above.</p>
                </div>
              ) : (
                skills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border rounded-2xl hover:border-accent/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent-light text-accent-dark flex items-center justify-center font-mono font-bold">
                        {skill.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-ink-primary">{skill.name}</span>
                          <Badge
                            variant={
                              skill.level === 'Expert'
                                ? 'success'
                                : skill.level === 'Intermediate'
                                ? 'warning'
                                : 'info'
                            }
                          >
                            {skill.level}
                          </Badge>
                          {skill.verified && (
                            <Badge variant="success" className="gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-ink-secondary mt-1">
                          <span>{skill.endorsedCount} endorsements</span>
                          <button
                            onClick={() => handleEndorse(skill.name)}
                            className="text-accent hover:underline"
                          >
                            +1
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {!skill.verified ? (
                        <Button
                          variant="outline"
                          onClick={() => startVerificationTest(skill)}
                          className="text-sm"
                        >
                          <PlayCircle className="w-4 h-4" />
                          Verify
                        </Button>
                      ) : (
                        <Badge variant="success" className="gap-1">
                          <Check className="w-3 h-3" />
                          Verified
                        </Badge>
                      )}
                      <button
                        onClick={() => removeSkill(skill.name)}
                        className="p-2 text-ink-tertiary hover:text-danger rounded-lg transition-colors"
                        aria-label="Remove skill"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Assessment Modal */}
      <AnimatePresence>
        {testModalSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
            >
              <div className="flex justify-between items-center p-6 border-b border-border">
                <h3 className="text-lg font-display font-bold text-brand-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  {testModalSkill.name} assessment
                </h3>
                <button
                  onClick={() => setTestModalSkill(null)}
                  className="p-1 text-ink-tertiary hover:text-ink-primary rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {testStep === 0 && (
                  <div className="space-y-4">
                    <p className="text-sm text-ink-secondary">
                      This short quiz will test your knowledge of <strong className="text-ink-primary">{testModalSkill.name}</strong>.
                      Passing grants you a verified badge visible to clients.
                    </p>
                    <div className="space-y-2 p-3 bg-surface-soft rounded-lg">
                      <div className="flex items-center gap-2 text-xs text-ink-secondary">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                        Duration: ~1 minute
                      </div>
                      <div className="flex items-center gap-2 text-xs text-ink-secondary">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                        1 multiple choice question
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setTestModalSkill(null)}>
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={() => setTestStep(1)}>
                        Start
                      </Button>
                    </div>
                  </div>
                )}

                {testStep === 1 && (
                  <div className="space-y-4">
                    <div className="p-3 bg-surface-soft rounded-lg">
                      <p className="text-xs font-medium text-accent uppercase tracking-wide mb-1">
                        Question 1 of 1
                      </p>
                      <p className="text-sm font-medium text-ink-primary">
                        Which of the following is true regarding performance optimization in React applications?
                      </p>
                    </div>

                    <div className="space-y-2">
                      {[
                        'Replacing all state changes with Redux actions automatically stops re-renders.',
                        'useMemo and useCallback memoize values/references to prevent expensive re-evaluations.',
                        'React re-renders a child component only when its specific props value changes.',
                        'Adding inline functions to JSX properties completely overrides React Fiber diff algorithms.',
                      ].map((answer, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedAnswer(idx)}
                          className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                            selectedAnswer === idx
                              ? 'border-accent bg-accent-light text-accent-dark'
                              : 'border-border text-ink-secondary hover:bg-surface-muted'
                          }`}
                        >
                          {answer}
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={() => setTestStep(0)}>
                        Back
                      </Button>
                      <Button
                        variant="primary"
                        onClick={completeTest}
                        disabled={selectedAnswer === null}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                )}

                {testStep === 2 && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-accent-light text-accent-dark flex items-center justify-center mx-auto">
                      <Award className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-display font-bold text-brand-900">
                        Verified!
                      </h4>
                      <p className="text-sm text-ink-secondary mt-1">
                        You passed the assessment. The verified badge has been added to{' '}
                        <strong>{testModalSkill.name}</strong>.
                      </p>
                    </div>
                    <Button variant="primary" onClick={() => setTestModalSkill(null)}>
                      Done
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
