import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, ArrowUpRight, ArrowDownRight, 
  ShieldCheck, CreditCard, Download, Clock, 
  CheckCircle2, Activity, Lock, 
  ArrowRight, X, Smartphone, Building2, Coins, Plus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import { walletAPI } from '../../common/services/api';
import { websocketService } from '../../common/services/websocket.service';

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState('mpesa');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  useEffect(() => {
    loadWalletData();
    loadTransactions();

    const socket = websocketService.socket;
    if (socket) {
      socket.on('WALLET_UPDATED', setWallet);
      socket.on('TRANSACTION_COMPLETED', (tx) => {
        setTransactions(prev => [tx, ...prev.slice(0, 9)]);
      });
      return () => {
        socket.off('WALLET_UPDATED', setWallet);
        socket.off('TRANSACTION_COMPLETED');
      };
    }
  }, []);

  const loadWalletData = async () => {
    setLoading(true);
    try {
      const data = await walletAPI.getWallet();
      setWallet(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const data = await walletAPI.getTransactions();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    }
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await walletAPI.requestWithdrawal(parseFloat(withdrawAmount), withdrawAccount);
      setWithdrawSuccess(true);
      toast.success('Withdrawal initiated successfully!');
      await loadWalletData();
      setTimeout(() => {
        setIsWithdrawModalOpen(false);
        setWithdrawSuccess(false);
        setWithdrawAmount('');
        setWithdrawAccount('');
      }, 2500);
    } catch (err) {
      toast.error(err.message || 'Withdrawal failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const getMethodIcon = (method) => {
    switch(method) {
      case 'mpesa':
      case 'airtel': return <Smartphone className="w-5 h-5 text-green-600" />;
      case 'bank': return <Building2 className="w-5 h-5 text-[#4C1D95]" />;
      default: return <CreditCard className="w-5 h-5 text-zinc-600" />;
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading wallet data...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 relative">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-[#4C1D95]" /> Wallet & Payments
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">Manage your earnings, escrows, and financial methods in KES.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => toast.success('Your statement is generating...')}
            className="px-5 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl font-bold hover:bg-surface dark:hover:bg-zinc-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export Statement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4C1D95]/20 rounded-full blur-[80px] -tranzinc-y-1/2 tranzinc-x-1/4 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-zinc-400 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-400" /> Available Balance
                </span>
                <span className="px-2 py-1 bg-white/10 rounded border border-white/20 text-xs font-bold font-mono tracking-widest">KES</span>
              </div>
              <div className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">
                {(wallet?.availableBalance || wallet?.available || 0).toLocaleString()}<span className="text-zinc-400 text-2xl">.00</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="flex-1 py-3 bg-[#4C1D95] hover:bg-[#22C55E] text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-colors flex justify-center items-center gap-2"
                >
                  <ArrowUpRight className="w-4 h-4" /> Withdraw
                </button>
                <button 
                  onClick={() => toast.success('Top-up channels are opening...')}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 border border-white/10 font-bold rounded-xl transition-colors flex justify-center items-center gap-2 backdrop-blur-sm"
                >
                  <ArrowDownRight className="w-4 h-4" /> Add Funds
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white dark:bg-zinc-800 rounded-3xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-700 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white">In Escrow</h3>
                  <p className="text-xs text-zinc-500 font-medium">Locked for active contracts</p>
                </div>
              </div>
              <div className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-6">
                <span className="text-lg text-zinc-400 mr-1">KES</span>{(wallet?.escrowBalance || wallet?.escrow || 0).toLocaleString()}.00
              </div>
            </div>
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-700">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Pending Clearance</span>
                 <span className="font-bold text-zinc-900 dark:text-white">KES {(wallet?.pendingBalance || wallet?.pending || 0).toLocaleString()}</span>
               </div>
            </div>
          </motion.div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#4C1D95]" /> Cash Flow (7d)
            </h3>
          </div>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[]} margin={{top: 10, right: 0, left: -20, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f1f5f9', opacity: 0.1}} contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }} />
                <Bar dataKey="in" fill="#10B981" radius={[2, 2, 0, 0]} name="Inflow (KES)" />
                <Bar dataKey="out" fill="#EF4444" radius={[2, 2, 0, 0]} name="Outflow (KES)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-800 rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-700 flex justify-between items-center">
            <h2 className="font-bold text-xl text-zinc-900 dark:text-white">Recent Transactions</h2>
            <button 
              onClick={loadTransactions}
              className="text-sm font-semibold text-[#4C1D95] dark:text-[#4C1D95] hover:text-[#4C1D95] transition-colors"
            >
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface dark:bg-surface-dark/50 text-zinc-500 dark:text-zinc-400 font-medium">
                <tr>
                  <th className="px-6 py-4">Transaction Details</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {transactions.length === 0 ? (
                  <tr><td colSpan="4" className="p-6 text-center text-zinc-500">No transactions yet</td></tr>
                ) : transactions.map((trx, idx) => (
                  <tr key={idx} className="hover:bg-surface dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-900 dark:text-white">{trx.description || trx.type}</div>
                      <div className="text-xs text-zinc-500 font-mono mt-0.5">{trx.id}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{new Date(trx.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{trx.status || 'Completed'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-zinc-900 dark:text-white">
                      KES {trx.amount?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isWithdrawModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setIsWithdrawModalOpen(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
            >
              {withdrawSuccess ? (
                <div className="p-10 text-center flex flex-col items-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Withdrawal Initiated!</h3>
                  <p className="text-zinc-500">Your funds are being transferred and should arrive shortly.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="font-bold text-xl text-zinc-900 dark:text-white flex items-center gap-2">
                      <ArrowUpRight className="w-5 h-5 text-[#4C1D95]" /> Withdraw Funds
                    </h2>
                    <button onClick={() => !isProcessing && setIsWithdrawModalOpen(false)}
                      className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleWithdrawSubmit} className="p-6 space-y-6">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Withdrawal Method</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[{ id: 'mpesa', name: 'M-Pesa', color: 'border-green-500 bg-green-50 text-green-700' }].map((method) => (
                          <div key={method.id} onClick={() => setWithdrawMethod(method.id)}
                            className={`p-3 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-2 ${
                              withdrawMethod === method.id ? method.color : 'border-zinc-200 dark:border-zinc-700 text-zinc-600'}`}>
                            <div className="shrink-0">{getMethodIcon(method.id)}</div>
                            <span className="font-bold text-sm">{method.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Mobile Number</label>
                      <input required type="text" placeholder="+254 7..." value={withdrawAccount}
                        onChange={(e) => setWithdrawAccount(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4C1D95]" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Amount (KES)</label>
                      </div>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-sm font-bold text-zinc-400">KES</span>
                        <input required type="number" min="10" step="1" placeholder="0"
                          value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#4C1D95]" />
                      </div>
                    </div>
                    <button type="submit" disabled={isProcessing || !withdrawAmount || !withdrawAccount}
                      className="w-full py-3.5 bg-[#4C1D95] hover:bg-[#22C55E] disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
                    >
                      {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <>Confirm Withdrawal <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};