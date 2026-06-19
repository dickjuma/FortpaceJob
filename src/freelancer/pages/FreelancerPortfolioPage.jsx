// src/pages/freelancer/FreelancerPortfolioPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Image as ImageIcon, Video, FileText,
  Settings, Eye, Heart, MessageSquare, MoreHorizontal,
  X, UploadCloud, Check
} from 'lucide-react';
import { useGetPortfolio, useCreatePortfolioProject } from '../services/freelancerHooks';

const PROJECTS = [
  { id: 1, title: 'Fintech Mobile App UI', category: 'App Design', views: 1240, likes: 342, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', featured: true },
  { id: 2, title: 'E-commerce React Dashboard', category: 'Web Development', views: 890, likes: 124, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80' },
  { id: 3, title: 'SaaS Landing Page', category: 'Web Design', views: 450, likes: 89, image: 'https://images.unsplash.com/photo-1507238692062-794d216f40b1?w=800&q=80' },
  { id: 4, title: 'Brand Identity Concept', category: 'Branding', views: 2100, likes: 512, image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80' },
  { id: 5, title: 'Node.js Microservices Arch', category: 'Backend', views: 320, likes: 45, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80' },
];

export default function FreelancerPortfolioPage() {
  const { data: response, isLoading } = useGetPortfolio();
  const portfolioData = response?.data || response || [];
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showSuccess, setShowSuccess] = useState(null);
  
  const createProject = useCreatePortfolioProject();

  const categories = ['All', 'App Design', 'Web Development', 'Web Design', 'Branding', 'Backend'];

  const projects = portfolioData.length > 0 ? portfolioData : PROJECTS;
  const filteredProjects = activeCategory === 'All' ? projects : projects.filter(p => p.category === activeCategory);

  const handlePublishProject = () => {
    createProject.mutate({ title: 'New Project', category: 'Web Development' }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setShowSuccess({ message: 'Project published successfully' });
        setTimeout(() => setShowSuccess(null), 3000);
      }
    });
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
                  <ImageIcon className="w-6 h-6 text-accent DEFAULT" />
                </div>
                <h1 className="font-display font-bold text-3xl text-brand-900">Portfolio management</h1>
              </div>
              <p className="text-ink-secondary font-body">Showcase your best work and attract higher-paying clients</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-900"
            >
              <Plus className="w-4 h-4" /> Add project
            </button>
          </div>

          {/* Categories */}
          <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 text-sm font-body font-medium rounded-full transition-all whitespace-nowrap border ${
                  activeCategory === cat
                    ? "bg-brand-900 text-white border-brand-900"
                    : "bg-white border-border text-ink-secondary hover:border-border-strong"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredProjects.map((project, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={project.id}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-white border border-border shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full object-cover group-hover:scale-105 transition-all duration-500"
                width={800}
                height={600}
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-brand-900/90 via-brand-900/40 to-transparent">
                <div className="flex justify-end">
                  <button className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-white font-body font-semibold text-lg mb-1 leading-snug">{project.title}</h3>
                  <p className="text-white/80 text-xs font-body font-medium uppercase tracking-wide mb-3">{project.category}</p>

                  <div className="flex items-center gap-4 text-white/90 text-sm font-body">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" /> {project.views}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4" /> {project.likes}
                    </span>
                  </div>
                </div>
              </div>

              {project.featured && (
                <div className="absolute top-4 left-4 bg-accent DEFAULT text-white text-xs font-body font-semibold px-2.5 py-0.5 rounded-full shadow-md z-10 group-hover:opacity-0 transition-opacity">
                  Featured
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 bg-white border border-border rounded-2xl">
            <ImageIcon className="w-16 h-16 text-ink-tertiary mx-auto mb-4" />
            <h3 className="font-body font-semibold text-xl text-ink-primary mb-2">No projects found</h3>
            <p className="text-ink-secondary">Add your first project to showcase your work</p>
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-border shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10"
            >
              <div className="sticky top-0 bg-white border-b border-border p-5 flex justify-between items-center z-20">
                <h2 className="font-display font-semibold text-xl text-brand-900">Add new project</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-surface-muted rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900"
                >
                  <X className="w-5 h-5 text-ink-tertiary" />
                </button>
              </div>

              <div className="p-6 space-y-6">

                {/* Upload Area */}
                <div>
                  <label className="block text-sm font-body font-medium text-ink-primary mb-3">
                    Project thumbnail & media
                  </label>
                  <div className="w-full bg-surface-soft border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-accent DEFAULT hover:bg-accent-light transition-all group">
                    <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-7 h-7 text-accent DEFAULT" />
                    </div>
                    <h3 className="text-base font-body font-semibold text-ink-primary mb-1">Drag & drop media</h3>
                    <p className="text-sm font-body text-ink-tertiary mb-5 text-center max-w-xs">
                      Upload images, videos, or PDFs. The first image will be your project cover.
                    </p>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 border border-border rounded-lg text-sm font-body font-medium text-ink-primary hover:bg-surface-muted transition-colors inline-flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Browse images
                      </button>
                      <button className="px-4 py-2 border border-border rounded-lg text-sm font-body font-medium text-ink-primary hover:bg-surface-muted transition-colors inline-flex items-center gap-2">
                        <Video className="w-4 h-4" /> Add video link
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-body font-medium text-ink-primary mb-2">
                      Project title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Fintech Mobile App UI"
                      className="w-full h-11 px-4 bg-white border border-border rounded-xl text-sm font-body text-ink-primary placeholder-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-body font-medium text-ink-primary mb-2">
                        Category
                      </label>
                      <select className="w-full h-11 px-4 bg-white border border-border rounded-xl text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900">
                        <option>Select category</option>
                        {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium text-ink-primary mb-2">
                        Completion date
                      </label>
                      <input
                        type="month"
                        className="w-full h-11 px-4 bg-white border border-border rounded-xl text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium text-ink-primary mb-2">
                      Description
                    </label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm font-body text-ink-primary placeholder-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none"
                      placeholder="Describe your process, challenges, and the final outcome..."
                    />
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-border p-5 flex justify-end gap-3 rounded-b-2xl">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900"
                >
                  Cancel
                </button>
                  <button
                    onClick={handlePublishProject}
                    disabled={createProject.isPending}
                    className="px-6 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-semibold text-sm transition-colors flex items-center gap-2"
                  >
                    {createProject.isPending ? 'Publishing...' : <><Check className="w-4 h-4" /> Publish Project</>}
                  </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
