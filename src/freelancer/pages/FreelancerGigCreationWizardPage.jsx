// src/pages/freelancer/FreelancerGigCreationWizardPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, DollarSign, Image as ImageIcon, Settings,
  CheckCircle2, Sparkles, ChevronRight, ChevronLeft,
  UploadCloud, AlertCircle, Save, Check, X
} from 'lucide-react';
import { useCreateGig } from '../services/freelancerHooks';

const STEPS = [
  { id: 1, name: 'Overview', icon: FileText },
  { id: 2, name: 'Pricing', icon: DollarSign },
  { id: 3, name: 'Description', icon: FileText },
  { id: 4, name: 'Gallery', icon: ImageIcon },
  { id: 5, name: 'Publish', icon: Settings },
];

export default function FreelancerGigCreationWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState('');
  const [showSuccess, setShowSuccess] = useState(null);
  
  const createGig = useCreateGig();

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSaveExit = () => {
    setShowSuccess({ message: 'Draft saved successfully' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handlePublish = () => {
    createGig.mutate({ title, status: 'PUBLISHED' }, {
      onSuccess: () => {
        setShowSuccess({ message: 'Gig published successfully!' });
        setTimeout(() => setShowSuccess(null), 2000);
      }
    });
  };

  const isLastStep = currentStep === STEPS.length;

  return (
    <div className="min-h-screen bg-surface-soft flex flex-col">
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wizard Header & Progress */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="py-4 flex justify-between items-center border-b border-border">
            <h1 className="font-display font-bold text-xl text-brand-900 flex items-center gap-2">
              Create a new gig
            </h1>
            <div className="flex items-center gap-4 text-sm font-body font-medium text-ink-tertiary">
              <span className="flex items-center gap-1">
                <Save className="w-4 h-4" /> Draft saved
              </span>
              <button
                onClick={handleSaveExit}
                className="px-4 py-1.5 border border-border rounded-lg hover:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900"
              >
                Save & exit
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="py-8 flex justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />
            <motion.div
              className="absolute top-1/2 left-0 h-0.5 bg-accent DEFAULT -translate-y-1/2 z-0"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />

            {STEPS.map((step, idx) => {
              const isCompleted = step.id < currentStep;
              const isActive = step.id === currentStep;
              const StepIcon = step.icon;
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-semibold text-sm border-2 transition-all ${
                    isActive
                      ? "bg-white border-accent DEFAULT text-accent DEFAULT shadow-md"
                      : isCompleted
                      ? "bg-accent DEFAULT border-accent DEFAULT text-white"
                      : "bg-white border-border text-ink-tertiary"
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs font-body font-medium absolute -bottom-6 w-24 text-center ${
                    isActive ? "text-accent DEFAULT" : isCompleted ? "text-ink-primary" : "text-ink-tertiary"
                  }`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">

        {/* Main Form Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {/* Step 1: Overview */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-border rounded-2xl p-6 shadow-sm"
              >
                <h2 className="font-display font-semibold text-xl text-brand-900 mb-6">Gig overview</h2>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-sm font-body font-medium text-ink-primary">Gig title</label>
                      <span className="text-xs font-mono text-ink-tertiary">{title.length} / 80</span>
                    </div>
                    <p className="text-xs font-body text-ink-tertiary mb-3">
                      Your title is the most important place to include keywords that buyers would use to search for your service
                    </p>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-ink-tertiary font-body font-medium text-base">I will</span>
                      <textarea
                        className="w-full pl-20 pr-4 py-3 bg-white border border-border rounded-xl text-base font-body text-ink-primary placeholder-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent resize-none"
                        rows={2}
                        placeholder="do something I'm really good at"
                        value={title}
                        onChange={e => setTitle(e.target.value.substring(0, 80))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-body font-medium text-ink-primary mb-2">Category</label>
                      <select className="w-full h-11 px-4 bg-white border border-border rounded-xl text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900">
                        <option>Select a category</option>
                        <option>Programming & Tech</option>
                        <option>Graphics & Design</option>
                        <option>Digital Marketing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium text-ink-primary mb-2">Subcategory</label>
                      <select className="w-full h-11 px-4 bg-white border border-border rounded-xl text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900">
                        <option>Select a subcategory</option>
                        <option>Web Development</option>
                        <option>Mobile Apps</option>
                        <option>Desktop Applications</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium text-ink-primary mb-2">Search tags</label>
                    <p className="text-xs font-body text-ink-tertiary mb-3">
                      Tag your gig with relevant keywords. Use all 5 tags to get found.
                    </p>
                    <input
                      type="text"
                      placeholder="e.g. react, nextjs, frontend"
                      className="w-full h-11 px-4 bg-white border border-border rounded-xl text-sm font-body text-ink-primary placeholder-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Pricing - Placeholder */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center"
              >
                <DollarSign className="w-16 h-16 text-ink-tertiary mb-4" />
                <h2 className="font-display font-semibold text-xl text-brand-900 mb-2">Pricing step</h2>
                <p className="text-ink-secondary font-body">Configure your package pricing and delivery options</p>
              </motion.div>
            )}

            {/* Step 3: Description - Placeholder */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center"
              >
                <FileText className="w-16 h-16 text-ink-tertiary mb-4" />
                <h2 className="font-display font-semibold text-xl text-brand-900 mb-2">Description step</h2>
                <p className="text-ink-secondary font-body">Write a detailed description of your service</p>
              </motion.div>
            )}

            {/* Step 4: Gallery */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-border rounded-2xl p-6 shadow-sm"
              >
                <h2 className="font-display font-semibold text-xl text-brand-900 mb-2">Showcase your services</h2>
                <p className="text-sm font-body text-ink-secondary mb-6">Encourage buyers to choose your gig by featuring your work</p>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-body font-semibold text-lg text-ink-primary mb-1">Images (up to 3)</h3>
                    <p className="text-xs font-body text-ink-tertiary mb-4">Get noticed with visual examples of your services</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="aspect-video bg-surface-soft border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent DEFAULT hover:bg-accent-light transition-all group">
                          <UploadCloud className="w-8 h-8 text-ink-tertiary group-hover:text-accent DEFAULT transition-colors mb-2" />
                          <span className="text-xs font-body font-medium text-ink-tertiary group-hover:text-accent DEFAULT">
                            Upload image
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-body font-semibold text-lg text-ink-primary mb-1">Video (optional)</h3>
                    <p className="text-xs font-body text-ink-tertiary mb-4">Capture attention with a video showcasing your service</p>
                    <div className="aspect-video md:w-2/3 bg-surface-soft border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent DEFAULT hover:bg-accent-light transition-all group">
                      <UploadCloud className="w-8 h-8 text-ink-tertiary group-hover:text-accent DEFAULT transition-colors mb-2" />
                      <span className="text-xs font-body font-medium text-ink-tertiary group-hover:text-accent DEFAULT">
                        Upload video
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Publish - Placeholder */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center"
              >
                <Settings className="w-16 h-16 text-ink-tertiary mb-4" />
                <h2 className="font-display font-semibold text-xl text-brand-900 mb-2">Ready to publish?</h2>
                <p className="text-ink-secondary font-body">Review your gig details before publishing</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2.5 rounded-lg font-body font-medium text-sm transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-900 ${
                currentStep === 1
                  ? "opacity-0 pointer-events-none"
                  : "border border-border text-ink-primary hover:bg-surface-muted"
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={isLastStep ? handlePublish : nextStep}
              className="px-8 py-2.5 rounded-lg bg-brand-900 hover:bg-brand-800 text-white font-body font-semibold text-sm transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-900"
            >
              {isLastStep ? 'Publish gig' : 'Save & continue'}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Right Column: Tips */}
        <div className="w-full lg:w-80 shrink-0 hidden lg:block space-y-5">

          {/* Tips Card */}
          <div className="bg-accent-light border border-accent DEFAULT rounded-2xl p-5">
            <h3 className="font-body font-semibold text-accent-dark flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5" /> Quick tips
            </h3>
            <ul className="space-y-2 text-sm font-body text-accent-dark">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                Keep titles short and clear
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                Add high-quality images to stand out
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                Clearly define what is not included
              </li>
            </ul>
          </div>

          {/* Help Card */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-body font-semibold text-ink-primary mb-3">Need help?</h3>
            <p className="text-sm font-body text-ink-secondary mb-4">
              View our gig creation guide for best practices and tips to get more orders.
            </p>
            <button className="w-full py-2 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body text-sm font-medium transition-colors">
              View guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
