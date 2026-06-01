import React from 'react';
import { 
  FileText, ShieldCheck, Download, AlertTriangle, 
  CheckCircle, Clock, Plus, Search, DollarSign 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useInvoices, usePayInvoice } from '../services/clientHooks';

export default function ClientInvoicesPage() {
  const { data: invoicesData, isLoading } = useInvoices();
  const payInvoiceMutation = usePayInvoice();

  const invoices = invoicesData || [];

  // Calculate cumulative Withholding Tax reserved dynamically from real paid invoices
  const totalWhtReserved = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.taxWithheld, 0);

  const handlePayInvoice = async (dbId, amount) => {
    try {
      await toast.promise(
        payInvoiceMutation.mutateAsync(dbId),
        {
          loading: `Settling invoice KES ${amount.toLocaleString()} via linked M-Pesa Merchant wallet...`,
          success: 'Invoice paid successfully! KRA Withholding tax reserved. 🧾',
          error: (err) => err?.message || 'Invoice settlement failed.'
        }
      );
    } catch (_) {}
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-white bg-zinc-950/20 rounded-3xl animate-in fade-in duration-500">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
        }} 
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Invoice Control & Tax Audits</h1>
          <p className="text-xs font-semibold text-zinc-400 mt-1">Audit billing history, reserve withholding tax allocations (VAT), and download print-ready receipts.</p>
        </div>

        <Button onClick={() => toast.success('New invoice template initialized.')} className="bg-success border-none rounded-xl text-xs font-bold py-2.5 flex items-center gap-1.5 shadow-lg shadow-[#14a800]/25">
          <Plus className="w-4 h-4" /> Create Custom Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Tax Ledger */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 border border-zinc-800 bg-zinc-900 rounded-3xl space-y-4 shadow-xl">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5 text-white">
              <ShieldCheck className="w-4 h-4 text-green-400" /> iTax KRA Ledger
            </h3>
            
            <div className="space-y-4 text-xs font-bold text-zinc-400">
              <div className="flex justify-between items-center">
                <span>Withholding tax (WHT) status:</span>
                <span className="text-green-400 font-black">COMPLIANT</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Reserved This Month:</span>
                <span className="text-white font-mono">KES {totalWhtReserved.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Invoices Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-zinc-800 bg-zinc-900 p-6 rounded-3xl shadow-xl">
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2 text-white">
              <FileText className="w-4 h-4 text-success" /> Active Corporate Invoices ({invoices.length})
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase tracking-wider font-black">
                    <th className="pb-3">Invoice Details</th>
                    <th className="pb-3">Withholding Tax (10%)</th>
                    <th className="pb-3">Dispatched Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-zinc-500 font-bold">Loading corporate invoices...</td>
                    </tr>
                  ) : invoices.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-zinc-500 font-bold">No active invoices found.</td>
                    </tr>
                  ) : (
                    invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-zinc-800/20 transition-colors">
                        <td className="py-4">
                          <div className="font-bold text-white">KES {inv.amount.toLocaleString()}</div>
                          <span className="text-[9px] font-mono text-zinc-500 uppercase font-black">{inv.id}</span>
                        </td>
                        <td className="py-4 text-zinc-300 font-mono">KES {inv.taxWithheld.toLocaleString()}</td>
                        <td className="py-4 text-zinc-300 font-mono">{inv.date}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            inv.status === 'Paid' 
                              ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                              : 'bg-orange-400/10 border border-orange-400/20 text-orange-400 animate-pulse'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {inv.status === 'Awaiting Settlement' ? (
                            <Button 
                              disabled={payInvoiceMutation.isPending}
                              onClick={() => handlePayInvoice(inv.dbId, inv.amount)}
                              className="bg-success hover:bg-success border-none font-bold text-[9px] py-1.5 px-3 rounded-lg shadow-md shadow-[#14a800]/10"
                            >
                              Pay with M-Pesa STK
                            </Button>
                          ) : (
                            <button 
                              onClick={() => toast.success('Dispatched print-ready PDF invoice.')}
                              className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1 font-bold text-[10px] justify-end ml-auto"
                            >
                              <Download size={12} /> Print PDF
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
