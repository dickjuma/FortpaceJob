// @ts-nocheck
import React, { useState } from 'react';
import { AlertTriangle, Users, Flag, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

export default function AdminModerationDashboard() {
  const [flags] = useState([
    { id: 1, type: 'Suspicious Job Post', user: 'Client_9942', risk: 'High', date: '10 min ago', details: 'Requests payment outside of escrow platform.' },
    { id: 2, type: 'Multiple Failed Logins', user: 'Freelancer_84', risk: 'Medium', date: '1 hr ago', details: '15 failed attempts from new IP in Russia.' },
  ]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <ShieldAlert className="w-8 h-8 mr-3 text-red-600" /> Moderation Command Center
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review and adjudicate flagged accounts, disputes, and compliance violations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm border-l-4 border-l-red-500">
          <div className="flex items-center text-red-600 mb-2"><AlertTriangle className="w-5 h-5 mr-2" /> <span className="font-semibold text-gray-900 dark:text-white">Active Fraud Alerts</span></div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">12</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-yellow-100 dark:border-yellow-900/30 shadow-sm border-l-4 border-l-yellow-500">
          <div className="flex items-center text-yellow-600 mb-2"><Flag className="w-5 h-5 mr-2" /> <span className="font-semibold text-gray-900 dark:text-white">Pending Disputes</span></div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">45</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-brand-100 dark:border-brand-900/30 shadow-sm border-l-4 border-l-blue-500">
          <div className="flex items-center text-brand-600 mb-2"><Users className="w-5 h-5 mr-2" /> <span className="font-semibold text-gray-900 dark:text-white">KYC Queue</span></div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">128</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">High Priority Review Queue</h2>
        </div>
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {flags.map((flag) => (
            <li key={flag.id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center mb-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3 ${flag.risk === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {flag.risk} Risk
                    </span>
                    <h3 className="text-md font-bold text-gray-900 dark:text-white">{flag.type}</h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Actor: <span className="font-medium text-gray-900 dark:text-white">{flag.user}</span> • {flag.date}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 bg-surface dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <strong className="text-gray-900 dark:text-white">System Note:</strong> {flag.details}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-surface dark:hover:bg-gray-800 flex items-center text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Dismiss
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center shadow-sm">
                    <XCircle className="w-4 h-4 mr-2" /> Suspend User
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
