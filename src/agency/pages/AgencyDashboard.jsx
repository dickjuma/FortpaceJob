import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, Briefcase, TrendingUp, DollarSign, 
  ChevronRight, Activity, Zap
} from 'lucide-react';

export default function AgencyDashboard() {
  const stats = [
    { label: 'Total Agency Revenue', value: '$1.2M', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Active Contracts', value: '14', icon: Briefcase, color: 'text-[#2bb75c]', bg: 'bg-[#2bb75c]/5 dark:bg-[#2bb75c]/20' },
    { label: 'Billed Hours (This Week)', value: '340h', icon: Activity, color: 'text-[#2bb75c]', bg: 'bg-[#2bb75c]/5 dark:bg-[#2bb75c]/20' },
    { label: 'Available Capacity', value: '25%', icon: Users, color: 'text-[#2bb75c]', bg: 'bg-[#2bb75c]/5 dark:bg-[#2bb75c]/20' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Agency HQ</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your roster, workload, and financial distribution.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/agency/team">
            <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-surface dark:hover:bg-gray-700 transition-all flex items-center">
              <Users className="w-4 h-4 mr-2" /> Manage Roster
            </button>
          </Link>
          <Link to="/freelancer/jobs">
            <button className="px-4 py-2 bg-[#2bb75c] border border-transparent rounded-lg text-sm font-medium text-white shadow-sm shadow-[#2bb75c]/25/30 hover:bg-[#1d8d38] transition-all flex items-center">
              Find Agency Work <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full flex items-center">
                +8% <TrendingUp className="w-3 h-3 ml-1 text-green-500" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
              <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-[#2bb75c]" /> High-Value Contracts
              </h2>
            </div>
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {[1, 2].map((item) => (
                <li key={item} className="p-6 hover:bg-surface dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-md font-bold text-gray-900 dark:text-white">Cloud Migration for FinCorp</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Assigned to: Team Alpha (4 members)</p>
                      <div className="mt-3 flex items-center">
                        <div className="flex -space-x-2 mr-3">
                          <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-[#2bb75c] flex items-center justify-center text-xs text-white font-bold">JD</div>
                          <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-[#2bb75c] flex items-center justify-center text-xs text-white font-bold">AS</div>
                          <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-500 flex items-center justify-center text-xs text-white font-bold">+2</div>
                        </div>
                        <span className="text-xs font-medium text-[#2bb75c] bg-[#2bb75c]/5 dark:bg-[#2bb75c]/30 px-2 py-1 rounded">On Track</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">$45,000</p>
                      <button className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#2bb75c]">View Timesheets</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-[#2bb75c] to-[#1d8d38] rounded-2xl p-6 shadow-sm text-white">
            <h2 className="text-lg font-bold flex items-center mb-2">
              <Zap className="w-5 h-5 mr-2 text-yellow-300" /> Dispatch Center
            </h2>
            <p className="text-sm text-[#2bb75c] mb-6">You have 3 team members currently on the bench. We found 8 enterprise jobs matching their exact skills.</p>
            <button className="w-full py-2.5 bg-white text-[#2bb75c] rounded-lg text-sm font-bold shadow-sm hover:bg-surface transition-all">
              Review Matches for Bench
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

