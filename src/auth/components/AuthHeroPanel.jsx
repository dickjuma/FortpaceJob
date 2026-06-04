import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, TrendingUp, Users, Star } from 'lucide-react';

export default function AuthHeroPanel({ 
  title = "Welcome back to the world's most trusted talent network.", 
  subtitle = "Join thousands of professionals securing high-quality contracts with AI-driven matching and secure escrow.",
  stats = true,
  className = '',
}) {
  const panelClasses = [
    'hidden relative overflow-hidden bg-surface-dark text-white lg:flex lg:basis-[30%] lg:max-w-[380px] lg:flex-col lg:p-7 xl:basis-[28%] xl:max-w-[420px] xl:p-8 2xl:max-w-[460px]',
    stats ? 'lg:justify-between' : 'lg:justify-center',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={panelClasses}>
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#2bb75c]/20 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-cyan-500/20 blur-[120px]" 
        />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+Cjwvc3ZnPg==')] opacity-30 animate-particle-float" />
      </div>

      <div className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`flex items-center gap-3 ${stats ? 'mb-10' : 'mb-8'}`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2bb75c] shadow-lg shadow-[#2bb75c]/25/30 xl:h-11 xl:w-11">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight xl:text-2xl">Forte<span className="text-[#2bb75c]">.</span></span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="mb-4 text-2xl font-bold leading-tight xl:text-[2rem] 2xl:text-[2.25rem]">
            {title}
          </h1>
          <p className="max-w-xs text-sm leading-relaxed text-zinc-400 xl:max-w-sm xl:text-base">
            {subtitle}
          </p>
        </motion.div>
      </div>

      {stats && (
        <div className="relative z-10 mt-8 space-y-4">
          {/* Glassmorphism Stat Cards */}
          <div className="grid max-w-lg grid-cols-1 gap-3">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass-card rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <TrendingUp className="mb-3 h-6 w-6 text-[#2bb75c]" />
              <div className="mb-1 text-xl font-bold xl:text-2xl">$2.4M+</div>
              <div className="text-sm text-zinc-400">Freelancer Earnings</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="glass-card hidden rounded-2xl border border-white/10 bg-white/5 p-4 2xl:block"
            >
              <Users className="mb-3 h-6 w-6 text-cyan-400" />
              <div className="mb-1 text-xl font-bold xl:text-2xl">50k+</div>
              <div className="text-sm text-zinc-400">Active Professionals</div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="hidden items-center gap-4 pt-3 text-sm text-zinc-400 xl:flex"
          >
             <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                   <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" className="w-full h-full object-cover" />
                 </div>
               ))}
             </div>
             <div>
               <div className="flex items-center gap-1 text-yellow-400 mb-0.5">
                 <Star className="w-4 h-4 fill-current" />
                 <Star className="w-4 h-4 fill-current" />
                 <Star className="w-4 h-4 fill-current" />
                 <Star className="w-4 h-4 fill-current" />
                 <Star className="w-4 h-4 fill-current" />
               </div>
               <p>Trusted by 150k+ professionals</p>
             </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

