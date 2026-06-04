import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Video, Clock, Star, 
  FileText, Link as LinkIcon, Plus, ChevronLeft, 
  ChevronRight, PlayCircle, MessageSquare, X, Check
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { cn } from '../../admin/utils/cn';
import { 
  useInterviews, 
  useScheduleInterview, 
  useMyProposals 
} from '../services/clientHooks';

export default function ClientInterviewManagementPage() {
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, completed
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Fetch interviews from backend
  const { data: pagedData, isLoading: interviewsLoading } = useInterviews();
  const interviews = pagedData?.items || [];

  // Mutations
  const scheduleMutation = useScheduleInterview();
  const { data: proposalsData } = useMyProposals();

  // Extract unique candidates from proposals to populate the schedule dropdown
  const candidates = (proposalsData || [])
    .map(p => {
      const user = p.freelancer?.user || p.user || {};
      return {
        id: user.id || p.freelancerId,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || `Freelancer #${user.id || p.freelancerId}`,
      };
    })
    .filter((c, idx, self) => c.id && self.findIndex(s => s.id === c.id) === idx);

  // Form states for scheduling
  const [selectedFreelancerId, setSelectedFreelancerId] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [duration, setDuration] = useState('45');
  const [interviewType, setInterviewType] = useState('Technical Interview');
  const [meetingLink, setMeetingLink] = useState('');

  // Segregate upcoming vs completed
  const upcomingInterviews = interviews.filter(i => i.status === 'Upcoming' || i.status === 'Scheduled');
  const completedInterviews = interviews.filter(i => i.status === 'Completed');
  const activeList = activeTab === 'upcoming' ? upcomingInterviews : completedInterviews;

  // Auto-select first item when list loads
  useEffect(() => {
    if (activeList.length > 0) {
      setSelectedInterview(activeList[0]);
    } else {
      setSelectedInterview(null);
    }
  }, [activeTab, interviews]);

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFreelancerId) {
      toast.error('Please select a freelancer');
      return;
    }
    if (!interviewDate) {
      toast.error('Please select a date and time');
      return;
    }

    try {
      await scheduleMutation.mutateAsync({
        freelancerId: selectedFreelancerId,
        date: new Date(interviewDate).toISOString(),
        duration: parseInt(duration),
        type: interviewType,
        meetingLink: meetingLink.trim() || 'https://zoom.us/j/' + Math.floor(100000000 + Math.random() * 900000000)
      });
      
      setShowScheduleModal(false);
      setSelectedFreelancerId('');
      setInterviewDate('');
      setMeetingLink('');
      toast.success('Interview scheduled successfully!');
    } catch (error) {
      // Error is already toasted by hook
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-24">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
        }} 
      />
      
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 pt-24 pb-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
              <Video className="w-8 h-8 text-success" /> Interviews
            </h1>
            <p className="text-zinc-400 text-sm">Schedule consultations, view technical reviews, and grade candidates.</p>
          </div>
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="px-6 py-3 bg-success hover:bg-success text-white font-bold rounded-xl shadow-lg shadow-[#2bb75c]/10 transition-all flex items-center gap-2"
          >
            <CalendarIcon className="w-5 h-5" /> Schedule New Interview
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: List */}
        <div className="w-full lg:w-96 shrink-0 space-y-6">
          
          <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl w-full">
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-bold transition-all", 
                activeTab === 'upcoming' 
                  ? "bg-success/10 text-success border border-success/20 shadow-sm" 
                  : "text-zinc-400 hover:text-white"
              )}
            >
              Upcoming ({upcomingInterviews.length})
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-bold transition-all", 
                activeTab === 'completed' 
                  ? "bg-success/10 text-success border border-success/20 shadow-sm" 
                  : "text-zinc-400 hover:text-white"
              )}
            >
              Completed ({completedInterviews.length})
            </button>
          </div>

          {/* Mini Calendar Widget */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-white">May 2026</h3>
              <div className="flex gap-2">
                <button className="p-1 text-zinc-500 hover:text-success"><ChevronLeft className="w-5 h-5" /></button>
                <button className="p-1 text-zinc-500 hover:text-success"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-[10px] font-black text-zinc-500 mb-2">{d}</div>)}
              {Array.from({length: 31}).map((_, i) => (
                <div key={i} className={cn(
                  "w-8 h-8 mx-auto flex items-center justify-center rounded-full text-xs font-bold transition-colors",
                  i+1 === 30 ? "bg-success text-white shadow-lg shadow-[#2bb75c]/20" : "text-zinc-400 hover:bg-zinc-800"
                )}>
                  {i+1}
                </div>
              ))}
            </div>
          </div>

          {/* Interview Cards */}
          <div className="space-y-4">
            {interviewsLoading ? (
              <div className="p-8 text-center text-zinc-500 font-bold">Loading interviews...</div>
            ) : activeList.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 font-bold">
                No {activeTab} interviews scheduled.
              </div>
            ) : (
              activeList.map(interview => (
                <div 
                  key={interview.id}
                  onClick={() => setSelectedInterview(interview)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 bg-zinc-900",
                    selectedInterview?.id === interview.id 
                      ? "border-success bg-success/5 shadow-lg shadow-[#2bb75c]/5" 
                      : "border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  <img src={interview.freelancer?.avatar || 'https://i.pravatar.cc/150'} alt="Avatar" className="w-12 h-12 rounded-full border border-zinc-800 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm truncate">{interview.freelancer?.name}</h4>
                    <p className="text-xs text-zinc-500 font-medium truncate mb-2">{interview.role}</p>
                    <p className="text-[10px] font-bold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-success" /> {interview.date}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Right Column: Detail & Scorecard */}
        <div className="flex-1 space-y-6">
          <AnimatePresence mode="wait">
            {selectedInterview ? (
              <motion.div 
                key={selectedInterview.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                
                {/* Main Detail Card */}
                <div className="bg-zinc-900 rounded-3xl border border-zinc-800 shadow-xl overflow-hidden">
                  
                  <div className="p-8 border-b border-zinc-800 flex justify-between items-start bg-zinc-950/50">
                    <div className="flex items-center gap-4">
                      <img src={selectedInterview.freelancer?.avatar || 'https://i.pravatar.cc/150'} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-zinc-900 shadow-xl" />
                      <div>
                        <h2 className="text-2xl font-black text-white">{selectedInterview.freelancer?.name}</h2>
                        <p className="text-sm font-bold text-success">{selectedInterview.role}</p>
                      </div>
                    </div>
                    {selectedInterview.status === 'Completed' ? (
                      <div className="text-center">
                        <div className="text-3xl font-black text-white flex items-center gap-1">
                          <Star className="w-6 h-6 text-amber-400 fill-amber-400" /> {selectedInterview.score || '4.8'}
                        </div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Final Score</p>
                      </div>
                    ) : (
                      <span className="px-3 py-1.5 bg-success/10 border border-success/20 text-success text-[10px] font-black rounded-full uppercase tracking-wider">
                        {selectedInterview.status}
                      </span>
                    )}
                  </div>

                  <div className="p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 border-b border-zinc-800 pb-8">
                      <div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Scheduled Time</p>
                        <p className="text-sm font-bold text-white">{selectedInterview.date}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Duration</p>
                        <p className="text-sm font-bold text-white">{selectedInterview.duration}</p>
                      </div>
                      {selectedInterview.link && (
                        <div>
                          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Meeting Link</p>
                          <a href={selectedInterview.link} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-success hover:underline flex items-center gap-1">
                            <Video className="w-4 h-4 text-success" /> Open Zoom Meeting
                          </a>
                        </div>
                      )}
                    </div>

                    {selectedInterview.status !== 'Completed' ? (
                      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-center">
                        <Video className="w-12 h-12 text-success mx-auto mb-4 opacity-50" />
                        <h3 className="font-bold text-white mb-2">Ready for the consultation?</h3>
                        <p className="text-xs text-zinc-400 mb-6">Join the meeting room below. During the call, you can rate technical proficiency and draft private notes here.</p>
                        <a 
                          href={selectedInterview.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block px-8 py-3 bg-success hover:bg-success text-white font-bold rounded-xl shadow-lg shadow-[#2bb75c]/10 transition-all"
                        >
                          Join Meeting
                        </a>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Recording mockup */}
                        <div className="bg-zinc-950 rounded-2xl aspect-video relative overflow-hidden group border border-zinc-800">
                          <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80" alt="Video" className="w-full h-full object-cover opacity-30" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer" />
                          </div>
                          <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-[10px] font-bold text-white flex justify-between">
                            <span>Interview Recording</span>
                            <span>42:15</span>
                          </div>
                        </div>

                        {/* Notes */}
                        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                          <h3 className="text-xs font-bold text-success flex items-center gap-2 mb-3 uppercase tracking-wider">
                            <FileText className="w-4 h-4" /> Reviewer Notes
                          </h3>
                          <p className="text-xs font-medium text-zinc-300 leading-relaxed italic">
                            "{selectedInterview.notes || 'The candidate has been successfully screened. Ready for the next onboarding step.'}"
                          </p>
                        </div>

                      </div>
                    )}

                  </div>
                </div>

                {/* Candidate Scorecard */}
                {selectedInterview.status !== 'Completed' && (
                  <div className="bg-zinc-900 rounded-3xl border border-zinc-800 shadow-xl p-8">
                    <h3 className="text-lg font-black text-white mb-6">Candidate Scorecard</h3>
                    
                    <div className="space-y-6">
                      {['Technical Skills', 'Communication', 'Problem Solving', 'Culture Fit'].map(skill => (
                        <div key={skill}>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{skill}</label>
                            <span className="text-xs font-bold text-zinc-500">Not Graded</span>
                          </div>
                          <div className="flex gap-2">
                            {[1,2,3,4,5].map(num => (
                              <button key={num} className="flex-1 py-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-success hover:bg-success/5 text-xs font-bold text-zinc-400 transition-colors">
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div>
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">Private Notes</label>
                        <textarea rows={4} placeholder="Jot down thoughts during the interview..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-medium text-white outline-none focus:border-success resize-none" />
                      </div>

                      <div className="flex justify-end pt-4">
                        <button className="px-6 py-3 bg-success hover:bg-success text-white font-bold rounded-xl shadow-lg shadow-[#2bb75c]/10 transition-all">
                          Save Scorecard
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 rounded-3xl text-center p-8">
                <Video className="w-16 h-16 text-zinc-600 mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-zinc-400">No Interview Selected</h3>
                <p className="text-sm text-zinc-500 mt-2 max-w-sm">Select an interview card from the left panel to review scorecards, meeting details, and candidate info.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Schedule Interview Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-800 text-white"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="text-lg font-bold">Schedule Interview</h3>
                <button onClick={() => setShowScheduleModal(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Select Candidate</label>
                  <select 
                    required
                    value={selectedFreelancerId}
                    onChange={(e) => setSelectedFreelancerId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-success transition-colors"
                  >
                    <option value="">-- Choose Candidate --</option>
                    {candidates.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Date & Time</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-success transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Duration (minutes)</label>
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-success transition-colors"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Interview Type</label>
                  <select 
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-success transition-colors"
                  >
                    <option value="Technical Screening">Technical Screening</option>
                    <option value="Cultural Review">Cultural Review</option>
                    <option value="1-on-1 Consultation">1-on-1 Consultation</option>
                    <option value="Final Panel Interview">Final Panel Interview</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Meeting Link (Optional)</label>
                  <input 
                    type="url" 
                    placeholder="https://zoom.us/j/..." 
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-success transition-colors"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={scheduleMutation.isPending}
                  className="w-full py-3 bg-success hover:bg-success text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-[#2bb75c]/10 mt-4 disabled:opacity-50"
                >
                  {scheduleMutation.isPending ? 'Scheduling Interview...' : 'Schedule Interview'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
}

