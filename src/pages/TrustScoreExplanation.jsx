import React from 'react';
import { ShieldCheck, Lock, Activity, Eye, FileText } from 'lucide-react';

const TrustScoreExplanation = () => {
  return (
    <>
      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          
          <div className="text-center mb-16">
            <ShieldCheck className="w-16 h-16 text-success mx-auto mb-6" />
            <h1 className="text-4xl font-black text-zinc-900 mb-4">Understanding the Trust Score</h1>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              Fortspace's proprietary Trust Score is the bedrock of our marketplace security. Here's how we calculate platform trust for both clients and freelancers.
            </p>
          </div>

          <div className="space-y-8">
            
            <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center shrink-0">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Identity Verification Weight (40%)</h3>
                <p className="text-zinc-600 leading-relaxed mb-4">
                  The highest weighted factor in the Trust Score is confirmed identity. Accounts that pass biometric verification and government ID checks automatically gain a high baseline score.
                </p>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center shrink-0">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Platform Activity & History (30%)</h3>
                <p className="text-zinc-600 leading-relaxed mb-4">
                  Longevity matters. Accounts with consistent login history, active messaging without flags, and a track record of completed contracts increase their Trust Score steadily over time.
                </p>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-16 h-16 bg-emerald-100 text-success rounded-2xl flex items-center justify-center shrink-0">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Payment Security (30%)</h3>
                <p className="text-zinc-600 leading-relaxed mb-4">
                  For clients, adding a verified payment method and successfully funding escrows boosts trust. For freelancers, linking a verified bank account and avoiding chargebacks maintains a pristine score.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default TrustScoreExplanation;
