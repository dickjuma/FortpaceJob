import React, { useState } from 'react';
import { Upload, CheckCircle2, MessageSquare, Clock, FileText, Download, AlertTriangle } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const WorkProgress = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // overview, messages, files

  // Mocking the perspective of a client viewing the progress
  const isClient = true; 

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{orderId || 'ORD-9021'}</span>
                <span className="px-2.5 py-1 bg-brand-100 text-brand-700 border border-brand-200 rounded-lg text-xs font-bold uppercase tracking-wider">In Progress</span>
              </div>
              <h1 className="text-3xl font-black text-zinc-900">Dashboard Rebuild</h1>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 border border-zinc-200 rounded-xl shadow-sm">
              <Clock className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Deadline</div>
                <div className="font-bold text-zinc-900">Nov 15, 2026</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="flex overflow-x-auto border-b border-zinc-200 bg-surface/50">
                  {['overview', 'messages', 'files'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-8 py-4 font-bold text-sm whitespace-nowrap transition-colors border-b-2 capitalize ${activeTab === tab ? 'border-brand-600 text-brand-600 bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-surface'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-6 md:p-8">
                  {activeTab === 'overview' && (
                    <div className="space-y-8">
                      {/* Timeline */}
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900 mb-6">Project Timeline</h3>
                        <div className="relative border-l-2 border-zinc-200 ml-3 space-y-8">
                          
                          <div className="relative pl-6">
                            <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-success border-2 border-white"></div>
                            <div className="font-bold text-zinc-900">Contract Started</div>
                            <div className="text-sm font-medium text-zinc-500">Oct 24, 2026 - Funds deposited in Escrow</div>
                          </div>
                          
                          <div className="relative pl-6">
                            <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-success border-2 border-white"></div>
                            <div className="font-bold text-zinc-900">Requirements Finalized</div>
                            <div className="text-sm font-medium text-zinc-500">Oct 25, 2026 - DevMasterPro confirmed requirements</div>
                          </div>

                          <div className="relative pl-6">
                            <div className="absolute left-[-13px] top-0 bg-brand-100 border-4 border-white rounded-full p-1">
                              <div className="w-3 h-3 bg-brand-600 rounded-full animate-pulse"></div>
                            </div>
                            <div className="font-bold text-brand-600">In Development</div>
                            <div className="text-sm font-medium text-zinc-500">Freelancer is currently working on the deliverables</div>
                          </div>

                          <div className="relative pl-6 opacity-40">
                            <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-zinc-300 border-2 border-white"></div>
                            <div className="font-bold text-zinc-900">Final Delivery</div>
                            <div className="text-sm font-medium text-zinc-500">Awaiting submission</div>
                          </div>
                        </div>
                      </div>

                      {/* Action Box */}
                      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 text-center">
                        <CheckCircle2 className="w-12 h-12 text-brand-600 mx-auto mb-3" />
                        <h4 className="text-lg font-bold text-brand-900 mb-1">Work is in progress</h4>
                        <p className="text-brand-800 text-sm mb-4">Sit tight! DevMasterPro is currently working on your project. You will be notified when deliverables are uploaded.</p>
                        <button className="px-6 py-2.5 bg-white border border-brand-200 hover:bg-brand-100 text-brand-700 font-bold rounded-xl transition-colors text-sm">
                          Request Update
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'messages' && (
                    <div className="h-[400px] flex flex-col justify-end border border-zinc-200 rounded-2xl bg-surface overflow-hidden">
                      <div className="p-4 space-y-4 overflow-y-auto">
                        <div className="flex gap-3 max-w-[80%]">
                          <img src="https://i.pravatar.cc/150?img=11" className="w-8 h-8 rounded-full" alt="Provider" />
                          <div className="bg-white border border-zinc-200 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-zinc-700">
                            Hi! I've started working on the initial layout. I'll have a preview link for you by tomorrow.
                          </div>
                        </div>
                        <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
                          <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center text-white font-bold text-xs">Me</div>
                          <div className="bg-success text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-sm">
                            Sounds great, looking forward to it!
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-white border-t border-zinc-200 flex gap-2">
                        <input type="text" placeholder="Type a message..." className="flex-1 px-4 py-2 bg-zinc-100 border-transparent rounded-xl focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-sm" />
                        <button className="px-4 py-2 bg-brand-600 text-white font-bold rounded-xl">Send</button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'files' && (
                    <div>
                      <div className="border-2 border-dashed border-zinc-300 rounded-2xl p-10 text-center mb-6">
                        <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
                        <div className="font-bold text-zinc-700 mb-1">No files uploaded yet</div>
                        <p className="text-sm text-zinc-500">Deliverables and project files will appear here.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-zinc-900 mb-4">Contract Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-medium">Provider</span>
                    <span className="font-bold text-zinc-900">DevMasterPro</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-medium">Amount</span>
                    <span className="font-bold text-success">$6,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-medium">Escrow Status</span>
                    <span className="font-bold text-zinc-900">Funded</span>
                  </div>
                </div>
                
                <hr className="my-4 border-zinc-100" />
                
                <button onClick={() => navigate(`/find-work/orders/${orderId}/revise`)} className="w-full py-2.5 mb-2 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" /> Request Revision
                </button>
                <button onClick={() => navigate(`/find-work/work/${orderId}/cancel`)} className="w-full py-2.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Cancel Contract
                </button>
              </div>

              {/* Dev Only: Simulate Delivery */}
              <div className="bg-zinc-800 rounded-3xl p-6 shadow-sm text-white">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Dev Tools (Simulate Delivery)</div>
                <button onClick={() => navigate(`/find-work/orders/${orderId}/complete`)} className="w-full py-2.5 bg-success hover:bg-success text-white font-bold rounded-xl transition-colors text-sm">
                  Simulate Final Delivery
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default WorkProgress;
