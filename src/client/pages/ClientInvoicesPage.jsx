// ClientInvoicesPage.jsx
// Self-contained Invoice Control & Tax Audits page with design tokens,
// framer-motion animations, and local mock data. No external dependencies.
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ShieldCheck,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  DollarSign,
  X,
} from 'lucide-react';
import { getInvoices, payInvoice } from '../services/clientApi';


export default function ClientInvoicesPage() {
  const queryClient = useQueryClient();
  const [payingInvoiceId, setPayingInvoiceId] = useState(null);

  const { data: invoicesData, isLoading } = useQuery({
    queryKey: ['client', 'invoices'],
    queryFn: async () => {
      const data = await getInvoices({ limit: 50 });
      const items = data?.items || [];
      return items.map((inv) => ({
        ...inv,
        dbId: inv.id || inv.dbId,
        taxWithheld: inv.taxWithheld ?? Math.round((inv.amount || 0) * 0.1),
      }));
    }
  });
  const invoices = invoicesData || [];

  const showToast = (type, message, duration = 3000) => {
    console.log({ type, message });
    setTimeout(() => console.log(null), duration);
  };

  const payMutation = useMutation({
    mutationFn: async ({ dbId }) => payInvoice(dbId),
    onSuccess: (_, { dbId, amount }) => {
      queryClient.setQueryData(['client', 'invoices'], old => old?.map((inv) => inv.dbId === dbId ? { ...inv, status: 'Paid' } : inv));
      showToast('success', "Invoice KES  paid successfully! KRA Withholding tax reserved.");
    },
    onError: (err) => {
      showToast('error', err?.message || 'Failed to pay invoice');
    },
    onSettled: () => {
      setPayingInvoiceId(null);
    }
  });

  const handlePayInvoice = (dbId, amount) => {
    setPayingInvoiceId(dbId);
    payMutation.mutate({ dbId, amount });
  };

  const handleCreateInvoice = () => {
    showToast('info', 'New invoice template initialized.');
  };

  const handlePrintPDF = (invoiceId) => {
    showToast('success', `Dispatched print-ready PDF invoice #${invoiceId}.`);
  };

  // Calculate cumulative Withholding Tax reserved from paid invoices
  const totalWhtReserved = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.taxWithheld, 0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };
  const tableRowVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };
  const buttonTap = { scale: 0.97 };
  const cardHover = {
    rest: { y: 0, boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    hover: {
      y: -3,
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6 mb-8">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-brand-900 tracking-tight">
              Invoice Control & Tax Audits
            </h1>
            <p className="text-ink-secondary text-sm mt-1">
              Audit billing history, reserve withholding tax allocations (VAT), and download print-ready receipts.
            </p>
          </div>
          <motion.button
            whileTap={buttonTap}
            onClick={handleCreateInvoice}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors shadow-sm"
          >
            <Plus size={16} /> Create Custom Invoice
          </motion.button>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Tax Ledger */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover={cardHover.hover}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm"
            >
              <h3 className="flex items-center gap-1.5 font-display font-bold text-brand-900 text-sm uppercase tracking-wide mb-4">
                <ShieldCheck size={16} className="text-accent" /> iTax KRA Ledger
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-ink-secondary">Withholding tax (WHT) status:</span>
                  <span className="font-semibold text-accent">COMPLIANT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-secondary">Total Reserved This Month:</span>
                  <span className="font-mono font-semibold text-ink-primary">
                    KES {totalWhtReserved.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Info Card */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-accent-light border border-accent/20 rounded-2xl p-5"
            >
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-accent-dark shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-accent-dark text-sm">Tax Compliance</h4>
                  <p className="text-xs text-ink-secondary mt-1">
                    Withholding tax (10%) is automatically deducted from each payment and reported to KRA.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Invoices Table */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-border bg-white">
                <h3 className="font-display font-bold text-brand-900 text-sm uppercase tracking-wide flex items-center gap-2">
                  <FileText size={16} className="text-accent" /> Active Corporate Invoices ({invoices.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-soft text-ink-tertiary">
                    <tr className="border-b border-border">
                      <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">
                        Invoice Details
                      </th>
                      <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">
                        Withholding Tax (10%)
                      </th>
                      <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">
                        Dispatched Date
                      </th>
                      <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">
                        Status
                      </th>
                      <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {isLoading ? (
                      <tr>
                        <td colSpan="5" className="px-5 py-8 text-center text-ink-tertiary">
                          Loading corporate invoices...
                        </td>
                      </tr>
                    ) : invoices.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-5 py-8 text-center text-ink-tertiary">
                          No active invoices found.
                        </td>
                      </tr>
                    ) : (
                      invoices.map((inv, idx) => (
                        <motion.tr
                          key={inv.id}
                          variants={tableRowVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: idx * 0.05 }}
                          className="hover:bg-surface-soft transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="font-semibold text-ink-primary">
                              KES {inv.amount.toLocaleString()}
                            </div>
                            <span className="text-[10px] font-mono text-ink-tertiary uppercase">
                              {inv.id}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-mono text-ink-secondary">
                            KES {inv.taxWithheld.toLocaleString()}
                          </td>
                          <td className="px-5 py-4 font-mono text-ink-secondary">{inv.date}</td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                inv.status === 'Paid'
                                  ? 'bg-accent-light text-accent-dark'
                                  : 'bg-warn-light text-warn'
                              }`}
                            >
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            {inv.status === 'Awaiting Settlement' ? (
                              <motion.button
                                whileTap={buttonTap}
                                onClick={() => handlePayInvoice(inv.dbId, inv.amount)}
                                disabled={payingInvoiceId === inv.dbId}
                                className="inline-flex items-center px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {payingInvoiceId === inv.dbId ? (
                                  <>Processing...</>
                                ) : (
                                  <>Pay with M-Pesa STK</>
                                )}
                              </motion.button>
                            ) : (
                              <motion.button
                                whileTap={buttonTap}
                                onClick={() => handlePrintPDF(inv.id)}
                                className="inline-flex items-center gap-1 text-ink-tertiary hover:text-accent transition-colors text-xs font-medium"
                              >
                                <Download size={12} /> Print PDF
                              </motion.button>
                            )}
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
            style={{
              backgroundColor:
                toast.type === 'success'
                  ? 'rgb(220, 252, 231)'
                  : toast.type === 'error'
                  ? 'rgb(254, 226, 226)'
                  : 'rgb(219, 234, 254)',
              color:
                toast.type === 'success'
                  ? 'rgb(21, 128, 61)'
                  : toast.type === 'error'
                  ? 'rgb(185, 28, 28)'
                  : 'rgb(29, 78, 216)',
            }}
          >
            {toast.type === 'success' && <CheckCircle size={16} />}
            {toast.type === 'error' && <AlertTriangle size={16} />}
            {toast.type === 'info' && <ShieldCheck size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

