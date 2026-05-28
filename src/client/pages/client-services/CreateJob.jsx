import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, DollarSign, CheckSquare, Send, 
  ChevronRight, ChevronLeft, MapPin, CalendarDays, ShieldCheck 
} from "lucide-react";

const initialState = {
  title: "",
  category: "",
  subcategory: "",
  description: "",
  serviceMode: "Fully online",
  location: "Remote",
  budgetMin: "",
  budgetMax: "",
  currency: "USD",
  deadline: "",
  tags: "",
  isUrgent: false,
};

export default function CreateJob() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const isStep1Valid = form.title.trim() && form.category.trim() && form.description.trim();
  const isStep2Valid = Number(form.budgetMin) > 0 && Number(form.budgetMax) >= Number(form.budgetMin);
  const isStep3Valid = form.tags.trim().length > 0;

  const nextStep = () => {
    if (step === 1 && !isStep1Valid) return;
    if (step === 2 && !isStep2Valid) return;
    if (step === 3 && !isStep3Valid) return;
    setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    try {
      // Simulate API Call for now since we are unmocking later
      setTimeout(() => {
        navigate("/client/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to create project");
      setSaving(false);
    }
  };

  const steps = [
    { num: 1, title: "Project Details", icon: <FileText className="w-5 h-5" /> },
    { num: 2, title: "Scope & Budget", icon: <DollarSign className="w-5 h-5" /> },
    { num: 3, title: "Requirements", icon: <CheckSquare className="w-5 h-5" /> },
    { num: 4, title: "Review & Publish", icon: <Send className="w-5 h-5" /> }
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 font-sans text-zinc-200">
      
      {/* Header & Progress Indicator */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Post a New Project</h1>
        <p className="text-zinc-400 text-sm">Find the perfect talent by providing clear requirements.</p>
        
        <div className="flex items-center justify-center mt-8 gap-4 relative max-w-2xl mx-auto">
          {/* Progress Bar Background */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-800 -translate-y-1/2 rounded-full z-0"></div>
          {/* Active Progress Bar */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-vivid-lavender -translate-y-1/2 rounded-full z-0 transition-all duration-500"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>

          {steps.map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-zinc-950 transition-colors duration-300 ${step >= s.num ? 'bg-vivid-lavender text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                {s.icon}
              </div>
              <span className={`absolute -bottom-6 text-xs font-bold whitespace-nowrap transition-colors duration-300 ${step >= s.num ? 'text-vivid-lavender' : 'text-zinc-500'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 text-center">{error}</div>}

      {/* Main Form Container */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 md:p-10 shadow-2xl mt-12 relative overflow-hidden">
        
        {/* Step 1: Details */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-4">1. Project Details</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Project Title</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Build a React Dashboard" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-vivid-lavender outline-none transition-colors" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-vivid-lavender outline-none transition-colors">
                  <option value="">Select Category...</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Design">UI/UX Design</option>
                  <option value="Writing">Writing & Translation</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Subcategory</label>
                <input name="subcategory" value={form.subcategory} onChange={handleChange} placeholder="e.g. Frontend Engineering" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-vivid-lavender outline-none transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Project Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows="5" placeholder="Describe your project, deliverables, and expectations in detail..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-vivid-lavender outline-none transition-colors custom-scrollbar" />
            </div>
          </div>
        )}

        {/* Step 2: Scope & Budget */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-4">2. Scope & Budget</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Service Mode</label>
                <select name="serviceMode" value={form.serviceMode} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-vivid-lavender outline-none transition-colors">
                  <option>Fully online</option>
                  <option>Physical on-site</option>
                  <option>Hybrid (online + on-site)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Location (if applicable)</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Remote or Nairobi" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-vivid-lavender outline-none transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Currency</label>
                <select name="currency" value={form.currency} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-vivid-lavender outline-none transition-colors">
                  <option>USD</option>
                  <option>KES</option>
                  <option>EUR</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Min Budget</label>
                <input type="number" name="budgetMin" value={form.budgetMin} onChange={handleChange} placeholder="e.g. 500" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-vivid-lavender outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Max Budget</label>
                <input type="number" name="budgetMax" value={form.budgetMax} onChange={handleChange} placeholder="e.g. 1500" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-vivid-lavender outline-none transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Deadline / Expected Completion</label>
              <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-vivid-lavender outline-none transition-colors" />
            </div>
          </div>
        )}

        {/* Step 3: Requirements */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-4">3. Skills & Requirements</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Required Skills (Comma separated)</label>
              <input name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. React, Node.js, UI Design" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-vivid-lavender outline-none transition-colors" />
              <p className="text-xs text-zinc-500 mt-1">This helps our AI match the best freelancers to your project.</p>
            </div>

            <label className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 rounded-xl p-4 cursor-pointer hover:border-vivid-lavender transition-colors mt-6">
              <div className="flex items-center justify-center">
                <input type="checkbox" name="isUrgent" checked={form.isUrgent} onChange={handleChange} className="w-5 h-5 accent-vivid-lavender rounded" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Mark as Urgent Priority</p>
                <p className="text-xs text-zinc-500">Urgent projects are highlighted to freelancers and typically receive proposals 3x faster.</p>
              </div>
            </label>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-4">4. Review & Publish</h2>
            
            <div className="bg-zinc-950 rounded-2xl p-6 border border-zinc-800 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">{form.title || "Untitled Project"}</h3>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-zinc-800 text-xs rounded text-zinc-300">{form.category}</span>
                  <span className="px-2 py-1 bg-zinc-800 text-xs rounded text-zinc-300">{form.subcategory}</span>
                  {form.isUrgent && <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded font-bold border border-red-500/20">URGENT</span>}
                </div>
              </div>
              
              <div className="pt-4 border-t border-zinc-800">
                <p className="text-sm text-zinc-400 whitespace-pre-wrap">{form.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-zinc-800">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Budget Range</p>
                  <p className="text-sm font-bold text-white">{form.currency} {form.budgetMin} - {form.budgetMax}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Location / Mode</p>
                  <p className="text-sm font-bold text-white">{form.serviceMode} ({form.location})</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Deadline</p>
                  <p className="text-sm font-bold text-white">{form.deadline || "Flexible"}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Skills</p>
                  <p className="text-sm font-bold text-white truncate">{form.tags}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-800">
          <button 
            onClick={prevStep} 
            disabled={step === 1 || saving}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {step < 4 ? (
            <button 
              onClick={nextStep}
              className="flex items-center gap-2 bg-vivid-lavender hover:bg-dark-purple text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-vivid-lavender/20"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 bg-vivid-lavender hover:bg-dark-purple text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-vivid-lavender/20 disabled:opacity-50"
            >
              {saving ? "Publishing..." : "Publish Project"} <Send className="w-4 h-4" />
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
}
