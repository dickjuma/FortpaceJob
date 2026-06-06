import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function OTPInput({ 
  length = 6, 
  value = '', 
  onChange, 
  error,
  disabled = false,
  autoFocus = true
}) {
  const inputRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(autoFocus ? 0 : -1);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Handle focus on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const handleChange = (e, index) => {
    const text = e.target.value;
    // Only allow numbers
    if (text && !/^\d+$/.test(text)) return;

    const newValue = value.split('');
    newValue[index] = text.slice(-1); // Only take last character if multiple typed
    
    const newOtpValue = newValue.join('');
    onChange(newOtpValue);

    // Auto focus next
    if (text && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      // Focus previous on backspace if current is empty
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pastedData) {
      onChange(pastedData.padEnd(length, '').slice(0, length));
      // Focus last filled or next empty
      const nextIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextIndex].focus();
    }
  };

  const isComplete = value.length === length;

  return (
    <div className="w-full">
      <div className="flex justify-center gap-2 sm:gap-3">
        {Array.from({ length }).map((_, index) => (
          <motion.div
            key={index}
            animate={
              isComplete && !error ? { scale: [1, 1.1, 1], transition: { delay: index * 0.05 } } :
              focusedIndex === index ? { y: -2 } : { y: 0 }
            }
            className="relative"
          >
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              value={value[index] || ''}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
              disabled={disabled}
              className={`
                w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl 
                transition-all duration-300 outline-none
                ${error 
                  ? 'border-red-300 text-red-600 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                  : isComplete
                    ? 'border-green-300 text-green-700 bg-green-50/50 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                    : 'border-zinc-200 bg-white/50 dark:bg-surface-dark/50 backdrop-blur-sm focus:border-[#4C1D95]/20 focus:ring-2 focus:ring-[#4C1D95]/20 dark:border-zinc-700 dark:text-white dark:focus:border-[#4C1D95]/20'
                }
                border shadow-sm
                disabled:opacity-50 disabled:bg-surface
              `}
            />
            {/* Focus Indicator */}
            {focusedIndex === index && !isComplete && !error && (
              <motion.div 
                layoutId="otp-focus"
                className="absolute -bottom-2 left-1/2 -tranzinc-x-1/2 w-1.5 h-1.5 rounded-full bg-[#4C1D95]"
              />
            )}
          </motion.div>
        ))}
      </div>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm font-medium text-red-600 dark:text-red-400 mt-4"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}


