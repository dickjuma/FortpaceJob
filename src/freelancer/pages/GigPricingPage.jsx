import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, Check, Plus, Trash2, Zap, BarChart3, 
  Target, Info, ArrowUpRight, TrendingUp, Clock
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import toast, { Toaster } from 'react-hot-toast';

// Mock Addons Database
const ADDON_SUGGESTIONS = [
  { id: 'a1', title: 'Extra Fast Delivery', price: 4000, days: -1 },
  { id: 'a2', title: 'Additional Revision', price: 1500, days: 1 },
  { id: 'a3', title: 'Source File', price: 2500, days: 0 },
  { id: 'a4', title: 'Commercial Use', price: 5000, days: 0 },
];

export default function GigPricingPage() {
  const [packagesEnabled, setPackagesEnabled] = useState(true);

  // State for the 3 packages
  const [packages, setPackages] = useState({
    basic: { name: 'Basic', title: '', desc: '', delivery: 3, revisions: 1, price: 5000, features: [true, false, false] },
    standard: { name: 'Standard', title: '', desc: '', delivery: 5, revisions: 3, price: 12000, features: [true, true, false] },
    premium: { name: 'Premium', title: '', desc: '', delivery: 7, revisions: -1, price: 25000, features: [true, true, true] }
  });

  const [addons, setAddons] = useState([]);

  const featureLabels = ['Responsive Design', 'Source Code', 'Deployment Setup'];

  const handlePackageChange = (pkg, field, value) => {
    setPackages(prev => ({
      ...prev,
      [pkg]: { ...prev[pkg], [field]: value }
    }));
  };

  const handleFeatureToggle = (pkg, featureIndex) => {
    setPackages(prev => {
      const newFeatures = [...prev[pkg].features];
      newFeatures[featureIndex] = !newFeatures[featureIndex];
      if (newFeatures[featureIndex]) toast.success('Feature enabled');
      return { ...prev, [pkg]: { ...prev[pkg], features: newFeatures } };
    });
  };

  const addAddon = (suggestion) => {
    if (!addons.find(a => a.id === suggestion.id)) {
      setAddons([...addons, { ...suggestion }]);
      toast.success('Add-on applied');
    }
  };

  const removeAddon = (id) => {
    setAddons(addons.filter(a => a.id !== id));
    toast('Add-on removed', { icon: '🗑️' });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full font-sans">
      <Toaster position="top-center" />
      
      {/* Main Form Area */}
      <div className="flex-1 w-full space-y-8">
        
        {/* Toggle 3 Packages */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Offer Packages</h2>
            <p className="text-sm text-zinc-500">Offering 3 packages increases your chances of getting a higher-value order by 64%.</p>
          </div>
          <div 
            onClick={() => setPackagesEnabled(!packagesEnabled)}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative flex items-center p-1 cursor-pointer shrink-0",
              packagesEnabled ? "bg-[#2bb75c]" : "bg-zinc-200 dark:bg-zinc-700"
            )}
          >
            <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-sm" animate={{ x: packagesEnabled ? 24 : 0 }} />
          </div>
        </div>

        {/* Pricing Table / Cards */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          
          {/* Header Row */}
          <div className="grid grid-cols-4 border-b border-zinc-200 dark:border-zinc-800 bg-surface dark:bg-zinc-800/30">
            <div className="col-span-1 p-6 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-end">
              <h3 className="font-bold text-zinc-900 dark:text-white">Package Details</h3>
            </div>
            
            {['basic', 'standard', 'premium'].map((pkgType, idx) => (
              <div key={pkgType} className={cn(
                "col-span-1 p-6 text-center relative transition-all",
                idx !== 2 && "border-r border-zinc-200 dark:border-zinc-800",
                pkgType === 'standard' && packagesEnabled ? "bg-[#2bb75c]/5/50 dark:bg-[#2bb75c]/5" : "",
                !packagesEnabled && pkgType !== 'basic' ? "opacity-30 pointer-events-none grayscale" : ""
              )}>
                {pkgType === 'standard' && packagesEnabled && (
                  <div className="absolute top-0 left-1/2 -tranzinc-x-1/2 bg-[#2bb75c] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-b-lg">
                    Recommended
                  </div>
                )}
                <h4 className={cn(
                  "text-lg font-black uppercase tracking-wide mb-1",
                  pkgType === 'basic' ? "text-zinc-700 dark:text-zinc-300" : pkgType === 'standard' ? "text-[#2bb75c] dark:text-[#2bb75c]" : "text-violet-600 dark:text-violet-400"
                )}>
                  {packages[pkgType].name}
                </h4>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-sm font-bold text-zinc-400">KES</span>
                  <input 
                    type="number" 
                    value={packages[pkgType].price}
                    onChange={(e) => handlePackageChange(pkgType, 'price', e.target.value)}
                    className="w-24 bg-transparent text-2xl font-black text-zinc-900 dark:text-white outline-none text-center"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Inputs Row - Titles & Description */}
          <div className="grid grid-cols-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="col-span-1 p-6 border-r border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-bold text-zinc-500 uppercase">Title & Description</span>
            </div>
            {['basic', 'standard', 'premium'].map((pkgType, idx) => (
              <div key={pkgType} className={cn(
                "col-span-1 p-4 space-y-3",
                idx !== 2 && "border-r border-zinc-200 dark:border-zinc-800",
                pkgType === 'standard' && packagesEnabled ? "bg-[#2bb75c]/5/30 dark:bg-[#2bb75c]/5" : "",
                !packagesEnabled && pkgType !== 'basic' ? "opacity-30 pointer-events-none" : ""
              )}>
                <input 
                  type="text" 
                  placeholder="Name your package"
                  value={packages[pkgType].title}
                  onChange={(e) => handlePackageChange(pkgType, 'title', e.target.value)}
                  className="w-full text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#2bb75c] text-zinc-900 dark:text-white placeholder:text-zinc-400"
                />
                <textarea 
                  rows="4"
                  placeholder="Describe the details of your offering..."
                  value={packages[pkgType].desc}
                  onChange={(e) => handlePackageChange(pkgType, 'desc', e.target.value)}
                  className="w-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#2bb75c] resize-none text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400"
                />
              </div>
            ))}
          </div>

          {/* Features Row */}
          <div className="grid grid-cols-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="col-span-1 border-r border-zinc-200 dark:border-zinc-800">
              {featureLabels.map((label, i) => (
                <div key={i} className={cn("px-6 py-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center h-14", i !== featureLabels.length -1 && "border-b border-zinc-100 dark:border-zinc-800/50")}>
                  {label}
                </div>
              ))}
            </div>
            
            {['basic', 'standard', 'premium'].map((pkgType, idx) => (
              <div key={pkgType} className={cn(
                "col-span-1",
                idx !== 2 && "border-r border-zinc-200 dark:border-zinc-800",
                pkgType === 'standard' && packagesEnabled ? "bg-[#2bb75c]/5/30 dark:bg-[#2bb75c]/5" : "",
                !packagesEnabled && pkgType !== 'basic' ? "opacity-30 pointer-events-none" : ""
              )}>
                {packages[pkgType].features.map((feature, fIdx) => (
                  <div key={fIdx} className={cn("px-6 py-4 flex items-center justify-center h-14", fIdx !== packages[pkgType].features.length -1 && "border-b border-zinc-100 dark:border-zinc-800/50")}>
                    <input 
                      type="checkbox" 
                      checked={feature}
                      onChange={() => handleFeatureToggle(pkgType, fIdx)}
                      className="w-5 h-5 text-[#2bb75c] rounded border-zinc-300 focus:ring-[#2bb75c] cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Delivery & Revisions Row */}
          <div className="grid grid-cols-4 bg-surface dark:bg-zinc-800/30">
            <div className="col-span-1 p-6 border-r border-zinc-200 dark:border-zinc-800 space-y-8">
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2"><Clock className="w-4 h-4 text-zinc-400" /> Delivery Time</span>
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2 pt-2"><Check className="w-4 h-4 text-zinc-400" /> Revisions</span>
            </div>
            {['basic', 'standard', 'premium'].map((pkgType, idx) => (
              <div key={pkgType} className={cn(
                "col-span-1 p-6 space-y-6",
                idx !== 2 && "border-r border-zinc-200 dark:border-zinc-800",
                pkgType === 'standard' && packagesEnabled ? "bg-[#2bb75c]/5/50 dark:bg-[#2bb75c]/10" : "",
                !packagesEnabled && pkgType !== 'basic' ? "opacity-30 pointer-events-none" : ""
              )}>
                <select 
                  value={packages[pkgType].delivery}
                  onChange={(e) => handlePackageChange(pkgType, 'delivery', parseInt(e.target.value))}
                  className="w-full p-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-bold text-zinc-900 dark:text-white outline-none focus:border-[#2bb75c]/20"
                >
                  <option value={1}>1 Day Delivery</option>
                  <option value={2}>2 Days Delivery</option>
                  <option value={3}>3 Days Delivery</option>
                  <option value={5}>5 Days Delivery</option>
                  <option value={7}>7 Days Delivery</option>
                  <option value={14}>14 Days Delivery</option>
                </select>

                <select 
                  value={packages[pkgType].revisions}
                  onChange={(e) => handlePackageChange(pkgType, 'revisions', parseInt(e.target.value))}
                  className="w-full p-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-bold text-zinc-900 dark:text-white outline-none focus:border-[#2bb75c]/20 mt-2"
                >
                  <option value={0}>0 Revisions</option>
                  <option value={1}>1 Revision</option>
                  <option value={2}>2 Revisions</option>
                  <option value={3}>3 Revisions</option>
                  <option value={-1}>Unlimited Revisions</option>
                </select>
              </div>
            ))}
          </div>

        </div>

        {/* Add-ons Section */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Extra Services (Add-ons)</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Boost your order value by offering additional services.
              </p>
            </div>
          </div>

          {/* Current Addons */}
          <div className="space-y-3 mb-6">
            <AnimatePresence>
              {addons.map(addon => (
                <motion.div 
                  key={addon.id}
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-4 p-4 bg-surface dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl"
                >
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={addon.title} 
                      readOnly
                      className="bg-transparent font-bold text-zinc-900 dark:text-white outline-none w-full"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-500 font-semibold">For an extra</span>
                      <div className="flex items-center bg-white dark:bg-surface-dark px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <span className="text-zinc-400 font-bold">KES</span>
                        <input type="number" value={addon.price} readOnly className="w-16 bg-transparent text-sm font-bold outline-none text-center ml-1" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-500 font-semibold">and an additional</span>
                      <select disabled className="bg-white dark:bg-surface-dark px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-bold outline-none">
                        <option>{addon.days < 0 ? 'Reduces time' : `${addon.days} Days`}</option>
                      </select>
                    </div>
                    <button onClick={() => removeAddon(addon.id)} className="p-2 text-zinc-400 hover:text-rose-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Suggestions */}
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Suggested Add-ons</h4>
            <div className="flex flex-wrap gap-2">
              {ADDON_SUGGESTIONS.map(sug => {
                const isAdded = addons.some(a => a.id === sug.id);
                return (
                  <button 
                    key={sug.id}
                    onClick={() => addAddon(sug)}
                    disabled={isAdded}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all disabled:opacity-50 disabled:cursor-not-allowed border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-[#2bb75c]/20 hover:text-[#2bb75c]"
                  >
                    <Plus className="w-4 h-4" /> {sug.title} (+KES {sug.price})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Sidebar - Analytics & Insights */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
        
        {/* Pricing Recommendation Widget */}
        <div className="bg-gradient-to-br from-[#2bb75c] to-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-[#2bb75c]/25/20">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-[#2bb75c]" />
            <h3 className="font-bold text-[#2bb75c]">Pricing Insights</h3>
          </div>
          
          <h4 className="text-3xl font-black mb-1">KES 8,500</h4>
          <p className="text-sm text-[#2bb75c] font-semibold mb-6">Average order value in your category</p>
          
          <div className="space-y-4">
            <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex items-start gap-3">
              <Check className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed text-[#2bb75c] font-medium">Your <span className="font-bold text-white">Basic (KES 5000)</span> package is competitively priced to attract new buyers.</p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex items-start gap-3">
              <TrendingUp className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed text-[#2bb75c] font-medium">Consider raising your <span className="font-bold text-white">Premium (KES 25000)</span> package. Top sellers average KES 40000 for full solutions.</p>
            </div>
          </div>
        </div>

        {/* Competitor Insights Box */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#2bb75c]" /> Market Standard
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Web Dev</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-semibold text-zinc-500">Avg. Delivery</span>
              <span className="text-xs font-bold text-zinc-900 dark:text-white">4 Days</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-semibold text-zinc-500">Avg. Revisions</span>
              <span className="text-xs font-bold text-zinc-900 dark:text-white">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-zinc-500">Top Add-on</span>
              <span className="text-xs font-bold text-success dark:text-success">Extra Fast</span>
            </div>
          </div>
        </div>

        {/* Tips Box */}
        <div className="bg-[#2bb75c]/5 dark:bg-[#2bb75c]/10 rounded-3xl border border-[#2bb75c]/20 dark:border-[#2bb75c]/20/30 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-[#2bb75c]" />
            <h3 className="text-sm font-bold text-[#2bb75c] dark:text-[#2bb75c]">Upselling Strategy</h3>
          </div>
          <p className="text-xs text-[#2bb75c] dark:text-[#2bb75c] leading-relaxed">
            Name your packages creatively (e.g. "Silver, Gold, Platinum" or "Starter, Growth, Scale"). It builds brand value and increases Standard/Premium tier selections.
          </p>
        </div>

      </div>

    </div>
  );
}

