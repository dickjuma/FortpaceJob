import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Video, Clock, Star, 
  FileText, Link as LinkIcon, Plus, ChevronLeft, 
  ChevronRight, PlayCircle, MessageSquare
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

// Mock Data
const INTERVIEWS = [
  {
    id: 'INT-01',
    freelancer: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=s1' },
    role: 'Senior React Developer',
    date: 'Today, 2:00 PM (PST)',
    duration: '45 min',
    link: 'https://zoom.us/j/123456789',
    status: 'Upcoming',
    score: null
  },
  {
    id: 'INT-02',
    freelancer: { name: 'David Kim', avatar: 'https://i.pravatar.cc/150?u=d2' },
    role: 'UI/UX Designer',
    date: 'May 22, 10:00 AM (PST)',
    duration: '30 min',
    link: 'https://meet.google.com/abc-defg-hij',
    status: 'Scheduled',
    score: null
  },
  {
    id: 'INT-03',
    freelancer: { name: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?u=a3' },
    role: 'Backend Engineer',
    date: 'May 18, 1:00 PM (PST)',
    duration: '60 min',
    link: null,
    status: 'Completed',
    score: 4.8,
    recording: true,
    notes: 'Very strong technical skills. Answered system design questions perfectly. High recommend.'
  }
];

export default function ClientInterviewManagementPage() {
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, completed
  const [selectedInterview, setSelectedInterview] = useState(INTERVIEWS[0]);

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
              <Video className="w-8 h-8 text-brand-500" /> Interviews
            </h1>
            <p className="text-zinc-500 font-medium">Schedule, conduct, and review freelancer interviews.</p>
          </div>
          <button className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" /> Schedule New Interview
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: List */}
        <div className="w-full lg:w-96 shrink-0 space-y-6">
          
          <div className="flex bg-zinc-200 dark:bg-zinc-800 p-1 rounded-xl w-full">
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'upcoming' ? "bg-white dark:bg-surface-dark text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
            >
              Upcoming (2)
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'completed' ? "bg-white dark:bg-surface-dark text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
            >
              Completed (1)
            </button>
          </div>

          {/* Mini Calendar */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-zinc-900 dark:text-white">May 2026</h3>
              <div className="flex gap-2">
                <button className="p-1 text-zinc-400 hover:text-brand-500"><ChevronLeft className="w-5 h-5" /></button>
                <button className="p-1 text-zinc-400 hover:text-brand-500"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-[10px] font-bold text-zinc-400 mb-2">{d}</div>)}
              {Array.from({length: 31}).map((_, i) => (
                <div key={i} className={cn(
                  "w-8 h-8 mx-auto flex items-center justify-center rounded-full text-xs font-bold cursor-pointer transition-colors",
                  i+1 === 21 ? "bg-brand-500 text-white shadow-sm" : 
                  (i+1 === 22 || i+1 === 18) ? "bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400" :
                  "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                )}>
                  {i+1}
                </div>
              ))}
            </div>
          </div>

          {/* Interview Cards */}
          <div className="space-y-4">
            {INTERVIEWS.filter(i => activeTab === 'upcoming' ? i.status !== 'Completed' : i.status === 'Completed').map(interview => (
              <div 
                key={interview.id}
                onClick={() => setSelectedInterview(interview)}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer flex gap-4",
                  selectedInterview.id === interview.id ? "bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800" : "bg-white dark:bg-surface-dark border-zinc-200 dark:border-zinc-800 hover:border-brand-200"
                )}
              >
                <img src={interview.freelancer.avatar} alt="Avatar" className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm">{interview.freelancer.name}</h4>
                  <p className="text-xs text-zinc-500 font-medium mb-2">{interview.role}</p>
                  <p className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-500" /> {interview.date}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Detail & Scorecard */}
        <div className="flex-1 space-y-6">
          <AnimatePresence mode="wait">
            {selectedInterview && (
              <motion.div 
                key={selectedInterview.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                
                {/* Main Detail Card */}
                <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                  
                  <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-start bg-surface/50 dark:bg-surface-dark/50">
                    <div className="flex items-center gap-4">
                      <img src={selectedInterview.freelancer.avatar} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-white dark:border-zinc-800 shadow-sm" />
                      <div>
                        <h2 className="text-2xl font-black text-zinc-900 dark:text-white">{selectedInterview.freelancer.name}</h2>
                        <p className="text-sm font-bold text-brand-600 dark:text-brand-400">{selectedInterview.role}</p>
                      </div>
                    </div>
                    {selectedInterview.status === 'Completed' ? (
                      <div className="text-center">
                        <div className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-1"><Star className="w-6 h-6 text-amber-400 fill-amber-400" /> {selectedInterview.score}</div>
                        <p className="text-xs font-bold text-zinc-400 uppercase">Final Score</p>
                      </div>
                    ) : (
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 text-xs font-bold rounded-full uppercase tracking-wider">
                        {selectedInterview.status}
                      </span>
                    )}
                  </div>

                  <div className="p-8">
                    <div className="flex flex-wrap gap-6 mb-8">
                      <div>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Time</p>
                        <p className="text-sm font-black text-zinc-900 dark:text-white">{selectedInterview.date}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Duration</p>
                        <p className="text-sm font-black text-zinc-900 dark:text-white">{selectedInterview.duration}</p>
                      </div>
                      {selectedInterview.link && (
                        <div>
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Meeting Link</p>
                          <a href={selectedInterview.link} className="text-sm font-bold text-brand-600 hover:underline flex items-center gap-1">
                            <Video className="w-4 h-4" /> Join Zoom Call
                          </a>
                        </div>
                      )}
                    </div>

                    {selectedInterview.status !== 'Completed' ? (
                      <div className="bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-900/30 rounded-2xl p-6 text-center">
                        <Video className="w-12 h-12 text-brand-500 mx-auto mb-4 opacity-50" />
                        <h3 className="font-bold text-brand-900 dark:text-brand-400 mb-2">Ready for the interview?</h3>
                        <p className="text-sm text-brand-700/80 dark:text-brand-400/80 mb-6">Join the meeting room. You can take notes and score the candidate here during the call.</p>
                        <button className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition-all">
                          Join Meeting
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Recording */}
                        {selectedInterview.recording && (
                          <div className="bg-surface-dark rounded-2xl aspect-video relative overflow-hidden group border border-zinc-800">
                            <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80" alt="Video" className="w-full h-full object-cover opacity-50" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer" />
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-xs font-bold text-white flex justify-between">
                              <span>Interview Recording</span>
                              <span>42:15</span>
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-6">
                          <h3 className="text-sm font-bold text-amber-900 dark:text-amber-500 flex items-center gap-2 mb-3">
                            <FileText className="w-4 h-4" /> Interview Notes
                          </h3>
                          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 italic whitespace-pre-wrap">
                            {selectedInterview.notes}
                          </p>
                        </div>

                      </div>
                    )}

                  </div>
                </div>

                {/* Candidate Scorecard */}
                {selectedInterview.status !== 'Completed' && (
                  <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-8">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Candidate Scorecard</h3>
                    
                    <div className="space-y-6">
                      {['Technical Skills', 'Communication', 'Problem Solving', 'Culture Fit'].map(skill => (
                        <div key={skill}>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{skill}</label>
                            <span className="text-sm font-black text-zinc-400">0 / 5</span>
                          </div>
                          <div className="flex gap-2">
                            {[1,2,3,4,5].map(num => (
                              <button key={num} className="flex-1 py-2 rounded-lg bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-sm font-bold text-zinc-500 transition-colors">
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div>
                        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2 block">Private Notes</label>
                        <textarea rows={4} placeholder="Jot down thoughts during the interview..." className="w-full bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-brand-500 resize-none" />
                      </div>

                      <div className="flex justify-end pt-4">
                        <button className="px-6 py-3 bg-surface-dark dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl shadow-sm transition-all">
                          Save Scorecard
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
