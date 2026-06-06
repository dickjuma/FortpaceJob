import React, { useState } from 'react';
import { AlertTriangle, Clock, Zap, MapPin, Search, ShieldAlert, PhoneCall, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmergencyServices = () => {
  const [step, setStep] = useState(1);
  const [service, setService] = useState('');

  return (
    <>
      <div className="bg-rose-600 text-white pt-16 pb-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-rose-500 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-orange-500 blur-3xl opacity-50"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-white font-bold tracking-wide text-sm mb-6">
              <AlertTriangle className="w-4 h-4 fill-current text-white" /> EMERGENCY RESPONSE
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Get immediate onsite help right now.
            </h1>
            <p className="text-lg md:text-xl text-rose-100 mb-8 max-w-2xl mx-auto lg:mx-0">
              Power outage? Server down? Plumbing disaster? We instantly dispatch verified local professionals to your location within minutes.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-bold text-white mb-8">
              <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-rose-300" /> 24/7 Availability</div>
              <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-rose-300" /> &lt;30 Min Response</div>
              <div className="flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-rose-300" /> Fully Insured</div>
            </div>
          </div>

          {/* Emergency Booking Form */}
          <div className="w-full max-w-md lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden text-zinc-900 border-4 border-rose-100">
              
              <div className="bg-rose-50 p-6 border-b border-rose-100 text-center">
                <h3 className="text-xl font-black text-rose-700">Request Dispatch</h3>
                <p className="text-sm text-rose-600 font-medium">Step {step} of 2</p>
              </div>
              
              <div className="p-6">
                {step === 1 ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-1">What is the emergency?</label>
                      <select 
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full bg-surface border border-zinc-200 rounded-xl px-4 py-3 text-zinc-700 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium"
                      >
                        <option value="" disabled>Select emergency type...</option>
                        <option value="electrical">Electrical / Power Outage</option>
                        <option value="plumbing">Plumbing / Water Leak</option>
                        <option value="it">IT / Server Outage</option>
                        <option value="locksmith">Locksmith / Security</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-1">Your exact location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-5 h-5 text-zinc-400" />
                        <input type="text" placeholder="123 Main St, City..." className="w-full bg-surface border border-zinc-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium" />
                      </div>
                    </div>
                    <button 
                      onClick={() => setStep(2)}
                      disabled={!service}
                      className={`w-full py-3.5 rounded-xl font-bold shadow-md transition-colors mt-2 ${service ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'}`}
                    >
                      Next: Dispatch Details
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-800 text-xs font-bold flex items-start gap-2 mb-4">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      Emergency rates apply ($150-$300/hr based on service). You will approve the final quote before dispatch.
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-1">Brief Description</label>
                      <textarea rows="3" placeholder="What exactly is happening?" className="w-full bg-surface border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium text-sm"></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-1">Callback Number</label>
                      <div className="relative">
                        <PhoneCall className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400" />
                        <input type="tel" placeholder="(555) 000-0000" className="w-full bg-surface border border-zinc-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium" />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setStep(1)} className="px-4 py-3 bg-zinc-100 text-zinc-600 font-bold rounded-xl hover:bg-zinc-200 transition-colors">Back</button>
                      <button className="flex-1 py-3 bg-surface-dark hover:bg-zinc-800 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4 fill-current" /> Find Pro Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* How it works */}
      <div className="bg-surface py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4">How Fortspace Emergency Works</h2>
            <p className="text-lg text-zinc-600">Our platform instantly pings available, background-checked professionals in a 10km radius of your emergency.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-zinc-200 text-center shadow-sm">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">1. AI Matching</h3>
              <p className="text-zinc-600">We analyze your request and instantly notify the nearest available professionals who specialize in your exact issue.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-zinc-200 text-center shadow-sm relative">
              <div className="hidden md:block absolute top-1/2 -left-4 w-8 border-t-2 border-dashed border-zinc-300"></div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-zinc-300"></div>
              <div className="w-16 h-16 bg-[#4C1D95]/10 text-[#4C1D95] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">2. Fast Approval</h3>
              <p className="text-zinc-600">You receive profiles, ETAs, and emergency rates within minutes. Review their credentials and approve the dispatch.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-zinc-200 text-center shadow-sm">
              <div className="w-16 h-16 bg-emerald-100 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 fill-current" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">3. Rapid Resolution</h3>
              <p className="text-zinc-600">The professional arrives onsite, completes the repair, and payment is handled securely through the platform.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmergencyServices;


