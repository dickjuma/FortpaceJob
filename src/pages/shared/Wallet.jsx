import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, ArrowUpRight, ArrowDownRight, 
  ShieldCheck, CreditCard, Download, Clock, 
  CheckCircle2, ChevronRight, Activity, Lock, 
  ArrowRight, X, Smartphone, Building2, Coins, Plus
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

// Mock Data - Converted to KES
const transactionData = [
  { id: 'TRX-8291', desc: 'Withdrawal to KCB ****1234', date: 'Oct 24, 2026', amount: '-KES 150,000', status: 'Completed', type: 'withdraw' },
  { id: 'TRX-8290', desc: 'Payment from Enterprise Corp', date: 'Oct 23, 2026', amount: '+KES 300,000', status: 'Completed', type: 'deposit' },
  { id: 'TRX-8289', desc: 'Platform Service Fee (5%)', date: 'Oct 23, 2026', amount: '-KES 15,000', status: 'Completed', type: 'fee' },
  { id: 'TRX-8288', desc: 'Escrow Funded: Mobile App Refactor', date: 'Oct 20, 2026', amount: '+KES 450,000', status: 'Escrow', type: 'escrow' },
  { id: 'TRX-8287', desc: 'Withdrawal to M-Pesa', date: 'Oct 15, 2026', amount: '-KES 80,000', status: 'Processing', type: 'withdraw' },
];

const analyticsData = [
  { name: 'Mon', in: 120000, out: 0 },
  { name: 'Tue', in: 300000, out: 150000 },
  { name: 'Wed', in: 0, out: 15000 },
  { name: 'Thu', in: 450000, out: 0 },
  { name: 'Fri', in: 0, out: 80000 },
  { name: 'Sat', in: 15000, out: 0 },
  { name: 'Sun', in: 0, out: 0 },
];

