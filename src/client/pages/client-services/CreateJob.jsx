import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText, DollarSign, CheckSquare, Send,
  ChevronRight, ChevronLeft, MapPin, CalendarDays, ShieldCheck,
  CheckCircle, Loader2, X, Plus
} from 'lucide-react';
import { useCreateJob } from '../../services/clientHooks';
import toast, { Toaster } from 'react-hot-toast';
import {
  validateBudgetRange,
  validateJobDescription,
  validateJobTitle,
  validateSelect,
} from '../../../platform/common/utils/validation';

const CATEGORIES = [
  'Software & Tech', 'Design & Creative', 'Writing & Content', 'Marketing & Sales',
  'Finance & Accounting', 'Engineering & Architecture', 'Data & Analytics',
  'Legal', 'Video & Animation', 'Music & Audio', 'Business', 'Other'
];
const SERVICE_MODES = ['Fully online', 'On-site', 'Hybrid'];
const CURRENCIES = ['KES', 'USD', 'EUR', 'GBP'];
const EXPERIENCE_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];

const STEPS = [
  { label: 'Project Details', icon: FileText },
  { label: 'Scope & Budget', icon: DollarSign },
  { label: 'Requirements', icon: CheckSquare },
  { label: 'Review & Publish', icon: Send },
];

const INITIAL = {
  title: '', category: '', description: '',
  serviceMode: 'Fully online', type: 'REMOTE',
  budgetMin: '', budgetMax: '', currency: 'KES', deadline: '',
  skills: [], experienceLevel: 'INTERMEDIATE',
  isUrgent: false,
};

