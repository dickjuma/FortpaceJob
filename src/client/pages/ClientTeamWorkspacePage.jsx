import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Settings, CheckCircle, 
  XCircle, Clock, MessageSquare, MoreHorizontal,
  Mail, Shield, Building, Filter, Search,
  Briefcase, Check, X, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useConfirm } from '../../common/context/ConfirmContext';
import { 
  useClientTeamMembers, 
  useInviteTeamMember, 
  useRemoveTeamMember,
  useMyProfile 
} from '../services/clientHooks';

// --- MOCK / INITIAL STATES ---
const INITIAL_APPROVALS = [
  { id: 101, candidate: 'Alex Freeman', role: 'Senior React Dev', rate: '$85/hr', status: 'Pending', requestedBy: 'John Doe', matchScore: 92 },
  { id: 102, candidate: 'Sam Taylor', role: 'UI/UX Designer', rate: '$60/hr', status: 'Approved', requestedBy: 'Sarah Connor', matchScore: 88 },
  { id: 103, candidate: 'Jordan Lee', role: 'Backend Engineer', rate: '$95/hr', status: 'Rejected', requestedBy: 'Miles Dyson', matchScore: 75 }
];

const INITIAL_NOTES = [
  { id: 1, author: 'John Doe', authorInitial: 'J', candidate: 'Alex Freeman', content: 'Strong technical skills, but requested rate is on the higher end. Should we negotiate?', time: '2 hours ago' },
  { id: 2, author: 'Sarah Connor', authorInitial: 'S', candidate: 'Sam Taylor', content: 'Loved the portfolio. Approved the hiring request. Let\'s proceed with the offer.', time: '1 day ago' },
  { id: 3, author: 'Miles Dyson', authorInitial: 'M', candidate: 'Jordan Lee', content: 'Not enough experience with our specific microservices architecture. Let\'s keep looking.', time: '2 days ago' }
];

