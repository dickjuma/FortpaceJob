import React, { useState } from 'react';
import { Shield, Smartphone, Mail, FileText, CheckCircle, AlertTriangle, Building, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VerificationCenterPage() {
  const [verifications] = useState([
    { id: 'email', title: 'Email Verification', status: 'verified', icon: Mail, description: 'Verify your email to receive important notifications.' },
    { id: 'phone', title: 'Phone Number Verification', status: 'verified', icon: Smartphone, description: 'Add a layer of security to your account.' },
    { id: 'id', title: 'Government ID Verification', status: 'pending', icon: FileText, description: 'Required for taking on jobs larger than $5,000.' },
    { id: 'business', title: 'Business Verification', status: 'unverified', icon: Building, description: 'Verify your company details to act as an Agency.' },
  ]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
          <Shield className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Center</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Complete verification steps to unlock higher limits, build trust, and win more enterprise clients.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Trust Level: Tier 2 (Standard)</span>
          <span className="text-sm font-medium text-brand-600 dark:text-brand-400">50% Complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
          <div className="bg-brand-600 h-2.5 rounded-full" style={{ width: '50%' }}></div>
        </div>
      </div>

      <div className="space-y-4">
        {verifications.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-start">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 ${
                item.status === 'verified' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                item.status === 'pending' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' :
                'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  {item.title}
                  {item.status === 'verified' && <CheckCircle className="w-4 h-4 ml-2 text-green-500" />}
                  {item.status === 'pending' && <AlertTriangle className="w-4 h-4 ml-2 text-yellow-500" />}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0 w-full sm:w-auto flex justify-end">
              {item.status === 'verified' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Verified
                </span>
              ) : item.status === 'pending' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  In Review (24h)
                </span>
              ) : (
                <Link to="/verification/identity" className="flex items-center px-4 py-2 bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400 hover:bg-brand-100 rounded-lg text-sm font-medium transition-colors border border-brand-200 dark:border-brand-800/50">
                  Start Verification <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
