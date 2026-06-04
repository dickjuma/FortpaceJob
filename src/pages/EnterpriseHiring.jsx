import React from 'react';
import { Building2, Users, ShieldCheck, Zap, ArrowRight, ChevronRight, BarChart3, Globe, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const EnterpriseHiring = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-surface-dark text-white pt-20 pb-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-[#2bb75c]/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-[#2bb75c]/20 blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2bb75c]/10 border border-[#2bb75c]/20/20 text-[#2bb75c] font-bold tracking-wide text-sm mb-6">
                <Building2 className="w-4 h-4" /> FORTSPACE ENTERPRISE
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                Scale your workforce with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#1d8d38]">global talent</span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                A dedicated platform for large organizations. Source, hire, and manage distributed teams and independent contractors with enterprise-grade security and compliance.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button className="w-full sm:w-auto px-8 py-4 bg-[#2bb75c] hover:bg-[#1d8d38] text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2">
                  Request a Demo <ArrowRight className="w-5 h-5" />
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold rounded-xl transition-colors text-center">
                  Contact Sales
                </button>
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-lg lg:max-w-none">
              <div className="bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 shadow-2xl relative">
                {/* Mock UI Dashboard inside Hero */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-[#2bb75c]" />
                    </div>
                    <div>
                      <div className="font-bold text-white">Active Contracts</div>
                      <div className="text-xs text-zinc-400">Enterprise Dashboard</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">$142,500</div>
                    <div className="text-xs text-success font-medium">Monthly Spend</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-zinc-700/50 rounded-xl p-4 flex items-center justify-between border border-zinc-600/50">
                      <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=Talent+${i}&background=0D8ABC&color=fff`} className="w-8 h-8 rounded-full" alt="avatar" />
                        <div>
                          <div className="font-semibold text-sm text-white">Senior Engineer {i}</div>
                          <div className="text-xs text-zinc-400">Engineering Team Alpha</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">40 hrs/wk</div>
                        <div className="text-xs text-zinc-400">Approved</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="bg-surface py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">Why enterprise companies choose Fortspace</h2>
            <p className="text-lg text-zinc-600">
              We provide the tools, compliance, and talent pool required to run large-scale remote operations seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-xl hover:-tranzinc-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-[#2bb75c]/10 rounded-xl flex items-center justify-center mb-6 text-[#2bb75c]">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Managed Teams</h3>
              <p className="text-zinc-600 leading-relaxed mb-6">
                Group freelancers into organizational units, assign internal hiring managers, and track team-based budgets with our advanced workforce management tools.
              </p>
              <Link to="/enterprise/teams" className="text-[#2bb75c] font-bold flex items-center gap-1 hover:text-[#2bb75c]">
                Explore Team Management <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-xl hover:-tranzinc-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 text-success">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Compliance & Security</h3>
              <p className="text-zinc-600 leading-relaxed mb-6">
                Worker classification compliance, custom NDA enforcement, secure onboarding, and enterprise-grade SSO (SAML/OAuth) integration.
              </p>
              <Link to="/trust-center" className="text-success font-bold flex items-center gap-1 hover:text-emerald-700">
                View Compliance Center <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-xl hover:-tranzinc-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-[#2bb75c]/10 rounded-xl flex items-center justify-center mb-6 text-[#2bb75c]">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Advanced Analytics</h3>
              <p className="text-zinc-600 leading-relaxed mb-6">
                Get real-time insights into your freelance spend, project timelines, department allocation, and overall ROI with customizable dashboards.
              </p>
              <Link to="/enterprise/analytics" className="text-[#2bb75c] font-bold flex items-center gap-1 hover:text-[#2bb75c]">
                See Analytics Capabilities <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="py-24 bg-white border-t border-zinc-200">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-10">Trusted by Forward-Thinking Companies</h3>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Using text logos as placeholders for company logos */}
            <div className="text-2xl font-black text-zinc-800">AcmeCorp</div>
            <div className="text-2xl font-black text-zinc-800">Globex</div>
            <div className="text-2xl font-black text-zinc-800">Initech</div>
            <div className="text-2xl font-black text-zinc-800">Soylent</div>
            <div className="text-2xl font-black text-zinc-800">MassiveDynamic</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnterpriseHiring;

