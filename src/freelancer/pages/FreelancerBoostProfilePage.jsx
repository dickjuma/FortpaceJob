// src/pages/freelancer/FreelancerBoostProfilePage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, TrendingUp, Eye, MousePointerClick,
  Target, Zap, CheckCircle2, ChevronRight, DollarSign, Activity, Check
} from 'lucide-react';
import { useBoostProfile } from '../services/freelancerHooks';

const PACKAGES = [
  {
    id: 'search',
    name: 'Search Boost',
    description: 'Appear at the top of relevant search results',
    icon: Eye,
    basePrice: 5,
    estImpressions: '2.5k',
    estClicks: '150',
    color: 'accent'
  },
  {
    id: 'category',
    name: 'Category Spotlight',
    description: 'Featured placement in your primary category',
    icon: Target,
    basePrice: 8,
    estImpressions: '4k',
    estClicks: '280',
    color: 'accent'
  },
  {
    id: 'home',
    name: 'Homepage Feature',
    description: 'Premium visibility on the client homepage',
    icon: Rocket,
    basePrice: 15,
    estImpressions: '10k+',
    estClicks: '800+',
    color: 'warn'
  }
];

export default function FreelancerBoostProfilePage() {
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES[0]);
  const [duration, setDuration] = useState(7);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);
  
  const boostProfile = useBoostProfile();

  const totalPrice = selectedPkg.basePrice * duration;

  const handlePromote = () => {
    boostProfile.mutate({ packageId: selectedPkg.id, duration, totalPrice }, {
      onSuccess: () => {
        setIsSuccess(true);
        setShowSuccess({ message: 'Campaign launched successfully' });
        setTimeout(() => setShowSuccess(null), 3000);
      }
    });
  };

  const handleViewAnalytics = () => {
    setIsSuccess(false);
    // Navigate to analytics page in a real app
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface-soft flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm border border-border"
        >
          <div className="w-20 h-20 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-5">
            <Rocket className="w-10 h-10 text-accent DEFAULT" />
          </div>
          <h2 className="font-display font-bold text-2xl text-brand-900 mb-2">Campaign active!</h2>
          <p className="text-ink-secondary font-body mb-6">
            Your {selectedPkg.name} campaign is now running for {duration} days
          </p>
          <button
            onClick={handleViewAnalytics}
            className="w-full px-5 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900"
          >
            View analytics
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-surface-soft pb-16"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent-light rounded-xl">
              <Rocket className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Boost your profile</h1>
          </div>
          <p className="text-ink-secondary font-body">Get in front of more clients and multiply your earnings</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">

        {/* Left Column */}
        <div className="flex-1 space-y-6">

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent-light rounded-full blur-2xl opacity-30" />
              <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-2">
                Visibility score
              </p>
              <h3 className="font-mono font-semibold text-3xl text-ink-primary mb-1">
                72<span className="text-base text-ink-tertiary">/100</span>
              </h3>
              <p className="text-sm font-body font-medium text-accent DEFAULT flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> Top 15% in category
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center">
                  <Eye className="w-4 h-4 text-accent DEFAULT" />
                </div>
                <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Weekly views</p>
              </div>
              <h3 className="font-mono font-semibold text-2xl text-ink-primary mb-1">1,204</h3>
              <p className="text-xs font-body font-semibold text-accent DEFAULT">+12% vs last week</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center">
                  <MousePointerClick className="w-4 h-4 text-accent DEFAULT" />
                </div>
                <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Conversion rate</p>
              </div>
              <h3 className="font-mono font-semibold text-2xl text-ink-primary mb-1">4.8%</h3>
              <p className="text-xs font-body font-semibold text-accent DEFAULT">+1.2% vs last week</p>
            </motion.div>
          </div>

          {/* Packages */}
          <div>
            <h2 className="font-display font-semibold text-xl text-brand-900 mb-5">Select a promotion package</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PACKAGES.map((pkg, idx) => {
                const Icon = pkg.icon;
                const isSelected = selectedPkg.id === pkg.id;
                const isHighlight = pkg.color === 'warn';

                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedPkg(pkg)}
                    className={`rounded-2xl p-5 border-2 cursor-pointer transition-all relative overflow-hidden ${
                      isSelected
                        ? `border-accent DEFAULT bg-accent-light`
                        : `border-border bg-white hover:border-border-strong`
                    }`}
                  >
                    {isSelected && <div className="absolute top-0 inset-x-0 h-1 bg-accent DEFAULT" />}

                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      isHighlight ? 'bg-warn-light' : 'bg-accent-light'
                    }`}>
                      <Icon className={`w-5 h-5 ${isHighlight ? 'text-warn' : 'text-accent DEFAULT'}`} />
                    </div>

                    <h3 className="font-body font-semibold text-lg text-ink-primary mb-1">{pkg.name}</h3>
                    <p className="text-sm font-body text-ink-secondary mb-4">{pkg.description}</p>

                    <div className="flex items-end gap-1 mb-4">
                      <span className="font-mono font-bold text-2xl text-ink-primary">KES {pkg.basePrice}</span>
                      <span className="text-sm font-body text-ink-tertiary mb-1">/ day</span>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-body text-ink-tertiary">Est. impressions</span>
                        <span className="font-mono font-semibold text-ink-primary">{pkg.estImpressions}/d</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-body text-ink-tertiary">Est. clicks</span>
                        <span className="font-mono font-semibold text-ink-primary">{pkg.estClicks}/d</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute top-5 right-5 w-5 h-5 bg-accent DEFAULT rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Active Campaigns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-border rounded-2xl p-6 shadow-sm"
          >
            <h2 className="font-display font-semibold text-lg text-brand-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent DEFAULT" />
              Active campaigns
            </h2>
            <div className="text-center py-10">
              <p className="text-ink-tertiary font-body">No active campaigns at the moment</p>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Checkout */}
        <div className="w-full lg:w-96 shrink-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="sticky top-8 bg-white border border-border rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-5 border-b border-border bg-surface-soft">
              <h3 className="font-display font-semibold text-lg text-brand-900">Campaign builder</h3>
            </div>

            <div className="p-5 space-y-5">

              {/* Duration Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-body font-medium text-ink-primary">Duration</label>
                  <span className="text-sm font-mono font-semibold text-accent DEFAULT bg-accent-light px-2 py-0.5 rounded">
                    {duration} days
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent DEFAULT"
                />
                <div className="flex justify-between text-xs font-mono text-ink-tertiary mt-2">
                  <span>1d</span>
                  <span>7d</span>
                  <span>14d</span>
                </div>
              </div>

              {/* Forecast */}
              <div className="bg-accent-light rounded-xl p-4 border border-accent DEFAULT">
                <h4 className="text-xs font-body font-semibold text-accent-dark uppercase tracking-wide mb-3">
                  Total forecast
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-body text-ink-secondary flex items-center gap-2">
                      <Eye className="w-4 h-4 text-accent DEFAULT" /> Impressions
                    </span>
                    <span className="text-sm font-mono font-semibold text-ink-primary">
                      {selectedPkg.estImpressions.includes('k')
                        ? `${parseInt(selectedPkg.estImpressions) * duration}k`
                        : `${parseInt(selectedPkg.estImpressions) * duration}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-body text-ink-secondary flex items-center gap-2">
                      <MousePointerClick className="w-4 h-4 text-accent DEFAULT" /> Clicks
                    </span>
                    <span className="text-sm font-mono font-semibold text-ink-primary">
                      {parseInt(selectedPkg.estClicks) * duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-body text-ink-secondary">{selectedPkg.name} ({duration} days)</span>
                  <span className="text-sm font-mono font-semibold text-ink-primary">KES {totalPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-body text-ink-secondary">Taxes</span>
                  <span className="text-sm font-mono font-semibold text-ink-primary">KES 0</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-2">
                <span className="text-base font-body font-semibold text-ink-primary">Total</span>
                <span className="font-mono font-bold text-2xl text-brand-900">KES {totalPrice}</span>
              </div>

              <button
                onClick={handlePromote}
                disabled={boostProfile.isPending}
                className="w-full py-3 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-semibold text-sm transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {boostProfile.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Pay & launch campaign'
                )}
              </button>

              <p className="text-xs text-center text-ink-tertiary font-body">
                Charged to your wallet balance
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
