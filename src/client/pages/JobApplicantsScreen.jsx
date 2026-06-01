import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, CheckCircle, MessageSquare, Briefcase, Award } from 'lucide-react';

export default function JobApplicantsScreen({ jobId }) {
  const [applicants] = useState([
    { id: 1, name: 'Sarah Jenkins', role: 'Senior React Developer', rate: '$85/hr', score: 98, status: 'pending' },
    { id: 2, name: 'David Chen', role: 'Full Stack Engineer', rate: '$65/hr', score: 92, status: 'shortlisted' },
    { id: 3, name: 'Elena Rodriguez', role: 'Frontend Specialist', rate: '$75/hr', score: 88, status: 'pending' },
  ]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Review Applicants</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Enterprise Web App Development (#JOB-9921)</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-surface dark:hover:bg-gray-800">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </button>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -tranzinc-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or skill..." 
              className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#14a800] outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {applicants.map((app) => (
          <motion.div 
            key={app.id}
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-gray-900 shrink-0"></div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  {app.name} <CheckCircle className="w-4 h-4 text-[#14a800] ml-2" />
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{app.role}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center"><Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" /> 4.9 (120 reviews)</span>
                  <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1" /> 100% Job Success</span>
                  <span className="flex items-center"><Award className="w-4 h-4 mr-1 text-[#14a800]" /> Top Rated Plus</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
              <div className="text-right">
                <span className="text-xl font-bold text-gray-900 dark:text-white">{app.rate}</span>
                <p className="text-xs text-gray-500">Proposed Rate</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-surface dark:hover:bg-gray-800">
                  <MessageSquare className="w-4 h-4 mr-2" /> Message
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-[#14a800] hover:bg-[#118a00] text-white rounded-lg text-sm font-medium transition-colors">
                  Hire & Offer
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
