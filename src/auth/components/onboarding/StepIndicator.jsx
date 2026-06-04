import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import useOnboardingStore from '../../../store/useOnboardingStore';

const steps = [
  { id: 1, label: 'Account Type' },
  { id: 2, label: 'Business Structure' },
  { id: 3, label: 'Details' }
];

const StepIndicator = () => {
  const currentStep = useOnboardingStore((state) => state.currentStep);

  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <div className="relative flex justify-between items-center">
        {/* Connecting Lines */}
        <div className="absolute left-0 top-1/2 -tranzinc-y-1/2 w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full z-0" />
        <motion.div 
          className="absolute left-0 top-1/2 -tranzinc-y-1/2 h-1 bg-[#2bb75c] rounded-full z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Step Nodes */}
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                  isActive 
                    ? 'bg-[#2bb75c] text-white ring-4 ring-[#2bb75c]/20 shadow-lg shadow-[#2bb75c]/25' 
                    : isCompleted
                    ? 'bg-[#2bb75c] text-white'
                    : 'bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-400'
                }`}
                initial={false}
                animate={{ scale: isActive ? 1.1 : 1 }}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.id}
              </motion.div>
              <span className={`text-xs sm:text-sm font-semibold absolute top-14 whitespace-nowrap transition-colors duration-300 ${
                isActive ? 'text-[#2bb75c] dark:text-[#2bb75c]' : isCompleted ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400 dark:text-zinc-500'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;

