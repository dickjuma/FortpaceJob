import React, { useEffect, useState } from 'react';
import { DollarSign, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { walletAPI } from '../../common/services/api';
import { websocketService } from '../../common/services/websocket.service';

export default function EscrowDashboard() {
  const [balance, setBalance] = useState({ available: 0, escrow: 0, pending: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWalletData = async () => {
    setLoading(true);
    try {
      const data = await walletAPI.getWallet();
      setBalance({
        available: data.availableBalance || data.available || 0,
        escrow: data.escrowBalance || data.escrow || 0,
        pending: data.pendingBalance || data.pending || 0,
        total: data.total || (data.available + data.escrow)
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWalletData();

    const socket = websocketService.socket;
    if (socket) {
      const handleWalletUpdate = (data) => setBalance(prev => ({ ...prev, ...data }));
      socket.on('WALLET_UPDATED', handleWalletUpdate);
      socket.on('ESCROW_FUNDED', loadWalletData);
      socket.on('ESCROW_RELEASED', loadWalletData);

      return () => {
        socket.off('WALLET_UPDATED', handleWalletUpdate);
        socket.off('ESCROW_FUNDED', loadWalletData);
        socket.off('ESCROW_RELEASED', loadWalletData);
      };
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Escrow & Financials</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage deposits, milestone releases, and view secure transaction history.</p>
        </div>
        <Link to="/escrow/deposit" className="inline-flex items-center px-4 py-2 bg-[#4C1D95] hover:bg-[#22C55E] text-white rounded-lg text-sm font-medium transition-colors">
          <DollarSign className="w-4 h-4 mr-2" /> Add Funds
        </Link>
      </div>

      {loading && (
        <div className="text-center py-8 text-gray-500">Loading wallet data...</div>
      )}

      {error && (
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Available Balance</h3>
              <div className="w-8 h-8 rounded-full bg-[#4C1D95]/5 dark:bg-[#4C1D95]/20 text-[#4C1D95] dark:text-[#4C1D95] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">KES {balance.available.toLocaleString()}</div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <ShieldCheck className="w-24 h-24 text-[#4C1D95]" />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total in Escrow</h3>
              <div className="w-8 h-8 rounded-full bg-[#4C1D95]/5 dark:bg-[#4C1D95]/20 text-[#4C1D95] dark:text-[#4C1D95] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white relative z-10">KES {balance.escrow.toLocaleString()}</div>
            <div className="mt-4 flex items-center text-sm relative z-10">
              <span className="text-gray-500">Secured across active contracts</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Clearance</h3>
              <div className="w-8 h-8 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">KES {balance.pending.toLocaleString()}</div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Funds in 24-hour safety hold</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Escrow Activity</h2>
          <Link to="/escrow/history" className="text-sm font-medium text-[#4C1D95] dark:text-[#4C1D95] hover:text-[#4C1D95]">View All</Link>
        </div>
        <div className="p-6 text-center text-gray-500">Escrow history will be loaded from backend</div>
      </div>
    </div>
  );
}


