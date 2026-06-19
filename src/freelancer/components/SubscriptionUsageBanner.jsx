import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import { useMySubscription } from '../../platform/common/hooks/useSubscription';

export default function SubscriptionUsageBanner() {
  const { data: sub, isLoading } = useMySubscription();

  if (isLoading || !sub) return null;

  const recLeft = sub.remaining?.gigRecommendations;
  const appsLeft = sub.remaining?.jobApplications;

  return (
    <div className="mb-6 p-4 rounded-2xl border border-[#4C1D95]/30 bg-[#4C1D95]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <Zap className="w-5 h-5 text-[#4C1D95] shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-zinc-900 text-sm">{sub.plan?.name} plan</p>
          <p className="text-xs text-zinc-600 mt-0.5">
            Gig recommendations left: <strong>{recLeft == null ? 'Unlimited' : recLeft}</strong>
            {' · '}
            Job applications left: <strong>{appsLeft == null ? 'Unlimited' : appsLeft}</strong>
          </p>
        </div>
      </div>
      {sub.planId !== 'corporate' && (
        <Link
          to="/pricing"
          className="inline-flex items-center gap-1 text-sm font-bold text-[#4C1D95] hover:underline shrink-0"
        >
          Upgrade <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}


