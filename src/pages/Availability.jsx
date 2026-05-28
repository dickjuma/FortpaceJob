import React from 'react';
import { Calendar, Clock, Globe, Coffee, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const Availability = () => {
  return (
    <>
      <div className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4 md:px-8 py-10">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Sarah's Availability</h1>
          <p className="text-zinc-600">View working hours and schedule a consultation or kick-off meeting.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          
          {/* Calendar Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80" alt="Sarah" className="w-16 h-16 rounded-full" />
                <div>
                  <h3 className="font-bold text-zinc-900">Sarah Jenkins</h3>
                  <p className="text-sm text-zinc-500">30 Min Consultation</p>
                </div>
              </div>
              
              <div className="space-y-4 text-sm text-zinc-600">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-zinc-400" />
                  <span>30 minutes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-zinc-400" />
                  <span>Pacific Time (US & Canada)</span>
                </div>
              </div>
            </div>

            <div className="bg-brand-50 rounded-2xl p-6 border border-brand-100">
              <h4 className="font-bold text-brand-900 mb-2">Current Status</h4>
              <div className="flex items-center gap-2 text-brand-800 font-medium mb-4">
                <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse"></div>
                Taking new clients
              </div>
              <p className="text-sm text-brand-700">Sarah has capacity for ~20 hrs/week starting next Monday.</p>
            </div>
            
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-start gap-3">
              <Coffee className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 mb-1">Upcoming Vacation</h4>
                <p className="text-sm text-amber-800">Sarah will be unavailable from Oct 10th to Oct 15th.</p>
              </div>
            </div>
          </div>

          {/* Main Calendar View */}
          <div className="flex-1 bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <h2 className="text-xl font-bold text-zinc-900">October 2023</h2>
              <div className="flex gap-2">
                <button className="p-2 border border-zinc-200 rounded-lg hover:bg-surface text-zinc-500">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-2 border border-zinc-200 rounded-lg hover:bg-surface text-zinc-500">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 border-b border-zinc-100 text-center text-sm font-semibold text-zinc-500 bg-surface">
              <div className="py-3">Sun</div><div className="py-3">Mon</div><div className="py-3">Tue</div>
              <div className="py-3">Wed</div><div className="py-3">Thu</div><div className="py-3">Fri</div><div className="py-3">Sat</div>
            </div>
            
            {/* Mock Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-zinc-100 text-center text-sm">
              {[...Array(35)].map((_, i) => {
                const day = i - 1; // offset for mock
                const isCurrentMonth = day > 0 && day <= 31;
                const isVacation = day >= 10 && day <= 15;
                const isToday = day === 5;
                const hasSlots = [2, 4, 6, 9, 16, 18, 20].includes(day);

                return (
                  <div key={i} className={`h-24 p-2 flex flex-col ${isCurrentMonth ? 'bg-white hover:bg-surface' : 'bg-surface text-zinc-300'} ${isVacation ? 'bg-amber-50/50' : ''} transition-colors cursor-pointer relative`}>
                    <span className={`font-medium w-7 h-7 flex items-center justify-center rounded-full mx-auto ${isToday ? 'bg-brand-600 text-white' : ''}`}>
                      {isCurrentMonth ? day : ''}
                    </span>
                    
                    {hasSlots && isCurrentMonth && (
                      <div className="mt-auto">
                        <div className="text-xs font-bold text-success bg-emerald-50 py-1 rounded">3 Slots</div>
                      </div>
                    )}
                    {isVacation && (
                      <div className="absolute inset-0 bg-stripes-amber opacity-10"></div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="p-6 bg-surface border-t border-zinc-100 flex justify-between items-center">
              <div className="text-sm text-zinc-500 flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-100 border border-emerald-300 rounded-full"></div> Available
                <div className="w-3 h-3 bg-amber-100 border border-amber-300 rounded-full ml-4"></div> Vacation/Busy
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Availability;
