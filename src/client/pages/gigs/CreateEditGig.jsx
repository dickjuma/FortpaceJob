import React, { useState } from 'react';
import { Upload, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateEditGig = () => {
  const [step, setStep] = useState(1);

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          
          <div className="mb-8">
            <h1 className="text-3xl font-black text-zinc-900">Create a New Gig</h1>
            <p className="text-zinc-600 font-medium mt-1">Package your skills into a productized service.</p>
          </div>

          {/* Stepper */}
          <div className="flex items-center mb-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-200 -tranzinc-y-1/2 z-0"></div>
            <div className="absolute top-1/2 left-0 h-1 bg-success -tranzinc-y-1/2 z-0 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
            
            <div className="w-full flex justify-between relative z-10">
              {[1, 2, 3, 4].map(num => (
                <div key={num} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    step > num ? 'bg-success text-white' : 
                    step === num ? 'bg-success text-white ring-4 ring-emerald-100' : 'bg-white border-2 border-zinc-200 text-zinc-400'
                  }`}>
                    {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
                  </div>
                  <span className={`text-xs font-bold ${step >= num ? 'text-zinc-900' : 'text-zinc-400'}`}>
                    {['Overview', 'Pricing', 'Gallery', 'Publish'][num - 1]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-10 shadow-sm">
            
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Gig Title</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -tranzinc-y-1/2 font-medium text-zinc-400">I will</span>
                    <input type="text" placeholder="do something I'm really good at" className="w-full pl-16 pr-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-zinc-900" />
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">Max 80 characters. Keep it short and descriptive.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-2">Category</label>
                    <select className="w-full px-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium text-zinc-900 cursor-pointer">
                      <option>Graphics & Design</option>
                      <option>Programming & Tech</option>
                      <option>Digital Marketing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-2">Subcategory</label>
                    <select className="w-full px-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium text-zinc-900 cursor-pointer">
                      <option>Logo Design</option>
                      <option>Web & Mobile Design</option>
                      <option>Illustration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Search Tags</label>
                  <input type="text" placeholder="Add up to 5 tags (e.g. minimalist logo, modern design)" className="w-full px-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-zinc-900" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="font-bold text-zinc-900 mb-4">Set your packages and pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Basic', 'Standard', 'Premium'].map((tier, idx) => (
                    <div key={tier} className={`border rounded-2xl p-5 ${idx === 1 ? 'border-emerald-500 shadow-md relative' : 'border-zinc-200'}`}>
                      {idx === 1 && <span className="absolute -top-3 left-1/2 -tranzinc-x-1/2 bg-success text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Recommended</span>}
                      <h4 className="font-black text-zinc-900 text-center mb-4">{tier}</h4>
                      <input type="text" placeholder="Name your package" className="w-full px-3 py-2 bg-surface border border-zinc-200 rounded-lg text-sm mb-3 focus:border-emerald-500 outline-none" />
                      <textarea placeholder="Describe the details of your offering..." rows="3" className="w-full px-3 py-2 bg-surface border border-zinc-200 rounded-lg text-sm mb-3 focus:border-emerald-500 outline-none resize-none"></textarea>
                      <select className="w-full px-3 py-2 bg-surface border border-zinc-200 rounded-lg text-sm mb-3 focus:border-emerald-500 outline-none cursor-pointer">
                        <option>Delivery Time</option>
                        <option>1 Day</option>
                        <option>3 Days</option>
                        <option>7 Days</option>
                      </select>
                      <div className="relative mt-4">
                        <span className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-500 font-bold">$</span>
                        <input type="number" placeholder="Price" className="w-full pl-8 pr-3 py-2 bg-surface border border-zinc-200 rounded-lg text-sm focus:border-emerald-500 outline-none font-bold" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-zinc-900 mb-1">Gig Gallery</h3>
                  <p className="text-sm text-zinc-500 mb-4">Upload images that showcase your service. The first image will be your Gig thumbnail.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="aspect-video bg-surface border-2 border-dashed border-emerald-300 hover:bg-emerald-50 hover:border-emerald-500 transition-colors rounded-xl flex flex-col items-center justify-center cursor-pointer text-success relative overflow-hidden group">
                      <Upload className="w-6 h-6 mb-2" />
                      <span className="text-xs font-bold text-center px-2">Browse Image</span>
                    </div>
                    {[1, 2, 3].map(box => (
                      <div key={box} className="aspect-video bg-surface border border-zinc-200 rounded-xl flex flex-col items-center justify-center text-zinc-400">
                        <span className="text-xs font-medium">Empty slot</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <hr className="border-zinc-100" />
                
                <div>
                  <h3 className="font-bold text-zinc-900 mb-1">Detailed Description</h3>
                  <p className="text-sm text-zinc-500 mb-4">Briefly describe what buyers will receive.</p>
                  <textarea rows="6" placeholder="Welcome to my gig! Here is what you get..." className="w-full px-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-medium text-zinc-900 resize-none"></textarea>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-emerald-100 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-zinc-900 mb-2">Almost there!</h3>
                <p className="text-zinc-600 mb-8 max-w-md mx-auto">Your gig is ready to be published. Once live, buyers across Fortspace can start purchasing your service.</p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto text-left mb-8 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-sm font-medium text-amber-800">By publishing, you agree to our terms of service and guarantee that all portfolio items uploaded belong to you.</p>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-zinc-100">
              <button 
                onClick={() => setStep(Math.max(1, step - 1))}
                className={`px-6 py-2.5 font-bold text-zinc-600 hover:text-zinc-900 transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
              >
                Back
              </button>
              
              {step < 4 ? (
                <button 
                  onClick={() => setStep(Math.min(4, step + 1))}
                  className="px-8 py-3 bg-surface-dark hover:bg-zinc-800 text-white font-bold rounded-xl shadow-sm transition-colors"
                >
                  Save & Continue
                </button>
              ) : (
                <Link 
                  to="/gigs/my-gigs"
                  className="px-8 py-3 bg-success hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  Publish Gig Now
                </Link>
              )}
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default CreateEditGig;
