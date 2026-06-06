// GigPurchaseScreen.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, CreditCard, ChevronRight, Package, Clock } from 'lucide-react';
import CheckoutFeeBreakdown from '../../components/payments/CheckoutFeeBreakdown';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function GigPurchaseScreen({ gigTitle = "Full-Stack MVP Development", freelancerName = "Sarah Jenkins" }) {
  const [selectedPackage, setSelectedPackage] = useState('standard');

  const packages = {
    basic: { price: 1500, delivery: '14 days', revisions: 2, features: ['Backend API', 'Basic Frontend', 'Database Setup'] },
    standard: { price: 3000, delivery: '21 days', revisions: 4, features: ['Backend API', 'Premium Frontend', 'Database Setup', 'Authentication', 'Admin Panel'] },
    premium: { price: 5000, delivery: '30 days', revisions: 'Unlimited', features: ['Backend API', 'Premium Frontend', 'Database Setup', 'Authentication', 'Admin Panel', 'App Store Deployment', '6 Months Support'] }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };
  const buttonTap = { scale: 0.97 };
  const cardHover = {
    rest: { y: 0, boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    hover: { y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-surface-soft font-body py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column: Scope & Package Selection */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div variants={itemVariants}>
              <h1 className="font-display text-3xl font-bold text-brand-900 mb-1">Purchase: {gigTitle}</h1>
              <p className="text-ink-secondary">By {freelancerName} • Top Rated Plus</p>
            </motion.div>

            {/* Package Selection Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-border">
                <h2 className="font-display text-xl font-bold flex items-center gap-2 text-brand-900">
                  <Package className="w-5 h-5 text-accent" /> Select Package
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3">
                {Object.entries(packages).map(([key, pkg]) => (
                  <div
                    key={key}
                    onClick={() => setSelectedPackage(key)}
                    className={cn(
                      "p-5 cursor-pointer transition-all",
                      selectedPackage === key
                        ? "bg-accent-light border-l-0 md:border-l border-accent/20"
                        : "hover:bg-surface-soft",
                      "border-b md:border-b-0 md:border-r border-border last:border-r-0"
                    )}
                  >
                    <h3 className="font-display text-lg font-bold capitalize text-brand-900 mb-1">
                      {key}
                    </h3>
                    <div className="text-2xl font-bold text-accent mb-3">${pkg.price.toLocaleString()}</div>
                    <div className="space-y-2 text-sm text-ink-tertiary">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {pkg.delivery} Delivery
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> {pkg.revisions} Revisions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Features Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm"
            >
              <h2 className="font-display text-xl font-bold text-brand-900 mb-4">
                Included in {selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)} Package
              </h2>
              <ul className="space-y-3">
                {packages[selectedPackage].features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-ink-primary text-sm">
                    <Check className="w-4 h-4 text-accent shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div className="space-y-6">
            <motion.div
              variants={itemVariants}
              whileHover={cardHover.hover}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm sticky top-6"
            >
              <h2 className="font-display text-xl font-bold text-brand-900 mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-ink-secondary text-sm">
                  <span className="capitalize">{selectedPackage} Package</span>
                  <span className="font-medium text-ink-primary">${packages[selectedPackage].price.toLocaleString()}</span>
                </div>
                <CheckoutFeeBreakdown
                  subtotal={packages[selectedPackage].price}
                  appliesTo="HIRE_COMMITMENT"
                />
                <div className="pt-4 border-t border-border flex justify-between mt-3">
                  <span className="font-semibold text-ink-primary">Total (vaulted)</span>
                  <span className="font-bold text-lg text-ink-primary">
                    ${packages[selectedPackage].price.toLocaleString()}
                  </span>
                </div>
              </div>

              <motion.button
                whileTap={buttonTap}
                className="w-full py-3.5 bg-accent hover:bg-accent-dark text-white rounded-xl font-semibold text-base transition-colors flex justify-center items-center gap-2 shadow-sm mb-4"
              >
                Fund Escrow & Start <ChevronRight className="w-5 h-5" />
              </motion.button>

              <div className="flex items-start gap-3 p-4 bg-accent-light rounded-xl border border-accent/20">
                <ShieldCheck className="w-5 h-5 text-accent-dark shrink-0 mt-0.5" />
                <p className="text-xs text-accent-dark">
                  Payment is held securely in escrow and only released when you approve the delivered milestones.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
