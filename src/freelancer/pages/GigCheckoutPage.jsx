// src/pages/client/GigCheckoutPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, ShieldCheck, Check, Info, Lock,
  Plus, X, Clock, RefreshCw, ChevronRight, Zap
} from 'lucide-react';
import { useFreelancerGigById, useCreateOrder } from '../services/freelancerHooks';

const ADDONS = [
  { id: 'fast', title: 'Extra Fast Delivery', desc: 'Deliver in 3 days instead of 7', price: 100 },
  { id: 'seo', title: 'SEO Optimization', desc: 'On-page SEO for all 5 pages', price: 50 },
  { id: 'hosting', title: 'Deployment Setup', desc: 'Setup Vercel/Netlify hosting', price: 40 }
];

export default function GigCheckoutPage() {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const { data: gigData, isLoading: loadingGig, error: gigError } = useFreelancerGigById(gigId);
  const createOrder = useCreateOrder();

  const [selectedAddons, setSelectedAddons] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);

  const GIG = gigData?.gig ?? gigData?.data ?? gigData;

  if (loadingGig) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (gigError || !GIG) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center p-4">
        <div className="bg-white border border-border rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
          <h2 className="font-display font-semibold text-xl text-brand-900 mb-2">Unable to load service</h2>
          <p className="text-ink-secondary">Please refresh or choose another service.</p>
        </div>
      </div>
    );
  }

  const isProcessing = createOrder.isLoading;
  const orderError = createOrder.error;

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
    return base + addonsTotal;
  };

  const subtotal = calculateTotal();
  const serviceFee = Math.round(subtotal * 0.05); // 5% platform fee
  const total = subtotal + serviceFee;

  const handleCheckout = () => {
    const orderPayload = {
      gigId,
      packageName: GIG.package?.name,
      totalAmount: total,
      paymentMethod,
      addons: selectedAddons,
    };

    createOrder.mutate(orderPayload, {
      onSuccess: (data) => {
        setCreatedOrderId(data?.id || data?.orderId || null);
        setIsSuccess(true);
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface-soft flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full border border-border"
        >
          <div className="w-20 h-20 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-5">
            <Check className="w-10 h-10 text-accent DEFAULT" />
          </div>
          <h2 className="font-display font-bold text-2xl text-brand-900 mb-2">Payment successful!</h2>
          <p className="text-ink-secondary mb-6">Your order has been placed. The seller will start working on your project.</p>
          <button className="w-full py-3 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors">
            Submit requirements
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
      className="min-h-screen bg-surface-soft py-12 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Left Column: Details & Payment */}
        <div className="flex-1 space-y-6">

          <h1 className="font-display font-bold text-3xl text-brand-900">Checkout</h1>

          {/* Add-ons Section */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-display font-semibold text-lg text-brand-900 mb-5">Customize your order</h2>
            <div className="space-y-3">
              {ADDONS.map(addon => {
                const isSelected = selectedAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-accent DEFAULT bg-accent-light"
                        : "border-border bg-white hover:border-border-strong"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 shrink-0 ${
                        isSelected ? "bg-accent DEFAULT text-white" : "border-2 border-border bg-white"
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <div>
                        <h4 className="font-body font-semibold text-ink-primary">{addon.title}</h4>
                        <p className="text-sm font-body text-ink-tertiary">{addon.desc}</p>
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-ink-primary">KES {addon.price}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-display font-semibold text-lg text-brand-900 mb-5">Payment method</h2>

            <div className="space-y-3 mb-6">
              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'card'
                  ? "border-accent DEFAULT bg-accent-light"
                  : "border-border bg-white"
              }`}>
                <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  paymentMethod === 'card' ? "border-accent DEFAULT" : "border-border"
                }`}>
                  {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-accent DEFAULT" />}
                </div>
                <CreditCard className="w-5 h-5 text-ink-tertiary" />
                <span className="font-body font-semibold text-ink-primary flex-1">Credit / Debit card</span>
              </label>

              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'paypal'
                  ? "border-accent DEFAULT bg-accent-light"
                  : "border-border bg-white"
              }`}>
                <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  paymentMethod === 'paypal' ? "border-accent DEFAULT" : "border-border"
                }`}>
                  {paymentMethod === 'paypal' && <div className="w-2.5 h-2.5 rounded-full bg-accent DEFAULT" />}
                </div>
                <div className="w-5 h-5 bg-accent DEFAULT text-white font-black rounded flex items-center justify-center text-xs">P</div>
                <span className="font-body font-semibold text-ink-primary flex-1">PayPal</span>
              </label>
            </div>

            {/* Card Details Form */}
            <AnimatePresence>
              {paymentMethod === 'card' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div>
                    <label className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1 block">
                      Card number
                    </label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className="w-full h-11 px-3 bg-white border border-border rounded-lg text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1 block">
                        Expiry date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full h-11 px-3 bg-white border border-border rounded-lg text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1 block">
                        CVC
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full h-11 px-3 bg-white border border-border rounded-lg text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="sticky top-8 bg-white border border-border rounded-2xl p-6 shadow-lg">

            <h2 className="font-display font-semibold text-lg text-brand-900 mb-5">Order summary</h2>

            {/* Gig Info */}
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
              <img
                src={GIG.image}
                alt="Gig"
                className="w-14 h-10 rounded-lg object-cover"
                width={56}
                height={40}
              />
              <div>
                <h3 className="text-sm font-body font-semibold text-ink-primary line-clamp-1">{GIG.title}</h3>
                <span className="text-xs font-body text-ink-tertiary">{GIG.package.name}</span>
              </div>
            </div>

            {/* Package Details */}
            <div className="mb-5 pb-4 border-b border-border">
              <div className="flex justify-between items-center mb-3">
                <span className="font-body font-semibold text-ink-primary">{GIG.package.name}</span>
                <span className="font-mono font-semibold text-ink-primary">KES {GIG.package.price}</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-body text-ink-tertiary">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedAddons.includes('fast') ? '3 days delivery' : GIG.package.delivery}
                </div>
                <div className="flex items-center gap-2 text-sm font-body text-ink-tertiary">
                  <RefreshCw className="w-3.5 h-3.5" /> {GIG.package.revisions} revisions
                </div>
                {GIG.package.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm font-body text-ink-tertiary">
                    <Check className="w-3.5 h-3.5 text-accent DEFAULT" /> {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons Summary */}
            {selectedAddons.length > 0 && (
              <div className="mb-5 pb-4 border-b border-border">
                <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-2">Add-ons</p>
                {selectedAddons.map(id => {
                  const addon = ADDONS.find(a => a.id === id);
                  return (
                    <div key={id} className="flex justify-between items-center text-sm mb-1">
                      <span className="font-body text-ink-secondary">{addon.title}</span>
                      <span className="font-mono font-semibold text-ink-primary">KES {addon.price}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Fees */}
            <div className="mb-5 pb-4 border-b border-border">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="font-body text-ink-secondary">Subtotal</span>
                <span className="font-mono font-semibold text-ink-primary">KES {subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-body text-ink-secondary">Service fee (5%)</span>
                <span className="font-mono font-semibold text-ink-primary">KES {serviceFee}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6 pt-2">
              <span className="font-body font-semibold text-lg text-ink-primary">Total</span>
              <span className="font-mono font-bold text-2xl text-brand-900">KES {total}</span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-3 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-semibold text-sm transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Confirm & pay <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            {orderError && (
              <div className="mt-4 rounded-2xl bg-danger/10 border border-danger p-3 text-sm text-danger">
                {orderError?.message || 'Unable to place order. Please try again.'}
              </div>
            )}

            {/* Secure Payment Badge */}
            <div className="mt-5 flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5 text-ink-tertiary" />
              <span className="text-xs font-body font-medium text-ink-tertiary">SSL secured payment</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
