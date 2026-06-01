import React from 'react';
import { ShieldCheck, CheckCircle2, Lock, Building, FileText, Smartphone } from 'lucide-react';

const Verification = () => {
  return (
    <>
      <div className="bg-surface-dark pt-16 pb-32 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-10">
          <ShieldCheck className="w-96 h-96 text-white" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium mb-6 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 fill-current" />
              Verified Professional
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Sarah Jenkins's Verifications
            </h1>
            <p className="text-zinc-400 text-lg">
              We employ military-grade identity verification and ongoing compliance checks to ensure you're working with exactly who they say they are.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-20 relative z-20 pb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Identity Column */}
            <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-zinc-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-[#14a800]/10 rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-[#14a800]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900">Identity & Contact</h2>
                  <p className="text-zinc-500">Government ID & Contact Verification</p>
                </div>
              </div>

              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-success" /></div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-lg">Government ID</h4>
                    <p className="text-zinc-600 text-sm">Passport or Driver's License verified via Jumio.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-success" /></div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-lg">Liveness Check</h4>
                    <p className="text-zinc-600 text-sm">Real-time biometric facial recognition matched against ID.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-success" /></div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-lg">Phone Number</h4>
                    <p className="text-zinc-600 text-sm">SMS verification completed.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-success" /></div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-lg">Email Address</h4>
                    <p className="text-zinc-600 text-sm">Email domain and address verified.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Professional Column */}
            <div className="p-8 md:p-12 bg-surface/50">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-[#14a800]/10 rounded-full flex items-center justify-center">
                  <Building className="w-8 h-8 text-[#14a800]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900">Professional</h2>
                  <p className="text-zinc-500">Background & Business Credentials</p>
                </div>
              </div>

              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-success" /></div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-lg">Payment Method</h4>
                    <p className="text-zinc-600 text-sm">Bank account ownership verified.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-success" /></div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-lg">Tax Information</h4>
                    <p className="text-zinc-600 text-sm">W-9 or W-8BEN form on file and validated.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-success" /></div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-lg">Skill Assessments</h4>
                    <p className="text-zinc-600 text-sm">Passed Fortspace React.js & Node.js technical assessments (Top 10%).</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 text-zinc-400">
                  <div className="mt-1"><div className="w-6 h-6 rounded-full border-2 border-zinc-300 flex items-center justify-center"><div className="w-2 h-2 bg-zinc-300 rounded-full"></div></div></div>
                  <div>
                    <h4 className="font-medium text-zinc-500 text-lg">Business Registration</h4>
                    <p className="text-zinc-400 text-sm">Not provided (Operating as sole proprietor)</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>
          
          <div className="p-8 bg-zinc-100 border-t border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-zinc-600 text-sm max-w-2xl">
              Fortspace uses advanced encryption and secure third-party vendors to verify and store this data. Your hiring process is protected by our Trust & Safety Guarantee.
            </p>
            <button className="bg-white border border-zinc-300 text-zinc-700 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-surface transition-colors whitespace-nowrap">
              Learn about Trust & Safety
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Verification;
