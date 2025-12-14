import { Check, Target, BadgeCheck } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { plans } from "../../Assets/assets";

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-[var(--color-primary)]">
    
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-mint)] rounded-full text-sm font-medium mb-6">
          <BadgeCheck size={16} />
          <span>Transparent Pricing</span>
        </div>
        <h1 className="text-center text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl mb-4">
          Pricing That <span className="text-[var(--color-cta)]">Grows</span> With You
        </h1>
        <p className="text-center md:text-lg max-w-2xl mx-auto">
          Join our verified pro team to get more leads and unlock powerful features. 
          <span className="block mt-2 text-sm">No hidden fees. Cancel anytime.</span>
        </p>
      </div>

      {/* ------------------------Pricing Cards---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-2xl border-2 ${
              plan.popular
                ? "border-[var(--color-cta)] shadow-lg shadow-[var(--color-cta)]/10"
                : "border-[var(--accent-pink)]"
            } bg-[var(--accent-mint)] p-6 lg:p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
          >
            {/* --------------Popular Badge --------------*/}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="px-4 py-1 bg-[var(--color-cta)] text-[var(--color-secondary)] text-xs font-bold rounded-full">
                  MOST POPULAR
                </span>
              </div>
            )}

            {/* Plan Header */}
            <div className="flex flex-col items-center border-b border-[var(--accent-pink)] pb-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className={`p-2 rounded-lg ${plan.accent} bg-[var(--accent-pink)]`}>
                  {plan.icon}
                </div>
                <span className="text-lg font-semibold">{plan.name}</span>
              </div>
              <div className="text-center mb-2">
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-lg text-gray-500 ml-1">{plan.period}</span>
                </div>
                <span className="text-sm text-gray-600">{plan.description}</span>
              </div>
              <span className="text-xs font-medium px-3 py-1 bg-white/50 rounded-full mt-2">
                {plan.tagline}
              </span>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 grid size-5 place-content-center rounded-full bg-[var(--color-cta)] text-sm text-[var(--color-secondary)] mt-0.5">
                    <Check size={14} />
                  </span>
                  <span className="text-sm text-[var(--color-primary)] leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* -------------------------CTA Button------------- */}
            <button
              onClick={() => navigate()}
              className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${
                plan.popular
                  ? "bg-[var(--color-cta)] text-[var(--color-secondary)] hover:bg-opacity-90"
                  : "bg-white text-[var(--color-primary)] border border-[var(--accent-pink)] hover:bg-gray-50"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* --------------- CTA Section-------------------- */}
      <div className="relative max-w-6xl mx-auto">
        <div className="relative bg-gradient-to-r from-[var(--accent-mint)] to-white rounded-2xl overflow-hidden p-8 md:p-12">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-cta)] rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent-pink)] rounded-full translate-y-32 -translate-x-32"></div>
          </div>

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-2/3">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white rounded-lg">
                  <Target size={20} className="text-[var(--color-cta)]" />
                </div>
                <span className="text-sm font-medium text-[var(--color-cta)]">
                  SPECIAL OFFER
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold leading-tight mb-4">
                Ready to <span className="text-[var(--color-cta)]">Upgrade</span> Your
                Experience?
              </h1>
              <p className="text-lg text-[var(--color-primary)] max-w-2xl">
                Join <span className="font-semibold">10,000+ professionals</span> who
                have increased their earnings by 3x. Your next favorite tool is just one
                click away.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-[var(--color-cta)]" />
                  <span className="text-sm">30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-[var(--color-cta)]" />
                  <span className="text-sm">No long-term contracts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-[var(--color-cta)]" />
                  <span className="text-sm">Cancel anytime</span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/3 flex flex-col items-center lg:items-end">
              <button
                onClick={() => navigate()}
                className="px-8 py-4 text-[var(--color-secondary)] bg-[var(--color-cta)] rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg"
              >
                Upgrade Now
              </button>
              <p className="text-sm text-gray-600 mt-4 text-center lg:text-right">
                Start your 14-day free trial
                <br />
                <span className="text-xs">No credit card required</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;