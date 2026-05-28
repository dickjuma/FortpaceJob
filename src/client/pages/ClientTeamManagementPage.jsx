import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Shield, Mail, CheckCircle2, Clock, 
  Settings, MoreVertical, Plus, Filter, Search,
  Briefcase, Activity, AlertCircle
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const TEAM_MEMBERS = [
  { id: 1, name: 'Sarah Mitchell', email: 'sarah@techflow.io', role: 'Owner', department: 'Executive', activeProjects: 12, status: 'Active' },
  { id: 2, name: 'David Kim', email: 'david@techflow.io', role: 'Hiring Manager', department: 'Engineering', activeProjects: 4, status: 'Active' },
  { id: 3, name: 'Alex Rivera', email: 'alex@techflow.io', role: 'Recruiter', department: 'HR', activeProjects: 8, status: 'Active' },
  { id: 4, name: 'Emma Roberts', email: 'emma@techflow.io', role: 'Finance', department: 'Finance', activeProjects: 0, status: 'Invited' },
];

const ROLES = [
  { name: 'Owner', permissions: ['Post jobs', 'Hire freelancers', 'Approve payments', 'View analytics', 'Manage contracts', 'Manage team'] },
  { name: 'Hiring Manager', permissions: ['Post jobs', 'Hire freelancers', 'View analytics', 'Manage contracts'] },
  { name: 'Recruiter', permissions: ['Post jobs', 'View analytics'] },
  { name: 'Finance', permissions: ['Approve payments', 'View analytics'] },
  { name: 'Viewer', permissions: ['View analytics'] },
];

export default function ClientTeamManagementPage() {
  const [activeTab, setActiveTab] = useState('members'); // members, permissions, approvals, activity
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
              <Users className="w-8 h-8 text-brand-500" /> Enterprise Team Management
            </h1>
            <p className="text-zinc-500 font-medium">Collaborate on hiring, manage permissions, and track approvals.</p>
          </div>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <Mail className="w-5 h-5" /> Invite Member
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex bg-zinc-200/50 dark:bg-zinc-800/50 p-1 rounded-xl mb-8 overflow-x-auto custom-scrollbar">
          {[
            { id: 'members', label: 'Team Members', icon: Users },
            { id: 'permissions', label: 'Roles & Permissions', icon: Shield },
            { id: 'approvals', label: 'Approval Workflows', icon: CheckCircle2 },
            { id: 'activity', label: 'Activity Log', icon: Activity },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap",
                activeTab === tab.id ? "bg-white dark:bg-surface-dark text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          
          {activeTab === 'members' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -tranzinc-y-1/2" />
                  <input type="text" placeholder="Search team members..." className="pl-9 pr-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium outline-none focus:border-brand-500 w-full shadow-sm" />
                </div>
                <button className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 shadow-sm flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filter by Role
                </button>
              </div>

              <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-surface/50 dark:bg-surface-dark/50">
                        <th className="py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Name & Email</th>
                        <th className="py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Role & Dept</th>
                        <th className="py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Projects</th>
                        <th className="py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                        <th className="py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TEAM_MEMBERS.map(member => (
                        <tr key={member.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-surface dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 flex items-center justify-center font-bold text-sm">
                                {member.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-zinc-900 dark:text-white">{member.name}</p>
                                <p className="text-xs font-medium text-zinc-500">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-brand-500" /> {member.role}</p>
                            <p className="text-xs font-medium text-zinc-500">{member.department}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                              <Briefcase className="w-4 h-4 text-zinc-400" /> {member.activeProjects}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={cn(
                              "px-2 py-1 text-xs font-bold rounded-md",
                              member.status === 'Active' ? "bg-emerald-100 text-emerald-700 dark:bg-success/20 dark:text-success" : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                            )}>
                              {member.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'permissions' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ROLES.map(role => (
                <div key={role.name} className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-brand-500" /> {role.name}
                    </h3>
                    <button className="text-xs font-bold text-brand-600 hover:underline">Edit</button>
                  </div>
                  <ul className="space-y-3 flex-1 mb-6">
                    {role.permissions.map(perm => (
                      <li key={perm} className="flex items-start gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" /> {perm}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs font-bold text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                    {TEAM_MEMBERS.filter(m => m.role === role.name).length} member(s) assigned
                  </p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'approvals' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Active Workflows</h2>
                    <p className="text-sm font-medium text-zinc-500">Require specific roles to approve actions.</p>
                  </div>
                  <button className="px-4 py-2 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 font-bold rounded-lg text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" /> New Rule
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl flex items-center justify-between bg-surface dark:bg-zinc-800/50">
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">Contract Offers &gt; $5,000</h4>
                      <p className="text-xs font-medium text-zinc-500 mt-1">Requires approval from <span className="font-bold text-brand-600">Finance</span> before sending.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:tranzinc-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-brand-600"></div>
                    </label>
                  </div>
                  
                  <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl flex items-center justify-between bg-surface dark:bg-zinc-800/50">
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">Milestone Payments</h4>
                      <p className="text-xs font-medium text-zinc-500 mt-1">Requires approval from <span className="font-bold text-brand-600">Hiring Manager</span> before releasing funds.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:tranzinc-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-brand-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Team Activity Log</h2>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-tranzinc-x-px md:before:mx-auto md:before:tranzinc-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 dark:before:via-zinc-800 before:to-transparent">
                
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-zinc-900 bg-success text-white shadow shrink-0 md:order-1 md:group-odd:-tranzinc-x-1/2 md:group-even:tranzinc-x-1/2 z-10">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-surface dark:bg-zinc-800/50 shadow-sm ml-4 md:ml-0 md:group-odd:mr-4 md:group-even:ml-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-zinc-900 dark:text-white">Payment Approved</span>
                      <span className="text-[10px] font-bold text-zinc-400">2 mins ago</span>
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                      <strong className="text-zinc-900 dark:text-white">Emma Roberts</strong> approved milestone payment of $1,200 for contract #CTR-092.
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-zinc-900 bg-brand-500 text-white shadow shrink-0 md:order-1 md:group-odd:-tranzinc-x-1/2 md:group-even:tranzinc-x-1/2 z-10">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-surface dark:bg-zinc-800/50 shadow-sm ml-4 md:ml-0 md:group-odd:mr-4 md:group-even:ml-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-zinc-900 dark:text-white">Team Member Invited</span>
                      <span className="text-[10px] font-bold text-zinc-400">1 hour ago</span>
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                      <strong className="text-zinc-900 dark:text-white">Sarah Mitchell</strong> invited emma@techflow.io as <span className="font-bold">Finance</span>.
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* Invite Modal Overlay */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dark/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-surface-dark rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Invite Team Member</h3>
                <button onClick={() => setShowInviteModal(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><Plus className="w-6 h-6 rotate-45" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2 block">Email Address</label>
                  <input type="email" placeholder="colleague@company.com" className="w-full bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-brand-500" />
                </div>
                <div>
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2 block">Role</label>
                  <select className="w-full bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-500">
                    {ROLES.map(r => <option key={r.name}>{r.name}</option>)}
                  </select>
                </div>
                <div className="pt-4">
                  <button className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition-all">Send Invitation</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
