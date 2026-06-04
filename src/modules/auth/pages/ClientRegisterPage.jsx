import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ArrowLeft, Building2, Briefcase, Mail, Lock, Phone } from 'lucide-react';
import { validateEmail, validatePassword, validatePhone, validateRequired } from '../../../common/utils/validation';

const ClientRegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '',
    companyName: '', industry: '', teamSize: '', country: '',
    categories: [], budget: ''
  });
  const [formError, setFormError] = useState('');

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(formData.password);

  const steps = [
    { num: 1, title: 'Basic Info' },
    { num: 2, title: 'Company Details' },
    { num: 3, title: 'Verification' },
    { num: 4, title: 'Preferences' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark text-zinc-900 dark:text-zinc-50 p-6">
      
      <div className="w-full max-w-2xl">
        
        {/* Stepper Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-10" />
            {steps.map((s) => (
              <div key={s.num} className="flex flex-col items-center bg-surface dark:bg-surface-dark px-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300
                  ${step > s.num ? 'bg-green-500 text-white' : 
                    step === s.num ? 'bg-[#2bb75c] text-white ring-4 ring-brand-600/20' : 
                    'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'}`}>
                  {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span className={`text-xs mt-2 font-medium ${step >= s.num ? 'text-zinc-900 dark:text-zinc-200' : 'text-zinc-400'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl p-8 shadow-xl">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-2">Create your Client Account</h2>
                <p className="text-zinc-500 mb-6">Let's start with your personal details.</p>

                <div className="space-y-4 mb-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">First Name</label>
                      <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-2.5 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#2bb75c] outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Last Name</label>
                      <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-2.5 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#2bb75c] outline-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-zinc-400" />
                      <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#2bb75c] outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-zinc-400" />
                      <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#2bb75c] outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-zinc-400" />
                      <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#2bb75c] outline-none" />
                    </div>
                    {/* Password Strength */}
                    <div className="mt-2 flex gap-1 h-1.5">
                      {[1, 2, 3, 4].map(level => (
                        <div key={level} className={`flex-1 rounded-full ${formData.password.length === 0 ? 'bg-zinc-200 dark:bg-zinc-700' : level <= strength ? (strength <= 2 ? 'bg-amber-500' : strength === 3 ? 'bg-[#2bb75c]' : 'bg-green-500') : 'bg-zinc-200 dark:bg-zinc-700'}`} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button onClick={() => navigate('/auth/register')} className="text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition-colors">Cancel</button>
                  <button onClick={() => {
                    const emailErr = validateEmail(formData.email);
                    const phoneErr = validatePhone(formData.phone);
                    const passErr = validatePassword(formData.password);
                    const firstErr = validateRequired(formData.firstName, 'First name');
                    const lastErr = validateRequired(formData.lastName, 'Last name');
                    const err = firstErr || lastErr || emailErr || phoneErr || passErr;
                    if (err) {
                      setFormError(err);
                      return;
                    }
                    setFormError('');
                    setStep(2);
                  }} disabled={strength < 3 || !formData.email} className="flex items-center gap-2 py-2.5 px-6 bg-[#2bb75c] hover:bg-[#1d8d38] text-white rounded-xl font-semibold transition-all disabled:opacity-50">
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {formError ? <p className="mt-4 text-sm font-semibold text-red-600">{formError}</p> : null}
              </motion.div>
            )}

            {/* STEP 2: Company Details */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-2">Company Details</h2>
                <p className="text-zinc-500 mb-6">Tell us about your organization.</p>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 w-5 h-5 text-zinc-400" />
                      <input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#2bb75c] outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Industry</label>
                      <select value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full px-4 py-2.5 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#2bb75c] outline-none">
                        <option value="">Select Industry</option>
                        <option value="tech">Technology</option>
                        <option value="finance">Finance</option>
                        <option value="healthcare">Healthcare</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Team Size</label>
                      <select value={formData.teamSize} onChange={e => setFormData({...formData, teamSize: e.target.value})} className="w-full px-4 py-2.5 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#2bb75c] outline-none">
                        <option value="">Select Size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201+">201+ employees</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={() => setStep(3)} disabled={!formData.companyName} className="flex items-center gap-2 py-2.5 px-6 bg-[#2bb75c] hover:bg-[#1d8d38] text-white rounded-xl font-semibold transition-all disabled:opacity-50">
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 & 4 (Mocked for brevity) */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
                 <p className="text-zinc-500 mb-6">We've sent a code to {formData.email}</p>
                 <div className="flex gap-2 justify-center mb-8">
                   {[1,2,3,4,5,6].map(i => (
                     <input key={i} type="text" maxLength={1} className="w-12 h-14 text-center text-xl font-bold bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#2bb75c] outline-none" />
                   ))}
                 </div>
                 <div className="flex justify-between items-center">
                  <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm font-medium text-zinc-500">Back</button>
                  <button onClick={() => setStep(4)} className="flex items-center gap-2 py-2.5 px-6 bg-[#2bb75c] hover:bg-[#1d8d38] text-white rounded-xl font-semibold">Verify & Continue <ArrowRight className="w-4 h-4" /></button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <h2 className="text-2xl font-bold mb-2">Client Preferences</h2>
                 <p className="text-zinc-500 mb-6">What are you looking to hire for?</p>
                 
                 <div className="space-y-4 mb-8">
                   <div>
                     <label className="block text-sm font-medium mb-2">Hiring Categories</label>
                     <div className="flex flex-wrap gap-2">
                       {['Web Development', 'UI/UX Design', 'AI & Machine Learning', 'Mobile Apps', 'Marketing'].map(cat => (
                         <div key={cat} className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-full text-sm cursor-pointer hover:bg-[#2bb75c]/5 dark:hover:bg-[#2bb75c]/30 transition-colors">
                           {cat}
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>

                 <div className="flex justify-between items-center">
                  <button onClick={() => setStep(3)} className="flex items-center gap-1 text-sm font-medium text-zinc-500">Back</button>
                  <button onClick={() => navigate('/auth/welcome')} className="flex items-center gap-2 py-2.5 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold">Complete Setup <CheckCircle2 className="w-4 h-4" /></button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ClientRegisterPage;

