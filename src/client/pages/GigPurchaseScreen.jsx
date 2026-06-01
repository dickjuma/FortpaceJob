import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, CreditCard, ChevronRight, Package, Clock } from 'lucide-react';
import CheckoutFeeBreakdown from '../../components/payments/CheckoutFeeBreakdown';

export default function GigPurchaseScreen({ gigTitle = "Full-Stack MVP Development", freelancerName = "Sarah Jenkins" }) {
  const [selectedPackage, setSelectedPackage] = useState('standard');

  const packages = {
    basic: { price: 1500, delivery: '14 days', revisions: 2, features: ['Backend API', 'Basic Frontend', 'Database Setup'] },
    standard: { price: 3000, delivery: '21 days', revisions: 4, features: ['Backend API', 'Premium Frontend', 'Database Setup', 'Authentication', 'Admin Panel'] },
    premium: { price: 5000, delivery: '30 days', revisions: 'Unlimited', features: ['Backend API', 'Premium Frontend', 'Database Setup', 'Authentication', 'Admin Panel', 'App Store Deployment', '6 Months Support'] }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans bg-surface dark:bg-gray-950 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Scope & Package Selection */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Purchase: {gigTitle}</h1>
            <p className="text-gray-500 dark:text-gray-400">By {freelancerName} • Top Rated Plus</p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold flex items-center">
                <Package className="w-5 h-5 mr-2 text-[#14a800]" /> Select Package
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800">
              {Object.entries(packages).map(([key, pkg]) => (
                <div 
                  key={key} 
                  onClick={() => setSelectedPackage(key)}
                  className={`p-6 cursor-pointer transition-colors ${selectedPackage === key ? 'bg-[#14a800]/5 dark:bg-[#14a800]/20' : 'hover:bg-surface dark:hover:bg-gray-800/50'}`}
                >
                  <h3 className="text-lg font-bold capitalize text-gray-900 dark:text-white mb-2">{key}</h3>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">${pkg.price.toLocaleString()}</div>
                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center"><Clock className="w-4 h-4 mr-2" /> {pkg.delivery} Delivery</div>
                    <div className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2" /> {pkg.revisions} Revisions</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Included in {selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)} Package</h2>
            <ul className="space-y-3">
              {packages[selectedPackage].features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-gray-700 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3 shrink-0" /> {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm sticky top-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)} Package</span>
                <span className="font-medium text-gray-900 dark:text-white">${packages[selectedPackage].price.toLocaleString()}</span>
              </div>
              <CheckoutFeeBreakdown
                subtotal={packages[selectedPackage].price}
                appliesTo="HIRE_COMMITMENT"
              />
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between mt-4">
                <span className="font-bold text-lg text-gray-900 dark:text-white">Total (vaulted)</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">${packages[selectedPackage].price.toLocaleString()}</span>
              </div>
            </div>

            <button className="w-full py-4 bg-[#14a800] hover:bg-[#118a00] text-white rounded-xl font-bold text-lg transition-colors flex justify-center items-center shadow-lg shadow-[#14a800]/25/25 mb-4">
              Fund Escrow & Start <ChevronRight className="w-5 h-5 ml-2" />
            </button>

            <div className="flex items-start bg-[#14a800]/5 dark:bg-[#14a800]/20 p-4 rounded-xl border border-[#14a800]/20 dark:border-[#14a800]/20/50">
              <ShieldCheck className="w-5 h-5 text-[#14a800] dark:text-[#14a800] mt-0.5 shrink-0 mr-3" />
              <p className="text-xs text-[#14a800] dark:text-[#14a800]">
                Payment is held securely in escrow and only released when you approve the delivered milestones.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
