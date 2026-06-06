// src/pages/freelancer/FreelancerTaxInvoicesPage.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, Filter, Search, TrendingUp,
  DollarSign, Calculator, Settings, Receipt, FileDown,
  PieChart, ChevronRight, Check
} from 'lucide-react';
import { useFreelancerOrders } from '../services/freelancerHooks';

const getStatusStyles = (status) => {
  switch (status) {
    case 'Paid': return 'bg-accent-light text-accent-dark';
    case 'Pending': return 'bg-warn-light text-warn';
    case 'Overdue': return 'bg-danger-light text-danger';
    default: return 'bg-surface-muted text-ink-secondary';
  }
};

const normalizeOrderStatus = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (['completed', 'paid', 'settled', 'fulfilled'].includes(normalized)) return 'Paid';
  if (['active', 'pending', 'in_progress', 'delivered', 'revision'].includes(normalized)) return 'Pending';
  if (['cancelled', 'refunded', 'overdue', 'failed'].includes(normalized)) return 'Overdue';
  return 'Pending';
};

export default function FreelancerTaxInvoicesPage() {
  const [activeTab, setActiveTab] = useState('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(null);

  const { data, isLoading } = useFreelancerOrders({ page: 1, limit: 50 });
  const orders = data?.items || [];

  const invoices = useMemo(() => {
    return orders.map((order) => {
      const client = order.client?.name || order.customer?.name || order.buyer?.name || order.clientName || 'Client';
      const date = order.createdAt || order.updatedAt || order.date || 'Unknown';
      const amount = order.amount || order.totalAmount || 0;
      const status = normalizeOrderStatus(order.status);
      return {
        id: order.id?.toString() || `INV-${order.id}`,
        client,
        date,
        amount,
        currency: order.currency || 'KES',
        tax: Math.round(amount * 0.2),
        status,
      };
    });
  }, [orders]);

  const ytdEarnings = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const estimatedTax = Math.round(ytdEarnings * 0.2);
  const unpaidInvoices = invoices.filter(invoice => invoice.status !== 'Paid').reduce((sum, invoice) => sum + invoice.amount, 0);

  const filteredInvoices = invoices.filter(inv =>
    inv.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadInvoice = (invoiceId) => {
    setShowSuccess({ message: `Downloading invoice ${invoiceId}` });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleNewInvoice = () => {
    setShowSuccess({ message: 'New invoice form would open' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleExportCSV = () => {
    setShowSuccess({ message: 'Exporting financial report' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light rounded-xl">
              <Receipt className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-4xl text-brand-900">Taxes & invoices</h1>
          </div>
          <p className="text-ink-secondary font-body mt-1">Manage your earnings, taxes, and download official invoices</p>
        </div>

        <div className="flex bg-surface-muted p-1 rounded-lg">
          {[
            { id: 'invoices', label: 'Invoices', icon: Receipt },
            { id: 'taxes', label: 'Tax Summary', icon: PieChart },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-md text-xs font-body font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-white text-ink-primary shadow-sm"
                    : "text-ink-tertiary hover:text-ink-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white border border-border rounded-2xl p-5 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-accent-light/30 blur-[40px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2.5 bg-accent-light rounded-xl">
              <DollarSign className="w-5 h-5 text-accent DEFAULT" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="font-mono font-semibold text-3xl text-ink-primary">KES {ytdEarnings.toLocaleString()}</h3>
            <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mt-1">YTD earnings</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-border rounded-2xl p-5 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-danger-light/30 blur-[40px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2.5 bg-danger-light rounded-xl">
              <Calculator className="w-5 h-5 text-danger" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="font-mono font-semibold text-3xl text-ink-primary">KES {estimatedTax.toLocaleString()}</h3>
            <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mt-1 flex items-center justify-between">
              Est. tax (20%)
              <ChevronRight className="w-4 h-4 text-ink-tertiary cursor-pointer" />
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border border-border rounded-2xl p-5 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-warn-light/30 blur-[40px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2.5 bg-warn-light rounded-xl">
              <Receipt className="w-5 h-5 text-warn" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="font-mono font-semibold text-3xl text-ink-primary">KES {unpaidInvoices.toLocaleString()}</h3>
            <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mt-1">Unpaid invoices</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-5 shadow-sm text-white"
        >
          <h3 className="font-body font-semibold text-base mb-1">Export data</h3>
          <p className="text-xs text-white/80 mb-4 leading-relaxed">Download your financial report for tax filing</p>
          <button
            onClick={handleExportCSV}
            className="w-full py-2.5 bg-white text-brand-900 font-body font-semibold text-xs rounded-lg hover:bg-surface-soft transition-colors"
          >
            Download CSV
          </button>
        </motion.div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'invoices' && (
          <motion.div
            key="invoices"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Toolbar */}
            <div className="p-5 border-b border-border bg-surface-soft">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-auto">
                  <Search className="w-4 h-4 text-ink-tertiary absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-80 pl-9 pr-4 h-10 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                  />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button className="px-4 py-2 bg-white border border-border rounded-lg text-xs font-body font-medium text-ink-primary hover:bg-surface-muted transition-colors flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Filter
                  </button>
                  <button
                    onClick={handleNewInvoice}
                    className="px-4 py-2 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-xs transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" /> New invoice
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-muted">
                  <tr className="border-b border-border">
                    <th className="px-5 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Invoice ID</th>
                    <th className="px-5 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Client</th>
                    <th className="px-5 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Date</th>
                    <th className="px-5 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Amount</th>
                    <th className="px-5 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide text-center">Status</th>
                    <th className="px-5 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredInvoices.map((invoice, idx) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-surface-soft transition-colors group cursor-pointer"
                    >
                      <td className="px-5 py-4 font-mono text-sm font-semibold text-accent DEFAULT">
                        {invoice.id}
                      </td>
                      <td className="px-5 py-4 font-body font-semibold text-sm text-ink-primary group-hover:text-accent DEFAULT transition-colors">
                        {invoice.client}
                      </td>
                      <td className="px-5 py-4 font-body text-sm text-ink-secondary">
                        {invoice.date}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-mono font-semibold text-sm text-ink-primary">{invoice.currency} {invoice.amount.toLocaleString()}</span>
                          <span className="text-xs font-mono text-ink-tertiary">+ {invoice.currency} {invoice.tax.toLocaleString()} tax</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-body font-medium ${getStatusStyles(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDownloadInvoice(invoice.id)}
                          className="p-2 text-ink-tertiary hover:text-accent DEFAULT hover:bg-accent-light rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
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
          </motion.div>
        )}

        {activeTab === 'taxes' && (
          <motion.div
            key="taxes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-border rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center"
          >
            <div className="w-20 h-20 bg-accent-light rounded-2xl flex items-center justify-center mb-6">
              <PieChart className="w-10 h-10 text-accent DEFAULT" />
            </div>
            <h2 className="font-display font-semibold text-2xl text-brand-900 mb-3">Detailed tax analytics</h2>
            <p className="text-ink-secondary max-w-md leading-relaxed mb-6">
              Connect your accounting software to see breakdowns by tax category, deductions, and jurisdictions
            </p>
            <button className="px-6 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors">
              Connect QuickBooks
            </button>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-border rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center"
          >
            <Settings className="w-16 h-16 text-ink-tertiary mx-auto mb-4" />
            <h3 className="font-body font-semibold text-xl text-ink-primary mb-2">Tax settings</h3>
            <p className="text-ink-secondary">Configure your tax preferences and reporting options</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
