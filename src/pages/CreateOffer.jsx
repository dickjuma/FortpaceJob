import React, { useState } from 'react';
import { Send, Settings, FileText, CheckCircle2, Clock, Plus, Trash2, Calendar, Edit3, X, Paperclip } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateOffer = () => {
  const [offerType, setOfferType] = useState('milestone');
  
  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Create Custom Offer for Sarah Jenkins</h1>
            <p className="text-zinc-600">Propose custom terms, milestones, and deliverables before finalizing a contract.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            
            <div className="flex-1 space-y-6">
              
              {/* Job Association */}
              <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-zinc-900">Related Job</h3>
                  <button className="text-sm text-[#2bb75c] font-medium">Change Job</button>
                </div>
                <div className="p-4 bg-surface rounded-xl border border-zinc-200">
                  <h4 className="font-semibold text-zinc-900 mb-1">E-commerce App Frontend Redesign</h4>
                  <p className="text-sm text-zinc-500">Fixed-price • Posted 2 days ago</p>
                </div>
              </div>

              {/* Offer Terms */}
              <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
                <h3 className="font-bold text-zinc-900 mb-4">Offer Terms</h3>
                
                <div className="flex p-1 bg-zinc-100 rounded-xl mb-6 w-full max-w-md">
                  <button 
                    onClick={() => setOfferType('milestone')}
                    className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${offerType === 'milestone' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'}`}
                  >
                    Pay by Milestones
                  </button>
                  <button 
                    onClick={() => setOfferType('project')}
                    className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${offerType === 'project' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'}`}
                  >
                    Pay for Entire Project
                  </button>
                </div>

                <div className="space-y-4">
                  {offerType === 'milestone' ? (
                    <div className="p-4 border border-[#2bb75c]/20 bg-[#2bb75c]/5/50 rounded-xl space-y-4">
                      <div className="flex justify-between items-end gap-4">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-zinc-700 mb-1">Milestone 1: Wireframes</label>
                          <input type="text" defaultValue="Deliver initial wireframes for homepage" className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2bb75c]/20" />
                        </div>
                        <div className="w-32">
                          <label className="block text-xs font-medium text-zinc-700 mb-1">Amount</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-500">$</span>
                            <input type="number" defaultValue="500" className="w-full bg-white border border-zinc-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-[#2bb75c]/20" />
                          </div>
                        </div>
                        <div className="w-32">
                          <label className="block text-xs font-medium text-zinc-700 mb-1">Due Date</label>
                          <input type="date" className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2bb75c]/20 text-zinc-600" />
                        </div>
                        <button className="p-2 text-zinc-400 hover:text-rose-500 mb-0.5"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <button className="text-sm font-medium text-[#2bb75c] flex items-center gap-1 hover:text-[#2bb75c]">
                        <Plus className="w-4 h-4" /> Add another milestone
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Total Project Amount</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-500">$</span>
                          <input type="number" placeholder="0.00" className="w-full bg-surface border border-zinc-300 rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:border-[#2bb75c]/20 focus:bg-white" />
                        </div>
                      </div>
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Estimated Completion</label>
                        <input type="date" className="w-full bg-surface border border-zinc-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#2bb75c]/20 focus:bg-white text-zinc-600" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Work Details & Attachments */}
              <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
                <h3 className="font-bold text-zinc-900 mb-4">Deliverables & Requirements</h3>
                <div className="mb-4">
                  <textarea rows="4" placeholder="Detail exactly what needs to be delivered for this offer..." className="w-full bg-surface border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#2bb75c]/20 focus:bg-white"></textarea>
                </div>
                
                <div className="border border-dashed border-zinc-300 rounded-xl p-6 text-center hover:bg-surface transition-colors cursor-pointer">
                  <Paperclip className="w-6 h-6 mx-auto text-zinc-400 mb-2" />
                  <p className="text-sm font-medium text-zinc-700">Click to upload files</p>
                  <p className="text-xs text-zinc-500 mt-1">Attach project briefs, designs, or assets (Max 25MB)</p>
                </div>
              </div>

            </div>

            {/* Preview Sidebar */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="bg-surface-dark text-white rounded-2xl p-6 shadow-xl sticky top-24">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#2bb75c]" /> Offer Preview
                </h3>
                
                <div className="space-y-4 text-sm mb-6 pb-6 border-b border-zinc-700">
                  <div className="flex justify-between text-zinc-300">
                    <span>Freelancer</span>
                    <span className="font-medium text-white">Sarah Jenkins</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Offer Type</span>
                    <span className="font-medium text-white">{offerType === 'milestone' ? 'Milestone-based' : 'Fixed Project'}</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Revisions included</span>
                    <span className="font-medium text-white">2</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-zinc-300">Total Offer Value</span>
                  <span className="text-2xl font-bold text-white">$500.00</span>
                </div>

                <div className="space-y-3 mb-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="mt-0.5 w-4 h-4 rounded border border-zinc-600 bg-zinc-800 flex items-center justify-center group-hover:border-[#2bb75c]/20">
                      <CheckCircle2 className="w-3 h-3 text-[#2bb75c] opacity-0" />
                    </div>
                    <span className="text-xs text-zinc-400 leading-snug">I understand that I am making a formal offer that the freelancer can accept to start a contract.</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="mt-0.5 w-4 h-4 rounded border border-zinc-600 bg-zinc-800 flex items-center justify-center group-hover:border-[#2bb75c]/20">
                      <CheckCircle2 className="w-3 h-3 text-[#2bb75c] opacity-0" />
                    </div>
                    <span className="text-xs text-zinc-400 leading-snug">Require freelancer to agree to Non-Disclosure Agreement (NDA) before viewing.</span>
                  </label>
                </div>

                <Link to="/contract/preview" className="w-full flex justify-center items-center gap-2 py-3.5 bg-[#2bb75c] hover:bg-[#1d8d38] text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/50">
                  <Send className="w-4 h-4" /> Send Offer
                </Link>
                <div className="text-center mt-3">
                  <button className="text-xs text-zinc-400 hover:text-white transition-colors">Save as Draft</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default CreateOffer;

