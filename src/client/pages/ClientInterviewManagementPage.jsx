// ClientInterviewManagementPage.jsx
// Self-contained Interview Management page with design tokens,
// framer-motion animations, and local mock data. No external dependencies.
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Video,
  Clock,
  Star,
  FileText,
  Link as LinkIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  MessageSquare,
  X,
  Check,
  User,
  AlertCircle,
} from 'lucide-react';
import { getInterviews, scheduleInterview, getShortlist } from '../services/clientApi';

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------
const mockInterviews = [
  {
    id: 'int-1',
    freelancer: {
      id: 'fl-1',
      name: 'Sarah Jenkins',
      avatar: null,
    },
    role: 'Senior React Developer',
    date: 'May 30, 2026 · 2:00 PM',
    duration: '45 min',
    status: 'Upcoming',
    link: 'https://zoom.us/j/123456789',
    score: null,
    notes: null,
  },
  {
    id: 'int-2',
    freelancer: {
      id: 'fl-2',
      name: 'Michael Chen',
      avatar: null,
    },
    role: 'Backend Engineer',
    date: 'Jun 2, 2026 · 10:30 AM',
    duration: '30 min',
    status: 'Scheduled',
    link: 'https://meet.google.com/abc-defg',
    score: null,
    notes: null,
  },
  {
    id: 'int-3',
    freelancer: {
      id: 'fl-3',
      name: 'Grace Mutua',
      avatar: null,
    },
    role: 'UI/UX Designer',
    date: 'May 25, 2026 · 3:00 PM',
    duration: '60 min',
    status: 'Completed',
    link: 'https://zoom.us/j/987654321',
    score: 4.8,
    notes: 'Strong portfolio, excellent communication. Ready for onboarding.',
  },
];

const mockProposals = [
  { id: 'prop-1', freelancerId: 'fl-1', freelancer: { user: { firstName: 'Sarah', lastName: 'Jenkins', id: 'fl-1' } } },
  { id: 'prop-2', freelancerId: 'fl-2', freelancer: { user: { firstName: 'Michael', lastName: 'Chen', id: 'fl-2' } } },
  { id: 'prop-3', freelancerId: 'fl-3', freelancer: { user: { firstName: 'Grace', lastName: 'Mutua', id: 'fl-3' } } },
];