export default function ClientTeamWorkspacePage() {
  const { confirm } = useConfirm();
  const [activeTab, setActiveTab] = useState('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Dynamic profile + team hooks
  const { data: profileData } = useMyProfile();
  const { data: teamMembers, isLoading: membersLoading } = useClientTeamMembers();
  const inviteMutation = useInviteTeamMember();
  const removeMutation = useRemoveTeamMember();

  // Workspace name resolution
  const workspaceName = profileData?.companyName || profileData?.company || 'My Workspace';

  // Interactive notes and approvals
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [newNoteContent, setNewNoteContent] = useState('');

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      await inviteMutation.mutateAsync({
        email: inviteEmail.trim(),
        role: inviteRole,
        permissions: ['VIEW', 'EDIT']
      });
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteRole('MEMBER');
    } catch (error) {
      // Toast notifications are already handled by hooks
    }
  };

  const handleRemove = async (memberId) => {
    const ok = await confirm({
      title: 'Remove team member',
      message: 'Remove this person from your workspace? They will lose access immediately.',
      confirmLabel: 'Remove member',
      critical: true,
    });
    if (!ok) return;
    try {
      await removeMutation.mutateAsync(memberId);
    } catch (error) {
      // Handled by hook
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    const newNote = {
      id: Date.now(),
      author: profileData?.firstName ? `${profileData.firstName} ${profileData.lastName || ''}`.trim() : 'You',
      authorInitial: (profileData?.firstName || 'Y').charAt(0).toUpperCase(),
      candidate: 'General Workspace Discussion',
      content: newNoteContent,
      time: 'Just now'
    };

    setNotes([newNote, ...notes]);
    setNewNoteContent('');
    toast.success('Internal note added successfully');
  };

  const handleApprovalDecision = (id, decision) => {
    setApprovals(prev => prev.map(app => {
      if (app.id === id) {
        return { ...app, status: decision === 'approve' ? 'Approved' : 'Rejected' };
      }
      return app;
    }));
    toast.success(`Hiring request ${decision === 'approve' ? 'approved' : 'rejected'}`);
  };

  const TABS = [
    { id: 'members', label: 'Team Members', icon: Users, count: teamMembers?.length || 0 },
    { id: 'approvals', label: 'Hiring Approvals', icon: Briefcase, count: approvals.filter(a => a.status === 'Pending').length },
    { id: 'notes', label: 'Internal Notes', icon: MessageSquare, count: notes.length }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-12">
      {/* Header Area */}
      <div className="bg-zinc-900 border-b border-zinc-800 pt-24 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-success/10 border border-success/20 rounded-2xl flex items-center justify-center text-success">
                <Building className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black">{workspaceName}</h1>
                <p className="text-zinc-400 text-sm mt-1 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" /> SME / Enterprise Workspace
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <button className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4 text-zinc-500" /> Settings
              </button>
              <button 
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 bg-success hover:bg-success text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2 shadow-lg shadow-[#4C1D95]/10"
              >
                <UserPlus className="w-4 h-4" /> Invite Member
              </button>
            </motion.div>
          </div>
 
          {/* Tabs */}
          <div className="flex gap-6 mt-8 overflow-x-auto no-scrollbar border-b border-zinc-800">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 flex items-center gap-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                    isActive 
                      ? "border-success text-success" 
                      : "border-transparent text-zinc-400 hover:text-white"
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${isActive ? 'text-success' : 'text-zinc-500'}`} />
                  {tab.label}
                  <span className={`ml-1 px-2.5 py-0.5 rounded-full text-xs font-black transition-colors ${
                    isActive ? "bg-success/10 text-success border border-success/20" : "bg-zinc-800 text-zinc-400"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
 
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: TEAM MEMBERS */}
          {activeTab === 'members' && (
            <motion.div
              key="members"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="relative w-full max-w-md">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-success transition-colors text-white"
                  />
                </div>
                <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                  <Filter className="w-4 h-4 text-zinc-500" /> Filter
                </button>
              </div>
 
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase text-xs font-black tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Member</th>
                        <th className="px-6 py-4">Role / Permissions</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {membersLoading ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-8 text-center text-zinc-500 font-bold">
                            Loading team members...
                          </td>
                        </tr>
                      ) : teamMembers?.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-8 text-center text-zinc-500 font-bold">
                            No team members found. Invite some colleagues to get started!
                          </td>
                        </tr>
                      ) : (
                        (teamMembers || [])
                          .filter(m => 
                            (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (m.email || '').toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((member) => (
                            <tr key={member.id} className="hover:bg-zinc-800/40 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-success/10 border border-success/20 text-success flex items-center justify-center font-bold">
                                    {member.avatar || 'T'}
                                  </div>
                                  <div>
                                    <div className="font-bold text-white">{member.name || 'Team Member'}</div>
                                    <div className="text-zinc-500 text-xs mt-0.5">{member.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-bold">
                                  <Shield className="w-3.5 h-3.5 text-success" /> {member.role}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {member.acceptedAt ? (
                                  <span className="inline-flex items-center gap-1 text-green-400 text-xs font-bold">
                                    <CheckCircle className="w-4 h-4" /> Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-yellow-400 text-xs font-bold">
                                    <Clock className="w-4 h-4" /> Pending Invite
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button 
                                  onClick={() => handleRemove(member.id)}
                                  className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-zinc-950 transition-colors"
                                  title="Remove Member"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
 
          {/* TAB 2: APPROVALS */}
          {activeTab === 'approvals' && (
            <motion.div
              key="approvals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {approvals.map((approval) => (
                    <div key={approval.id} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg text-white">{approval.candidate}</h3>
                          <span className="px-2.5 py-0.5 bg-success/10 border border-success/20 text-success text-xs font-black rounded-md">
                            {approval.matchScore}% Match
                          </span>
                        </div>
                        <p className="text-sm text-zinc-400 flex items-center gap-2 mb-3">
                          <Briefcase className="w-4 h-4 text-zinc-500" /> {approval.role} • {approval.rate}
                        </p>
                        <p className="text-xs text-zinc-500">
                          Requested by <span className="font-bold text-zinc-300">{approval.requestedBy}</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {approval.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => handleApprovalDecision(approval.id, 'reject')}
                              className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleApprovalDecision(approval.id, 'approve')}
                              className="flex items-center justify-center w-10 h-10 rounded-full bg-success text-white hover:bg-success transition-colors shadow-lg shadow-[#4C1D95]/10"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {approval.status === 'Approved' && (
                          <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in zoom-in-95">
                            <CheckCircle className="w-4 h-4" /> Approved
                          </div>
                        )}
                        {approval.status === 'Rejected' && (
                          <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in zoom-in-95">
                            <XCircle className="w-4 h-4" /> Rejected
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Workflow Summary Widget */}
                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl h-fit">
                  <h3 className="font-bold text-white mb-4">Hiring Workflow</h3>
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-zinc-900 bg-success text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <Check className="w-3 h-3" />
                      </div>
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] text-sm ml-4 md:ml-0 md:group-odd:text-right">
                        <p className="font-bold">Manager Review</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Completed</p>
                      </div>
                    </div>
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-zinc-900 bg-success/20 border-success/30 text-success shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <div className="w-2 h-2 rounded-full bg-success" />
                      </div>
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] text-sm ml-4 md:ml-0 md:group-even:text-right">
                        <p className="font-bold">Team Lead Approval</p>
                        <p className="text-xs text-success mt-0.5 font-bold">1 Pending</p>
                      </div>
                    </div>
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-zinc-800 bg-zinc-950 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      </div>
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] text-sm ml-4 md:ml-0 md:group-odd:text-right text-zinc-600">
                        <p className="font-bold">Final Sign-off</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
 
          {/* TAB 3: INTERNAL NOTES */}
          {activeTab === 'notes' && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl"
            >
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden flex flex-col h-[600px]">
                <div className="p-4 border-b border-zinc-800 bg-zinc-950">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-zinc-500" /> Hiring Discussions
                  </h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {notes.map((note) => (
                    <div key={note.id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-success shrink-0">
                        {note.authorInitial}
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-bold text-sm text-white">{note.author}</span>
                          <span className="text-xs text-zinc-500">{note.time}</span>
                        </div>
                        <div className="text-xs font-black text-success mb-2">
                          Re: {note.candidate}
                        </div>
                        <div className="bg-zinc-950 p-4 rounded-b-xl rounded-tr-xl text-sm text-zinc-300 leading-relaxed border border-zinc-800">
                          {note.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
 
                <form onSubmit={handleAddNote} className="p-4 border-t border-zinc-800 bg-zinc-900">
                  <div className="relative">
                    <textarea 
                      placeholder="Add an internal note... (@mention team members)"
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-success transition-colors text-white resize-none min-h-[80px]"
                    ></textarea>
                    <button 
                      type="submit"
                      className="absolute right-3 bottom-3 p-2 bg-success text-white rounded-lg hover:bg-success transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
 
        </AnimatePresence>
      </div>
 
      {/* Invite Modal (SME / Corporate Integration) */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-800 text-white"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="text-lg font-bold">Invite Team Member</h3>
                <button onClick={() => setShowInviteModal(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleInvite} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="colleague@company.com" 
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-success transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Role</label>
                  <select 
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-success transition-colors"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="MEMBER">Member</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  disabled={inviteMutation.isPending}
                  className="w-full py-3 bg-success hover:bg-success text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-[#4C1D95]/10 mt-4 disabled:opacity-50"
                >
                  {inviteMutation.isPending ? 'Sending Invitation...' : 'Send Invitation'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
    </div>
  );
}



