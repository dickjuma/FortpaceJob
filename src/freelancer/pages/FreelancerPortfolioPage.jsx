import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Image as ImageIcon, Video, FileText, 
  Settings, Eye, Heart, MessageSquare, MoreHorizontal,
  X, UploadCloud
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const PROJECTS = [
  { id: 1, title: 'Fintech Mobile App UI', category: 'App Design', views: 1240, likes: 342, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', featured: true },
  { id: 2, title: 'E-commerce React Dashboard', category: 'Web Development', views: 890, likes: 124, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80' },
  { id: 3, title: 'SaaS Landing Page', category: 'Web Design', views: 450, likes: 89, image: 'https://images.unsplash.com/photo-1507238692062-794d216f40b1?w=800&q=80' },
  { id: 4, title: 'Brand Identity Concept', category: 'Branding', views: 2100, likes: 512, image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80' },
  { id: 5, title: 'Node.js Microservices Arch', category: 'Backend', views: 320, likes: 45, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80' },
];

export default function FreelancerPortfolioPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'App Design', 'Web Development', 'Web Design', 'Branding', 'Backend'];

  const filteredProjects = activeCategory === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-6 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2">Portfolio Management</h1>
            <p className="text-zinc-500 font-medium">Showcase your best work and attract higher-paying clients.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-[#2bb75c] hover:bg-[#1d8d38] text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add New Project
          </button>
        </div>

        {/* Categories */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 mt-8 flex gap-3 overflow-x-auto custom-scrollbar pb-2">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 text-sm font-bold rounded-full transition-all whitespace-nowrap border",
                activeCategory === cat ? "bg-surface-dark dark:bg-white text-white dark:text-zinc-900 border-transparent" : "bg-white dark:bg-surface-dark border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
        
        {/* Behance-style Masonry Grid (simulated with CSS columns for simplicity, or just flex wrap) */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {filteredProjects.map((project) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={project.id} 
              className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-surface-dark cursor-pointer shadow-sm hover:shadow-xl transition-all"
            >
              <img src={project.image} alt={project.title} className="w-full object-cover group-hover:scale-105 group-hover:opacity-60 transition-all duration-500" />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <div className="flex justify-end">
                  <button className="w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-lg flex items-center justify-center text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                <div>
                  <h3 className="text-white font-bold text-lg mb-1 leading-snug">{project.title}</h3>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-4">{project.category}</p>
                  
                  <div className="flex items-center gap-4 text-white/90 text-sm font-bold">
                    <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {project.views}</span>
                    <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> {project.likes}</span>
                  </div>
                </div>
              </div>

              {project.featured && (
                <div className="absolute top-4 left-4 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md z-10 group-hover:opacity-0 transition-opacity">
                  Featured
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>

      {/* Add Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-surface-dark/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 custom-scrollbar"
            >
              <div className="sticky top-0 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 p-6 flex justify-between items-center z-20">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Create New Project</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                
                {/* Upload Area */}
                <div>
                  <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-3">Project Thumbnail & Media</label>
                  <div className="w-full bg-surface dark:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors group">
                    <div className="w-16 h-16 bg-white dark:bg-surface-dark shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-8 h-8 text-[#2bb75c]" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Drag & Drop Media</h3>
                    <p className="text-sm font-medium text-zinc-500 mb-6 text-center max-w-xs">Upload images, videos, or PDFs. The first image will be your project cover.</p>
                    <div className="flex gap-4">
                      <button className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Browse Images</button>
                      <button className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2"><Video className="w-4 h-4" /> Add Video Link</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Project Title</label>
                    <input type="text" placeholder="e.g. Fintech Mobile App UI" className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium outline-none focus:border-[#2bb75c]/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Category</label>
                    <select className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium outline-none focus:border-[#2bb75c]/20">
                      <option>Select Category</option>
                      {categories.filter(c=>c!=='All').map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Completion Date</label>
                    <input type="month" className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium outline-none focus:border-[#2bb75c]/20 text-zinc-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Case Study / Description</label>
                    <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden focus-within:border-[#2bb75c]/20 transition-colors">
                      <div className="bg-surface dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 p-2 flex gap-2">
                        <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-500 font-bold">B</button>
                        <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-500 italic">I</button>
                        <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-500 underline">U</button>
                      </div>
                      <textarea rows="6" className="w-full p-4 bg-white dark:bg-surface-dark outline-none resize-y text-sm font-medium text-zinc-900 dark:text-white" placeholder="Describe your process, challenges, and the final outcome..."></textarea>
                    </div>
                  </div>
                </div>

              </div>

              <div className="sticky bottom-0 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 p-6 flex justify-end gap-4 z-20 rounded-b-3xl">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">Cancel</button>
                <button className="px-8 py-3 bg-[#2bb75c] hover:bg-[#1d8d38] text-white font-bold rounded-xl shadow-sm transition-all">Publish Project</button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

