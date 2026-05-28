import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Building2, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useRegistrationStore } from '../../store/authStore';

export default function RoleSelection() {
  const { role, setRole, setStep } = useRegistrationStore();

  const handleNext = () => {
    if (!role) return;
    if (role === 'client') {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">Choose your path</h2>
        <p className="text-xl text-zinc-500 max-w-2xl">Tell us how you want to use Forte. This helps us customize your workspace and dashboard experience.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        
        {/* Freelancer Card */}
        <motion.div
          whileHover={{ y: -8, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setRole('freelancer')}
          className={`group relative overflow-hidden rounded-[2rem] border-2 cursor-pointer transition-all duration-500 ${
            role === 'freelancer' 
              ? 'border-emerald-600 shadow-2xl shadow-emerald-600/20' 
              : 'border-zinc-200 shadow-lg shadow-zinc-200/50 hover:border-zinc-300'
          }`}
        >
          {/* Background Image & Overlay */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600" 
              alt="Freelancer working" 
              className="w-full h-full object-cover opacity-20 transition-transform duration-700 group-hover:scale-105"
            />
            <div className={`absolute inset-0 transition-colors duration-500 ${
              role === 'freelancer' ? 'bg-emerald-900/40' : 'bg-surface-dark/60'
            }`} />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent" />
          </div>

          {/* Floating UI Widget Simulation */}
          <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 w-48 shadow-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">Earnings</span>
            </div>
            <div className="text-2xl font-bold text-white mb-2">$4,250</div>
            <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-success w-3/4" />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-10 h-[450px] flex flex-col justify-end">
            {role === 'freelancer' && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-8 left-8 w-10 h-10 bg-success rounded-full flex items-center justify-center shadow-lg"
              >
                <CheckCircle2 className="w-6 h-6 text-white" />
              </motion.div>
            )}
            
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6">
              <Briefcase className="w-8 h-8 text-success" />
            </div>
            <h3 className="font-bold text-3xl text-white mb-3">Freelancer</h3>
            <p className="text-lg text-zinc-300 leading-relaxed mb-6">
              Work independently, earn globally, and build your reputation on your own terms.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-zinc-400 text-sm"><CheckCircle2 className="w-4 h-4 text-success" /> Secure escrow payments</li>
              <li className="flex items-center gap-2 text-zinc-400 text-sm"><CheckCircle2 className="w-4 h-4 text-success" /> Access to global clients</li>
              <li className="flex items-center gap-2 text-zinc-400 text-sm"><CheckCircle2 className="w-4 h-4 text-success" /> AI-powered job matching</li>
            </ul>
          </div>
        </motion.div>


        {/* Client Card */}
        <motion.div
          whileHover={{ y: -8, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setRole('client')}
          className={`group relative overflow-hidden rounded-[2rem] border-2 cursor-pointer transition-all duration-500 ${
            role === 'client' 
              ? 'border-brand-600 shadow-2xl shadow-indigo-600/20' 
              : 'border-zinc-200 shadow-lg shadow-zinc-200/50 hover:border-zinc-300'
          }`}
        >
          {/* Background Image & Overlay */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=1600" 
              alt="Client dashboard" 
              className="w-full h-full object-cover opacity-20 transition-transform duration-700 group-hover:scale-105"
            />
            <div className={`absolute inset-0 transition-colors duration-500 ${
              role === 'client' ? 'bg-brand-900/40' : 'bg-surface-dark/60'
            }`} />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent" />
          </div>

          {/* Floating UI Widget Simulation */}
          <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 w-56 shadow-2xl transform -rotate-2 group-hover:-rotate-4 transition-transform duration-500">
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="w-4 h-4 text-brand-400" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">Hiring Pipeline</span>
            </div>
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-full border-2 border-zinc-800" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" alt="Candidate" />
              <img className="w-10 h-10 rounded-full border-2 border-zinc-800" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop" alt="Candidate" />
              <div className="w-10 h-10 rounded-full border-2 border-zinc-800 bg-brand-500 flex items-center justify-center text-xs text-white font-bold">+12</div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-10 h-[450px] flex flex-col justify-end">
            {role === 'client' && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-8 left-8 w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <CheckCircle2 className="w-6 h-6 text-white" />
              </motion.div>
            )}
            
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6">
              <Building2 className="w-8 h-8 text-brand-400" />
            </div>
            <h3 className="font-bold text-3xl text-white mb-3">Client</h3>
            <p className="text-lg text-zinc-300 leading-relaxed mb-6">
              Hire top-tier talent, manage complex projects, and scale your global workforce.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-zinc-400 text-sm"><CheckCircle2 className="w-4 h-4 text-brand-400" /> Advanced applicant tracking</li>
              <li className="flex items-center gap-2 text-zinc-400 text-sm"><CheckCircle2 className="w-4 h-4 text-brand-400" /> Automated compliance</li>
              <li className="flex items-center gap-2 text-zinc-400 text-sm"><CheckCircle2 className="w-4 h-4 text-brand-400" /> Multi-department workflows</li>
            </ul>
          </div>
        </motion.div>

      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!role}
          className={`px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 ${
            role 
              ? 'bg-surface-dark text-white hover:scale-105 shadow-2xl shadow-zinc-900/30' 
              : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>

    </motion.div>
  );
}
