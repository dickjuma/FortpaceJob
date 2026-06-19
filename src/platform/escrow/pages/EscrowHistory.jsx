import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShieldCheck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { walletAPI } from '../../common/services/api';

export default function EscrowHistory() {
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEscrowHistory();
  }, []);

  const loadEscrowHistory = async () => {
    setLoading(true);
    try {
      const data = await walletAPI.getWallet();
      setEscrows(data.escrows || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading escrow history...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Escrow History</h1>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4">Transaction</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {escrows.length === 0 ? (
                <tr><td colSpan="4" className="p-6 text-center text-gray-500">No escrow transactions found.</td></tr>
              ) : (escrows.map((escrow, idx) => (
                <tr key={escrow.id || idx} className="hover:bg-surface dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{escrow.description || 'Escrow'}</p>
                    <p className="text-gray-500 text-xs">{escrow.id}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">KES{(escrow.amount || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(escrow.fundedAt || escrow.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      escrow.status === 'LOCKED' ? 'bg-[#4C1D95]/5 text-[#4C1D95]' :
                      escrow.status === 'RELEASED' ? 'bg-green-50 text-green-700' :
                      'bg-yellow-50 text-yellow-700'
                    }`}>
                      <ShieldCheck className="w-3 h-3 mr-1" /> {escrow.status || 'Funded'}
                    </span>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}