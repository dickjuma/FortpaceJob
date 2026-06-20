// PostJobPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, MapPin, Clock, CheckCircle, ChevronRight,
  X, DollarSign, ArrowLeft, Loader2, AlertCircle, PlusCircle, Trash2
} from 'lucide-react';
import { useCreateJob } from '../services/clientHooks';
import { getCategoryTree } from '../../platform/common/services/categoryTaxonomy';
import {
  validateBudgetRange,
  validateJobDescription,
  validateJobTitle,
  validateSelect,
} from '../../platform/common/utils/validation';

const JOB_TYPES = [
  { value: 'REMOTE',  label: 'Remote',  desc: 'Work from anywhere', Icon: Briefcase },
  { value: 'ONSITE',  label: 'Onsite',  desc: 'Specific physical location', Icon: MapPin },
  { value: 'HYBRID',  label: 'Hybrid',  desc: 'Mix of remote and onsite', Icon: Clock },
];
const SCOPE_TYPES = [
  { value: 'HOURLY', label: 'Hourly Rate', desc: 'Pay by the hour for ongoing work.' },
  { value: 'FIXED',  label: 'Fixed Price', desc: 'Pay a set price for a defined project.' },
];
const CURRENCIES = ['KES', 'USD', 'EUR', 'GBP'];
const EXPERIENCE_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];

