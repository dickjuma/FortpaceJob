import React, { useState } from 'react';
import { 
  Briefcase, Plus, Search, ShieldCheck, Clock, Users, 
  Settings, CheckCircle2, MoreVertical, X, DollarSign, Calendar, MessageSquare, AlertTriangle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

export default function SharedProjectsPage() {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Cloud Migration Suite', client: 'Nexis Global Corp', budget: 45000, deadline: '2026-08-15', progress: 65, health: 'On Track', team: ['Sarah Jenkins', 'Elena Rodriguez'] },
    { id: 2, name: 'Mobile Banking Redesign', client: 'First National Bank', budget: 85000, deadline: '2026-07-22', progress: 30, health: 'At Risk', team: ['Sarah Jenkins', 'Michael Chen'] },
    { id: 3, name: 'SaaS Billing Middleware', client: 'ScaleFlow Technologies', budget: 28000, deadline: '2026-09-01', progress: 95, health: 'On Track', team: ['Elena Rodriguez'] },
  ]);

  const [activeModal, setActiveModal] = useState(null); // 'create'
  const [searchTerm, setSearchTerm] = useState('');
  
  const [projectForm, setProjectForm] = useState({
    name: '',
    client: '',
    budget: '',
    deadline: '',
    health: 'On Track',
    team: []
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!projectForm.name.trim() || !projectForm.client.trim()) return;

    const newProject = {
      id: Date.now(),
      name: projectForm.name.trim(),
      client: projectForm.client.trim(),
      budget: parseInt(projectForm.budget) || 0,
      deadline: projectForm.deadline || new Date().toISOString().split('T')[0],
      progress: 0,
      health: projectForm.health,
      team: ['Elena Rodriguez'] // default assignee
    };

    setProjects([...projects, newProject]);
    setActiveModal(null);
    toast.success(`Project "${newProject.name}" successfully created!`);
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
    toast.success('Project successfully removed.');
  };

  const updateProgressSimulate = (id) => {
    setProjects(projects.map(p => {
      if (p.id === id) {
        const nextProgress = Math.min(p.progress + 10, 100);
        if (nextProgress === 100) {
          toast.success(`Project "${p.name}" has reached 100% completion! 🎉`);
        } else {
          toast.success(`Simulated progress update for "${p.name}"`);
        }
        return { ...p, progress: nextProgress };
      }
      return p;
    }));
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-success" />
            Shared Projects
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Track budgets, client communications, developer assignments, and health for all active agency projects.
          </p>
        </div>
        <Button 
          variant="primary" 
          icon={<Plus size={18} />}
          onClick={() => setActiveModal('create')}
        >
          Create Project
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Active Projects', value: projects.length, icon: Briefcase, color: 'text-success', bg: 'bg-success/10' },
          { label: 'Total Allocated Budget', value: `$${projects.reduce((acc, p) => acc + p.budget, 0).toLocaleString()}`, icon: DollarSign, color: 'text-success', bg: 'bg-success/15' },
          { label: 'Average Progress', value: `${Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)}%`, icon: Clock, color: 'text-[#14a800]', bg: 'bg-[#14a800]/5' },
          { label: 'Risk Flags', value: projects.filter(p => p.health !== 'On Track').length, icon: AlertTriangle, color: 'text-[#e63946]', bg: 'bg-[#e63946]/10' }
        ].map((stat, idx) => (
          <Card key={idx} className="p-6 bg-white border border-border shadow-sm flex items-center gap-4">
            <div className={cn("p-4 rounded-xl", stat.bg, stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-xl font-black text-text-primary mt-1">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="bg-white border border-border rounded-3xl p-6 shadow-md hover:shadow-lg transition-all relative flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-black text-lg text-text-primary line-clamp-1">{project.name}</h3>
                  <p className="text-xs text-text-secondary font-bold">Client: {project.client}</p>
                </div>
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                  project.health === 'On Track' ? 'bg-success/15 text-success border-success/20' : 'bg-[#e63946]/10 text-[#e63946] border-[#e63946]/20'
                )}>
                  {project.health}
                </span>
              </div>

              <div className="space-y-4 my-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-text-secondary mb-1">
                    <span>Milestone Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-light-gray rounded-full h-2 overflow-hidden border border-border">
                    <div className="h-full bg-success rounded-full transition-all" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>

                {/* Team Avatars */}
                <div>
                  <p className="text-xs font-bold text-text-secondary mb-1">Assigned Team</p>
                  <div className="flex -space-x-2">
                    {project.team.map((t, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center font-black text-xs border-2 border-white" title={t}>
                        {t[0]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-between items-center bg-transparent">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Project Budget</p>
                <p className="font-black text-lg text-text-primary">${project.budget.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateProgressSimulate(project.id)} className="px-3 py-1.5 bg-success/10 hover:bg-success text-success hover:text-white rounded-lg text-xs font-black transition-all">
                  Progress +10%
                </button>
                <button onClick={() => deleteProject(project.id)} className="p-2 text-text-secondary hover:text-[#e63946] hover:bg-light-gray rounded-lg transition-all">
                  <X size={16} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* --- CREATE PROJECT MODAL --- */}
      {activeModal === 'create' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <Card className="w-full max-w-lg shadow-2xl relative bg-white border border-border p-6 rounded-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
              <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
                <Plus className="w-5 h-5 text-success" />
                Create Shared Project
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-light-gray rounded-md transition-colors text-text-secondary"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Project Name</label>
                <input 
                  type="text" 
                  value={projectForm.name} 
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary"
                  placeholder="e.g. Next-Gen Mobile Client"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Client Name</label>
                <input 
                  type="text" 
                  value={projectForm.client} 
                  onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary"
                  placeholder="e.g. Acme Corp Inc"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Allocated Budget ($)</label>
                  <input 
                    type="number" 
                    value={projectForm.budget} 
                    onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })} 
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary"
                    placeholder="e.g. 50000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Completion Deadline</label>
                  <input 
                    type="date" 
                    value={projectForm.deadline} 
                    onChange={(e) => setProjectForm({ ...projectForm, deadline: e.target.value })} 
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Initial Project Health</label>
                <select
                  value={projectForm.health}
                  onChange={(e) => setProjectForm({ ...projectForm, health: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary appearance-none"
                >
                  <option value="On Track">On Track</option>
                  <option value="At Risk">At Risk</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" variant="primary">Create Project</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
}
