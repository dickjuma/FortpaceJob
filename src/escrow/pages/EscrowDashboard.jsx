import React, { useState } from 'react';
import { DollarSign, ShieldCheck, ArrowUpRight, ArrowDownRight, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EscrowDashboard() {
  const [balance] = useState(24500.00);
  const [inEscrow] = useState(12450.00);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Escrow & Financials</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage deposits, milestone releases, and view secure transaction history.</p>
        </div>
        <Link to="/escrow/deposit" className="inline-flex items-center px-4 py-2 bg-[#14a800] hover:bg-[#118a00] text-white rounded-lg text-sm font-medium transition-colors">
          <DollarSign className="w-4 h-4 mr-2" /> Add Funds
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Available Balance</h3>
            <div className="w-8 h-8 rounded-full bg-[#14a800]/5 dark:bg-[#14a800]/20 text-[#14a800] dark:text-[#14a800] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">${balance.toLocaleString()}</div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+12.5%</span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldCheck className="w-24 h-24 text-[#14a800]" />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total in Escrow</h3>
            <div className="w-8 h-8 rounded-full bg-[#14a800]/5 dark:bg-[#14a800]/20 text-[#14a800] dark:text-[#14a800] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white relative z-10">${inEscrow.toLocaleString()}</div>
          <div className="mt-4 flex items-center text-sm relative z-10">
            <span className="text-gray-500">Secured across 4 active contracts</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Approvals</h3>
            <div className="w-8 h-8 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">2</div>
          <div className="mt-4 flex items-center text-sm">
            <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-yellow-500 font-medium">Action Required</span>
            <span className="text-gray-500 ml-2">Milestones await review</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Escrow Activity</h2>
          <button className="text-sm font-medium text-[#14a800] dark:text-[#14a800] hover:text-[#14a800]">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              <tr>
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900 dark:text-white">Funded Escrow - Mobile App</p>
                  <p className="text-gray-500 text-xs">Contract #CON-8472</p>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">$4,500.00</td>
                <td className="px-6 py-4 text-gray-500">May 18, 2026</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#14a800]/5 text-[#14a800] dark:bg-[#14a800]/30 dark:text-[#14a800]">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Secured
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900 dark:text-white">Milestone Released - UI Design</p>
                  <p className="text-gray-500 text-xs">Contract #CON-3391</p>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">$1,200.00</td>
                <td className="px-6 py-4 text-gray-500">May 15, 2026</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="w-3 h-3 mr-1" /> Released
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
