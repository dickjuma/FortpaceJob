import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Package, Clock, CheckCircle2, UploadCloud, MessageSquare,
  XCircle, Search, X, ShieldAlert
} from 'lucide-react';
import {
  useFreelancerOrders,
  useAcceptOrder,
  useRejectOrder,
  useDeliverOrder,
  useCancelOrder,
  useDisputeOrder
} from '../services/freelancerHooks';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const STATUS_STYLE = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  ACTIVE: 'bg-success/10 text-success border-success/20',
  REVISION: 'bg-danger/10 text-danger border-danger/20',
  DELIVERED: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-success/10 text-success border-success/20',
  CANCELLED: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  DISPUTED: 'bg-danger/10 text-danger border-danger/20',
  REFUNDED: 'bg-zinc-100 text-zinc-600 border-zinc-200'
};

const TABS = ['All', 'PENDING', 'ACTIVE', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'REVISION', 'DISPUTED'];

function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border pb-3">
          <h3 className="font-display text-lg font-bold text-brand-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-ink-tertiary hover:bg-surface-muted"><X size={18} /></button>
        </div>
        <div className="pt-4">{children}</div>
      </motion.div>
    </div>
  );
}

export default function OrdersPage() {
  const { data, isLoading, refetch } = useFreelancerOrders({ limit: 50 });
  const accept = useAcceptOrder();
  const reject = useRejectOrder();
  const deliver = useDeliverOrder();
  const cancel = useCancelOrder();
  const dispute = useDisputeOrder();

  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [reason, setReason] = useState('');
  const [requestInfo, setRequestInfo] = useState('');

  const orders = useMemo(() => data?.orders || data?.data || data?.items || [], [data]);
  const pagination = data?.pagination || { total: 0, page: 1, totalPages: 1 };

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesTab = activeTab === 'All' || order.status === activeTab;
      const matchesSearch = !q || `${order.id} ${order.gig?.title || ''} ${order.client?.name || ''}`.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, search]);

  const openModal = (type, order) => {
    setModal({ type, order });
    setDeliveryNotes('');
    setReason('');
    setRequestInfo('');
  };

  const runAction = async (fn, successMessage) => {
    try {
      await fn();
      toast.success(successMessage);
      setModal(null);
      refetch();
    } catch (error) {
      toast.error(error.message || 'Action failed');
    }
  };

  const submitDelivery = () => {
    if (!modal || deliveryNotes.trim().length < 10) {
      toast.error('Add at least 10 characters of delivery notes');
      return;
    }
    runAction(
      () => deliver.mutateAsync({ orderId: modal.order.id, data: { message: deliveryNotes } }),
      'Order delivered successfully'
    );
  };

  const submitReasonAction = (message) => {
    const messageText = modal?.type === 'requestInfo' ? requestInfo : reason;
    if (!modal || messageText.trim().length < 5) {
      toast.error('Please provide a reason');
      return;
    }
    if (modal.type === 'reject') runAction(() => reject.mutateAsync({ orderId: modal.order.id, reason }), message);
    if (modal.type === 'cancel') runAction(() => cancel.mutateAsync({ orderId: modal.order.id, reason }), message);
    if (modal.type === 'dispute') runAction(() => dispute.mutateAsync({ orderId: modal.order.id, data: { reason } }), message);
    if (modal.type === 'requestInfo') runAction(() => deliver.mutateAsync({ orderId: modal.order.id, data: { message: requestInfo } }), message);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#4C1D95]/10 rounded-xl"><Package className="w-6 h-6 text-[#4C1D95]" /></div>
            <div>
              <h1 className="font-display font-bold text-3xl text-brand-900">Orders</h1>
              <p className="text-ink-secondary">Accept, deliver, revise, complete, or escalate gig orders.</p>
            </div>
          </div>
        </div>
        <div className="text-sm text-ink-secondary">{pagination.total} total orders</div>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm p-3 mb-6 flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="flex gap-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border',
                activeTab === tab ? 'bg-brand-900 text-white border-brand-900' : 'text-ink-secondary border-border hover:bg-surface-muted'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order, gig, or client"
            className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-40 rounded-2xl bg-surface-muted animate-pulse" />)}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center text-ink-secondary">No orders match your filters.</div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
                <div className="p-5 border-b lg:border-b-0 lg:border-r border-border">
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <p className="text-xs font-mono text-ink-tertiary">#{order.id}</p>
                      <h3 className="font-display text-lg font-bold text-brand-900">{order.gig?.title || 'Gig order'}</h3>
                      <p className="text-sm text-ink-secondary mt-1">Buyer: {order.client?.name || 'Unknown client'}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-xl font-bold text-brand-900">{order.currency || 'USD'} {(order.amount || order.gig?.price || 0).toLocaleString()}</div>
                      <div className="text-xs text-ink-secondary">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold', STATUS_STYLE[order.status] || STATUS_STYLE.PENDING)}>
                      {order.status === 'ACTIVE' ? <Clock size={14} /> : order.status === 'COMPLETED' ? <CheckCircle2 size={14} /> : order.status === 'DISPUTED' ? <ShieldAlert size={14} /> : <Package size={14} />}
                      {order.status}
                    </span>
                    {order.deliveries?.length > 0 && <span className="text-xs text-ink-secondary">{order.deliveries.length} deliveries</span>}
                    {order.revisions?.length > 0 && <span className="text-xs text-ink-secondary">{order.revisions.length} revisions</span>}
                  </div>
                  {order.metadata && typeof order.metadata === 'string' && order.metadata.includes('requirements') && (
                    <p className="mt-4 rounded-xl bg-surface-soft p-3 text-sm text-ink-secondary">{JSON.parse(order.metadata).requirements || 'No requirements provided.'}</p>
                  )}
                </div>

                <div className="p-5 bg-surface-soft flex flex-col gap-2">
                  {order.status === 'PENDING' && (
                    <>
                      <button onClick={() => openModal('accept', order)} className="rounded-xl bg-brand-900 py-2 text-sm font-bold text-white">Accept order</button>
                      <button onClick={() => openModal('reject', order)} className="rounded-xl border border-border py-2 text-sm font-bold text-ink-primary hover:bg-surface-muted">Reject</button>
                    </>
                  )}
                    {['ACTIVE', 'REVISION'].includes(order.status) && (
                      <>
                        <button onClick={() => openModal('deliver', order)} className="rounded-xl bg-brand-900 py-2 text-sm font-bold text-white inline-flex items-center justify-center gap-2"><UploadCloud size={16} /> Deliver</button>
                        <button onClick={() => openModal('requestInfo', order)} className="rounded-xl border border-border py-2 text-sm font-bold text-ink-primary hover:bg-surface-muted inline-flex items-center justify-center gap-2"><MessageSquare size={16} /> Request info</button>
                      </>
                    )}
                  {order.status === 'DELIVERED' && <button disabled className="rounded-xl border border-success/30 bg-success/10 py-2 text-sm font-bold text-success">Awaiting client approval</button>}
                  {['PENDING', 'ACTIVE'].includes(order.status) && (
                    <button onClick={() => openModal('cancel', order)} className="rounded-xl border border-danger/30 py-2 text-sm font-bold text-danger hover:bg-danger/5 inline-flex items-center justify-center gap-2"><XCircle size={16} /> Cancel</button>
                  )}
                  {['ACTIVE', 'DELIVERED', 'REVISION'].includes(order.status) && (
                    <button onClick={() => openModal('dispute', order)} className="rounded-xl border border-danger/30 py-2 text-sm font-bold text-danger hover:bg-danger/5 inline-flex items-center justify-center gap-2"><ShieldAlert size={16} /> Dispute</button>
                  )}
                  <button className="rounded-xl border border-border py-2 text-sm font-bold text-ink-primary hover:bg-surface-muted inline-flex items-center justify-center gap-2"><MessageSquare size={16} /> View chat</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <Modal
            open
            title={
              modal.type === 'deliver' ? 'Deliver order' :
              modal.type === 'reject' ? 'Reject order' :
              modal.type === 'cancel' ? 'Cancel order' :
              modal.type === 'dispute' ? 'Dispute order' :
              modal.type === 'requestInfo' ? 'Request information' :
              'Accept order'
            }
            onClose={() => setModal(null)}
          >
            {modal.type === 'accept' && (
              <div className="flex justify-end gap-2">
                <button onClick={() => setModal(null)} className="rounded-lg border border-border px-4 py-2 text-sm font-bold">Cancel</button>
                <button onClick={() => runAction(() => accept.mutateAsync(modal.order.id), 'Order accepted')} className="rounded-lg bg-brand-900 px-4 py-2 text-sm font-bold text-white">Accept</button>
              </div>
            )}

            {modal.type === 'deliver' && (
              <div className="space-y-3">
                <textarea
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Describe what was delivered..."
                  className="min-h-32 w-full rounded-xl border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setModal(null)} className="rounded-lg border border-border px-4 py-2 text-sm font-bold">Cancel</button>
                  <button onClick={submitDelivery} className="rounded-lg bg-brand-900 px-4 py-2 text-sm font-bold text-white inline-flex items-center gap-2"><UploadCloud size={16} /> Submit delivery</button>
                </div>
              </div>
            )}

            {modal.type === 'requestInfo' && (
              <div className="space-y-3">
                <textarea
                  value={requestInfo}
                  onChange={(e) => setRequestInfo(e.target.value)}
                  placeholder="Ask the buyer for missing details..."
                  className="min-h-28 w-full rounded-xl border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setModal(null)} className="rounded-lg border border-border px-4 py-2 text-sm font-bold">Cancel</button>
                  <button onClick={() => submitReasonAction('Information requested')} className="rounded-lg bg-brand-900 px-4 py-2 text-sm font-bold text-white inline-flex items-center gap-2"><MessageSquare size={16} /> Request info</button>
                </div>
              </div>
            )}

            {['reject', 'cancel', 'dispute'].includes(modal.type) && (
              <div className="space-y-3">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why..."
                  className="min-h-28 w-full rounded-xl border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setModal(null)} className="rounded-lg border border-border px-4 py-2 text-sm font-bold">Cancel</button>
                  <button onClick={() => submitReasonAction(modal.type === 'reject' ? 'Order rejected' : modal.type === 'cancel' ? 'Order cancelled' : 'Order disputed')} className="rounded-lg bg-danger px-4 py-2 text-sm font-bold text-white">{modal.type === 'dispute' ? 'Open dispute' : modal.type === 'reject' ? 'Reject order' : 'Cancel order'}</button>
                </div>
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
