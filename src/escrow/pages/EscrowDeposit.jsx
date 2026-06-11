import React, { useState } from 'react';
import { DollarSign, Smartphone, CreditCard } from 'lucide-react';
import { walletAPI } from '../../common/services/api';
import toast from 'react-hot-toast';

export default function EscrowDeposit() {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const result = await walletAPI.initiateStkPush({
        amount: parseFloat(amount),
        phoneNumber
      });
      toast.success(result.message || 'Deposit initiated!');
    } catch (err) {
      toast.error(err.message || 'Deposit failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add Funds to Wallet</h1>
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleDeposit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Amount (KES)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-sm font-bold text-zinc-400">KES</span>
              <input required type="number" min="10" step="1" placeholder="0"
                value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#4C1D95]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">M-Pesa Phone Number</label>
            <input required type="text" placeholder="+254 7..." value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4C1D95]" />
          </div>

          <button type="submit" disabled={isProcessing || !amount || !phoneNumber}
            className="w-full py-3 bg-[#4C1D95] hover:bg-[#22C55E] disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all">
            {isProcessing ? 'Processing...' : 'Initiate M-Pesa STK Push'}
          </button>
        </form>
      </div>
    </div>
  );
}