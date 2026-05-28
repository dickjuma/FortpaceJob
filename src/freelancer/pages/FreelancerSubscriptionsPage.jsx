import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, CheckCircle2, Zap, Star, 
  Crown, Receipt, Settings, Clock, AlertCircle
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    description: 'Basic features for new freelancers.',
    features: ['10 Proposals / month', 'Standard Profile', 'Basic Analytics', 'Community Support'],
    icon: Star,
    color: 'text-zinc-500',
    bg: 'bg-surface dark:bg-zinc-800'
  },
  {
    name: 'Professional',
    price: '$15',
    period: '/mo',
    description: 'For growing independent professionals.',
    features: ['50 Proposals / month', 'Featured Profile Badge', 'Advanced Analytics', 'Priority Support', 'Custom Profile URL'],
    icon: Zap,
    color: 'text-brand-500',
    bg: 'bg-brand-50 dark:bg-brand-500/10 border-brand-500 shadow-xl shadow-brand-500/10',
    isPopular: true
  },
  {
    name: 'Enterprise Freelancer',
    price: '$49',
    period: '/mo',
    description: 'Maximum visibility and AI tools for top earners.',
    features: ['Unlimited Proposals', 'Top Search Placement', 'AI Proposal Writer', 'Dedicated Account Manager', '0% Processing Fees'],
    icon: Crown,
    color: 'text-amber-500',
    bg: 'bg-surface-dark dark:bg-zinc-800 text-white border-zinc-900 dark:border-zinc-700'
  }
];

const BILLING_HISTORY = [
  { id: 'INV-001', date: 'May 1, 2026', amount: '$15.00', plan: 'Professional Plan', status: 'Paid' },
  { id: 'INV-002', date: 'Apr 1, 2026', amount: '$15.00', plan: 'Professional Plan', status: 'Paid' },
  { id: 'INV-003', date: 'Mar 1, 2026', amount: '$0.00', plan: 'Free Plan', status: 'Paid' }
];

export default function FreelancerSubscriptionsPage() {
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly, annual
  const [currentPlan, setCurrentPlan] = useState('Professional');

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
            <Crown className="w-8 h-8 text-amber-500" /> Subscription & Billing
          </h1>
          <p className="text-zinc-500 font-medium">Manage your premium plan, billing history, and proposal limits.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Current Plan Overview */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Current Plan</p>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2 mb-2">
              <Zap className="w-6 h-6 text-brand-500 fill-brand-500" /> Professional Plan
            </h2>
            <p className="text-zinc-500 font-medium">Your plan renews on <strong className="text-zinc-900 dark:text-white">June 1, 2026</strong> for $15.00.</p>
          </div>
          
          <div className="w-full md:w-80 bg-surface dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-zinc-900 dark:text-white">Proposals Used</span>
              <span className="text-sm font-black text-brand-600">32 / 50</span>
            </div>
            <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full" style={{ width: '64%' }}></div>
            </div>
            <p className="text-xs font-bold text-zinc-500 mt-2 text-center">Resets in 12 days</p>
          </div>
        </div>

        {/* Pricing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-zinc-200/50 dark:bg-zinc-800/50 p-1 rounded-xl flex items-center">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all", billingCycle === 'monthly' ? "bg-white dark:bg-surface-dark text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('annual')}
              className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2", billingCycle === 'annual' ? "bg-white dark:bg-surface-dark text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
            >
              Annually <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-success/20 dark:text-success px-1.5 py-0.5 rounded uppercase tracking-wider">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {PLANS.map(plan => {
            const isCurrent = currentPlan === plan.name;
            const price = billingCycle === 'annual' && plan.price !== '$0' ? `$${parseInt(plan.price.slice(1)) * 12 * 0.8}` : plan.price;
            const period = billingCycle === 'annual' && plan.price !== '$0' ? '/yr' : plan.period || '';
            
            return (
              <div key={plan.name} className={cn("rounded-3xl border-2 p-8 relative flex flex-col transition-transform hover:-tranzinc-y-1", plan.bg || "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface-dark")}>
                
                {plan.isPopular && (
                  <div className="absolute top-0 left-1/2 -tranzinc-x-1/2 -tranzinc-y-1/2 bg-brand-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute top-0 right-0 p-4">
                    <span className="bg-emerald-100 text-emerald-700 dark:bg-success/20 dark:text-success text-xs font-bold px-2 py-1 rounded-md">Current Plan</span>
                  </div>
                )}

                <div className="mb-8">
                  <plan.icon className={cn("w-10 h-10 mb-4", plan.color)} />
                  <h3 className={cn("text-xl font-bold mb-2", plan.name === 'Enterprise Freelancer' ? "text-white" : "text-zinc-900 dark:text-white")}>{plan.name}</h3>
                  <p className={cn("text-sm font-medium h-10", plan.name === 'Enterprise Freelancer' ? "text-zinc-400" : "text-zinc-500")}>{plan.description}</p>
                </div>
                
                <div className="mb-8 flex items-end gap-1">
                  <span className={cn("text-4xl font-black", plan.name === 'Enterprise Freelancer' ? "text-white" : "text-zinc-900 dark:text-white")}>{price}</span>
                  <span className={cn("text-sm font-bold mb-1", plan.name === 'Enterprise Freelancer' ? "text-zinc-500" : "text-zinc-400")}>{period}</span>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className={cn("flex items-start gap-3 text-sm font-medium", plan.name === 'Enterprise Freelancer' ? "text-zinc-300" : "text-zinc-600 dark:text-zinc-300")}>
                      <CheckCircle2 className={cn("w-5 h-5 shrink-0", plan.color)} /> {f}
                    </li>
                  ))}
                </ul>

                <button 
                  disabled={isCurrent}
                  className={cn(
                    "w-full py-4 font-bold rounded-xl transition-all shadow-sm",
                    isCurrent ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed" : 
                    plan.name === 'Enterprise Freelancer' ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20" :
                    plan.isPopular ? "bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20" : 
                    "bg-surface-dark dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800"
                  )}
                >
                  {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Lower Section: Billing & Payment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Payment Method */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-500" /> Payment Methods
            </h3>
            
            <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-2xl flex items-center justify-between mb-4 bg-surface dark:bg-zinc-800/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-zinc-200 dark:bg-zinc-700 rounded flex items-center justify-center font-black text-zinc-500 italic text-sm">VISA</div>
                <div>
                  <p className="font-bold text-zinc-900 dark:text-white text-sm">Visa ending in 4242</p>
                  <p className="text-xs font-medium text-zinc-500">Expires 12/28</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2 py-1 rounded-md">Default</span>
            </div>

            <button className="text-sm font-bold text-brand-600 hover:underline">
              + Add Payment Method
            </button>
          </div>

          {/* Billing History */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-brand-500" /> Billing History
            </h3>
            
            <div className="space-y-4">
              {BILLING_HISTORY.map(inv => (
                <div key={inv.id} className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white text-sm">{inv.plan}</p>
                    <p className="text-xs font-medium text-zinc-500">{inv.date} • {inv.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-zinc-900 dark:text-white text-sm">{inv.amount}</p>
                    <button className="text-[10px] font-bold text-brand-600 hover:underline">Download PDF</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
