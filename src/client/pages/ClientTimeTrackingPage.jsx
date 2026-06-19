// ClientTimeTrackingPage.jsx
import toast, { Toaster } from 'react-hot-toast';
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock, CheckCircle,
  AlertTriangle, Camera
} from 'lucide-react';

export default function ClientTimeTrackingPage() {
    const { contractId } = useParams();
  const queryClient = useQueryClient();
  const { data: logsData } = useQuery({
    queryKey: ['client', 'timeLogs', contractId],
    queryFn: async () => {
      return [
        { id: 'LOG-001', worker: 'Kiprotich Arap', task: 'Pipeline Site Alignment Survey', hours: 4.5, rate: 'KES 2,500/hr', amount: 11250, status: 'Approved', screenshot: 'GPS Verified Onsite Check-In' },
        { id: 'LOG-002', worker: 'Sarah Jenkins', task: 'Interactive Framer Motion Dashboards', hours: 8.2, rate: 'KES 3,500/hr', amount: 28700, status: 'Pending Review', screenshot: 'screenshot_nairobi_flexbox.png' },
        { id: 'LOG-003', worker: 'Grace Mutua', task: 'Fiber Cable Splicing Audits', hours: 6.0, rate: 'KES 3,200/hr', amount: 19200, status: 'Approved', screenshot: 'GPS Verified Onsite Check-In' }
      ];
    }
  });
  const logs = logsData || [];

  const approveMutation = useMutation({
    mutationFn: async (logId) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return logId;
    },
    onSuccess: (logId) => {
      queryClient.setQueryData(['client', 'timeLogs', contractId], old => old?.map(l => l.id === logId ? { ...l, status: 'Approved' } : l));
      toast.success(`Time log approved! Payment scheduled.`);
    }
  });

  const handleApproveLog = async (logId, name, amount) => {
    console.log('Approving KES for...');
    approveMutation.mutateAsync(logId);
  };

  const handleExport = () => {
    console.log('Approving KES for...');
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
      <Toaster position="top-right" />
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

    </div>
  );
}