export default function CreateJob() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL);
  const [skillInput, setSkillInput] = useState('');
  const [posted, setPosted] = useState(null);

  const createJob = useCreateJob();

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const addSkill = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const s = skillInput.trim().replace(/,$/, '');
      if (s && !form.skills.includes(s)) set('skills', [...form.skills, s]);
      setSkillInput('');
    }
  };
  const removeSkill = (s) => set('skills', form.skills.filter(x => x !== s));

  const isStep1Valid = () => {
    return !validateJobTitle(form.title)
      && !validateSelect(form.category, 'a category')
      && !validateJobDescription(form.description, 30);
  };
  const isStep2Valid = () => !validateBudgetRange(form.budgetMin, form.budgetMax);
  const isStep3Valid = true;

  const canNext = () => {
    if (step === 1 && !isStep1Valid()) {
      toast.error(validateJobTitle(form.title) || validateSelect(form.category, 'a category') || validateJobDescription(form.description, 30));
      return false;
    }
    if (step === 2 && !isStep2Valid()) {
      toast.error(validateBudgetRange(form.budgetMin, form.budgetMax) || 'Enter a valid budget range');
      return false;
    }
    return true;
  };

  const nextStep = () => { if (canNext()) setStep(s => Math.min(s + 1, 4)); };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    try {
      const payload = {
        title: form.title,
        description: form.description,
        type: form.serviceMode === 'Fully online' ? 'REMOTE' : form.serviceMode === 'On-site' ? 'ONSITE' : 'HYBRID',
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
        requiredSkills: form.skills,
        experienceLevel: form.experienceLevel === 'BEGINNER' ? 'ENTRY' : form.experienceLevel,
        duration: form.deadline ? 'LONG_TERM' : 'SHORT_TERM',
      };
      const result = await createJob.mutateAsync(payload);
      setPosted(result);
    } catch (_) {}
  };

  // ─── Success Screen ───────────────────────────────────────────────────────
  if (posted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Job Published!</h2>
            <p className="text-zinc-400 text-sm">"{posted.title}" is now live and receiving proposals.</p>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate(`/client/jobs/${posted.id}`)} className="w-full px-5 py-3 bg-success hover:bg-success text-white rounded-2xl font-bold transition-all">View Job</button>
            <button onClick={() => navigate('/client/jobs')} className="w-full px-5 py-3 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-2xl font-bold hover:bg-zinc-700 transition-colors">All My Jobs</button>
            <button onClick={() => { setForm(INITIAL); setStep(1); setPosted(null); }} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Post Another Job</button>
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
          <Link to="/client/jobs" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Jobs
          </Link>
          <h1 className="text-2xl font-bold text-white">Create a New Project</h1>
          <p className="text-sm text-zinc-400 mt-1">Fill in the details to attract skilled talent.</p>
        </div>

        {/* Step Indicators */}
        <div className="flex gap-2">
          {STEPS.map((s, i) => (
            <div key={i} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all duration-500 ${step > i + 1 ? 'bg-success' : step === i + 1 ? 'bg-success' : 'bg-zinc-800'}`} />
              <p className={`text-[10px] mt-1 font-bold transition-colors ${step === i + 1 ? 'text-success' : 'text-zinc-600'}`}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-5">

          {/* ── Step 1: Project Details ── */}
          {step === 1 && (
            <>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Project Title *</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Build a React Native Mobile App"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Category *</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-success">
                  <option value="">Select category...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Description * <span className="text-zinc-600">(min 30 chars)</span></label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={5}
                  placeholder="Describe your project, required deliverables, and technical requirements..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success resize-none" />
                <p className="text-[10px] text-zinc-600 mt-1">{form.description.length} chars</p>
              </div>
            </>
          )}

          {/* ── Step 2: Scope & Budget ── */}
          {step === 2 && (
            <>
              <div>
                <label className="text-xs text-zinc-400 mb-2 block">Service Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {SERVICE_MODES.map(m => (
                    <button key={m} type="button" onClick={() => set('serviceMode', m)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${form.serviceMode === m ? 'bg-success/20 text-success border-success/40' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Currency</label>
                <select value={form.currency} onChange={e => set('currency', e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-success">
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Budget Range ({form.currency}) *</label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" value={form.budgetMin} onChange={e => set('budgetMin', e.target.value)} placeholder="Min budget" min={0}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-success" />
                  <input type="number" value={form.budgetMax} onChange={e => set('budgetMax', e.target.value)} placeholder="Max budget" min={0}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-success" />
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Deadline (optional)</label>
                <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-success" />
              </div>
            </>
          )}

          {/* ── Step 3: Requirements ── */}
          {step === 3 && (
            <>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Required Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.skills.map(s => (
                    <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-success/10 text-success border border-success/20">
                      {s} <button type="button" onClick={() => removeSkill(s)} className="opacity-60 hover:opacity-100"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={addSkill}
                  placeholder="Type a skill and press Enter..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-2 block">Experience Level</label>
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
                <span className="text-sm text-zinc-300">Mark as urgent</span>
              </div>
            </>
          )}

          {/* ── Step 4: Review ── */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-bold text-white text-lg">Review Your Job Listing</h2>
              <div className="bg-zinc-800/60 rounded-2xl p-5 space-y-4">
                <div><p className="text-xs text-zinc-500 mb-1">Title</p><p className="font-bold text-white">{form.title}</p></div>
                <div><p className="text-xs text-zinc-500 mb-1">Category</p><p className="text-sm text-zinc-300">{form.category}</p></div>
                <div><p className="text-xs text-zinc-500 mb-1">Description</p><p className="text-sm text-zinc-300 leading-relaxed">{form.description}</p></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-zinc-500 mb-1">Service Mode</p><p className="text-sm text-zinc-300">{form.serviceMode}</p></div>
                  <div><p className="text-xs text-zinc-500 mb-1">Experience</p><p className="text-sm text-zinc-300">{form.experienceLevel}</p></div>
                </div>
                <div><p className="text-xs text-zinc-500 mb-1">Budget</p><p className="text-sm font-bold text-success">{form.currency} {Number(form.budgetMin).toLocaleString()} – {Number(form.budgetMax).toLocaleString()}</p></div>
                {form.deadline && <div><p className="text-xs text-zinc-500 mb-1">Deadline</p><p className="text-sm text-zinc-300">{new Date(form.deadline).toLocaleDateString()}</p></div>}
                {form.skills.length > 0 && (
                  <div>
                    <p className="text-xs text-zinc-500 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {form.skills.map(s => <span key={s} className="px-2 py-0.5 bg-success/10 text-success rounded-full text-xs font-bold">{s}</span>)}
                    </div>
                  </div>
                )}
                {form.isUrgent && <p className="text-xs text-orange-400 font-bold">⚡ Marked as URGENT</p>}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-2 border-t border-zinc-800">
            <button type="button" onClick={prevStep} className={`flex items-center gap-1.5 px-5 py-2.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-colors ${step === 1 ? 'invisible' : ''}`}>
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {step < 4 ? (
              <button type="button" onClick={nextStep} className="flex items-center gap-1.5 px-5 py-2.5 bg-success hover:bg-success text-white rounded-xl text-sm font-bold transition-all">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={createJob.isPending} className="flex items-center gap-1.5 px-6 py-2.5 bg-success/90 hover:bg-success text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                {createJob.isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Publishing...</> : <><Send className="w-4 h-4" />Publish Job</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