const WalletPage = () => {
  // Modal State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  
  // Withdrawal Form State
  const [withdrawMethod, setWithdrawMethod] = useState('mpesa');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Handlers for Toasts
  const handleExportStatement = () => {
    toast.success('Your statement is generating and will download shortly!', { icon: '📄' });
  };

  const handleAddFunds = () => {
    toast.success('Top-up channels are opening...', { icon: '💳' });
  };

  const handleViewAllTransactions = () => {
    toast('Fetching all historical transactions...', { icon: '⏳' });
  };

  const handleAddPaymentMethod = () => {
    toast.success('New payment method setup initiated.', { icon: '➕' });
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API Call
    setTimeout(() => {
      setIsProcessing(false);
      setWithdrawSuccess(true);
      toast.success(`Withdrawal to ${withdrawMethod.toUpperCase()} initiated successfully!`);
      setTimeout(() => {
        setIsWithdrawModalOpen(false);
        setWithdrawSuccess(false);
        setWithdrawAmount('');
        setWithdrawAccount('');
      }, 2500);
    }, 1500);
  };

  const getMethodIcon = (method) => {
    switch(method) {
      case 'mpesa':
      case 'airtel': return <Smartphone className="w-5 h-5 text-green-600" />;
      case 'bank': return <Building2 className="w-5 h-5 text-[#4C1D95]" />;
      default: return <CreditCard className="w-5 h-5 text-zinc-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 relative">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-[#4C1D95]" /> Wallet & Payments
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">Manage your earnings, escrows, and financial methods in KES.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportStatement}
            className="px-5 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl font-bold hover:bg-surface dark:hover:bg-zinc-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export Statement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Wallet Overview (Fintech Cards) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Main Balance Card */}
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
                1,245,000<span className="text-zinc-400 text-2xl">.00</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="flex-1 py-3 bg-[#4C1D95] hover:bg-[#22C55E] text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-colors flex justify-center items-center gap-2"
                >
                  <ArrowUpRight className="w-4 h-4" /> Withdraw
                </button>
                <button 
                  onClick={handleAddFunds}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 border border-white/10 font-bold rounded-xl transition-colors flex justify-center items-center gap-2 backdrop-blur-sm"
                >
                  <ArrowDownRight className="w-4 h-4" /> Add Funds
                </button>
              </div>
            </div>
          </motion.div>

          {/* Escrow & Pending Card */}
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
                <span className="text-lg text-zinc-400 mr-1">KES</span>450,000.00
              </div>
            </div>
            
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-700">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Pending Clearance</span>
                 <span className="font-bold text-zinc-900 dark:text-white">KES 85,000</span>
               </div>
               <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden mt-3">
                 <div className="h-full bg-amber-500 rounded-full w-1/3" />
               </div>
            </div>
          </motion.div>
        </div>

        {/* 4. Payment Analytics Chart */}
        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#4C1D95]" /> Cash Flow (7d)
            </h3>
          </div>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData} margin={{top: 10, right: 0, left: -20, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip cursor={{fill: '#f1f5f9', opacity: 0.1}} contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }} />
                <Bar dataKey="in" fill="#10B981" radius={[2, 2, 0, 0]} name="Inflow (KES)" />
                <Bar dataKey="out" fill="#EF4444" radius={[2, 2, 0, 0]} name="Outflow (KES)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-700 text-xs font-semibold">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Earnings</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Spend / Withdraw</div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Transactions Table */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-800 rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-700 flex justify-between items-center">
            <h2 className="font-bold text-xl text-zinc-900 dark:text-white">Recent Transactions</h2>
            <button 
              onClick={handleViewAllTransactions}
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
                {transactionData.map((trx, idx) => (
                  <tr key={idx} className="hover:bg-surface dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          trx.type === 'deposit' ? 'bg-green-50 text-green-600 dark:bg-green-900/30' :
                          trx.type === 'withdraw' ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700' :
                          trx.type === 'escrow' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30' :
                          'bg-red-50 text-red-600 dark:bg-red-900/30'
                        }`}>
                          {trx.type === 'deposit' ? <ArrowDownRight className="w-5 h-5" /> : 
                           trx.type === 'withdraw' ? <ArrowUpRight className="w-5 h-5" /> : 
                           trx.type === 'escrow' ? <Lock className="w-4 h-4" /> :
                           <Coins className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900 dark:text-white">{trx.desc}</div>
                          <div className="text-xs text-zinc-500 font-mono mt-0.5">{trx.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{trx.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {trx.status === 'Completed' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : 
                         trx.status === 'Escrow' ? <Lock className="w-4 h-4 text-amber-500" /> :
                         <Clock className="w-4 h-4 text-[#4C1D95]" />}
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{trx.status}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${
                      trx.amount.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-zinc-900 dark:text-white'
                    }`}>
                      {trx.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
           {/* Payment Methods */}
           <div className="bg-white dark:bg-zinc-800 rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-6">
             <div className="flex justify-between items-center mb-6">
               <h2 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                 <CreditCard className="w-5 h-5 text-zinc-400" /> Payment Methods
               </h2>
               <button 
                 onClick={handleAddPaymentMethod}
                 className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 transition-colors"
               >
                 <Plus className="w-4 h-4" />
               </button>
             </div>
             
             <div className="space-y-3">
               {/* M-Pesa */}
               <div className="p-4 border border-[#4C1D95]/20 dark:border-[#4C1D95]/20 bg-[#4C1D95]/5/50 dark:bg-[#4C1D95]/10 rounded-2xl flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-6 bg-green-600 rounded flex items-center justify-center text-[10px] font-bold text-white tracking-widest">MPESA</div>
                   <div>
                     <div className="font-bold text-sm text-zinc-900 dark:text-white">M-Pesa Mobile Money</div>
                     <div className="text-xs text-zinc-500 font-mono">+254 7** *** 123</div>
                   </div>
                 </div>
                 <div className="px-2 py-1 bg-[#4C1D95]/10 dark:bg-[#4C1D95]/40 text-[#4C1D95] dark:text-[#4C1D95] text-[10px] font-bold uppercase rounded">Primary</div>
               </div>

               {/* Airtel Money */}
               <div 
                 onClick={handleAddPaymentMethod}
                 className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-2xl flex justify-between items-center hover:border-zinc-300 transition-colors cursor-pointer"
               >
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-6 bg-red-600 rounded flex items-center justify-center text-[10px] font-bold text-white tracking-widest">AIRTEL</div>
                   <div>
                     <div className="font-bold text-sm text-zinc-900 dark:text-white">Airtel Money</div>
                     <div className="text-xs text-zinc-500 font-mono">+254 1** *** 456</div>
                   </div>
                 </div>
               </div>
               
               {/* Bank Account */}
               <div 
                 onClick={handleAddPaymentMethod}
                 className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-2xl flex justify-between items-center hover:border-zinc-300 transition-colors cursor-pointer"
               >
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-6 bg-blue-800 rounded flex items-center justify-center text-[10px] font-bold text-white tracking-widest">KCB</div>
                   <div>
                     <div className="font-bold text-sm text-zinc-900 dark:text-white">KCB Bank</div>
                     <div className="text-xs text-zinc-500 font-mono">**** 9876</div>
                   </div>
                 </div>
               </div>
             </div>
           </div>

           {/* 3. Quick Withdrawal Box */}
           <div className="bg-gradient-to-br from-[#4C1D95] to-blue-50 dark:from-zinc-800 dark:to-zinc-900 border border-[#4C1D95]/20 dark:border-zinc-700 rounded-3xl p-6 shadow-sm">
             <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Quick Transfer</h3>
             <div className="bg-white dark:bg-surface-dark rounded-xl p-1 mb-4 flex items-center border border-zinc-200 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-#4C1D95]">
               <span className="pl-4 text-zinc-500 font-bold text-sm">KES</span>
               <input 
                 type="number" 
                 placeholder="0.00" 
                 value={withdrawAmount}
                 onChange={(e) => setWithdrawAmount(e.target.value)}
                 className="w-full bg-transparent px-2 py-3 outline-none font-bold text-lg text-zinc-900 dark:text-white" 
               />
               <button 
                 onClick={() => setWithdrawAmount('1245000')}
                 className="px-3 text-xs font-bold text-[#4C1D95] hover:text-[#4C1D95] mr-2"
               >
                 Max
               </button>
             </div>
             <button 
               onClick={() => setIsWithdrawModalOpen(true)}
               className="w-full py-3 bg-[#4C1D95] hover:bg-[#22C55E] text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex justify-center items-center gap-2"
             >
               Withdraw Funds <ArrowRight className="w-4 h-4" />
             </button>
           </div>
        </div>
      </div>

      {/* WITHDRAWAL MODAL OVERLAY */}
      <AnimatePresence>
        {isWithdrawModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setIsWithdrawModalOpen(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
            >
              {withdrawSuccess ? (
                <div className="p-10 text-center flex flex-col items-center">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Withdrawal Initiated!</h3>
                  <p className="text-zinc-500">Your funds are being transferred to {withdrawMethod.toUpperCase()} and should arrive shortly.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="font-bold text-xl text-zinc-900 dark:text-white flex items-center gap-2">
                      <ArrowUpRight className="w-5 h-5 text-[#4C1D95]" /> Withdraw Funds
                    </h2>
                    <button 
                      onClick={() => !isProcessing && setIsWithdrawModalOpen(false)}
                      className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleWithdrawSubmit} className="p-6 space-y-6">
                    {/* Select Method */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Withdrawal Method</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'mpesa', name: 'M-Pesa', color: 'border-green-500 bg-green-50 text-green-700' },
                          { id: 'airtel', name: 'Airtel Money', color: 'border-red-500 bg-red-50 text-red-700' },
                          { id: 'bank', name: 'Local Bank', color: 'border-#4C1D95] bg-blue-50 text-blue-700' },
                          { id: 'paypal', name: 'PayPal', color: 'border-zinc-500 bg-zinc-50 text-zinc-700' }
                        ].map((method) => (
                          <div 
                            key={method.id}
                            onClick={() => setWithdrawMethod(method.id)}
                            className={`p-3 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-2 ${
                              withdrawMethod === method.id ? method.color : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 text-zinc-600'
                            }`}
                          >
                            <div className="shrink-0">{getMethodIcon(method.id)}</div>
                            <span className="font-bold text-sm">{method.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Account Details */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                        {(withdrawMethod === 'mpesa' || withdrawMethod === 'airtel') ? 'Mobile Number' : 
                         withdrawMethod === 'bank' ? 'Account Number' : 'Email Address'}
                      </label>
                      <input 
                        required
                        type={withdrawMethod === 'paypal' ? 'email' : 'text'} 
                        placeholder={(withdrawMethod === 'mpesa' || withdrawMethod === 'airtel') ? '+254 7...' : 'Enter details...'}
                        value={withdrawAccount}
                        onChange={(e) => setWithdrawAccount(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4C1D95] transition-shadow"
                      />
                    </div>

                    {/* Amount */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Amount (KES)</label>
                        <span className="text-xs text-[#4C1D95] font-bold cursor-pointer" onClick={() => setWithdrawAmount('1245000')}>Balance: KES 1,245,000</span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-sm font-bold text-zinc-400">KES</span>
                        <input 
                          required
                          type="number" 
                          min="10"
                          step="1"
                          placeholder="0"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#4C1D95] transition-shadow"
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <button 
                      type="submit" 
                      disabled={isProcessing || !withdrawAmount || !withdrawAccount}
                      className="w-full py-3.5 bg-[#4C1D95] hover:bg-[#22C55E] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
                    >
                      {isProcessing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Confirm Withdrawal <ArrowRight className="w-4 h-4" /></>
                      )}
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

export default WalletPage;


