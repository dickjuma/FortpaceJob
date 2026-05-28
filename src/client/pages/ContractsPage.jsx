import React, { useState } from 'react';
import { FileText, Search, Filter, ShieldCheck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardSkeleton } from '../../common/components/SkeletonLoader';

export default function ContractsPage() {
  const [isLoading] = useState(false);
  const [contracts] = useState([
    { id: 1, title: 'Senior React Developer', type: 'Job', amount: '$8,500', paid: '$2,500', escrow: '$6,000', freelancer: 'Alex Johnson', status: 'In Progress', nextMilestone: 'Frontend Architecture' },
    { id: 2, title: 'Full SaaS Platform Build', type: 'Gig', amount: '$2,500', paid: '$0', escrow: '$2,500', freelancer: 'Elena Rodriguez', status: 'Pending Delivery', nextMilestone: 'Final Delivery' },
    { id: 3, title: 'AWS Cloud Migration', type: 'Job', amount: '$15,000', paid: '$15,000', escrow: '$0', freelancer: 'Marcus Chen', status: 'Completed', nextMilestone: '-' },
    { id: 4, title: 'UX Audit & Redesign', type: 'Gig', amount: '$800', paid: '$400', escrow: '$400', freelancer: 'Sarah Dev', status: 'In Revision', nextMilestone: 'V2 Mockups' },
  ]);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <FileText className="w-8 h-8 mr-3 text-brand-600" /> Order & Contract Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track deliverables, manage escrow funds, and approve milestones.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between gap-4 bg-surface dark:bg-gray-800/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search contracts..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-brand-500 focus:border-brand-500 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm rounded-xl focus:ring-brand-500 focus:border-brand-500">
              <option>All Contracts</option>
              <option>Active</option>
              <option>In Revision</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {contracts.map((contract) => (
            <li key={contract.id} className="p-6 hover:bg-surface dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex flex-col lg:flex-row justify-between">
                <div className="mb-4 lg:mb-0 lg:w-1/2">
                  <div className="flex items-center mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mr-3 ${
                      contract.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      contract.status === 'In Revision' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-400'
                    }`}>
                      {contract.status === 'Completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {contract.status === 'In Progress' && <Clock className="w-3 h-3 mr-1" />}
                      {contract.status === 'In Revision' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {contract.status}
                    </span>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{contract.type}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{contract.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Freelancer: <span className="font-medium text-gray-900 dark:text-white">{contract.freelancer}</span></p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center lg:w-1/2 justify-between gap-6">
                  <div className="flex space-x-8 text-left">
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{contract.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 flex items-center"><ShieldCheck className="w-4 h-4 mr-1 text-green-500" /> In Escrow</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{contract.escrow}</p>
                    </div>
                  </div>
                  <Link to={`/client/contracts/${contract.id}`}>
                    <button className="flex items-center px-5 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-surface dark:hover:bg-gray-800 transition-colors whitespace-nowrap">
                      Manage Order
                    </button>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
