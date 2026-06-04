import React, { useState } from 'react';
import {
  Users, Mail, CheckCircle, Clock, Settings, MoreVertical,
  Plus, Search, Briefcase, Activity, AlertCircle, Shield,
  X, Send, User, ChevronDown, RefreshCw, Loader2, Trash2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../services/clientApi';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmModal from '../../components/ui/ConfirmModal';

// ── API Functions ─────────────────────────────────────────────────────────────
async function getTeamMembers() {
  const r = await apiFetch('/profilesystem/client/team').catch(() => ({ data: [] }));
  const raw = r?.data ?? r?.members ?? r ?? [];
  return Array.isArray(raw) ? raw : [];
}

async function inviteTeamMember(payload) {
  const r = await apiFetch('/profilesystem/client/team/invite', {
    method: 'POST', body: JSON.stringify(payload),
  });
  return r?.data ?? r;
}

async function removeTeamMember(memberId) {
  return apiFetch(`/profilesystem/client/team/${memberId}`, { method: 'DELETE' });
}

async function updateMemberRole(memberId, role) {
  const r = await apiFetch(`/profilesystem/client/team/${memberId}/role`, {
    method: 'PATCH', body: JSON.stringify({ role }),
  });
  return r?.data ?? r;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const ROLES = [
  { name: 'Owner',          color: 'text-success bg-success/10 border-success/20', permissions: ['Post jobs', 'Hire freelancers', 'Approve payments', 'View analytics', 'Manage contracts', 'Manage team'] },
  { name: 'Hiring Manager', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',     permissions: ['Post jobs', 'Hire freelancers', 'View analytics', 'Manage contracts'] },
  { name: 'Recruiter',      color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', permissions: ['Post jobs', 'View analytics'] },
  { name: 'Finance',        color: 'text-success bg-success/10 border-success/20', permissions: ['Approve payments', 'View analytics'] },
  { name: 'Viewer',         color: 'text-zinc-400 bg-zinc-700/30 border-zinc-600/20',    permissions: ['View analytics'] },
];

const getRoleStyle = (roleName) =>
  ROLES.find(r => r.name.toLowerCase() === roleName?.toLowerCase())?.color ||
  'text-zinc-400 bg-zinc-700/30 border-zinc-600/20';

const TABS = ['Members', 'Roles & Permissions'];

export default function ClientTeamManagementPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('Members');
  const [search, setSearch] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'Hiring Manager', name: '' });

  // ── Queries ─────────────────────────────────────────────────────────────────
  const { data: members = [], isLoading, error, refetch } = useQuery({
    queryKey: ['client', 'team'],
    queryFn: getTeamMembers,
    staleTime: 60_000,
  });

  const inviteMutation = useMutation({
    mutationFn: inviteTeamMember,
    onSuccess: () => {
      toast.success(`Invitation sent to ${inviteForm.email}`);
      qc.invalidateQueries({ queryKey: ['client', 'team'] });
      setShowInviteModal(false);
      setInviteForm({ email: '', role: 'Hiring Manager', name: '' });
    },
    onError: (err) => toast.error(err?.message || 'Failed to send invitation'),
  });

  const removeMutation = useMutation({
    mutationFn: removeTeamMember,
    onSuccess: () => {
      toast.success('Member removed');
      qc.invalidateQueries({ queryKey: ['client', 'team'] });
      setConfirmModal(null);
    },
    onError: (err) => toast.error(err?.message || 'Failed to remove member'),
  });

  const roleUpdateMutation = useMutation({
    mutationFn: ({ memberId, role }) => updateMemberRole(memberId, role),
    onSuccess: () => {
      toast.success('Role updated');
      qc.invalidateQueries({ queryKey: ['client', 'team'] });
      setEditingRole(null);
    },
    onError: (err) => toast.error(err?.message || 'Failed to update role'),
  });

  const filtered = members.filter(m => {
    if (!search) return true;
    const name = m.name || m.user?.name || m.email || '';
    return name.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 overflow-y-auto custom-scrollbar">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-success" /> Team Management
            </h1>
            <p className="text-sm text-zinc-400 mt-1">Manage team members, roles, and hiring permissions</p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-success hover:bg-success text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-[#2bb75c]/20"
          >
            <Mail className="w-4 h-4" /> Invite Member
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 gap-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-bold transition-colors border-b-2 -mb-px ${
                activeTab === tab ? 'text-success border-success' : 'text-zinc-400 border-transparent hover:text-zinc-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── MEMBERS TAB ──────────────────────────────────────────────────── */}
        {activeTab === 'Members' && (
          <div className="space-y-4">
            {/* Search + refresh */}
            <div className="flex gap-3 items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success" />
              </div>
              <button onClick={refetch} className="p-2 text-zinc-400 hover:text-white transition-colors"><RefreshCw className="w-4 h-4" /></button>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-20 bg-zinc-900/40 rounded-2xl animate-pulse" />)}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3 bg-zinc-900/30 rounded-2xl border border-zinc-800">
                <AlertCircle className="w-10 h-10 text-red-400 opacity-60" />
                <p className="text-zinc-400 text-sm">Failed to load team members.</p>
                <button onClick={refetch} className="text-xs text-success hover:underline">Retry</button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-4 bg-zinc-900/30 rounded-2xl border border-zinc-800">
                <Users className="w-12 h-12 text-zinc-600" />
                <div className="text-center">
                  <p className="text-zinc-300 font-bold">No team members yet</p>
                  <p className="text-zinc-500 text-sm mt-1">Invite colleagues to collaborate on hiring.</p>
                </div>
                <button onClick={() => setShowInviteModal(true)} className="px-5 py-2 bg-success text-white rounded-full text-sm font-bold hover:bg-success transition-colors">Invite First Member</button>
              </div>
            ) : (
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/80">
                      <th className="text-left px-5 py-3.5 text-xs text-zinc-500 font-bold">Member</th>
                      <th className="text-left px-5 py-3.5 text-xs text-zinc-500 font-bold">Role</th>
                      <th className="text-left px-5 py-3.5 text-xs text-zinc-500 font-bold">Department</th>
                      <th className="text-left px-5 py-3.5 text-xs text-zinc-500 font-bold">Status</th>
                      <th className="text-left px-5 py-3.5 text-xs text-zinc-500 font-bold">Active Projects</th>
                      <th className="text-right px-5 py-3.5 text-xs text-zinc-500 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {filtered.map(member => {
                      const name = member.name || member.user?.name || member.email?.split('@')[0] || 'Member';
                      const email = member.email || member.user?.email || '';
                      const role = member.role || 'Viewer';
                      const status = member.status || (member.acceptedAt ? 'Active' : 'Invited');
                      const projects = member.activeProjects ?? 0;
                      const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                      const isOwner = role === 'Owner';
                      return (
                        <tr key={member.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-300 shrink-0">
                                {member.avatar ? <img src={member.avatar} alt={name} className="w-full h-full rounded-full object-cover" /> : initials}
                              </div>
                              <div>
                                <p className="font-bold text-white">{name}</p>
                                <p className="text-xs text-zinc-500">{email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            {editingRole === member.id && !isOwner ? (
                              <div className="flex items-center gap-2">
                                <select
                                  defaultValue={role}
                                  onChange={(e) => roleUpdateMutation.mutate({ memberId: member.id, role: e.target.value })}
                                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:border-success"
                                  disabled={roleUpdateMutation.isPending}
                                >
                                  {ROLES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                                </select>
                                <button onClick={() => setEditingRole(null)} className="text-zinc-500 hover:text-zinc-300"><X className="w-3.5 h-3.5" /></button>
                              </div>
                            ) : (
                              <button
                                onClick={() => !isOwner && setEditingRole(member.id)}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getRoleStyle(role)} ${!isOwner ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                              >
                                {role}
                                {!isOwner && <ChevronDown className="w-3 h-3 opacity-60" />}
                              </button>
                            )}
                          </td>
                          <td className="px-5 py-4 text-zinc-400 text-sm">{member.department || '—'}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-xs">
                              {status === 'Active' || status === 'ACTIVE' ? (
                                <span className="flex items-center gap-1 text-success font-bold">
                                  <CheckCircle className="w-3.5 h-3.5" /> Active
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-yellow-400 font-bold">
                                  <Clock className="w-3.5 h-3.5" /> Invited
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-sm">
                              <Briefcase className="w-3.5 h-3.5 text-zinc-500" />
                              <span className={projects > 0 ? 'text-success font-bold' : 'text-zinc-500'}>{projects}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right">
                            {!isOwner && (
                              <button
                                onClick={() => setConfirmModal({ memberId: member.id, name })}
                                className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ROLES & PERMISSIONS TAB ──────────────────────────────────────── */}
        {activeTab === 'Roles & Permissions' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROLES.map(role => (
              <div key={role.name} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className={`w-5 h-5 ${role.color.split(' ')[0]}`} />
                  <h3 className="font-bold text-white">{role.name}</h3>
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold border ${role.color}`}>
                    {members.filter(m => (m.role || 'Viewer') === role.name).length} members
                  </span>
                </div>
                <div className="space-y-2">
                  {role.permissions.map(perm => (
                    <div key={perm} className="flex items-center gap-2 text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                      <span className="text-zinc-300">{perm}</span>
                    </div>
                  ))}
                  {/* Show what this role can't do */}
                  {ROLES[0].permissions.filter(p => !role.permissions.includes(p)).map(perm => (
                    <div key={perm} className="flex items-center gap-2 text-xs opacity-40">
                      <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span className="text-zinc-500">{perm}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── INVITE MODAL ──────────────────────────────────────────────────────── */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Invite Team Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Name</label>
                <input value={inviteForm.name} onChange={e => setInviteForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Full name (optional)" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Email Address *</label>
                <input type="email" value={inviteForm.email} onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="colleague@company.com" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Role</label>
                <select value={inviteForm.role} onChange={e => setInviteForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-success">
                  {ROLES.filter(r => r.name !== 'Owner').map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                </select>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Permissions: {ROLES.find(r => r.name === inviteForm.role)?.permissions.join(' · ')}
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowInviteModal(false)} className="flex-1 px-4 py-2.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-colors">Cancel</button>
              <button
                onClick={() => {
                  if (!inviteForm.email) { toast.error('Email is required'); return; }
                  inviteMutation.mutate(inviteForm);
                }}
                disabled={inviteMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-success hover:bg-success text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
              >
                {inviteMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Sending...</> : <><Send className="w-4 h-4" />Send Invite</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirm */}
      <ConfirmModal
        isOpen={!!confirmModal}
        title="Remove Team Member"
        message={`Remove ${confirmModal?.name} from your team? They will lose access to all team features immediately.`}
        confirmLabel="Remove Member"
        confirmVariant="danger"
        isLoading={removeMutation.isPending}
        onConfirm={() => removeMutation.mutate(confirmModal.memberId)}
        onClose={() => setConfirmModal(null)}
      />
    </div>
  );
}

