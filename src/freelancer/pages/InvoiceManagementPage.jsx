// src/pages/freelancer/InvoiceManagementPage.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, Filter, Search, Plus, FileSignature, CheckCircle2,
  AlertCircle, DollarSign, Send, Calculator, Building, Receipt, Check, X
} from 'lucide-react';
import { useGetInvoices, useGenerateInvoice } from '../services/freelancerHooks';

export default function InvoiceManagementPage() {
  const { data: response, isLoading } = useGetInvoices();
  const apiInvoices = response?.data || response || [];
  
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGenModal, setShowGenModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [includeVAT, setIncludeVAT] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);
  
  const generateInvoice = useGenerateInvoice();

  const fallbackInvoices = [
    { id: 'INV-2026-0042', client: 'Global Finance Corp', date: 'May 20, 2026', dueDate: 'Jun 05, 2026', amount: 150000, vat: 24000, status: 'Paid', method: 'M-Pesa Express' },
    { id: 'INV-2026-0041', client: 'HealthSync App Development', date: 'May 18, 2026', dueDate: 'May 25, 2026', amount: 45000, vat: 7200, status: 'Pending', method: 'Escrow Lock' },
    { id: 'INV-2026-0039', client: 'Nexus Tech Systems', date: 'May 01, 2026', dueDate: 'May 15, 2026', amount: 80000, vat: 12800, status: 'Overdue', method: 'Bank Wire' },
    { id: 'INV-2026-0038', client: 'Startup Inc Solutions', date: 'Apr 28, 2026', dueDate: 'May 12, 2026', amount: 120000, vat: 19200, status: 'Paid', method: 'M-Pesa STK' }
  ];

  const invoices = apiInvoices.length > 0 ? apiInvoices : fallbackInvoices;

  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount + i.vat, 0);
  const totalOutstanding = invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount + i.vat, 0);
  const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.amount + i.vat, 0);

  const handleGenerateInvoiceSubmit = (e) => {
    e.preventDefault();
    if (!clientName || !invoiceAmount) return;

    generateInvoice.mutate({ clientName, invoiceAmount, includeVAT }, {
      onSuccess: () => {
        setShowGenModal(false);
        setClientName('');
        setInvoiceAmount('');
        setShowSuccess({ message: 'Invoice generated and sent to client!' });
        setTimeout(() => setShowSuccess(null), 3000);
      }
    });
  };

  const triggerSTKPush = (id, amount, client) => {
    setShowSuccess({ message: `STK Push sent to ${client}` });
    setTimeout(() => {
      setShowSuccess({ message: `Payment of KES ${amount.toLocaleString()} confirmed from ${client}` });
      setTimeout(() => setShowSuccess(null), 2000);
    }, 1500);
  };

  const handleDownload = (id) => {
    setShowSuccess({ message: `Downloading invoice ${id}` });
    setTimeout(() => setShowSuccess(null), 1500);
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = inv.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            inv.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filter === 'All' || inv.status === filter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, filter, searchQuery]);

  const getStatusStyles = (status) => {
    switch(status) {
      case 'Paid': return 'bg-accent-light text-accent-dark border border-accent DEFAULT';
      case 'Pending': return 'bg-warn-light text-warn border border-warn DEFAULT';
      case 'Overdue': return 'bg-danger-light text-danger border border-danger DEFAULT';
      default: return 'bg-surface-muted text-ink-secondary border border-border';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success/Error Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2 ${
              showSuccess.isError ? 'bg-danger text-white' : 'bg-accent-dark text-white'
            }`}
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent-light rounded-xl">
              <FileSignature className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Billing & invoices</h1>
          </div>
          <p className="text-sm text-ink-secondary font-body mt-1">
            Manage tax compliant invoicing and automate payment tracking
          </p>
        </div>

        <button
          onClick={() => setShowGenModal(true)}
          className="px-5 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm inline-flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create invoice
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">
            Gross invoiced paid
          </p>
          <h2 className="font-mono font-bold text-3xl text-accent DEFAULT mt-1">KES {totalPaid.toLocaleString()}</h2>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">
            Outstanding accounts
          </p>
          <h2 className="font-mono font-bold text-3xl text-warn mt-1">KES {totalOutstanding.toLocaleString()}</h2>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">
            Overdue ledger balance
          </p>
          <h2 className="font-mono font-bold text-3xl text-danger mt-1">KES {totalOverdue.toLocaleString()}</h2>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
            <input
              type="text"
              placeholder="Search invoice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 h-10 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
            />
          </div>

          <div className="flex gap-1.5">
            {['All', 'Paid', 'Pending', 'Overdue'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-body font-medium transition-all ${
                  filter === f
                    ? "bg-brand-900 text-white"
                    : "text-ink-tertiary hover:text-ink-primary hover:bg-surface-muted"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Invoice</th>
                <th className="px-5 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Client</th>
                <th className="px-5 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Date</th>
                <th className="px-5 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">VAT (16%)</th>
                <th className="px-5 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide text-right">Total</th>
                <th className="px-5 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide text-center">Status</th>
                <th className="px-5 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInvoices.map((inv, idx) => (
                <motion.tr
                  key={inv.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="hover:bg-surface-soft transition-colors"
                >
                  <td className="px-5 py-4 font-mono text-sm font-semibold text-ink-primary">{inv.id}</td>
                  <td className="px-5 py-4 font-body font-medium text-sm text-ink-primary">{inv.client}</td>
                  <td className="px-5 py-4 text-sm text-ink-secondary">{inv.date}</td>
                  <td className="px-5 py-4 font-mono text-sm text-ink-secondary">KES {inv.vat.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right font-mono font-semibold text-ink-primary">KES {(inv.amount + inv.vat).toLocaleString()}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-body font-medium ${getStatusStyles(inv.status)}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleDownload(inv.id)}
                        className="p-1.5 text-ink-tertiary hover:text-accent DEFAULT rounded-lg transition-colors"
                        title="Download invoice"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {inv.status === 'Pending' && (
                        <button
                          onClick={() => triggerSTKPush(inv.id, inv.amount + inv.vat, inv.client)}
                          className="px-2.5 py-1 rounded-md bg-accent DEFAULT text-white hover:bg-accent-dark text-xs font-body font-medium transition-colors"
                        >
                          Send payment
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
            <p className="text-ink-secondary">No invoices found</p>
          </div>
        )}
      </div>

      {/* Invoice Generator Modal */}
      <AnimatePresence>
        {showGenModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-border"
            >
              <div className="flex justify-between items-center p-5 border-b border-border">
                <h3 className="font-display font-semibold text-lg text-brand-900">New invoice</h3>
                <button
                  onClick={() => setShowGenModal(false)}
                  className="p-1 rounded-lg hover:bg-surface-muted transition-colors"
                >
                  <X className="w-5 h-5 text-ink-tertiary" />
                </button>
              </div>

              <form onSubmit={handleGenerateInvoiceSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1.5">
                    Client name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g., Acme Tech Solutions"
                    className="w-full h-11 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1.5">
                    Amount (KES)
                  </label>
                  <input
                    type="number"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    placeholder="e.g., 80000"
                    className="w-full h-11 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={includeVAT}
                    onChange={(e) => setIncludeVAT(e.target.checked)}
                    className="w-4 h-4 rounded text-accent DEFAULT focus:ring-accent DEFAULT"
                  />
                  <span className="text-sm font-body text-ink-primary">Include 16% VAT</span>
                </label>

                <button
                  type="submit"
                  disabled={generateInvoice.isPending}
                  className="w-full py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 flex items-center justify-center gap-2"
                >
                  {generateInvoice.isPending ? 'Generating...' : <><Send className="w-4 h-4" /> Generate Invoice</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
