import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, ArrowRight, ArrowLeft, UploadCloud, 
  Sparkles, Users, FileText, Settings, Calendar, DollarSign,
  AlertCircle
} from 'lucide-react';

const PostJob = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', 
    skills: [], 
    budgetType: 'hourly', budgetMin: '', budgetMax: '', experienceLevel: 'Intermediate',
    duration: '',
    files: []
  });
  const [lastSaved, setLastSaved] = useState('Just now');

  // Auto-save mock
  useEffect(() => {
    const timer = setInterval(() => {
      if (formData.title || formData.description) {
        setLastSaved(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [formData]);

  const steps = [
    { num: 1, title: 'Job Details', icon: FileText },
    { num: 2, title: 'Skills Required', icon: Settings },
    { num: 3, title: 'Budget Setup', icon: DollarSign },
    { num: 4, title: 'Timeline', icon: Calendar },
    { num: 5, title: 'Attachments', icon: UploadCloud },
    { num: 6, title: 'Review', icon: CheckCircle2 }
  ];

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      e.preventDefault();
      if (!formData.skills.includes(e.target.value)) {
        setFormData({...formData, skills: [...formData.skills, e.target.value]});
      }
      e.target.value = '';
    }
  };

  const getEstimatedMatches = () => {
    if (!formData.category) return "0";
    if (formData.skills.length > 3) return "125+";
    return "850+";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Post a New Job</h1>
          <p className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            Find elite talent for your project. <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" /> Draft auto-saved at {lastSaved}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            Save & Exit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Form Area */}
        <div className="lg:col-span-3">
          
          {/* Stepper Progress */}
          <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm p-4 mb-6 overflow-x-auto">
            <div className="flex items-center min-w-max px-2">
              {steps.map((s, idx) => (
                <React.Fragment key={s.num}>
                  <div className="flex flex-col items-center gap-2 w-24">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      step > s.num ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 
                      step === s.num ? 'bg-[#4C1D95] text-white shadow-lg shadow-#4C1D95]/20 ring-4 ring-brand-600/20' : 
                      'bg-zinc-100 dark:bg-zinc-700 text-zinc-400'
                    }`}>
                      {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= s.num ? 'text-zinc-900 dark:text-zinc-200' : 'text-zinc-400'}`}>
                      {s.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-1 w-8 mx-2 rounded-full ${step > s.num ? 'bg-green-500' : 'bg-zinc-100 dark:bg-zinc-700'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm p-6 sm:p-8 min-h-[500px] flex flex-col">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Job Details */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Describe your project</h2>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Job Title</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-surface dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#4C1D95] outline-none transition-shadow" placeholder="e.g. Full Stack Developer for SaaS Platform" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Project Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-surface dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#4C1D95] outline-none">
                      <option value="">Select a category</option>
                      <option value="web">Web Development</option>
                      <option value="mobile">Mobile Development</option>
                      <option value="design">UI/UX Design</option>
                      <option value="ai">AI & Machine Learning</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Job Description</label>
                    {/* Mock Rich Text Editor border */}
                    <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-#4C1D95] transition-shadow">
                      <div className="bg-surface dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-700 px-3 py-2 flex gap-2">
                        {['B', 'I', 'U', 'Link', 'List'].map(tool => (
                          <button key={tool} className="px-2 py-1 text-xs font-semibold text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded">{tool}</button>
                        ))}
                      </div>
                      <textarea rows="6" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-white dark:bg-surface-dark outline-none resize-none" placeholder="Provide a detailed description of the scope, deliverables, and requirements..." />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Skills Required */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 space-y-6">
                  <h2 className="text-2xl font-bold mb-6">What skills are required?</h2>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Search Skills or Add Custom</label>
                    <input type="text" onKeyDown={handleSkillAdd} className="w-full px-4 py-3 bg-surface dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#4C1D95] outline-none" placeholder="Type a skill and press Enter" />
                  </div>

                  <div className="min-h-[120px] p-4 bg-surface dark:bg-surface-dark rounded-xl border border-zinc-200 dark:border-zinc-700 flex flex-wrap gap-2">
                    {formData.skills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-[#4C1D95]/10 dark:bg-[#4C1D95]/30 text-[#4C1D95] dark:text-[#4C1D95] rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm border border-[#4C1D95]/20 dark:border-[#4C1D95]/20/50">
                        {skill}
                        <button onClick={() => setFormData({...formData, skills: formData.skills.filter(s => s !== skill)})} className="hover:text-[#4C1D95] dark:hover:text-white transition-colors">&times;</button>
                      </span>
                    ))}
                    {formData.skills.length === 0 && <span className="text-zinc-400 text-sm my-auto">No skills added yet.</span>}
                  </div>

                  <div>
                     <p className="text-sm font-medium mb-3">AI Suggested Skills based on your title</p>
                     <div className="flex flex-wrap gap-2">
                       {['React', 'Node.js', 'PostgreSQL', 'AWS', 'TypeScript'].map(s => (
                         <button key={s} onClick={() => !formData.skills.includes(s) && setFormData({...formData, skills: [...formData.skills, s]})} className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-300 transition-colors">
                           + {s}
                         </button>
                       ))}
                     </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 & 4 Combined visually for brevity but separated logically */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Budget & Experience Setup</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button onClick={() => setFormData({...formData, budgetType: 'hourly'})} className={`p-4 border-2 rounded-xl text-left transition-all ${formData.budgetType === 'hourly' ? 'border-[#4C1D95]/20 bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10' : 'border-zinc-200 dark:border-zinc-700 hover:border-[#4C1D95]/50'}`}>
                      <h4 className="font-bold mb-1">Hourly Rate</h4>
                      <p className="text-xs text-zinc-500">Pay by the hour.</p>
                    </button>
                    <button onClick={() => setFormData({...formData, budgetType: 'fixed'})} className={`p-4 border-2 rounded-xl text-left transition-all ${formData.budgetType === 'fixed' ? 'border-[#4C1D95]/20 bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10' : 'border-zinc-200 dark:border-zinc-700 hover:border-[#4C1D95]/50'}`}>
                      <h4 className="font-bold mb-1">Fixed Price</h4>
                      <p className="text-xs text-zinc-500">Pay by project milestones.</p>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Minimum ($)</label>
                      <input type="number" value={formData.budgetMin} onChange={e => setFormData({...formData, budgetMin: e.target.value})} className="w-full px-4 py-3 bg-surface dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#4C1D95] outline-none" placeholder="10" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Maximum ($)</label>
                      <input type="number" value={formData.budgetMax} onChange={e => setFormData({...formData, budgetMax: e.target.value})} className="w-full px-4 py-3 bg-surface dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#4C1D95] outline-none" placeholder="50" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3 mt-6">Desired Experience Level</label>
                    <div className="flex gap-4">
                      {['Entry', 'Intermediate', 'Expert'].map(lvl => (
                        <label key={lvl} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="exp" checked={formData.experienceLevel === lvl} onChange={() => setFormData({...formData, experienceLevel: lvl})} className="w-4 h-4 text-[#4C1D95] focus:ring-[#4C1D95]" />
                          <span className="text-sm font-medium">{lvl}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Timeline & Duration</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Estimated Duration</label>
                    <select value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-4 py-3 bg-surface dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#4C1D95] outline-none">
                      <option value="">Select duration</option>
                      <option value="Less than 1 month">Less than 1 month</option>
                      <option value="1 to 3 months">1 to 3 months</option>
                      <option value="3 to 6 months">3 to 6 months</option>
                      <option value="More than 6 months">More than 6 months</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Upload Attachments</h2>
                  <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-surface dark:bg-surface-dark/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                     <UploadCloud className="w-12 h-12 text-zinc-400 mb-4" />
                     <h3 className="text-lg font-bold mb-1">Drag & Drop files here</h3>
                     <p className="text-sm text-zinc-500">or click to browse from your computer</p>
                     <p className="text-xs text-zinc-400 mt-4">Supports PDF, DOCX, PNG, JPG (Max 25MB)</p>
                  </div>
                </motion.div>
              )}

              {step === 6 && (
                <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Review Job Posting</h2>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-bold rounded-md">Draft</span>
                  </div>
                  
                  <div className="bg-surface dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold mb-2">{formData.title || "Untitled Job"}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400 mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-700">
                      <div className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {formData.budgetType === 'hourly' ? 'Hourly' : 'Fixed'} (${formData.budgetMin}-${formData.budgetMax})</div>
                      <div className="flex items-center gap-1"><Settings className="w-4 h-4" /> {formData.experienceLevel}</div>
                      <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formData.duration || "TBD"}</div>
                    </div>
                    
                    <h4 className="font-bold mb-2">Description</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 whitespace-pre-wrap">
                      {formData.description || "No description provided."}
                    </p>

                    <h4 className="font-bold mb-2">Skills Needed</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map(s => <span key={s} className="px-2.5 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-md text-xs font-semibold">{s}</span>)}
                      {formData.skills.length === 0 && <span className="text-sm text-zinc-500">None selected.</span>}
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-auto pt-8 flex justify-between items-center border-t border-zinc-200 dark:border-zinc-700">
              <button 
                onClick={() => setStep(step - 1)} 
                disabled={step === 1}
                className="flex items-center gap-2 py-2 px-4 font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              
              {step < 6 ? (
                <button 
                  onClick={() => setStep(step + 1)} 
                  className="flex items-center gap-2 py-2.5 px-6 bg-[#4C1D95] hover:bg-[#22C55E] text-white rounded-xl font-bold shadow-lg shadow-#4C1D95]/20 transition-all"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  className="flex items-center gap-2 py-2.5 px-8 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all"
                >
                  Publish Job <CheckCircle2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: AI Insights & Estimates */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#4C1D95] to-blue-700 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" /> Estimated Matches
            </h3>
            <div className="text-4xl font-extrabold mb-1">{getEstimatedMatches()}</div>
            <p className="text-sm text-[#4C1D95] font-medium">Freelancers actively looking for work in your category.</p>
          </div>

          <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> AI Optimization Tips
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-0.5"><AlertCircle className="w-4 h-4 text-amber-500" /></div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Title clarity</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">Add the primary technology to your title to increase click-through rates by 22%.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5"><CheckCircle2 className="w-4 h-4 text-green-500" /></div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Budget alignment</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">Your budget is aligned with the top 10% of freelancers in this category.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PostJob;


