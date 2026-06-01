import React, { useState } from 'react';
import { Plus, Image as ImageIcon, Video, Link as LinkIcon, Edit, Trash2, FolderOpen, X, Sparkles, Eye, FileText } from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';

export default function PortfolioManagementPage() {
  const [projects, setProjects] = useState([
    { id: 1, title: 'Enterprise SaaS Dashboard', type: 'React/Node', date: 'Oct 2023', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', description: 'A comprehensive management platform featuring visual analytics, role-based access control, and payment processing integration.' },
    { id: 2, title: 'Fintech Payment Gateway', type: 'Full Stack', date: 'Aug 2023', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', description: 'Highly secure payment orchestration engine processing multi-currency settlements with sub-second latency.' }
  ]);

  const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | 'delete'
  const [selectedProject, setSelectedProject] = useState(null);
  
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
      const newProj = {
        id: Date.now(),
        ...projectForm
      };
      setProjects([...projects, newProj]);
      toast.success('Successfully added portfolio project!');
    } else if (activeModal === 'edit' && selectedProject) {
      setProjects(projects.map(p => p.id === selectedProject.id ? { ...p, ...projectForm } : p));
      toast.success('Successfully updated portfolio project!');
    }
    setActiveModal(null);
  };

  const deleteProject = () => {
    if (selectedProject) {
      setProjects(projects.filter(p => p.id !== selectedProject.id));
      toast.success('Project removed from portfolio!');
    }
    setActiveModal(null);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12 font-sans relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-success/20 text-success rounded-xl shadow-sm border border-success/20">
              <FolderOpen size={24} />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Portfolio Management</h1>
          </div>
          <p className="text-sm text-text-secondary font-medium">
            Showcase your best work to win enterprise clients.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" icon={<Plus size={18} />} onClick={openAddModal}>
            Add Project
          </Button>
        </div>
      </div>

      {/* Quick Add Actions */}
      <div className="bg-[#222222] border border-border rounded-[24px] p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-success/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <h2 className="text-sm font-black text-white tracking-widest uppercase mb-6 relative z-10 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-success animate-pulse" />
          Quick Add
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <button onClick={openAddModal} className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 border-dashed rounded-[20px] hover:border-success hover:bg-success/10 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-success/20 transition-all">
              <ImageIcon className="w-5 h-5 text-white/50 group-hover:text-success" />
            </div>
            <span className="text-sm font-bold text-white group-hover:text-success">Upload Images</span>
          </button>
          
          <button onClick={openAddModal} className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 border-dashed rounded-[20px] hover:border-success hover:bg-success/10 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-success/20 transition-all">
              <Video className="w-5 h-5 text-white/50 group-hover:text-success" />
            </div>
            <span className="text-sm font-bold text-white group-hover:text-success">Embed Video</span>
          </button>
          
          <button onClick={openAddModal} className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 border-dashed rounded-[20px] hover:border-success hover:bg-success/10 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-success/20 transition-all">
              <LinkIcon className="w-5 h-5 text-white/50 group-hover:text-success" />
            </div>
            <span className="text-sm font-bold text-white group-hover:text-success">Link External URL</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="pt-4">
        <h2 className="text-xl font-black text-text-primary mb-6">Your Projects ({projects.length})</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="p-0 overflow-hidden group hover:scale-[1.02] transition-transform shadow-sm relative bg-white border border-border">
              <div className="aspect-[4/3] bg-light-gray flex items-center justify-center overflow-hidden relative border-b border-border">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-xs text-white line-clamp-2">{project.description}</p>
                </div>
              </div>
              <div className="p-6 relative z-10 bg-white">
                <h3 className="font-black text-lg text-text-primary mb-2 line-clamp-1">{project.title}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-light-gray text-[10px] font-bold text-text-secondary rounded-md uppercase tracking-widest border border-border">{project.type}</span>
                  <span className="text-xs font-bold text-text-secondary">• {project.date}</span>
                </div>
                
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity tranzinc-y-2 group-hover:tranzinc-y-0 duration-300">
                  <button onClick={() => openEditModal(project)} className="p-2.5 text-white bg-[#222222]/80 backdrop-blur-sm hover:bg-success rounded-xl transition-colors shadow-lg shadow-black/20"><Edit size={16} /></button>
                  <button onClick={() => openDeleteModal(project)} className="p-2.5 text-white bg-[#222222]/80 backdrop-blur-sm hover:bg-[#e63946] rounded-xl transition-colors shadow-lg shadow-black/20"><Trash2 size={16} /></button>
                </div>
              </div>
            </Card>
          ))}
          
          {/* Add New Placeholder Card */}
          <div onClick={openAddModal} className="bg-light-gray/30 rounded-2xl border-2 border-dashed border-border overflow-hidden group hover:border-success hover:bg-light-gray/60 transition-all cursor-pointer min-h-[300px] flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-success/20 transition-all shadow-sm border border-border">
              <Plus className="w-6 h-6 text-text-secondary group-hover:text-success" />
            </div>
            <h3 className="font-black text-text-secondary group-hover:text-success transition-colors">Add New Project</h3>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      {(activeModal === 'add' || activeModal === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <Card className="w-full max-w-lg shadow-2xl relative bg-white border border-border p-6 rounded-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
              <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
                {activeModal === 'add' ? <Plus className="w-5 h-5 text-success" /> : <Edit className="w-5 h-5 text-success" />}
                {activeModal === 'add' ? 'Add Portfolio Project' : 'Edit Portfolio Project'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-light-gray rounded-md transition-colors text-text-secondary"><X size={18} /></button>
            </div>
            
            <form onSubmit={saveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Project Title</label>
                <input 
                  type="text" 
                  value={projectForm.title} 
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary"
                  required
                  placeholder="e.g. Enterprise SaaS Dashboard"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Category / Tag</label>
                  <select
                    value={projectForm.type}
                    onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary appearance-none"
                  >
                    <option value="React/Node">React/Node</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Web3 / Blockchain">Web3 / Blockchain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Completion Date</label>
                  <input 
                    type="text" 
                    value={projectForm.date} 
                    onChange={(e) => setProjectForm({ ...projectForm, date: e.target.value })} 
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary"
                    placeholder="e.g. Oct 2023"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Mock Image URL</label>
                <input 
                  type="text" 
                  value={projectForm.image} 
                  onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Project Description</label>
                <textarea 
                  rows={3} 
                  value={projectForm.description} 
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary resize-none"
                  placeholder="Describe your role and what technologies you used..."
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" variant="primary">Save Project</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {activeModal === 'delete' && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <Card className="w-full max-w-md shadow-2xl relative bg-white border border-border p-6 rounded-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-text-primary mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-[#e63946] animate-bounce" />
              Remove Project?
            </h3>
            <p className="text-sm text-text-secondary mb-6 font-medium">
              Are you sure you want to remove <span className="font-bold text-text-primary">"{selectedProject.title}"</span> from your portfolio? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
              <button onClick={deleteProject} className="px-5 py-2.5 bg-[#e63946] hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
                Remove Project
              </button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
