import React, { useState } from 'react';
import { 
  CheckCircle2, DollarSign, ShieldCheck, Zap, X, Star, Award, Sparkles, Building
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

export default function UpgradePlanPage() {
  const [selectedPlan, setSelectedPlan] = useState('Professional');

  const handleUpgradeSimulate = (planName, price) => {
    if (price === 0) {
      toast.success('Downgraded to Basic Free Plan.');
      setSelectedPlan('Free');
      return;
    }

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: `Opening payment gateway for ${planName} ($${price}/mo)...`,
        success: `Successfully subscribed to ${planName} Plan! 🚀`,
        error: 'Payment failed.'
      }
    );
    setSelectedPlan(planName);
  };

  const plans = [
    {
      name: 'Free Starter',
      price: 0,
      icon: Star,
      desc: 'Perfect for independent freelancers beginning their platform journey.',
      features: [
        'Apply to 10 jobs/month',
        'Basic profile verification',
        'Standard wallet payouts',
        'Basic messaging inbox'
      ]
    },
    {
      name: 'Professional Pro',
      price: 29,
      icon: Award,
      desc: 'Tailored for dedicated elite freelancers looking to accelerate growth.',
      features: [
        'Apply to unlimited jobs',
        'Top Rated verification priority',
        'Escrow protection & fast payouts',
        'Integrations with skills assessment badges',
        'Advanced Analytics charts'
      ]
    },
    {
      name: 'Agency Unlimited',
      price: 99,
      icon: Building,
      desc: 'Designed for engineering and design agencies managing robust rosters.',
      features: [
        'All Professional Pro features',
        'Roster capacity tracking & invites',
        'Collaborative workspace & shared projects',
        'Advanced RBAC permission structures',
        'Brand asset directories & upload queues',
        'Dedicated customer success coordinator'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-4 mb-12">
        <Sparkles className="w-12 h-12 text-success mx-auto animate-pulse" />
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Flexible plans for your career</h1>
        <p className="text-sm text-text-secondary font-medium">
          Scale your operation, invite team members, access priority verified badges, and unlock advanced billing configurations.
        </p>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {plans.map((plan) => {
          const PlanIcon = plan.icon;
          const isActive = selectedPlan === plan.name;
          
          return (
            <Card 
              key={plan.name}
              className={cn(
                "bg-white border p-8 rounded-[32px] shadow-md flex flex-col justify-between min-h-[500px] relative transition-all hover:scale-[1.01]",
                isActive ? "border-success ring-2 ring-success/20 bg-success/5 shadow-xl" : "border-border hover:border-border-hover"
              )}
            >
              {isActive && (
                <span className="absolute top-4 right-4 bg-success text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">
                  Active Tier
                </span>
              )}

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className={cn("p-3 rounded-2xl bg-light-gray text-text-secondary border border-border", isActive && "bg-success/15 text-success border-success/20")}>
                    <PlanIcon size={22} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-text-primary">{plan.name}</h3>
                    <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">{plan.price === 0 ? 'Free tier' : 'Premium plan'}</p>
                  </div>
                </div>

                <div className="flex items-baseline">
                  <span className="text-3xl font-black text-text-primary">${plan.price}</span>
                  <span className="text-xs text-text-secondary font-bold ml-1">/month</span>
                </div>

                <p className="text-xs text-text-secondary font-medium leading-relaxed">{plan.desc}</p>
                
                <div className="border-t border-border pt-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-text-secondary font-bold">
                      <CheckCircle2 size={16} className={cn("text-text-secondary shrink-0", isActive ? "text-success" : "text-success")} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleUpgradeSimulate(plan.name, plan.price)}
                className={cn(
                  "w-full py-3.5 mt-8 font-black rounded-xl text-xs transition-all shadow-sm border",
                  isActive 
                    ? "bg-light-gray border-border text-text-secondary cursor-default" 
                    : "bg-success hover:bg-success/95 text-white shadow-lg shadow-[#2bb75c]/20"
                )}
                disabled={isActive}
              >
                {isActive ? 'Current Plan' : plan.price === 0 ? 'Downgrade' : 'Select Plan'}
              </button>
            </Card>
          );
        })}
      </div>

    </div>
  );
}

