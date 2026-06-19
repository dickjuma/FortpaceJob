// src/pages/freelancer/AvailabilitySchedulingPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, Clock, Globe, Save, Check, Plus, Trash2, CalendarDays, X
} from 'lucide-react';
import { useUpdateAvailability } from '../services/freelancerHooks';

export default function AvailabilitySchedulingPage() {
  const [capacity, setCapacity] = useState('full_time');
  const [timezone, setTimezone] = useState('Pacific Time (PT) - US & Canada');
  const [acceptRemote, setAcceptRemote] = useState(true);
  const [acceptOnsite, setAcceptOnsite] = useState(true);
  const [workDays, setWorkDays] = useState({
    monday: { active: true, start: '09:00', end: '17:00' },
    tuesday: { active: true, start: '09:00', end: '17:00' },
    wednesday: { active: true, start: '09:00', end: '17:00' },
    thursday: { active: true, start: '09:00', end: '17:00' },
    friday: { active: true, start: '09:00', end: '17:00' },
    saturday: { active: false, start: '10:00', end: '14:00' },
    sunday: { active: false, start: '10:00', end: '14:00' }
  });
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  const updateAvailability = useUpdateAvailability();

  const handleDayToggle = (day) => {
    setWorkDays(prev => ({
      ...prev,
      [day]: { ...prev[day], active: !prev[day].active }
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setWorkDays(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleSave = () => {
    updateAvailability.mutate({ capacity, timezone, acceptRemote, acceptOnsite, workDays }, {
      onSuccess: () => {
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
      }
    });
  };

  const totalWeeklyHours = Object.values(workDays).reduce((total, day) => {
    if (!day.active) return total;
    const start = parseInt(day.start.split(':')[0]);
    const end = parseInt(day.end.split(':')[0]);
    return total + (end - start);
  }, 0);

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
            Availability preferences saved
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="border-b border-border pb-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-accent-light rounded-xl">
            <CalendarDays className="w-6 h-6 text-accent DEFAULT" />
          </div>
          <h1 className="font-display font-bold text-4xl text-brand-900">Availability & scheduling</h1>
        </div>
        <p className="text-ink-secondary font-body mt-1 text-base max-w-2xl">
          Set your work hours, capacity, and timezone preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Capacity Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white border border-border rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
              <Calendar className="w-5 h-5 text-accent DEFAULT" />
              <h2 className="font-display font-semibold text-lg text-brand-900">Weekly capacity</h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'full_time',
                  label: 'Full-time',
  description: '30+ hours per week - open to long term contracts',
                  icon: '🚀'
                },
                {
                  id: 'part_time',
                  label: 'Part-time',
                  description: 'Less than 30 hours per week - best for small projects',
                  icon: '⚡'
                },
                {
                  id: 'unavailable',
                  label: 'Not available',
                  description: 'Temporarily pause new project inquiries',
                  icon: '⏸️'
                }
              ].map(opt => (
                <label
                  key={opt.id}
                  className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    capacity === opt.id
                      ? 'border-accent DEFAULT bg-accent-light'
                      : 'border-border bg-white hover:border-border-strong'
                  }`}
                >
                  <input
                    type="radio"
                    name="capacity"
                    checked={capacity === opt.id}
                    onChange={() => setCapacity(opt.id)}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{opt.icon}</span>
                      <span className="font-body font-semibold text-ink-primary text-sm">{opt.label}</span>
                    </div>
                    <p className="text-ink-tertiary text-xs mt-1 font-body">{opt.description}</p>
                  </div>
                  {capacity === opt.id && (
                    <Check className="w-5 h-5 text-accent DEFAULT ml-auto" />
                  )}
                </label>
              ))}
            </div>
          </motion.div>

          {/* Working Days & Hours Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-border rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
              <Clock className="w-5 h-5 text-accent DEFAULT" />
              <h2 className="font-display font-semibold text-lg text-brand-900">Working days & hours</h2>
            </div>

            <div className="space-y-3">
              {Object.entries(workDays).map(([day, config], index) => (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl hover:bg-surface-soft transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={config.active}
                      onChange={() => handleDayToggle(day)}
                      className="w-4 h-4 rounded border-border text-accent DEFAULT focus:ring-accent DEFAULT focus:ring-2"
                    />
                    <span className="font-body font-medium text-ink-primary text-sm capitalize min-w-[90px]">
                      {day}
                    </span>
                  </div>

                  {config.active ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={config.start}
                        onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                        className="h-9 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                      />
                      <span className="text-ink-tertiary text-xs font-body">to</span>
                      <input
                        type="time"
                        value={config.end}
                        onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                        className="h-9 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <span className="text-ink-tertiary text-xs font-body italic">Not working</span>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="font-body text-ink-secondary">Total weekly hours</span>
                <span className="font-mono font-semibold text-brand-900 text-lg">{totalWeeklyHours}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Side Panel - Global Settings */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6"
          >
            {/* Timezone */}
            <div>
              <h3 className="font-body font-semibold text-ink-primary text-sm flex items-center gap-1.5 mb-3">
                <Globe className="w-4 h-4 text-accent DEFAULT" />
                Timezone
              </h3>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
              >
                <option>Pacific Time (PT) - US & Canada</option>
                <option>Eastern Time (ET) - US & Canada</option>
                <option>Central European Time (CET)</option>
                <option>East African Time (EAT)</option>
                <option>Greenwich Mean Time (GMT)</option>
                <option>Indian Standard Time (IST)</option>
              </select>
            </div>

            {/* Work Modes */}
            <div className="border-t border-border pt-4">
              <h3 className="font-body font-semibold text-ink-primary text-sm flex items-center gap-1.5 mb-3">
                <MapPin className="w-4 h-4 text-accent DEFAULT" />
                Work preferences
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptRemote}
                    onChange={(e) => setAcceptRemote(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-accent DEFAULT focus:ring-accent DEFAULT"
                  />
                  <span className="font-body text-sm text-ink-primary">Accept remote contracts</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptOnsite}
                    onChange={(e) => setAcceptOnsite(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-accent DEFAULT focus:ring-accent DEFAULT"
                  />
                  <span className="font-body text-sm text-ink-primary">Accept onsite bookings</span>
                </label>
              </div>
            </div>

            {/* Summary Card */}
            <div className="border-t border-border pt-4">
              <div className="bg-surface-soft rounded-lg p-3">
                <div className="text-ink-tertiary text-xs font-body mb-2">Current status</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    capacity === 'full_time' ? 'bg-accent DEFAULT' :
                    capacity === 'part_time' ? 'bg-warn DEFAULT' : 'bg-danger DEFAULT'
                  }`} />
                  <span className="font-body text-sm text-ink-primary">
                    {capacity === 'full_time' ? 'Available for full-time work' :
                     capacity === 'part_time' ? 'Available for part-time work' :
                     'Not accepting new projects'}
                  </span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="border-t border-border pt-5">
                <button
                  onClick={handleSave}
                  disabled={updateAvailability.isPending}
                  className="w-full px-5 py-2.5 rounded-lg font-body font-medium text-sm bg-brand-900 text-white hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 disabled:opacity-40 cursor-not-allowed inline-flex items-center justify-center gap-2 transition-all"
                >
                  {updateAvailability.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {updateAvailability.isPending ? 'Saving...' : 'Save preferences'}
                </button>
            </div>
          </motion.div>

          {/* Tip Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-accent-light border border-accent DEFAULT rounded-2xl p-5"
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-white rounded-lg">
                <Clock className="w-4 h-4 text-accent DEFAULT" />
              </div>
              <div>
                <h4 className="font-body font-semibold text-ink-primary text-sm mb-1">Tip</h4>
                <p className="text-ink-secondary text-xs font-body leading-relaxed">
                  Set your working hours accurately to avoid scheduling conflicts and manage client expectations.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
