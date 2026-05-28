import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, BarChart2, Building, Search, Filter, Plus, ChevronDown, CheckCircle, Clock, Star, MoreVertical, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const mockAnalytics = [
  { title: 'Total Hires', value: '142', change: '+12%', isPositive: true },
  { title: 'Active Vendors', value: '45', change: '+5%', isPositive: true },
  { title: 'Time to Hire', value: '14 days', change: '-2 days', isPositive: true },
  { title: 'Avg Cost/Hire', value: '$4,200', change: '+8%', isPositive: false },
];

const mockDepartments = [
  { id: 1, name: 'Engineering', activeContractors: 24, budgetSpent: '$120k', status: 'On Track' },
  { id: 2, name: 'Design', activeContractors: 12, budgetSpent: '$45k', status: 'Warning' },
  { id: 3, name: 'Marketing', activeContractors: 8, budgetSpent: '$30k', status: 'On Track' },
];

const mockPipeline = [
  { 
    id: 1, 
    role: 'Senior React Developer',
    department: 'Engineering',
    candidates: 12,
    stage: 'Interviewing',
    lastUpdated: '2 hours ago'
  },
  { 
    id: 2, 
    role: 'UX Researcher',
    department: 'Design',
    candidates: 8,
    stage: 'Sourcing',
    lastUpdated: '1 day ago'
  },
  { 
    id: 3, 
    role: 'SEO Specialist',
    department: 'Marketing',
    candidates: 5,
    stage: 'Offer',
    lastUpdated: '3 hours ago'
  }
];

export default function EnterpriseHiringDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-surface dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Enterprise Hiring</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage bulk hiring, departments, and vendors.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-surface dark:hover:bg-gray-800 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              <span>New Request</span>
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockAnalytics.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold">{stat.value}</span>
                <span className={`flex items-center text-sm ${stat.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Pipeline */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-600" />
                  Active Hiring Pipelines
                </h2>
                <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">View All</button>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {mockPipeline.map((job) => (
                  <div key={job.id} className="p-6 hover:bg-surface dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{job.role}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                          <Building className="w-4 h-4" /> {job.department}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-medium rounded-full">
                        {job.stage}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" /> {job.candidates} Candidates
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {job.lastUpdated}
                        </span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Departments & Vendors */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-brand-600" />
                Department Overview
              </h2>
              <div className="space-y-4">
                {mockDepartments.map((dept) => (
                  <div key={dept.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-surface dark:bg-gray-800/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{dept.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-md ${
                        dept.status === 'On Track' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {dept.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{dept.activeContractors} Contractors</span>
                      <span>{dept.budgetSpent} spent</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm text-brand-600 font-medium border border-brand-200 dark:border-brand-900/50 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                Manage Departments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
