import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, FileText, Clock, AlertTriangle, 
  CheckCircle2, Upload, MessageSquare, ChevronRight,
  ShieldAlert, DollarSign
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const DISPUTES = [
  {
    id: '#DSP-0921',
    contract: 'Mobile App Redesign',
    client: 'Global Tech LLC',
    amount: '$2,400',
    status: 'In Review',
    deadline: 'May 24, 2026',
    date: 'May 14, 2026',
    isActive: true
  },
  {
    id: '#DSP-0845',
    contract: 'E-commerce API Integration',
    client: 'Sarah Mitchell',
    amount: '$1,200',
    status: 'Resolved in your favor',
    date: 'Apr 02, 2026',
    isActive: false
  }
];

export default function FreelancerDisputeHistoryPage() {
  const [activeTab, setActiveTab] = useState('active'); // active, resolved

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
              <Scale className="w-8 h-8 text-rose-500" /> Dispute Center
            </h1>
            <p className="text-zinc-500 font-medium">Track active disputes, upload evidence, and view resolution history.</p>
          </div>
          
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('active')}
              className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'active' ? "bg-white dark:bg-surface-dark text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
            >
              Active (1)
            </button>
            <button 
              onClick={() => setActiveTab('resolved')}
              className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'resolved' ? "bg-white dark:bg-surface-dark text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
            >
              Resolved (1)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Dispute List */}
        <div className="flex-1 space-y-6">
          
          {DISPUTES.filter(d => activeTab === 'active' ? d.isActive : !d.isActive).map(dispute => (
            <div key={dispute.id} className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
              
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-surface/50 dark:bg-surface-dark/50 flex flex-wrap gap-4 justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{dispute.contract}</h2>
                    <span className={cn(
                      "px-2 py-1 text-xs font-bold rounded-md uppercase tracking-wider",
                      dispute.status === 'In Review' ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" : "bg-emerald-100 text-emerald-700 dark:bg-success/20 dark:text-success"
                    )}>
                      {dispute.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-zinc-500">Client: {dispute.client} • Opened {dispute.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Amount in Escrow</p>
                  <p className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-1 justify-end">
                    <DollarSign className="w-5 h-5 text-success" /> {dispute.amount}
                  </p>
                </div>
              </div>

              {dispute.isActive && (
                <div className="p-6">
                  
                  {/* Timeline */}
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Resolution Timeline</h3>
                    <div className="relative flex justify-between">
                      <div className="absolute top-4 left-0 right-0 h-1 bg-zinc-100 dark:bg-zinc-800 -z-10 rounded-full"></div>
                      <div className="absolute top-4 left-0 w-1/2 h-1 bg-amber-500 -z-10 rounded-full"></div>
                      
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-md"><CheckCircle2 className="w-4 h-4" /></div>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Dispute Opened</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-md">2</div>
                        <span className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase">Mediation</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 flex items-center justify-center font-bold text-xs">3</div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Arbitration</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 flex items-center justify-center font-bold text-xs">4</div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Resolved</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-4 flex gap-4 mb-6">
                    <div className="mt-0.5"><Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" /></div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-900 dark:text-amber-500">Action Required: Submit Evidence</h4>
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mt-1">You have until {dispute.deadline} to submit your response and supporting documents. Failure to respond may result in an automatic ruling for the client.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button className="flex-1 py-3 bg-[#14a800] hover:bg-[#118a00] text-white font-bold rounded-xl shadow-sm transition-all text-sm">
                      Respond & Upload Evidence
                    </button>
                    <button className="px-6 py-3 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl shadow-sm transition-all text-sm">
                      Offer Settlement
                    </button>
                  </div>
                </div>
              )}
              
              {!dispute.isActive && (
                <div className="p-6 bg-emerald-50/50 dark:bg-emerald-900/10">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-success/20 text-success dark:text-success flex items-center justify-center shrink-0">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Ruling Summary</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Based on the evidence provided (commit logs and delivery timestamp), the mediator found that all milestone requirements were met. Full funds of $1,200 have been released to your wallet.</p>
                      <button className="mt-4 text-xs font-bold text-[#14a800] hover:underline flex items-center gap-1">
                        Download Official Ruling PDF <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {DISPUTES.filter(d => activeTab === 'active' ? d.isActive : !d.isActive).length === 0 && (
            <div className="text-center py-24 bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800">
              <ShieldAlert className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No {activeTab} disputes</h3>
              <p className="text-zinc-500">You're doing great! Keep up the good work.</p>
            </div>
          )}

        </div>

        {/* Right Column: Info & Escrow */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          
          <div className="bg-surface-dark dark:bg-zinc-800 rounded-3xl p-6 text-white shadow-xl">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" /> Protection Policy
            </h3>
            <p className="text-sm font-medium text-zinc-400 mb-4 leading-relaxed">
              Forte holds contract funds in escrow. If a client disputes your work, the funds remain frozen until mediation is complete.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm font-bold">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" /> 100% Payment Guarantee for tracked hourly work.
              </li>
              <li className="flex items-start gap-2 text-sm font-bold">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" /> Escrow protection for fixed-price milestones.
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Need Help?</h3>
            <div className="space-y-3">
              <button className="w-full p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-3 hover:bg-surface dark:hover:bg-zinc-800/50 transition-colors text-left">
                <FileText className="w-5 h-5 text-[#14a800] shrink-0" />
                <div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-white">Dispute Guidelines</div>
                  <div className="text-[10px] font-medium text-zinc-500">What evidence to submit</div>
                </div>
              </button>
              <button className="w-full p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-3 hover:bg-surface dark:hover:bg-zinc-800/50 transition-colors text-left">
                <MessageSquare className="w-5 h-5 text-[#14a800] shrink-0" />
                <div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-white">Contact Mediation</div>
                  <div className="text-[10px] font-medium text-zinc-500">Average response: 24hrs</div>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
