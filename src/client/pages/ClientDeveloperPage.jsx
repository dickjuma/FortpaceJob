// ClientDeveloperPage.jsx
// Self-contained Developer API Credentials page with design tokens,
// framer-motion animations, and local toast notifications.
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  ShieldCheck,
  Key,
  RefreshCw,
  Send,
  Globe,
  DollarSign,
  Database,
  AlertCircle,
  Copy,
  CheckCircle,
} from 'lucide-react';

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function ClientDeveloperPage() {
  const [credentials, setCredentials] = useState({
    clientKey: 'oauth_client_prod_442c',
    clientSecret: '••••••••••••••••••••••••••••••••',
  });
  const [webhookUrl, setWebhookUrl] = useState('https://api.acme.com/v1/workforce-callbacks');
  const [sandboxActive, setSandboxActive] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const copyCred = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast('success', `${label} copied to clipboard.`);
  };

  const handleSave = () => {
    showToast('success', 'Developer API endpoint configurations saved.');
  };

  const toggleEnvironment = () => {
    setSandboxActive(!sandboxActive);
    showToast(
      'info',
      `Environment toggled to ${!sandboxActive ? 'Sandbox' : 'Production'}.`
    );
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

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6 mb-8">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-brand-900 tracking-tight">
              Developer API Credentials
            </h1>
            <p className="text-ink-secondary text-sm mt-1">
              Configure OAuth applications, define live webhook endpoint parameters, and retrieve platform secrets.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-surface-muted border border-border p-1.5 rounded-xl text-sm">
            <span className="text-xs font-medium text-ink-tertiary uppercase tracking-wide">
              Environment:
            </span>
            <motion.button
              whileTap={buttonTap}
              onClick={toggleEnvironment}
              className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
                sandboxActive
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-white border border-border text-ink-primary'
              }`}
            >
              {sandboxActive ? 'Sandbox Active' : 'Production Mode'}
            </motion.button>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column: OAuth Credentials */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-display font-bold text-brand-900 text-sm uppercase tracking-wide mb-4">
                <Key size={18} className="text-accent" /> OAuth Credentials
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                    Client Application ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={credentials.clientKey}
                      readOnly
                      className="w-full h-10 border border-border rounded-lg px-3 text-sm font-mono bg-surface-soft text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent pr-20"
                    />
                    <button
                      onClick={() => copyCred(credentials.clientKey, 'Client ID')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-ink-tertiary hover:text-accent hover:bg-accent-light transition-colors"
                      aria-label="Copy client ID"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                    Client Secret Token
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={credentials.clientSecret}
                      readOnly
                      className="w-full h-10 border border-border rounded-lg px-3 text-sm font-mono bg-surface-soft text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent pr-20"
                    />
                    <button
                      onClick={() =>
                        copyCred('oauth_client_prod_secret_token_key_xyz', 'Client Secret')
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-ink-tertiary hover:text-accent hover:bg-accent-light transition-colors"
                      aria-label="Copy client secret"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-info-light border border-info/20 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-info shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-info-dark text-sm">Security Notice</h4>
                  <p className="text-xs text-ink-secondary mt-1">
                    Keep your client secret secure. Never share it in public repositories or client-side code.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Webhook Configuration */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-display font-bold text-brand-900 text-sm uppercase tracking-wide mb-4">
                <Globe size={18} className="text-accent" /> Webhook Integrations
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                    Callback Event URL
                  </label>
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                    placeholder="https://your-domain.com/webhook"
                  />
                  <p className="text-xs text-ink-tertiary mt-1.5">
                    We'll POST events (job.created, contract.signed, payment.released) to this endpoint.
                  </p>
                </div>

                <motion.button
                  whileTap={buttonTap}
                  onClick={handleSave}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors"
                >
                  Save & Encrypt Developer Config
                </motion.button>
              </div>
            </div>

            {/* Example payload card */}
            <div className="mt-6 bg-surface-muted border border-border rounded-2xl p-5">
              <h4 className="flex items-center gap-2 font-medium text-ink-primary text-sm mb-3">
                <Terminal size={16} className="text-accent" /> Example Webhook Payload
              </h4>
              <pre className="bg-white border border-border rounded-xl p-4 text-xs font-mono text-ink-secondary overflow-x-auto">
{`{
  "event": "contract.signed",
  "timestamp": "2026-06-05T10:30:00Z",
  "data": {
    "contractId": "CT-4421",
    "freelancerId": "FL-7891",
    "amount": 85000
  }
}`}
              </pre>
            </div>
          </motion.div>
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
