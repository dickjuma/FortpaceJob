// PostJobPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, MapPin, Clock, CheckCircle, ChevronRight,
  X, DollarSign, ArrowLeft, Loader2, AlertCircle,
} from 'lucide-react';
import { useCreateJob } from '../services/clientHooks';
import {
  validateBudgetRange,
  validateJobDescription,
  validateJobTitle,
  validateSelect,
} from '../../common/utils/validation';

const JOB_TYPES = [
  { value: 'REMOTE',  label: 'Remote',  desc: 'Work from anywhere', Icon: Briefcase },
  { value: 'ONSITE',  label: 'Onsite',  desc: 'Specific physical location', Icon: MapPin },
  { value: 'HYBRID',  label: 'Hybrid',  desc: 'Mix of remote and onsite', Icon: Clock },
];
const SCOPE_TYPES = [
  { value: 'HOURLY', label: 'Hourly Rate', desc: 'Pay by the hour for ongoing work.' },
  { value: 'FIXED',  label: 'Fixed Price', desc: 'Pay a set price for a defined project.' },
];
const CATEGORIES = ['Software & Tech', 'Design & Creative', 'Writing & Content', 'Marketing & Sales', 'Finance & Accounting', 'Engineering & Architecture', 'Data & Analytics', 'Legal', 'Video & Animation', 'Music & Audio', 'Business', 'Other'];
const EXPERIENCE_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];

