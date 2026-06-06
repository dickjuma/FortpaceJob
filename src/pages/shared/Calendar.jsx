import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Plus, Video, Clock, Flag, Briefcase, MoreHorizontal,
  CheckCircle2
} from 'lucide-react';

// Mock Event Data
const mockEvents = [
  { id: 1, title: 'UX Review Sync', type: 'Meeting', time: '10:00 AM', duration: 1, day: 15, color: 'bg-[#4C1D95]' },
  { id: 2, title: 'Phase 1 Delivery', type: 'Milestone', time: '5:00 PM', duration: 1, day: 15, color: 'bg-green-500' },
  { id: 3, title: 'Interview: Frontend Dev', type: 'Interview', time: '2:30 PM', duration: 1, day: 16, color: 'bg-[#4C1D95]' },
  { id: 4, title: 'Project Proposal Due', type: 'Deadline', time: '11:59 PM', duration: 1, day: 18, color: 'bg-red-500' },
  { id: 5, title: 'Weekly Standup', type: 'Meeting', time: '9:00 AM', duration: 1, day: 19, color: 'bg-[#4C1D95]' },
];

const Calendar = () => {
  const [view, setView] = useState('Month');
  const [currentMonth, setCurrentMonth] = useState('October 2026');
  
  // Generating a 35-day grid for a mock month view
  const daysInMonth = Array.from({ length: 35 }, (_, i) => i - 2); 
  // (-2 to 0 for previous month padding, 1-31 for current month, 32+ for next month padding)

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 h-[calc(100vh-80px)] flex flex-col">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#4C1D95] flex items-center justify-center shadow-lg shadow-#4C1D95]/20 text-white shrink-0">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {currentMonth}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Marketplace Schedule & Milestones</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            {['Month', 'Week', 'Day'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${
                  view === v 
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-1">
            <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg text-zinc-500 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="px-3 py-1.5 text-sm font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors">
              Today
            </button>
            <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg text-zinc-500 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button className="bg-[#4C1D95] hover:bg-[#22C55E] text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-#4C1D95]/20 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Event
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Left Sidebar: Mini Calendar & Filters */}
        <div className="hidden lg:flex w-64 shrink-0 flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
          
          <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-5 shadow-sm">
            <button className="w-full mb-4 px-4 py-2 bg-zinc-100 dark:bg-surface-dark text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-bold flex justify-between items-center">
              Create <ChevronDown className="w-4 h-4" />
            </button>
            
            <h3 className="font-bold text-sm mb-3 text-zinc-900 dark:text-white">My Calendars</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#4C1D95] rounded border-zinc-300 focus:ring-[#4C1D95]" />
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Meeting & Interviews</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-green-600 rounded border-zinc-300 focus:ring-green-500" />
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Milestones</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-red-600 rounded border-zinc-300 focus:ring-red-500" />
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Deadlines</span>
              </label>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#4C1D95] to-blue-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -tranzinc-y-1/2 tranzinc-x-1/2 pointer-events-none" />
             <h3 className="font-bold text-sm mb-2 flex items-center gap-2 relative z-10">
               <Video className="w-4 h-4 text-[#4C1D95]" /> Next Meeting
             </h3>
             <div className="relative z-10">
               <p className="font-extrabold text-lg leading-tight mb-1">UX Review Sync</p>
               <p className="text-[#4C1D95] text-xs font-medium mb-4">Starts in 15 mins</p>
               <button className="w-full py-2 bg-white/20 hover:bg-white/30 border border-white/20 rounded-lg text-sm font-bold backdrop-blur-sm transition-colors">
                 Join Call
               </button>
             </div>
          </div>

        </div>

        {/* Main Calendar Grid */}
        <div className="flex-1 bg-white dark:bg-zinc-800 rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden flex flex-col">
          
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-700 bg-surface dark:bg-surface-dark/50 shrink-0">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-zinc-500 border-r border-zinc-200 dark:border-zinc-700 last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-hidden bg-zinc-100 dark:bg-zinc-700/30 gap-[1px]">
            {daysInMonth.map((dayNum, index) => {
              const isCurrentMonth = dayNum > 0 && dayNum <= 31;
              const isToday = dayNum === 15;
              const dayEvents = mockEvents.filter(e => e.day === dayNum);

              return (
                <div 
                  key={index} 
                  className={`bg-white dark:bg-zinc-800 p-2 flex flex-col transition-colors group cursor-crosshair hover:bg-[#4C1D95]/5/30 dark:hover:bg-zinc-700/50 ${!isCurrentMonth ? 'opacity-40 bg-surface dark:bg-surface-dark' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${isToday ? 'bg-[#4C1D95] text-white shadow-md' : 'text-zinc-700 dark:text-zinc-300 group-hover:text-[#4C1D95]'}`}>
                      {dayNum > 0 && dayNum <= 31 ? dayNum : dayNum <= 0 ? 30 + dayNum : dayNum - 31}
                    </span>
                  </div>

                  {/* Events Container */}
                  <div className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-1">
                    {dayEvents.map(event => (
                      <motion.div 
                        key={event.id}
                        whileHover={{ scale: 1.02 }}
                        className={`${event.color} text-white px-2 py-1 rounded text-xs font-semibold shadow-sm cursor-grab active:cursor-grabbing truncate`}
                        title={event.title}
                      >
                        {event.time} {event.title}
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
};

// Inline ChevronDown component just for the sidebar create button since it wasn't imported globally if missed.
function ChevronDown(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}

export default Calendar;


