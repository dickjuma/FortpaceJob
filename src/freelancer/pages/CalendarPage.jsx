// src/pages/freelancer/CalendarPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight,
  Video, Target, Briefcase, Plus, Filter, Check
} from 'lucide-react';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showSuccess, setShowSuccess] = useState(null);
  const [filterType, setFilterType] = useState('all');

  // Mock events data
  const [events] = useState([
    {
      id: '1',
      title: 'Consultation with Sarah Johnson',
      type: 'meeting',
      time: '10:00 AM',
      date: new Date().toISOString().split('T')[0],
      link: 'meet.google.com/abc-defg-hij'
    },
    {
      id: '2',
      title: 'Portfolio Review - Michael Chen',
      type: 'meeting',
      time: '02:00 PM',
      date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
      link: 'meet.google.com/klm-nopq-rst'
    },
    {
      id: '3',
      title: 'Project Milestone: UI Design',
      type: 'milestone',
      time: 'All day',
      date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
      link: null
    },
    {
      id: '4',
      title: 'Final Delivery - E-commerce App',
      type: 'delivery',
      time: '05:00 PM',
      date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
      link: null
    }
  ]);

  const handleCreateEvent = () => {
    setShowSuccess({ message: 'Event creation modal would open here' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleJoinMeeting = (link) => {
    if (link) {
      window.open(link.startsWith('http') ? link : `https://${link}`, '_blank');
      setShowSuccess({ message: 'Joining meeting...' });
      setTimeout(() => setShowSuccess(null), 2000);
    }
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const getDayEvents = (dateStr) => {
    let filtered = events.filter(e => e.date === dateStr);
    if (filterType !== 'all') {
      filtered = filtered.filter(e => e.type === filterType);
    }
    return filtered;
  };

  // Generate next 7 days
  const upcomingDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentDate);
    d.setDate(currentDate.getDate() + i);
    return {
      dateObj: d,
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      isToday: i === 0
    };
  });

  const todayEvents = getDayEvents(new Date().toISOString().split('T')[0]);

  const getTypeStyles = (type) => {
    switch(type) {
      case 'meeting':
        return 'border-l-accent DEFAULT bg-accent-light';
      case 'milestone':
        return 'border-l-info DEFAULT bg-info-light';
      case 'delivery':
        return 'border-l-warn DEFAULT bg-warn-light';
      default:
        return 'border-l-border bg-white';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'meeting': return <Video className="w-3 h-3" />;
      case 'milestone': return <Target className="w-3 h-3" />;
      case 'delivery': return <Briefcase className="w-3 h-3" />;
      default: return null;
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light rounded-xl">
              <CalendarIcon className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-4xl text-brand-900">Schedule & calendar</h1>
          </div>
          <p className="text-ink-secondary font-body mt-1 text-base">
            Manage your meetings, milestones, and project deliveries
          </p>
        </div>
        <button
          onClick={handleCreateEvent}
          className="px-5 py-2.5 rounded-lg font-body font-medium text-sm bg-brand-900 text-white hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          New event
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Calendar View */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Calendar Header */}
            <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-soft">
              <div className="flex items-center gap-4">
                <h2 className="font-display font-semibold text-xl text-brand-900">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-1">
                  <button
                    onClick={handlePrevWeek}
                    className="p-1.5 rounded-lg border border-border text-ink-secondary hover:bg-white hover:text-ink-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextWeek}
                    className="p-1.5 rounded-lg border border-border text-ink-secondary hover:bg-white hover:text-ink-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900"
                >
                  <option value="all">All events</option>
                  <option value="meeting">Meetings only</option>
                  <option value="milestone">Milestones only</option>
                  <option value="delivery">Deliveries only</option>
                </select>
              </div>
            </div>

            {/* Week Days Header */}
            <div className="grid grid-cols-7 border-b border-border bg-surface-soft">
              {upcomingDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`p-4 text-center border-r border-border last:border-r-0 ${
                    day.isToday ? 'bg-accent-light' : ''
                  }`}
                >
                  <p className="text-xs font-body font-medium text-ink-secondary uppercase tracking-wide">
                    {day.dayName}
                  </p>
                  <p className={`text-xl font-display font-semibold mt-1 ${
                    day.isToday ? 'text-accent DEFAULT' : 'text-brand-900'
                  }`}>
                    {day.dayNum}
                  </p>
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 divide-x divide-border">
              {upcomingDays.map((day, idx) => {
                const dayEvents = getDayEvents(day.dateStr);
                return (
                  <div
                    key={idx}
                    className={`p-3 min-h-[400px] ${
                      day.isToday ? 'bg-accent-light/30' : 'bg-white'
                    }`}
                  >
                    <div className="space-y-2">
                      {dayEvents.map((event, eventIdx) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: eventIdx * 0.05 }}
                          whileHover={{ y: -2 }}
                          onClick={() => {
                            if (event.type === 'meeting' && event.link) {
                              handleJoinMeeting(event.link);
                            }
                          }}
                          className={`p-3 rounded-xl border-l-4 cursor-pointer transition-all hover:shadow-sm ${getTypeStyles(event.type)}`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            {getTypeIcon(event.type)}
                            <p className="text-xs font-body font-medium text-ink-secondary uppercase tracking-wide">
                              {event.type}
                            </p>
                          </div>
                          <p className="text-sm font-body font-medium text-ink-primary mb-2 leading-tight">
                            {event.title}
                          </p>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-ink-tertiary" />
                            <p className="text-xs font-body text-ink-tertiary">{event.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-80 space-y-6">
          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-brand-900 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="p-5 border-b border-brand-800">
              <h3 className="font-body font-semibold text-white flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-accent DEFAULT" />
                Today's schedule
              </h3>
            </div>

            <div className="p-5 space-y-3">
              {todayEvents.length === 0 ? (
                <p className="text-white/60 text-sm font-body text-center py-8">
                  No events scheduled for today
                </p>
              ) : (
                todayEvents.map(event => (
                  <div
                    key={event.id}
                    className="bg-white/10 border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-colors cursor-pointer"
                    onClick={() => {
                      if (event.type === 'meeting' && event.link) {
                        handleJoinMeeting(event.link);
                      }
                    }}
                  >
                    <p className="text-sm font-body font-medium text-white mb-1">
                      {event.title}
                    </p>
                    <p className="text-xs font-body text-white/70 flex items-center gap-1 mb-3">
                      <Clock className="w-3 h-3" /> {event.time}
                    </p>
                    {event.type === 'meeting' && event.link && (
                      <button className="w-full px-3 py-1.5 rounded-lg bg-accent DEFAULT text-white text-xs font-body font-medium hover:bg-accent-dark transition-colors">
                        Join meeting
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white border border-border rounded-2xl p-5 shadow-sm"
          >
            <h3 className="font-body font-semibold text-ink-primary text-sm mb-3">Weekly summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-ink-secondary text-xs font-body">Total meetings</span>
                <span className="font-mono font-semibold text-brand-900">
                  {events.filter(e => e.type === 'meeting').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink-secondary text-xs font-body">Milestones due</span>
                <span className="font-mono font-semibold text-brand-900">
                  {events.filter(e => e.type === 'milestone').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink-secondary text-xs font-body">Deliveries</span>
                <span className="font-mono font-semibold text-brand-900">
                  {events.filter(e => e.type === 'delivery').length}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
