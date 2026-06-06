// ClientOfflineMapPage.jsx
// Self-contained Nearby Field Workforce Map with design tokens,
// framer-motion animations, and local toast notifications.
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Compass,
  Search,
  Navigation,
  UserCheck,
  Truck,
  ShieldCheck,
  Activity,
  PhoneCall,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

// Helper for conditional classes
const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function ClientOfflineMapPage() {
  const [radius, setRadius] = useState(15);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  const workers = [
    {
      id: 1,
      name: 'Kiprotich Arap',
      role: 'Concrete Inspector',
      lat: 120,
      lng: 180,
      distance: 4.2,
      rate: 'KES 2,500/hr',
      status: 'Available',
      transportCost: 800,
      phone: '+254711002233',
    },
    {
      id: 2,
      name: 'Grace Mutua',
      role: 'Fiber Splicer Onsite',
      lat: 240,
      lng: 150,
      distance: 9.8,
      rate: 'KES 3,200/hr',
      status: 'On Route',
      transportCost: 1500,
      phone: '+254722334455',
    },
    {
      id: 3,
      name: 'Abebe Bekele',
      role: 'Structural Engineer',
      lat: 160,
      lng: 320,
      distance: 12.5,
      rate: 'KES 4,500/hr',
      status: 'Available',
      transportCost: 2000,
      phone: '+254733445566',
    },
    {
      id: 4,
      name: 'Hassan Farah',
      role: 'Survey Assistant',
      lat: 80,
      lng: 280,
      distance: 1.8,
      rate: 'KES 1,800/hr',
      status: 'Checked In',
      transportCost: 400,
      phone: '+254744556677',
    },
  ];

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const handleAssign = async (worker) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    showToast(
      'success',
      `${worker.name} assigned successfully! Travel allowance dispatched.`
    );
    // Optionally update worker status locally
    setSelectedWorker((prev) => (prev ? { ...prev, status: 'On Route' } : null));
  };

  const filteredWorkers = workers.filter(
    (w) =>
      w.distance <= radius &&
      (w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
  const cardHover = {
    rest: { y: 0, boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    hover: {
      y: -3,
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  };
  const pinHover = {
    rest: { scale: 1 },
    hover: { scale: 1.2, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6 mb-8">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-brand-900 tracking-tight">
              Nearby Field Workforce Map
            </h1>
            <p className="text-ink-secondary text-sm mt-1">
              Locate certified onsite contractors, deploy emergency surveyors, and audit travel fees
              via GPS coordinate grid.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-white border border-border p-2 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wide">
                Search Radius:
              </span>
              <input
                type="range"
                min="5"
                max="25"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-24 accent-accent"
              />
              <span className="text-xs font-mono font-semibold text-accent">{radius} KM</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Filter & Worker List */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4"
            >
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
                <input
                  type="text"
                  placeholder="Search skills, role, or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 border border-border rounded-lg pl-9 pr-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                />
              </div>

              {/* Worker List */}
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                <h3 className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wide">
                  Active Providers within {radius}km ({filteredWorkers.length})
                </h3>
                {filteredWorkers.map((w) => (
                  <motion.div
                    key={w.id}
                    variants={itemVariants}
                    whileHover={cardHover.hover}
                    onClick={() => setSelectedWorker(w)}
                    className={cn(
                      'p-4 rounded-xl border cursor-pointer transition-all',
                      selectedWorker?.id === w.id
                        ? 'border-accent bg-accent-light'
                        : 'border-border bg-white hover:border-accent/30'
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-semibold text-ink-primary">{w.name}</h4>
                        <p className="text-[10px] text-ink-tertiary mt-0.5">{w.role}</p>
                      </div>
                      <span className="text-xs font-mono font-semibold text-accent">
                        {w.distance} KM
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-border text-[10px] font-medium text-ink-tertiary">
                      <span className="font-semibold text-ink-primary">{w.rate}</span>
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-medium',
                          w.status === 'Available'
                            ? 'bg-accent-light text-accent-dark'
                            : w.status === 'On Route'
                            ? 'bg-info-light text-info'
                            : 'bg-surface-muted text-ink-secondary'
                        )}
                      >
                        {w.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Side: Map Canvas */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-border rounded-2xl shadow-sm p-4 relative min-h-[520px] overflow-hidden"
            >
              {/* Compass overlay */}
              <div className="absolute top-4 left-4 z-20 bg-white border border-border rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-mono text-ink-tertiary shadow-sm">
                <Compass className="w-4 h-4 text-accent" />
                <span>Nairobi Site Command Index • GPS ACTIVE</span>
              </div>

              {/* Grid background */}
              <svg
                className="absolute inset-0 w-full h-full text-border pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Worker pins */}
              {filteredWorkers.map((w) => (
                <motion.button
                  key={w.id}
                  variants={pinHover}
                  initial="rest"
                  whileHover="hover"
                  onClick={() => setSelectedWorker(w)}
                  className="absolute transition-transform z-10"
                  style={{ left: `${w.lat}px`, top: `${w.lng}px` }}
                >
                  <div className="relative group">
                    <MapPin
                      className={cn(
                        'w-7 h-7 transition-all',
                        selectedWorker?.id === w.id
                          ? 'text-danger drop-shadow-lg'
                          : 'text-accent'
                      )}
                    />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white"></div>
                  </div>
                </motion.button>
              ))}

              {/* Selected Worker Card */}
              <AnimatePresence>
                {selectedWorker && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-5 right-5 z-20 w-80 bg-white border border-border rounded-2xl shadow-lg p-5"
                  >
                    <div className="flex justify-between items-start pb-3 mb-3 border-b border-border">
                      <div>
                        <h3 className="font-display font-bold text-brand-900">
                          {selectedWorker.name}
                        </h3>
                        <p className="text-xs text-ink-tertiary mt-0.5">{selectedWorker.role}</p>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-accent bg-accent-light px-2 py-0.5 rounded-full">
                        {selectedWorker.distance} km away
                      </span>
                    </div>

                    <div className="space-y-2 text-sm mb-5">
                      <div className="flex justify-between">
                        <span className="text-ink-tertiary">Base Rate:</span>
                        <span className="font-medium text-ink-primary">{selectedWorker.rate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-tertiary">Transport Allowance:</span>
                        <span className="font-medium text-ink-primary">
                          KES {selectedWorker.transportCost}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-tertiary">Contact Direct:</span>
                        <span className="font-medium text-accent flex items-center gap-1">
                          <PhoneCall size={12} /> {selectedWorker.phone}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileTap={buttonTap}
                        onClick={() => handleAssign(selectedWorker)}
                        className="flex-1 px-3 py-2 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors"
                      >
                        Deploy to Coordinates
                      </motion.button>
                      <motion.button
                        whileTap={buttonTap}
                        onClick={() => setSelectedWorker(null)}
                        className="px-3 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
