// ClientErpSystemsPage.jsx
// Self-contained ERP & Business Systems Hub with design tokens,
// framer-motion animations, and no AI references.
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  BarChart4,
  Box,
  Layers,
  RefreshCcw,
  Truck,
  TrendingUp,
  Cpu,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function ClientErpSystemsPage() {
  const [toast, setToast] = useState(null);
  const [lastSynced, setLastSynced] = useState('2 mins ago');

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const handleSync = () => {
    setLastSynced('Just now');
    showToast('success', 'SAP/Oracle sync initiated successfully.');
  };

  const handleGenerateReport = () => {
    showToast('success', 'ERP report generation started. You will receive a download link shortly.');
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

  const kpiData = [
    { label: 'Total Capital Allocated', value: '$2.4M', icon: TrendingUp, color: 'text-accent', bg: 'bg-accent-light' },
    { label: 'Field Assets Deployed', value: '1,204', icon: Box, color: 'text-info', bg: 'bg-info-light' },
    { label: 'Supply Chain Syncs', value: 'Daily', icon: Truck, color: 'text-warn', bg: 'bg-warn-light' },
    { label: 'System Confidence', value: '94.2%', icon: Cpu, color: 'text-accent', bg: 'bg-accent-light' },
  ];

  const assets = [
    {
      category: 'Geospatial Drones (DJI M300)',
      assignedTo: 'Survey Team Alpha',
      location: 'Site B, Nairobi',
      status: 'Operational',
      statusColor: 'text-accent',
    },
    {
      category: 'Heavy Machinery Tools',
      assignedTo: 'Construction Hub Y',
      location: 'Mombasa Port',
      status: 'Maintenance',
      statusColor: 'text-warn',
    },
    {
      category: 'MacBook Pro (M2) Fleet',
      assignedTo: 'Remote Dev Agency',
      location: 'Global Distributed',
      status: 'Operational',
      statusColor: 'text-accent',
    },
  ];

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-brand-900 flex items-center gap-3">
              <Database className="w-8 h-8 text-accent" />
              ERP & Business Systems Hub
            </h1>
            <p className="text-ink-secondary text-sm mt-2">
              Enterprise Resource Planning connected directly to your decentralized workforce operations.
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileTap={buttonTap}
              onClick={handleSync}
              className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-white text-ink-primary rounded-lg text-sm font-medium hover:bg-surface-soft transition-colors"
            >
              <RefreshCcw className="w-4 h-4" /> Sync SAP/Oracle
            </motion.button>
            <motion.button
              whileTap={buttonTap}
              onClick={handleGenerateReport}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors"
            >
              <BarChart4 className="w-4 h-4" /> Generate ERP Report
            </motion.button>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {kpiData.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-ink-secondary text-sm font-medium">{item.label}</span>
                <div className={`p-2 rounded-lg ${item.bg}`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-ink-primary">{item.value}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Asset & Inventory Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white border border-border rounded-2xl shadow-sm p-6"
        >
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h2 className="font-display text-xl font-bold text-brand-900 flex items-center gap-2">
              <Layers className="w-6 h-6 text-accent" />
              Field Asset & Equipment Ledger
            </h2>
            <span className="text-xs text-ink-tertiary">Last synced: {lastSynced}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Asset Table */}
            <div className="lg:col-span-2 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-soft text-ink-tertiary">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                      Asset Category
                    </th>
                    <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                      Assigned To
                    </th>
                    <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                      Location
                    </th>
                    <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-right">
                      Status
                    </th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {assets.map((asset, idx) => (
                    <motion.tr
                      key={idx}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-surface-soft transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-ink-primary">{asset.category}</td>
                      <td className="px-4 py-3 text-ink-secondary">{asset.assignedTo}</td>
                      <td className="px-4 py-3 text-ink-secondary">{asset.location}</td>
                      <td className={`px-4 py-3 text-right font-medium ${asset.statusColor}`}>
                        {asset.status}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
               </table>
            </div>

            {/* Sidebar Info Cards */}
            <div className="space-y-5">
              <div className="bg-surface-soft border border-border rounded-xl p-4">
                <h3 className="font-display font-bold text-brand-900 text-sm mb-2">
                  Automated Replenishment
                </h3>
                <p className="text-xs text-ink-tertiary mb-3">
                  System detects when consumable field assets drop below threshold and triggers
                  automated procurement requests.
                </p>
                <button className="w-full py-2 bg-accent-light text-accent-dark rounded-lg text-sm font-medium hover:bg-accent/20 transition-colors">
                  View Active Requisitions
                </button>
              </div>

              <div className="bg-surface-soft border border-border rounded-xl p-4">
                <h3 className="font-display font-bold text-brand-900 text-sm mb-2">
                  Depreciation Analytics
                </h3>
                <p className="text-xs text-ink-tertiary mb-3">
                  Link asset lifespan to specific ongoing gig contracts for granular project margin
                  calculations.
                </p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-ink-tertiary mb-1">
                    <span>Asset Utilization</span>
                    <span>65%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full w-[65%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
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
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
