import React, { forwardRef, useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from './Input';

const calculateStrength = (password) => {
  let score = 0;
  if (!password) return score;
  if (password.length >= 8) score += 1;
  if (password.match(/[A-Z]/)) score += 1;
  if (password.match(/[0-9]/)) score += 1;
  if (password.match(/[^A-Za-z0-9]/)) score += 1;
  return score;
};

const PasswordInput = forwardRef(({ showStrength = false, label = "Password", value, onChange, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  
  const strength = calculateStrength(value || '');

  // Detect caps lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.getModifierState) setCapsLockActive(e.getModifierState('CapsLock'));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyDown);
    };
  }, []);

  const getStrengthColor = () => {
    switch (strength) {
      case 0: return 'bg-zinc-200 dark:bg-zinc-700';
      case 1: return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
      case 2: return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
      case 3: return 'bg-[#14a800] shadow-[0_0_10px_rgba(37,99,235,0.5)]';
      case 4: return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
      default: return 'bg-zinc-200 dark:bg-zinc-700';
    }
  };

  const getStrengthLabel = () => {
    switch (strength) {
      case 0: return '';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          label={label}
          icon={Lock}
          value={value}
          onChange={onChange}
          {...props}
        />
        
        <div className="absolute right-3 top-1/2 -tranzinc-y-1/2 flex items-center gap-2">
          <AnimatePresence>
            {capsLockActive && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded text-[10px] font-bold uppercase tracking-wider"
              >
                <AlertTriangle className="w-3 h-3" />
                Caps Lock
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {showStrength && value && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3"
        >
          <div className="flex justify-between items-center mb-1.5 px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Password strength</span>
            <span className={`text-xs font-bold uppercase tracking-wider ${strength >= 3 ? 'text-green-500' : 'text-zinc-500'}`}>
              {getStrengthLabel()}
            </span>
          </div>
          <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <div className={`h-full transition-all duration-500 ${strength >= 1 ? getStrengthColor() : 'bg-transparent'}`} style={{ width: '25%' }} />
            <div className={`h-full transition-all duration-500 ${strength >= 2 ? getStrengthColor() : 'bg-transparent'}`} style={{ width: '25%' }} />
            <div className={`h-full transition-all duration-500 ${strength >= 3 ? getStrengthColor() : 'bg-transparent'}`} style={{ width: '25%' }} />
            <div className={`h-full transition-all duration-500 ${strength >= 4 ? getStrengthColor() : 'bg-transparent'}`} style={{ width: '25%' }} />
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-2 px-1">
            <RequirementItem met={value.length >= 8} label="8+ characters" />
            <RequirementItem met={/[A-Z]/.test(value)} label="Uppercase letter" />
            <RequirementItem met={/[0-9]/.test(value)} label="Number" />
            <RequirementItem met={/[^A-Za-z0-9]/.test(value)} label="Special character" />
          </div>
        </motion.div>
      )}
    </div>
  );
});

const RequirementItem = ({ met, label }) => (
  <div className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors duration-300 ${met ? 'text-green-600 dark:text-green-400' : 'text-zinc-400 dark:text-zinc-500'}`}>
    <div className={`w-3 h-3 rounded-full flex items-center justify-center border transition-colors duration-300 ${met ? 'border-green-500 bg-green-500' : 'border-zinc-300 dark:border-zinc-600'}`}>
      {met && (
        <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    {label}
  </div>
);

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
