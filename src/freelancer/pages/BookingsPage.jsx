// src/pages/freelancer/BookingsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Clock, Video, CheckCircle2, XCircle, Search,
  Filter, MessageSquare, MoreVertical, Star, Check
} from 'lucide-react';
import { useFreelancerBookings, useUpdateBookingStatus } from '../services/freelancerHooks';

export default function BookingsPage() {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(null);
  const { data: bookings = [], isLoading, error } = useFreelancerBookings({ page: 1, limit: 20 });
  const updateBookingStatus = useUpdateBookingStatus();

  const handleAction = async (id, action) => {
    if (action === 'accept') {
      try {
        await updateBookingStatus.mutateAsync({ bookingId: id, data: { status: 'ACCEPTED' } });
        setShowSuccess({ id, message: 'Booking accepted successfully' });
      } catch {
        setShowSuccess({ id, message: 'Unable to accept booking', isError: true });
      }
      setTimeout(() => setShowSuccess(null), 3000);
    } else if (action === 'decline') {
      try {
        await updateBookingStatus.mutateAsync({ bookingId: id, data: { status: 'CANCELLED' } });
        setShowSuccess({ id, message: 'Booking declined' });
      } catch {
        setShowSuccess({ id, message: 'Unable to decline booking', isError: true });
      }
      setTimeout(() => setShowSuccess(null), 3000);
    } else if (action === 'join') {
      const booking = bookings.find(b => b.id === id);
      if (booking?.meetingLink) {
        window.open(booking.meetingLink.startsWith('http') ? booking.meetingLink : `https://${booking.meetingLink}`, '_blank');
      }
    } else if (action === 'message') {
      setShowSuccess({ id, message: 'Opening messages' });
      setTimeout(() => setShowSuccess(null), 2000);
    } else if (action === 'review') {
      setShowSuccess({ id, message: 'Review request sent to client' });
      setTimeout(() => setShowSuccess(null), 2000);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const statusVal = b.status;
    if (filter !== 'All') {
      if (filter !== statusVal) return false;
    }
    const searchLower = searchTerm.toLowerCase();
    if (searchTerm && !b.clientName.toLowerCase().includes(searchLower) && !b.id.toLowerCase().includes(searchLower)) {
      return false;
    }
    return true;
  });

  const formatDate = (start, end) => {
    if (!start) return 'Not scheduled';
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${endDate ? ' - ' + endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}`;
  };

  const getStatusStyles = (status) => {
    switch(status) {
      case 'UPCOMING':
        return 'bg-accent-light text-accent-dark border-accent DEFAULT';
      case 'PENDING':
        return 'bg-warn-light text-warn border-warn DEFAULT';
      case 'COMPLETED':
        return 'bg-info-light text-info border-info DEFAULT';
      case 'CANCELLED':
        return 'bg-danger-light text-danger border-danger DEFAULT';
      default:
        return 'bg-surface-muted text-ink-secondary border-border';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const upcomingCount = bookings.filter(b => b.status === 'UPCOMING').length;
  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
  const totalEarned = bookings.filter(b => b.status === 'COMPLETED').reduce((sum, b) => sum + b.amount, 0);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-8 w-64 bg-surface-muted rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-surface-muted rounded-2xl animate-pulse"></div>)}
          </div>
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-40 bg-surface-muted rounded-2xl animate-pulse"></div>)}
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
      {/* Success Toast */}
      <AnimatePresence>
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
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-accent-light rounded-xl">
            <CalendarDays className="w-6 h-6 text-accent DEFAULT" />
          </div>
          <h1 className="font-display font-bold text-4xl text-brand-900">Consultations & bookings</h1>
        </div>
        <p className="text-ink-secondary font-body mt-1 text-base">
          Manage your paid 1-on-1 consultations and review pending requests
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-brand-900 rounded-2xl p-6 shadow-sm text-white"
        >
          <p className="text-xs font-body font-medium text-white/70 uppercase tracking-wide mb-1">Upcoming sessions</p>
          <p className="font-mono font-semibold text-3xl">{upcomingCount}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-border rounded-2xl p-6 shadow-sm"
        >
          <p className="text-xs font-body font-medium text-ink-secondary uppercase tracking-wide mb-1">Pending requests</p>
          <div className="flex items-center gap-2">
            <p className="font-mono font-semibold text-3xl text-ink-primary">{pendingCount}</p>
            {pendingCount > 0 && <div className="w-2 h-2 rounded-full bg-accent DEFAULT animate-pulse"></div>}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border border-border rounded-2xl p-6 shadow-sm"
        >
          <p className="text-xs font-body font-medium text-ink-secondary uppercase tracking-wide mb-1">Total earned</p>
          <p className="font-mono font-semibold text-3xl text-ink-primary">
            KES {totalEarned.toLocaleString()}
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-border mb-6"
      >
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'UPCOMING', 'PENDING', 'COMPLETED', 'CANCELLED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-body font-medium rounded-lg transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-brand-900 ${
                filter === f
                  ? "bg-brand-900 text-white"
                  : "text-ink-secondary hover:text-ink-primary hover:bg-surface-muted"
              }`}
            >
              {f === 'All' ? 'All' : getStatusText(f)}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
          <input
            type="text"
            placeholder="Search client or booking ID..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-border rounded-lg text-sm font-body text-ink-primary placeholder-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-border rounded-2xl text-center py-16 px-4"
          >
            <CalendarDays className="w-12 h-12 text-ink-tertiary mx-auto mb-4" />
            <h3 className="font-body font-semibold text-lg text-ink-primary">No bookings found</h3>
            <p className="text-ink-secondary text-sm mt-1">No bookings match your current filters</p>
          </motion.div>
        ) : (
          filteredBookings.map((booking, index) => {
            const status = booking.status;
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 p-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-mono text-xs font-medium text-ink-secondary bg-surface-muted px-2 py-0.5 rounded">
                        #{booking.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-body font-medium border ${getStatusStyles(status)}`}>
                        {getStatusText(status)}
                      </span>
                    </div>

                    <h3 className="font-body font-semibold text-lg text-ink-primary mb-1">
                      {booking.type}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-ink-secondary">with</span>
                      <span className="text-sm font-medium text-ink-primary">{booking.clientName}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-ink-tertiary" />
                        <span className="text-xs font-body text-ink-secondary">{formatDate(booking.startTime, booking.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-semibold text-accent-dark bg-accent-light px-2 py-0.5 rounded">
                          KES {booking.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleAction(booking.id, 'accept')}
                          className="px-4 py-2 rounded-lg font-body font-medium text-sm bg-brand-900 text-white hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-900 inline-flex items-center gap-2 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(booking.id, 'decline')}
                          className="px-4 py-2 rounded-lg font-body font-medium text-sm border border-danger text-danger hover:bg-danger-light focus:outline-none focus:ring-2 focus:ring-danger inline-flex items-center gap-2 transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                          Decline
                        </button>
                      </>
                    )}

                    {status === 'UPCOMING' && (
                      <>
                        <button
                          onClick={() => handleAction(booking.id, 'join')}
                          className="px-4 py-2 rounded-lg font-body font-medium text-sm bg-brand-900 text-white hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-900 inline-flex items-center gap-2 transition-all"
                        >
                          <Video className="w-4 h-4" />
                          Join meeting
                        </button>
                        <button
                          onClick={() => handleAction(booking.id, 'message')}
                          className="px-4 py-2 rounded-lg font-body font-medium text-sm border border-border text-ink-primary hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-900 inline-flex items-center gap-2 transition-all"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Message
                        </button>
                      </>
                    )}

                    {status === 'COMPLETED' && (
                      <button
                        onClick={() => handleAction(booking.id, 'review')}
                        className="px-4 py-2 rounded-lg font-body font-medium text-sm border border-border text-ink-primary hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-900 inline-flex items-center gap-2 transition-all"
                      >
                        <Star className="w-4 h-4" />
                        Request review
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
