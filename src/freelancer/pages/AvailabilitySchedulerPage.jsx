import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, Globe, UserCheck, 
  UserMinus, Plane, ChevronLeft, ChevronRight, Settings, 
  Briefcase, Save
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
  const [isSaving, setIsSaving] = useState(false);
  
  // Weekly calendar navigation simulation
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const toggleTimeSlot = (day, time) => {
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
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans min-h-screen bg-surface dark:bg-gray-950">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-[#14a800]" />
            Availability Scheduler
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
            Set your working hours, current status, and booking preferences to let clients know when you're ready for new projects.
          </p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-[#14a800] hover:bg-[#118a00] disabled:opacity-70 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm shrink-0"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Settings & Status */}
        <div className="space-y-6">
          {/* Current Status */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-gray-400" />
              Current Status
            </h2>
            <div className="space-y-3">
              {[
                { id: 'available', label: 'Available for Hire', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' },
                { id: 'busy', label: 'Currently Busy', icon: UserMinus, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800' },
                { id: 'vacation', label: 'On Vacation Mode', icon: Plane, color: 'text-[#14a800]', bg: 'bg-[#14a800]/5 dark:bg-[#14a800]/20', border: 'border-[#14a800]/20 dark:border-[#14a800]/20' }
              ].map(s => (
                <label 
                  key={s.id} 
                  className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                    status === s.id 
                      ? `${s.bg} ${s.border} ring-1 ring-${s.color.split('-')[1]}-500` 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-surface dark:hover:bg-gray-800'
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
                  <s.icon className={`w-5 h-5 mr-3 ${status === s.id ? s.color : 'text-gray-400'}`} />
                  <span className={`font-medium ${status === s.id ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                    {s.label}
                  </span>
                  {status === s.id && (
                    <div className={`ml-auto w-2 h-2 rounded-full ${s.color.replace('text-', 'bg-')}`} />
                  )}
                </label>
              ))}
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-400" />
              Booking Preferences
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" /> Timezone
                </label>
                <select 
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-surface dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#14a800] outline-none"
                >
                  <option>UTC-08:00 Pacific Time (US & Canada)</option>
                  <option>UTC-05:00 Eastern Time (US & Canada)</option>
                  <option>UTC+00:00 Greenwich Mean Time</option>
                  <option>UTC+01:00 Central European Time</option>
                  <option>UTC+05:30 Indian Standard Time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" /> Preferred Project Size
                </label>
                <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-surface dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#14a800] outline-none">
                  <option>Any Size</option>
                  <option>Small (&lt; 1 week)</option>
                  <option>Medium (1-4 weeks)</option>
                  <option>Large (1+ months)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" /> Max Hours / Week
                </label>
                <input 
                  type="number" 
                  defaultValue={40}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-surface dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#14a800] outline-none"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Weekly Scheduler */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden h-full flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Availability</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Click slots to toggle your working hours</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentWeekOffset(prev => prev - 1)}
                  className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-surface dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[100px] text-center">
                  {currentWeekOffset === 0 ? 'This Week' : currentWeekOffset === 1 ? 'Next Week' : `${Math.abs(currentWeekOffset)} weeks ${currentWeekOffset > 0 ? 'ahead' : 'ago'}`}
                </span>
                <button 
                  onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                  className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-surface dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto p-6">
              <div className="min-w-[700px]">
                {/* Calendar Header */}
                <div className="grid grid-cols-8 gap-2 mb-4">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right pr-4 pt-2">Time</div>
                  {DAYS.map(day => (
                    <div key={day} className="text-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{day.slice(0, 3)}</div>
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="space-y-2 relative">
                  {status === 'vacation' && (
                    <div className="absolute inset-0 z-10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl border border-[#14a800]/20 dark:border-[#14a800]/20/30">
                      <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4">
                        <div className="p-3 bg-[#14a800]/5 dark:bg-[#14a800]/20 text-[#14a800] rounded-full">
                          <Plane className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Vacation Mode Active</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Your schedule is hidden while on vacation.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {TIME_SLOTS.map(time => (
                    <div key={time} className="grid grid-cols-8 gap-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-right pr-4 flex items-center justify-end h-10">
                        {time}
                      </div>
                      {DAYS.map(day => {
                        const isSelected = schedule[day].includes(time);
                        return (
                          <button
                            key={`${day}-${time}`}
                            onClick={() => toggleTimeSlot(day, time)}
                            disabled={status === 'vacation'}
                            className={`h-10 rounded-md border text-xs font-medium transition-all ${
                              isSelected 
                                ? 'bg-[#14a800]/10 border-[#14a800]/20 text-[#14a800] dark:bg-[#14a800]/40 dark:border-[#14a800]/20 dark:text-[#14a800] hover:bg-[#14a800] dark:hover:bg-[#14a800]/60' 
                                : 'bg-surface border-gray-100 text-transparent hover:text-gray-400 dark:bg-gray-800/30 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            {isSelected ? '✓' : '+'}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-surface dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#14a800]/10 border border-[#14a800]/20 dark:bg-[#14a800]/40 dark:border-[#14a800]/20" /> Available</span>
                <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-surface border border-gray-100 dark:bg-gray-800/30 dark:border-gray-800" /> Unavailable</span>
              </div>
              <div>
                Total Hours: <span className="font-medium text-gray-900 dark:text-white">{Object.values(schedule).flat().length}</span>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
