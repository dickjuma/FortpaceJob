import React, { useState } from 'react';
import { 
  Layers, Plus, Search, ShieldCheck, Clock, Users, 
  Settings, CheckCircle2, MoreVertical, X, Award, Briefcase, ChevronRight
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Frontend Engineering', lead: 'Sarah Jenkins', membersCount: 6, projectsCount: 3, utilization: 88 },
    { id: 2, name: 'Creative UI/UX', lead: 'Michael Chen', membersCount: 3, projectsCount: 2, utilization: 60 },
    { id: 3, name: 'DevOps & Infrastructure', lead: 'Alex Morgan', membersCount: 2, projectsCount: 4, utilization: 95 },
  ]);

  const [activeModal, setActiveModal] = useState(null); // 'create'
  const [searchTerm, setSearchTerm] = useState('');
  
  const [depForm, setDepForm] = useState({
    name: '',
    lead: 'Sarah Jenkins',
    utilization: 80
  });

  const handleCreateDepartment = (e) => {
    e.preventDefault();
    if (!depForm.name.trim()) return;

    if (departments.some(d => d.name.toLowerCase() === depForm.name.trim().toLowerCase())) {
      toast.error('Department already exists!');
      return;
    }

    const newDep = {
      id: Date.now(),
      name: depForm.name.trim(),
      lead: depForm.lead,
      membersCount: 1, // creator
      projectsCount: 0,
      utilization: parseInt(depForm.utilization) || 80
    };

    setDepartments([...departments, newDep]);
    setActiveModal(null);
    toast.success(`Department "${newDep.name}" successfully created!`);
  };

  const deleteDepartment = (id) => {
    setDepartments(departments.filter(d => d.id !== id));
    toast.success('Department deleted successfully.');
  };

  const filteredDeps = departments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.lead.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Layers className="w-8 h-8 text-success" />
            Departments
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Group your agency roster into functional departments and align operational deliverables.
          </p>
        </div>
        <Button 
          variant="primary" 
          icon={<Plus size={18} />}
          onClick={() => setActiveModal('create')}
        >
          Create Department
        </Button>
      </div>

      <div className="mb-6 max-w-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -tranzinc-y-1/2 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search departments..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-border rounded-xl bg-light-gray/40 text-sm focus:outline-none focus:border-success text-text-primary"
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredDeps.map((dep) => (
          <Card key={dep.id} className="bg-white border border-border rounded-3xl p-6 shadow-md hover:shadow-lg transition-all relative flex flex-col justify-between min-h-[260px] group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-success/10 text-success rounded-2xl group-hover:scale-110 transition-transform">
                  <Layers size={20} />
                </div>
                <button onClick={() => deleteDepartment(dep.id)} className="p-1.5 hover:bg-light-gray rounded-lg transition-colors text-text-secondary hover:text-[#e63946]">
                  <X size={16} />
                </button>
              </div>

              <h3 className="font-black text-lg text-text-primary mb-1">{dep.name}</h3>
              <p className="text-xs text-text-secondary font-bold mb-4">Lead: {dep.lead}</p>

              <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs font-bold text-text-secondary">
                <div>
                  <p className="text-text-primary text-sm font-black">{dep.membersCount}</p>
                  <p className="mt-0.5 uppercase tracking-wider text-[10px]">Team Members</p>
                </div>
                <div>
                  <p className="text-text-primary text-sm font-black">{dep.projectsCount}</p>
                  <p className="mt-0.5 uppercase tracking-wider text-[10px]">Active Projects</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-xs font-bold text-text-secondary mb-1">
                <span>Utilization</span>
                <span>{dep.utilization}%</span>
              </div>
              <div className="w-full bg-light-gray rounded-full h-2 overflow-hidden border border-border">
                <div className="h-full bg-success rounded-full transition-all" style={{ width: `${dep.utilization}%` }}></div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* --- CREATE DEPARTMENT MODAL --- */}
      {activeModal === 'create' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <Card className="w-full max-w-md shadow-2xl relative bg-white border border-border p-6 rounded-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
              <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
                <Plus className="w-5 h-5 text-success" />
                Create Department
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-light-gray rounded-md transition-colors text-text-secondary"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleCreateDepartment} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Department Name</label>
                <input 
                  type="text" 
                  value={depForm.name} 
                  onChange={(e) => setDepForm({ ...depForm, name: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary"
                  placeholder="e.g. Mobile Application Engineering"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Department Lead</label>
                <select
                  value={depForm.lead}
                  onChange={(e) => setDepForm({ ...depForm, lead: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary appearance-none"
                >
                  <option value="Sarah Jenkins">Sarah Jenkins</option>
                  <option value="Michael Chen">Michael Chen</option>
                  <option value="Elena Rodriguez">Elena Rodriguez</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Target Utilization (%)</label>
                <input 
                  type="number" 
                  value={depForm.utilization} 
                  onChange={(e) => setDepForm({ ...depForm, utilization: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" variant="primary">Create Department</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
}