const DEFAULT_FORM = {
  title: '', description: '', category: '', subCategory: '',
  type: 'REMOTE', budgetType: 'FIXED', currency: 'KES',
  budgetMin: '', budgetMax: '', deadline: '',
  skills: [], experienceLevel: 'INTERMEDIATE',
  isUrgent: false, screeningQuestions: [], faqs: [],
};

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function PostJobPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [skillInput, setSkillInput] = useState('');
  const [posted, setPosted] = useState(null);
  const [toast, setToast] = useState(null);
  
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const createJob = useCreateJob();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const tree = getCategoryTree();
        if (!cancelled && tree) {
          setCategories(tree);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        if (!cancelled) setLoadingCategories(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const selectedCategoryNode = useMemo(() => {
    return categories.find(c => c.name === form.category || c.slug === form.category);
  }, [categories, form.category]);

  const subCategories = useMemo(() => {
    if (!selectedCategoryNode) return [];
    // Assuming children contain subcategories
    return selectedCategoryNode.children || [];
  }, [selectedCategoryNode]);

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const addSkill = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const skill = skillInput.trim().replace(',', '');
      if (skill && !form.skills.includes(skill)) set('skills', [...form.skills, skill]);
      setSkillInput('');
    }
  };
  const removeSkill = (s) => set('skills', form.skills.filter(x => x !== s));

  const addFaq = () => {
    set('faqs', [...form.faqs, { question: '', answer: '' }]);
  };
  const updateFaq = (index, field, value) => {
    const newFaqs = [...form.faqs];
    newFaqs[index][field] = value;
    set('faqs', newFaqs);
  };
  const removeFaq = (index) => {
    set('faqs', form.faqs.filter((_, i) => i !== index));
  };

  const addQuestion = () => {
    set('screeningQuestions', [...form.screeningQuestions, { question: '', isRequired: false, answerType: 'TEXT' }]);
  };
  const updateQuestion = (index, field, value) => {
    const newQuestions = [...form.screeningQuestions];
    newQuestions[index][field] = value;
    set('screeningQuestions', newQuestions);
  };
  const removeQuestion = (index) => {
    set('screeningQuestions', form.screeningQuestions.filter((_, i) => i !== index));
  };

  const validateStep = () => {
    if (step === 1) {
      const titleErr = validateJobTitle(form.title);
      if (titleErr) { showToast('error', titleErr); return false; }
      const categoryErr = validateSelect(form.category, 'a category');
      if (categoryErr) { showToast('error', categoryErr); return false; }
      const subCategoryErr = validateSelect(form.subCategory, 'a subcategory');
      if (subCategoryErr) { showToast('error', subCategoryErr); return false; }
      const descErr = validateJobDescription(form.description, 50);
      if (descErr) { showToast('error', descErr); return false; }
    }
    if (step === 2) {
      const budgetErr = validateBudgetRange(form.budgetMin, form.budgetMax);
      if (budgetErr) { showToast('error', budgetErr); return false; }
      if (!form.currency) { showToast('error', 'Please select a currency'); return false; }
    }
    if (step === 3) {
      // Validate FAQs and Questions
      for (let faq of form.faqs) {
        if (!faq.question.trim()) { showToast('error', 'FAQ questions cannot be empty'); return false; }
      }
      for (let q of form.screeningQuestions) {
        if (!q.question.trim()) { showToast('error', 'Screening questions cannot be empty'); return false; }
      }
    }
    return true;
  };

  const handleNext = () => { if (validateStep()) setStep(s => s + 1); };
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!validateStep()) return;
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        subCategory: form.subCategory,
        type: form.type,
        budgetType: form.budgetType,
        currency: form.currency,
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
        skills: form.skills,
        experienceLevel: form.experienceLevel,
        isUrgent: form.isUrgent,
        faqs: form.faqs.filter(f => f.question.trim()),
        screeningQuestions: form.screeningQuestions.filter(q => q.question.trim()),
        ...(form.deadline && { deadline: new Date(form.deadline).toISOString() }),
      };
      const result = await createJob.mutateAsync(payload);
      setPosted(result);
    } catch (err) {
      showToast('error', err.message || 'Failed to post job');
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };
  const buttonTap = { scale: 0.97 };

  if (posted) {
    return (
      <div className="min-h-screen bg-surface-soft flex flex-col items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="max-w-md w-full bg-white border border-border rounded-2xl shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-4 border border-accent/20">
            <CheckCircle className="w-10 h-10 text-accent-dark" />
          </div>
          <h2 className="font-display text-2xl font-bold text-brand-900 mb-2">Job Posted Successfully!</h2>
          <p className="text-ink-secondary mb-6">
            Your job "<span className="font-semibold text-ink-primary">{posted.title}</span>" is now live.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate(`/client/jobs/${posted.id}`)} className="w-full px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg font-medium transition-colors">
              View Job Listing
            </button>
            <button onClick={() => navigate('/client/jobs')} className="w-full px-5 py-2.5 border border-border hover:bg-surface-soft text-ink-primary rounded-lg font-medium transition-colors">
              View All My Jobs
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <Link to="/client/jobs" className="inline-flex items-center gap-1.5 text-sm text-ink-tertiary hover:text-accent transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>
          <h1 className="font-display text-2xl font-bold text-brand-900">Post a New Job</h1>
          <p className="text-sm text-ink-secondary mt-1">Provide clear details to attract the best talent.</p>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
              <motion.div className="h-full bg-accent rounded-full" initial={{ width: 0 }} animate={{ width: step >= s ? '100%' : '0%' }} transition={{ duration: 0.3 }} />
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-tertiary font-medium">
          Step {step} of 4: {['Overview', 'Scope & Pricing', 'Screening & FAQs', 'Review'][step - 1]}
        </p>

        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Job Title *</label>
                  <input
                    value={form.title} onChange={(e) => set('title', e.target.value)}
                    placeholder="e.g. Senior React Developer for Enterprise Dashboard"
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 bg-white text-ink-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Category *</label>
                    <select
                      value={form.category} 
                      onChange={(e) => { set('category', e.target.value); set('subCategory', ''); }}
                      className="w-full h-10 border border-border rounded-lg px-3 text-sm bg-white text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                      disabled={loadingCategories}
                    >
                      <option value="">{loadingCategories ? 'Loading...' : 'Select Category'}</option>
                      {categories.map(c => <option key={c.id || c.slug} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Subcategory *</label>
                    <select
                      value={form.subCategory} onChange={(e) => set('subCategory', e.target.value)}
                      className="w-full h-10 border border-border rounded-lg px-3 text-sm bg-white text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900 disabled:opacity-50"
                      disabled={!selectedCategoryNode || subCategories.length === 0}
                    >
                      <option value="">Select Subcategory</option>
                      {subCategories.map(sc => <option key={sc.id || sc.slug} value={sc.name}>{sc.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Detailed Description *</label>
                  <textarea
                    value={form.description} onChange={(e) => set('description', e.target.value)}
                    placeholder="Describe your project, deliverables, and specific technical requirements..."
                    rows={6}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none bg-white text-ink-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Required Skills</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.skills.map(s => (
                      <span key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-light text-accent-dark border border-accent/20">
                        {s} <button onClick={() => removeSkill(s)} className="opacity-60 hover:opacity-100"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <input
                    value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={addSkill}
                    placeholder="Type a skill and press Enter..."
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 bg-white text-ink-primary"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-3">Work Model</label>
                  <div className="grid grid-cols-3 gap-3">
                    {JOB_TYPES.map(({ value, label, desc, Icon }) => (
                      <button
                        key={value} type="button" onClick={() => set('type', value)}
                        className={cn("relative p-4 rounded-xl border-2 text-center transition-all", form.type === value ? "border-accent bg-accent-light" : "border-border bg-white")}
                      >
                        {form.type === value && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-accent-dark" />}
                        <Icon className={cn("w-6 h-6 mx-auto mb-1", form.type === value ? "text-accent" : "text-ink-tertiary")} />
                        <p className="font-semibold text-ink-primary text-xs">{label}</p>
                        <p className="text-[10px] text-ink-tertiary mt-0.5">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-3">Pricing Model</label>
                  <div className="grid grid-cols-2 gap-3">
                    {SCOPE_TYPES.map(({ value, label, desc }) => (
                      <button
                        key={value} type="button" onClick={() => set('budgetType', value)}
                        className={cn("relative p-4 rounded-xl border-2 text-left transition-all", form.budgetType === value ? "border-accent bg-accent-light" : "border-border bg-white")}
                      >
                        {form.budgetType === value && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-accent-dark" />}
                        <p className="font-semibold text-ink-primary text-sm">{label}</p>
                        <p className="text-xs text-ink-tertiary mt-0.5">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                     <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Currency *</label>
                     <select
                      value={form.currency} onChange={(e) => set('currency', e.target.value)}
                      className="w-full h-10 border border-border rounded-lg px-3 text-sm bg-white text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    >
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Budget Range *</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
                        <input
                          type="number" value={form.budgetMin} onChange={(e) => set('budgetMin', e.target.value)} placeholder="Min"
                          className="w-full h-10 border border-border rounded-lg pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 bg-white"
                        />
                      </div>
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
                        <input
                          type="number" value={form.budgetMax} onChange={(e) => set('budgetMax', e.target.value)} placeholder="Max"
                          className="w-full h-10 border border-border rounded-lg pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Experience Level</label>
                    <select
                      value={form.experienceLevel} onChange={(e) => set('experienceLevel', e.target.value)}
                      className="w-full h-10 border border-border rounded-lg px-3 text-sm bg-white text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    >
                      {EXPERIENCE_LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Deadline (Optional)</label>
                    <input
                      type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} min={new Date().toISOString().split('T')[0]}
                      className="w-full h-10 border border-border rounded-lg px-3 text-sm bg-white text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="block text-xs font-semibold text-ink-secondary">Screening Questions</label>
                    <button type="button" onClick={addQuestion} className="text-xs font-medium text-accent hover:text-accent-dark flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add Question</button>
                  </div>
                  {form.screeningQuestions.length === 0 ? (
                    <p className="text-xs text-ink-tertiary p-4 border border-dashed border-border rounded-lg text-center">No screening questions added.</p>
                  ) : (
                    <div className="space-y-3">
                      {form.screeningQuestions.map((q, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <input
                            value={q.question} onChange={e => updateQuestion(idx, 'question', e.target.value)} placeholder="Type a question..."
                            className="flex-1 h-10 border border-border rounded-lg px-3 text-sm focus:ring-2 focus:ring-brand-900"
                          />
                          <button type="button" onClick={() => removeQuestion(idx)} className="p-2.5 text-ink-tertiary hover:text-warn rounded-lg border border-border bg-white"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="block text-xs font-semibold text-ink-secondary">Frequently Asked Questions</label>
                    <button type="button" onClick={addFaq} className="text-xs font-medium text-accent hover:text-accent-dark flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add FAQ</button>
                  </div>
                  {form.faqs.length === 0 ? (
                    <p className="text-xs text-ink-tertiary p-4 border border-dashed border-border rounded-lg text-center">No FAQs added.</p>
                  ) : (
                    <div className="space-y-4">
                      {form.faqs.map((f, idx) => (
                        <div key={idx} className="p-4 border border-border rounded-xl bg-surface-soft relative">
                          <button type="button" onClick={() => removeFaq(idx)} className="absolute top-3 right-3 text-ink-tertiary hover:text-warn"><Trash2 className="w-4 h-4"/></button>
                          <input
                            value={f.question} onChange={e => updateFaq(idx, 'question', e.target.value)} placeholder="Question"
                            className="w-full mb-2 h-9 border border-border rounded-md px-3 text-sm focus:ring-2 focus:ring-brand-900 bg-white"
                          />
                          <textarea
                            value={f.answer} onChange={e => updateFaq(idx, 'answer', e.target.value)} placeholder="Answer" rows={2}
                            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-900 bg-white resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5">
                <h2 className="font-display text-lg font-bold text-brand-900">Review Your Job Listing</h2>
                <div className="bg-surface-soft rounded-xl p-5 space-y-4 border border-border">
                  <div><p className="text-xs text-ink-tertiary mb-1">Job Title</p><p className="font-medium text-ink-primary">{form.title}</p></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-ink-tertiary mb-1">Category</p><p className="text-sm text-ink-primary">{form.category}</p></div>
                    <div><p className="text-xs text-ink-tertiary mb-1">Subcategory</p><p className="text-sm text-ink-primary">{form.subCategory}</p></div>
                  </div>
                  <div><p className="text-xs text-ink-tertiary mb-1">Description</p><p className="text-sm text-ink-primary leading-relaxed whitespace-pre-wrap">{form.description}</p></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><p className="text-xs text-ink-tertiary mb-1">Type</p><p className="text-sm text-ink-primary">{form.type}</p></div>
                    <div><p className="text-xs text-ink-tertiary mb-1">Pricing</p><p className="text-sm text-ink-primary">{form.budgetType}</p></div>
                    <div><p className="text-xs text-ink-tertiary mb-1">Level</p><p className="text-sm text-ink-primary">{form.experienceLevel}</p></div>
                  </div>
                  <div>
                    <p className="text-xs text-ink-tertiary mb-1">Budget ({form.currency})</p>
                    <p className="text-sm font-semibold text-accent">{form.currency} {Number(form.budgetMin).toLocaleString()} – {Number(form.budgetMax).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between pt-6 mt-4 border-t border-border">
            <motion.button whileTap={buttonTap} type="button" onClick={handleBack} className={cn("inline-flex items-center gap-1.5 px-5 py-2.5 border border-border rounded-lg text-sm font-medium transition-colors", step === 1 ? "invisible" : "bg-white text-ink-primary hover:bg-surface-soft")}>
              <ArrowLeft className="w-4 h-4" /> Back
            </motion.button>
            {step < 4 ? (
              <motion.button whileTap={buttonTap} type="button" onClick={handleNext} className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors">
                Next <ChevronRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button whileTap={buttonTap} type="button" onClick={handleSubmit} disabled={createJob.isPending} className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                {createJob.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting...</> : <><CheckCircle className="w-4 h-4" /> Publish Job</>}
              </motion.button>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-sm font-medium bg-red-100 text-red-700 border border-red-200">
            <AlertCircle size={16} /> {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
