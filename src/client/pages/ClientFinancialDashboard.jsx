import React, { useState } from 'react';
import { 
  DollarSign, ArrowUpRight, ArrowDownLeft, ShieldCheck, 
  TrendingUp, Download, CheckCircle, RefreshCw, Eye, FileText, CreditCard
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function ClientFinancialDashboard() {
  const [walletBalance, setWalletBalance] = useState(250000);
  const [escrowBalance, setEscrowBalance] = useState(85000);
  const [isLoading, setIsLoading] = useState(false);

  const initialLedger = [
    { id: 'INV-2026-001', project: 'Website Redesign', provider: 'Sarah Jenkins', date: 'Oct 15, 2026', amount: 5000, status: 'Pending', type: 'Milestone 2' },
    { id: 'INV-2026-002', project: 'Mobile App Dev', provider: 'David Chen', date: 'Oct 10, 2026', amount: 12500, status: 'Paid', type: 'Final Delivery' },
    { id: 'INV-2026-003', project: 'SEO Audit', provider: 'Kiprotich Arap', date: 'Oct 05, 2026', amount: 1500, status: 'Pending', type: 'Consultation' },
    { id: 'INV-2026-004', project: 'Figma Design System', provider: 'Elena Rostova', date: 'Sep 28, 2026', amount: 8500, status: 'Paid', type: 'Milestone 1' }
  ];

  const [ledger, setLedger] = useState(initialLedger);

  const handlePay = (txnId, amount, name) => {
    setIsLoading(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: `Processing payment of $${amount.toLocaleString()} to ${name}...`,
        success: () => {
          setLedger(prev => prev.map(t => t.id === txnId ? { ...t, status: 'Paid' } : t));
          setWalletBalance(prev => prev - amount);
          setIsLoading(false);
          return `Payment successfully sent to ${name}!`;
        },
        error: 'Payment processing failed.'
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-white bg-zinc-950 min-h-screen">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
        }} 
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Billing & Invoices</h1>
          <p className="text-sm font-semibold text-zinc-400 mt-1">Manage your payments, escrow balances, and download statements.</p>
        </div>

        <div className="flex gap-3">
          <button className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Add Payment Method
          </button>
          <button 
            onClick={() => toast.success('Statement downloaded successfully.')} 
            className="bg-vivid-lavender hover:bg-dark-purple text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-vivid-lavender/20 flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-vivid-lavender/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-vivid-lavender/10 blur-[50px] rounded-full group-hover:bg-vivid-lavender/20 transition-colors"></div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-vivid-lavender" /> Total Spent
          </p>
          <h2 className="text-4xl font-black text-white">$145,000</h2>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-zinc-500">
            <span className="flex items-center gap-1 text-vivid-green bg-vivid-green/10 px-2 py-0.5 rounded border border-vivid-green/20">
              <TrendingUp className="w-3 h-3" /> +12.5%
            </span>
            vs last year
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-zinc-300" /> Escrow Balance
          </p>
          <h2 className="text-4xl font-black text-white">${escrowBalance.toLocaleString()}</h2>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-zinc-500">
            <span className="flex items-center gap-1">
              Secured across 4 active projects
            </span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-zinc-300" /> Outstanding Invoices
          </p>
          <h2 className="text-4xl font-black text-white">$6,500</h2>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-zinc-500">
            <span className="flex items-center gap-1 text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded border border-orange-400/20">
              2 pending
            </span>
            payments required
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Invoice Table */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-white">Recent Invoices</h3>
                <p className="text-sm font-medium text-zinc-400 mt-1">Review and pay your outstanding balances.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950/50">
                  <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider font-bold">
                    <th className="px-6 py-4">Invoice ID</th>
                    <th className="px-6 py-4">Project & Provider</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {ledger.map(txn => (
                    <tr key={txn.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-zinc-300">{txn.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{txn.project}</div>
                        <div className="text-xs text-zinc-500">{txn.provider}</div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">{txn.date}</td>
                      <td className="px-6 py-4 font-black text-white">${txn.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                          txn.status === 'Paid' 
                            ? 'bg-zinc-800 text-zinc-400 border-zinc-700' 
                            : 'bg-vivid-lavender/10 text-vivid-lavender border-vivid-lavender/30'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="View PDF">
                          <Eye className="w-4 h-4" />
                        </button>
                        {txn.status === 'Pending' ? (
                          <button 
                            disabled={isLoading}
                            onClick={() => handlePay(txn.id, txn.amount, txn.provider)}
                            className="bg-vivid-lavender hover:bg-dark-purple text-white font-bold text-xs py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                          >
                            Pay Now
                          </button>
                        ) : (
                          <button className="bg-zinc-800 text-zinc-500 font-bold text-xs py-2 px-4 rounded-lg cursor-not-allowed">
                            Settled
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Analytics Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-black text-sm uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-4 mb-5">
              Spend by Category
            </h3>
            <div className="space-y-5">
              {[
                { name: 'Software Development', val: 65, color: 'bg-vivid-lavender' },
                { name: 'Design & Creative', val: 20, color: 'bg-zinc-400' },
                { name: 'Marketing', val: 10, color: 'bg-zinc-600' },
                { name: 'Consulting', val: 5, color: 'bg-zinc-700' }
              ].map(cat => (
                <div key={cat.name} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-zinc-300">
                    <span>{cat.name}</span>
                    <span>{cat.val}%</span>
                  </div>
                  <div className="h-2 bg-zinc-950 border border-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} shadow-lg`} style={{ width: `${cat.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-dark-purple border border-vivid-lavender/30 text-white rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-vivid-lavender/20 blur-[50px] rounded-full"></div>
            <div className="relative z-10">
              <h4 className="font-black text-sm tracking-wider flex items-center gap-2 mb-3">
                <RefreshCw className="w-4 h-4 text-vivid-lavender" /> Auto-Billing Enabled
              </h4>
              <p className="text-xs font-medium text-white/70 leading-relaxed mb-4">
                Your primary credit card ending in **4242** will be automatically charged on the 1st of every month for outstanding balances.
              </p>
              <button className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors border border-white/10">
                Manage Billing Settings
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
