import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Share2, Facebook, Twitter, Linkedin, 
  Copy, ArrowRight, TrendingUp, Search, Eye, Sparkles
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

export default function GigPublishSuccessPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const gigUrl = 'https://forte.com/gig/alexrivera/react-web-app';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gigUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Celebration Background Effects */}
      <div className="absolute top-1/2 left-1/2 -tranzinc-x-1/2 -tranzinc-y-1/2 w-[800px] h-[800px] bg-[#14a800]/10 dark:bg-[#14a800]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -tranzinc-x-1/2 -tranzinc-y-1/2 w-[400px] h-[400px] bg-success/10 dark:bg-success/20 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-4xl w-full z-10 flex flex-col md:flex-row gap-8 items-stretch">
        
        {/* Main Success Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          className="flex-1 bg-white dark:bg-surface-dark rounded-[2.5rem] p-10 shadow-2xl border border-zinc-200 dark:border-zinc-800 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-20">
            <Sparkles className="w-24 h-24 text-[#14a800]" />
          </div>

          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight">
            Gig Published Successfully!
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-sm mx-auto mb-10 leading-relaxed">
            Your gig is now live and visible to thousands of buyers on the Forte marketplace.
          </p>

          <div className="bg-surface dark:bg-zinc-800/50 rounded-2xl p-6 mb-8 border border-zinc-100 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Share your Gig to get your first order</h3>
            
            <div className="flex justify-center gap-3 mb-6">
              <button className="w-12 h-12 rounded-full bg-[#14a800] text-white flex items-center justify-center hover:bg-[#118a00] transition-colors shadow-sm"><Facebook className="w-5 h-5" /></button>
              <button className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors shadow-sm"><Twitter className="w-5 h-5" /></button>
              <button className="w-12 h-12 rounded-full bg-[#118a00] text-white flex items-center justify-center hover:bg-[#118a00] transition-colors shadow-sm"><Linkedin className="w-5 h-5" /></button>
            </div>

            <div className="flex items-center gap-2 bg-white dark:bg-surface-dark p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
              <div className="flex-1 truncate px-3 text-sm font-medium text-zinc-500">{gigUrl}</div>
              <button 
                onClick={copyToClipboard}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                  copied ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                )}
              >
                {copied ? <><CheckCircle2 className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Link</>}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <button 
              onClick={() => navigate('/freelancer/gigs')}
              className="px-8 py-3.5 bg-[#14a800] hover:bg-[#118a00] text-white font-bold rounded-xl shadow-lg shadow-[#14a800]/25/25 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              View My Gigs <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate('/freelancer/dashboard')}
              className="px-8 py-3.5 bg-transparent border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl transition-all w-full sm:w-auto"
            >
              Go to Dashboard
            </button>
          </div>
        </motion.div>

        {/* Sidebar Insights */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="w-full md:w-80 shrink-0 space-y-6 flex flex-col justify-center"
        >
          {/* Visibility Card */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#14a800]" /> Marketplace Visibility
            </h3>
            
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-black text-zinc-900 dark:text-white">~450</span>
              <span className="text-sm font-semibold text-zinc-500 mb-1">impressions / week</span>
            </div>
            
            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-4">
              <div className="w-[70%] h-full bg-success rounded-full" />
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed font-medium">
              Based on your Gig's quality score and category demand. It may take up to 24 hours to fully index in search.
            </p>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-6 text-white shadow-xl">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" /> How to get your first order
            </h3>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs font-bold text-[#14a800]">1</span></div>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">Share your gig link on LinkedIn and professional networks.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs font-bold text-[#14a800]">2</span></div>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">Stay online. Buyers filter search results by "Online Sellers".</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs font-bold text-[#14a800]">3</span></div>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">Respond to messages within 1 hour to boost your response rate.</p>
              </li>
            </ul>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
