import React from 'react';
import { motion } from 'framer-motion';
import { useRegistrationStore } from '../../store/authStore';

export default function OnboardingProgress() {
  const { step, role } = useRegistrationStore();

  const getSteps = () => {
    if (role === 'freelancer') {
      return [
        { id: 1, label: 'Role Selection' },
        { id: 2, label: 'Work Mode' },
        { id: 3, label: 'Structure Type' },
        { id: 4, label: 'Account Setup' },
      ];
    } else {
      return [
        { id: 1, label: 'Role Selection' },
        { id: 2, label: 'Organization Setup' },
        { id: 3, label: 'Account Setup' },
      ];
    }
  };

  const steps = getSteps();
  
  // Normalize current index based on role logic
  let currentIndex = 0;
  if (role === 'freelancer') {
    currentIndex = step - 1; // steps 1, 2, 3, 4
  } else {
    // Client has steps 1, 2, 4 (because 3 is skipped in the orchestrator)
    if (step === 1) currentIndex = 0;
    else if (step === 2) currentIndex = 1;
    else if (step === 4) currentIndex = 2; // the final form step is always rendered on step 4 in the orchestrator
  }

  // Cap the progress so it doesn't overflow during transitions
  currentIndex = Math.max(0, Math.min(currentIndex, steps.length - 1));
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="w-full mb-12">
      <div className="flex items-center justify-between mb-4">
        {steps.map((s, index) => {
          const isActive = index === currentIndex;
          const isPast = index < currentIndex;
          return (
            <div key={s.id} className="flex flex-col items-center flex-1">
              <div className={`text-xs font-semibold uppercase tracking-wider mb-2 transition-colors duration-500 ${
                isActive ? 'text-success' : isPast ? 'text-emerald-800' : 'text-zinc-400'
              }`}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-0 left-0 h-full bg-success rounded-full"
        />
      </div>
    </div>
  );
}
