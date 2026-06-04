import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, Check, ChevronRight, 
  ChevronLeft, Calculator, Target, Sparkles,
  BarChart3, ShieldCheck
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { loadOnboardingDraft, saveOnboardingDraft } from '../utils/onboardingDraft';

const STEPS = ['Account', 'Role', 'Skills', 'Experience', 'Availability', 'Rate', 'Done'];

const CURRENCIES = [
  { id: 'USD', symbol: '$', label: 'US Dollar' },
  { id: 'EUR', symbol: '€', label: 'Euro' },
  { id: 'GBP', symbol: '£', label: 'British Pound' },
];

export default function RateSetupPage() {
  const navigate = useNavigate();
  const onboardingDraft = loadOnboardingDraft();
  const [hourlyRate, setHourlyRate] = useState(onboardingDraft.hourlyRate || 65);
  const [currency, setCurrency] = useState(onboardingDraft.currency || 'USD');
  const [acceptsFixed, setAcceptsFixed] = useState(
    typeof onboardingDraft.acceptsFixed === 'boolean' ? onboardingDraft.acceptsFixed : true
  );
  const [targetHours, setTargetHours] = useState(onboardingDraft.targetHours || 30);

  // Keep the fee preview aligned with the current marketplace service fee.
  const platformFee = hourlyRate * 0.1;
  const netRate = hourlyRate - platformFee;
  const estimatedMonthly = netRate * targetHours * 4;

  const currentSymbol = CURRENCIES.find(c => c.id === currency)?.symbol || '$';

  const chartData = [
    { name: 'Start', rate: Math.max(10, hourlyRate - 20), market: hourlyRate + 10 },
    { name: 'Now', rate: hourlyRate, market: hourlyRate + 5 },
    { name: 'Target', rate: hourlyRate + 15, market: hourlyRate + 20 },
  ];

  useEffect(() => {
    saveOnboardingDraft({
      hourlyRate,
      currency,
      acceptsFixed,
      targetHours,
    });
  }, [acceptsFixed, currency, hourlyRate, targetHours]);

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans selection:bg-[#2bb75c]/30 overflow-x-hidden">
      
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-[#2bb75c]/10 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen pb-24">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#2bb75c] rounded-xl flex items-center justify-center shadow-lg shadow-[#2bb75c]/25/30">
              <DollarSign className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">ForteSpace</span>
          </motion.div>
        </div>

        {/* Progress Stepper */}
        <div className="w-full max-w-5xl mx-auto px-4 mb-8">
          <div className="flex items-center justify-center gap-0">
            {STEPS.map((step, idx) => {
              const isCompleted = idx < 5;
              const isCurrent = idx === 5;
              const isLast = idx === STEPS.length - 1;
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-1">
                    <motion.div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
                        isCompleted ? "bg-[#2bb75c] text-white" : isCurrent ? "bg-[#2bb75c] text-white ring-4 ring-#2bb75c]/20 scale-110" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                      )}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                    </motion.div>
                    <span className={cn("text-[10px] font-bold uppercase tracking-wide hidden sm:block", isCurrent ? "text-[#2bb75c]" : isCompleted ? "text-zinc-500" : "text-zinc-400")}>
                      {step}
                    </span>
                  </div>
                  {!isLast && <div className={cn("h-[2px] w-4 sm:w-10 mx-1 rounded-full", isCompleted ? "bg-[#2bb75c]" : "bg-zinc-200 dark:bg-zinc-800")} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
              Set your <span className="bg-gradient-to-r from-[#2bb75c] to-violet-600 bg-clip-text text-transparent">hourly rate</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
              Clients will see this rate on your profile. You can always negotiate prices on a per-project basis.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Column - Inputs */}
            <div className="w-full lg:w-[45%] space-y-6">
              
              {/* Main Rate Input */}
              <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Your Profile Rate</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-4xl font-black text-zinc-900 dark:text-white">{currentSymbol}{hourlyRate}</span>
                      <span className="text-lg font-bold text-zinc-400">/hr</span>
                    </div>
                  </div>
                  <select 
                    value={currency} 
                    onChange={e => setCurrency(e.target.value)}
                    className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 py-2 pl-3 pr-8 focus:ring-2 focus:ring-[#2bb75c] cursor-pointer"
                  >
                    {CURRENCIES.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                  </select>
                </div>

                <input 
                  type="range" 
                  min="5" max="250" step="5"
                  value={hourlyRate} 
                  onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                  className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-600 mb-8"
                />

                {/* Fee Breakdown */}
                <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-zinc-500">Client sees:</span>
                    <span className="font-bold text-zinc-900 dark:text-white">{currentSymbol}{hourlyRate.toFixed(2)} /hr</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-zinc-500 flex items-center gap-1">
                      Forte Service Fee (10%) <ShieldCheck className="w-3.5 h-3.5 text-[#2bb75c]" />
                    </span>
                    <span className="font-bold text-rose-500">-{currentSymbol}{platformFee.toFixed(2)} /hr</span>
                  </div>
                  <div className="flex justify-between items-center text-base p-4 bg-surface dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700">
                    <span className="font-bold text-zinc-900 dark:text-white">You'll receive:</span>
                    <span className="font-black text-[#2bb75c]">{currentSymbol}{netRate.toFixed(2)} <span className="text-sm text-[#2bb75c]/70">/hr</span></span>
                  </div>
                </div>
              </div>

              {/* Fixed Price Toggle */}
              <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm flex items-center justify-between cursor-pointer hover:border-[#2bb75c]/50 transition-colors" onClick={() => setAcceptsFixed(!acceptsFixed)}>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1 flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#2bb75c]" /> Accept Fixed-Price Projects
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-[250px]">Allow clients to offer a flat rate for entire projects instead of hourly billing.</p>
                </div>
                <div className={cn(
                  "w-12 h-6 rounded-full transition-colors relative flex items-center p-1",
                  acceptsFixed ? "bg-[#2bb75c]" : "bg-zinc-200 dark:bg-zinc-700"
                )}>
                  <motion.div 
                    layout 
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                    initial={false}
                    animate={{ x: acceptsFixed ? 24 : 0 }}
                  />
                </div>
              </div>

            </div>

            {/* Right Column - Analytics & Insights */}
            <div className="flex-1 w-full space-y-6">
              
              {/* AI Recommendation */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#2bb75c] to-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-[#2bb75c]/25/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Pricing Guidance
                  </div>
                  <BarChart3 className="w-6 h-6 text-white/50" />
                </div>
                <h3 className="text-2xl font-black mb-2">Suggested Range: {currentSymbol}75 - {currentSymbol}95</h3>
                <p className="text-[#2bb75c] text-sm leading-relaxed mb-6">
                  This estimate uses common marketplace pricing patterns for mid-market technical profiles. Adjust it to match your real experience and demand.
                </p>
                
                {hourlyRate < 75 ? (
                  <div className="p-3 bg-white/10 rounded-xl text-sm font-semibold flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-yellow-300 shrink-0" />
                    <span>Your rate is below market average. Consider raising it to attract higher-quality clients.</span>
                  </div>
                ) : hourlyRate > 95 ? (
                  <div className="p-3 bg-white/10 rounded-xl text-sm font-semibold flex items-start gap-3">
                    <Target className="w-5 h-5 text-emerald-300 shrink-0" />
                    <span>Your rate represents premium tier. Make sure your portfolio reflects this quality.</span>
                  </div>
                ) : (
                  <div className="p-3 bg-white/10 rounded-xl text-sm font-semibold flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-300 shrink-0" />
                    <span>Your rate is perfectly aligned with the market average. Great choice!</span>
                  </div>
                )}
              </motion.div>

              {/* Market Trend Chart */}
              <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-6">Demand Trend for your Skills</h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="market" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Earnings Calculator */}
              <div className="bg-surface-dark rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2bb75c]/20 rounded-bl-full pointer-events-none" />
                <div className="flex items-center gap-2 mb-6">
                  <Calculator className="w-5 h-5 text-[#2bb75c]" />
                  <h3 className="text-sm font-bold">Earnings Goal Calculator</h3>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center text-xs font-semibold text-zinc-400 mb-2">
                    <span>Target Hours: {targetHours} hrs/week</span>
                  </div>
                  <input 
                    type="range" min="5" max="60" step="5"
                    value={targetHours} onChange={(e) => setTargetHours(parseInt(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-#2bb75c]"
                  />
                </div>

                <div className="pt-4 border-t border-zinc-800 flex justify-between items-end">
                  <div>
                    <p className="text-xs font-semibold text-zinc-400 mb-1">Estimated Monthly Net</p>
                    <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#2bb75c] to-violet-400">
                      {currentSymbol}{estimatedMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">Based on full utilization</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md z-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button 
              onClick={() => navigate('/auth/profile-completion')}
              className="flex items-center gap-2 px-8 py-3 bg-surface-dark dark:bg-white text-white dark:text-zinc-900 hover:bg-[#2bb75c] dark:hover:bg-[#2bb75c] hover:text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-[#2bb75c]/25/25 transition-all"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

