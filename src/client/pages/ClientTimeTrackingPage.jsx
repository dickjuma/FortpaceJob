// ClientTimeTrackingPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Eye, Play, Trash, CheckCircle,
  Settings, AlertTriangle, RefreshCw, Zap, ArrowRight, Camera
} from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function ClientTimeTrackingPage() {
  const [logs, setLogs] = useState([
    { id: 'LOG-001', worker: 'Kiprotich Arap', task: 'Pipeline Site Alignment Survey', hours: 4.5, rate: 'KES 2,500/hr', amount: 11250, status: 'Approved', screenshot: 'GPS Verified Onsite Check-In' },
    { id: 'LOG-002', worker: 'Sarah Jenkins', task: 'Interactive Framer Motion Dashboards', hours: 8.2, rate: 'KES 3,500/hr', amount: 28700, status: 'Pending Review', screenshot: 'screenshot_nairobi_flexbox.png' },
    { id: 'LOG-003', worker: 'Grace Mutua', task: 'Fiber Cable Splicing Audits', hours: 6.0, rate: 'KES 3,200/hr', amount: 19200, status: 'Approved', screenshot: 'GPS Verified Onsite Check-In' }
  ]);
  const [toast, setToast] = useState(null);

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const handleApproveLog = async (logId, name, amount) => {
    showToast('info', `Approving KES ${amount.toLocaleString()} for ${name}...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLogs(prev => prev.map(l => l.id === logId ? { ...l, status: 'Approved' } : l));
    showToast('success', `Time log approved! Payment scheduled.`);
  };

  const handleExport = () => {
    showToast('success', 'Time log CSV spreadsheet downloaded.');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };
  const tableRowVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } }
  };
  const buttonTap = { scale: 0.97 };

  const totalHours = logs.reduce((sum, l) => sum + l.hours, 0);
  const totalAmount = logs.reduce((sum, l) => sum + l.amount, 0);
  const pendingCount = logs.filter(l => l.status === 'Pending Review').length;

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-900 tracking-tight">
              Time Logs & Activity Tracker
            </h1>
            <p className="text-ink-secondary text-sm mt-1">
              Audit active hourly billing sheets, review geo-tagged screenshot proofs, and approve completed work logs.
            </p>
          </div>
          <motion.button
            whileTap={buttonTap}
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Export Timesheets
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Table */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-border">
                <h3 className="flex items-center gap-2 font-display font-bold text-brand-900 text-sm uppercase tracking-wide">
                  <Clock className="w-4 h-4 text-accent" /> Logged Billing Sheets
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-soft text-ink-tertiary">
                    <tr className="border-b border-border">
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide">Field Operator</th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide">Logged Task</th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide">Hours</th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide">Amount</th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide">Proof</th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {logs.map((log, idx) => (
                      <motion.tr
                        key={log.id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-surface-soft transition-colors"
                      >
                        <td className="px-5 py-4 font-medium text-ink-primary">{log.worker}</td>
                        <td className="px-5 py-4 text-ink-secondary">{log.task}</td>
                        <td className="px-5 py-4 font-mono text-ink-tertiary">{log.hours} Hrs</td>
                        <td className="px-5 py-4 font-bold text-ink-primary">KES {log.amount.toLocaleString()}</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 text-[10px] text-ink-tertiary font-mono">
                            <Camera className="w-3.5 h-3.5 text-accent" /> {log.screenshot}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {log.status === 'Pending Review' ? (
                            <motion.button
                              whileTap={buttonTap}
                              onClick={() => handleApproveLog(log.id, log.worker, log.amount)}
                              className="px-3 py-1.5 bg-accent-light text-accent-dark rounded-lg text-[10px] font-medium transition-colors hover:bg-accent/20"
                            >
                              Approve Time
                            </motion.button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-ink-tertiary">
                              <CheckCircle className="w-3.5 h-3.5 text-accent" /> Approved
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-6">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-white border border-border rounded-2xl p-5 shadow-sm"
            >
              <h3 className="font-display font-bold text-brand-900 text-sm uppercase tracking-wide pb-3 mb-3 border-b border-border">
                Active Hourly Summary
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-ink-tertiary">Total Tracked This Week:</span>
                  <span className="font-semibold text-ink-primary font-mono">{totalHours.toFixed(1)} Hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-tertiary">Active Billing Total:</span>
                  <span className="font-bold text-accent">KES {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-tertiary">Pending Approvals:</span>
                  <span className="font-semibold text-warn">{pendingCount} Log{pendingCount !== 1 ? 's' : ''} Pending</span>
                </div>
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
              backgroundColor: toast.type === 'success' ? 'rgb(220, 252, 231)' :
                               toast.type === 'error' ? 'rgb(254, 226, 226)' : 'rgb(219, 234, 254)',
              color: toast.type === 'success' ? 'rgb(21, 128, 61)' :
                     toast.type === 'error' ? 'rgb(185, 28, 28)' : 'rgb(29, 78, 216)'
            }}
          >
            {toast.type === 'success' && <CheckCircle className="w-4 h-4" />}
            {toast.type === 'error' && <AlertTriangle className="w-4 h-4" />}
            {toast.type === 'info' && <Clock className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
