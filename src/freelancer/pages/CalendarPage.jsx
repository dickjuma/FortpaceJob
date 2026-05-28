import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Video, Target, Briefcase, Plus, Filter } from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';

// --- Skeleton Loader ---
const CalendarSkeleton = () => (
  <div className="space-y-8 animate-pulse pb-12">
    <div className="flex justify-between items-end">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-light-gray rounded-md"></div>
        <div className="h-4 w-48 bg-light-gray rounded-md"></div>
      </div>
      <div className="h-10 w-32 bg-light-gray rounded-md"></div>
    </div>
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 h-[600px] bg-light-gray rounded-2xl"></div>
      <div className="w-full lg:w-96 space-y-4">
        <div className="h-48 bg-light-gray rounded-2xl"></div>
        <div className="h-64 bg-light-gray rounded-2xl"></div>
      </div>
    </div>
  </div>
);

// --- Mock Data ---
const MOCK_EVENTS = [
  { id: 1, title: 'Project Kickoff: Global Finance', type: 'meeting', time: '10:00 AM - 11:00 AM', date: '2026-05-27', link: 'meet.google.com/xyz' },
  { id: 2, title: 'Milestone 2 Delivery', type: 'milestone', time: 'Due 5:00 PM', date: '2026-05-28', contractId: 'CNT-2024-089' },
  { id: 3, title: 'Client Sync: HealthSync', type: 'meeting', time: '2:00 PM - 2:30 PM', date: '2026-05-29', link: 'zoom.us/j/123' },
  { id: 4, title: 'Gig Delivery: React UI', type: 'delivery', time: 'Due 12:00 PM', date: '2026-05-27', orderId: 'ORD-589201' },
];

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date('2026-05-27'));

  useEffect(() => {
    // Simulate API fetch
    const fetchEvents = async () => {
      setLoading(true);
      await new Promise(res => setTimeout(res, 900));
      setEvents(MOCK_EVENTS);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const handleCreateEvent = () => {
    toast.success('Opening event creation modal', { icon: '📅' });
  };

  const getDayEvents = (dateStr) => {
    return events.filter(e => e.date === dateStr);
  };

  if (loading) return <CalendarSkeleton />;

  // Quick helper to generate next 7 days
  const upcomingDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentDate);
    d.setDate(currentDate.getDate() + i);
    return {
      dateObj: d,
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate()
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-purple/10 text-accent-purple rounded-xl shadow-sm border border-accent-purple/20">
              <CalendarIcon size={24} />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Schedule & Calendar</h1>
          </div>
          <p className="text-sm text-text-secondary font-medium max-w-2xl">
            Manage your meetings, milestone deadlines, and project deliveries all in one place.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateEvent} variant="primary" className="shadow-lg" icon={<Plus size={16} />}>
            New Event
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Calendar View */}
        <Card className="flex-1 w-full bg-white border-border shadow-sm p-0 overflow-hidden">
          {/* Calendar Header Controls */}
          <div className="p-6 border-b border-border flex justify-between items-center bg-light-gray/20">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-text-primary">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg border border-border text-text-secondary hover:bg-white hover:text-navy transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button className="p-1.5 rounded-lg border border-border text-text-secondary hover:bg-white hover:text-navy transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" icon={<Filter size={14} />}>Filter</Button>
            </div>
          </div>

          {/* Weekly Schedule View */}
          <div className="grid grid-cols-7 border-b border-border bg-light-gray/10">
            {upcomingDays.map((day, idx) => (
              <div key={idx} className={cn(
                "p-4 text-center border-r border-border last:border-r-0",
                idx === 0 ? "bg-accent-purple/5 border-b-2 border-b-accent-purple" : ""
              )}>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{day.dayName}</p>
                <p className={cn("text-xl font-black mt-1", idx === 0 ? "text-accent-purple" : "text-text-primary")}>{day.dayNum}</p>
              </div>
            ))}
          </div>

          <div className="min-h-[400px] grid grid-cols-7 divide-x divide-border">
            {upcomingDays.map((day, idx) => {
              const dayEvents = getDayEvents(day.dateStr);
              return (
                <div key={idx} className={cn("p-2 sm:p-4 bg-white min-h-[400px]", idx === 0 ? "bg-accent-purple/5" : "")}>
                  <div className="space-y-3">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id}
                        onClick={() => toast(`Viewing event: ${event.title}`)}
                        className={cn(
                          "p-3 rounded-xl border border-l-4 cursor-pointer hover:shadow-md transition-all group",
                          event.type === 'meeting' ? "bg-navy/5 border-l-navy border-t-border border-r-border border-b-border" :
                          event.type === 'milestone' ? "bg-success/5 border-l-success border-t-border border-r-border border-b-border" :
                          "bg-warning/5 border-l-warning border-t-border border-r-border border-b-border"
                        )}
                      >
                        <p className="text-[10px] font-bold text-text-secondary mb-1 flex items-center gap-1 uppercase tracking-widest">
                          {event.type === 'meeting' && <Video size={10} />}
                          {event.type === 'milestone' && <Target size={10} />}
                          {event.type === 'delivery' && <Briefcase size={10} />}
                          {event.type}
                        </p>
                        <p className="text-xs font-bold text-text-primary group-hover:text-navy transition-colors mb-2 leading-tight">
                          {event.title}
                        </p>
                        <p className="text-[10px] font-semibold text-text-secondary flex items-center gap-1">
                          <Clock size={10} /> {event.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right Sidebar: Upcoming */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <Card className="bg-navy border-none text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-20%] w-48 h-48 bg-accent-purple/30 blur-[60px] rounded-full pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="font-bold text-white mb-6 uppercase tracking-widest text-xs flex items-center gap-2">
                <Clock size={16} className="text-accent-purple" /> Next Up Today
              </h3>
              
              <div className="space-y-4">
                {getDayEvents(currentDate.toISOString().split('T')[0]).map(event => (
                  <div key={event.id} className="bg-white/10 border border-white/20 p-4 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer" onClick={() => toast.success('Joining meeting...')}>
                    <p className="text-sm font-bold text-white mb-1">{event.title}</p>
                    <p className="text-[10px] font-semibold text-white/70 flex items-center gap-1 uppercase tracking-widest mb-3">
                      <Clock size={12} /> {event.time}
                    </p>
                    {event.type === 'meeting' && (
                      <Button variant="primary" size="sm" className="w-full bg-accent-purple hover:bg-accent-purple/90 border-none shadow-lg">
                        Join Meeting
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
