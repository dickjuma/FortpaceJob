import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Button from './ui/Button';

export default function SuccessAnimation({ name, accountType, onComplete }) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Small delay before showing confetti
    const timer = setTimeout(() => setShowConfetti(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center py-8 text-center relative overflow-hidden">
      
      {/* Basic CSS Confetti equivalent */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           {Array.from({ length: 50 }).map((_, i) => (
             <motion.div
                key={i}
                className={`absolute w-2 h-2 ${['bg-[#2bb75c]', 'bg-cyan-500', 'bg-success', 'bg-amber-500', 'bg-[#2bb75c]'][i % 5]}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-5%',
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                }}
                animate={{
                  y: ['0vh', '100vh'],
                  x: [`0px`, `${(Math.random() - 0.5) * 200}px`],
                  rotate: [0, Math.random() * 360 * 5]
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  ease: "linear",
                  repeat: 0
                }}
             />
           ))}
        </div>
      )}

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-24 h-24 bg-green-100 dark:bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)] relative z-10"
      >
        <CheckCircle className="w-12 h-12" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 border-4 border-green-500/30 rounded-full"
        />
      </motion.div>

      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold mb-2 tracking-tight"
      >
        Welcome aboard, {name}!
      </motion.h2>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm"
      >
        Your {accountType.replace('_', ' ')} account has been created successfully. We've personalized your experience.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="bg-surface dark:bg-zinc-800/50 rounded-2xl p-4 mb-6 border border-zinc-200 dark:border-zinc-700 text-left">
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-zinc-500">Next Steps</h3>
          <ul className="space-y-3">
            {[
              "Complete your profile (80% done)",
              "Explore the dashboard",
              accountType === 'freelancer' ? "Apply for your first gig" : "Post your first job"
            ].map((step, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-[#2bb75c]/10 dark:bg-[#2bb75c]/20 text-[#2bb75c] dark:text-[#2bb75c] flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button 
          variant="gradient" 
          size="lg" 
          icon={ArrowRight} 
          iconPosition="right"
          onClick={onComplete}
        >
          Go to Dashboard
        </Button>
      </motion.div>
    </div>
  );
}

