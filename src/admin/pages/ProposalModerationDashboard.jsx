import React, { useState } from 'react';
import { ShieldAlert, Search, Filter, AlertTriangle, CheckCircle, XCircle, MoreVertical, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProposalModerationDashboard() {
  const [flags] = useState([
    { id: 1, freelancer: 'John Doe', client: 'Acme Corp', reason: 'High Contact Info Sharing Probability', severity: 'High', status: 'Pending Review', score: 98 },
    { id: 2, freelancer: 'Jane Smith', client: 'TechFlow', reason: 'Copy-Paste Spam Detected', severity: 'Medium', status: 'Investigating', score: 85 },
    { id: 3, freelancer: 'Crypto Dev', client: 'Web3 Startup', reason: 'Off-platform Payment Request', severity: 'Critical', status: 'Pending Review', score: 99 },
    { id: 4, freelancer: 'Alice Wong', client: 'Global Systems', reason: 'Unusually Low Bid (Potential Bot)', severity: 'Low', status: 'Resolved', score: 60 }
  ]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <ShieldAlert className="w-8 h-8 mr-3 text-red-600" /> Proposal Moderation Center
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review flagged proposals, investigate fraud alerts, and enforce marketplace integrity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm border-l-4 border-l-red-500">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Critical Flags</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm border-l-4 border-l-yellow-500">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Pending Review</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">45</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm border-l-4 border-l-blue-500">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Auto-Rejected</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">892</p>
        </div>
        <Link to="/admin/fraud-center">
          <div className="bg-brand-50 dark:bg-brand-900/20 p-6 rounded-2xl border border-brand-200 dark:border-brand-800 shadow-sm h-full flex flex-col justify-center items-center hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors cursor-pointer">
            <ShieldAlert className="w-8 h-8 text-brand-600 mb-2" />
            <h3 className="text-sm font-bold text-brand-800 dark:text-brand-400 text-center">Advanced Fraud Center</h3>
          </div>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between gap-4 bg-surface dark:bg-gray-800/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by freelancer, client, or ID..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-brand-500 focus:border-brand-500 text-sm"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-surface transition-colors text-sm font-medium">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4">Flag Reason</th>
                <th className="p-4">AI Confidence</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Involved Parties</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {flags.map((flag) => (
                <tr key={flag.id} className="hover:bg-surface dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 font-bold text-gray-900 dark:text-white flex items-center">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" /> {flag.reason}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                        <div className={`h-2 rounded-full ${flag.score > 90 ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: `${flag.score}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{flag.score}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      flag.severity === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800' :
                      flag.severity === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                      flag.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {flag.severity}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">F: {flag.freelancer}</p>
                    <p className="text-xs text-gray-500 mt-0.5">C: {flag.client}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{flag.status}</span>
                  </td>
                  <td className="p-4 text-right flex justify-end space-x-2">
                    <button className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-md transition-colors" title="Review Proposal">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors" title="Approve/Dismiss">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors" title="Reject Proposal">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
