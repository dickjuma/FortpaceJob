import React, { useMemo } from 'react';
import { Shield, Smartphone, Mail, FileText, CheckCircle, AlertTriangle, Building, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBusinessVerification } from '../hooks/useVerification';
import { Skeleton, Alert } from 'antd';

export default function VerificationCenterPage() {
  const { data: businessVerifications, isLoading, isError, error } = useBusinessVerification();

  const businessVerificationRecord = useMemo(() => {
    if (!businessVerifications || !businessVerifications.length) return null;
    // Get the most recent one
    return businessVerifications[0];
  }, [businessVerifications]);

  const verifications = useMemo(() => [
    { id: 'email', title: 'Email Verification', status: 'verified', icon: Mail, description: 'Verify your email to receive important notifications.', path: '#' },
    { id: 'phone', title: 'Phone Number Verification', status: 'verified', icon: Smartphone, description: 'Add a layer of security to your account.', path: '#' },
    { id: 'id', title: 'Government ID Verification', status: 'pending', icon: FileText, description: 'Required for taking on jobs larger than $5,000.', path: '/verification/identity' },
    { 
      id: 'business', 
      title: 'Business Verification', 
      status: businessVerificationRecord ? businessVerificationRecord.status.toLowerCase() : 'unverified', 
      icon: Building, 
      description: 'Verify your company details to act as an Agency.',
      path: '/verification/business'
    },
  ], [businessVerificationRecord]);

  const completedCount = verifications.filter(v => v.status === 'verified').length;
  const progressPercent = Math.round((completedCount / verifications.length) * 100);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Skeleton active avatar paragraph={{ rows: 2 }} />
        <Skeleton active paragraph={{ rows: 4 }} className="mt-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Alert message="Error loading verification status" description={error?.message || 'Failed to connect to backend.'} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="w-16 h-16 bg-[#4C1D95]/10 dark:bg-[#4C1D95]/30 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
          <Shield className="w-8 h-8 text-[#4C1D95] dark:text-[#4C1D95]" />
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
          <span className="text-sm font-medium text-[#4C1D95] dark:text-[#4C1D95]">{progressPercent}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
          <div className="bg-[#4C1D95] h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="space-y-4">
        {verifications.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between transition-colors hover:border-[#4C1D95]/30">
            <div className="flex items-start">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 ${
                item.status === 'verified' || item.status === 'approved' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                item.status === 'pending' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' :
                item.status === 'rejected' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  {item.title}
                  {(item.status === 'verified' || item.status === 'approved') && <CheckCircle className="w-4 h-4 ml-2 text-green-500" />}
                  {item.status === 'pending' && <AlertTriangle className="w-4 h-4 ml-2 text-yellow-500" />}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0 w-full sm:w-auto flex justify-end">
              {(item.status === 'verified' || item.status === 'approved') ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Verified
                </span>
              ) : item.status === 'pending' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  In Review (24h)
                </span>
              ) : item.status === 'rejected' ? (
                <Link to={item.path} className="flex items-center px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors border border-red-200 dark:border-red-800/50">
                  Action Required <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              ) : (
                <Link to={item.path} className="flex items-center px-4 py-2 bg-[#4C1D95]/5 text-[#4C1D95] dark:bg-[#4C1D95]/20 dark:text-[#4C1D95] hover:bg-[#4C1D95]/10 rounded-lg text-sm font-medium transition-colors border border-[#4C1D95]/20 dark:border-[#4C1D95]/20/50">
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
