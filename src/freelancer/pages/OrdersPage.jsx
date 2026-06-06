// src/pages/freelancer/OrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Clock, CheckCircle2, AlertTriangle, MessageSquare, Download, UploadCloud, FileText, XCircle, Search, Check, X
} from 'lucide-react';
import { useFreelancerOrders, useUpdateOrderStatus } from '../services/freelancerHooks';

export default function OrdersPage() {
  const { data, isLoading: loading } = useFreelancerOrders();
  const updateOrder = useUpdateOrderStatus();

  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(null);
  const baseOrders = data?.items || [];
  const [orders, setOrders] = useState(baseOrders);

  useEffect(() => {
    setOrders(baseOrders);
  }, [baseOrders]);

  const getFilteredOrders = () => {
    let filtered = orders;
    if (activeTab !== 'All') {
      if (activeTab === 'Active') {
        filtered = filtered.filter(o => o.status === 'Active' || o.status === 'Revision');
      } else {
        filtered = filtered.filter(o => o.status === activeTab);
      }
    }
    if (searchTerm) {
      filtered = filtered.filter(o =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.gig?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const handleDeliver = (id, e) => {
    e.stopPropagation();
    setSelectedOrderId(id);
    setDeliveryModalOpen(true);
  };

  const submitDelivery = () => {
    if (!deliveryNotes) {
      setShowSuccess({ message: 'Please add delivery notes', isError: true });
      setTimeout(() => setShowSuccess(null), 2000);
      return;
    }
    setOrders(prev => prev.map(o =>
      o.id === selectedOrderId ? { ...o, status: 'Delivered' } : o
    ));
    setDeliveryModalOpen(false);
    setDeliveryNotes('');
    setShowSuccess({ message: 'Order delivered successfully' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const getStatusStyles = (status) => {
    switch(status) {
      case 'Active': return 'bg-accent-light text-accent-dark border border-accent DEFAULT';
      case 'Revision': return 'bg-danger-light text-danger border border-danger DEFAULT animate-pulse';
      case 'Delivered': return 'bg-warn-light text-warn border border-warn DEFAULT';
      case 'Completed': return 'bg-accent-light text-accent-dark border border-accent DEFAULT';
      default: return 'bg-surface-muted text-ink-secondary border border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Revision': return <AlertTriangle className="w-3 h-3" />;
      case 'Completed': return <CheckCircle2 className="w-3 h-3" />;
      default: return null;
    }
  };

  const getProgressWidth = (status) => {
    switch(status) {
      case 'Completed': return '100%';
      case 'Delivered': return '80%';
      case 'Revision': return '50%';
      default: return '30%';
    }
  };

  const tabs = ['All', 'Active', 'Delivered', 'Completed', 'Cancelled'];

  if (loading && orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-8 w-48 bg-surface-muted rounded-lg animate-pulse"></div>
          <div className="flex gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-8 w-20 bg-surface-muted rounded-lg animate-pulse"></div>)}
          </div>
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-surface-muted rounded-2xl animate-pulse"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success/Error Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2 ${
              showSuccess.isError ? 'bg-danger text-white' : 'bg-accent-dark text-white'
            }`}
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-danger-light rounded-xl">
              <ShoppingCart className="w-6 h-6 text-danger" />
            </div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Manage orders</h1>
          </div>
          <p className="text-ink-secondary font-body">Track your service deliveries and handle revisions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-2 rounded-xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex overflow-x-auto gap-1 p-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-body font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-brand-900 text-white"
                  : "text-ink-secondary hover:text-ink-primary hover:bg-surface-muted"
              }`}
            >
              {tab}
              {tab === 'Active' && <span className="ml-1 px-1.5 py-0.5 bg-danger text-white rounded text-xs">2</span>}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
          <input
            type="text"
            placeholder="Search order ID..."
            className="w-full pl-9 pr-4 h-10 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {getFilteredOrders().length === 0 ? (
          <div className="bg-white border border-border rounded-2xl text-center py-20 px-4">
            <ShoppingCart className="w-16 h-16 text-ink-tertiary mx-auto mb-4" />
            <h3 className="font-body font-semibold text-lg text-ink-primary mb-1">No orders found</h3>
            <p className="text-ink-secondary">No orders match your current filters</p>
          </div>
        ) : (
          getFilteredOrders().map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -2 }}
              className="bg-white border border-border rounded-xl shadow-sm overflow-hidden transition-all"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Order Info */}
                <div className="flex-1 p-5 border-b lg:border-b-0 lg:border-r border-border">
                  <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                    <div>
                      <span className="text-xs font-mono font-semibold text-ink-tertiary block mb-1">
                        {order.id}
                      </span>
                      <h3 className="font-body font-semibold text-base text-ink-primary">
                        {order.gig?.title || 'Unknown gig'}
                      </h3>
                      <p className="text-sm text-ink-secondary mt-1">
                        Buyer: <span className="font-medium text-ink-primary">{order.client?.name || 'Unknown buyer'}</span>
                      </p>
                    </div>
                    <span className="font-mono font-bold text-lg text-ink-primary bg-surface-muted px-3 py-1 rounded-lg">
                      {order.currency} {order.amount?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-body font-medium ${getStatusStyles(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>

                    {(order.status === 'Active' || order.status === 'Revision') && (
                      <span className="inline-flex items-center gap-1 text-xs font-body text-ink-tertiary">
                        <Clock className="w-3 h-3" />
                        Due: {order.dueDate ? new Date(order.dueDate).toLocaleDateString() : 'N/A'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full lg:w-72 bg-surface-soft p-5 flex flex-col justify-center">
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Progress</span>
                      <span className="text-xs font-mono font-semibold text-ink-primary">{order.status}</span>
                    </div>
                    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${getProgressWidth(order.status)}`}
                           style={{ width: getProgressWidth(order.status) }} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-auto">
                    {(order.status === 'Active' || order.status === 'Revision') && (
                      <button
                        onClick={(e) => handleDeliver(order.id, e)}
                        className="w-full py-2 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors inline-flex items-center justify-center gap-2"
                      >
                        <UploadCloud className="w-4 h-4" /> Deliver now
                      </button>
                    )}
                    {order.status === 'Delivered' && (
                      <button className="w-full py-2 rounded-lg border border-warn text-warn hover:bg-warn-light font-body font-medium text-sm transition-colors">
                        Pending approval
                      </button>
                    )}
                    <button className="w-full py-2 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors">
                      View requirements
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Delivery Modal */}
      <AnimatePresence>
        {deliveryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-border"
            >
              <div className="flex justify-between items-center p-5 border-b border-border">
                <h3 className="font-display font-semibold text-lg text-brand-900">Deliver order</h3>
                <button onClick={() => setDeliveryModalOpen(false)} className="p-1 rounded-lg hover:bg-surface-muted transition-colors">
                  <X className="w-5 h-5 text-ink-tertiary" />
                </button>
              </div>
              <div className="p-5">
                <label className="block text-sm font-body font-medium text-ink-primary mb-2">
                  Delivery notes
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none"
                  rows={4}
                  placeholder="Describe your delivery (e.g., here is the final file...)"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 p-5 border-t border-border">
                <button
                  onClick={() => setDeliveryModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitDelivery}
                  className="px-4 py-2 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors"
                >
                  Submit delivery
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
