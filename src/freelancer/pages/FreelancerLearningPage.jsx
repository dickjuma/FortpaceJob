// src/pages/freelancer/FreelancerLearningPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, BookOpen, Award, PlayCircle,
  CheckCircle2, Clock, Star, Trophy, Search, ChevronRight, Check
} from 'lucide-react';
import { useGetLearningData } from '../services/freelancerHooks';

const fallbackCourses = [
  { id: 1, title: 'Advanced Next.js Architecture', level: 'Expert', duration: '4h 30m', progress: 65, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80', badge: 'Next.js Pro' },
  { id: 2, title: 'Mastering Tailwind Animations', level: 'Intermediate', duration: '2h 15m', progress: 0, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80', badge: 'UI Specialist' },
  { id: 3, title: 'Client Communication 101', level: 'Beginner', duration: '1h 45m', progress: 100, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80', badge: 'Top Rated Communicator' }
];

const fallbackCertifications = [
  { id: 1, name: 'React Native Expert', date: 'May 10, 2026', score: '98%', icon: Award, color: 'text-accent DEFAULT', bg: 'bg-accent-light' },
  { id: 2, name: 'AWS Cloud Practitioner', date: 'Apr 22, 2026', score: '92%', icon: Trophy, color: 'text-warn', bg: 'bg-warn-light' }
];

const fallbackSkillRecommendations = [
  { name: 'GraphQL API Design', growth: '+42% demand', diff: 'Intermediate', time: '3h' },
  { name: 'Framer Motion Animations', growth: '+28% demand', diff: 'Beginner', time: '1.5h' },
  { name: 'Stripe Integration', growth: '+15% demand', diff: 'Advanced', time: '5h' },
];

export default function FreelancerLearningPage() {
  const { data: response, isLoading } = useGetLearningData();
  const apiData = response?.data || response;
  
  const COURSES = apiData?.courses || fallbackCourses;
  const CERTIFICATIONS = apiData?.certifications || fallbackCertifications;
  const SKILL_RECOMMENDATIONS = apiData?.skillRecommendations || fallbackSkillRecommendations;
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSuccess, setShowSuccess] = useState(null);

  const handleStartCourse = (courseTitle) => {
    setShowSuccess({ message: `Starting course: ${courseTitle}` });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleTakeTest = () => {
    setShowSuccess({ message: 'Skill test would open here' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-surface-soft pb-16"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-accent-light rounded-xl">
                  <GraduationCap className="w-6 h-6 text-accent DEFAULT" />
                </div>
                <h1 className="font-display font-bold text-3xl text-brand-900">Learning & certifications</h1>
              </div>
              <p className="text-ink-secondary font-body">Improve your skills and earn marketplace verification badges</p>
            </div>

            <div className="flex bg-surface-muted p-1 rounded-lg">
              {['Dashboard', 'All Courses', 'My Certifications'].map((tab, idx) => {
                const ids = ['dashboard', 'courses', 'certifications'];
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(ids[idx])}
                    className={`px-4 py-1.5 rounded-md text-sm font-body font-medium transition-all ${
                      activeTab === ids[idx]
                        ? 'bg-white text-ink-primary shadow-sm'
                        : 'text-ink-tertiary hover:text-ink-secondary'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-6 shadow-sm text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                  <Trophy className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <p className="text-xs font-body font-medium text-accent-light uppercase tracking-wide mb-2">
                    Learning score
                  </p>
                  <h3 className="font-mono font-bold text-4xl mb-1">Top 5%</h3>
                  <p className="text-sm font-body text-white/80">You learn faster than 95% of freelancers</p>
                </div>
              </div>

              <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-accent-light rounded-lg">
                    <BookOpen className="w-5 h-5 text-accent DEFAULT" />
                  </div>
                  <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">
                    Courses completed
                  </p>
                </div>
                <h3 className="font-mono font-semibold text-3xl text-ink-primary">12</h3>
              </div>

              <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-warn-light rounded-lg">
                    <Award className="w-5 h-5 text-warn" />
                  </div>
                  <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">
                    Badges earned
                  </p>
                </div>
                <h3 className="font-mono font-semibold text-3xl text-ink-primary">8</h3>
              </div>
            </div>

            {/* Resume Learning */}
            <section>
              <h2 className="font-display font-semibold text-xl text-brand-900 mb-5">Resume learning</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COURSES.map((course, idx) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden group hover:border-accent DEFAULT transition-all cursor-pointer flex flex-col"
                  >
                    <div className="h-40 overflow-hidden relative">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        width={600}
                        height={400}
                      />
                      {course.progress > 0 && course.progress < 100 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="w-12 h-12 text-white drop-shadow-md" />
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-body font-medium text-accent DEFAULT bg-accent-light px-2 py-0.5 rounded-md">
                          {course.level}
                        </span>
                        <span className="text-xs font-body text-ink-tertiary flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {course.duration}
                        </span>
                      </div>

                      <h3 className="font-body font-semibold text-lg text-ink-primary mb-4 leading-tight">
                        {course.title}
                      </h3>

                      <div className="mt-auto">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-body text-ink-tertiary">
                            {course.progress === 100 ? 'Completed' : 'Progress'}
                          </span>
                          <span className="text-xs font-mono font-semibold text-ink-primary">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${
                            course.progress === 100 ? 'bg-accent DEFAULT' : 'bg-accent DEFAULT'
                          }`} style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Recommended Skills */}
            <section className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="font-display font-semibold text-xl text-brand-900 mb-6">Marketplace skill recommendations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SKILL_RECOMMENDATIONS.map((skill, idx) => (
                  <div
                    key={skill.name}
                    className="p-4 border border-border rounded-xl hover:bg-surface-soft transition-colors flex justify-between items-center cursor-pointer"
                    onClick={() => handleStartCourse(skill.name)}
                  >
                    <div>
                      <h4 className="font-body font-semibold text-ink-primary">{skill.name}</h4>
                      <p className="text-xs font-body font-medium text-accent DEFAULT mt-1">{skill.growth}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-body text-ink-tertiary">{skill.diff} • {skill.time}</p>
                      <button className="mt-2 text-sm font-body font-medium text-accent DEFAULT hover:text-accent-dark flex items-center gap-1 transition-colors">
                        Start course <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {/* Certifications Tab */}
        {activeTab === 'certifications' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Add New Certification */}
              <div
                onClick={handleTakeTest}
                className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center min-h-[240px] hover:border-accent DEFAULT hover:bg-accent-light cursor-pointer transition-all text-center group"
              >
                <div className="w-12 h-12 bg-surface-muted rounded-full flex items-center justify-center text-ink-tertiary mb-4 group-hover:bg-white group-hover:text-accent DEFAULT transition-all">
                  <PlayCircle className="w-6 h-6" />
                </div>
                <h3 className="font-body font-semibold text-ink-primary group-hover:text-accent DEFAULT transition-colors">
                  Take skill test
                </h3>
                <p className="text-sm font-body text-ink-tertiary mt-1">Earn new verification badges</p>
              </div>

              {CERTIFICATIONS.map((cert, idx) => {
                const Icon = cert.icon;
                return (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white border border-border rounded-2xl p-5 shadow-sm flex flex-col"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${cert.bg}`}>
                      <Icon className={`w-6 h-6 ${cert.color}`} />
                    </div>

                    <h3 className="font-body font-semibold text-lg text-ink-primary mb-1">{cert.name}</h3>
                    <div className="flex items-center gap-2 mb-5">
                      <CheckCircle2 className="w-4 h-4 text-accent DEFAULT" />
                      <span className="text-sm font-body font-medium text-ink-tertiary">Verified</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                      <div>
                        <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Score</p>
                        <p className="text-sm font-mono font-semibold text-ink-primary">{cert.score}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Issued on</p>
                        <p className="text-sm font-body font-medium text-ink-primary">{cert.date}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Courses Tab - Coming Soon */}
        {activeTab === 'courses' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <BookOpen className="w-16 h-16 text-ink-tertiary mx-auto mb-4" />
            <h3 className="font-body font-semibold text-xl text-ink-primary mb-2">All courses</h3>
            <p className="text-ink-secondary">Browse our complete library of courses</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
