import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase, MapPin, Clock, CheckCircle, ChevronRight,
  X, DollarSign, ArrowLeft, Loader2
} from 'lucide-react';
import { useCreateJob } from '../services/clientHooks';
import toast, { Toaster } from 'react-hot-toast';
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

export default function PostJobPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [skillInput, setSkillInput] = useState('');
  const [posted, setPosted] = useState(null);

  const createJob = useCreateJob();

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
      if (titleErr) { toast.error(titleErr); return false; }
      const descErr = validateJobDescription(form.description, 50);
      if (descErr) { toast.error(descErr); return false; }
      const categoryErr = validateSelect(form.category, 'a category');
      if (categoryErr) { toast.error(categoryErr); return false; }
    }
    if (step === 2) {
      const budgetErr = validateBudgetRange(form.budgetMin, form.budgetMax);
      if (budgetErr) { toast.error(budgetErr); return false; }
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
    } catch (_) {}
  };

  // ─── Success Screen ──────────────────────────────────────────────────────────
  if (posted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
        <Toaster position="top-right" />
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto border border-success/20">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Job Posted Successfully!</h2>
            <p className="text-zinc-400">Your job "<span className="text-white font-semibold">{posted.title}</span>" is now live. Freelancers can see and apply to it.</p>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate(`/client/jobs/${posted.id}`)} className="w-full px-5 py-3 bg-success hover:bg-success text-white rounded-2xl font-bold transition-all">
              View Job Listing
            </button>
            <button onClick={() => navigate('/client/jobs')} className="w-full px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-2xl font-bold transition-colors">
              View All My Jobs
            </button>
            <button onClick={() => { setForm(DEFAULT_FORM); setStep(1); setPosted(null); }} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              Post Another Job
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 overflow-y-auto custom-scrollbar">
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <Link to="/client/jobs" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>
          <h1 className="text-2xl font-bold text-white">Post a New Job</h1>
          <p className="text-sm text-zinc-400 mt-1">Fill in the details to attract top-rated talent.</p>
        </div>

        {/* Step Progress */}
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full transition-all duration-500" style={{ width: step >= s ? '100%' : '0%' }} />
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-500">Step {step} of 3</p>

        {/* Form Card */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-6">

          {/* ─── Step 1: Job Details ─── */}
          {step === 1 && (
            <>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Job Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="e.g. Senior React Developer for Enterprise Dashboard"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Category *</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-success">
                  <option value="">Select a category...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Detailed Description * <span className="text-zinc-600">(min. 50 chars)</span></label>
                <textarea
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Describe your project, deliverables, and specific technical requirements..."
                  rows={6}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success resize-none"
                />
                <p className="text-xs text-zinc-600 mt-1">{form.description.length} / 5000 chars</p>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Required Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.skills.map(s => (
                    <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-success/10 text-success border border-success/20">
                      {s}
                      <button onClick={() => removeSkill(s)} type="button" className="opacity-60 hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={addSkill}
                  placeholder="Type a skill and press Enter..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Experience Level</label>
                <div className="flex gap-3">
                  {EXPERIENCE_LEVELS.map(lvl => (
                    <button key={lvl} type="button" onClick={() => set('experienceLevel', lvl)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors ${form.experienceLevel === lvl ? 'bg-success text-white border-success' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500'}`}>
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button type="button" onClick={() => set('isUrgent', !form.isUrgent)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form.isUrgent ? 'bg-success' : 'bg-zinc-700'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isUrgent ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm text-zinc-300">Mark as urgent / urgent hire</span>
              </div>
            </>
          )}

          {/* ─── Step 2: Budget & Timeline ─── */}
          {step === 2 && (
            <>
              <div>
                <label className="text-xs text-zinc-400 mb-3 block">Work Model</label>
                <div className="grid grid-cols-3 gap-3">
                  {JOB_TYPES.map(({ value, label, desc, Icon }) => (
                    <button key={value} type="button" onClick={() => set('type', value)}
                      className={`relative p-4 rounded-2xl border-2 text-center transition-all ${form.type === value ? 'border-success bg-success/10' : 'border-zinc-700 hover:border-zinc-600'}`}>
                      {form.type === value && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-success" />}
                      <Icon className={`w-6 h-6 mx-auto mb-1 ${form.type === value ? 'text-success' : 'text-zinc-400'}`} />
                      <p className="font-bold text-white text-xs">{label}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-3 block">Pricing Model</label>
                <div className="grid grid-cols-2 gap-3">
                  {SCOPE_TYPES.map(({ value, label, desc }) => (
                    <button key={value} type="button" onClick={() => set('budgetType', value)}
                      className={`relative p-4 rounded-2xl border-2 text-left transition-all ${form.budgetType === value ? 'border-success bg-success/10' : 'border-zinc-700 hover:border-zinc-600'}`}>
                      {form.budgetType === value && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-success" />}
                      <p className="font-bold text-white text-sm">{label}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Budget Range (KES) *</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input type="number" value={form.budgetMin} onChange={(e) => set('budgetMin', e.target.value)} placeholder="Min (e.g. 10000)" min={0} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-success" />
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input type="number" value={form.budgetMax} onChange={(e) => set('budgetMax', e.target.value)} placeholder="Max (e.g. 50000)" min={0} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-success" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Deadline (optional)</label>
                <input type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-success" />
              </div>
            </>
          )}

          {/* ─── Step 3: Review ─── */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-bold text-white text-lg">Review Your Job Listing</h2>
              <div className="bg-zinc-800/60 rounded-2xl p-5 space-y-4">
                <div><p className="text-xs text-zinc-500 mb-1">Job Title</p><p className="font-bold text-white">{form.title}</p></div>
                <div><p className="text-xs text-zinc-500 mb-1">Category</p><p className="text-sm text-zinc-300">{form.category}</p></div>
                <div><p className="text-xs text-zinc-500 mb-1">Description</p><p className="text-sm text-zinc-300 leading-relaxed">{form.description}</p></div>
                <div className="grid grid-cols-3 gap-4">
                  <div><p className="text-xs text-zinc-500 mb-1">Type</p><p className="text-sm text-zinc-300">{form.type}</p></div>
                  <div><p className="text-xs text-zinc-500 mb-1">Pricing</p><p className="text-sm text-zinc-300">{form.budgetType}</p></div>
                  <div><p className="text-xs text-zinc-500 mb-1">Level</p><p className="text-sm text-zinc-300">{form.experienceLevel}</p></div>
                </div>
                <div><p className="text-xs text-zinc-500 mb-1">Budget</p><p className="text-sm font-bold text-success">KES {Number(form.budgetMin).toLocaleString()} – {Number(form.budgetMax).toLocaleString()}</p></div>
                {form.skills.length > 0 && (
                  <div>
                    <p className="text-xs text-zinc-500 mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {form.skills.map(s => <span key={s} className="px-2.5 py-1 bg-success/10 text-success rounded-xl text-xs font-bold">{s}</span>)}
                    </div>
                  </div>
                )}
                {form.isUrgent && <div className="flex items-center gap-2 text-orange-400 text-xs font-bold"><Clock className="w-3.5 h-3.5" /> Marked as URGENT</div>}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-2 border-t border-zinc-800">
            <button type="button" onClick={handleBack} className={`flex items-center gap-1.5 px-5 py-2.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-colors ${step === 1 ? 'invisible' : ''}`}>
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            {step < 3 ? (
              <button type="button" onClick={handleNext} className="flex items-center gap-1.5 px-5 py-2.5 bg-success hover:bg-success text-white rounded-xl text-sm font-bold transition-all">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={createJob.isPending} className="flex items-center gap-1.5 px-6 py-2.5 bg-success/90 hover:bg-success text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                {createJob.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting...</> : <><CheckCircle className="w-4 h-4" /> Publish Job</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
