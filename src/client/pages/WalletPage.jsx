import React, { useEffect, useState } from 'react';
import { 
  Wallet, ArrowUpRight, ArrowDownRight, RefreshCcw, Download, Clock, 
  CheckCircle2, AlertCircle, ShieldCheck, Phone, Loader2, Smartphone, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useConfirm } from '../../common/context/ConfirmContext';
import { walletAPI } from '../../common/services/api';
import { websocketService } from '../../common/services/websocket.service';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

import { Skeleton } from '../../components/ui/Skeleton';

export default function WalletPage() {
  const { confirm } = useConfirm();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Top-Up Form States
  const [depositAmount, setDepositAmount] = useState('');
  const [depositPhone, setDepositPhone] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);

  useEffect(() => {
    loadWalletData();

    // Wire up Socket.io for instant balance updates on callback clearance
    const handleBalanceUpdate = (data) => {
      console.log('Client wallet real-time update:', data);
      setWallet({
        availableBalance: data.availableBalance,
        lockedBalance: data.lockedBalance,
        totalBalance: data.availableBalance + data.lockedBalance
      });
      toast.success('Ledger balance cleared and updated.');
      loadTransactions();
    };

    const unsubscribe = websocketService.subscribe('wallet:balance_update', handleBalanceUpdate);
    websocketService.connect();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const loadWalletData = async () => {
    try {
      const walletData = await walletAPI.getWallet();
      setWallet(walletData);
      await loadTransactions();
    } catch (err) {
      setError('Failed to load wallet data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const txData = await walletAPI.getTransactions();
      setTransactions(txData.transactions || txData.data || txData || []);
    } catch (err) {
      console.error('Failed to load transactions', err);
    }
  };

  const handleMpesaDeposit = async (e) => {
    e.preventDefault();
    if (!depositPhone) {
      toast.error('Safaricom number is required.');
      return;
    }
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) {
      toast.error('Invalid deposit amount.');
      return;
    }

    const ok = await confirm({
      title: 'Confirm deposit',
      message: `Deposit KES ${amt.toLocaleString()} via M-Pesa STK Push to ${depositPhone}?`,
      confirmLabel: 'Send STK Push',
    });
    if (!ok) return;

    setIsDepositing(true);
    const toastId = toast.loading('Sending M-Pesa STK Push request...');

    try {
      const response = await walletAPI.depositMpesa(amt, depositPhone);
      toast.success(response.message || 'STK Push sent successfully!', { id: toastId });
      setDepositAmount('');

      // Standard polling query status fallback
      if (response.checkoutRequestId) {
        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          try {
            const status = await walletAPI.getMpesaStatus(response.checkoutRequestId);
            const statusVal = status.status || status.data?.status;
            if (statusVal === 'COMPLETED') {
              clearInterval(interval);
              toast.success('Top-Up successfully cleared by Safaricom!', { id: 'deposit-poll' });
              await loadWalletData();
            } else if (statusVal === 'FAILED') {
              clearInterval(interval);
              toast.error('Top-Up cancelled or failed.', { id: 'deposit-poll' });
            }
          } catch (e) {
            console.error('Error checking status', e);
          }
          if (attempts > 10) clearInterval(interval);
        }, 3000);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to trigger M-Pesa STK Push.', { id: toastId });
    } finally {
      setIsDepositing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 font-sans">
      
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-700">
        <h1 className="text-3xl font-black dark:text-white tracking-tight flex items-center gap-2">
          <Wallet className="w-8 h-8 text-[#14a800]" /> Client Financial Wallet
        </h1>
        <Button 
          onClick={loadWalletData}
          variant="outline" 
          className="rounded-xl font-bold text-xs" 
          icon={<RefreshCcw size={14} />}
        >
          Sync Balance
        </Button>
      </div>

      {error && <p className="text-red-500 mb-6 font-bold">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-[#14a800] to-[#118a00] rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-success/20 blur-[50px] rounded-full"></div>
          <h2 className="text-xs font-bold text-[#14a800] uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-success" /> Available Balance
          </h2>
          <p className="text-4xl font-black mt-3">KES {(wallet?.availableBalance || 0).toLocaleString()}</p>
        </div>

        {/* Locked Escrow */}
        <div className="bg-white dark:bg-surface-dark-secondary rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-500" /> Locked in Escrow
            </h2>
            <p className="text-4xl font-black text-gray-900 dark:text-white mt-3">KES {(wallet?.lockedBalance || 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Quick STK Push Top-Up Form */}
        <div className="bg-white dark:bg-surface-dark-secondary rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6">
          <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
            <Smartphone className="w-4 h-4 text-green-600" /> Quick Top-Up (STK Push)
          </h2>
          <form onSubmit={handleMpesaDeposit} className="space-y-3">
            <div>
              <input 
                type="text" 
                placeholder="Safaricom number (e.g. 0712345678)" 
                value={depositPhone}
                onChange={(e) => setDepositPhone(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#14a800]/20"
              />
            </div>
            <div>
              <input 
                type="number" 
                placeholder="Amount in KES" 
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#14a800]/20"
              />
            </div>
            <button 
              type="submit"
              disabled={isDepositing}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-1.5"
            >
              {isDepositing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Send STK Push
            </button>
          </form>
        </div>
      </div>

      <h2 className="text-xl font-black dark:text-white tracking-tight mb-4">Recent Ledger Transactions</h2>
      <div className="bg-white dark:bg-surface-dark-secondary rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-sm">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 font-bold text-xs">
            No transactions cleared yet.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-800 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface-dark-secondary divide-y divide-gray-200 dark:divide-gray-700 text-xs">
              {transactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {new Date(tx.createdAt || tx.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                    {tx.description || tx.reference || 'Reconciled Ledger Entry'}
                  </td>
                  <td className={`px-6 py-4 text-right font-black ${tx.amount > 0 || tx.type === 'CREDIT' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                    {tx.amount > 0 || tx.type === 'CREDIT' ? '+' : ''}KES {Math.abs(tx.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    <span className="px-2 py-1 bg-success/10 text-success font-bold uppercase rounded text-[9px]">
                      {tx.status || 'COMPLETED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
