import React from 'react';
import { motion } from 'framer-motion';

export default function SelectionCard({ 
  id,
  title, 
  icon: Icon, 
  features, 
  examples = [],
  useCase, 
  selected, 
  onSelect,
  themeClass = "brand" // brand, cyan, emerald, amber
}) {
  const isSelected = selected === id;
  const defaultTheme = {
    border: isSelected ? 'border-[#14a800]/20' : 'border-zinc-200 dark:border-zinc-800',
    bg: isSelected ? 'bg-[#14a800]/5/50 dark:bg-[#14a800]/10' : 'bg-white/50 dark:bg-surface-dark/50',
    iconBg: isSelected ? 'bg-[#14a800]' : 'bg-[#14a800]/10 dark:bg-[#14a800]/20',
    iconColor: isSelected ? 'text-white' : 'text-[#14a800] dark:text-[#14a800]',
    shadow: isSelected ? 'shadow-[0_0_20px_rgba(37,99,235,0.2)]' : 'shadow-sm hover:shadow-md',
  };
  const accentClassMap = {
    brand: {
      radio: 'border-[#14a800]/20 bg-[#14a800]',
      outline: 'border-[#14a800]/20',
      eyebrow: 'text-[#14a800] dark:text-[#14a800]',
    },
    cyan: {
      radio: 'border-cyan-500 bg-cyan-500',
      outline: 'border-cyan-500',
      eyebrow: 'text-cyan-600 dark:text-cyan-300',
    },
    emerald: {
      radio: 'border-emerald-500 bg-emerald-500',
      outline: 'border-emerald-500',
      eyebrow: 'text-emerald-600 dark:text-emerald-300',
    },
    amber: {
      radio: 'border-amber-500 bg-amber-500',
      outline: 'border-amber-500',
      eyebrow: 'text-amber-600 dark:text-amber-300',
    },
  };

  const getThemeStyles = () => {
    switch (themeClass) {
      case 'brand': return defaultTheme;
      case 'cyan': return {
        border: isSelected ? 'border-cyan-500' : 'border-zinc-200 dark:border-zinc-800',
        bg: isSelected ? 'bg-cyan-50 dark:bg-cyan-500/10' : 'bg-white dark:bg-zinc-900',
        iconBg: isSelected ? 'bg-cyan-500' : 'bg-cyan-100 dark:bg-cyan-500/20',
        iconColor: isSelected ? 'text-white' : 'text-cyan-600 dark:text-cyan-400',
        shadow: 'shadow-sm hover:shadow-md',
      };
      case 'emerald': return {
        border: isSelected ? 'border-emerald-500' : 'border-zinc-200 dark:border-zinc-800',
        bg: isSelected ? 'bg-emerald-50 dark:bg-success/10' : 'bg-white dark:bg-zinc-900',
        iconBg: isSelected ? 'bg-success' : 'bg-emerald-100 dark:bg-success/20',
        iconColor: isSelected ? 'text-white' : 'text-success dark:text-success',
        shadow: 'shadow-sm hover:shadow-md',
      };
      case 'amber': return {
        border: isSelected ? 'border-amber-500' : 'border-zinc-200 dark:border-zinc-800',
        bg: isSelected ? 'bg-amber-50 dark:bg-amber-500/10' : 'bg-white dark:bg-zinc-900',
        iconBg: isSelected ? 'bg-amber-500' : 'bg-amber-100 dark:bg-amber-500/20',
        iconColor: isSelected ? 'text-white' : 'text-amber-600 dark:text-amber-400',
        shadow: 'shadow-sm hover:shadow-md',
      };
      default: return defaultTheme;
    }
  };

  const theme = getThemeStyles();
  const accent = accentClassMap[themeClass] || accentClassMap.brand;

  return (
    <motion.button
      type="button"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(id)}
      className={`
        relative h-full w-full overflow-hidden rounded-[1.75rem] border bg-white p-6 text-left transition-all duration-300
        ${theme.border} ${theme.bg} ${theme.shadow}
      `}
    >
      <div className="flex items-start gap-4">
        <motion.div 
          animate={isSelected ? { scale: [1, 1.04, 1] } : {}}
          transition={{ duration: 0.35 }}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${theme.iconBg} ${theme.iconColor}`}
        >
          <Icon className="h-5 w-5" />
        </motion.div>
        
        <div className="flex-1">
          <p className={`mb-2 text-[11px] font-black uppercase tracking-[0.24em] ${accent.eyebrow}`}>
            {isSelected ? 'Selected path' : 'Choose path'}
          </p>
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              {title}
            </h3>
             
            <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300 ${isSelected ? accent.radio : 'border-zinc-300 dark:border-zinc-600'}`}>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </div>
          </div>

          <div className="mb-4 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {useCase}
          </div>

          <div className="flex flex-wrap gap-2">
            {features.map((feature, i) => (
              <span key={i} className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {feature}
              </span>
            ))}
          </div>

          {examples.length > 0 && (
            <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/70">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                Examples
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {examples.map((example) => (
                  <span
                    key={example}
                    className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-600 shadow-sm dark:bg-zinc-950/80 dark:text-zinc-300"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isSelected && (
        <motion.div 
          layoutId="selection-border"
          className={`pointer-events-none absolute inset-0 rounded-2xl border-2 opacity-50 ${accent.outline}`}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
}
