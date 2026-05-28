import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, ShieldCheck, ArrowRight } from 'lucide-react';

const RegisterSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark text-zinc-900 dark:text-zinc-50 p-6 selection:bg-brand-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">Forte</span>
          </div>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-extrabold mb-4">Join as a client or freelancer</h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
              Choose how you want to use Forte Marketplace. You can always create another account type later.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Client Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative bg-white dark:bg-zinc-800 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-2xl hover:border-brand-500/50 transition-all duration-300 hover:-tranzinc-y-2 cursor-pointer overflow-hidden"
            onClick={() => navigate('/auth/register/client')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
            
            <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-8 border border-brand-100 dark:border-brand-500/20">
              <Briefcase className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">I'm a client, hiring for a project</h2>
            <ul className="space-y-3 mb-8 text-zinc-600 dark:text-zinc-400">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-500" /> AI-matched elite talent</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-500" /> Secure escrow payments</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-500" /> Enterprise-grade contracts</li>
            </ul>

            <button className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-surface-dark dark:bg-zinc-700 text-white rounded-xl font-semibold group-hover:bg-brand-600 transition-colors">
              Join as a Client <ArrowRight className="w-5 h-5 group-hover:tranzinc-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Freelancer Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative bg-white dark:bg-zinc-800 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-2xl hover:border-teal-500/50 transition-all duration-300 hover:-tranzinc-y-2 cursor-pointer overflow-hidden"
            onClick={() => navigate('/auth/register/freelancer')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
            
            <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center mb-8 border border-teal-100 dark:border-teal-500/20">
              <User className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">I'm a freelancer, looking for work</h2>
            <ul className="space-y-3 mb-8 text-zinc-600 dark:text-zinc-400">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-500" /> High-paying global contracts</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Guaranteed payment protection</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Build your Trust Score</li>
            </ul>

            <button className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-surface-dark dark:bg-zinc-700 text-white rounded-xl font-semibold group-hover:bg-teal-600 transition-colors">
              Apply as a Freelancer <ArrowRight className="w-5 h-5 group-hover:tranzinc-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        <p className="mt-12 text-center text-zinc-600 dark:text-zinc-400">
          Already have an account? <a href="/auth/login" className="font-semibold text-brand-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterSelectionPage;
