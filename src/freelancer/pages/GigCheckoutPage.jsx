import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, ShieldCheck, Check, Info, Lock, 
  Plus, X, Clock, RefreshCw, ChevronRight, Zap
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import CheckoutFeeBreakdown from '../../components/payments/CheckoutFeeBreakdown';
import { useCheckoutFees } from '../../common/hooks/useCheckoutFees';

// Mock Data
const GIG = {
  title: 'I will build a responsive modern React JS web application',
  package: {
    name: 'Standard App',
    price: 450,
    delivery: '7 Days',
    revisions: 3,
    features: ['5 Pages', 'Responsive Design', 'API Integration', 'Source Code']
  },
  seller: {
    name: 'Alex Rivera',
    avatar: 'https://i.pravatar.cc/150?u=alex'
  },
  image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'
};

const ADDONS = [
  { id: 'fast', title: 'Extra Fast Delivery', desc: 'Deliver in 3 days instead of 7', price: 100 },
  { id: 'seo', title: 'SEO Optimization', desc: 'On-page SEO for all 5 pages', price: 50 },
  { id: 'hosting', title: 'Deployment Setup', desc: 'Setup Vercel/Netlify hosting', price: 40 }
];

export default function GigCheckoutPage() {
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('card'); // card, paypal, balance
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleAddon = (id) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    const base = GIG.package.price;
    const addonsTotal = selectedAddons.reduce((sum, id) => {
      return sum + ADDONS.find(a => a.id === id).price;
    }, 0);
    return { subtotal: base + addonsTotal };
  };

  const { subtotal } = calculateTotal();
  const { breakdown } = useCheckoutFees(subtotal, 'HIRE_COMMITMENT');
  const serviceFee = breakdown.platformFee;
  const total = subtotal;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface dark:bg-surface-dark flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-surface-dark p-8 sm:p-12 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-emerald-100 dark:bg-success/20 text-success dark:text-success rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Payment Successful!</h2>
          <p className="text-zinc-500 mb-8">Your order has been placed. Please submit the requirements so the seller can start working.</p>
          <button className="w-full py-3.5 bg-[#14a800] text-white font-bold rounded-xl shadow-sm hover:bg-[#118a00] transition-colors">
            Submit Requirements
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Details & Payment */}
        <div className="flex-1 space-y-8">
          
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Checkout</h1>

          {/* Upgrade your order (Add-ons) */}
          <section className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Customize your order</h2>
            <div className="space-y-4">
              {ADDONS.map(addon => {
                const isSelected = selectedAddons.includes(addon.id);
                return (
                  <div 
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-colors",
                      isSelected ? "border-[#14a800]/20 bg-[#14a800]/5 dark:bg-[#14a800]/10" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-6 h-6 rounded flex items-center justify-center mt-0.5 transition-colors shrink-0",
                        isSelected ? "bg-[#14a800] text-white" : "border-2 border-zinc-300 dark:border-zinc-600 bg-transparent"
                      )}>
                        {isSelected && <Check className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white">{addon.title}</h4>
                        <p className="text-sm text-zinc-500">{addon.desc}</p>
                      </div>
                    </div>
                    <span className="font-bold text-zinc-900 dark:text-white">${addon.price}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Payment Options */}
          <section className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Payment Method</h2>
            
            <div className="space-y-4 mb-8">
              {/* Credit Card */}
              <label className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-colors",
                paymentMethod === 'card' ? "border-[#14a800]/20 bg-[#14a800]/5 dark:bg-[#14a800]/10" : "border-zinc-200 dark:border-zinc-700"
              )}>
                <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0", paymentMethod === 'card' ? "border-[#14a800]/20" : "border-zinc-300 dark:border-zinc-600")}>
                  {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[#14a800]" />}
                </div>
                <CreditCard className="w-6 h-6 text-zinc-400" />
                <span className="font-bold text-zinc-900 dark:text-white flex-1">Credit / Debit Card</span>
              </label>

              {/* PayPal */}
              <label className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-colors",
                paymentMethod === 'paypal' ? "border-[#14a800]/20 bg-[#14a800]/5 dark:bg-[#14a800]/10" : "border-zinc-200 dark:border-zinc-700"
              )}>
                <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
                <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0", paymentMethod === 'paypal' ? "border-[#14a800]/20" : "border-zinc-300 dark:border-zinc-600")}>
                  {paymentMethod === 'paypal' && <div className="w-2.5 h-2.5 rounded-full bg-[#14a800]" />}
                </div>
                <div className="w-6 h-6 bg-[#14a800] text-white font-black italic rounded flex items-center justify-center text-xs">P</div>
                <span className="font-bold text-zinc-900 dark:text-white flex-1">PayPal</span>
              </label>
            </div>

            {/* Simulated Card Input Form */}
            <AnimatePresence>
              {paymentMethod === 'card' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Card Number</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 rounded-xl outline-none focus:border-[#14a800]/20 transition-colors text-zinc-900 dark:text-white font-medium" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Expiry Date</label>
                      <input type="text" placeholder="MM/YY" className="w-full bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 rounded-xl outline-none focus:border-[#14a800]/20 transition-colors text-zinc-900 dark:text-white font-medium" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">CVC</label>
                      <input type="text" placeholder="123" className="w-full bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 rounded-xl outline-none focus:border-[#14a800]/20 transition-colors text-zinc-900 dark:text-white font-medium" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="w-full lg:w-96 shrink-0 relative">
          <div className="sticky top-8 bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xl shadow-zinc-200/50 dark:shadow-none">
            
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Order Summary</h2>

            {/* Gig Info */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <img src={GIG.image} alt="Gig" className="w-16 h-12 rounded-lg object-cover" />
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1">{GIG.title}</h3>
                <span className="text-xs text-zinc-500 font-medium">{GIG.package.name}</span>
              </div>
            </div>

            {/* Base Features */}
            <div className="mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-zinc-900 dark:text-white">{GIG.package.name}</span>
                <span className="font-bold text-zinc-900 dark:text-white">${GIG.package.price}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-zinc-500"><Clock className="w-4 h-4" /> {selectedAddons.includes('fast') ? '3 Days Delivery' : GIG.package.delivery}</div>
                <div className="flex items-center gap-2 text-sm text-zinc-500"><RefreshCw className="w-4 h-4" /> {GIG.package.revisions} Revisions</div>
                {GIG.package.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-zinc-500"><Check className="w-4 h-4 text-success" /> {f}</div>
                ))}
              </div>
            </div>

            <CheckoutFeeBreakdown subtotal={subtotal} appliesTo="HIRE_COMMITMENT" className="mb-6" />

            <div className="flex justify-between items-center mb-8 pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <span className="text-lg font-bold text-zinc-900 dark:text-white">Total</span>
              <span className="text-3xl font-black text-zinc-900 dark:text-white">${total.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-4 bg-[#14a800] hover:bg-[#118a00] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-tranzinc-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>Processing <span className="animate-pulse">...</span></>
              ) : (
                <>Confirm & Pay <ChevronRight className="w-4 h-4" /></>
              )}
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-zinc-400">
              <Lock className="w-3.5 h-3.5" /> SSL Secured Payment
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
