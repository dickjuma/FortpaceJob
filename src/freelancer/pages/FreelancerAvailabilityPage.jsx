// src/pages/freelancer/FreelancerAvailabilityPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon, Clock, Globe, Briefcase,
  ToggleLeft, ToggleRight, Save, Info, Plus, X, Sun, Moon, Check
} from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIMEZONES = [
  '(GMT-08:00) Pacific Time (US & Canada)',
  '(GMT-05:00) Eastern Time (US & Canada)',
  '(GMT+00:00) Greenwich Mean Time (London)',
  '(GMT+02:00) Central European Summer Time',
  '(GMT+05:30) India Standard Time',
];

export default function FreelancerAvailabilityPage() {
  const [status, setStatus] = useState('Available Now');
  const [timezone, setTimezone] = useState(TIMEZONES[0]);
  const [vacationMode, setVacationMode] = useState(false);
  const [instantBooking, setInstantBooking] = useState(true);
  const [maxContracts, setMaxContracts] = useState(5);
  const [weeklyHours, setWeeklyHours] = useState(40);
  const [vacationReturnDate, setVacationReturnDate] = useState('');
  const [vacationMessage, setVacationMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(null);

  const [schedule, setSchedule] = useState(
    DAYS.reduce((acc, day) => {
      acc[day] = { active: !['Saturday', 'Sunday'].includes(day), start: '09:00', end: '17:00' };
      return acc;
    }, {})
  );

  const toggleDay = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], active: !prev[day].active }
    }));
  };

  const updateTime = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleSave = () => {
    setShowSuccess({ message: 'Availability settings saved' });
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const StatusOption = ({ option }) => (
    <div
      onClick={() => setStatus(option)}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
        status === option
          ? "border-accent DEFAULT bg-accent-light"
          : "border-border hover:border-border-strong"
      }`}
    >
      <div className={`w-4 h-4 rounded-full border-2 ${
        status === option
          ? "border-accent DEFAULT bg-accent DEFAULT"
          : "border-border"
      }`} />
      <span className={`font-body font-medium text-sm ${
        status === option ? "text-accent DEFAULT" : "text-ink-primary"
      }`}>
        {option}
      </span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-surface-soft pb-16"
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
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Availability settings</h1>
            <p className="text-ink-secondary font-body mt-1">Manage when clients can hire or contact you</p>
          </div>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-900"
          >
            <Save className="w-4 h-4" />
            Save changes
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">

        {/* Left Column: Schedule & Status */}
        <div className="flex-1 space-y-6">

          {/* Status Card */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white border border-border rounded-2xl p-6 shadow-sm"
          >
            <h2 className="font-display font-semibold text-lg text-brand-900 mb-5 flex items-center gap-2">
              <Globe className="w-5 h-5 text-accent DEFAULT" />
              Current status
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {['Available Now', 'Limited Availability', 'Fully Booked', 'On Vacation'].map(opt => (
                <StatusOption key={opt} option={opt} />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-border pt-5">
              <div>
                <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                  Response time
                </p>
                <p className="text-sm font-body font-semibold text-ink-primary">~ 1 hour</p>
              </div>
              <div>
                <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                  Active orders
                </p>
                <p className="text-sm font-body font-semibold text-ink-primary">3 / {maxContracts}</p>
              </div>
              <div>
                <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                  Local time
                </p>
                <p className="text-sm font-body font-semibold text-ink-primary">10:24 AM</p>
              </div>
            </div>
          </motion.section>

          {/* Weekly Schedule */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-border rounded-2xl p-6 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
              <h2 className="font-display font-semibold text-lg text-brand-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-accent DEFAULT" />
                Working hours
              </h2>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="h-9 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900"
              >
                {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>

            <div className="space-y-3">
              {DAYS.map(day => (
                <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl bg-surface-soft border border-border">
                  <div className="flex items-center gap-3 w-40">
                    <button onClick={() => toggleDay(day)} className="focus:outline-none focus:ring-2 focus:ring-brand-900 rounded-lg">
                      {schedule[day].active ? (
                        <ToggleRight className="w-7 h-7 text-accent DEFAULT" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-ink-tertiary" />
                      )}
                    </button>
                    <span className={`text-sm font-body font-medium ${
                      schedule[day].active ? "text-ink-primary" : "text-ink-tertiary"
                    }`}>
                      {day}
                    </span>
                  </div>

                  {schedule[day].active ? (
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="time"
                        value={schedule[day].start}
                        onChange={(e) => updateTime(day, 'start', e.target.value)}
                        className="h-9 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900"
                      />
                      <span className="text-ink-tertiary font-body">-</span>
                      <input
                        type="time"
                        value={schedule[day].end}
                        onChange={(e) => updateTime(day, 'end', e.target.value)}
                        className="h-9 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900"
                      />
                    </div>
                  ) : (
                    <div className="text-sm font-body text-ink-tertiary italic">Unavailable</div>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Right Column: Settings & Workload */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">

          {/* Vacation Mode */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Sun className="w-24 h-24 text-accent DEFAULT" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-body font-semibold text-ink-primary">Vacation mode</h3>
                <button onClick={() => setVacationMode(!vacationMode)} className="focus:outline-none focus:ring-2 focus:ring-brand-900 rounded-lg">
                  {vacationMode ? (
                    <ToggleRight className="w-7 h-7 text-accent DEFAULT" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-ink-tertiary" />
                  )}
                </button>
              </div>
              <p className="text-xs text-ink-secondary font-body leading-relaxed">
                Turn this on when you are away. Your profile will be paused and clients cannot place new orders.
              </p>

              <AnimatePresence>
                {vacationMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 pt-4 border-t border-border mt-4"
                  >
                    <div>
                      <label className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1 block">
                        Return date
                      </label>
                      <input
                        type="date"
                        value={vacationReturnDate}
                        onChange={(e) => setVacationReturnDate(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1 block">
                        Auto-reply message
                      </label>
                      <textarea
                        rows={3}
                        value={vacationMessage}
                        onChange={(e) => setVacationMessage(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none"
                        placeholder="I'm currently away and will respond upon my return..."
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          {/* Workload Capacity */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-border rounded-2xl p-6 shadow-sm"
          >
            <h3 className="font-body font-semibold text-ink-primary mb-5 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent DEFAULT" />
              Workload limits
            </h3>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-body font-medium text-ink-primary">Max active contracts</label>
                  <span className="text-sm font-mono font-semibold text-accent DEFAULT">{maxContracts}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={maxContracts}
                  onChange={(e) => setMaxContracts(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent DEFAULT"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-body font-medium text-ink-primary">Weekly hours capacity</label>
                  <span className="text-sm font-mono font-semibold text-accent DEFAULT">{weeklyHours}h</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent DEFAULT"
                />
              </div>
            </div>
          </motion.section>

          {/* Instant Booking */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white border border-border rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-body font-semibold text-ink-primary flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent DEFAULT" />
                Instant booking
              </h3>
              <button onClick={() => setInstantBooking(!instantBooking)} className="focus:outline-none focus:ring-2 focus:ring-brand-900 rounded-lg">
                {instantBooking ? (
                  <ToggleRight className="w-7 h-7 text-accent DEFAULT" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-ink-tertiary" />
                )}
              </button>
            </div>
            <p className="text-xs text-ink-secondary font-body leading-relaxed">
              Allow clients to place orders instantly without prior messaging. Disabling this requires clients to request a quote first.
            </p>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
}
