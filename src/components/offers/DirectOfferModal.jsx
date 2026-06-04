import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Calendar, Paperclip, Send } from 'lucide-react';

export default function DirectOfferModal({ isOpen, onClose, freelancerName = "Sarah Jenkins" }) {
  const [offerDetails, setOfferDetails] = useState({
    title: '',
    scope: '',
    budget: '',
    deadline: ''
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Send Direct Offer to {freelancerName}</h2>
            <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Offer Title</label>
              <input 
                type="text" 
                placeholder="e.g. Frontend Development for Dashboard"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2bb75c] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scope of Work</label>
              <textarea 
                rows={4}
                placeholder="Describe the deliverables..."
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2bb75c] outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Budget</label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 absolute left-3 top-1/2 -tranzinc-y-1/2 text-gray-400" />
                  <input 
                    type="number" 
                    placeholder="5000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2bb75c] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                <div className="relative">
                  <Calendar className="w-5 h-5 absolute left-3 top-1/2 -tranzinc-y-1/2 text-gray-400" />
                  <input 
                    type="date" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2bb75c] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <button className="flex items-center text-sm font-medium text-[#2bb75c] dark:text-[#2bb75c] hover:text-[#2bb75c]">
                <Paperclip className="w-4 h-4 mr-2" /> Attach Files or Brief
              </button>
            </div>
          </div>

          <div className="p-6 bg-surface dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <button className="px-5 py-2.5 bg-[#2bb75c] hover:bg-[#1d8d38] text-white rounded-xl text-sm font-medium transition-colors flex items-center shadow-lg shadow-[#2bb75c]/25/25">
              <Send className="w-4 h-4 mr-2" /> Send Offer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

