// src/pages/freelancer/GigPricingPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, Check, Plus, Trash2, Zap, BarChart3,
  Target, Info, ArrowUpRight, TrendingUp, Clock, X
} from 'lucide-react';

// Mock Addons Database
const ADDON_SUGGESTIONS = [
  { id: 'a1', title: 'Extra Fast Delivery', price: 4000, days: -1 },
  { id: 'a2', title: 'Additional Revision', price: 1500, days: 1 },
  { id: 'a3', title: 'Source File', price: 2500, days: 0 },
  { id: 'a4', title: 'Commercial Use', price: 5000, days: 0 },
];

export default function GigPricingPage() {
  const [packagesEnabled, setPackagesEnabled] = useState(true);
  const [packages, setPackages] = useState({
    basic: { name: 'Basic', title: '', desc: '', delivery: 3, revisions: 1, price: 5000, features: [true, false, false] },
    standard: { name: 'Standard', title: '', desc: '', delivery: 5, revisions: 3, price: 12000, features: [true, true, false] },
    premium: { name: 'Premium', title: '', desc: '', delivery: 7, revisions: -1, price: 25000, features: [true, true, true] }
  });
  const [addons, setAddons] = useState([]);
  const [showSuccess, setShowSuccess] = useState(null);

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
      return { ...prev, [pkg]: { ...prev[pkg], features: newFeatures } };
    });
  };

  const addAddon = (suggestion) => {
    if (!addons.find(a => a.id === suggestion.id)) {
      setAddons([...addons, { ...suggestion }]);
      setShowSuccess({ message: `Added: ${suggestion.title}` });
      setTimeout(() => setShowSuccess(null), 2000);
    }
  };

  const removeAddon = (id) => {
    setAddons(addons.filter(a => a.id !== id));
    setShowSuccess({ message: 'Add-on removed' });
    setTimeout(() => setShowSuccess(null), 1500);
  };

  const getRevisionText = (revisions) => {
    if (revisions === -1) return 'Unlimited Revisions';
    if (revisions === 0) return '0 Revisions';
    if (revisions === 1) return '1 Revision';
    return `${revisions} Revisions`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Form Area */}
      <div className="flex-1 w-full space-y-6">

        {/* Toggle Packages */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-lg text-brand-900 mb-1">Offer packages</h2>
            <p className="text-sm font-body text-ink-secondary">Offering 3 packages increases your chances of higher-value orders</p>
          </div>
          <div
            onClick={() => setPackagesEnabled(!packagesEnabled)}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 cursor-pointer shrink-0 ${
              packagesEnabled ? "bg-accent DEFAULT" : "bg-border"
            }`}
          >
            <motion.div
              layout
              className="w-4 h-4 bg-white rounded-full shadow-sm"
              animate={{ x: packagesEnabled ? 20 : 0 }}
            />
          </div>
        </div>

        {/* Pricing Table */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">

          {/* Header Row */}
          <div className="grid grid-cols-4 border-b border-border bg-surface-soft">
            <div className="col-span-1 p-5 border-r border-border">
              <h3 className="font-body font-semibold text-ink-primary">Package details</h3>
            </div>

            {['basic', 'standard', 'premium'].map((pkgType, idx) => {
              const isDisabled = !packagesEnabled && pkgType !== 'basic';
              return (
                <div
                  key={pkgType}
                  className={`col-span-1 p-5 text-center relative ${
                    idx !== 2 && "border-r border-border"
                  } ${isDisabled ? "opacity-40" : ""}`}
                >
                  {pkgType === 'standard' && packagesEnabled && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-accent DEFAULT text-white text-xs font-body font-medium px-3 py-0.5 rounded-full">
                      Recommended
                    </div>
                  )}
                  <h4 className={`font-body font-semibold text-base mb-2 ${
                    pkgType === 'basic' ? "text-ink-primary" :
                    pkgType === 'standard' ? "text-accent DEFAULT" : "text-ink-primary"
                  }`}>
                    {packages[pkgType].name}
                  </h4>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-sm font-mono font-medium text-ink-tertiary">KES</span>
                    <input
                      type="number"
                      value={packages[pkgType].price}
                      onChange={(e) => handlePackageChange(pkgType, 'price', parseInt(e.target.value) || 0)}
                      className="w-24 bg-transparent font-mono font-bold text-xl text-ink-primary outline-none text-center focus:ring-2 focus:ring-brand-900 rounded"
                      disabled={isDisabled}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Title & Description Row */}
          <div className="grid grid-cols-4 border-b border-border">
            <div className="col-span-1 p-5 border-r border-border">
              <span className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Title & description</span>
            </div>
            {['basic', 'standard', 'premium'].map((pkgType, idx) => {
              const isDisabled = !packagesEnabled && pkgType !== 'basic';
              return (
                <div key={pkgType} className={`col-span-1 p-4 space-y-3 ${idx !== 2 && "border-r border-border"} ${isDisabled ? "opacity-40" : ""}`}>
                  <input
                    type="text"
                    placeholder="Package name"
                    value={packages[pkgType].title}
                    onChange={(e) => handlePackageChange(pkgType, 'title', e.target.value)}
                    className="w-full h-10 px-3 text-sm font-body bg-white border border-border rounded-lg text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    disabled={isDisabled}
                  />
                  <textarea
                    rows={3}
                    placeholder="Describe what's included..."
                    value={packages[pkgType].desc}
                    onChange={(e) => handlePackageChange(pkgType, 'desc', e.target.value)}
                    className="w-full px-3 py-2 text-sm font-body bg-white border border-border rounded-lg text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none"
                    disabled={isDisabled}
                  />
                </div>
              );
            })}
          </div>

          {/* Features Row */}
          <div className="grid grid-cols-4 border-b border-border">
            <div className="col-span-1 border-r border-border">
              {featureLabels.map((label, i) => (
                <div key={i} className="px-5 py-3 text-sm font-body font-medium text-ink-primary flex items-center h-12 border-b border-border last:border-b-0">
                  {label}
                </div>
              ))}
            </div>

            {['basic', 'standard', 'premium'].map((pkgType, idx) => {
              const isDisabled = !packagesEnabled && pkgType !== 'basic';
              return (
                <div key={pkgType} className={`col-span-1 ${idx !== 2 && "border-r border-border"} ${isDisabled ? "opacity-40" : ""}`}>
                  {packages[pkgType].features.map((feature, fIdx) => (
                    <div key={fIdx} className="px-5 py-3 flex items-center justify-center h-12 border-b border-border last:border-b-0">
                      <input
                        type="checkbox"
                        checked={feature}
                        onChange={() => handleFeatureToggle(pkgType, fIdx)}
                        className="w-4 h-4 text-accent DEFAULT rounded border-border focus:ring-accent DEFAULT cursor-pointer"
                        disabled={isDisabled}
                      />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Delivery & Revisions Row */}
          <div className="grid grid-cols-4 bg-surface-soft">
            <div className="col-span-1 p-5 border-r border-border space-y-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-ink-tertiary" />
                <span className="text-sm font-body font-medium text-ink-primary">Delivery</span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Check className="w-4 h-4 text-ink-tertiary" />
                <span className="text-sm font-body font-medium text-ink-primary">Revisions</span>
              </div>
            </div>
            {['basic', 'standard', 'premium'].map((pkgType, idx) => {
              const isDisabled = !packagesEnabled && pkgType !== 'basic';
              return (
                <div key={pkgType} className={`col-span-1 p-5 space-y-5 ${idx !== 2 && "border-r border-border"} ${isDisabled ? "opacity-40" : ""}`}>
                  <select
                    value={packages[pkgType].delivery}
                    onChange={(e) => handlePackageChange(pkgType, 'delivery', parseInt(e.target.value))}
                    className="w-full h-10 px-3 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    disabled={isDisabled}
                  >
                    <option value={1}>1 day</option>
                    <option value={2}>2 days</option>
                    <option value={3}>3 days</option>
                    <option value={5}>5 days</option>
                    <option value={7}>7 days</option>
                    <option value={14}>14 days</option>
                  </select>

                  <select
                    value={packages[pkgType].revisions}
                    onChange={(e) => handlePackageChange(pkgType, 'revisions', parseInt(e.target.value))}
                    className="w-full h-10 px-3 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    disabled={isDisabled}
                  >
                    <option value={0}>0 revisions</option>
                    <option value={1}>1 revision</option>
                    <option value={2}>2 revisions</option>
                    <option value={3}>3 revisions</option>
                    <option value={-1}>Unlimited revisions</option>
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add-ons Section */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-display font-semibold text-lg text-brand-900 mb-1">Extra services (add-ons)</h2>
            <p className="text-sm font-body text-ink-secondary">Boost your order value by offering additional services</p>
          </div>

          {/* Current Addons */}
          <div className="space-y-2 mb-5">
            <AnimatePresence>
              {addons.map(addon => (
                <motion.div
                  key={addon.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 p-3 bg-surface-soft border border-border rounded-xl"
                >
                  <div className="flex-1">
                    <span className="font-body font-semibold text-sm text-ink-primary">{addon.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-semibold text-ink-primary">KES {addon.price.toLocaleString()}</span>
                    <button
                      onClick={() => removeAddon(addon.id)}
                      className="p-1.5 text-ink-tertiary hover:text-danger transition-colors rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Suggestions */}
          <div>
            <h4 className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-2">
              Suggested add-ons
            </h4>
            <div className="flex flex-wrap gap-2">
              {ADDON_SUGGESTIONS.map(sug => {
                const isAdded = addons.some(a => a.id === sug.id);
                return (
                  <button
                    key={sug.id}
                    onClick={() => addAddon(sug)}
                    disabled={isAdded}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-body font-medium border transition-all disabled:opacity-50 disabled:cursor-not-allowed border-border bg-white text-ink-primary hover:border-accent DEFAULT hover:text-accent DEFAULT"
                  >
                    <Plus className="w-3.5 h-3.5" /> {sug.title} (+KES {sug.price.toLocaleString()})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 shrink-0 space-y-5">

        {/* Pricing Insights */}
        <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-5 text-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-accent-light" />
            <h3 className="font-body font-semibold">Pricing insights</h3>
          </div>

          <h4 className="font-mono font-bold text-2xl mb-1">KES 8,500</h4>
          <p className="text-sm text-accent-light font-body mb-5">Average order value in your category</p>

          <div className="space-y-3">
            <div className="bg-white/10 p-3 rounded-lg border border-white/20">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-light shrink-0 mt-0.5" />
                <p className="text-xs text-white/80 leading-relaxed">
                  Your <span className="font-semibold text-white">Basic (KES 5,000)</span> package is competitively priced
                </p>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-lg border border-white/20">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-accent-light shrink-0 mt-0.5" />
                <p className="text-xs text-white/80 leading-relaxed">
                  Top sellers average <span className="font-semibold text-white">KES 40,000</span> for premium solutions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Market Standards */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-body font-semibold text-ink-primary flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent DEFAULT" /> Market standards
            </h3>
            <span className="text-xs font-body font-medium text-ink-tertiary">Web Dev</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-xs font-body text-ink-secondary">Avg. delivery</span>
              <span className="text-xs font-mono font-semibold text-ink-primary">4 days</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-xs font-body text-ink-secondary">Avg. revisions</span>
              <span className="text-xs font-mono font-semibold text-ink-primary">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-body text-ink-secondary">Top add-on</span>
              <span className="text-xs font-mono font-semibold text-accent DEFAULT">Fast delivery</span>
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="bg-accent-light border border-accent DEFAULT rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-accent-dark" />
            <h3 className="text-sm font-body font-semibold text-accent-dark">Upselling strategy</h3>
          </div>
          <p className="text-xs text-accent-dark leading-relaxed">
            Name your packages creatively (e.g., "Starter, Growth, Scale") to increase premium tier selections.
          </p>
        </div>
      </div>
    </div>
  );
}