// Helper to get unique candidates from shortlist items
const getCandidates = (items) => {
  const candidatesMap = new Map();
  items.forEach((item) => {
    const user = item.freelancer?.user || item.user || item.freelancer || {};
    const id = user.id || item.freelancerId || item.id;
    const name =
      user.name ||
      `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
      item.name ||
      `Freelancer ${id}`;
    if (id) {
      candidatesMap.set(id, { id, name });
    }
  });
  return Array.from(candidatesMap.values());
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function ClientInterviewManagementPage() {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'completed'
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [toast, setToast] = useState(null);

  const [interviews, setInterviews] = useState([]);
  const [shortlistItems, setShortlistItems] = useState([]);

  // UI state for scheduling form
  const [selectedFreelancerId, setSelectedFreelancerId] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [duration, setDuration] = useState('45');
  const [interviewType, setInterviewType] = useState('Technical Interview');
  const [meetingLink, setMeetingLink] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  const candidates = getCandidates(shortlistItems);
  const upcomingInterviews = interviews.filter(i => i.status === 'Upcoming' || i.status === 'Scheduled');
  const completedInterviews = interviews.filter(i => i.status === 'Completed');
  const activeList = activeTab === 'upcoming' ? upcomingInterviews : completedInterviews;

  useEffect(() => {
    const loadInterviewData = async () => {
      try {
        const interviewsRes = await getInterviews({ limit: 50, sort: 'createdAt:desc' });
        const shortlistRes = await getShortlist({ limit: 50 });

        setInterviews(interviewsRes?.items || interviewsRes || []);
        setShortlistItems(shortlistRes?.items || shortlistRes || []);
      } catch (err) {
        showToast('error', err?.message || 'Failed to load interview data.');
      }
    };
    loadInterviewData();
  }, []);

  // Auto-select first interview when list changes
  useEffect(() => {
    if (activeList.length > 0) {
      setSelectedInterview(activeList[0]);
    } else {
      setSelectedInterview(null);
    }
  }, [activeTab, interviews]);

  const showToast = (type, message, durationMs = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), durationMs);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFreelancerId) {
      showToast('error', 'Please select a freelancer');
      return;
    }
    if (!interviewDate) {
      showToast('error', 'Please select a date and time');
      return;
    }

    setIsScheduling(true);

    try {
      const payload = {
        freelancerId: selectedFreelancerId,
        scheduledAt: new Date(interviewDate).toISOString(),
        duration: Number(duration) || 45,
        type: interviewType,
        meetingLink: meetingLink.trim() || undefined,
      };
      const result = await scheduleInterview(payload);
      const scheduledInterview = result?.data || result;
      setInterviews((prev) => [scheduledInterview, ...prev]);
      setShowScheduleModal(false);
      setSelectedFreelancerId('');
      setInterviewDate('');
      setMeetingLink('');
      showToast('success', 'Interview scheduled successfully!');
    } catch (err) {
      showToast('error', err?.message || 'Failed to schedule interview.');
    } finally {
      setIsScheduling(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };
  const buttonTap = { scale: 0.97 };
  const cardHover = { y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', transition: { duration: 0.2 } };

  // Calendar days mock (May 2026)
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-surface-soft font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6 mb-8">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-brand-900 flex items-center gap-3">
              <Video className="w-8 h-8 text-accent" /> Interviews
            </h1>
            <p className="text-ink-secondary text-sm mt-1">
              Schedule consultations, view technical reviews, and grade candidates.
            </p>
          </div>
          <motion.button
            whileTap={buttonTap}
            onClick={() => setShowScheduleModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors shadow-sm"
          >
            <CalendarIcon className="w-5 h-5" /> Schedule New Interview
          </motion.button>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: List & Calendar */}
          <div className="w-full lg:w-96 shrink-0 space-y-6">
            {/* Tab switcher */}
            <div className="flex bg-surface-muted border border-border p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'upcoming'
                    ? 'bg-white text-brand-900 shadow-sm'
                    : 'text-ink-tertiary hover:text-ink-primary'
                }`}
              >
                Upcoming ({upcomingInterviews.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'completed'
                    ? 'bg-white text-brand-900 shadow-sm'
                    : 'text-ink-tertiary hover:text-ink-primary'
                }`}
              >
                Completed ({completedInterviews.length})
              </button>
            </div>

            {/* Mini Calendar Widget */}
            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold text-brand-900">May 2026</h3>
                <div className="flex gap-1">
                  <button className="p-1 rounded-md text-ink-tertiary hover:text-accent">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="p-1 rounded-md text-ink-tertiary hover:text-accent">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                  <div key={d} className="text-[10px] font-semibold text-ink-tertiary mb-2">{d}</div>
                ))}
                {calendarDays.map(day => (
                  <div
                    key={day}
                    className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-xs font-medium transition-colors ${
                      day === 30
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-ink-primary hover:bg-surface-muted'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Cards List */}
            <div className="space-y-4">
              {activeList.length === 0 ? (
                <div className="bg-white border border-border rounded-2xl p-8 text-center text-ink-tertiary text-sm">
                  No {activeTab} interviews scheduled.
                </div>
              ) : (
                activeList.map(interview => (
                  <motion.div
                    key={interview.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={cardHover}
                    onClick={() => setSelectedInterview(interview)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 bg-white ${
                      selectedInterview?.id === interview.id
                        ? 'border-accent bg-accent-light shadow-sm'
                        : 'border-border hover:border-accent/30'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-accent-light text-accent-dark flex items-center justify-center shrink-0 font-bold">
                      {interview.freelancer.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-ink-primary text-sm truncate">
                        {interview.freelancer.name}
                      </h4>
                      <p className="text-xs text-ink-tertiary truncate mb-1">{interview.role}</p>
                      <p className="text-[10px] font-medium text-ink-tertiary flex items-center gap-1">
                        <Clock size={12} className="text-accent" /> {interview.date}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Detail View */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {selectedInterview ? (
                <motion.div
                  key={selectedInterview.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Main Detail Card */}
                  <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border flex flex-wrap justify-between items-start gap-4 bg-surface-soft/20">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-accent-light text-accent-dark flex items-center justify-center text-xl font-bold">
                          {selectedInterview.freelancer.name.charAt(0)}
                        </div>
                        <div>
                          <h2 className="font-display text-xl font-bold text-brand-900">
                            {selectedInterview.freelancer.name}
                          </h2>
                          <p className="text-sm font-medium text-accent">{selectedInterview.role}</p>
                        </div>
                      </div>
                      {selectedInterview.status === 'Completed' ? (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-ink-primary flex items-center gap-1">
                            <Star size={20} className="text-warn fill-warn" /> {selectedInterview.score || '4.8'}
                          </div>
                          <p className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wide mt-1">
                            Final Score
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-light text-accent-dark">
                          {selectedInterview.status}
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6 border-b border-border pb-6">
                        <div>
                          <p className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wide mb-1">
                            Scheduled Time
                          </p>
                          <p className="text-sm font-medium text-ink-primary">{selectedInterview.date}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wide mb-1">
                            Duration
                          </p>
                          <p className="text-sm font-medium text-ink-primary">{selectedInterview.duration}</p>
                        </div>
                        {selectedInterview.link && (
                          <div>
                            <p className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wide mb-1">
                              Meeting Link
                            </p>
                            <a
                              href={selectedInterview.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-accent hover:underline flex items-center gap-1"
                            >
                              <Video size={14} /> Join Meeting
                            </a>
                          </div>
                        )}
                      </div>

                      {selectedInterview.status !== 'Completed' ? (
                        <div className="bg-surface-soft border border-border rounded-xl p-6 text-center">
                          <Video size={48} className="text-accent mx-auto mb-4 opacity-60" />
                          <h3 className="font-display font-bold text-brand-900 mb-2">
                            Ready for the consultation?
                          </h3>
                          <p className="text-sm text-ink-tertiary mb-6">
                            Join the meeting room below. During the call, you can rate technical proficiency
                            and draft private notes here.
                          </p>
                          <a
                            href={selectedInterview.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-6 py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors"
                          >
                            Join Meeting
                          </a>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Recording Placeholder */}
                          <div className="bg-surface-soft rounded-xl aspect-video relative overflow-hidden group border border-border">
                            <img
                              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80"
                              alt="Interview recording placeholder"
                              className="w-full h-full object-cover opacity-30"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <PlayCircle size={48} className="text-ink-tertiary group-hover:text-accent transition-colors cursor-pointer" />
                            </div>
                            <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-[10px] font-medium text-ink-primary flex justify-between">
                              <span>Interview Recording</span>
                              <span>42:15</span>
                            </div>
                          </div>
                          {/* Notes */}
                          <div className="bg-surface-soft border border-border rounded-xl p-5">
                            <h3 className="text-xs font-semibold text-accent flex items-center gap-2 mb-3 uppercase tracking-wide">
                              <FileText size={14} /> Reviewer Notes
                            </h3>
                            <p className="text-sm text-ink-primary leading-relaxed italic">
                              "{selectedInterview.notes || 'The candidate has been successfully screened. Ready for the next onboarding step.'}"
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Candidate Scorecard (only for upcoming) */}
                  {selectedInterview.status !== 'Completed' && (
                    <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
                      <h3 className="font-display text-lg font-bold text-brand-900 mb-5">Candidate Scorecard</h3>
                      <div className="space-y-5">
                        {['Technical Skills', 'Communication', 'Problem Solving', 'Culture Fit'].map(skill => (
                          <div key={skill}>
                            <div className="flex justify-between items-center mb-2">
                              <label className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide">
                                {skill}
                              </label>
                              <span className="text-xs text-ink-tertiary">Not Graded</span>
                            </div>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map(num => (
                                <button
                                  key={num}
                                  className="flex-1 py-1.5 rounded-lg border border-border bg-white hover:border-accent hover:bg-accent-light text-xs font-medium text-ink-tertiary hover:text-accent-dark transition-colors"
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                        <div>
                          <label className="block text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-2">
                            Private Notes
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Jot down thoughts during the interview..."
                            className="w-full border border-border rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent resize-none"
                          />
                        </div>
                        <div className="flex justify-end pt-2">
                          <button className="px-5 py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors">
                            Save Scorecard
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="bg-white border border-border rounded-2xl shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                  <Video size={64} className="text-ink-tertiary mb-4 opacity-40" />
                  <h3 className="font-display text-lg font-bold text-ink-tertiary">No Interview Selected</h3>
                  <p className="text-sm text-ink-tertiary mt-2 max-w-sm">
                    Select an interview card from the left panel to review scorecards, meeting details, and candidate info.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-border"
            >
              <div className="p-5 border-b border-border flex justify-between items-center">
                <h3 className="font-display text-lg font-bold text-brand-900">Schedule Interview</h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="p-1 rounded-md text-ink-tertiary hover:text-ink-primary"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleScheduleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-1.5">
                    Select Candidate
                  </label>
                  <select
                    required
                    value={selectedFreelancerId}
                    onChange={(e) => setSelectedFreelancerId(e.target.value)}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white"
                  >
                    <option value="">-- Choose Candidate --</option>
                    {candidates.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-1.5">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-1.5">
                    Duration (minutes)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-1.5">
                    Interview Type
                  </label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white"
                  >
                    <option value="Technical Screening">Technical Screening</option>
                    <option value="Cultural Review">Cultural Review</option>
                    <option value="1-on-1 Consultation">1-on-1 Consultation</option>
                    <option value="Final Panel Interview">Final Panel Interview</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-1.5">
                    Meeting Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://zoom.us/j/..."
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isScheduling}
                  className="w-full py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isScheduling ? 'Scheduling...' : 'Schedule Interview'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
            style={{
              backgroundColor: toast.type === 'success' ? 'rgb(220, 252, 231)' : 'rgb(254, 226, 226)',
              color: toast.type === 'success' ? 'rgb(21, 128, 61)' : 'rgb(185, 28, 28)',
            }}
          >
            {toast.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
