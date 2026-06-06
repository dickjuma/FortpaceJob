import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, AlertTriangle, ShieldCheck, MessageSquare, DollarSign, List, Download } from 'lucide-react';

export default function ContractDashboard({ contractId }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'milestones', label: 'Milestones', icon: List },
    { id: 'files', label: 'Files', icon: Download },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="w-full font-sans">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-900/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">Active</span>
                <span className="text-sm text-gray-500 font-medium">Contract #CON-3928</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enterprise Dashboard Redesign</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-4">
                <p className="text-xs text-gray-500 font-medium uppercase">Total Budget</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">$12,500.00</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-surface dark:hover:bg-gray-800 transition-colors">
                End Contract
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800 px-6">
          <div className="flex gap-6 overflow-x-auto custom-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors flex items-center whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-[#4C1D95]/20 text-[#4C1D95] dark:text-[#4C1D95]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 bg-surface dark:bg-gray-950 min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Progress</h3>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">2 of 5 Milestones Completed</span>
                    <span className="font-bold text-[#4C1D95]">40%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div className="bg-[#4C1D95] h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Scope of Work</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    Design and develop a complete overhaul of the existing enterprise dashboard. This includes new data visualizations, real-time socket integrations, and responsive layouts across all mobile viewports.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Escrow Status</h3>
                  <div className="flex items-center gap-3 p-3 bg-[#4C1D95]/5 dark:bg-[#4C1D95]/20 rounded-lg border border-[#4C1D95]/20 dark:border-[#4C1D95]/20/50">
                    <ShieldCheck className="w-6 h-6 text-[#4C1D95]" />
                    <div>
                      <p className="text-xs text-gray-500">Funded in Escrow</p>
                      <p className="font-bold text-gray-900 dark:text-white">$2,500.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


