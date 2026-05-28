import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Briefcase, Eye, Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardSkeleton } from '../../common/components/SkeletonLoader';

export default function JobsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [jobs] = useState([
    { id: 1, title: 'Senior React Developer for Enterprise Dashboard', type: 'Hourly', budget: '$80 - $120/hr', status: 'Open', proposals: 24, views: 142, interviews: 3, posted: '2 days ago', mode: 'Remote' },
    { id: 2, title: 'Cloud Infrastructure Migration (AWS)', type: 'Fixed Price', budget: '$15,000', status: 'In Progress', proposals: 45, views: 320, interviews: 5, posted: '1 week ago', mode: 'Hybrid' },
    { id: 3, title: 'UX Designer for Mobile App Redesign', type: 'Fixed Price', budget: '$8,000', status: 'Draft', proposals: 0, views: 0, interviews: 0, posted: '-', mode: 'Remote' },
  ]);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Briefcase className="w-8 h-8 mr-3 text-brand-600" /> Job Postings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your active jobs, review proposals, and hire talent.</p>
        </div>
        <Link to="/client/jobs/post">
          <button className="flex items-center px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl shadow-sm hover:bg-brand-700 transition-colors shadow-brand-500/30">
            <Plus className="w-5 h-5 mr-2" /> Post a New Job
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center text-brand-600 mb-2"><Briefcase className="w-5 h-5 mr-2" /> <span className="font-semibold text-gray-900 dark:text-white">Active Postings</span></div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">4</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center text-brand-500 mb-2"><FileText className="w-5 h-5 mr-2" /> <span className="font-semibold text-gray-900 dark:text-white">Total Proposals</span></div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">128</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center text-brand-500 mb-2"><Users className="w-5 h-5 mr-2" /> <span className="font-semibold text-gray-900 dark:text-white">Interviewing</span></div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">8</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center text-green-500 mb-2"><CheckCircle className="w-5 h-5 mr-2" /> <span className="font-semibold text-gray-900 dark:text-white">Hired</span></div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">12</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-surface dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500 text-sm"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-800 transition-colors text-sm font-medium">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
        </div>

        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {jobs.map((job) => (
            <li key={job.id} className="p-6 hover:bg-surface dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
              <div className="flex flex-col lg:flex-row justify-between">
                <div className="mb-4 lg:mb-0 lg:w-2/3">
                  <div className="flex items-center mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mr-3 ${
                      job.status === 'Open' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      job.status === 'In Progress' ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {job.status}
                    </span>
                    <span className="text-sm font-medium text-gray-500">{job.posted}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors">{job.title}</h3>
                  <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400 gap-4">
                    <span className="font-medium text-gray-900 dark:text-white">{job.type}</span>
                    <span>Budget: <strong className="text-gray-900 dark:text-white">{job.budget}</strong></span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs">{job.mode}</span>
                  </div>
                </div>

                <div className="flex items-center lg:w-1/3 justify-between lg:justify-end gap-6">
                  <div className="flex space-x-6 text-center">
                    <div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center"><Eye className="w-4 h-4 mr-1 text-gray-400" /> {job.views}</p>
                      <p className="text-xs text-gray-500">Views</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-brand-600 dark:text-brand-400 flex items-center justify-center"><FileText className="w-4 h-4 mr-1" /> {job.proposals}</p>
                      <p className="text-xs text-gray-500">Proposals</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-brand-600 dark:text-brand-400 flex items-center justify-center"><Users className="w-4 h-4 mr-1" /> {job.interviews}</p>
                      <p className="text-xs text-gray-500">Messaged</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-2">
                    <MoreVertical className="w-5 h-5" />
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
