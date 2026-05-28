import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, TrendingUp, Eye, MousePointerClick, 
  Target, Zap, CheckCircle2, ChevronRight, DollarSign, Activity
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const PACKAGES = [
  {
    id: 'search',
    name: 'Search Boost',
    description: 'Appear at the top of relevant search results.',
    icon: SearchIcon,
    basePrice: 5, // per day
    estImpressions: '2.5k',
    estClicks: '150',
    color: 'bg-brand-500',
    lightColor: 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400'
  },
  {
    id: 'category',
    name: 'Category Spotlight',
    description: 'Featured placement in your primary category.',
    icon: Target,
    basePrice: 8,
    estImpressions: '4k',
    estClicks: '280',
    color: 'bg-brand-500',
    lightColor: 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400'
  },
  {
    id: 'home',
    name: 'Homepage Feature',
    description: 'Premium visibility on the client homepage.',
    icon: Rocket,
    basePrice: 15,
    estImpressions: '10k+',
    estClicks: '800+',
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
  }
];

function SearchIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  );
}

export default function FreelancerBoostProfilePage() {
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES[1]);
  const [duration, setDuration] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalPrice = selectedPkg.basePrice * duration;

  const handlePromote = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface dark:bg-surface-dark flex flex-col items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-xl text-center max-w-sm">
          <div className="w-20 h-20 bg-brand-100 dark:bg-brand-500/20 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Campaign Active!</h2>
          <p className="text-zinc-500 mb-8 font-medium">Your {selectedPkg.name} campaign is now running for {duration} days.</p>
          <button onClick={() => setIsSuccess(false)} className="w-full py-3 bg-surface-dark dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl">
            View Analytics
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
            <Rocket className="w-8 h-8 text-brand-500" /> Boost Your Profile
          </h1>
          <p className="text-zinc-500 font-medium">Get in front of more clients and multiply your earnings.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Analytics & Packages */}
        <div className="flex-1 space-y-8">
          
          {/* Visibility Score */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-50 dark:bg-brand-500/5 rounded-full blur-2xl"></div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Visibility Score</p>
              <h3 className="text-4xl font-black text-zinc-900 dark:text-white mb-2">72<span className="text-lg text-zinc-400 font-bold">/100</span></h3>
              <p className="text-sm font-medium text-brand-600 dark:text-brand-400 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> Top 15% in your category
              </p>
            </div>
            
            <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center"><Eye className="w-4 h-4" /></div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Weekly Views</p>
              </div>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-1">1,204</h3>
              <p className="text-xs font-bold text-success">+12% vs last week</p>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center"><MousePointerClick className="w-4 h-4" /></div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Conversion Rate</p>
              </div>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-1">4.8%</h3>
              <p className="text-xs font-bold text-success">+1.2% vs last week</p>
            </div>
          </section>

          {/* Promotion Packages */}
          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Select a Promotion Package</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PACKAGES.map(pkg => {
                const Icon = pkg.icon;
                const isSelected = selectedPkg.id === pkg.id;
                
                return (
                  <div 
                    key={pkg.id}
                    onClick={() => setSelectedPkg(pkg)}
                    className={cn(
                      "rounded-3xl p-6 border-2 cursor-pointer transition-all relative overflow-hidden group",
                      isSelected ? "border-brand-500 bg-white dark:bg-surface-dark shadow-lg shadow-brand-500/10" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface-dark hover:border-brand-200"
                    )}
                  >
                    {isSelected && <div className="absolute top-0 inset-x-0 h-1 bg-brand-500" />}
                    
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors", pkg.lightColor)}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{pkg.name}</h3>
                    <p className="text-sm font-medium text-zinc-500 h-10 mb-6">{pkg.description}</p>
                    
                    <div className="flex items-end gap-1 mb-6">
                      <span className="text-2xl font-black text-zinc-900 dark:text-white">${pkg.basePrice}</span>
                      <span className="text-sm font-bold text-zinc-400 mb-1">/ day</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold text-zinc-400">Est. Impressions</span>
                        <span className="font-bold text-zinc-900 dark:text-white">{pkg.estImpressions}/d</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold text-zinc-400">Est. Clicks</span>
                        <span className="font-bold text-zinc-900 dark:text-white">{pkg.estClicks}/d</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute top-6 right-6 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center text-white">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Active Campaigns Demo */}
          <section className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-success" /> Active Campaigns
            </h2>
            <div className="text-center py-12 text-zinc-400 font-medium">
              No active campaigns at the moment.
            </div>
          </section>

        </div>

        {/* Right Column: Checkout & Forecast */}
        <div className="w-full lg:w-[360px] shrink-0">
          <div className="sticky top-8 bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden">
            
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-surface/50 dark:bg-surface-dark/50">
              <h3 className="font-bold text-zinc-900 dark:text-white text-lg">Campaign Builder</h3>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Duration Slider */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Duration</label>
                  <span className="text-sm font-black text-brand-600 bg-brand-50 dark:bg-brand-500/10 px-2 py-1 rounded-lg">{duration} Days</span>
                </div>
                <input 
                  type="range" min="1" max="14" value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
                <div className="flex justify-between text-xs font-bold text-zinc-400 mt-2">
                  <span>1d</span>
                  <span>14d</span>
                </div>
              </div>

              {/* Forecast */}
              <div className="bg-brand-50 dark:bg-brand-500/10 rounded-2xl p-4 border border-brand-100 dark:border-brand-500/20">
                <h4 className="text-xs font-bold text-brand-800 dark:text-brand-400 uppercase tracking-wider mb-3">Total Forecast</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2"><Eye className="w-4 h-4 text-brand-500" /> Impressions</span>
                    <span className="text-sm font-black text-zinc-900 dark:text-white">
                      {(parseInt(selectedPkg.estImpressions) * duration)}{selectedPkg.estImpressions.includes('k') ? 'k' : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2"><MousePointerClick className="w-4 h-4 text-brand-500" /> Clicks</span>
                    <span className="text-sm font-black text-zinc-900 dark:text-white">
                      {(parseInt(selectedPkg.estClicks) * duration)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-zinc-500">{selectedPkg.name} ({duration} days)</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">${totalPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-zinc-500">Taxes</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">$0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-4">
                <span className="text-sm font-bold text-zinc-900 dark:text-white">Total</span>
                <span className="text-3xl font-black text-zinc-900 dark:text-white">${totalPrice}</span>
              </div>

              <button 
                onClick={handlePromote}
                disabled={isProcessing}
                className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isProcessing ? 'Processing...' : 'Pay & Launch Campaign'}
              </button>
              
              <p className="text-xs text-center text-zinc-400 font-medium">Charged to your freelancer wallet balance.</p>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
