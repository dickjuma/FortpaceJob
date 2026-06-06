// src/pages/freelancer/AvailabilitySchedulerPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon, Clock, Globe, UserCheck,
  UserMinus, Plane, ChevronLeft, ChevronRight, Settings,
  Briefcase, Save, Check, X
} from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const INITIAL_SCHEDULE = {
  Monday: ['09:00 AM', '10:00 AM', '01:00 PM', '02:00 PM'],
  Tuesday: ['10:00 AM', '11:00 AM', '03:00 PM', '04:00 PM'],
  Wednesday: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
  Thursday: ['01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'],
  Friday: ['09:00 AM', '10:00 AM'],
  Saturday: [],
  Sunday: []
};

export default function AvailabilitySchedulerPage() {
  const [status, setStatus] = useState('available'); // available, busy, vacation
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [timezone, setTimezone] = useState('UTC-05:00 Eastern Time (US & Canada)');
  const [projectSize, setProjectSize] = useState('Any Size');
  const [maxHours, setMaxHours] = useState(40);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const toggleTimeSlot = (day, time) => {
    if (status === 'vacation') return;

    setSchedule(prev => {
      const daySlots = prev[day];
      if (daySlots.includes(time)) {
        return { ...prev, [day]: daySlots.filter(t => t !== time) };
      } else {
        return { ...prev, [day]: [...daySlots, time].sort((a, b) => TIME_SLOTS.indexOf(a) - TIME_SLOTS.indexOf(b)) };
      }
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    }, 800);
  };

  const totalHours = Object.values(schedule).flat().length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSaveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Availability settings saved
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h1 className="font-display font-bold text-4xl lg:text-5xl text-brand-900 flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-accent DEFAULT" />
            Availability Scheduler
          </h1>
          <p className="text-ink-secondary font-body mt-2 max-w-2xl text-base">
            Set your working hours and status to let clients know when you're ready for new projects
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-lg font-body font-medium text-sm bg-brand-900 text-white hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 disabled:opacity-40 cursor-not-allowed inline-flex items-center gap-2 transition-all"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Settings & Status */}
        <div className="space-y-6">
          {/* Current Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white border border-border rounded-2xl p-6 shadow-sm"
          >
            <h2 className="font-display font-semibold text-lg text-brand-900 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-accent DEFAULT" />
              Current status
            </h2>
            <div className="space-y-3">
              {[
                { id: 'available', label: 'Available for hire', icon: UserCheck, color: 'accent', description: 'Clients can book your services' },
                { id: 'busy', label: 'Currently busy', icon: UserMinus, color: 'danger', description: 'Not accepting new projects' },
                { id: 'vacation', label: 'On vacation', icon: Plane, color: 'warn', description: 'Temporarily unavailable' }
              ].map(s => (
                <label
                  key={s.id}
                  className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    status === s.id
                      ? `border-accent DEFAULT bg-accent-light`
                      : 'border-border bg-white hover:border-border-strong'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s.id}
                    checked={status === s.id}
                    onChange={() => setStatus(s.id)}
                    className="sr-only"
                  />
                  <div className={`p-2 rounded-lg mr-3 ${
                    status === s.id
                      ? `bg-accent DEFAULT text-white`
                      : 'bg-surface-muted text-ink-secondary'
                  }`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className={`font-body font-semibold text-sm ${
                      status === s.id ? 'text-ink-primary' : 'text-ink-secondary'
                    }`}>
                      {s.label}
                    </div>
                    <div className="text-ink-tertiary text-xs mt-0.5">{s.description}</div>
                  </div>
                  {status === s.id && (
                    <Check className="w-5 h-5 text-accent DEFAULT ml-auto" />
                  )}
                </label>
              ))}
            </div>
          </motion.div>

          {/* Booking Preferences Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-border rounded-2xl p-6 shadow-sm"
          >
            <h2 className="font-display font-semibold text-lg text-brand-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-accent DEFAULT" />
              Booking preferences
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-ink-secondary mb-1.5 font-body flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white text-ink-primary"
                >
                  <option>UTC-08:00 Pacific Time (US & Canada)</option>
                  <option>UTC-05:00 Eastern Time (US & Canada)</option>
                  <option>UTC+00:00 Greenwich Mean Time</option>
                  <option>UTC+01:00 Central European Time</option>
                  <option>UTC+05:30 Indian Standard Time</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-secondary mb-1.5 font-body flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" /> Preferred project size
                </label>
                <select
                  value={projectSize}
                  onChange={(e) => setProjectSize(e.target.value)}
                  className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white text-ink-primary"
                >
                  <option>Any size</option>
                  <option>Small (&lt; 1 week)</option>
                  <option>Medium (1-4 weeks)</option>
                  <option>Large (1+ months)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-secondary mb-1.5 font-body flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Maximum hours per week
                </label>
                <input
                  type="number"
                  value={maxHours}
                  onChange={(e) => setMaxHours(Number(e.target.value))}
                  className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white text-ink-primary"
                />
              </div>
            </div>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-6 shadow-sm text-white"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium opacity-80">Weekly summary</span>
              <div className="bg-white/20 rounded-full px-2 py-0.5 text-xs font-mono">
                {totalHours} hrs
              </div>
            </div>
            <div className="text-3xl font-mono font-semibold mb-1">
              {totalHours}
            </div>
            <div className="text-xs opacity-80 mb-4">
              available hours this week
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div
                className="bg-accent DEFAULT h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(totalHours / maxHours) * 100}%` }}
              />
            </div>
            <div className="text-xs opacity-80 mt-2">
              {Math.round((totalHours / maxHours) * 100)}% of weekly capacity
            </div>
          </motion.div>
        </div>

        {/* Right Column: Weekly Scheduler */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="font-display font-semibold text-lg text-brand-900">Weekly availability</h2>
                <p className="text-ink-tertiary text-sm font-body mt-1">Click time slots to add or remove hours</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentWeekOffset(prev => prev - 1)}
                  className="p-2 rounded-lg border border-border hover:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900"
                >
                  <ChevronLeft className="w-4 h-4 text-ink-secondary" />
                </button>
                <span className="text-sm font-body font-medium text-ink-primary min-w-[100px] text-center">
                  {currentWeekOffset === 0 ? 'This week' : currentWeekOffset === 1 ? 'Next week' : `${Math.abs(currentWeekOffset)} weeks ${currentWeekOffset > 0 ? 'ahead' : 'ago'}`}
                </span>
                <button
                  onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                  className="p-2 rounded-lg border border-border hover:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900"
                >
                  <ChevronRight className="w-4 h-4 text-ink-secondary" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto p-6">
              <div className="min-w-[700px]">
                {/* Calendar Header */}
                <div className="grid grid-cols-8 gap-2 mb-3">
                  <div className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide text-right pr-3 pt-2">
                    Time
                  </div>
                  {DAYS.map(day => (
                    <div key={day} className="text-center">
                      <div className="text-sm font-body font-medium text-ink-primary">{day.slice(0, 3)}</div>
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="relative">
                  {status === 'vacation' && (
                    <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                      <div className="bg-white px-6 py-4 rounded-2xl shadow-md border border-border flex items-center gap-4">
                        <div className="p-3 bg-accent-light text-accent DEFAULT rounded-full">
                          <Plane className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-body font-semibold text-ink-primary">Vacation mode active</h3>
                          <p className="text-ink-tertiary text-sm">Your schedule is hidden while on vacation</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    {TIME_SLOTS.map(time => (
                      <div key={time} className="grid grid-cols-8 gap-2">
                        <div className="text-xs text-ink-tertiary font-body text-right pr-3 flex items-center justify-end h-10">
                          {time}
                        </div>
                        {DAYS.map(day => {
                          const isSelected = schedule[day].includes(time);
                          return (
                            <button
                              key={`${day}-${time}`}
                              onClick={() => toggleTimeSlot(day, time)}
                              disabled={status === 'vacation'}
                              className={`h-10 rounded-lg border text-xs font-body font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 ${
                                isSelected
                                  ? 'bg-accent-light border-accent DEFAULT text-accent-dark hover:bg-accent-light/80'
                                  : 'bg-white border-border text-transparent hover:text-ink-tertiary hover:bg-surface-muted'
                              } ${status === 'vacation' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            >
                              {isSelected ? <Check className="w-4 h-4 mx-auto" /> : '+'}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface-soft border-t border-border">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-body">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-accent-light border border-accent DEFAULT" />
                    <span className="text-ink-secondary">Available</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-white border border-border" />
                    <span className="text-ink-secondary">Unavailable</span>
                  </span>
                </div>
                <div className="text-ink-secondary">
                  Total hours: <span className="font-mono font-semibold text-ink-primary">{totalHours}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
