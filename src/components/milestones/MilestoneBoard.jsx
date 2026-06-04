import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Upload, MoreVertical, DollarSign } from 'lucide-react';

export default function MilestoneBoard() {
  const [milestones] = useState([
    { id: 1, title: 'UX Wireframes & Research', amount: 2500, deadline: 'Oct 15, 2026', status: 'paid', progress: 100 },
    { id: 2, title: 'High-Fidelity Designs', amount: 3500, deadline: 'Nov 01, 2026', status: 'submitted', progress: 100 },
    { id: 3, title: 'Frontend Implementation', amount: 4000, deadline: 'Nov 20, 2026', status: 'in_progress', progress: 45 },
    { id: 4, title: 'Testing & Launch', amount: 2500, deadline: 'Dec 10, 2026', status: 'pending', progress: 0 },
  ]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'paid': return { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-success', icon: CheckCircle, label: 'Paid' };
      case 'submitted': return { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', icon: Upload, label: 'In Review' };
      case 'in_progress': return { color: 'bg-[#2bb75c]/10 text-[#2bb75c] dark:bg-[#2bb75c]/30 dark:text-[#2bb75c]', icon: Clock, label: 'In Progress' };
      default: return { color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', icon: AlertCircle, label: 'Pending' };
    }
  };

  return (
    <div className="w-full space-y-4">
      {milestones.map((milestone, idx) => {
        const statusConfig = getStatusConfig(milestone.status);
        const Icon = statusConfig.icon;

        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={milestone.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-bold text-gray-400 dark:text-gray-500">M{milestone.id}</span>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{milestone.title}</h3>
                <span className={`flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                  <Icon className="w-3 h-3 mr-1" /> {statusConfig.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> Due {milestone.deadline}</span>
              </div>
              
              {milestone.status === 'in_progress' && (
                <div className="mt-4 w-full md:w-2/3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span className="font-bold">{milestone.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5">
                    <div className="bg-[#2bb75c] h-1.5 rounded-full" style={{ width: `${milestone.progress}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
              <div className="text-right">
                <span className="text-xl font-bold text-gray-900 dark:text-white">${milestone.amount.toLocaleString()}</span>
              </div>
              <div className="flex gap-2">
                {milestone.status === 'in_progress' && (
                  <button className="px-4 py-2 bg-[#2bb75c] hover:bg-[#1d8d38] text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                    Submit Work
                  </button>
                )}
                {milestone.status === 'submitted' && (
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                    Approve
                  </button>
                )}
                <button className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 hover:bg-surface dark:hover:bg-gray-800 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

