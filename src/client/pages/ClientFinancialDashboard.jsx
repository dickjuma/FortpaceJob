import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign, TrendingUp, Lock, ArrowUpRight, ArrowDownLeft,
  FileText, Download, AlertCircle, RefreshCw, BarChart2, Clock,
  CheckCircle, XCircle
} from 'lucide-react';
import { useWallet, useTransactions, useInvoices, useMyContracts } from '../services/clientHooks';
import toast, { Toaster } from 'react-hot-toast';

function timeAgo(d) {
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  return days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days}d ago`;
}

export default function ClientFinancialDashboard() {
  const navigate = useNavigate();
  const [txPage, setTxPage] = useState(1);

  const { data: wallet, isLoading: walletLoading, refetch: refetchWallet } = useWallet();
  const { data: txData, isLoading: txLoading } = useTransactions({ page: txPage, limit: 10 });
  const { data: invoicesData, isLoading: invLoading } = useInvoices({ limit: 5 });
  const { data: contractsData } = useMyContracts({ status: 'ACTIVE', limit: 5 });

  const availableBalance = Number(wallet?.availableBalance ?? wallet?.balance ?? 0);
  const lockedBalance    = Number(wallet?.lockedBalance ?? wallet?.escrowBalance ?? 0);
  const totalBalance     = availableBalance + lockedBalance;

  const transactions = txData?.items || [];
  const totalTx = txData?.total || 0;
  const totalTxPages = txData?.totalPages || 1;
  const invoices = invoicesData?.items || [];
  const contracts = contractsData?.items || [];

  const totalSpent = transactions
    .filter(t => t.type === 'DEBIT' || t.type === 'ESCROW')
    .reduce((s, t) => s + Number(t.amount || 0), 0);

  const handleExportCSV = () => {
    if (!transactions.length) { toast.error('No transactions to export'); return; }
    const rows = [
      ['ID', 'Date', 'Type', 'Amount', 'Description', 'Status'],
      ...transactions.map(t => [
        t.id,
        new Date(t.createdAt).toLocaleDateString(),
        t.type,
        t.amount,
        t.description || '',
        t.status || 'COMPLETED',
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forte-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded!');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 overflow-y-auto custom-scrollbar">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Financial Dashboard</h1>
            <p className="text-sm text-zinc-400 mt-1">Overview of your spending, escrow, and payments</p>
          </div>
          <div className="flex gap-2">
            <button onClick={refetchWallet} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <button onClick={handleExportCSV} className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white transition-colors px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {/* Balance Cards */}
        {walletLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="h-32 bg-zinc-900/40 rounded-2xl animate-pulse" />)}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-success/20 to-success/20 border border-success/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 className="w-4 h-4 text-success" />
                <p className="text-xs text-zinc-400">Total Balance</p>
              </div>
              <p className="text-3xl font-bold text-white">KES {totalBalance.toLocaleString()}</p>
              <p className="text-xs text-zinc-500 mt-2">Available + Escrow</p>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-success" />
                <p className="text-xs text-zinc-400">Available</p>
              </div>
              <p className="text-3xl font-bold text-success">KES {availableBalance.toLocaleString()}</p>
              <button onClick={() => navigate('/client/wallet')} className="text-xs text-zinc-400 hover:text-success mt-2 transition-colors flex items-center gap-1">
                Manage wallet <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-yellow-400" />
                <p className="text-xs text-zinc-400">In Escrow</p>
              </div>
              <p className="text-3xl font-bold text-yellow-400">KES {lockedBalance.toLocaleString()}</p>
              <p className="text-xs text-zinc-500 mt-2">Locked for active contracts</p>
            </div>
          </div>
        )}

        {/* Action Strip */}
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/client/wallet')} className="flex items-center gap-2 px-5 py-2.5 bg-success hover:bg-success text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-[#2bb75c]/20">
            <ArrowDownLeft className="w-4 h-4" /> Deposit Funds
          </button>
          <button onClick={() => navigate('/client/contracts')} className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-full text-sm font-bold transition-colors">
            <FileText className="w-4 h-4" /> View Contracts
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Transaction History */}
          <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
              <h2 className="font-bold text-white">Recent Transactions</h2>
              <span className="text-xs text-zinc-500">{totalTx} total</span>
            </div>
            {txLoading ? (
              <div className="p-4 space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-14 bg-zinc-900/40 rounded-xl animate-pulse" />)}</div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">No transactions yet.</div>
            ) : (
              <div className="divide-y divide-zinc-800/50">
                {transactions.map(tx => {
                  const isPositive = ['CREDIT', 'RELEASE', 'REFUND'].includes(tx.type);
                  const Icon = isPositive ? ArrowDownLeft : ArrowUpRight;
                  return (
                    <div key={tx.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-800/30 transition-colors">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isPositive ? 'bg-success/10' : 'bg-red-400/10'}`}>
                        <Icon className={`w-4 h-4 ${isPositive ? 'text-success' : 'text-red-400'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{tx.description || tx.type}</p>
                        <p className="text-xs text-zinc-500">{timeAgo(tx.createdAt)}</p>
                      </div>
                      <p className={`text-sm font-bold shrink-0 ${isPositive ? 'text-success' : 'text-red-400'}`}>
                        {isPositive ? '+' : '-'}KES {Number(tx.amount || 0).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            {totalTxPages > 1 && (
              <div className="p-4 border-t border-zinc-800 flex items-center justify-center gap-2">
                <button onClick={() => setTxPage(p => Math.max(1, p - 1))} disabled={txPage === 1} className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 disabled:opacity-40 hover:bg-zinc-700">Prev</button>
                <span className="text-xs text-zinc-400">{txPage} / {totalTxPages}</span>
                <button onClick={() => setTxPage(p => Math.min(totalTxPages, p + 1))} disabled={txPage === totalTxPages} className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 disabled:opacity-40 hover:bg-zinc-700">Next</button>
              </div>
            )}
          </div>

          {/* Active Contracts sidebar */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-zinc-800 bg-zinc-900/80">
              <h2 className="font-bold text-white">Active Contracts</h2>
            </div>
            {contracts.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 text-sm">No active contracts.</div>
            ) : (
              <div className="divide-y divide-zinc-800/50">
                {contracts.map(c => (
                  <div key={c.id} className="px-5 py-4 hover:bg-zinc-800/30 transition-colors cursor-pointer" onClick={() => navigate(`/client/contracts/${c.id}`)}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-white">Contract #{c.id}</p>
                      <span className="text-xs text-success font-bold">{c.status}</span>
                    </div>
                    <p className="text-xs text-zinc-400">{c.freelancer?.name || 'Freelancer'}</p>
                    <p className="text-xs font-bold text-success mt-1">KES {Number(c.totalAmount || 0).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="p-4 border-t border-zinc-800">
              <button onClick={() => navigate('/client/contracts')} className="w-full text-center text-xs text-success hover:text-white transition-colors font-bold">View All Contracts →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

