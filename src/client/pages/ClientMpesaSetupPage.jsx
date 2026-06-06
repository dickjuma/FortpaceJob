// ClientMpesaSetupPage.jsx
// Self-contained M-Pesa Daraja API Console with design tokens,
// framer-motion animations, and local toast notifications.
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  ShieldCheck,
  Key,
  RefreshCw,
  Send,
  Terminal,
  Globe,
  DollarSign,
  Database,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

// Helper for conditional classes
const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function ClientMpesaSetupPage() {
  const [credentials, setCredentials] = useState({
    consumerKey: 'daraja_key_prod_898a',
    consumerSecret: '••••••••••••••••••••••••',
  });
  const [callbackUrl, setCallbackUrl] = useState(
    'https://api.fortespace.com/v1/payments/mpesa-callback'
  );
  const [simPhone, setSimPhone] = useState('254711002233');
  const [simAmount, setSimAmount] = useState('1500');
  const [logs, setLogs] = useState([
    { time: '13:40:02', event: 'Webhooks verification status: CONNECTED (200 OK)', type: 'system' },
    { time: '13:38:15', event: 'Daraja access_token refreshed successfully.', type: 'auth' },
  ]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const triggerStkSim = async (e) => {
    e.preventDefault();
    if (!simPhone.startsWith('254') || simPhone.length !== 12) {
      showToast('error', 'Please enter a valid phone number starting with 254 (e.g. 254711002233)');
      return;
    }

    setIsSimulating(true);
    const trackingId = 'REQ-' + Math.floor(100000 + Math.random() * 900000);

    setLogs((prev) => [
      {
        time: new Date().toLocaleTimeString(),
        event: `[STK Push Request] Dispatched payload tracking ID: ${trackingId} to ${simPhone} amount KES ${simAmount}`,
        type: 'request',
      },
      ...prev,
    ]);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLogs((prev) => [
      {
        time: new Date().toLocaleTimeString(),
        event: `[Daraja Callback Success] Payment received! MerchantRequestID: ${trackingId}. Status: Completed (ResultCode: 0)`,
        type: 'callback',
      },
      ...prev,
    ]);
    showToast('success', 'M-Pesa STK Callback triggered successfully! Transaction settled.');
    setIsSimulating(false);
  };

  const handleSaveCreds = () => {
    showToast('success', 'M-Pesa Daraja credentials encrypted and updated.');
  };

  const handleClearLogs = () => {
    setLogs([]);
    showToast('info', 'Terminal logs cleared.');
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
  const buttonTap = { scale: 0.97 };
  const cardHover = { y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', transition: { duration: 0.2 } };

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6 mb-8">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-brand-900 tracking-tight">
              M-Pesa Daraja API Console
            </h1>
            <p className="text-ink-secondary text-sm mt-1">
              Configure Safaricom merchant integration credentials, validate callback hooks, and run local sandbox STK simulations.
            </p>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column: Credentials & Status */}
          <div className="lg:col-span-1 space-y-6">
            {/* Credentials Card */}
            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm"
            >
              <h3 className="flex items-center gap-1.5 font-display font-bold text-brand-900 text-sm uppercase tracking-wide mb-4">
                <Key size={16} className="text-accent" /> Daraja Key Credentials
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                    Consumer Key API
                  </label>
                  <input
                    type="text"
                    value={credentials.consumerKey}
                    onChange={(e) =>
                      setCredentials({ ...credentials, consumerKey: e.target.value })
                    }
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                    Consumer Secret Key
                  </label>
                  <input
                    type="password"
                    value={credentials.consumerSecret}
                    onChange={(e) =>
                      setCredentials({ ...credentials, consumerSecret: e.target.value })
                    }
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                    Callback Endpoint URL
                  </label>
                  <input
                    type="text"
                    value={callbackUrl}
                    onChange={(e) => setCallbackUrl(e.target.value)}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                  />
                </div>
                <motion.button
                  whileTap={buttonTap}
                  onClick={handleSaveCreds}
                  className="w-full px-4 py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors"
                >
                  Save & Encrypt Credentials
                </motion.button>
              </div>
            </motion.div>

            {/* Status Card */}
            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm"
            >
              <h4 className="flex items-center gap-1.5 font-display font-bold text-accent text-sm uppercase tracking-wide mb-3">
                <ShieldCheck size={16} /> Gateway Environment Status
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-tertiary">SSL Certification:</span>
                  <span className="font-medium text-ink-primary">Active (Auto-Renew)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-tertiary">API Gateway URL:</span>
                  <span className="font-mono text-ink-primary text-xs">api.safaricom.co.ke</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-tertiary">Connection Ping:</span>
                  <span className="font-medium text-accent">14ms (Optimal)</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: STK Simulator & Logs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* STK Simulator Card */}
              <motion.div
                variants={itemVariants}
                whileHover={cardHover}
                className="bg-white border border-border rounded-2xl p-5 shadow-sm"
              >
                <h3 className="flex items-center gap-1.5 font-display font-bold text-brand-900 text-sm uppercase tracking-wide mb-4">
                  <Smartphone size={16} className="text-accent" /> STK Push Tester Tool
                </h3>
                <form onSubmit={triggerStkSim} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                      Simulator Mobile Number (254...)
                    </label>
                    <input
                      type="tel"
                      placeholder="254711002233"
                      value={simPhone}
                      onChange={(e) => setSimPhone(e.target.value)}
                      className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                      Test Transaction Amount (KES)
                    </label>
                    <input
                      type="number"
                      value={simAmount}
                      onChange={(e) => setSimAmount(e.target.value)}
                      className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                    />
                  </div>
                  <motion.button
                    whileTap={buttonTap}
                    type="submit"
                    disabled={isSimulating}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={14} />
                    {isSimulating ? 'Simulating Push...' : 'Simulate STK push'}
                  </motion.button>
                </form>
              </motion.div>

              {/* Terminal Logs Card */}
              <motion.div
                variants={itemVariants}
                className="bg-white border border-border rounded-2xl p-5 shadow-sm flex flex-col h-full"
              >
                <div className="flex justify-between items-center border-b border-border pb-2 mb-3">
                  <h4 className="flex items-center gap-1.5 font-display font-bold text-brand-900 text-sm uppercase tracking-wide">
                    <Terminal size={16} className="text-accent" /> Live Webhook Log Feed
                  </h4>
                  <button
                    onClick={handleClearLogs}
                    className="text-xs font-medium text-ink-tertiary hover:text-ink-primary transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto max-h-[280px] space-y-2.5 font-mono text-[11px]">
                  {logs.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-ink-tertiary">
                      Terminal listening for callback notifications...
                    </div>
                  ) : (
                    logs.map((log, idx) => (
                      <div key={idx} className="flex gap-2 items-start border-l-2 pl-2 border-border">
                        <span className="text-ink-tertiary shrink-0">{log.time}</span>
                        <span
                          className={cn(
                            log.type === 'callback'
                              ? 'text-accent font-medium'
                              : log.type === 'request'
                              ? 'text-info'
                              : log.type === 'auth'
                              ? 'text-warn'
                              : 'text-ink-secondary'
                          )}
                        >
                          {log.event}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
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
            {toast.type === 'info' && <ShieldCheck size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
