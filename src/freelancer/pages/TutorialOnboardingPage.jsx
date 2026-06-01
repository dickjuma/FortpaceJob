import React, { useState } from 'react';
import { 
  Award, PlayCircle, ChevronRight, CheckCircle2, Globe, Shield, 
  Database, ShieldCheck, HelpCircle, X, Sparkles, BookOpen
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

export default function TutorialOnboardingPage() {
  const [activeStep, setActiveStep] = useState(0);

  const onboardingSteps = [
    { title: 'Establish Roster Profile', desc: 'Verify your ID documents, update skills taxonomy, configure availability limits, and set up your public agency/freelancer portfolio.', icon: ShieldCheck },
    { title: 'Crate Service Offerings', desc: 'Utilize our multi-step Create Service Wizard to publish premium gig cards specifying pricing models, requirements, and deadlines.', icon: Sparkles },
    { title: 'Configure Wallet Escrow', desc: 'Securely sync tax parameters, connect compliance bank routing details, and review secure milestone holding conditions.', icon: BookOpen }
  ];

  const handleNextStep = () => {
    if (activeStep === onboardingSteps.length - 1) {
      toast.success('Congratulations! Onboarding completed successfully! 🎓');
      setActiveStep(0);
    } else {
      setActiveStep(prev => prev + 1);
      toast.success(`Completed Step ${activeStep + 1}!`);
    }
  };

  const StepIcon = onboardingSteps[activeStep].icon;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-success" />
            Academy & Onboarding
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Complete our interactive onboarding tour to verify capability structures and successfully receive client orders.
          </p>
        </div>
      </div>

      {/* Main Interactive Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Step Indicators */}
        <div className="lg:col-span-1 space-y-3">
          {onboardingSteps.map((step, idx) => (
            <div 
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={cn(
                "p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3",
                activeStep === idx 
                  ? "border-success bg-success/5 shadow-sm scale-[1.01]" 
                  : "border-border bg-white hover:border-border-hover"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center font-black text-xs border",
                activeStep === idx ? "border-success bg-success text-white" : "border-border bg-light-gray text-text-secondary"
              )}>
                {idx + 1}
              </div>
              <span className={cn("font-bold text-xs", activeStep === idx ? "text-text-primary" : "text-text-secondary")}>{step.title}</span>
            </div>
          ))}
        </div>

        {/* Right Interactive Content Display */}
        <div className="lg:col-span-2">
          <Card className="bg-white border border-border p-8 rounded-[24px] shadow-md flex flex-col justify-between min-h-[340px] relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-success/5 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="p-4 bg-success/10 text-success rounded-2xl animate-pulse">
                  <StepIcon size={24} />
                </div>
                <span className="text-[10px] font-black uppercase text-success tracking-widest bg-success/10 border border-success/20 px-3 py-1 rounded-full">
                  Step {activeStep + 1} of {onboardingSteps.length}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-text-primary">{onboardingSteps[activeStep].title}</h3>
                <p className="text-sm text-text-secondary font-medium leading-relaxed max-w-lg">{onboardingSteps[activeStep].desc}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-border mt-8 flex justify-between items-center bg-transparent relative z-10">
              <div className="w-1/2">
                <div className="flex justify-between text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5">
                  <span>Academy Progress</span>
                  <span>{Math.round(((activeStep + 1) / onboardingSteps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-light-gray rounded-full h-1.5 overflow-hidden border border-border">
                  <div className="h-full bg-success rounded-full transition-all" style={{ width: `${((activeStep + 1) / onboardingSteps.length) * 100}%` }}></div>
                </div>
              </div>
              <button 
                onClick={handleNextStep}
                className="px-5 py-2.5 bg-success hover:bg-success/95 text-white font-black rounded-xl text-xs transition-colors shadow-lg shadow-[#14a800]/20 flex items-center gap-1"
              >
                {activeStep === onboardingSteps.length - 1 ? 'Finalize Tour' : 'Next Step'} <ChevronRight size={14} />
              </button>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
