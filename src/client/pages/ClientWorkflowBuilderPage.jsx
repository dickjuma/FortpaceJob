// ClientWorkflowBuilderPage.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch, Play, Plus, Trash, CheckCircle,
  Settings, AlertTriangle, RefreshCw, Zap, ArrowRight
} from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function ClientWorkflowBuilderPage() {
    const queryClient = useQueryClient();
  const { data: workflowsData } = useQuery({
    queryKey: ['client', 'workflows'],
    queryFn: async () => {
      return [
        { id: 'WF-1', name: 'On Site Check-In -> Fund Escrow', active: true, trigger: 'Site Check-In', action: 'Auto-Release Travel Allowance' },
        { id: 'WF-2', name: 'Geofence Breach -> Lock Payroll', active: true, trigger: 'Geofence Boundary breach', action: 'Dispatch Warning SMS & Lock Release' },
        { id: 'WF-3', name: 'M-Pesa STK Completed -> Generate Tax Receipt', active: false, trigger: 'M-Pesa STK Push Success', action: 'Send KRA Withholding Record' }
      ];
    }
  });
  const workflows = workflowsData || [];
  const [toast, setToast] = useState(null);

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const toggleMutation = useMutation({
    mutationFn: async (id) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(['client', 'workflows'], old => old?.map(w => w.id === id ? { ...w, active: !w.active } : w));
      showToast('success', 'Workflow configuration state toggled.');
    }
  });

  const toggleWorkflow = (id) => {
    toggleMutation.mutate(id);
  };

  const triggerTest = async (name) => {
    showToast('info', `Simulating trigger node for "${name}"...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    showToast('success', 'Workflow triggered successfully! Actions dispatched.');
  };

  const handleCreateAutomation = () => {
    showToast('info', 'New workflow node instantiated.');
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
  const nodeVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.2 } }
  };
  const buttonTap = { scale: 0.97 };

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-900 tracking-tight">
              Automation & Workflow Builder
            </h1>
            <p className="text-ink-secondary text-sm mt-1">
              Design automation sequences, connect field worker telemetry to fintech releases, and configure notification rules.
            </p>
          </div>
          <motion.button
            whileTap={buttonTap}
            onClick={handleCreateAutomation}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create Automation
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Workflow List */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white border border-border rounded-2xl p-6 shadow-sm"
            >
              <h3 className="flex items-center gap-2 font-display font-bold text-brand-900 text-sm uppercase tracking-wide mb-4">
                <GitBranch className="w-4 h-4 text-accent" /> Configured Automation Sequences
              </h3>
              <div className="space-y-4">
                {workflows.map((wf) => (
                  <motion.div
                    key={wf.id}
                    variants={itemVariants}
                    whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
                    className="p-4 border border-border rounded-xl bg-white transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-semibold text-accent">{wf.id}</span>
                          <span className={cn(
                            "inline-flex px-2 py-0.5 rounded text-[8px] font-semibold uppercase tracking-wide",
                            wf.active ? "bg-accent-light text-accent-dark" : "bg-surface-muted text-ink-tertiary"
                          )}>
                            {wf.active ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-ink-primary">{wf.name}</h4>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-ink-tertiary mt-1">
                          <span className="bg-surface-soft px-2 py-0.5 rounded text-ink-primary font-mono">{wf.trigger}</span>
                          <ArrowRight size={10} />
                          <span className="bg-accent-light px-2 py-0.5 rounded text-accent-dark font-mono">{wf.action}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end">
                        <button
                          onClick={() => toggleWorkflow(wf.id)}
                          className="text-xs font-medium text-ink-tertiary hover:text-accent transition-colors"
                        >
                          {wf.active ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          onClick={() => triggerTest(wf.name)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent-light text-accent-dark rounded-lg text-[10px] font-medium transition-colors hover:bg-accent/20"
                        >
                          <Play size={10} /> Dry Run
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual Node Map */}
          <div className="space-y-6">
            <motion.div
              variants={nodeVariants}
              initial="hidden"
              animate="visible"
              className="bg-white border border-border rounded-2xl p-5 shadow-sm relative overflow-hidden min-h-[380px] flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl rounded-full" />
              <div className="border-b border-border pb-3">
                <h3 className="flex items-center gap-1.5 font-display font-bold text-brand-900 text-xs uppercase tracking-wide">
                  <Zap className="w-4 h-4 text-accent" /> Live Execution Node Map
                </h3>
                <p className="text-[9px] text-ink-tertiary mt-0.5">Visual graph simulator for field triggers</p>
              </div>
              <div className="flex-1 py-5 flex flex-col items-center justify-center gap-3 relative z-10">
                <div className="w-48 p-3 bg-surface-soft border border-accent/30 text-center rounded-xl font-semibold text-[10px] tracking-wide text-accent shadow-sm">
                  ⚡ Check-In QR Scanned
                </div>
                <div className="w-0.5 h-6 bg-border"></div>
                <div className="w-48 p-3 bg-surface-soft border border-accent/30 text-center rounded-xl font-semibold text-[10px] tracking-wide text-accent shadow-sm">
                  ⚙️ Check GPS Centroid
                </div>
                <div className="w-0.5 h-6 bg-border"></div>
                <div className="w-48 p-3 bg-accent text-white text-center rounded-xl font-bold text-[10px] tracking-wide shadow-sm">
                  💸 Release Travel Escrow
                </div>
              </div>
              <div className="bg-surface-soft p-3 rounded-xl border border-border text-[9px] font-medium text-ink-tertiary flex items-center justify-between">
                <span>Simulation Status:</span>
                <span className="text-accent flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  LISTENING
                </span>
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
            {toast.type === 'info' && <Zap className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

