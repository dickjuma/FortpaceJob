import React from 'react';
import { History, Search, Filter, Shield, ChevronLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProposalAuditLogsPage() {
  const logs = [
    { id: 'EVT-9021', timestamp: 'Oct 18, 2026 14:32:01', action: 'STATUS_CHANGED', user: 'Client: Acme Corp', target: 'Proposal #PRP-402', details: 'Status updated from "Viewed" to "Shortlisted"', ip: '192.168.1.44' },
    { id: 'EVT-9020', timestamp: 'Oct 18, 2026 14:15:22', action: 'PROPOSAL_SUBMITTED', user: 'Freelancer: Alex Johnson', target: 'Job #JOB-991', details: 'Initial bid of $85/hr submitted', ip: '10.0.0.12' },
    { id: 'EVT-9019', timestamp: 'Oct 18, 2026 13:45:00', action: 'SYSTEM_FLAG', user: 'System (AI Engine)', target: 'Proposal #PRP-401', details: 'Auto-flagged for high plagiarism probability (Score: 89%)', ip: 'internal' },
    { id: 'EVT-9018', timestamp: 'Oct 18, 2026 11:20:15', action: 'PROPOSAL_EDITED', user: 'Freelancer: Sarah Dev', target: 'Proposal #PRP-398', details: 'Bid amount modified from $60/hr to $55/hr', ip: '172.16.2.9' },
    { id: 'EVT-9017', timestamp: 'Oct 18, 2026 09:10:05', action: 'ADMIN_OVERRIDE', user: 'Admin: sys_moderator1', target: 'Proposal #PRP-401', details: 'Dismissed system flag. Proposal reinstated.', ip: '10.0.1.5' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-8">
        <Link to="/admin/moderation" className="text-sm font-medium text-[#2bb75c] hover:text-[#2bb75c] mb-4 inline-flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Moderation
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <History className="w-8 h-8 mr-3 text-[#2bb75c]" /> Proposal Audit Logs
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Immutable, time-stamped records of all proposal creation, modification, and evaluation events.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between gap-4 bg-surface dark:bg-gray-800/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Event ID, User, or IP Address..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-[#2bb75c] focus:border-[#2bb75c]/20 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm rounded-xl focus:ring-[#2bb75c] focus:border-[#2bb75c]/20">
              <option>All Actions</option>
              <option>Status Changes</option>
              <option>Submissions</option>
              <option>Admin Overrides</option>
              <option>System Flags</option>
            </select>
            <button className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-surface transition-colors text-sm font-medium">
              <Filter className="w-4 h-4 mr-2" /> More
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4">Timestamp & Event ID</th>
                <th className="p-4">Action Type</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Target Object</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface dark:hover:bg-gray-800/30 transition-colors font-mono text-sm">
                  <td className="p-4">
                    <p className="text-gray-900 dark:text-gray-300">{log.timestamp}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{log.id}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      log.action.includes('ADMIN') || log.action.includes('SYSTEM') ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      log.action.includes('STATUS') ? 'bg-[#2bb75c]/10 text-[#2bb75c] dark:bg-[#2bb75c]/30 dark:text-[#2bb75c]' :
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      {log.user.includes('System') || log.user.includes('Admin') ? <Shield className="w-3.5 h-3.5 mr-1.5 text-red-500" /> : null}
                      {log.user}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 ml-5">IP: {log.ip}</p>
                  </td>
                  <td className="p-4 text-[#2bb75c] dark:text-[#2bb75c] hover:underline cursor-pointer">
                    {log.target}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
           <button className="text-sm font-medium text-[#2bb75c] hover:text-[#2bb75c] flex items-center">
             Download CSV Export <ArrowRight className="w-4 h-4 ml-1" />
           </button>
        </div>
      </div>
    </div>
  );
}

