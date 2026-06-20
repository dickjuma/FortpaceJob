// ClientGpsTrackingPage.jsx
// Self-contained GPS Tracking page with design tokens, framer-motion animations,
// and local toast notifications. No external dependencies.
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Navigation,
  Eye,
  AlertTriangle,
  CheckCircle,
  Map,
  User,
  History,
  Compass,
  ShieldAlert,
  Clock,
  Wifi,
} from 'lucide-react';

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------
const activeTracking = [
  {
    id: 1,
    name: 'Kiprotich Arap',
    site: 'Pipeline Site A',
    checkin: '08:14 AM',
    status: 'Inside Geofence',
    coordinates: '1.2921° S, 36.8219° E',
    battery: '82%',
  },
  {
    id: 2,
    name: 'Grace Mutua',
    site: 'Substation B',
    checkin: '09:30 AM',
    status: 'Out of Boundary',
    coordinates: '1.2990° S, 36.8902° E',
    battery: '95%',
  },
  {
    id: 3,
    name: 'Hassan Farah',
    site: 'Pipeline Site A',
    checkin: '08:02 AM',
    status: 'Inside Geofence',
    coordinates: '1.2925° S, 36.8210° E',
    battery: '41%',
  },
];

const routeReplays = [
  { time: '12:30 PM', event: 'Grace Mutua checked out from Substation B', status: 'info' },
  { time: '11:15 AM', event: 'Kiprotich Arap reached Pipeline Site A centroid', status: 'success' },
  { time: '09:42 AM', event: 'Geofence Breach alert triggered by Operator #2 (Grace Mutua)', status: 'alert' },
];

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function ClientGpsTrackingPage() {
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'routes'
  const [toast, setToast] = useState(null);

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const handleEditBoundaries = () => {
    showToast('success', 'Boundary coordinates locked.');
  };

  const handleDispatchWarning = () => {
    showToast('success', 'Dispatched coordinator alert.');
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

  const activeCount = activeTracking.filter((w) => w.status === 'Inside Geofence').length;
  const breachCount = activeTracking.filter((w) => w.status === 'Out of Boundary').length;

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6 mb-8">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-brand-900 tracking-tight">
              Active Field GPS Tracker
            </h1>
            <p className="text-ink-secondary text-sm mt-1">
              Real-time geo-location logs, safety boundaries checklists, and automated checked-in logs.
            </p>
          </div>

          <div className="flex bg-surface-muted border border-border p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('live')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'live'
                  ? 'bg-white text-brand-900 shadow-sm'
                  : 'text-ink-tertiary hover:text-ink-primary'
              }`}
            >
              Live Tracking
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'routes'
                  ? 'bg-white text-brand-900 shadow-sm'
                  : 'text-ink-tertiary hover:text-ink-primary'
              }`}
            >
              Route Replays
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-border rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-ink-tertiary">Active Personnel</p>
              <p className="text-2xl font-bold text-ink-primary">{activeTracking.length}</p>
            </div>
            <div className="p-2 bg-accent-light rounded-xl">
              <User className="w-5 h-5 text-accent" />
            </div>
          </div>
          <div className="bg-white border border-border rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-ink-tertiary">Inside Geofence</p>
              <p className="text-2xl font-bold text-accent">{activeCount}</p>
            </div>
            <div className="p-2 bg-accent-light rounded-xl">
              <CheckCircle className="w-5 h-5 text-accent" />
            </div>
          </div>
          <div className="bg-white border border-border rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-ink-tertiary">Active Breaches</p>
              <p className="text-2xl font-bold text-danger">{breachCount}</p>
            </div>
            <div className="p-2 bg-danger-light rounded-xl">
              <AlertTriangle className="w-5 h-5 text-danger" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area (Left + Middle combined) */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'live' ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="p-5 border-b border-border bg-white">
                  <h3 className="font-display font-bold text-brand-900 text-sm uppercase tracking-wide">
                    Checked-In Field Professionals
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-soft text-ink-tertiary">
                      <tr className="border-b border-border">
                        <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">
                          Operator
                        </th>
                        <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">
                          Site
                        </th>
                        <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">
                          Check-In
                        </th>
                        <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">
                          Location
                        </th>
                        <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">
                          Battery
                        </th>
                        <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-right">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {activeTracking.map((worker, idx) => (
                        <motion.tr
                          key={worker.id}
                          variants={tableRowVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: idx * 0.05 }}
                          className="hover:bg-surface-soft transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-accent-light text-accent-dark flex items-center justify-center">
                                <User size={14} />
                              </div>
                              <span className="font-medium text-ink-primary">{worker.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-ink-secondary">{worker.site}</td>
                          <td className="px-5 py-4 font-mono text-ink-tertiary">{worker.checkin}</td>
                          <td className="px-5 py-4 font-mono text-ink-tertiary text-xs">
                            {worker.coordinates}
                          </td>
                          <td className="px-5 py-4 text-ink-secondary">{worker.battery}</td>
                          <td className="px-5 py-4 text-right">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                worker.status === 'Inside Geofence'
                                  ? 'bg-accent-light text-accent-dark'
                                  : 'bg-danger-light text-danger'
                              }`}
                            >
                              {worker.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white border border-border rounded-2xl shadow-sm p-6"
              >
                <h3 className="font-display font-bold text-brand-900 text-sm uppercase tracking-wide mb-4">
                  Live Route Callback Logs
                </h3>
                <div className="space-y-3">
                  {routeReplays.map((r, idx) => (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      className="flex justify-between items-center p-3.5 bg-surface-soft border border-border rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        {r.status === 'alert' ? (
                          <ShieldAlert className="w-4 h-4 text-danger" />
                        ) : r.status === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-accent" />
                        ) : (
                          <Clock className="w-4 h-4 text-ink-tertiary" />
                        )}
                        <span
                          className={`text-sm ${
                            r.status === 'alert' ? 'text-danger font-medium' : 'text-ink-primary'
                          }`}
                        >
                          {r.event}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-ink-tertiary">{r.time}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Geofencing Settings Card */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white border border-border rounded-2xl shadow-sm p-6"
            >
              <h3 className="font-display font-bold text-brand-900 text-sm uppercase tracking-wide pb-3 border-b border-border mb-4">
                Geofencing & Security Settings
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-ink-secondary">Auto-Checkin Alerts:</span>
                  <span className="font-semibold text-accent">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-secondary">Radius Breach Triggers:</span>
                  <span className="font-semibold text-accent">SMS DISPATCH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-secondary">Battery Low Warning:</span>
                  <span className="font-mono text-ink-primary">20% Threshold</span>
                </div>
              </div>
              <motion.button
                whileTap={buttonTap}
                onClick={handleEditBoundaries}
                className="w-full mt-5 px-4 py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors"
              >
                Edit Boundaries Matrix
              </motion.button>
            </motion.div>

            {/* Breach Alert Card */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-danger-light border border-danger/20 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-danger/10 rounded-full blur-3xl"></div>
              <h4 className="flex items-center gap-2 font-display font-bold text-danger text-sm uppercase tracking-wide mb-3">
                <AlertTriangle size={16} /> {breachCount} active Geofence Breach
              </h4>
              <p className="text-sm text-ink-primary leading-relaxed mb-4">
                Grace Mutua has traveled beyond the structured coordinate limits of Nairobi
                Substation B radius (exceeded by 1.4 KM).
              </p>
              <motion.button
                whileTap={buttonTap}
                onClick={handleDispatchWarning}
                className="w-full px-4 py-2.5 bg-danger text-white rounded-lg font-medium text-sm hover:bg-danger-dark transition-colors"
              >
                Dispatch Warning Alert
              </motion.button>
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
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
