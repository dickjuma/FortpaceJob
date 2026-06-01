import React, { useState, useMemo } from 'react';
import { 
  FileText, Download, Filter, Search, Plus, FileSignature, CheckCircle2, 
  AlertCircle, DollarSign, Send, Calculator, Building, Receipt 
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';

export default function InvoiceManagementPage() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Invoice Generator Modal State
  const [showGenModal, setShowGenModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [includeVAT, setIncludeVAT] = useState(false);

  const [invoices, setInvoices] = useState([
    { id: 'INV-2026-0042', client: 'Global Finance Corp', date: 'May 20, 2026', dueDate: 'Jun 05, 2026', amount: 150000, vat: 24000, status: 'Paid', method: 'M-Pesa Express' },
    { id: 'INV-2026-0041', client: 'HealthSync App Development', date: 'May 18, 2026', dueDate: 'May 25, 2026', amount: 45000, vat: 7200, status: 'Pending', method: 'Escrow Lock' },
    { id: 'INV-2026-0039', client: 'Nexus Tech Systems', date: 'May 01, 2026', dueDate: 'May 15, 2026', amount: 80000, vat: 12800, status: 'Overdue', method: 'Bank Wire' },
    { id: 'INV-2026-0038', client: 'Startup Inc Solutions', date: 'Apr 28, 2026', dueDate: 'May 12, 2026', amount: 120000, vat: 19200, status: 'Paid', method: 'M-Pesa STK' }
  ]);

  const handleGenerateInvoiceSubmit = (e) => {
    e.preventDefault();
    if (!clientName || !invoiceAmount) {
      toast.error('Please enter a valid client name and gross amount.');
      return;
    }
    const amt = parseFloat(invoiceAmount);
    const calculatedVAT = includeVAT ? amt * 0.16 : 0; // 16% standard VAT
    
    const newInv = {
      id: 'INV-2026-' + Math.floor(1000 + Math.random() * 9000),
      client: clientName,
      date: 'May 26, 2026',
      dueDate: 'Jun 10, 2026',
      amount: amt,
      vat: calculatedVAT,
      status: 'Pending',
      method: 'M-Pesa STK'
    };

    setInvoices([newInv, ...invoices]);
    setShowGenModal(false);
    setClientName('');
    setInvoiceAmount('');
    toast.success(`Invoice ${newInv.id} issued successfully! 🧾`);
  };

  const triggerSTKPush = (id, amount, client) => {
    toast.loading(`Dispatching Safaricom M-Pesa STK Push notification to client...`, { id: 'stk' });
    
    setTimeout(() => {
      toast.success(`STK Payout of KES ${(amount).toLocaleString()} confirmed by ${client}! 💳`, { id: 'stk' });
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
    }, 2500);
  };

  const handleDownload = (id) => {
    toast.success(`Procurement Receipt PDF downloaded for ${id}`, { icon: '📄' });
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = inv.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            inv.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filter === 'All' || inv.status === filter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, filter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-success/15 text-success rounded-xl border border-success/20 shadow-sm">
              <FileSignature className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Billing & Invoices</h1>
          </div>
          <p className="text-sm text-text-secondary mt-1 font-semibold">
            Manage tax compliant invoicing, automate VAT estimations, and trigger Safaricom M-Pesa STK payout pushes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setShowGenModal(true)}
            variant="primary" 
            className="bg-success hover:bg-success/95 font-bold text-xs rounded-xl"
            icon={<Plus size={16} />}
          >
            Create Tax Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Generator Modal Dialog */}
      {showGenModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="p-6 bg-white border border-border rounded-3xl w-full max-w-md space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-black text-text-primary text-sm uppercase tracking-wider">New Invoicing Client</h3>
              <button onClick={() => setShowGenModal(false)} className="text-text-secondary hover:text-text-primary"><XIcon className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleGenerateInvoiceSubmit} className="space-y-4 text-xs font-bold text-text-secondary">
              <div>
                <label className="block mb-1.5 uppercase tracking-widest text-[9px]">Client Company Name</label>
                <input 
                  type="text" 
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Acme Tech Solutions"
                  className="w-full rounded-xl border border-border bg-light-gray px-3.5 py-2.5 text-text-primary focus:bg-white focus:border-success outline-none"
                />
              </div>

              <div>
                <label className="block mb-1.5 uppercase tracking-widest text-[9px]">Gross Contract Amount (KES)</label>
                <input 
                  type="number" 
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  placeholder="e.g. 80000"
                  className="w-full rounded-xl border border-border bg-light-gray px-3.5 py-2.5 text-text-primary focus:bg-white focus:border-success outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer py-1">
                <input 
                  type="checkbox" 
                  checked={includeVAT}
                  onChange={(e) => setIncludeVAT(e.target.checked)}
                  className="w-4 h-4 rounded text-success" 
                />
                <span>Include 16% standard VAT distribution</span>
              </label>

              <Button type="submit" variant="primary" className="w-full py-3 bg-success hover:bg-success/95 font-bold rounded-xl text-xs">
                Issue & Send Invoice
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border border-border bg-white shadow-sm">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Gross Invoiced Paid</p>
          <h2 className="text-3xl font-black text-success mt-2">KES 270,000</h2>
        </Card>

        <Card className="p-6 border border-border bg-white shadow-sm">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Outstanding Accounts</p>
          <h2 className="text-3xl font-black text-warning mt-2">KES 45,000</h2>
        </Card>

        <Card className="p-6 border border-border bg-white shadow-sm">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Overdue Ledger Balance</p>
          <h2 className="text-3xl font-black text-[#e63946] mt-2">KES 80,000</h2>
        </Card>
      </div>

      {/* Main Table list */}
      <Card className="p-6 border border-border bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 mb-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-3 w-4 h-4 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search invoice id..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-light-gray text-xs font-bold text-text-primary focus:bg-white focus:border-success outline-none"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto">
            {['All', 'Paid', 'Pending', 'Overdue'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all",
                  filter === f ? "bg-[#222222] text-white shadow-sm" : "text-text-secondary hover:text-text-primary hover:bg-light-gray"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-light-gray/50 border-b border-border text-text-secondary text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Invoice Code</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Issue Date</th>
                <th className="px-6 py-4">Tax (VAT 16%)</th>
                <th className="px-6 py-4 text-right">Net Billable</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Ledger Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-light-gray/30 transition-colors group">
                  <td className="px-6 py-5 font-bold text-text-secondary uppercase">{inv.id}</td>
                  <td className="px-6 py-5 font-black text-text-primary">{inv.client}</td>
                  <td className="px-6 py-5 font-semibold text-text-secondary">{inv.date}</td>
                  <td className="px-6 py-5 font-bold text-text-secondary">KES {inv.vat.toLocaleString()}</td>
                  <td className="px-6 py-5 text-right font-black text-text-primary">KES {(inv.amount + inv.vat).toLocaleString()}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                      inv.status === 'Paid' ? "bg-success/10 text-success border-success/20" :
                      inv.status === 'Pending' ? "bg-warning/10 text-warning border-warning/20" :
                      "bg-[#e63946]/10 text-[#e63946] border-[#e63946]/20"
                    )}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => handleDownload(inv.id)} variant="outline" size="sm" className="px-2" title="Download Statement PDF">
                        <Download size={14} />
                      </Button>
                      {inv.status === 'Pending' && (
                        <button 
                          onClick={() => triggerSTKPush(inv.id, inv.amount + inv.vat, inv.client)}
                          className="px-2.5 py-1.5 bg-success hover:bg-success/95 text-white font-black rounded-lg text-[9px] uppercase tracking-wider transition-all"
                        >
                          Push M-Pesa STK
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

const XIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
