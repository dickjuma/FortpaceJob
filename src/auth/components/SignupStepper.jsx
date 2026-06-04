import React from 'react';
import { Check } from 'lucide-react';

export default function SignupStepper({ currentStep, steps = [] }) {
  // If steps not provided, use default
  const defaultSteps = [
    { num: 1, label: 'Account Type' },
    { num: 2, label: 'Basic Info' },
    { num: 3, label: 'Profile Setup' },
    { num: 4, label: 'Verification' },
    { num: 5, label: 'Success' }
  ];
  
  const displaySteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="mb-8 w-full">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {displaySteps.map((step, index) => {
          const isCompleted = step.num < currentStep;
          const isCurrent = step.num === currentStep;

          return (
            <div
              key={step.num}
              className="relative flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 transition-colors dark:border-zinc-800 dark:bg-zinc-950/50 sm:px-5"
            >
              {index < displaySteps.length - 1 && (
                <div className="absolute -right-2 top-1/2 hidden h-px w-4 -tranzinc-y-1/2 bg-zinc-300 dark:bg-zinc-700 sm:block" />
              )}
              <div
                className={[
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold',
                  isCompleted
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : isCurrent
                      ? 'border-[#2bb75c]/20 bg-[#2bb75c] text-white'
                      : 'border-zinc-300 bg-white text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900',
                ].join(' ')}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step.num}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-zinc-400">
                  Step {step.num}
                </p>
                <p className={`truncate text-sm font-semibold ${isCurrent ? 'text-zinc-950 dark:text-white' : 'text-zinc-600 dark:text-zinc-300'}`}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

