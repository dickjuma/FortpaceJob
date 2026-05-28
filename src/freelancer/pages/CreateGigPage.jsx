import React, { useState } from 'react';
import { Package, DollarSign, Clock, CheckCircle, ChevronRight, Image as ImageIcon, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function CreateGigPage() {
  const [step, setStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setIsPublished(true);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <Toaster position="top-center" />
      <div className="mb-8">
        <Link to="/freelancer/gigs" className="text-sm font-medium text-brand-600 hover:text-brand-500 mb-4 inline-block">
          ← Back to My Gigs
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create a New Gig</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Package your services into ready-to-buy tiers.</p>
      </div>

      <div className="flex mb-8 space-x-2">
        {['Overview', 'Pricing', 'Gallery', 'Publish'].map((label, idx) => (
          <div key={idx} className="flex-1">
            <div className={`h-2 w-full rounded-full mb-2 ${step > idx ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-800'}`}></div>
            <p className={`text-xs font-bold text-center ${step > idx ? 'text-brand-600' : 'text-gray-400'}`}>{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Gig Title</label>
              <div className="flex items-center text-xl font-bold text-gray-900 dark:text-white mb-2">
                <span className="mr-2 text-gray-400">I will</span>
                <input 
                  type="text" 
                  placeholder="build a custom enterprise React dashboard"
                  className="w-full border-b-2 border-gray-200 dark:border-gray-700 bg-transparent py-2 focus:border-brand-500 focus:outline-none focus:ring-0 placeholder-gray-300 dark:placeholder-gray-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Category</label>
                <select className="w-full border border-gray-300 dark:border-gray-700 bg-surface dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:ring-brand-500 focus:border-brand-500">
                  <option>Programming & Tech</option>
                  <option>Design</option>
                  <option>Writing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Search Tags</label>
                <input 
                  type="text" 
                  placeholder="react, tailwind, dashboard..."
                  className="w-full border border-gray-300 dark:border-gray-700 bg-surface dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Description</label>
              <textarea 
                rows="6"
                placeholder="Describe what makes your service unique..."
                className="w-full border border-gray-300 dark:border-gray-700 bg-surface dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:ring-brand-500 focus:border-brand-500"
              ></textarea>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Scope & Pricing Tiers</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {['Basic', 'Standard', 'Premium'].map((tier) => (
                <div key={tier} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-surface dark:bg-gray-800/50">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">{tier}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Package Name</label>
                      <input type="text" placeholder={`${tier} Package`} className="w-full border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                      <textarea rows="3" className="w-full border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900"></textarea>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Delivery Time</label>
                        <select className="w-full border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900">
                          <option>1 Day</option><option>3 Days</option><option>7 Days</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Revisions</label>
                        <select className="w-full border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900">
                          <option>1</option><option>3</option><option>Unlimited</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Price (KES)</label>
                      <input type="number" placeholder="50000" className="w-full border-gray-300 dark:border-gray-700 rounded-lg text-lg font-bold bg-white dark:bg-gray-900" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Gallery Showcase</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  onClick={() => toast('Opening file browser...', { icon: '🖼️' })}
                  className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-bold text-gray-500">Upload Image {i}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && isPublished && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-12">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gig Published Successfully!</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
              Your gig is now visible in the marketplace. Clients can now purchase your services instantly.
            </p>
            <Link to="/freelancer/gigs/analytics">
              <button className="px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-sm">
                View Gig Analytics
              </button>
            </Link>
          </div>
        )}

        {!isPublished && (
          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between">
            <button 
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={isPublishing}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm ${step === 1 ? 'invisible' : 'text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'} ${isPublishing ? 'opacity-50' : ''}`}
            >
              Back
            </button>
            
            {step < 4 ? (
              <button 
                onClick={() => setStep(step + 1)}
                className="flex items-center px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-sm"
              >
                Save & Continue <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button 
                onClick={handlePublish}
                disabled={isPublishing}
                className={`flex items-center px-8 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-sm shadow-green-500/30 ${isPublishing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isPublishing ? 'Publishing...' : 'Publish Gig'} {isPublishing ? <Clock className="w-4 h-4 ml-2 animate-spin" /> : <CheckCircle className="w-4 h-4 ml-2" />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
