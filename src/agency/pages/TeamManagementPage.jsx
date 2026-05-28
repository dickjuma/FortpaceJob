import React, { useState } from 'react';
import { 
  Users, UserPlus, Search, Settings, ShieldAlert, CheckCircle, 
  MoreVertical, X, Mail, ShieldCheck, Zap, AlertTriangle, Edit, Trash2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

export default function TeamManagementPage() {
  const [members, setMembers] = useState([
    { id: 1, name: 'Sarah Jenkins', role: 'Lead Developer', status: 'Active', utilization: 85, access: 'Admin', email: 'sarah.j@acme.io' },
    { id: 2, name: 'Michael Chen', role: 'UX Designer', status: 'On Bench', utilization: 0, access: 'Member', email: 'm.chen@acme.io' },
    { id: 3, name: 'Elena Rodriguez', role: 'Project Manager', status: 'Active', utilization: 100, access: 'Manager', email: 'elena.r@acme.io' },
  ]);

  const [activeModal, setActiveModal] = useState(null); // 'invite' | 'edit' | 'delete'
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'Lead Developer',
    access: 'Member',
    utilization: 80
  });

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) return;

    if (members.some(m => m.email.toLowerCase() === inviteForm.email.trim().toLowerCase())) {
      toast.error('Member with this email already exists!');
      return;
    }

    const newMember = {
      id: Date.now(),
      name: inviteForm.name.trim(),
      email: inviteForm.email.trim(),
      role: inviteForm.role,
      access: inviteForm.access,
      status: 'Active',
      utilization: parseInt(inviteForm.utilization) || 0
    };

    setMembers([...members, newMember]);
    setActiveModal(null);
    toast.success(`Invitation successfully sent to ${newMember.email}!`);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    if (!selectedMember) return;

    setMembers(members.map(m => m.id === selectedMember.id ? { ...m, ...inviteForm } : m));
    setActiveModal(null);
    toast.success('Team member details updated successfully!');
  };

  const openInviteModal = () => {
    setInviteForm({
      name: '',
      email: '',
      role: 'Lead Developer',
      access: 'Member',
      utilization: 80
    });
    setActiveModal('invite');
  };

  const openEditModal = (member) => {
    setSelectedMember(member);
    setInviteForm({
      name: member.name,
      email: member.email,
      role: member.role,
      access: member.access,
      utilization: member.utilization
    });
    setActiveModal('edit');
  };

  const handleDelete = (id) => {
    setMembers(members.filter(m => m.id !== id));
    toast.success('Team member removed successfully.');
  };

  const toggleStatus = (id) => {
    setMembers(members.map(m => {
      if (m.id === id) {
        const newStatus = m.status === 'Active' ? 'On Bench' : 'Active';
        const newUtil = newStatus === 'Active' ? 80 : 0;
        toast.success(`${m.name} is now ${newStatus}`);
        return { ...m, status: newStatus, utilization: newUtil };
      }
      return m;
    }));
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-accent-purple" />
            Team Management
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage permissions, roles, and bench status for your agency roster.
          </p>
        </div>
        <Button 
          variant="primary" 
          icon={<UserPlus size={18} />}
          onClick={openInviteModal}
        >
          Invite Member
        </Button>
      </div>

      {/* Grid of Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Members', value: members.length, icon: Users, color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
          { label: 'Active Utilization', value: `${Math.round(members.reduce((acc, m) => acc + m.utilization, 0) / members.length)}%`, icon: Zap, color: 'text-success', bg: 'bg-success/15' },
          { label: 'On Bench', value: members.filter(m => m.status !== 'Active').length, icon: AlertTriangle, color: 'text-accent-red', bg: 'bg-accent-red/10' },
        ].map((stat, idx) => (
          <Card key={idx} className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-border shadow-sm flex items-center gap-4">
            <div className={cn("p-4 rounded-xl", stat.bg, stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-text-primary mt-1">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Table Section */}
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-border shadow-md overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-text-secondary" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-border rounded-xl bg-light-gray/40 text-text-primary sm:text-sm focus:outline-none focus:border-accent-purple"
              placeholder="Search team members..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-light-gray/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Member</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Access Level</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Utilization</th>
                <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-border">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-light-gray/20 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-xl bg-accent-purple/20 text-accent-purple flex items-center justify-center font-black">
                          {member.name[0]}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-text-primary">{member.name}</div>
                        <div className="text-xs text-text-secondary">{member.role} • {member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border",
                      member.access === 'Admin' ? 'bg-accent-purple/10 text-accent-purple border-accent-purple/20' :
                      member.access === 'Manager' ? 'bg-accent-red/10 text-accent-red border-accent-red/20' :
                      'bg-light-gray text-text-secondary border-border'
                    )}>
                      {member.access === 'Admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                      {member.access}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => toggleStatus(member.id)} className="focus:outline-none">
                      <span className={cn(
                        "inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer hover:scale-105 transition-all",
                        member.status === 'Active' ? 'bg-success/15 text-success border-success/20' : 'bg-amber-100 text-amber-600 border-amber-200'
                      )}>
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        {member.status}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-light-gray rounded-full h-2 overflow-hidden border border-border">
                        <div className={cn("h-full rounded-full", member.utilization === 0 ? 'bg-amber-400' : 'bg-accent-purple')} style={{ width: `${member.utilization}%` }}></div>
                      </div>
                      <span className="font-bold text-text-primary text-xs">{member.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-bold space-x-2">
                    <button onClick={() => openEditModal(member)} className="p-2 text-text-secondary hover:text-accent-purple hover:bg-light-gray rounded-lg transition-colors"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(member.id)} className="p-2 text-text-secondary hover:text-accent-red hover:bg-light-gray rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}

              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <Users className="w-12 h-12 text-text-secondary mx-auto mb-3" />
                    <h4 className="font-bold text-text-primary">No members found</h4>
                    <p className="text-xs text-text-secondary mt-1">Try adapting your search parameter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* --- MODALS --- */}
      {(activeModal === 'invite' || activeModal === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <Card className="w-full max-w-lg shadow-2xl relative bg-white border border-border p-6 rounded-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
              <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
                {activeModal === 'invite' ? <UserPlus className="w-5 h-5 text-accent-purple" /> : <Edit className="w-5 h-5 text-accent-purple" />}
                {activeModal === 'invite' ? 'Invite Team Member' : 'Edit Member Access'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-light-gray rounded-md transition-colors text-text-secondary"><X size={18} /></button>
            </div>
            
            <form onSubmit={activeModal === 'invite' ? handleInvite : handleEditSave} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={inviteForm.name} 
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-accent-purple text-sm text-text-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={inviteForm.email} 
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-accent-purple text-sm text-text-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Professional Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-accent-purple text-sm text-text-primary appearance-none"
                  >
                    <option value="Lead Developer">Lead Developer</option>
                    <option value="Senior DevOps">Senior DevOps</option>
                    <option value="UX Designer">UX Designer</option>
                    <option value="Project Manager">Project Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Access Level</label>
                  <select
                    value={inviteForm.access}
                    onChange={(e) => setInviteForm({ ...inviteForm, access: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-accent-purple text-sm text-text-primary appearance-none"
                  >
                    <option value="Member">Member</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Utilization Capacity (%)</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  value={inviteForm.utilization} 
                  onChange={(e) => setInviteForm({ ...inviteForm, utilization: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-accent-purple text-sm text-text-primary"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" variant="primary">
                  {activeModal === 'invite' ? 'Send Invite' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
}
