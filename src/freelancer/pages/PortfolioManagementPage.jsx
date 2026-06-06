// src/pages/freelancer/PortfolioManagementPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Image as ImageIcon, Video, Link as LinkIcon, Edit, Trash2, FolderOpen, X, Sparkles, Eye, FileText, Check
} from 'lucide-react';

export default function PortfolioManagementPage() {
  const [projects, setProjects] = useState([
    { id: 1, title: 'Enterprise SaaS Dashboard', type: 'React/Node', date: 'Oct 2023', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', description: 'A comprehensive management platform featuring visual analytics, role-based access control, and payment processing integration.' },
    { id: 2, title: 'Fintech Payment Gateway', type: 'Full Stack', date: 'Aug 2023', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', description: 'Highly secure payment orchestration engine processing multi-currency settlements with sub-second latency.' }
  ]);

  const [activeModal, setActiveModal] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showSuccess, setShowSuccess] = useState(null);

  const [projectForm, setProjectForm] = useState({
    title: '',
    type: 'React/Node',
    date: '',
    image: '',
    description: ''
  });

  const openAddModal = () => {
    setProjectForm({
      title: '',
      type: 'React/Node',
      date: new Date().toISOString().split('T')[0],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      description: ''
    });
    setActiveModal('add');
  };

  const openEditModal = (project) => {
    setSelectedProject(project);
    setProjectForm({
      title: project.title,
      type: project.type,
      date: project.date,
      image: project.image,
      description: project.description || ''
    });
    setActiveModal('edit');
  };

  const openDeleteModal = (project) => {
    setSelectedProject(project);
    setActiveModal('delete');
  };

  const saveProject = (e) => {
    e.preventDefault();
    if (activeModal === 'add') {
      const newProj = { id: Date.now(), ...projectForm };
      setProjects([...projects, newProj]);
      setShowSuccess({ message: 'Project added successfully' });
    } else if (activeModal === 'edit' && selectedProject) {
      setProjects(projects.map(p => p.id === selectedProject.id ? { ...p, ...projectForm } : p));
      setShowSuccess({ message: 'Project updated successfully' });
    }
    setActiveModal(null);
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const deleteProject = () => {
    if (selectedProject) {
      setProjects(projects.filter(p => p.id !== selectedProject.id));
      setShowSuccess({ message: 'Project removed from portfolio' });
    }
    setActiveModal(null);
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const typeOptions = ['React/Node', 'Full Stack', 'UI/UX Design', 'Mobile App', 'Web3 / Blockchain'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light rounded-xl">
              <FolderOpen className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Portfolio management</h1>
          </div>
          <p className="text-ink-secondary font-body">Showcase your best work to win enterprise clients</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add project
        </button>
      </div>

      {/* Quick Add Section */}
      <div className="bg-gradient-to-br from-brand-900 to-brand-800 border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden mb-8">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-accent-light/20 rounded-full blur-[100px] pointer-events-none" />
        <h2 className="text-sm font-body font-semibold text-white mb-5 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-accent-light" /> Quick add
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
          <button onClick={openAddModal} className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-xl hover:border-accent DEFAULT hover:bg-accent-light/20 transition-all group">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-all">
              <ImageIcon className="w-5 h-5 text-white/60 group-hover:text-accent-light" />
            </div>
            <span className="text-sm font-body font-medium text-white/80 group-hover:text-white">Upload images</span>
          </button>
          <button onClick={openAddModal} className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-xl hover:border-accent DEFAULT hover:bg-accent-light/20 transition-all group">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-all">
              <Video className="w-5 h-5 text-white/60 group-hover:text-accent-light" />
            </div>
            <span className="text-sm font-body font-medium text-white/80 group-hover:text-white">Embed video</span>
          </button>
          <button onClick={openAddModal} className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-xl hover:border-accent DEFAULT hover:bg-accent-light/20 transition-all group">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-all">
              <LinkIcon className="w-5 h-5 text-white/60 group-hover:text-accent-light" />
            </div>
            <span className="text-sm font-body font-medium text-white/80 group-hover:text-white">Link URL</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div>
        <h2 className="font-display font-semibold text-xl text-brand-900 mb-5">Your projects ({projects.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -3 }}
              className="bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              <div className="aspect-[4/3] bg-surface-muted relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  width={800}
                  height={600}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-xs text-white line-clamp-2">{project.description}</p>
                </div>
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(project)} className="p-1.5 bg-black/60 hover:bg-accent DEFAULT rounded-lg text-white transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => openDeleteModal(project)} className="p-1.5 bg-black/60 hover:bg-danger rounded-lg text-white transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-body font-semibold text-base text-ink-primary mb-1 line-clamp-1">{project.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-surface-muted text-ink-tertiary text-xs font-body font-medium rounded-md">
                    {project.type}
                  </span>
                  <span className="text-xs text-ink-tertiary">• {project.date}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add New Card */}
          <div
            onClick={openAddModal}
            className="bg-surface-soft border-2 border-dashed border-border rounded-xl overflow-hidden cursor-pointer hover:border-accent DEFAULT hover:bg-accent-light transition-all min-h-[280px] flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm border border-border">
              <Plus className="w-5 h-5 text-ink-tertiary group-hover:text-accent DEFAULT" />
            </div>
            <h3 className="font-body font-semibold text-ink-primary">Add new project</h3>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(activeModal === 'add' || activeModal === 'edit') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-border"
            >
              <div className="flex justify-between items-center p-5 border-b border-border">
                <h3 className="font-display font-semibold text-lg text-brand-900 flex items-center gap-2">
                  {activeModal === 'add' ? <Plus className="w-5 h-5 text-accent DEFAULT" /> : <Edit className="w-5 h-5 text-accent DEFAULT" />}
                  {activeModal === 'add' ? 'Add project' : 'Edit project'}
                </h3>
                <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-surface-muted transition-colors">
                  <X className="w-5 h-5 text-ink-tertiary" />
                </button>
              </div>

              <form onSubmit={saveProject} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                    Project title
                  </label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    required
                    placeholder="e.g., Enterprise SaaS Dashboard"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                      Category
                    </label>
                    <select
                      value={projectForm.type}
                      onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
                      className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    >
                      {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                      Completion date
                    </label>
                    <input
                      type="text"
                      value={projectForm.date}
                      onChange={(e) => setProjectForm({ ...projectForm, date: e.target.value })}
                      className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                      placeholder="e.g., Oct 2023"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={projectForm.image}
                    onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                    className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none"
                    placeholder="Describe your role and technologies used..."
                    required
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors"
                  >
                    Save project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {activeModal === 'delete' && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-border"
            >
              <div className="p-5 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Trash2 className="w-5 h-5 text-danger" />
                  <h3 className="font-display font-semibold text-lg text-brand-900">Remove project?</h3>
                </div>
                <p className="text-sm text-ink-secondary">
                  Are you sure you want to remove <span className="font-semibold text-ink-primary">"{selectedProject.title}"</span> from your portfolio?
                </p>
              </div>
              <div className="flex justify-end gap-3 p-5">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteProject}
                  className="px-4 py-2 rounded-lg bg-danger text-white hover:bg-red-700 font-body font-medium text-sm transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
