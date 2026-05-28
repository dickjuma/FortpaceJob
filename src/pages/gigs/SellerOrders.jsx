import React, { useState } from 'react';
import { Package, MessageSquare, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_ORDERS = [
  { id: 'ORD-9823', buyer: 'TechStartup', gig: 'Modern minimalist logo', tier: 'Premium', price: 120, status: 'in_progress', deadline: 'Tomorrow, 5:00 PM' },
  { id: 'ORD-9822', buyer: 'JohnSmith', gig: 'React Web App', tier: 'Standard', price: 65, status: 'pending', deadline: 'In 3 days' },
  { id: 'ORD-9821', buyer: 'AliceBob', gig: 'SEO Audit', tier: 'Basic', price: 25, status: 'delivered', deadline: 'Yesterday' },
  { id: 'ORD-9820', buyer: 'CompanyX', gig: 'YouTube Editing', tier: 'Premium', price: 45, status: 'completed', deadline: 'Last week' },
];

const SellerOrders = () => {
  const [activeTab, setActiveTab] = useState('in_progress');

  const displayOrders = MOCK_ORDERS.filter(o => o.status === activeTab);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30';
      case 'in_progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30';
      case 'delivered': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30';
      case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
    }
  };

  return (
    <div className="font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Manage Orders</h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">Track client orders, upload deliverables, and manage your pipeline.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-zinc-200 dark:border-zinc-800 custom-scrollbar bg-zinc-50/50 dark:bg-zinc-800/50">
          {['pending', 'in_progress', 'delivered', 'completed', 'cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors capitalize ${
                activeTab === tab 
                  ? 'text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-900' 
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800'
              }`}
            >
              {tab.replace('_', ' ')} <span className="ml-1 opacity-60">({MOCK_ORDERS.filter(o => o.status === tab).length})</span>
              {activeTab === tab && (
                <motion.div layoutId="orderTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8">
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
                displayOrders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 group">
                    
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">{order.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                        {order.status === 'in_progress' && (
                          <span className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full ml-auto lg:ml-0">
                            <Clock className="w-3.5 h-3.5" /> Due: {order.deadline}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-bold text-zinc-900 dark:text-white text-lg mb-1">{order.gig}</h3>
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Buyer: <span className="text-zinc-900 dark:text-zinc-200 font-bold">{order.buyer}</span> • 
                        Tier: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{order.tier}</span>
                      </div>
                    </div>

                    <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-zinc-100 dark:border-zinc-800">
                      <div className="text-2xl font-black text-zinc-900 dark:text-white w-full sm:w-auto text-center sm:text-right">
                        ${order.price}
                      </div>
                      <div className="flex w-full sm:w-auto gap-2">
                        <button className="flex-1 sm:flex-none p-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-xl transition-colors flex items-center justify-center" title="Message Buyer">
                          <MessageSquare className="w-5 h-5" />
                        </button>
                        {order.status === 'in_progress' && (
                          <button className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md hover:-tranzinc-y-0.5 text-center whitespace-nowrap">
                            Deliver Work
                          </button>
                        )}
                        {order.status === 'pending' && (
                          <button className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md hover:-tranzinc-y-0.5 text-center whitespace-nowrap">
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
        </div>
      </div>
    </div>
  );
};

export default SellerOrders;
