import React, { useState } from 'react';
import { Building2, User, MapPin, Briefcase, Star, ShieldCheck, CheckCircle } from 'lucide-react';

export default function ClientProfilePage() {
  const [isCorporate] = useState(true); // Can be driven by user data

  const clientData = {
    name: isCorporate ? 'Acme Global Technologies' : 'Sarah Jenkins',
    legalEntityName: isCorporate ? 'Acme Global Tech LLC' : '',
    type: isCorporate ? 'Enterprise' : 'Individual',
    hqLocation: 'New York, USA',
    industry: 'Financial Technology',
    employees: '500-1000',
    totalSpent: '$1.2M+',
    jobsPosted: 145,
    hires: 89,
    activeJobs: 4,
    rating: 4.9,
    reviews: 128,
    verified: true,
    ssoEnabled: isCorporate,
    averageResponseTime: '2 hours',
    memberSince: '2019',
    about: isCorporate 
      ? 'Acme Global Technologies is a leading provider of enterprise financial solutions. We regularly hire top-tier freelance talent to augment our engineering, design, and product teams for strategic initiatives.'
      : 'I am an independent entrepreneur building consumer mobile applications. I look for reliable, high-quality freelance partners for long-term collaboration.'
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-zinc-800 to-gray-900"></div>
        <div className="px-6 sm:px-10 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end space-x-5">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-800 flex items-center justify-center text-3xl font-bold text-gray-500 overflow-hidden shadow-sm">
                  {isCorporate ? <Building2 className="w-12 h-12 text-brand-600" /> : <User className="w-12 h-12 text-brand-600" />}
                </div>
                {clientData.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-900 rounded-full p-1">
                    <ShieldCheck className="w-6 h-6 text-brand-500" />
                  </div>
                )}
              </div>
              <div className="pb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  {clientData.name}
                </h1>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {clientData.industry} • Member since {clientData.memberSince}
                </p>
              </div>
            </div>
            <div className="pb-2 flex space-x-3">
              <button className="px-4 py-2 bg-brand-600 text-white font-medium text-sm rounded-lg shadow-sm shadow-brand-500/30 hover:bg-brand-700 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> HQ: {clientData.hqLocation}</div>
              {isCorporate && <div className="flex items-center"><Users className="w-4 h-4 mr-2" /> {clientData.employees} Employees</div>}
              <div className="flex items-center"><Briefcase className="w-4 h-4 mr-2" /> {clientData.activeJobs} Active Jobs</div>
              <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Response Time: {clientData.averageResponseTime}</div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-500 font-medium">Total Spent</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{clientData.totalSpent}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500 font-medium">Hires / Posted</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{clientData.hires} / {clientData.jobsPosted}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500 font-medium">Client Rating</p>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">{clientData.rating}</span>
                <span className="ml-1 text-sm text-gray-500">({clientData.reviews})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About the Client</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {clientData.about}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Reviews from Freelancers</h2>
            </div>
            <ul className="divide-y divide-gray-100 dark:divide-gray-800 p-6">
              {[1, 2].map(item => (
                <li key={item} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></div>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">5.0</span>
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Senior React Developer for Enterprise Dashboard</h4>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">"Excellent client to work with. Very clear requirements, prompt communication, and quick payments. Highly recommended for any senior developer looking for a professional engagement."</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Verification Status</h2>
            <ul className="space-y-4">
              <li className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Identity Verified
              </li>
              <li className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Payment Method Verified
              </li>
              <li className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Email Verified
              </li>
              {isCorporate && (
                <>
                  <li className="flex items-center justify-between text-sm font-medium text-gray-900 dark:text-white">
                    <span className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Business Entity Verified</span>
                    <span className="text-xs text-gray-500">{clientData.legalEntityName}</span>
                  </li>
                  {clientData.ssoEnabled && (
                    <li className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                      <ShieldCheck className="w-5 h-5 text-brand-500 mr-3" /> Enterprise SSO Enabled
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Internal mock for Users icon
const Users = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
