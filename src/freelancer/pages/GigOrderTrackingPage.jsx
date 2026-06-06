// src/pages/client/GigOrderTrackingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock, Package, MessageSquare, AlertTriangle,
  CheckCircle2, ShieldAlert,
  FileText, Check
} from 'lucide-react';
import { useOrderById } from '../services/freelancerHooks';

export default function GigOrderTrackingPage() {
  const { orderId } = useParams();
  const { data: orderData, isLoading: loadingOrder, error: orderError } = useOrderById(orderId);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 45 });
  const [showSuccess, setShowSuccess] = useState(null);
  const ORDER = orderData?.order ?? orderData?.data ?? orderData;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loadingOrder) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orderError) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center p-4">
        <div className="bg-white border border-border rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
          <AlertTriangle className="w-10 h-10 text-warn mx-auto mb-4" />
          <h2 className="font-display font-semibold text-xl text-brand-900 mb-2">Unable to load order</h2>
          <p className="text-ink-secondary">Please refresh the page or try again later.</p>
        </div>
      </div>
    );
  }

  if (!ORDER) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center p-4">
        <div className="bg-white border border-border rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
          <h2 className="font-display font-semibold text-xl text-brand-900 mb-2">Order not found</h2>
          <p className="text-ink-secondary">This order could not be retrieved.</p>
        </div>
      </div>
    );
  }
  const statusLabel = {
    pending: 'Pending',
    in_progress: 'In progress',
    delivered: 'Delivered',
    completed: 'Completed',
    canceled: 'Canceled',
  }[ORDER.status || ORDER.orderStatus] || String(ORDER.status || ORDER.orderStatus || 'In progress').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const milestones = ORDER.milestones ?? [];

  const handleMessageSeller = () => {
    setShowSuccess({ message: 'Opening conversation with seller' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleViewRequirements = () => {
    setShowSuccess({ message: 'Viewing order requirements' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleResolutionCenter = () => {
    setShowSuccess({ message: 'Opening resolution center' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-surface-soft py-8 px-4 sm:px-6"
    >
      {/* Success Toast */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          {showSuccess.message}
        </motion.div>
      )}

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Left Column: Timeline & Tracking */}
        <div className="flex-1 space-y-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-900 mb-1">
                Order {ORDER.id}
              </h1>
              <p className="text-sm font-body text-ink-secondary line-clamp-1">{ORDER.title || ORDER.description || 'Order details'}</p>
            </div>
            <div className="inline-flex px-3 py-1 bg-accent-light text-accent-dark rounded-lg text-sm font-body font-semibold w-fit">
              {statusLabel}
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-8 shadow-sm relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-light/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-light/20 rounded-full blur-[80px] pointer-events-none" />

            <Clock className="w-8 h-8 text-accent-light mx-auto mb-4 relative z-10" />
            <h2 className="text-sm font-body font-semibold text-white/70 uppercase tracking-wide mb-6 relative z-10">
              Time left to delivery
            </h2>

            <div className="flex justify-center gap-4 sm:gap-8 relative z-10">
              <div className="text-center">
                <span className="block font-mono font-bold text-4xl sm:text-5xl text-white">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-xs font-body font-medium text-white/60 uppercase">Days</span>
              </div>
              <span className="font-mono font-bold text-4xl sm:text-5xl text-white/40">:</span>
              <div className="text-center">
                <span className="block font-mono font-bold text-4xl sm:text-5xl text-white">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-xs font-body font-medium text-white/60 uppercase">Hours</span>
              </div>
              <span className="font-mono font-bold text-4xl sm:text-5xl text-white/40">:</span>
              <div className="text-center">
                <span className="block font-mono font-bold text-4xl sm:text-5xl text-white">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-xs font-body font-medium text-white/60 uppercase">Mins</span>
              </div>
              <span className="font-mono font-bold text-4xl sm:text-5xl text-white/40 hidden sm:inline">:</span>
              <div className="text-center hidden sm:block">
                <span className="block font-mono font-bold text-4xl sm:text-5xl text-white">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-xs font-body font-medium text-white/60 uppercase">Secs</span>
              </div>
            </div>
          </div>

          {/* Timeline Tracker */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-display font-semibold text-lg text-brand-900 mb-6">Order timeline</h3>

            <div className="relative border-l-2 border-border ml-4 space-y-8 pb-2">
              {milestones.map((milestone, idx) => {
                const isLast = idx === milestones.length - 1;
                const isCompleted = milestone.status === 'completed';

                return (
                  <div key={milestone.id} className="relative pl-7">
                    <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center transition-colors ${
                      isCompleted ? 'bg-accent DEFAULT' : 'bg-border'
                    }`}>
                      {isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h4 className={`font-body font-semibold text-base ${
                        isCompleted ? 'text-ink-primary' : 'text-ink-tertiary'
                      }`}>
                        {milestone.title}
                      </h4>
                      <span className="text-xs font-mono text-ink-tertiary">{milestone.date}</span>
                    </div>

                    {isCompleted && idx === 2 && (
                      <div className="mt-3 p-3 bg-surface-soft rounded-lg border border-border">
                        <p className="text-sm font-body text-ink-secondary">
                          The seller has everything they need and is currently working on your order.
                        </p>
                      </div>
                    )}

                    {!isCompleted && isLast && (
                      <div className="mt-3 p-3 bg-accent-light rounded-lg border border-accent DEFAULT">
                        <p className="text-sm font-body font-semibold text-accent-dark flex items-center gap-2">
                          <Package className="w-4 h-4" /> Waiting for delivery
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Details */}
        <div className="w-full lg:w-80 shrink-0 space-y-5">

          {/* Action Card */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-body font-semibold text-ink-primary mb-5">Need help with this order?</h3>

            <div className="space-y-3">
              <button
                onClick={handleMessageSeller}
                className="w-full py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Message seller
              </button>

              <button
                onClick={handleViewRequirements}
                className="w-full py-2.5 rounded-lg bg-surface-muted text-ink-primary hover:bg-surface text-sm font-body font-medium transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" /> View requirements
              </button>

              <button
                onClick={handleResolutionCenter}
                className="w-full py-2.5 rounded-lg border border-border text-ink-primary hover:bg-surface text-sm font-body font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" /> Resolution center
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
