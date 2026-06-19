import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MessageSquare, Scale, Paperclip, CheckCircle } from 'lucide-react';

export default function DisputeCenter() {
  const [disputes] = useState([
    { id: 'DSP-4921', contract: 'Enterprise Dashboard Redesign', status: 'under_review', amount: 2500, date: 'Nov 12, 2026', against: 'Sarah Jenkins' },
  ]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Scale className="w-6 h-6 mr-3 text-[#4C1D95]" /> Dispute Center
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage active disputes and track arbitration status.</p>
        </div>
        <button className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-200 dark:border-red-900/50">
          Open New Dispute
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold mb-4">Active Disputes</h2>
          {disputes.map(dispute => (
            <div key={dispute.id} className="bg-white dark:bg-gray-900 border border-[#4C1D95]/20 dark:border-[#4C1D95]/20 rounded-xl p-5 shadow-sm cursor-pointer relative overflow-hidden">
              <div className="absolute left-0 top-0 w-1 h-full bg-[#4C1D95]"></div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-[#4C1D95] dark:text-[#4C1D95] uppercase tracking-wider">{dispute.id}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  Under Review
                </span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white truncate">{dispute.contract}</h3>
              <p className="text-sm text-gray-500 mt-1">Vs. {dispute.against}</p>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between text-sm">
                <span className="font-medium text-gray-900 dark:text-white">${dispute.amount} in dispute</span>
                <span className="text-gray-500">{dispute.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm flex flex-col h-[600px]">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">DSP-4921 Resolution Thread</h2>
              <p className="text-sm text-gray-500 mt-1">Admin arbitration assigned to: Alex M. (Moderator)</p>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-surface dark:bg-gray-950 space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-200 dark:border-gray-800 text-sm">
                  <p className="font-bold mb-1">You opened this dispute</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">The delivered frontend code does not meet the performance criteria established in Milestone 2. Page load times exceed the 2-second threshold.</p>
                  <div className="flex items-center gap-2 text-[#4C1D95]">
                    <Paperclip className="w-4 h-4" /> <span className="font-medium">lighthouse_report.pdf</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 flex-row-reverse">
                <div className="w-10 h-10 rounded-full bg-[#4C1D95]/10 text-[#4C1D95] flex items-center justify-center shrink-0 text-sm font-bold">
                  SJ
                </div>
                <div className="bg-[#4C1D95]/5 dark:bg-[#4C1D95]/20 p-4 rounded-2xl rounded-tr-none shadow-sm border border-[#4C1D95]/20 dark:border-[#4C1D95]/20/50 text-sm">
                  <p className="font-bold mb-1">Sarah Jenkins</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">The performance drop is due to the unoptimized 3D assets the client insisted on uploading to the hero section. My code matches the spec.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#4C1D95]/10 text-[#4C1D95] flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div className="bg-[#4C1D95]/5 dark:bg-[#4C1D95]/20 p-4 rounded-2xl rounded-tl-none shadow-sm border border-[#4C1D95]/50 dark:border-[#4C1D95]/50/50 text-sm w-full">
                  <p className="font-bold mb-1 text-[#4C1D95] dark:text-[#4C1D95]">Admin Response</p>
                  <p className="text-gray-600 dark:text-gray-400">We are reviewing the attached evidence and the commit history. We will issue a decision within 48 hours.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <button className="text-gray-400 hover:text-gray-600">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input 
                  type="text" 
                  placeholder="Type a message or provide more evidence..." 
                  className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4C1D95] outline-none"
                />
                <button className="p-3 bg-[#4C1D95] hover:bg-[#22C55E] text-white rounded-xl transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


