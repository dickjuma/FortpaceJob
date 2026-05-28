import React, { useState } from 'react';
import { Archive, Search, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_HISTORY = [
  { id: 'ORD-8001', title: 'React Performance Audit', provider: 'SpeedTech', date: 'Aug 14, 2026', amount: 800, rating: 5.0 },
  { id: 'ORD-7542', title: 'Figma to React Tailwind', provider: 'UI_Genius', date: 'Jun 02, 2026', amount: 2500, rating: 4.8 },
  { id: 'ORD-6122', title: 'Node.js API Integration', provider: 'BackendPro', date: 'Jan 15, 2026', amount: 1200, rating: 4.5 },
];

const WorkHistory = () => {
  const [search, setSearch] = useState('');

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-200 text-zinc-700 rounded-xl flex items-center justify-center shadow-sm">
                <Archive className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-zinc-900">Work History</h1>
                <p className="text-zinc-600 font-medium">Access your past completed contracts and invoices.</p>
              </div>
            </div>

            <div className="relative w-full md:w-64">
              <span className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400"><Search className="w-4 h-4" /></span>
              <input 
                type="text" 
                placeholder="Search history..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl focus:border-brand-500 focus:outline-none font-medium text-sm text-zinc-900"
              />
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface border-b border-zinc-200">
                <tr>
                  <th className="p-6 font-bold text-zinc-500 text-sm">Contract Details</th>
                  <th className="p-6 font-bold text-zinc-500 text-sm hidden sm:table-cell">Provider</th>
                  <th className="p-6 font-bold text-zinc-500 text-sm hidden md:table-cell">Completed</th>
                  <th className="p-6 font-bold text-zinc-500 text-sm text-center">Amount</th>
                  <th className="p-6 font-bold text-zinc-500 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {MOCK_HISTORY.map(work => (
                  <tr key={work.id} className="hover:bg-surface transition-colors">
                    <td className="p-6">
                      <div className="text-xs font-bold text-zinc-400 mb-1">{work.id}</div>
                      <div className="font-bold text-zinc-900 text-lg">{work.title}</div>
                    </td>
                    <td className="p-6 hidden sm:table-cell">
                      <Link to="/profile" className="font-bold text-zinc-700 hover:text-brand-600 transition-colors">{work.provider}</Link>
                    </td>
                    <td className="p-6 hidden md:table-cell">
                      <div className="text-sm font-medium text-zinc-600">{work.date}</div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="font-black text-zinc-900">${work.amount}</div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-600 rounded-lg transition-colors" title="View Contract">
                          <FileText className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-600 rounded-lg transition-colors" title="Download Invoice">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
};

export default WorkHistory;
