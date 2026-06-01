import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, ArrowUpRight, ArrowDownLeft, Clock, RefreshCw,
  DollarSign, Lock, TrendingUp, FileDown, AlertCircle, ChevronRight, Search
} from 'lucide-react';
import { useWallet, useTransactions, useDeposit, useWithdraw } from '../services/clientHooks';
import toast from 'react-hot-toast';
import { useConfirm } from '../../common/context/ConfirmContext';

const TX_TYPES = {
  CREDIT:   { label: 'Deposit',   icon: ArrowDownLeft,  color: 'text-success', bg: 'bg-success/10' },
  DEBIT:    { label: 'Withdrawal',icon: ArrowUpRight,   color: 'text-red-400', bg: 'bg-red-400/10' },
  ESCROW:   { label: 'Escrow',    icon: Lock,           color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  RELEASE:  { label: 'Release',   icon: ArrowDownLeft,  color: 'text-success', bg: 'bg-success/10' },
  REFUND:   { label: 'Refund',    icon: ArrowDownLeft,  color: 'text-blue-400', bg: 'bg-blue-400/10' },
};

function timeAgo(d) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ClientWalletDashboard() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [page, setPage] = useState(1);
  const [txFilter, setTxFilter] = useState('ALL');
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawPhone, setWithdrawPhone] = useState('');
  const [search, setSearch] = useState('');

  const { data: wallet, isLoading: walletLoading, error: walletError, refetch: refetchWallet } = useWallet();
  const filters = { page, limit: 15, ...(txFilter !== 'ALL' && { type: txFilter }), ...(search && { search }) };
  const { data: txData, isLoading: txLoading, refetch: refetchTx } = useTransactions(filters);
  const deposit = useDeposit();
  const withdraw = useWithdraw();

  const transactions = txData?.items || [];
  const total = txData?.total || 0;
  const totalPages = txData?.totalPages || 1;

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) < 10) { toast.error('Minimum deposit is KES 10'); return; }
    if (!phone.match(/^(07|01|2547|2541)\d{8}$/)) { toast.error('Enter a valid M-Pesa number'); return; }
    const ok = await confirm({
      title: 'Confirm deposit',
      message: `Send M-Pesa STK Push for KES ${Number(amount).toLocaleString()} to ${phone}?`,
      confirmLabel: 'Send STK Push',
    });
    if (!ok) return;
    try {
      await deposit.mutateAsync({ amount: Number(amount), phone, provider: 'MPESA' });
      toast.success('M-Pesa STK Push Sent! Check your phone.');
      setDepositModal(false);
      setAmount('');
      setPhone('');
      refetchWallet();
      refetchTx();
    } catch (err) {
      toast.error(err.message || 'Deposit failed');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const avail = Number(wallet?.availableBalance || wallet?.balance || 0);
    if (!withdrawAmount || Number(withdrawAmount) < 10) { toast.error('Minimum withdrawal is KES 10'); return; }
    if (Number(withdrawAmount) > avail) { toast.error('Insufficient balance'); return; }
    const ok = await confirm({
      title: 'Confirm withdrawal',
      message: `Withdraw KES ${Number(withdrawAmount).toLocaleString()} to ${withdrawPhone || 'your M-Pesa number'}? Funds leave your available balance immediately.`,
      confirmLabel: 'Withdraw',
      critical: true,
    });
    if (!ok) return;
    try {
      await withdraw.mutateAsync({ amount: Number(withdrawAmount), phone: withdrawPhone, provider: 'MPESA' });
      toast.success('Withdrawal initiated via M-Pesa.');
      setWithdrawModal(false);
      setWithdrawAmount('');
      setWithdrawPhone('');
      refetchWallet();
      refetchTx();
    } catch (err) {
      toast.error(err.message || 'Withdrawal failed');
    }
  };

  const handleSync = () => {
    refetchWallet();
    refetchTx();
    toast.success('Wallet synced.');
  };

  const availableBalance = Number(wallet?.availableBalance ?? wallet?.balance ?? 0);
  const lockedBalance = Number(wallet?.lockedBalance ?? wallet?.escrowBalance ?? 0);
  const totalBalance = availableBalance + lockedBalance;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Wallet className="w-8 h-8 text-success" /> M-Pesa Wallet
            </h1>
            <p className="text-sm font-semibold text-zinc-400 mt-1">Manage your funds securely via Safaricom M-Pesa.</p>
          </div>
          <button onClick={handleSync} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" /> Sync Balance
          </button>
        </div>

        {/* Balance Cards */}
        {walletLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="h-32 bg-zinc-900/40 rounded-2xl animate-pulse" />)}</div>
        ) : walletError ? (
          <div className="flex flex-col items-center justify-center h-32 gap-3 border border-red-500/20 bg-red-500/5 rounded-2xl">
            <AlertCircle className="w-8 h-8 text-red-400 opacity-60" />
            <p className="text-red-400 text-sm font-bold">Failed to load wallet balance.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total */}
            <div className="sm:col-span-1 bg-gradient-to-br from-success/20 to-success/30 border border-success/30 rounded-2xl p-6">
              <p className="text-sm font-bold text-success mb-2">Total Balance</p>
              <p className="text-4xl font-black text-white">KES {totalBalance.toLocaleString()}</p>
              <p className="text-xs font-semibold text-success/70 mt-2">Available + In Escrow</p>
            </div>
            {/* Available */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-2"><DollarSign className="w-5 h-5 text-success" /><p className="text-sm font-bold text-zinc-400">Available</p></div>
              <p className="text-3xl font-black text-success">KES {availableBalance.toLocaleString()}</p>
              <p className="text-xs font-semibold text-zinc-500 mt-2">Ready to use for new contracts</p>
            </div>
            {/* Locked */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-2"><Lock className="w-5 h-5 text-yellow-400" /><p className="text-sm font-bold text-zinc-400">In Escrow</p></div>
              <p className="text-3xl font-black text-yellow-400">KES {lockedBalance.toLocaleString()}</p>
              <p className="text-xs font-semibold text-zinc-500 mt-2">Locked in active contracts</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setDepositModal(true)} className="flex items-center gap-2 px-6 py-3 bg-success hover:bg-green-600 text-black rounded-xl text-sm font-black transition-all shadow-lg shadow-[#14a800]/20">
            <ArrowDownLeft className="w-4 h-4" /> Deposit via M-Pesa
          </button>
          <button onClick={() => setWithdrawModal(true)} className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-xl text-sm font-bold transition-colors">
            <ArrowUpRight className="w-4 h-4" /> Withdraw
          </button>
          <button onClick={() => navigate('/client/contracts')} className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-xl text-sm font-bold transition-colors">
            <TrendingUp className="w-4 h-4" /> View Contracts
          </button>
        </div>

        {/* Transactions Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mt-8">
          <div className="p-5 border-b border-zinc-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <h2 className="font-bold text-white text-lg">Transaction History</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 sm:pb-0">
                {['ALL', 'CREDIT', 'DEBIT', 'ESCROW', 'REFUND'].map(f => (
                  <button key={f} onClick={() => { setTxFilter(f); setPage(1); }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${txFilter === f ? 'bg-zinc-800 text-white' : 'bg-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
                    {f}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search ref..." 
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full sm:w-48 bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-sm font-bold text-white focus:outline-none focus:border-success transition-colors"
                />
              </div>
            </div>
          </div>

          {txLoading ? (
            <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-zinc-800 border-t-success rounded-full animate-spin"></div></div>
          ) : transactions.length === 0 ? (
            <div className="p-16 text-center">
              <FileDown className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400 font-bold">No transactions found.</p>
              <p className="text-xs text-zinc-500 mt-1">Your M-Pesa deposits and withdrawals will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950/50 border-b border-zinc-800">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">Transaction</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">Reference</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">Date</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500 text-right">Amount</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {transactions.map(tx => {
                    const typeInfo = TX_TYPES[tx.type] || TX_TYPES.CREDIT;
                    const Icon = typeInfo.icon;
                    const isPositive = ['CREDIT', 'RELEASE', 'REFUND'].includes(tx.type);
                    return (
                      <tr key={tx.id} className="hover:bg-zinc-800/20 transition-colors group">
                        <td className="px-6 py-4 min-w-[200px]">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${typeInfo.bg}`}>
                              <Icon className={`w-4 h-4 ${typeInfo.color}`} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{tx.description || typeInfo.label}</p>
                              <p className="text-xs font-semibold text-zinc-500 mt-0.5">{typeInfo.label}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono text-zinc-400">{tx.reference || `TXN-${tx.id}`}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-zinc-300 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> {new Date(tx.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs font-semibold text-zinc-500 mt-0.5 block ml-5">{timeAgo(tx.createdAt)}</span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <p className={`text-base font-black ${isPositive ? 'text-success' : 'text-zinc-300'}`}>
                            {isPositive ? '+' : '-'}KES {Number(tx.amount || 0).toLocaleString()}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${tx.status === 'COMPLETED' ? 'bg-success/10 text-success border-success/20' : tx.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                            {tx.status || 'COMPLETED'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-zinc-800 flex items-center justify-center gap-2 bg-zinc-950/30">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-300 disabled:opacity-40 hover:bg-zinc-800 transition-colors">Previous</button>
              <span className="text-xs font-bold text-zinc-500">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-300 disabled:opacity-40 hover:bg-zinc-800 transition-colors">Next</button>
            </div>
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      {depositModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setDepositModal(false)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2"><ArrowDownLeft className="w-6 h-6 text-success" /> M-Pesa Deposit</h3>
              <p className="text-sm font-semibold text-zinc-400 mt-2">Instantly fund your wallet using Safaricom M-Pesa.</p>
            </div>
            <form onSubmit={handleDeposit} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-wider">Amount (KES) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-black">KES</span>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="5000" min={10} required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-14 pr-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-success transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-wider">M-Pesa Phone Number *</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0712345678" required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-success transition-colors" />
              </div>
              <div className="bg-success/10 border border-success/20 p-4 rounded-xl flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-zinc-300 leading-relaxed">You will receive an M-Pesa STK Push prompt on your phone. Enter your PIN to complete the deposit.</p>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setDepositModal(false)} className="px-5 py-3 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-colors">Cancel</button>
                <button type="submit" disabled={deposit.isPending} className="px-6 py-3 bg-success text-black rounded-xl text-sm font-black hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {deposit.isPending ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> Sending...</> : 'Send STK Push'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {withdrawModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setWithdrawModal(false)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2"><ArrowUpRight className="w-6 h-6 text-red-400" /> Withdraw to M-Pesa</h3>
              <p className="text-sm font-semibold text-zinc-400 mt-2">Available to withdraw: <span className="font-black text-white">KES {availableBalance.toLocaleString()}</span></p>
            </div>
            <form onSubmit={handleWithdraw} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-wider">Amount (KES) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-black">KES</span>
                  <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="2000" min={10} max={availableBalance} required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-14 pr-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-red-400 transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-wider">M-Pesa Phone Number *</label>
                <input type="tel" value={withdrawPhone} onChange={(e) => setWithdrawPhone(e.target.value)} placeholder="0712345678" required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-red-400 transition-colors" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setWithdrawModal(false)} className="px-5 py-3 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-colors">Cancel</button>
                <button type="submit" disabled={withdraw.isPending} className="px-6 py-3 bg-zinc-100 text-black rounded-xl text-sm font-black hover:bg-white transition-colors disabled:opacity-50">
                  {withdraw.isPending ? 'Processing...' : 'Withdraw'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}