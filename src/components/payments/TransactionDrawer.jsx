import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Receipt, ShieldCheck, CheckCircle, Clock, MapPin, Building, Copy } from 'lucide-react';

export default function TransactionDrawer({ isOpen, onClose, transaction }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-white dark:bg-surface-dark h-full shadow-2xl flex flex-col font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-surface-dark-border">
            <h2 className="text-lg font-bold text-surface-dark dark:text-white flex items-center">
              <Receipt className="w-5 h-5 mr-2 text-brand-600" /> Transaction Details
            </h2>
            <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-surface-dark-secondary rounded-full hover:bg-gray-200 dark:hover:bg-surface-dark-tertiary transition-colors">
              <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-bold text-surface-dark dark:text-white mb-2">$5,000.00</h3>
              <p className="text-sm font-medium text-success bg-success/10 inline-flex px-3 py-1 rounded-full">Completed Successfully</p>
            </div>

            <div className="space-y-6">
              <div className="bg-surface-tertiary dark:bg-surface-dark-secondary rounded-xl p-4 border border-gray-200 dark:border-surface-dark-border">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">Transaction ID</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-surface-dark dark:text-white">TXN-982184920</span>
                    <Copy className="w-3 h-3 text-gray-400 cursor-pointer hover:text-brand-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">Date & Time</span>
                  <span className="text-sm font-medium text-surface-dark dark:text-white">May 19, 2026 • 10:45 AM</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">Type</span>
                  <span className="text-sm font-medium text-surface-dark dark:text-white">Wallet Deposit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Method</span>
                  <span className="text-sm font-medium flex items-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="M-Pesa" className="h-4" />
                    STK Push
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Fee Breakdown</h4>
                <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3 text-sm">
                    <span className="text-gray-500">Deposit Amount</span>
                    <span className="font-medium text-surface-dark dark:text-white">$5,000.00</span>
                  </div>
                  <div className="flex justify-between items-center mb-3 text-sm">
                    <span className="text-gray-500">Processing Fee (0%)</span>
                    <span className="font-medium text-surface-dark dark:text-white">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-surface-dark-border text-sm">
                    <span className="font-bold text-surface-dark dark:text-white">Total Credited</span>
                    <span className="font-bold text-brand-600 dark:text-brand-400">$5,000.00</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Audit Trail</h4>
                <div className="relative border-l-2 border-gray-200 dark:border-surface-dark-border ml-3 space-y-4">
                  <div className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-success ring-4 ring-white dark:ring-surface-dark"></div>
                    <p className="text-sm font-bold text-surface-dark dark:text-white">Funds Credited to Wallet</p>
                    <p className="text-xs text-gray-500">10:45:12 AM</p>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 ring-4 ring-white dark:ring-surface-dark"></div>
                    <p className="text-sm font-bold text-surface-dark dark:text-white">Provider Confirmed (Safaricom)</p>
                    <p className="text-xs text-gray-500">10:45:08 AM • Ref: QWK9284JF</p>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 ring-4 ring-white dark:ring-surface-dark"></div>
                    <p className="text-sm font-bold text-surface-dark dark:text-white">STK Push Initiated</p>
                    <p className="text-xs text-gray-500">10:44:22 AM • IP: 192.168.1.1</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-200 dark:border-surface-dark-border bg-surface dark:bg-surface-dark-secondary flex gap-3">
            <button className="flex-1 py-3 bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-button text-sm font-bold text-surface-dark dark:text-white hover:bg-surface transition-colors shadow-sm">
              Download Receipt
            </button>
            <button className="flex-1 py-3 bg-brand-600 text-white rounded-button text-sm font-bold hover:bg-brand-700 transition-colors shadow-sm">
              Report Issue
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
