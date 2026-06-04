import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, DollarSign, Image as ImageIcon, Settings, 
  CheckCircle2, Sparkles, ChevronRight, ChevronLeft, 
  UploadCloud, AlertCircle, Save
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const STEPS = [
  { id: 1, name: 'Overview', icon: FileText },
  { id: 2, name: 'Pricing', icon: DollarSign },
  { id: 3, name: 'Description & FAQ', icon: FileText },
  { id: 4, name: 'Gallery', icon: ImageIcon },
  { id: 5, name: 'Publish', icon: Settings },
];

export default function FreelancerGigCreationWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState('');

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans flex flex-col">
      
      {/* Wizard Header & Progress */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="py-4 flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800">
            <h1 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
              Create a new Gig
            </h1>
            <div className="flex items-center gap-4 text-sm font-bold text-zinc-500">
              <span className="flex items-center gap-1"><Save className="w-4 h-4" /> Draft saved at 10:42 AM</span>
              <button className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-surface dark:hover:bg-zinc-800 transition-colors">Save & Exit</button>
            </div>
          </div>
          
          <div className="py-6 flex justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-100 dark:bg-zinc-800 -tranzinc-y-1/2 z-0"></div>
            <div className="absolute top-1/2 left-0 h-1 bg-[#2bb75c] -tranzinc-y-1/2 z-0 transition-all duration-500" style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}></div>
            
            {STEPS.map((step, idx) => {
              const isCompleted = step.id < currentStep;
              const isActive = step.id === currentStep;
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors",
                    isActive ? "bg-white dark:bg-surface-dark border-[#2bb75c]/20 text-[#2bb75c] dark:text-[#2bb75c] shadow-lg" : 
                    isCompleted ? "bg-[#2bb75c] border-[#2bb75c]/20 text-white" : 
                    "bg-white dark:bg-surface-dark border-zinc-200 dark:border-zinc-700 text-zinc-400"
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                  </div>
                  <span className={cn("text-xs font-bold uppercase tracking-wider absolute -bottom-6 w-32 text-center", isActive ? "text-[#2bb75c] dark:text-[#2bb75c]" : isCompleted ? "text-zinc-900 dark:text-white" : "text-zinc-400")}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-12 flex gap-8">
        
        {/* Main Form Area */}
        <div className="flex-1 max-w-4xl">
          <AnimatePresence mode="wait">
            
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">Gig Overview</h2>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-sm font-bold text-zinc-900 dark:text-white">Gig Title</label>
                      <span className="text-xs font-bold text-zinc-400">{title.length} / 80 max</span>
                    </div>
                    <p className="text-xs font-medium text-zinc-500 mb-3">As your Gig storefront, your title is the most important place to include keywords that buyers would likely use to search for a service like yours.</p>
                    <div className="flex relative">
                      <span className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-zinc-900 dark:text-white font-bold text-lg">I will</span>
                      <textarea 
                        className="w-full pl-16 pr-4 py-4 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-lg font-medium text-zinc-900 dark:text-white focus:border-[#2bb75c]/20 outline-none resize-none"
                        rows="2"
                        placeholder="do something I'm really good at"
                        value={title}
                        onChange={e => setTitle(e.target.value.substring(0, 80))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Category</label>
                      <select className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium outline-none focus:border-[#2bb75c]/20">
                        <option>Select a category</option>
                        <option>Programming & Tech</option>
                        <option>Graphics & Design</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Subcategory</label>
                      <select className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium outline-none focus:border-[#2bb75c]/20">
                        <option>Select a subcategory</option>
                        <option>Web Development</option>
                        <option>Mobile Apps</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Search Tags</label>
                    <p className="text-xs font-medium text-zinc-500 mb-3">Tag your Gig with buzz words that are relevant to the services you offer. Use all 5 tags to get found.</p>
                    <input 
                      type="text" 
                      placeholder="e.g. react, nextjs, frontend" 
                      className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium outline-none focus:border-[#2bb75c]/20"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Showcase Your Services In A Gig Gallery</h2>
                <p className="text-sm font-medium text-zinc-500 mb-8">Encourage buyers to choose your Gig by featuring a variety of your work.</p>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Images (up to 3)</h3>
                    <p className="text-xs font-medium text-zinc-500 mb-4">Get noticed by the right buyers with visual examples of your services.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="aspect-video bg-surface dark:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors group">
                          <UploadCloud className="w-8 h-8 text-zinc-400 group-hover:text-[#2bb75c] transition-colors mb-2" />
                          <span className="text-xs font-bold text-zinc-500 group-hover:text-[#2bb75c]">Drag & drop a Photo</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Video (one only)</h3>
                    <p className="text-xs font-medium text-zinc-500 mb-4">Capture buyers' attention with a video that showcases your service.</p>
                    <div className="aspect-video md:w-2/3 bg-surface dark:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors group">
                      <UploadCloud className="w-8 h-8 text-zinc-400 group-hover:text-[#2bb75c] transition-colors mb-2" />
                      <span className="text-xs font-bold text-zinc-500 group-hover:text-[#2bb75c]">Drag & drop a Video</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Dummy placeholder for other steps to show flow */}
            {currentStep !== 1 && currentStep !== 4 && (
              <motion.div key={`step${currentStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center">
                <Settings className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-4 animate-spin-slow" />
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{STEPS.find(s=>s.id === currentStep)?.name} Step</h2>
                <p className="text-zinc-500 font-medium">This step is mocked for demonstration purposes.</p>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between items-center">
            <button 
              onClick={prevStep}
              disabled={currentStep === 1}
              className={cn("px-6 py-3 font-bold rounded-xl transition-all flex items-center gap-2", currentStep === 1 ? "opacity-0 pointer-events-none" : "bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-surface dark:hover:bg-zinc-800")}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button 
              onClick={nextStep}
              className="px-8 py-3 bg-[#2bb75c] hover:bg-[#1d8d38] text-white font-bold rounded-xl shadow-lg shadow-[#2bb75c]/25/20 transition-all flex items-center gap-2"
            >
              {currentStep === STEPS.length ? 'Publish Gig' : 'Save & Continue'} {currentStep !== STEPS.length && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Right Column: AI Assistant & Tips */}
        <div className="w-80 shrink-0 hidden lg:block space-y-6">
          <div className="bg-gradient-to-br from-[#2bb75c] to-[#1d8d38] rounded-3xl p-6 shadow-md text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><Sparkles className="w-5 h-5" /></div>
              <h3 className="font-bold">Forte AI Assistant</h3>
            </div>
            <p className="text-sm font-medium text-[#2bb75c] mb-4 leading-relaxed">Need help writing your title? Provide a brief description of what you do, and I'll suggest SEO-optimized titles.</p>
            <textarea 
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-sm font-medium placeholder:text-[#2bb75c] outline-none focus:border-white mb-3"
              rows="3"
              placeholder="E.g. I build react websites..."
            />
            <button className="w-full py-2 bg-white text-[#2bb75c] font-bold rounded-lg shadow-sm">Generate Titles</button>
          </div>

          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-900/30 rounded-3xl p-6">
            <h3 className="font-bold text-amber-900 dark:text-amber-500 flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5" /> Quick Tips
            </h3>
            <ul className="space-y-3 text-sm font-medium text-amber-800 dark:text-amber-400">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> Keep titles short and clear.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> Add high-quality images to stand out.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> Clearly define what is not included in the scope.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

