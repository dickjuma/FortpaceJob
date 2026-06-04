import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Edit3, DollarSign, Clock, Users,
  Sparkles, CheckCircle2, ChevronRight, HelpCircle,
  BarChart3, Globe, Lock
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const STEPS = [
  { id: 1, name: 'Title', icon: Edit3 },
  { id: 2, name: 'Description', icon: Briefcase },
  { id: 3, name: 'Skills', icon: CheckCircle2 },
  { id: 4, name: 'Scope', icon: Clock },
  { id: 5, name: 'Budget', icon: DollarSign },
];

export default function ClientJobPostingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [jobType, setJobType] = useState('hourly'); // hourly, fixed
  const [visibility, setVisibility] = useState('public');

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-8 pb-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Post a Job</h1>
          <button className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Save as Draft</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-zinc-500">Step {currentStep} of {STEPS.length}: {STEPS.find(s=>s.id === currentStep)?.name}</span>
            <span className="text-sm font-bold text-[#2bb75c] dark:text-[#2bb75c]">{Math.round((currentStep / STEPS.length) * 100)}% Completed</span>
          </div>
          <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#2bb75c] transition-all duration-300" style={{ width: `${(currentStep / STEPS.length) * 100}%` }}></div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
          <AnimatePresence mode="wait">
            
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Let's start with a strong title.</h2>
                <p className="text-zinc-500 font-medium mb-8">This helps your job post stand out to the right candidates. It’s the first thing they’ll see, so make it count!</p>
                
                <div className="mb-8">
                  <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Write a title for your job post</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Need a React Native developer to build a Fintech App"
                    className="w-full px-4 py-4 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-lg font-medium outline-none focus:border-[#2bb75c]/20 transition-colors"
                  />
                </div>

                <div className="bg-[#2bb75c]/5 dark:bg-[#2bb75c]/10 border border-[#2bb75c]/20 dark:border-[#2bb75c]/20/30 rounded-2xl p-6">
                  <h3 className="font-bold text-[#2bb75c] dark:text-[#2bb75c] flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-[#2bb75c]" /> AI Suggestions
                  </h3>
                  <p className="text-sm font-medium text-[#2bb75c] dark:text-[#2bb75c] mb-4">Start typing to see optimized title variations based on successful marketplace posts.</p>
                  <div className="flex flex-wrap gap-2">
                    {['Senior React Native Developer for Fintech', 'React Native / iOS / Android App Dev', 'Fintech Mobile App using React Native'].map(s => (
                      <button key={s} className="px-3 py-1.5 bg-white dark:bg-surface-dark border border-[#2bb75c]/20 dark:border-[#2bb75c]/20 text-[#2bb75c] dark:text-[#2bb75c] text-sm font-medium rounded-lg hover:bg-[#2bb75c]/10 dark:hover:bg-zinc-800 transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Tell us about your budget.</h2>
                <p className="text-zinc-500 font-medium mb-8">This will help us match you with talent within your range.</p>

                <div className="flex gap-4 mb-8">
                  <label className={cn(
                    "flex-1 border-2 rounded-2xl p-6 cursor-pointer hover:border-[#2bb75c]/50 transition-colors group",
                    jobType === 'hourly' ? "border-[#2bb75c]/20 bg-[#2bb75c]/5 dark:bg-[#2bb75c]/10" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface-dark"
                  )}>
                    <input type="radio" name="jobType" value="hourly" checked={jobType === 'hourly'} onChange={() => setJobType('hourly')} className="sr-only" />
                    <Clock className={cn("w-8 h-8 mb-4", jobType === 'hourly' ? "text-[#2bb75c] dark:text-[#2bb75c]" : "text-zinc-400 group-hover:text-zinc-600")} />
                    <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Hourly Rate</h3>
                    <p className="text-sm font-medium text-zinc-500">Pay by the hour for ongoing work.</p>
                  </label>
                  
                  <label className={cn(
                    "flex-1 border-2 rounded-2xl p-6 cursor-pointer hover:border-[#2bb75c]/50 transition-colors group",
                    jobType === 'fixed' ? "border-[#2bb75c]/20 bg-[#2bb75c]/5 dark:bg-[#2bb75c]/10" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface-dark"
                  )}>
                    <input type="radio" name="jobType" value="fixed" checked={jobType === 'fixed'} onChange={() => setJobType('fixed')} className="sr-only" />
                    <DollarSign className={cn("w-8 h-8 mb-4", jobType === 'fixed' ? "text-[#2bb75c] dark:text-[#2bb75c]" : "text-zinc-400 group-hover:text-zinc-600")} />
                    <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Fixed Price</h3>
                    <p className="text-sm font-medium text-zinc-500">Pay a single flat fee for the project.</p>
                  </label>
                </div>

                {jobType === 'hourly' && (
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">From</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400" />
                        <input type="number" placeholder="25.00" className="w-full pl-10 pr-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium outline-none focus:border-[#2bb75c]/20" />
                        <span className="absolute right-4 top-1/2 -tranzinc-y-1/2 text-sm font-bold text-zinc-400">/hr</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">To</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400" />
                        <input type="number" placeholder="60.00" className="w-full pl-10 pr-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium outline-none focus:border-[#2bb75c]/20" />
                        <span className="absolute right-4 top-1/2 -tranzinc-y-1/2 text-sm font-bold text-zinc-400">/hr</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Insights Widget */}
                <div className="bg-surface dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 flex gap-4 items-start">
                  <BarChart3 className="w-6 h-6 text-[#2bb75c] shrink-0" />
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-1">Freelancer Demand Insights</h4>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">The average hourly rate for React Native developers with your required skills is <strong className="text-zinc-900 dark:text-white">$45 - $80/hr</strong>. Setting your budget too low may reduce the number of qualified proposals.</p>
                  </div>
                </div>

              </motion.div>
            )}

            {/* Dummy placeholder for other steps */}
            {currentStep !== 1 && currentStep !== 5 && (
              <motion.div key={`step${currentStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <CheckCircle2 className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-4 animate-pulse" />
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{STEPS.find(s=>s.id === currentStep)?.name} Step</h2>
                <p className="text-zinc-500 font-medium">This step is mocked for demonstration purposes.</p>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-12 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
            {currentStep > 1 ? (
              <button onClick={prevStep} className="px-6 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-zinc-700 dark:text-zinc-300 hover:bg-surface dark:hover:bg-zinc-800 transition-colors">
                Back
              </button>
            ) : <div></div>}
            
            <button onClick={nextStep} className="px-8 py-3 bg-[#2bb75c] hover:bg-[#1d8d38] text-white font-bold rounded-xl shadow-lg shadow-[#2bb75c]/25/20 transition-colors flex items-center gap-2">
              {currentStep === STEPS.length ? 'Review Job Post' : 'Next: ' + STEPS[currentStep]?.name}
              {currentStep !== STEPS.length && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

