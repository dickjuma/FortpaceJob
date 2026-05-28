import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, Video, CheckCircle2, XCircle, Search, Filter, MessageSquare, MoreVertical, Star } from 'lucide-react';
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

// --- Mock Data ---
const MOCK_BOOKINGS = [
  { 
    id: 'BKG-1042', 
    client: 'HealthSync App', 
    type: '1-on-1 Consultation', 
    date: 'Today, 2:00 PM - 3:00 PM', 
    status: 'Upcoming', 
    amount: 'KES 5,000',
    link: 'meet.google.com/abc-xyz'
  },
  { 
    id: 'BKG-1041', 
    client: 'Startup Inc', 
    type: 'Architecture Review', 
    date: 'Tomorrow, 10:00 AM - 11:30 AM', 
    status: 'Pending', 
    amount: 'KES 15,000',
    link: null
  },
  { 
    id: 'BKG-1039', 
    client: 'Nexus Tech', 
    type: 'Code Mentorship', 
    date: 'May 20, 2026', 
    status: 'Completed', 
    amount: 'KES 8,500',
    link: null
  }
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API fetch
    const fetchBookings = async () => {
      setLoading(true);
      await new Promise(res => setTimeout(res, 800));
      setBookings(MOCK_BOOKINGS);
      setLoading(false);
    };
    fetchBookings();
  }, []);

  const handleAction = (id, action) => {
    if (action === 'accept') {
      toast.success(`Booking ${id} accepted successfully!`);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Upcoming', link: 'meet.google.com/new' } : b));
    } else if (action === 'decline') {
      toast.error(`Booking ${id} declined.`);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    } else if (action === 'join') {
      toast.success('Joining video call...', { icon: '🎥' });
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter !== 'All' && b.status !== filter) return false;
    if (searchTerm && !b.client.toLowerCase().includes(searchTerm.toLowerCase()) && !b.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (loading) return <BookingsSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <Toaster position="top-right" />
      
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-purple/10 text-accent-purple rounded-xl shadow-sm border border-accent-purple/20">
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
        <Card className="min-w-[200px] bg-navy border-none text-white shadow-xl">
          <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Upcoming Sessions</p>
          <p className="text-3xl font-black text-white">4</p>
        </Card>
        <Card className="min-w-[200px] bg-white border-border shadow-sm">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Pending Requests</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-black text-text-primary">2</p>
            <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse"></span>
          </div>
        </Card>
        <Card className="min-w-[200px] bg-white border-border shadow-sm">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Total Earned (Bookings)</p>
          <p className="text-3xl font-black text-text-primary">KES 42.5k</p>
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
                  ? "bg-navy text-white shadow-sm" 
                  : "text-text-secondary hover:text-navy hover:bg-light-gray"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64 group/search">
          <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-text-secondary group-focus-within/search:text-navy transition-colors" />
          <input 
            type="text" 
            placeholder="Search client or ID..." 
            className="w-full pl-9 pr-4 py-2 bg-light-gray/50 border border-border rounded-lg text-sm font-medium focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
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
          filteredBookings.map(booking => (
            <Card key={booking.id} className="p-0 overflow-hidden bg-white border-border shadow-sm hover:border-navy/50 transition-colors">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 p-6">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black text-navy uppercase tracking-widest bg-navy/10 px-2 py-0.5 rounded-md">
                      {booking.id}
                    </span>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest",
                      booking.status === 'Upcoming' ? 'bg-accent-purple/10 text-accent-purple border border-accent-purple/20' :
                      booking.status === 'Pending' ? 'bg-warning/10 text-warning border border-warning/20' :
                      booking.status === 'Completed' ? 'bg-success/10 text-success border border-success/20' :
                      'bg-light-gray text-text-secondary border border-border'
                    )}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-text-primary tracking-tight">{booking.type}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-text-secondary">with</span>
                    <span className="text-sm font-bold text-text-primary">{booking.client}</span>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary">
                      <Clock size={14} className="text-navy" /> {booking.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-md">
                      {booking.amount}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-col gap-2 justify-end w-full md:w-auto">
                  {booking.status === 'Pending' && (
                    <>
                      <Button variant="primary" size="sm" className="shadow-sm bg-success hover:bg-success/90 border-none" onClick={() => handleAction(booking.id, 'accept')}>
                        <CheckCircle2 size={14} className="mr-1.5" /> Accept Request
                      </Button>
                      <Button variant="outline" size="sm" className="border-accent-red text-accent-red hover:bg-accent-red/10" onClick={() => handleAction(booking.id, 'decline')}>
                        <XCircle size={14} className="mr-1.5" /> Decline
                      </Button>
                    </>
                  )}

                  {booking.status === 'Upcoming' && (
                    <>
                      <Button variant="primary" size="sm" className="shadow-md" onClick={() => handleAction(booking.id, 'join')}>
                        <Video size={14} className="mr-1.5" /> Join Meeting
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => toast('Opening messages', { icon: '💬' })}>
                        <MessageSquare size={14} className="mr-1.5" /> Message Client
                      </Button>
                    </>
                  )}

                  {booking.status === 'Completed' && (
                    <Button variant="outline" size="sm" onClick={() => toast.success('Feedback requested')}>
                      <Star size={14} className="mr-1.5" /> Request Review
                    </Button>
                  )}
                </div>

              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
