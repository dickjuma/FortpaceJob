import React, { useState } from 'react';
import { 
  FileText, ShieldCheck, Download, AlertTriangle, 
  CheckCircle, Clock, Plus, Search, DollarSign 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function ClientInvoicesPage() {
  const [invoices, setInvoices] = useState([
    { id: 'INV-9022', client: 'Acme Digital Ltd', amount: 85000, taxWithheld: 8500, date: '2026-05-15', status: 'Paid' },
    { id: 'INV-8871', client: 'Pipeline Solutions', amount: 120000, taxWithheld: 12000, date: '2026-05-22', status: 'Awaiting Settlement' }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handlePayInvoice = (invId, name, amount) => {
    setIsLoading(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: `Settling invoice KES ${amount.toLocaleString()} via linked M-Pesa Merchant wallet...`,
        success: () => {
          setInvoices(prev => prev.map(inv => inv.id === invId ? { ...inv, status: 'Paid' } : inv));
          setIsLoading(false);
          return `Invoice paid! KRA Withholding tax reserved. 🧾`;
        },
        error: 'Invoice settlement failed.'
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-white bg-zinc-950/20 rounded-3xl animate-in fade-in duration-500">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Invoice Control & Tax Audits</h1>
          <p className="text-xs font-semibold text-light-gray/50 mt-1">Audit billing history, reserve withholding tax allocations (VAT), and download print-ready receipts.</p>
        </div>

        <Button onClick={() => toast.success('New invoice template initialized.')} className="bg-accent-purple border-none rounded-xl text-xs font-bold py-2.5 flex items-center gap-1.5 shadow-lg shadow-accent-purple/20">
          <Plus className="w-4 h-4" /> Create Custom Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Tax Ledger */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 border border-white/10 bg-white/5 rounded-3xl space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-success" /> iTax KRA Ledger</h3>
            
            <div className="space-y-4 text-xs font-bold text-light-gray/60">
              <div className="flex justify-between items-center">
                <span>Withholding tax (WHT) status:</span>
                <span className="text-success font-black">COMPLIANT</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Reserved This Month:</span>
                <span className="text-white font-mono">KES 20,500</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Invoices Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-white/10 bg-white/5 p-6 rounded-3xl">
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-accent-purple" /> Active Corporate Invoices ({invoices.length})</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium">
                <thead>
                  <tr className="border-b border-white/5 text-light-gray/40 text-[10px] uppercase tracking-wider font-black">
                    <th className="pb-3">Invoice Details</th>
                    <th className="pb-3">Withholding Tax (10%)</th>
                    <th className="pb-3">Dispatched Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4">
                        <div className="font-bold text-white">KES {inv.amount.toLocaleString()}</div>
                        <span className="text-[9px] font-mono text-light-gray/40 uppercase font-black">{inv.id}</span>
                      </td>
                      <td className="py-4 text-light-gray font-mono">KES {inv.taxWithheld.toLocaleString()}</td>
                      <td className="py-4 text-light-gray font-mono">{inv.date}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          inv.status === 'Paid' 
                            ? 'bg-success/20 text-success' 
                            : 'bg-orange-400/20 text-orange-400 animate-pulse'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {inv.status === 'Awaiting Settlement' ? (
                          <Button 
                            disabled={isLoading}
                            onClick={() => handlePayInvoice(inv.id, inv.client, inv.amount)}
                            className="bg-accent-purple hover:bg-accent-purple/90 border-none font-bold text-[9px] py-1.5 px-3 rounded-lg"
                          >
                            Pay with M-Pesa STK
                          </Button>
                        ) : (
                          <button 
                            onClick={() => toast.success('Dispatched print-ready PDF invoice.')}
                            className="text-light-gray/40 hover:text-white transition-colors flex items-center gap-1 font-bold text-[10px] justify-end ml-auto"
                          >
                            <Download size={12} /> Print PDF
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
