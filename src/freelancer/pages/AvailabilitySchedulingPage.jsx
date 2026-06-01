import React, { useState } from 'react';
import { 
  Calendar, MapPin, Clock, Globe, Save, Check, Plus, Trash2, CalendarDays
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

export default function AvailabilitySchedulingPage() {
  const [capacity, setCapacity] = useState('full_time');
  const [timezone, setTimezone] = useState('Pacific Time (PT) - US & Canada');
  const [workDays, setWorkDays] = useState({
    monday: { active: true, start: '09:00', end: '17:00' },
    tuesday: { active: true, start: '09:00', end: '17:00' },
    wednesday: { active: true, start: '09:00', end: '17:00' },
    thursday: { active: true, start: '09:00', end: '17:00' },
    friday: { active: true, start: '09:00', end: '17:00' },
    saturday: { active: false, start: '10:00', end: '14:00' },
    sunday: { active: false, start: '10:00', end: '14:00' }
  });

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
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: 'Updating scheduling metadata...',
        success: 'Availability calendar preferences saved successfully! 📅',
        error: 'Failed to update.'
      }
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-6 mb-8">
        <div className="p-2.5 bg-success/20 text-success rounded-xl shadow-sm border border-success/20">
          <CalendarDays className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Availability & Scheduling</h1>
          <p className="text-sm text-text-secondary font-medium mt-1">
            Setup time blocks, work capacity limitations, and timezone availability.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Settings panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Capacity */}
          <Card className="p-6 border border-border bg-white rounded-3xl shadow-sm">
            <div className="flex items-center mb-6">
              <Calendar className="w-5 h-5 text-success mr-2" />
              <h2 className="text-lg font-bold text-text-primary">Weekly Capacity</h2>
            </div>
            <div className="space-y-4">
              <label 
                className={cn(
                  "flex items-start p-4 border rounded-2xl cursor-pointer transition-all",
                  capacity === 'full_time' ? "border-success bg-success/5" : "border-border hover:bg-light-gray"
                )}
                onClick={() => setCapacity('full_time')}
              >
                <input 
                  type="radio" 
                  name="capacity" 
                  checked={capacity === 'full_time'} 
                  onChange={() => setCapacity('full_time')} 
                  className="h-4 w-4 mt-1 text-success focus:ring-success" 
                />
                <div className="ml-3">
                  <span className="block text-sm font-bold text-text-primary">Full-time (30+ hrs/week)</span>
                  <span className="block text-xs text-text-secondary mt-1">Open to long term contract-to-hire or fractional roles.</span>
                </div>
              </label>

              <label 
                className={cn(
                  "flex items-start p-4 border rounded-2xl cursor-pointer transition-all",
                  capacity === 'part_time' ? "border-success bg-success/5" : "border-border hover:bg-light-gray"
                )}
                onClick={() => setCapacity('part_time')}
              >
                <input 
                  type="radio" 
                  name="capacity" 
                  checked={capacity === 'part_time'} 
                  onChange={() => setCapacity('part_time')} 
                  className="h-4 w-4 mt-1 text-success focus:ring-success" 
                />
                <div className="ml-3">
                  <span className="block text-sm font-bold text-text-primary">Part-time (Less than 30 hrs/week)</span>
                  <span className="block text-xs text-text-secondary mt-1">Best suited for small projects or fractional consultation gigs.</span>
                </div>
              </label>

              <label 
                className={cn(
                  "flex items-start p-4 border rounded-2xl cursor-pointer transition-all",
                  capacity === 'unavailable' ? "border-success bg-success/5" : "border-border hover:bg-light-gray"
                )}
                onClick={() => setCapacity('unavailable')}
              >
                <input 
                  type="radio" 
                  name="capacity" 
                  checked={capacity === 'unavailable'} 
                  onChange={() => setCapacity('unavailable')} 
                  className="h-4 w-4 mt-1 text-success focus:ring-success" 
                />
                <div className="ml-3">
                  <span className="block text-sm font-bold text-text-primary">Not available for new work</span>
                  <span className="block text-xs text-text-secondary mt-1">Temporarily pause discovery visibility for your services.</span>
                </div>
              </label>
            </div>
          </Card>

          {/* Timezone and standard hours */}
          <Card className="p-6 border border-border bg-white rounded-3xl shadow-sm">
            <div className="flex items-center mb-6">
              <Clock className="w-5 h-5 text-success mr-2" />
              <h2 className="text-lg font-bold text-text-primary">Working Days & Standard Hours</h2>
            </div>
            
            <div className="space-y-4">
              {Object.entries(workDays).map(([day, config]) => (
                <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-xl hover:bg-light-gray/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={config.active}
                      onChange={() => handleDayToggle(day)}
                      className="w-4 h-4 rounded text-success focus:ring-success" 
                    />
                    <span className="text-sm font-bold text-text-primary capitalize min-w-[90px]">{day}</span>
                  </div>

                  {config.active ? (
                    <div className="flex items-center space-x-2">
                      <input 
                        type="time" 
                        value={config.start} 
                        onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                        className="rounded-xl border border-border bg-white px-3 py-1.5 text-xs text-text-primary outline-none focus:border-success" 
                      />
                      <span className="text-text-secondary text-xs font-bold">to</span>
                      <input 
                        type="time" 
                        value={config.end} 
                        onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                        className="rounded-xl border border-border bg-white px-3 py-1.5 text-xs text-text-primary outline-none focus:border-success" 
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-text-secondary font-semibold italic">Unavailable / Closed</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Global Configuration Side Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 border border-border bg-white rounded-3xl shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-text-primary text-sm flex items-center gap-1.5 mb-2">
                <Globe className="w-4 h-4 text-success" /> Global Timezone
              </h3>
              <select 
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full text-xs font-semibold text-text-primary border border-border rounded-xl px-3 py-2 bg-light-gray focus:bg-white focus:border-success outline-none"
              >
                <option>Pacific Time (PT) - US & Canada</option>
                <option>Eastern Time (ET) - US & Canada</option>
                <option>Central European Time (CET)</option>
                <option>East African Time (EAT)</option>
              </select>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-bold text-text-primary text-sm flex items-center gap-1.5 mb-2">
                <MapPin className="w-4 h-4 text-success" /> Work Modes
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-success" />
                  <span>Accept Remote Contracts</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-success" />
                  <span>Accept Local Onsite Bookings</span>
                </label>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <Button 
                variant="primary" 
                onClick={handleSave} 
                className="w-full py-3 bg-success hover:bg-success/95 font-bold rounded-2xl flex items-center justify-center gap-2"
                icon={<Save size={16} />}
              >
                Save Preferences
              </Button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
