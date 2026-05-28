import React, { useState } from 'react';
import { Shield, Search, Filter, AlertTriangle, CheckCircle, Download, MoreVertical, Eye, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminContractControlPanel() {
  const [contracts] = useState([
    { id: 'CON-9921', client: 'TechCorp Inc.', freelancer: 'Sarah Jenkins', amount: 12500, status: 'active', risk: 'low', date: 'May 19, 2026' },
    { id: 'CON-8834', client: 'Alpha Designs', freelancer: 'David Chen', amount: 4500, status: 'disputed', risk: 'high', date: 'May 18, 2026' },
    { id: 'CON-7712', client: 'Startup X', freelancer: 'Elena R.', amount: 8200, status: 'pending_signatures', risk: 'low', date: 'May 17, 2026' },
  ]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Shield className="w-6 h-6 text-brand-600" /> Contract Control Panel
          </h1>
          <p className="text-sm text-gray-500 mt-1">Supervise marketplace contracts, handle overrides, and monitor escrow health.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-surface-dark-secondary border border-gray-200 dark:border-surface-dark-border rounded-button text-sm font-medium hover:bg-surface dark:hover:bg-surface-dark-tertiary transition-colors flex items-center shadow-card">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Active Contracts', value: '1,284', change: '+12%', color: 'text-brand-600' },
          { label: 'Funds in Escrow', value: '$4.2M', change: '+5%', color: 'text-success' },
          { label: 'Active Disputes', value: '24', change: '-2', color: 'text-warning' },
          { label: 'High Risk Flags', value: '3', change: '+1', color: 'text-danger' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl p-6 shadow-card">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{stat.label}</h3>
            <div className="flex items-end justify-between">
              <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
              <span className="text-sm font-medium text-gray-400">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl shadow-card overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-surface-dark-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-secondary dark:bg-surface-dark-secondary">
          <div className="flex w-full sm:w-auto gap-4">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -tranzinc-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search CON-ID, Client, or Freelancer..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-surface-dark-border rounded-lg bg-white dark:bg-surface-dark text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <button className="px-4 py-2 border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark rounded-lg text-sm font-medium hover:bg-surface dark:hover:bg-surface-dark-tertiary">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-tertiary dark:bg-surface-dark-tertiary text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Contract ID</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Parties</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-surface-dark-border">
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-surface dark:hover:bg-surface-dark-secondary transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                    {contract.id}
                    <div className="text-xs text-gray-500 font-sans mt-1">{contract.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-surface-dark dark:text-white">{contract.client}</p>
                    <p className="text-gray-500">vs. {contract.freelancer}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-surface-dark dark:text-white">${contract.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {contract.status === 'active' && <span className="inline-flex items-center px-2.5 py-1 rounded-badge text-xs font-bold bg-success/10 text-success"><CheckCircle className="w-3 h-3 mr-1" /> Active</span>}
                    {contract.status === 'disputed' && <span className="inline-flex items-center px-2.5 py-1 rounded-badge text-xs font-bold bg-danger/10 text-danger"><AlertTriangle className="w-3 h-3 mr-1" /> Disputed</span>}
                    {contract.status === 'pending_signatures' && <span className="inline-flex items-center px-2.5 py-1 rounded-badge text-xs font-bold bg-warning/10 text-warning"><Lock className="w-3 h-3 mr-1" /> Pending</span>}
                  </td>
                  <td className="px-6 py-4">
                    {contract.risk === 'low' ? (
                      <span className="text-success font-bold flex items-center"><div className="w-2 h-2 rounded-full bg-success mr-2"></div>Low</span>
                    ) : (
                      <span className="text-danger font-bold flex items-center"><div className="w-2 h-2 rounded-full bg-danger mr-2 animate-pulse"></div>High</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-brand-600 transition-colors mr-2"><Eye className="w-4 h-4" /></button>
                    <button className="p-2 text-gray-400 hover:text-surface-dark dark:hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
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
