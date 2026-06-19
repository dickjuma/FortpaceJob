import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Check, ChevronRight, 
  ChevronLeft, Briefcase, Globe, Zap, Sun, Moon
} from 'lucide-react';
import { cn } from '../../../admin/utils/cn';
import { loadOnboardingDraft, saveOnboardingDraft } from '../utils/onboardingDraft';

const STEPS = ['Account', 'Role', 'Skills', 'Experience', 'Availability', 'Done'];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening', 'Night'];

export default function AvailabilitySetupPage() {
  const navigate = useNavigate();
  const onboardingDraft = loadOnboardingDraft();
  const [commitment, setCommitment] = useState(onboardingDraft.commitment || 'full-time');
  const [hours, setHours] = useState(onboardingDraft.hours || 40);
  const [workType, setWorkType] = useState(onboardingDraft.workType || 'remote');
  const [instantAvailable, setInstantAvailable] = useState(
    typeof onboardingDraft.instantAvailable === 'boolean' ? onboardingDraft.instantAvailable : true
  );
  const timezone = onboardingDraft.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  
  // Grid state: day -> array of selected timeslots
  const [schedule, setSchedule] = useState({
    Mon: ['Morning', 'Afternoon'],
    Tue: ['Morning', 'Afternoon'],
    Wed: ['Morning', 'Afternoon'],
    Thu: ['Morning', 'Afternoon'],
    Fri: ['Morning'],
    Sat: [],
    Sun: [],
  });

  useEffect(() => {
    if (onboardingDraft.schedule) {
      setSchedule(onboardingDraft.schedule);
    }
  }, []);

  useEffect(() => {
    saveOnboardingDraft({
      commitment,
      hours: Number(hours),
      workType,
      instantAvailable,
      schedule,
      timezone,
    });
  }, [commitment, hours, instantAvailable, schedule, timezone, workType]);

  const toggleSchedule = (day, slot) => {
    setSchedule(prev => {
      const daySlots = prev[day];
      if (daySlots.includes(slot)) {
        return { ...prev, [day]: daySlots.filter(s => s !== slot) };
      } else {
        return { ...prev, [day]: [...daySlots, slot] };
      }
    });
  };

  const getSlotIcon = (slot) => {
    switch(slot) {
      case 'Morning': return <Sun className="w-3 h-3" />;
      case 'Afternoon': return <Globe className="w-3 h-3" />;
      case 'Evening': return <Moon className="w-3 h-3" />;
      case 'Night': return <Moon className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans selection:bg-[#4C1D95]/30 overflow-x-hidden">
      
      {/* Background Gradients */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-success/5 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#4C1D95]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen pb-24">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#4C1D95] rounded-xl flex items-center justify-center shadow-lg shadow-[#4C1D95]/25/30">
              <Calendar className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">ForteSpace</span>
          </motion.div>
        </div>

        {/* Progress Stepper */}
        <div className="w-full max-w-4xl mx-auto px-4 mb-8">
          <div className="flex items-center justify-center gap-0">
            {STEPS.map((step, idx) => {
              const isCompleted = idx < 4;
              const isCurrent = idx === 4;
              const isLast = idx === STEPS.length - 1;
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-1">
                    <motion.div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
                        isCompleted ? "bg-[#4C1D95] text-white" : isCurrent ? "bg-[#4C1D95] text-white ring-4 ring-#4C1D95]/20 scale-110" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                      )}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                    </motion.div>
                    <span className={cn("text-[10px] font-bold uppercase tracking-wide hidden sm:block", isCurrent ? "text-[#4C1D95]" : isCompleted ? "text-zinc-500" : "text-zinc-400")}>
                      {step}
                    </span>
                  </div>
                  {!isLast && <div className={cn("h-[2px] w-4 sm:w-10 mx-1 rounded-full", isCompleted ? "bg-[#4C1D95]" : "bg-zinc-200 dark:bg-zinc-800")} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
              Set your <span className="bg-gradient-to-r from-emerald-500 to-[#22C55E] bg-clip-text text-transparent">availability</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
              Let clients know when you're working. You can easily adjust your hours or pause your profile at any time.
            </p>
          </div>

          <div className="space-y-8">
            
            {/* Commitment Type */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">How much time can you commit?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'full-time', label: 'Full-time', desc: '40+ hrs/week', icon: Briefcase },
                  { id: 'part-time', label: 'Part-time', desc: '10-30 hrs/week', icon: Clock },
                  { id: 'project', label: 'Project Based', desc: 'As needed', icon: Zap }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setCommitment(type.id)}
                    className={cn(
                      "flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all",
                      commitment === type.id 
                        ? "border-[#4C1D95]/20 bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10 text-[#4C1D95] dark:text-[#4C1D95]" 
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 hover:bg-surface dark:hover:bg-zinc-800/50"
                    )}
                  >
                    <type.icon className={cn("w-6 h-6 mb-2", commitment === type.id ? "text-[#4C1D95]" : "text-zinc-400")} />
                    <span className="text-sm font-bold">{type.label}</span>
                    <span className="text-[10px] font-medium mt-1 opacity-80">{type.desc}</span>
                  </button>
                ))}
              </div>

              {/* Hours Slider (Only for part/full time) */}
              {commitment !== 'project' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Target Hours / Week</span>
                    <span className="text-lg font-black text-[#4C1D95]">{hours} hrs</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" max="60" 
                    value={hours} 
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-zinc-400 mt-2">
                    <span>1 hr</span>
                    <span>60+ hrs</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Work Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Location Type */}
              <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Work Preference</h3>
                </div>
                <div className="space-y-2">
                  {['remote', 'onsite', 'hybrid'].map((type) => (
                    <label key={type} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-surface dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
                      <input 
                        type="radio" 
                        name="workType"
                        checked={workType === type}
                        onChange={() => setWorkType(type)}
                        className="w-4 h-4 text-[#4C1D95] border-zinc-300 focus:ring-[#4C1D95]"
                      />
                      <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 capitalize">{type} Work</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Instant Match Toggle */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                  <h3 className="text-lg font-bold">Instant Match</h3>
                </div>
                <p className="text-sm text-emerald-100 mb-6 relative z-10 leading-relaxed">
                  Turn this on to appear in "Available Now" searches. Perfect for quick tasks and urgent projects.
                </p>
                <button 
                  onClick={() => setInstantAvailable(!instantAvailable)}
                  className={cn(
                    "relative z-10 w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
                    instantAvailable ? "bg-white text-emerald-700 shadow-md" : "bg-emerald-700/50 text-emerald-100 border border-emerald-400/30 hover:bg-emerald-700"
                  )}
                >
                  {instantAvailable ? <><Check className="w-4 h-4" /> Available Now</> : "Turn On"}
                </button>
              </div>
            </div>

            {/* Weekly Schedule Grid */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Standard Schedule</h3>
                  <p className="text-xs text-zinc-500">Click slots to toggle your general working hours.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg">
                    <Globe className="w-3 h-3" /> Timezone: {timezone}
                </div>
              </div>

              <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
                <div className="min-w-[500px]">
                  {/* Grid Header */}
                  <div className="grid grid-cols-8 gap-2 mb-2">
                    <div className="col-span-1"></div>
                    {DAYS.map(day => (
                      <div key={day} className="col-span-1 text-center text-xs font-bold text-zinc-400 uppercase tracking-wider py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Grid Rows */}
                  {TIME_SLOTS.map(slot => (
                    <div key={slot} className="grid grid-cols-8 gap-2 mb-2">
                      <div className="col-span-1 flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider py-2">
                        {getSlotIcon(slot)} {slot}
                      </div>
                      {DAYS.map(day => {
                        const isSelected = schedule[day].includes(slot);
                        return (
                          <button
                            key={`${day}-${slot}`}
                            onClick={() => toggleSchedule(day, slot)}
                            className={cn(
                              "col-span-1 h-10 rounded-lg border transition-all duration-200",
                              isSelected 
                                ? "bg-[#4C1D95] border-[#4C1D95]/20 shadow-sm shadow-[#4C1D95]/25/20" 
                                : "bg-surface dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-700/50 hover:border-[#4C1D95]/50 dark:hover:border-[#4C1D95]/50"
                            )}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#4C1D95]" /> <span className="text-zinc-500 font-medium">Available</span>
                  <div className="w-3 h-3 rounded bg-zinc-100 dark:bg-zinc-800 ml-3" /> <span className="text-zinc-500 font-medium">Offline</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSchedule(Object.fromEntries(DAYS.map((day) => [day, []])))}
                  className="text-[#4C1D95] font-bold hover:text-[#4C1D95]"
                >
                  Clear All
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md z-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button 
              onClick={() => navigate('/auth/rate-setup')}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#4C1D95] hover:bg-[#22C55E] text-white text-sm font-bold rounded-xl shadow-sm transition-all"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}


