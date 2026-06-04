import React from 'react';
import { motion } from 'framer-motion';
import AuthHeroPanel from './AuthHeroPanel';

export default function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  heroTitle, 
  heroSubtitle, 
  showStats = true,
  heroPanelClassName = '',
  contentClassName = '',
  formShellClassName = '',
  cardClassName = '',
}) {
  const contentClasses = [
    'flex-1 flex flex-col items-center justify-center px-4 pb-8 pt-24 sm:px-6 lg:min-w-0 lg:px-8 lg:py-10 xl:px-12',
    contentClassName,
  ].filter(Boolean).join(' ');

  const formShellClasses = [
    'w-full max-w-md relative z-10',
    formShellClassName,
  ].filter(Boolean).join(' ');

  const cardClasses = [
    'bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-5 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 sm:p-8',
    cardClassName,
  ].filter(Boolean).join(' ');

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-surface-dark text-zinc-900 dark:text-zinc-50 selection:bg-[#2bb75c]/30 lg:flex-row">
      
      {/* Left Side: Animated Branding Panel */}
      <AuthHeroPanel 
        title={heroTitle} 
        subtitle={heroSubtitle} 
        stats={showStats} 
        className={heroPanelClassName}
      />

      {/* Right Side: Auth Form Container */}
      <div className={`${contentClasses} relative overflow-y-auto custom-scrollbar`}>
        
        {/* Subtle Background Elements for Right Side */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2bb75c]/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={formShellClasses}
        >
          {/* Header section (if title is provided, some pages handle their own headers) */}
          {(title || subtitle) && (
            <div className="mb-8 text-center sm:text-left">
              {title && <h2 className="text-3xl font-bold mb-2 tracking-tight">{title}</h2>}
              {subtitle && <p className="text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
            </div>
          )}

          {/* Form Card */}
          <div className={cardClasses}>
            {children}
          </div>
        </motion.div>
        
        {/* Mobile-only logo (hidden on desktop since it's in the hero panel) */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2bb75c] flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
          <span className="font-bold tracking-tight">Forte<span className="text-[#2bb75c]">.</span></span>
        </div>
      </div>
    </div>
  );
}

