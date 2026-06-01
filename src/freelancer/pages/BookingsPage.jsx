import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, Video, CheckCircle2, XCircle, Search, Filter, MessageSquare, MoreVertical, Star } from 'lucide-react';
import { useFreelancerBookings, useUpdateBookingStatus } from '../services/freelancerHooks';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';

// --- Skeleton Loaders ---
const BookingsSkeleton = () => (
  <div className="space-y-8 animate-pulse pb-12">
    <div className="flex justify-between items-end">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-light-gray rounded-md"></div>
        <div className="h-4 w-48 bg-light-gray rounded-md"></div>
      </div>
      <div className="h-10 w-32 bg-light-gray rounded-md"></div>
    </div>
    <div className="flex gap-4">
      {[1, 2, 3].map(i => <div key={i} className="h-24 w-48 bg-light-gray rounded-xl"></div>)}
    </div>
    <div className="space-y-4">
      {[1, 2, 3].map(i => <div key={i} className="h-32 bg-light-gray rounded-2xl"></div>)}
    </div>
  </div>
);

export default function BookingsPage() {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const { data: bookingsData, isLoading: loading } = useFreelancerBookings({
    page,
    limit: 20
  });

  const updateBookingStatusMutation = useUpdateBookingStatus();

  const bookings = bookingsData?.bookings || [];

  const handleAction = (id, action) => {
    if (action === 'accept') {
      const meetingLink = `meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}`;
      updateBookingStatusMutation.mutate({ 
        bookingId: id, 
        data: { status: 'UPCOMING', meetingLink } 
      }, {
        onSuccess: () => {
          toast.success('Consultation request accepted successfully! 🚀');
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to accept booking');
        }
      });
    } else if (action === 'decline') {
      updateBookingStatusMutation.mutate({ 
        bookingId: id, 
        data: { status: 'CANCELLED' } 
      }, {
        onSuccess: () => {
          toast('Consultation request declined.', { icon: '❌' });
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to decline booking');
        }
      });
    } else if (action === 'join') {
      const b = bookings.find(x => x.id === id);
      if (b?.meetingLink) {
        window.open(b.meetingLink.startsWith('http') ? b.meetingLink : `https://${b.meetingLink}`, '_blank');
      } else {
        toast.success('Joining video call...', { icon: '🎥' });
      }
    }
  };

  const filteredBookings = bookings.filter(b => {
    const statusVal = b.status?.toUpperCase() || '';
    if (filter !== 'All') {
      if (filter === 'Upcoming' && statusVal !== 'UPCOMING') return false;
      if (filter === 'Pending' && statusVal !== 'PENDING') return false;
      if (filter === 'Completed' && statusVal !== 'COMPLETED') return false;
      if (filter === 'Cancelled' && statusVal !== 'CANCELLED') return false;
    }
    const clientNameStr = b.clientName || 'Client';
    const bIdStr = String(b.id);
    if (searchTerm && !clientNameStr.toLowerCase().includes(searchTerm.toLowerCase()) && !bIdStr.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const formatDate = (start, end) => {
    if (!start) return 'Not scheduled';
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;
    return `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${endDate ? ' - ' + endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}`;
  };

  const getStatusText = (status) => {
    const s = status?.toUpperCase() || 'PENDING';
    if (s === 'UPCOMING') return 'Upcoming';
    if (s === 'PENDING') return 'Pending';
    if (s === 'COMPLETED') return 'Completed';
    if (s === 'CANCELLED') return 'Cancelled';
    return s;
  };

  if (loading) return <BookingsSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <Toaster position="top-right" />
      
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-success/10 text-success rounded-xl shadow-sm border border-success/20">
              <CalendarDays size={24} />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Consultations & Bookings</h1>
          </div>
          <p className="text-sm text-text-secondary font-medium">
            Manage your paid 1-on-1 consultations and review pending booking requests.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
        <Card className="min-w-[200px] bg-[#222222] border-none text-white shadow-xl">
          <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Upcoming Sessions</p>
          <p className="text-3xl font-black text-white">{bookings.filter(b => b.status?.toUpperCase() === 'UPCOMING').length}</p>
        </Card>
        <Card className="min-w-[200px] bg-white border-border shadow-sm">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Pending Requests</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-black text-text-primary">{bookings.filter(b => b.status?.toUpperCase() === 'PENDING').length}</p>
            {bookings.some(b => b.status?.toUpperCase() === 'PENDING') && <span className="w-2 h-2 rounded-full bg-[#e63946] animate-pulse"></span>}
          </div>
        </Card>
        <Card className="min-w-[200px] bg-white border-border shadow-sm">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Total Earned (Bookings)</p>
          <p className="text-3xl font-black text-text-primary">KES {bookings.filter(b => b.status?.toUpperCase() === 'COMPLETED').reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-border">
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto custom-scrollbar">
          {['All', 'Upcoming', 'Pending', 'Completed', 'Cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all whitespace-nowrap",
                filter === f 
                  ? "bg-[#222222] text-white shadow-sm" 
                  : "text-text-secondary hover:text-[#222222] hover:bg-light-gray"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64 group/search">
          <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-text-secondary group-focus-within/search:text-[#222222] transition-colors" />
          <input 
            type="text" 
            placeholder="Search client or ID..." 
            className="w-full pl-9 pr-4 py-2 bg-light-gray/50 border border-border rounded-lg text-sm font-medium focus:outline-none focus:border-[#222222] focus:ring-1 focus:ring-navy transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card className="text-center py-20 bg-white/50 backdrop-blur-md border-border shadow-sm">
            <CalendarDays className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-text-primary">No bookings found</h3>
            <p className="text-sm text-text-secondary mt-1">There are no bookings matching the current filter.</p>
          </Card>
        ) : (
          filteredBookings.map(booking => {
            const statusUpper = booking.status?.toUpperCase() || 'PENDING';
            return (
              <Card key={booking.id} className="p-0 overflow-hidden bg-white border-border shadow-sm hover:border-[#222222]/50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 p-6">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black text-[#222222] uppercase tracking-widest bg-[#222222]/10 px-2 py-0.5 rounded-md">
                        BKG-{booking.id}
                      </span>
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest",
                        statusUpper === 'UPCOMING' ? 'bg-success/10 text-success border border-success/20' :
                        statusUpper === 'PENDING' ? 'bg-warning/10 text-warning border border-warning/20' :
                        statusUpper === 'COMPLETED' ? 'bg-success/10 text-success border border-success/20' :
                        'bg-light-gray text-text-secondary border border-border'
                      )}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-text-primary tracking-tight">{booking.type}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-semibold text-text-secondary">with</span>
                      <span className="text-sm font-bold text-text-primary">{booking.clientName || 'Client'}</span>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary">
                        <Clock size={14} className="text-[#222222]" /> {formatDate(booking.startTime, booking.endTime)}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-md">
                        KES {booking.amount?.toLocaleString() || '0'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap md:flex-col gap-2 justify-end w-full md:w-auto">
                    {statusUpper === 'PENDING' && (
                      <>
                        <Button variant="primary" size="sm" className="shadow-sm bg-success hover:bg-success/90 border-none" onClick={() => handleAction(booking.id, 'accept')}>
                          <CheckCircle2 size={14} className="mr-1.5" /> Accept Request
                        </Button>
                        <Button variant="outline" size="sm" className="border-[#e63946] text-[#e63946] hover:bg-[#e63946]/10" onClick={() => handleAction(booking.id, 'decline')}>
                          <XCircle size={14} className="mr-1.5" /> Decline
                        </Button>
                      </>
                    )}

                    {statusUpper === 'UPCOMING' && (
                      <>
                        <Button variant="primary" size="sm" className="shadow-md" onClick={() => handleAction(booking.id, 'join')}>
                          <Video size={14} className="mr-1.5" /> Join Meeting
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toast('Opening messages', { icon: '💬' })}>
                          <MessageSquare size={14} className="mr-1.5" /> Message Client
                        </Button>
                      </>
                    )}

                    {statusUpper === 'COMPLETED' && (
                      <Button variant="outline" size="sm" onClick={() => toast.success('Feedback requested')}>
                        <Star size={14} className="mr-1.5" /> Request Review
                      </Button>
                    )}
                  </div>

                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
