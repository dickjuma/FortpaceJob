import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, Globe, Briefcase, 
  ToggleLeft, ToggleRight, Save, Info, Plus, X, Sun, Moon
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

// Mock Data
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
  
  // Workload states
  const [maxContracts, setMaxContracts] = useState(5);
  const [weeklyHours, setWeeklyHours] = useState(40);

  // Schedule state (mocked simple version)
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

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-8 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2">Availability Settings</h1>
            <p className="text-zinc-500 font-medium">Manage when clients can hire or contact you.</p>
          </div>
          <button className="px-6 py-2.5 bg-[#2bb75c] hover:bg-[#1d8d38] text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Schedule & Status */}
        <div className="flex-1 space-y-8">
          
          {/* Status Card */}
          <section className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#2bb75c]" /> Current Status
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {['Available Now', 'Limited Availability', 'Fully Booked', 'On Vacation'].map(opt => (
                <div 
                  key={opt}
                  onClick={() => setStatus(opt)}
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3",
                    status === opt ? "border-[#2bb75c]/20 bg-[#2bb75c]/5 dark:bg-[#2bb75c]/10" : "border-zinc-200 dark:border-zinc-700 hover:border-[#2bb75c]/20"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2",
                    status === opt ? "border-[#2bb75c]/20 bg-[#2bb75c]" : "border-zinc-300 dark:border-zinc-600"
                  )} />
                  <span className={cn("font-bold text-sm", status === opt ? "text-[#2bb75c] dark:text-[#2bb75c]" : "text-zinc-700 dark:text-zinc-300")}>{opt}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Response Time</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">~ 1 hour</p>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Active Orders</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">3 / {maxContracts}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Local Time</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">10:24 AM</p>
              </div>
            </div>
          </section>

          {/* Weekly Schedule */}
          <section className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#2bb75c]" /> Working Hours
              </h2>
              <select 
                value={timezone} 
                onChange={(e) => setTimezone(e.target.value)}
                className="bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 outline-none"
              >
                {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>

            <div className="space-y-4">
              {DAYS.map(day => (
                <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-surface dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700">
                  <div className="flex items-center gap-3 w-40">
                    <button onClick={() => toggleDay(day)}>
                      {schedule[day].active ? (
                        <ToggleRight className="w-8 h-8 text-[#2bb75c]" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
                      )}
                    </button>
                    <span className={cn("text-sm font-bold", schedule[day].active ? "text-zinc-900 dark:text-white" : "text-zinc-400")}>{day}</span>
                  </div>
                  
                  {schedule[day].active ? (
                    <div className="flex items-center gap-3 flex-1">
                      <input 
                        type="time" 
                        value={schedule[day].start}
                        onChange={(e) => updateTime(day, 'start', e.target.value)}
                        className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 outline-none focus:border-[#2bb75c]/20"
                      />
                      <span className="text-zinc-400 font-bold">-</span>
                      <input 
                        type="time" 
                        value={schedule[day].end}
                        onChange={(e) => updateTime(day, 'end', e.target.value)}
                        className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 outline-none focus:border-[#2bb75c]/20"
                      />
                      <button className="ml-auto p-2 text-zinc-400 hover:text-[#2bb75c] transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-zinc-400 italic">Unavailable</div>
                  )}
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column: Settings & Workload */}
        <div className="w-full lg:w-80 shrink-0 space-y-8">
          
          {/* Vacation Mode */}
          <section className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sun className="w-24 h-24 text-amber-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-zinc-900 dark:text-white">Vacation Mode</h3>
                <button onClick={() => setVacationMode(!vacationMode)}>
                  {vacationMode ? <ToggleRight className="w-8 h-8 text-amber-500" /> : <ToggleLeft className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />}
                </button>
              </div>
              <p className="text-xs text-zinc-500 mb-4 font-medium leading-relaxed">Turn this on when you are away. Your profile will be paused and clients cannot place new orders.</p>
              
              {vacationMode && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase mb-1 block">Return Date</label>
                    <input type="date" className="w-full bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm font-bold outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase mb-1 block">Auto-Reply Message</label>
                    <textarea rows={3} className="w-full bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm font-medium outline-none resize-none" placeholder="I'm away..." />
                  </div>
                </motion.div>
              )}
            </div>
          </section>

          {/* Workload Capacity */}
          <section className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#2bb75c]" /> Workload Limits
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Max Active Contracts</label>
                  <span className="text-sm font-black text-[#2bb75c]">{maxContracts}</span>
                </div>
                <input 
                  type="range" min="1" max="20" value={maxContracts} onChange={(e) => setMaxContracts(e.target.value)}
                  className="w-full accent-#2bb75c]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Weekly Hours Capacity</label>
                  <span className="text-sm font-black text-[#2bb75c]">{weeklyHours}h</span>
                </div>
                <input 
                  type="range" min="10" max="80" step="5" value={weeklyHours} onChange={(e) => setWeeklyHours(e.target.value)}
                  className="w-full accent-#2bb75c]"
                />
              </div>
            </div>
          </section>

          {/* Instant Booking */}
          <section className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#2bb75c]" /> Instant Booking
              </h3>
              <button onClick={() => setInstantBooking(!instantBooking)}>
                {instantBooking ? <ToggleRight className="w-8 h-8 text-[#2bb75c]" /> : <ToggleLeft className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />}
              </button>
            </div>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed">
              Allow clients to place orders instantly without prior messaging. Disabling this requires clients to request a quote first.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}

