import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function HeroSection({
  title = "Build, Hire & Scale",
  subtitle = "Without Limits",
  description = "The intelligent freelance marketplace for professionals, businesses, and enterprises.",
  image = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070"
}) {
  return (
    <div className="relative h-full w-full bg-surface-dark text-white overflow-hidden p-12 flex flex-col justify-between rounded-[2.5rem] shadow-2xl">
      {/* Background gradients and image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={image} 
          alt="Professionals collaborating" 
          className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-zinc-900 via-transparent to-transparent opacity-80" />
      </div>

      {/* Top Branding */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-12 h-12 rounded-2xl bg-success flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <span className="text-white font-bold text-2xl leading-none">F</span>
          </div>
          <span className="text-3xl font-bold tracking-tight">
            Forte<span className="text-success">.</span>
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6 text-white">
            {title} <br />
            <span className="text-success">{subtitle}</span>
          </h1>
          <p className="text-lg text-zinc-300 max-w-md leading-relaxed">
            {description}
          </p>
        </motion.div>
      </div>

      {/* Bottom Floating Cards & Trust Badges */}
      <div className="relative z-10 mt-auto">
        
        {/* Floating UI Elements */}
        <div className="relative h-48 mb-8">
          <motion.div 
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl w-64"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Project Matched</p>
                <p className="text-xs text-zinc-400">Under 2 minutes</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-4 right-0 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl w-72"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border border-zinc-700" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" alt="User" />
                <img className="w-8 h-8 rounded-full border border-zinc-700" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop" alt="User" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Escrow Secured</p>
                <p className="text-xs text-zinc-400">$4,500 milestone funded</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Stats */}
        <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-zinc-700/50">
          <div className="flex items-center gap-2">
            <div className="flex text-success text-sm">★★★★★</div>
            <span className="text-sm font-medium text-zinc-300">Trusted by 50,000+ professionals</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-zinc-300">Enterprise Grade Security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
