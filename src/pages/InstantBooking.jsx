import React from 'react';
import { Zap, Clock, ShieldCheck, CheckCircle2, ChevronRight, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstantBooking = () => {
  return (
    <>
      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 fill-current" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-6">Instant Booking</h1>
            <p className="text-lg text-zinc-600">
              Skip the negotiation and proposal phases. Instantly book verified freelancers who offer pre-packaged services with guaranteed delivery timelines.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left: Product Selection */}
            <div className="lg:w-2/3">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Available Instant Packages</h2>
              
              <div className="space-y-6">
                {[
                  { title: 'Full Website Audit & SEO Fix', time: '48 Hours', price: '$450', pro: 'Sarah W.', rating: '4.9' },
                  { title: 'UI/UX Mobile App Wireframes (5 Screens)', time: '3 Days', price: '$850', pro: 'Elena R.', rating: '5.0' },
                  { title: 'React Performance Optimization', time: '24 Hours', price: '$600', pro: 'David C.', rating: '4.8' }
                ].map((pkg, i) => (
                  <div key={i} className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm hover:border-brand-300 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded">Guaranteed Delivery</span>
                        <span className="flex items-center gap-1 text-xs font-bold text-zinc-500"><Clock className="w-3 h-3" /> {pkg.time}</span>
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900 mb-2">{pkg.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        By <span className="font-bold text-zinc-900 flex items-center gap-1">{pkg.pro} <ShieldCheck className="w-3 h-3 text-brand-500" /></span> • ⭐ {pkg.rating}
                      </div>
                    </div>
                    <div className="text-right w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-zinc-100 pt-4 sm:pt-0 sm:pl-6">
                      <div className="text-2xl font-black text-zinc-900 mb-3">{pkg.price}</div>
                      <button className="w-full sm:w-auto px-6 py-2.5 bg-surface-dark hover:bg-zinc-800 text-white font-bold rounded-xl transition-colors">
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Checkout Sidebar */}
            <div className="lg:w-1/3">
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xl sticky top-24">
                <h3 className="text-xl font-bold text-zinc-900 mb-6">Order Summary</h3>
                
                <div className="bg-surface border border-zinc-100 rounded-xl p-4 mb-6">
                  <div className="text-sm font-bold text-zinc-900 mb-1">React Performance Optimization</div>
                  <div className="text-xs text-zinc-500 mb-3">By David C. • 24hr Delivery</div>
                  <div className="flex justify-between items-center font-black text-lg">
                    <span>Total</span>
                    <span>$600.00</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-2 text-sm text-zinc-600">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span>Funds held securely in escrow until delivery is approved.</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-zinc-600">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span>100% money-back guarantee if timeline is missed.</span>
                  </div>
                </div>

                <button className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5" /> Pay Securely & Start
                </button>
                <div className="text-center text-xs text-zinc-400 font-medium">
                  SSL Encrypted Checkout via Stripe
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default InstantBooking;
