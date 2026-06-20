// ClientProcurementEcosystemPage.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  ShieldCheck,
  Users,
  TrendingUp,
  Search,
  Award,
  FileText,
  CheckCircle,
  Clock,
  Truck,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

// Helper
const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function ClientProcurementEcosystemPage() {
  const queryClient = useQueryClient();
  const { data: rfqsData } = useQuery({
    queryKey: ['client', 'ecosystemRfqs'],
    queryFn: async () => [
      { id: 'RFQ-8821', title: 'Fiber Splicing Nairobi East', budget: 'KES 250,000', bidsCount: 3, status: 'Bidding Active' },
      { id: 'RFQ-7640', title: 'Pipeline Substation Concrete Auditing', budget: 'KES 180,000', bidsCount: 2, status: 'Awaiting Award' }
    ]
  });
  const rfqs = rfqsData || [];

  const { data: vendorsData } = useQuery({
    queryKey: ['client', 'ecosystemVendors'],
    queryFn: async () => [
      { id: 1, name: 'Safaricom Telecomm Logistics', score: '98%', bids: 'KES 245,000', delivery: '5 Days', compliance: 'Verified KRA' },
      { id: 2, name: 'East Africa Infrastructure Ltd', score: '94%', bids: 'KES 260,000', delivery: '4 Days', compliance: 'Verified KRA' },
      { id: 3, name: 'Apex Surveyor Systems', score: '88%', bids: 'KES 230,000', delivery: '8 Days', compliance: 'Pending Audit' }
    ]
  });
  const vendors = vendorsData || [];

  const [selectedRfq, setSelectedRfq] = useState('RFQ-8821');
  const [toast, setToast] = useState(null);

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const awardMutation = useMutation({
    mutationFn: async ({ vendorName, bidAmount, selectedRfq }) => {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      return { vendorName, selectedRfq };
    },
    onSuccess: ({ vendorName, selectedRfq }) => {
      queryClient.setQueryData(['client', 'ecosystemRfqs'], old => old.map(r => r.id === selectedRfq ? { ...r, status: 'Awarded' } : r));
      showToast('success', "Contract awarded successfully! Purchase order dispatched to .");
    }
  });

  const handleAward = (vendorName, bidAmount) => {
    awardMutation.mutate({ vendorName, bidAmount, selectedRfq });
  };

  const handleCreateRFQ = () => {
    showToast('info', 'New RFQ template generated.');
  };

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
              Procurement & Vendor Command
            </h1>
            <p className="text-ink-secondary text-sm mt-1">
              Audit active requests for quotes (RFQs), analyze multi-vendor compliance matrices, and authorize
              purchase orders.
            </p>
          </div>
          <motion.button
            whileTap={buttonTap}
            onClick={handleCreateRFQ}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors shadow-sm"
          >
            Create New RFQ
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: RFQs List */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              whileHover={cardHover.hover}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm"
            >
              <h3 className="flex items-center gap-1.5 font-display font-bold text-brand-900 text-sm uppercase tracking-wide mb-4">
                <Briefcase size={16} className="text-accent" /> Active RFQ Postings
              </h3>
              <div className="space-y-3">
                {rfqs.map((rfq) => (
                  <motion.div
                    key={rfq.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedRfq(rfq.id)}
                    className={cn(
                      'p-4 rounded-xl border cursor-pointer transition-all',
                      selectedRfq === rfq.id
                        ? 'border-accent bg-accent-light'
                        : 'border-border bg-white hover:border-accent/30'
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono font-semibold text-accent">{rfq.id}</span>
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[8px] font-semibold uppercase tracking-wide',
                          rfq.status === 'Awarded'
                            ? 'bg-accent-light text-accent-dark'
                            : 'bg-warn-light text-warn'
                        )}
                      >
                        {rfq.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-ink-primary mt-2">{rfq.title}</h4>
                    <div className="flex justify-between mt-4 text-[10px] font-medium text-ink-tertiary border-t border-border pt-2">
                      <span>Target Budget: {rfq.budget}</span>
                      <span>{rfq.bidsCount} Bids Received</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Vendor Proposal Matrix */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-border">
                <h3 className="flex items-center gap-2 font-display font-bold text-brand-900 text-sm uppercase tracking-wide">
                  <Users size={16} className="text-accent" /> Vendor Proposal Bid Matrix ({selectedRfq})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-soft text-ink-tertiary">
                    <tr className="border-b border-border">
                      <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">
                        Bidder Identity
                      </th>
                      <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">
                        KRA Compliance
                      </th>
                      <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">
                        Delivery Estimate
                      </th>
                      <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">
                        Quality Score
                      </th>
                      <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">
                        Financial Quote
                      </th>
                      <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-right">
                        Award Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {vendors.map((vendor, idx) => (
                      <motion.tr
                        key={vendor.id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-surface-soft transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-accent-light text-accent-dark flex items-center justify-center">
                              <Truck size={14} />
                            </div>
                            <span className="font-medium text-ink-primary">{vendor.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              'inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium',
                              vendor.compliance === 'Verified KRA'
                                ? 'bg-accent-light text-accent-dark'
                                : 'bg-warn-light text-warn'
                            )}
                          >
                            {vendor.compliance}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-ink-secondary">{vendor.delivery}</td>
                        <td className="px-5 py-4 font-semibold text-accent">{vendor.score}</td>
                        <td className="px-5 py-4 font-bold text-ink-primary">{vendor.bids}</td>
                        <td className="px-5 py-4 text-right">
                          <motion.button
                            whileTap={buttonTap}
                            onClick={() => handleAward(vendor.name, vendor.bids)}
                            className="inline-flex px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent-dark transition-colors"
                          >
                            Award & Escrow
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
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
            {toast.type === 'error' && <AlertCircle size={16} />}
            {toast.type === 'info' && <ShieldCheck size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

