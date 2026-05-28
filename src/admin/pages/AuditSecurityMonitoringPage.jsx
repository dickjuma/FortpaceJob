import React, { useState } from 'react';
import { ShieldAlert, Activity, Server, Database, Globe, Search, ArrowRight } from 'lucide-react';

export default function AuditSecurityMonitoringPage() {
  const [logs] = useState([
    { id: 1001, event: 'ADMIN_LOGIN_SUCCESS', user: 'admin@forte.com', ip: '192.168.1.1', location: 'Seattle, WA', time: '2026-05-18 10:45:12 UTC', risk: 'Low' },
    { id: 1002, event: 'API_RATE_LIMIT_EXCEEDED', user: 'system_anonymous', ip: '45.22.11.9', location: 'Unknown', time: '2026-05-18 10:42:05 UTC', risk: 'Medium' },
    { id: 1003, event: 'ESCROW_FUND_RELEASE', user: 'client_773', ip: '10.0.0.5', location: 'London, UK', time: '2026-05-18 10:30:00 UTC', risk: 'High' },
  ]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-mono">
      <div className="mb-8 border-b border-gray-800 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Server className="w-6 h-6 mr-3 text-success" /> Security Audit Log
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Real-time monitoring of all critical system events, authentication attempts, and financial transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-dark p-6 rounded-xl border border-zinc-700 shadow-sm text-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-zinc-400">System Status</span>
            <Activity className="w-5 h-5 text-success" />
          </div>
          <div className="text-2xl font-bold text-success">OPERATIONAL</div>
          <p className="text-xs text-zinc-500 mt-2">All security modules online.</p>
        </div>
        <div className="bg-surface-dark p-6 rounded-xl border border-zinc-700 shadow-sm text-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-zinc-400">Blocked IPs (24h)</span>
            <ShieldAlert className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400">14,205</div>
          <p className="text-xs text-zinc-500 mt-2">Automated by WAF.</p>
        </div>
        <div className="bg-surface-dark p-6 rounded-xl border border-zinc-700 shadow-sm text-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-zinc-400">Active Sessions</span>
            <Globe className="w-5 h-5 text-brand-400" />
          </div>
          <div className="text-2xl font-bold text-brand-400">42,891</div>
          <p className="text-xs text-zinc-500 mt-2">Across 12 regions.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-700 bg-surface dark:bg-zinc-800/50 flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Query logs (e.g. event:ESCROW)" 
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-surface-dark border border-gray-300 dark:border-zinc-600 rounded-md text-sm text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 font-mono"
            />
          </div>
          <button className="px-4 py-2 bg-zinc-800 text-white text-sm font-medium rounded-md hover:bg-zinc-700 transition-colors">
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700 text-sm">
            <thead className="bg-surface dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Actor</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">IP / Loc</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Risk</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface-dark divide-y divide-gray-200 dark:divide-zinc-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface dark:hover:bg-zinc-800/50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-zinc-400">{log.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{log.event}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-zinc-400">{log.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-zinc-400">{log.ip}<br/><span className="text-xs">{log.location}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      log.risk === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      log.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-success'
                    }`}>{log.risk}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-success hover:text-success"><ArrowRight className="w-4 h-4" /></button>
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
