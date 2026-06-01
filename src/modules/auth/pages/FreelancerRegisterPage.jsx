import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ArrowLeft, UploadCloud, User, Star } from 'lucide-react';
import { validateMinLength, validateRequired } from '../../../common/utils/validation';

const FreelancerRegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '', bio: '', skills: [], hourlyRate: '', experienceLevel: 'Intermediate'
  });
  const [formError, setFormError] = useState('');

  const steps = [
    { num: 1, title: 'Identity' },
    { num: 2, title: 'Skills' },
    { num: 3, title: 'Experience' },
    { num: 4, title: 'Portfolio' },
    { num: 5, title: 'Availability' },
    { num: 6, title: 'Verification' }
  ];

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      if (!formData.skills.includes(e.target.value)) {
        setFormData({...formData, skills: [...formData.skills, e.target.value]});
      }
      e.target.value = '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark text-zinc-900 dark:text-zinc-50 p-6">
      
      <div className="w-full max-w-3xl">
        
        {/* Stepper Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-10" />
            {steps.map((s) => (
               // Hidden on mobile, show only current on mobile, show all on desktop
              <div key={s.num} className={`flex-col items-center bg-surface dark:bg-surface-dark px-2 sm:px-4 ${Math.abs(step - s.num) > 1 ? 'hidden sm:flex' : 'flex'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300
                  ${step > s.num ? 'bg-teal-500 text-white' : 
                    step === s.num ? 'bg-teal-600 text-white ring-4 ring-teal-600/20' : 
                    'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'}`}>
                  {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span className={`text-[10px] sm:text-xs mt-2 font-medium ${step >= s.num ? 'text-zinc-900 dark:text-zinc-200' : 'text-zinc-400'} hidden sm:block whitespace-nowrap`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl p-8 shadow-xl">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Identity */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-2">Build your Profile</h2>
                <p className="text-zinc-500 mb-6">Let's start with your professional identity.</p>

                <div className="space-y-5 mb-8">
                  <div className="flex justify-center mb-6">
                     <div className="relative">
                       <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-700 border-2 border-dashed border-zinc-300 dark:border-zinc-600 flex flex-col items-center justify-center text-zinc-400 cursor-pointer hover:border-teal-500 transition-colors">
                          <UploadCloud className="w-6 h-6 mb-1" />
                          <span className="text-xs font-medium">Upload</span>
                       </div>
                     </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Professional Title</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="e.g. Senior Full Stack Engineer" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Professional Overview</label>
                    <textarea rows="4" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-2.5 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Briefly describe your expertise..." />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button onClick={() => navigate('/auth/register')} className="text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition-colors">Cancel</button>
                  <button onClick={() => {
                    const titleErr = validateRequired(formData.title, 'Professional title');
                    const bioErr = validateMinLength(formData.bio, 20, 'Professional overview');
                    const err = titleErr || bioErr;
                    if (err) {
                      setFormError(err);
                      return;
                    }
                    setFormError('');
                    setStep(2);
                  }} disabled={!formData.title} className="flex items-center gap-2 py-2.5 px-6 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50">
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {formError ? <p className="mt-4 text-sm font-semibold text-red-600">{formError}</p> : null}
              </motion.div>
            )}

            {/* STEP 2: Skills */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-2">What are your skills?</h2>
                <p className="text-zinc-500 mb-6">Add skills to help our AI match you with the best projects.</p>

                <div className="space-y-4 mb-8">
                  <div>
                    <input type="text" onKeyDown={handleSkillAdd} className="w-full px-4 py-3 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Type a skill and press Enter" />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-surface dark:bg-surface-dark/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    {formData.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium flex items-center gap-1">
                        {skill}
                        <button onClick={() => setFormData({...formData, skills: formData.skills.filter(s => s !== skill)})} className="hover:text-teal-900 dark:hover:text-white">&times;</button>
                      </span>
                    ))}
                    {formData.skills.length === 0 && <span className="text-zinc-400 text-sm">No skills added yet.</span>}
                  </div>

                  <div>
                     <p className="text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Suggested Skills:</p>
                     <div className="flex flex-wrap gap-2">
                       {['React', 'Node.js', 'Figma', 'Python', 'AWS'].map(s => (
                         <button key={s} onClick={() => !formData.skills.includes(s) && setFormData({...formData, skills: [...formData.skills, s]})} className="px-3 py-1 border border-zinc-200 dark:border-zinc-700 rounded-full text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                           + {s}
                         </button>
                       ))}
                     </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={() => setStep(3)} disabled={formData.skills.length === 0} className="flex items-center gap-2 py-2.5 px-6 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50">
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Jump to step 5 for demo purposes to avoid huge file */}
            {step === 3 && (
               <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <h2 className="text-2xl font-bold mb-2">Set your Availability</h2>
                 <p className="text-zinc-500 mb-6">Clients want to know your rate and hours.</p>

                 <div className="space-y-6 mb-8">
                   <div>
                     <label className="block text-sm font-medium mb-2">Hourly Rate ($)</label>
                     <div className="relative max-w-xs">
                       <span className="absolute left-4 top-2.5 text-zinc-500 font-bold">$</span>
                       <input type="number" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: e.target.value})} className="w-full pl-8 pr-4 py-2.5 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-lg font-semibold" placeholder="0.00" />
                     </div>
                     <p className="text-xs text-zinc-500 mt-2">Includes Forte's 5% service fee.</p>
                   </div>
                 </div>

                 <div className="flex justify-between items-center">
                  <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm font-medium text-zinc-500">Back</button>
                  <button onClick={() => setStep(6)} className="flex items-center gap-2 py-2.5 px-6 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold">Skip to Verification <ArrowRight className="w-4 h-4" /></button>
                </div>
               </motion.div>
            )}

            {step === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <div className="text-center">
                   <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Star className="w-10 h-10 text-green-500" />
                   </div>
                   <h2 className="text-2xl font-bold mb-2">Profile Ready for Verification</h2>
                   <p className="text-zinc-500 mb-8 max-w-md mx-auto">
                     Your profile looks great. The final step is to verify your identity to get your Trust Score started.
                   </p>
                 </div>

                 <div className="flex justify-between items-center">
                  <button onClick={() => setStep(3)} className="flex items-center gap-1 text-sm font-medium text-zinc-500">Back</button>
                  <button onClick={() => navigate('/auth/welcome')} className="flex items-center gap-2 py-3 px-8 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-500/20">Verify & Go to Dashboard <CheckCircle2 className="w-5 h-5" /></button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FreelancerRegisterPage;
