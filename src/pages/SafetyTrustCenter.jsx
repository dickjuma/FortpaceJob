import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SafetyTrustCenter = () => {
  return (
    <>
      <div className="bg-surface-dark text-white pt-24 pb-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/20 via-zinc-900 to-zinc-900"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-4xl">
          <div className="w-24 h-24 bg-success/20 border-2 border-emerald-500/50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <ShieldCheck className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Trust & Safety Center</h1>
          <p className="text-xl text-zinc-300 mb-10 leading-relaxed max-w-3xl mx-auto">
            Your security is our absolute priority. Fortspace employs military-grade encryption, strict identity verification, and escrow protections to ensure every project is safe, secure, and successful.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/dispute-resolution" className="px-8 py-4 bg-success hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/50">
              Report an Issue
            </Link>
            <Link to="/verification-process" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors border border-white/20">
              View Verification Standards
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-surface py-20 -mt-10 rounded-t-[3rem] relative z-20">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#4C1D95]/10 text-[#4C1D95] rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Secure Payments (Escrow)</h3>
              <p className="text-zinc-600 leading-relaxed">
                Funds are held securely in escrow and only released when you are 100% satisfied with the delivered work. No risk of paying for incomplete projects.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-emerald-100 text-success rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Vetted Professionals</h3>
              <p className="text-zinc-600 leading-relaxed">
                Every freelancer undergoes strict biometric ID verification and technical assessments before they can offer services on the Fortspace platform.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#4C1D95]/10 text-[#4C1D95] rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">IP & Data Protection</h3>
              <p className="text-zinc-600 leading-relaxed">
                Automatic NDAs and strict IP transfer agreements ensure that all work produced belongs entirely to you the moment payment is released.
              </p>
            </div>
          </div>

          {/* Dispute Resolution Teaser */}
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Dispute Resolution</h3>
              <p className="text-zinc-700 max-w-2xl mb-6">
                If something goes wrong, our dedicated mediation team steps in to resolve the issue fairly based on the contract milestones and communications logged on the platform.
              </p>
              <Link to="/disputes" className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors inline-block shadow-md">
                Learn About Disputes
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default SafetyTrustCenter;


