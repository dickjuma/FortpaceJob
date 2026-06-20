import React, { useMemo, useState } from 'react';
import { Package, MessageSquare, Clock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMyOrders } from '../../../platform/common/hooks/useGigsMarketplace';

const TABS = ['pending', 'in_progress', 'delivered', 'completed', 'cancelled'];

const mapOrder = (order) => ({
  id: order.id || order._id || order.orderNumber,
  buyer: order.buyer?.name || order.clientName || order.buyerName || 'Client',
  gig: order.gigTitle || order.gig?.title || order.title || 'Order',
  tier: order.packageName || order.tier || 'Standard',
  price: order.amount || order.price || order.total || 0,
  status: (order.status || 'pending').toLowerCase().replace(/\s+/g, '_'),
  deadline: order.deadline || order.dueDate || order.deliveryDate || '—',
});

const SellerOrders = () => {
  const [activeTab, setActiveTab] = useState('in_progress');
  const { orders, loading } = useMyOrders('seller');

  const mapped = useMemo(() => orders.map(mapOrder), [orders]);
  const displayOrders = mapped.filter((o) => o.status === activeTab);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30';
      case 'in_progress': return 'bg-blue-100 text-blue-700 dark:bg-[#4C1D95]/20 dark:text-blue-400 border-blue-200';
      case 'delivered': return 'bg-[#4C1D95]/10 text-[#4C1D95] border-[#4C1D95]/30';
      case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200';
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200';
    }
  };

  return (
    <div className="font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Manage Orders</h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">Track client orders, upload deliverables, and manage your pipeline.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="flex overflow-x-auto border-b border-zinc-200 dark:border-zinc-800 custom-scrollbar bg-zinc-50/50 dark:bg-zinc-800/50">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors capitalize ${
                activeTab === tab
                  ? 'text-[#4C1D95] dark:text-[#4C1D95] bg-white dark:bg-zinc-900'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800'
              }`}
            >
              {tab.replace('_', ' ')} <span className="ml-1 opacity-60">({mapped.filter((o) => o.status === tab).length})</span>
              {activeTab === tab && (
                <motion.div layoutId="orderTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4C1D95]" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#4C1D95]" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {displayOrders.length === 0 ? (
                  <div className="py-20 text-center text-zinc-500 dark:text-zinc-400">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-semibold">No orders in this status.</p>
                  </div>
                ) : (
                  displayOrders.map((order) => (
                    <div key={order.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-[#4C1D95]/50 transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 group">
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">{order.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                            {order.status.replace('_', ' ')}
                          </span>
                          {order.status === 'in_progress' && (
                            <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full ml-auto lg:ml-0">
                              <Clock className="w-3.5 h-3.5" /> Due: {order.deadline}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-zinc-900 dark:text-white text-lg mb-1">{order.gig}</h3>
                        <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                          Buyer: <span className="text-zinc-900 dark:text-zinc-200 font-bold">{order.buyer}</span> •
                          Tier: <span className="text-[#4C1D95] font-bold">{order.tier}</span>
                        </div>
                      </div>
                      <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-zinc-100 dark:border-zinc-800">
                        <div className="text-2xl font-black text-zinc-900 dark:text-white w-full sm:w-auto text-center sm:text-right">
                          ${order.price}
                        </div>
                        <div className="flex w-full sm:w-auto gap-2">
                          <button type="button" className="flex-1 sm:flex-none p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 rounded-xl transition-colors flex items-center justify-center" title="Message Buyer">
                            <MessageSquare className="w-5 h-5" />
                          </button>
                          {order.status === 'in_progress' && (
                            <button type="button" className="flex-1 sm:flex-none px-6 py-3 bg-[#4C1D95] hover:bg-[#22C55E] text-white font-semibold rounded-xl transition-all text-center whitespace-nowrap">
                              Deliver Work
                            </button>
                          )}
                          {order.status === 'pending' && (
                            <button type="button" className="flex-1 sm:flex-none px-6 py-3 bg-[#4C1D95] hover:bg-[#22C55E] text-white font-semibold rounded-xl transition-all text-center whitespace-nowrap">
                              Start Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerOrders;


