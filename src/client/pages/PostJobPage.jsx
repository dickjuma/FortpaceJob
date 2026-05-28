import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, CheckCircle, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostJobPage() {
  const [step, setStep] = useState(1);
  const [isPosting, setIsPosting] = useState(false);
  const [isPosted, setIsPosted] = useState(false);

  const handlePostJob = () => {
    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      setIsPosted(true);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 font-sans">
      <div className="mb-8">
        <Link to="/client/jobs" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 mb-4 inline-flex items-center transition-colors">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Post a Request</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Provide details to attract top-rated talent for your project.</p>
      </div>

      <div className="flex mb-8 space-x-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 h-2 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: step >= s ? '100%' : '0%' }}
               transition={{ duration: 0.5, ease: "easeInOut" }}
               className="h-full bg-indigo-600 dark:bg-indigo-500"
             />
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-8 sm:p-10 relative overflow-hidden">
        {step !== 3 && (
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -tranzinc-y-1/2 tranzinc-x-1/3" />
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 relative z-10"
            >
              <div>
                <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Project Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Senior React Developer for Enterprise Dashboard"
                  className="w-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Detailed Description</label>
                <textarea 
                  rows="6"
                  placeholder="Describe your project, the required deliverables, and any specific technical requirements..."
                  className="w-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Required Skills</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                    React <X className="w-3.5 h-3.5 ml-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity" />
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                    TypeScript <X className="w-3.5 h-3.5 ml-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity" />
                  </span>
                </div>
                <input 
                  type="text" 
                  placeholder="Type a skill and press Enter..."
                  className="w-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 relative z-10"
            >
              <div>
                <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-4">Work Model</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border-2 border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 p-5 rounded-2xl cursor-pointer text-center relative overflow-hidden transition-all shadow-sm">
                    <div className="absolute top-2 right-2"><CheckCircle className="w-5 h-5 text-indigo-600" /></div>
                    <Briefcase className="w-8 h-8 mx-auto text-indigo-600 mb-3" />
                    <p className="font-bold text-zinc-900 dark:text-white">Remote</p>
                    <p className="text-xs text-zinc-500 mt-1">Work from anywhere</p>
                  </div>
                  <div className="border-2 border-zinc-200 dark:border-zinc-700 p-5 rounded-2xl cursor-pointer text-center hover:border-zinc-300 dark:hover:border-zinc-600 transition-all">
                    <MapPin className="w-8 h-8 mx-auto text-zinc-400 mb-3" />
                    <p className="font-bold text-zinc-900 dark:text-white">Onsite</p>
                    <p className="text-xs text-zinc-500 mt-1">Specific physical location</p>
                  </div>
                  <div className="border-2 border-zinc-200 dark:border-zinc-700 p-5 rounded-2xl cursor-pointer text-center hover:border-zinc-300 dark:hover:border-zinc-600 transition-all">
                    <Clock className="w-8 h-8 mx-auto text-zinc-400 mb-3" />
                    <p className="font-bold text-zinc-900 dark:text-white">Hybrid</p>
                    <p className="text-xs text-zinc-500 mt-1">Mix of remote and onsite</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-4">Project Scope</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-zinc-200 dark:border-zinc-700 p-5 rounded-2xl cursor-pointer hover:border-zinc-300 transition-all flex items-start">
                    <div className="mr-4 mt-1 bg-zinc-100 dark:bg-zinc-800 p-2 rounded-xl"><Clock className="w-5 h-5 text-zinc-500" /></div>
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">Hourly Rate</p>
                      <p className="text-xs text-zinc-500 mt-1">Pay by the hour for ongoing or flexible work.</p>
                    </div>
                  </div>
                  <div className="border-2 border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 p-5 rounded-2xl cursor-pointer flex items-start relative shadow-sm">
                    <div className="absolute top-2 right-2"><CheckCircle className="w-5 h-5 text-indigo-600" /></div>
                    <div className="mr-4 mt-1 bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-xl"><DollarSign className="w-5 h-5 text-indigo-600" /></div>
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">Fixed Price</p>
                      <p className="text-xs text-zinc-500 mt-1">Pay a set price for a well-defined project.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Estimated Budget ($)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 5000"
                  className="w-full max-w-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
            </motion.div>
          )}

          {step === 3 && isPosted && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="text-center py-16 relative z-10"
            >
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                  <CheckCircle className="w-12 h-12 text-emerald-500" />
                </motion.div>
              </div>
              <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-3">Request Posted Successfully!</h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-10 text-lg">
                Your request is now live. We're matching you with top-rated talent right now.
              </p>
              <Link to="/client/dashboard">
                <button className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-500/30">
                  Go to Command Center
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {!isPosted && (
          <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-between relative z-10">
            <button 
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={isPosting}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-colors ${step === 1 ? 'invisible' : 'text-zinc-600 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'} ${isPosting ? 'opacity-50' : ''}`}
            >
              Back
            </button>
            
            {step < 3 ? (
              <button 
                onClick={() => setStep(step + 1)}
                className="flex items-center px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-500/30"
              >
                Next Step <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button 
                onClick={handlePostJob}
                disabled={isPosting}
                className={`flex items-center px-10 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-500/30 ${isPosting ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:scale-105'}`}
              >
                {isPosting ? 'Posting...' : 'Post Request'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
