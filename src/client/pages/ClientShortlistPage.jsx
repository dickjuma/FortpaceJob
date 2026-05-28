import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderPlus, Folder, Users, Search, MoreVertical, 
  MessageSquare, Star, Clock, Heart, Trash2, Edit3, UserPlus, Check
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

// Mock Data
const FOLDERS = [
  { id: 1, name: 'Frontend Devs', count: 4, active: true },
  { id: 2, name: 'UI/UX Designers', count: 2, active: false },
  { id: 3, name: 'Backend Experts', count: 1, active: false },
  { id: 4, name: 'Maybe Later', count: 5, active: false },
];

const MOCK_FREELANCERS = [
  {
    id: 'f1',
    name: 'Alex Rivera',
    title: 'Senior React Developer',
    avatar: 'https://i.pravatar.cc/150?u=a1',
    skills: ['React', 'Next.js', 'Tailwind'],
    rating: 4.9,
    reviews: 124,
    rate: '$45/hr',
    trust: 98,
    availability: 'Available Now',
    note: 'Great portfolio, maybe a bit expensive but worth it for the core features.',
  },
  {
    id: 'f2',
    name: 'Sarah Chen',
    title: 'Frontend Engineer',
    avatar: 'https://i.pravatar.cc/150?u=a2',
    skills: ['Vue.js', 'Tailwind', 'Framer'],
    rating: 4.7,
    reviews: 89,
    rate: '$35/hr',
    trust: 92,
    availability: 'Busy (Next week)',
    note: 'Interviewed last week. Very solid understanding of animations.',
  }
];

export default function ClientShortlistPage() {
  const [activeFolder, setActiveFolder] = useState(1);
  const [freelancers, setFreelancers] = useState(MOCK_FREELANCERS);
  const [editingNote, setEditingNote] = useState(null);

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2">Shortlists</h1>
            <p className="text-zinc-500 font-medium">Organize and compare your favorite freelancers before hiring.</p>
          </div>
          <button className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 border border-zinc-200 dark:border-zinc-700">
            <FolderPlus className="w-4 h-4" /> New Folder
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar: Folders */}
        <div className="w-full lg:w-64 shrink-0 space-y-2">
          {FOLDERS.map(folder => (
            <button 
              key={folder.id}
              onClick={() => setActiveFolder(folder.id)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl font-bold transition-all",
                activeFolder === folder.id 
                  ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400" 
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
              )}
            >
              <div className="flex items-center gap-3">
                <Folder className={cn("w-4 h-4", activeFolder === folder.id ? "fill-brand-500/20" : "")} />
                {folder.name}
              </div>
              <span className="text-xs bg-white dark:bg-surface-dark shadow-sm px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700">
                {folder.count}
              </span>
            </button>
          ))}
        </div>

        {/* Main Content: Comparison List */}
        <div className="flex-1">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              Frontend Devs <span className="text-sm font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">4 saved</span>
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -tranzinc-y-1/2" />
              <input type="text" placeholder="Search in folder..." className="pl-9 pr-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium outline-none focus:border-brand-500 w-64 shadow-sm" />
            </div>
          </div>

          <div className="space-y-6">
            {freelancers.map(f => (
              <motion.div 
                key={f.id}
                layout
                className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col md:flex-row"
              >
                {/* Profile Info */}
                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800 flex flex-col justify-between relative bg-surface/30 dark:bg-surface-dark/30">
                  <button className="absolute top-4 right-4 p-1.5 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors">
                    <Heart className="w-5 h-5 fill-rose-400" />
                  </button>
                  
                  <div className="flex gap-4">
                    <img src={f.avatar} alt={f.name} className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-zinc-800 shadow-sm" />
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-white text-lg">{f.name}</h3>
                      <p className="text-sm font-medium text-zinc-500">{f.title}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {f.skills.map(s => <span key={s} className="text-xs font-bold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-md border border-zinc-200 dark:border-zinc-700">{s}</span>)}
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="p-6 flex-1 flex flex-col">
                  
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase mb-1">Rate</p>
                      <p className="text-sm font-black text-zinc-900 dark:text-white">{f.rate}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase mb-1">Rating</p>
                      <p className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {f.rating}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase mb-1">Trust</p>
                      <p className="text-sm font-black text-brand-600">{f.trust}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase mb-1">Status</p>
                      <p className={cn("text-xs font-bold px-2 py-0.5 rounded-full inline-block", f.availability.includes('Now') ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400")}>
                        {f.availability}
                      </p>
                    </div>
                  </div>

                  {/* Notes Panel */}
                  <div className="mb-6 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl p-3 relative group">
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-500 mb-1 flex items-center gap-1">
                      <Edit3 className="w-3 h-3" /> Private Note
                    </p>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 italic">"{f.note}"</p>
                  </div>

                  <div className="mt-auto flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                    <button className="px-4 py-2 font-bold text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Message
                    </button>
                    <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-lg shadow-sm transition-all flex items-center gap-2">
                      <UserPlus className="w-4 h-4" /> Invite to Job
                    </button>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
