import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

const ClientOnboardingLanding = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="min-h-screen bg-surface flex flex-col justify-center py-20 relative overflow-hidden">
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-dark text-white font-bold tracking-wide text-sm mb-8 shadow-md">
                <Building2 className="w-4 h-4" /> FOR EMPLOYERS & CLIENTS
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-zinc-900 mb-6 leading-tight">
                Hire the top 1% of global talent.
              </h1>
              
              <p className="text-xl text-zinc-600 mb-10 leading-relaxed">
                Skip the recruiting agency fees. Instantly access verified developers, designers, and marketers ready to scale your business.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button onClick={() => navigate('/client/jobs/post')} className="px-8 py-4 bg-surface-dark hover:bg-zinc-800 text-white font-bold rounded-xl transition-all shadow-xl shadow-zinc-900/20 flex items-center justify-center gap-2 text-lg">
                  Start Hiring Now <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 bg-white hover:bg-zinc-100 text-zinc-900 font-bold rounded-xl transition-all border border-zinc-200 text-lg shadow-sm">
                  Talk to Sales
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm font-bold text-zinc-500">
                <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-success" /> Vetted Talent</span>
                <span className="flex items-center gap-2"><Zap className="w-5 h-5 text-[#4C1D95]" /> Instant Matching</span>
              </div>
            </div>

            <div className="flex-1 w-full max-w-lg relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-[#22C55E] rounded-[3rem] rotate-3 opacity-20 blur-xl"></div>
              <div className="bg-white rounded-[3rem] border border-zinc-200 shadow-2xl p-10 relative z-10">
                <h3 className="text-2xl font-black text-zinc-900 mb-8">What are you looking for?</h3>
                
                <div className="space-y-4">
                  {[
                    'Frontend React Developer',
                    'Senior UI/UX Designer',
                    'AWS Cloud Architect',
                    'B2B Content Marketer'
                  ].map((role, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-zinc-200 rounded-2xl hover:border-[#4C1D95]/20 cursor-pointer transition-colors group">
                      <span className="font-bold text-zinc-700 group-hover:text-[#4C1D95]">{role}</span>
                      <Search className="w-5 h-5 text-zinc-400 group-hover:text-[#4C1D95]" />
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-8 border-t border-zinc-100 text-center">
                  <span className="text-zinc-500 font-medium">Over 150,000 active professionals</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ClientOnboardingLanding;



