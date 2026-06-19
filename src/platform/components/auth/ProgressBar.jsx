import React from 'react';
import { motion } from 'framer-motion';
import { useRegistrationStore } from '../../store/authStore';

export default function ProgressBar() {
  const { step, role } = useRegistrationStore();

  const getSteps = () => {
    if (role === 'client') {
      return [
        { id: 1, label: 'Account Type' },
        { id: 2, label: 'Organization Setup' },
        { id: 3, label: 'Profile Details' },
      ];
    } else {
      return [
        { id: 1, label: 'Account Type' },
        { id: 3, label: 'Profile Details' },
      ];
    }
  };

  const steps = getSteps();
  const currentIndex = steps.findIndex(s => s.id === step);
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
