import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, BookOpen, Award, PlayCircle, 
  CheckCircle2, Clock, Star, Trophy, Search, ChevronRight
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const COURSES = [
  { id: 1, title: 'Advanced Next.js Architecture', level: 'Expert', duration: '4h 30m', progress: 65, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80', badge: 'Next.js Pro' },
  { id: 2, title: 'Mastering Tailwind Animations', level: 'Intermediate', duration: '2h 15m', progress: 0, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80', badge: 'UI Specialist' },
  { id: 3, title: 'Client Communication 101', level: 'Beginner', duration: '1h 45m', progress: 100, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80', badge: 'Top Rated Communicator' }
];

const CERTIFICATIONS = [
  { id: 1, name: 'React Native Expert', date: 'May 10, 2026', score: '98%', icon: Award, color: 'text-[#2bb75c]', bg: 'bg-[#2bb75c]/5 dark:bg-[#2bb75c]/10' },
  { id: 2, name: 'AWS Cloud Practitioner', date: 'Apr 22, 2026', score: '92%', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' }
];

export default function FreelancerLearningPage() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, courses, certifications

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-[#2bb75c]" /> Learning & Certifications
            </h1>
            <p className="text-zinc-500 font-medium">Improve your skills and earn marketplace verification badges.</p>
          </div>
          
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl overflow-x-auto">
            {['Dashboard', 'All Courses', 'My Certifications'].map((tab, idx) => {
              const ids = ['dashboard', 'courses', 'certifications'];
              return (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(ids[idx])}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                    activeTab === ids[idx] ? "bg-white dark:bg-surface-dark text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-[#2bb75c] to-[#1d8d38] rounded-3xl p-6 shadow-md text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-20 transform tranzinc-x-4 -tranzinc-y-4">
                  <Trophy className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <p className="text-xs font-bold text-[#2bb75c] uppercase tracking-wider mb-2">Learning Score</p>
                  <h3 className="text-4xl font-black mb-1">Top 5%</h3>
                  <p className="text-sm font-medium text-[#2bb75c]">You learn faster than 95% of freelancers.</p>
                </div>
              </div>

              <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-50 dark:bg-success/10 text-success rounded-lg"><BookOpen className="w-5 h-5" /></div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Courses Completed</p>
                </div>
                <h3 className="text-3xl font-black text-zinc-900 dark:text-white">12</h3>
              </div>

              <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-lg"><Award className="w-5 h-5" /></div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Badges Earned</p>
                </div>
                <h3 className="text-3xl font-black text-zinc-900 dark:text-white">8</h3>
              </div>
            </div>

            {/* Resume Learning */}
            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Resume Learning</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COURSES.map(course => (
                  <div key={course.id} className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden group cursor-pointer hover:border-[#2bb75c]/50 transition-colors flex flex-col">
                    <div className="h-40 overflow-hidden relative">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {course.progress > 0 && course.progress < 100 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="w-12 h-12 text-white drop-shadow-md" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2bb75c] bg-[#2bb75c]/5 dark:bg-[#2bb75c]/10 px-2 py-0.5 rounded-md">
                          {course.level}
                        </span>
                        <span className="text-xs font-bold text-zinc-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 leading-tight">{course.title}</h3>
                      
                      <div className="mt-auto">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-bold text-zinc-500">{course.progress === 100 ? 'Completed' : 'Progress'}</span>
                          <span className="text-xs font-black text-zinc-900 dark:text-white">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all duration-1000", course.progress === 100 ? "bg-success" : "bg-[#2bb75c]")} style={{ width: `${course.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommended Skills to Learn */}
            <section className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Marketplace Skill Recommendations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'GraphQL API Design', growth: '+42% demand', diff: 'Intermediate', time: '3h' },
                  { name: 'Framer Motion Animations', growth: '+28% demand', diff: 'Beginner', time: '1.5h' },
                  { name: 'Stripe Integration', growth: '+15% demand', diff: 'Advanced', time: '5h' },
                ].map(skill => (
                  <div key={skill.name} className="p-4 border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:bg-surface dark:hover:bg-zinc-800/50 transition-colors flex justify-between items-center cursor-pointer">
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">{skill.name}</h4>
                      <p className="text-xs font-bold text-success mt-1">{skill.growth}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-zinc-400">{skill.diff}</p>
                      <button className="mt-2 text-sm font-bold text-[#2bb75c] flex items-center gap-1 hover:underline">
                        Start Course <ChevronRight className="w-4 h-4" />
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Add New */}
              <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[200px] hover:border-[#2bb75c]/20 hover:bg-[#2bb75c]/5 dark:hover:bg-[#2bb75c]/5 cursor-pointer transition-all text-center">
                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 mb-4">
                  <PlayCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white">Take Skill Test</h3>
                <p className="text-sm font-medium text-zinc-500 mt-1">Earn new verification badges</p>
              </div>

              {CERTIFICATIONS.map(cert => (
                <div key={cert.id} className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm relative overflow-hidden flex flex-col">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-surface dark:bg-zinc-800 rounded-full blur-2xl"></div>
                  
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", cert.bg)}>
                    <cert.icon className={cn("w-6 h-6", cert.color)} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">{cert.name}</h3>
                  <div className="flex items-center gap-2 mb-6">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-sm font-bold text-zinc-500">Verified</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Score</p>
                      <p className="text-sm font-black text-zinc-900 dark:text-white">{cert.score}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Issued On</p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">{cert.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}