const DEFAULT_FORM = {
  title: '', description: '', category: '',
  type: 'REMOTE', budgetType: 'FIXED',
  budgetMin: '', budgetMax: '', deadline: '',
  skills: [], experienceLevel: 'INTERMEDIATE',
  isUrgent: false, screeningQuestions: [],
};

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function PostJobPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [skillInput, setSkillInput] = useState('');
  const [posted, setPosted] = useState(null);
  const [toast, setToast] = useState(null);

  const createJob = useCreateJob();

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

  const validateStep = () => {
    if (step === 1) {
      const titleErr = validateJobTitle(form.title);
      if (titleErr) { showToast('error', titleErr); return false; }
      const descErr = validateJobDescription(form.description, 50);
      if (descErr) { showToast('error', descErr); return false; }
      const categoryErr = validateSelect(form.category, 'a category');
      if (categoryErr) { showToast('error', categoryErr); return false; }
    }
    if (step === 2) {
      const budgetErr = validateBudgetRange(form.budgetMin, form.budgetMax);
      if (budgetErr) { showToast('error', budgetErr); return false; }
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
        type: form.type,
        budgetType: form.budgetType,
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
        skills: form.skills,
        experienceLevel: form.experienceLevel,
        isUrgent: form.isUrgent,
        ...(form.deadline && { deadline: new Date(form.deadline).toISOString() }),
      };
      const result = await createJob.mutateAsync(payload);
      setPosted(result);
    } catch (err) {
      showToast('error', err.message || 'Failed to post job');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };
  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };
  const buttonTap = { scale: 0.97 };

  // Success screen
  if (posted) {
    return (
      <div className="min-h-screen bg-surface-soft flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full bg-white border border-border rounded-2xl shadow-sm p-8 text-center"
        >
          <div className="w-20 h-20 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-4 border border-accent/20">
            <CheckCircle className="w-10 h-10 text-accent-dark" />
          </div>
          <h2 className="font-display text-2xl font-bold text-brand-900 mb-2">Job Posted Successfully!</h2>
          <p className="text-ink-secondary mb-6">
            Your job "<span className="font-semibold text-ink-primary">{posted.title}</span>" is now live. Freelancers can see and apply to it.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(`/client/jobs/${posted.id}`)}
              className="w-full px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg font-medium transition-colors"
            >
              View Job Listing
            </button>
            <button
              onClick={() => navigate('/client/jobs')}
              className="w-full px-5 py-2.5 border border-border hover:bg-surface-soft text-ink-primary rounded-lg font-medium transition-colors"
            >
              View All My Jobs
            </button>
            <button
              onClick={() => { setForm(DEFAULT_FORM); setStep(1); setPosted(null); }}
              className="text-sm text-ink-tertiary hover:text-ink-primary transition-colors"
            >
              Post Another Job
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <Link
            to="/client/jobs"
            className="inline-flex items-center gap-1.5 text-sm text-ink-tertiary hover:text-accent transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>
          <h1 className="font-display text-2xl font-bold text-brand-900">Post a New Job</h1>
          <p className="text-sm text-ink-secondary mt-1">Fill in the details to attract top-rated talent.</p>
        </div>

        {/* Step Progress */}
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: step >= s ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-tertiary">Step {step} of 3</p>

        {/* Form Card */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Job Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                    placeholder="e.g. Senior React Developer for Enterprise Dashboard"
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white text-ink-primary placeholder:text-ink-tertiary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => set('category', e.target.value)}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm bg-white text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                  >
                    <option value="">Select a category...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
                    Detailed Description * <span className="text-ink-tertiary">(min. 50 chars)</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    placeholder="Describe your project, deliverables, and specific technical requirements..."
                    rows={5}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none bg-white text-ink-primary placeholder:text-ink-tertiary"
                  />
                  <p className="text-xs text-ink-tertiary mt-1">{form.description.length} / 5000 chars</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Required Skills</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.skills.map(s => (
                      <span key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-light text-accent-dark border border-accent/20">
                        {s}
                        <button onClick={() => removeSkill(s)} type="button" className="opacity-60 hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                    placeholder="Type a skill and press Enter..."
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 bg-white text-ink-primary placeholder:text-ink-tertiary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Experience Level</label>
                  <div className="flex gap-3">
                    {EXPERIENCE_LEVELS.map(lvl => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => set('experienceLevel', lvl)}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-xs font-medium border transition-colors",
                          form.experienceLevel === lvl
                            ? "bg-accent text-white border-accent"
                            : "bg-white text-ink-secondary border-border hover:border-accent/30"
                        )}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => set('isUrgent', !form.isUrgent)}
                    className={cn(
                      "relative w-10 h-5 rounded-full transition-colors",
                      form.isUrgent ? "bg-accent" : "bg-surface-muted"
                    )}
                  >
                    <span className={cn(
                      "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                      form.isUrgent ? "translate-x-5" : "translate-x-0.5"
                    )} />
                  </button>
                  <span className="text-sm text-ink-primary">Mark as urgent / urgent hire</span>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-3">Work Model</label>
                  <div className="grid grid-cols-3 gap-3">
                    {JOB_TYPES.map(({ value, label, desc, Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => set('type', value)}
                        className={cn(
                          "relative p-4 rounded-xl border-2 text-center transition-all",
                          form.type === value
                            ? "border-accent bg-accent-light"
                            : "border-border hover:border-accent/30 bg-white"
                        )}
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
                        key={value}
                        type="button"
                        onClick={() => set('budgetType', value)}
                        className={cn(
                          "relative p-4 rounded-xl border-2 text-left transition-all",
                          form.budgetType === value
                            ? "border-accent bg-accent-light"
                            : "border-border hover:border-accent/30 bg-white"
                        )}
                      >
                        {form.budgetType === value && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-accent-dark" />}
                        <p className="font-semibold text-ink-primary text-sm">{label}</p>
                        <p className="text-xs text-ink-tertiary mt-0.5">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Budget Range (KES) *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
                      <input
                        type="number"
                        value={form.budgetMin}
                        onChange={(e) => set('budgetMin', e.target.value)}
                        placeholder="Min (e.g. 10000)"
                        min={0}
                        className="w-full h-10 border border-border rounded-lg pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 bg-white text-ink-primary placeholder:text-ink-tertiary"
                      />
                    </div>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
                      <input
                        type="number"
                        value={form.budgetMax}
                        onChange={(e) => set('budgetMax', e.target.value)}
                        placeholder="Max (e.g. 50000)"
                        min={0}
                        className="w-full h-10 border border-border rounded-lg pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 bg-white text-ink-primary placeholder:text-ink-tertiary"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Deadline (optional)</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => set('deadline', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 bg-white text-ink-primary"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-5"
              >
                <h2 className="font-display text-lg font-bold text-brand-900">Review Your Job Listing</h2>
                <div className="bg-surface-soft rounded-xl p-5 space-y-4 border border-border">
                  <div>
                    <p className="text-xs text-ink-tertiary mb-1">Job Title</p>
                    <p className="font-medium text-ink-primary">{form.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-tertiary mb-1">Category</p>
                    <p className="text-sm text-ink-primary">{form.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-tertiary mb-1">Description</p>
                    <p className="text-sm text-ink-primary leading-relaxed">{form.description}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-ink-tertiary mb-1">Type</p>
                      <p className="text-sm text-ink-primary">{form.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-tertiary mb-1">Pricing</p>
                      <p className="text-sm text-ink-primary">{form.budgetType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-tertiary mb-1">Level</p>
                      <p className="text-sm text-ink-primary">{form.experienceLevel}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-ink-tertiary mb-1">Budget</p>
                    <p className="text-sm font-semibold text-accent">
                      KES {Number(form.budgetMin).toLocaleString()} – {Number(form.budgetMax).toLocaleString()}
                    </p>
                  </div>
                  {form.skills.length > 0 && (
                    <div>
                      <p className="text-xs text-ink-tertiary mb-2">Required Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {form.skills.map(s => (
                          <span key={s} className="px-2.5 py-1 bg-accent-light text-accent-dark rounded-full text-xs font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {form.isUrgent && (
                    <div className="flex items-center gap-2 text-warn text-xs font-medium">
                      <Clock className="w-3.5 h-3.5" /> Marked as URGENT
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 mt-4 border-t border-border">
            <motion.button
              whileTap={buttonTap}
              type="button"
              onClick={handleBack}
              className={cn(
                "inline-flex items-center gap-1.5 px-5 py-2.5 border border-border rounded-lg text-sm font-medium transition-colors",
                step === 1 ? "invisible" : "bg-white text-ink-primary hover:bg-surface-soft"
              )}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </motion.button>
            {step < 3 ? (
              <motion.button
                whileTap={buttonTap}
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileTap={buttonTap}
                type="button"
                onClick={handleSubmit}
                disabled={createJob.isPending}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createJob.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Posting...</>
                ) : (
                  <><CheckCircle className="w-4 h-4" /> Publish Job</>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
            style={{
              backgroundColor:
                toast.type === 'success'
                  ? 'rgb(220, 252, 231)'
                  : 'rgb(254, 226, 226)',
              color:
                toast.type === 'success'
                  ? 'rgb(21, 128, 61)'
                  : 'rgb(185, 28, 28)',
            }}
          >
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
