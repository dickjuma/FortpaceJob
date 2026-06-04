import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function KYCManagementPage() {
  const [kycStatus] = useState('pending'); // 'unverified', 'pending', 'verified'

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">KYC & Compliance</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your Know Your Customer documents and compliance status.
          </p>
        </div>
        {kycStatus === 'verified' && (
          <span className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-full text-sm font-bold border border-green-200 dark:border-green-800">
            <CheckCircle className="w-4 h-4 mr-2" /> KYC Verified
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-[#2bb75c]" /> Submitted Documents
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center mr-4">
                    <FileText className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Passport - Front.jpg</p>
                    <p className="text-xs text-gray-500">Submitted on May 18, 2026</p>
                  </div>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
                  Under Review
                </span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <Link to="/verification/identity" className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-surface dark:hover:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                Submit Additional Docs
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#2bb75c] to-[#1d8d38] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="w-24 h-24" />
            </div>
            <h3 className="font-bold text-lg mb-2 relative z-10">Why we need this</h3>
            <p className="text-[#2bb75c] text-sm mb-4 relative z-10">
              KYC helps us prevent fraud, money laundering, and ensure a secure escrow environment for all participants.
            </p>
            <ul className="text-sm text-[#2bb75c] space-y-2 relative z-10">
              <li className="flex items-start"><Lock className="w-4 h-4 mr-2 mt-0.5" /> Secure Escrow</li>
              <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 mt-0.5" /> High-Value Contracts</li>
              <li className="flex items-start"><Clock className="w-4 h-4 mr-2 mt-0.5" /> Faster Withdrawals</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

