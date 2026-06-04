import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Zap, Building2, User, Loader2, Shield, Sparkles, Smartphone } from 'lucide-react';
import {
  useSubscriptionPlans,
  useMySubscription,
  useSubscribe,
  useMpesaSubscriptionPoll,
} from '../common/hooks/useSubscription';
import { useAuthStore } from '../common/authStore';
import toast from 'react-hot-toast';

const PLAN_ICONS = {
  basic: User,
  sme: Zap,
  corporate: Building2,
};

const FEATURE_ROWS = [
  { key: 'gigRecommendationsPerMonth', label: 'Gig & job recommendations / month' },
  { key: 'jobApplicationsPerMonth', label: 'Job applications / month' },
  { key: 'matchingPriorityBoost', label: 'Find Talent ranking boost' },
  { key: 'aiMatching', label: 'AI matching tier' },
  { key: 'teamSeats', label: 'Team seats' },
];

function formatLimit(value, unlimited) {
  if (unlimited || value == null) return 'Unlimited';
  return String(value);
}

export default function PricingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { data, isLoading } = useSubscriptionPlans();
  const { data: mySub } = useMySubscription();
  const subscribe = useSubscribe();
  const [billingPhone, setBillingPhone] = useState('');
  const [pendingCheckoutId, setPendingCheckoutId] = useState(null);
  const [mpesaPolling, setMpesaPolling] = useState(false);

  const onMpesaSuccess = useCallback(() => {
    setMpesaPolling(false);
    setPendingCheckoutId(null);
    toast.success('Payment received — your plan is now active');
  }, []);

  const onMpesaTimeout = useCallback(() => {
    setMpesaPolling(false);
    toast.error('Payment not confirmed yet. Check M-Pesa or try again.');
  }, []);

  useMpesaSubscriptionPoll(pendingCheckoutId, {
    onSuccess: onMpesaSuccess,
    onTimeout: onMpesaTimeout,
  });

  const plans = data?.plans || [];
  const paymentsEnabled = data?.paymentsEnabled ?? false;
  const currentPlanId = mySub?.planId || 'basic';

  const handleSelect = async (plan) => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: '/pricing' } });
      return;
    }

    if (plan.id === 'basic') {
      try {
        await subscribe.mutateAsync({ planId: 'basic', paymentMethod: 'free' });
        toast.success('You are on the Basic plan');
      } catch (e) {
        toast.error(e.message);
      }
      return;
    }

    if (!paymentsEnabled) {
      toast.error('Paid subscriptions are not open yet. Admin will enable payments soon.');
      return;
    }

    if (!billingPhone.trim()) {
      toast.error('Enter your M-Pesa number to subscribe');
      return;
    }

    try {
      const result = await subscribe.mutateAsync({
        planId: plan.id,
        paymentMethod: 'mpesa',
        phoneNumber: billingPhone.trim(),
      });
      if (result?.checkoutRequestId) {
        setPendingCheckoutId(result.checkoutRequestId);
        setMpesaPolling(true);
        toast.success('Check your phone for the M-Pesa prompt');
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#2bb75c]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pt-28 pb-20">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="text-center mb-14">
          <p className="text-[#2bb75c] font-bold text-sm uppercase tracking-widest mb-3">Freelancer plans</p>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4">
            More visibility. More matched work.
          </h1>
          <p className="text-zinc-600 max-w-2xl mx-auto text-lg">
            Your plan controls how many gigs and jobs we recommend to you each month, and how highly you rank in client search.
          </p>
          {!paymentsEnabled && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-sm font-semibold">
              <Shield className="w-4 h-4" />
              Paid checkout is admin-gated — Basic (free) is available now
            </div>
          )}
        </div>

        {mpesaPolling && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600 shrink-0" />
            <div>
              <p className="font-bold text-blue-900 text-sm flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> Waiting for M-Pesa confirmation
              </p>
              <p className="text-xs text-blue-700 mt-0.5">Complete the STK prompt on your phone. This page updates automatically.</p>
            </div>
          </div>
        )}

        {isAuthenticated && mySub && (
          <div className="mb-10 p-4 bg-white border border-[#2bb75c]/30 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-500">Your plan</p>
              <p className="font-bold text-zinc-900">{mySub.plan?.name}</p>
            </div>
            <div className="text-sm">
              <span className="text-zinc-500">Recommendations left: </span>
              <span className="font-bold text-[#2bb75c]">
                {mySub.remaining?.gigRecommendations == null
                  ? 'Unlimited'
                  : mySub.remaining.gigRecommendations}
              </span>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => {
            const Icon = PLAN_ICONS[plan.id] || Sparkles;
            const isCurrent = currentPlanId === plan.id;
            const isPaid = plan.priceKes > 0;
            const disabled = isPaid && !paymentsEnabled;

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl border-2 p-8 flex flex-col shadow-sm transition-all ${
                  plan.id === 'sme'
                    ? 'border-[#2bb75c] shadow-lg scale-[1.02]'
                    : 'border-zinc-200 hover:border-zinc-300'
                } ${disabled ? 'opacity-75' : ''}`}
              >
                {plan.id === 'sme' && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2bb75c] text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most popular
                  </span>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-[#2bb75c]/10 text-[#2bb75c]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-zinc-900">{plan.name}</h2>
                    <p className="text-xs text-zinc-500">{plan.audience}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-black text-zinc-900">
                    {plan.priceKes === 0 ? 'KES 0' : `KES ${plan.priceKes.toLocaleString()}`}
                  </span>
                  <span className="text-zinc-500 text-sm"> / month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1 text-sm">
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-[#2bb75c] shrink-0 mt-0.5" />
                    <span>
                      <strong>{formatLimit(plan.gigRecommendationsPerMonth, plan.unlimited)}</strong> gig recommendations
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-[#2bb75c] shrink-0 mt-0.5" />
                    <span>
                      <strong>{formatLimit(plan.jobApplicationsPerMonth, plan.unlimited)}</strong> job applications
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-[#2bb75c] shrink-0 mt-0.5" />
                    <span>+{plan.matchingPriorityBoost} matching priority</span>
                  </li>
                  {plan.featuredProfile && (
                    <li className="flex gap-2">
                      <Check className="w-4 h-4 text-[#2bb75c] shrink-0 mt-0.5" />
                      <span>Featured profile badge</span>
                    </li>
                  )}
                  {plan.prioritySupport && (
                    <li className="flex gap-2">
                      <Check className="w-4 h-4 text-[#2bb75c] shrink-0 mt-0.5" />
                      <span>Priority support</span>
                    </li>
                  )}
                </ul>
                <button
                  type="button"
                  disabled={isCurrent || subscribe.isPending || disabled}
                  onClick={() => handleSelect(plan)}
                  className={`w-full py-3 rounded-xl font-bold transition-colors ${
                    isCurrent
                      ? 'bg-zinc-100 text-zinc-500 cursor-default'
                      : plan.id === 'sme'
                        ? 'bg-[#2bb75c] text-white hover:bg-[#1d8d38]'
                        : 'bg-zinc-900 text-white hover:bg-zinc-800'
                  } disabled:opacity-50`}
                >
                  {isCurrent ? 'Current plan' : disabled ? 'Payments closed' : plan.priceKes === 0 ? 'Start free' : 'Subscribe'}
                </button>
              </div>
            );
          })}
        </div>

        {paymentsEnabled && (
          <div className="max-w-md mx-auto mb-12">
            <label className="block text-sm font-bold text-zinc-700 mb-2">M-Pesa number for subscription</label>
            <input
              type="tel"
              value={billingPhone}
              onChange={(e) => setBillingPhone(e.target.value)}
              placeholder="07XX XXX XXX"
              className="w-full px-4 py-3 border border-zinc-200 rounded-xl"
            />
          </div>
        )}

        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="p-6 border-b border-zinc-100">
            <h3 className="font-bold text-lg">Compare plans</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50">
                  <th className="text-left p-4 font-bold">Feature</th>
                  {plans.map((p) => (
                    <th key={p.id} className="p-4 font-bold text-center">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_ROWS.map((row) => (
                  <tr key={row.key} className="border-t border-zinc-100">
                    <td className="p-4 text-zinc-600">{row.label}</td>
                    {plans.map((p) => (
                      <td key={p.id} className="p-4 text-center font-semibold">
                        {row.key === 'matchingPriorityBoost' && `+${p[row.key]}`}
                        {row.key === 'aiMatching' && p[row.key]}
                        {row.key === 'teamSeats' && p[row.key]}
                        {row.key === 'gigRecommendationsPerMonth' &&
                          formatLimit(p.gigRecommendationsPerMonth, p.unlimited)}
                        {row.key === 'jobApplicationsPerMonth' &&
                          formatLimit(p.jobApplicationsPerMonth, p.unlimited)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-8">
          Subscriptions bill to Fortespace revenue (not escrow).{' '}
          <Link to="/terms" className="text-[#2bb75c] hover:underline">
            Terms
          </Link>
        </p>
      </div>
    </div>
  );
}

