import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Settings, CheckCircle, 
  XCircle, Clock, MessageSquare, MoreHorizontal,
  Mail, Shield, Building, Filter, Search,
  Briefcase, Check, X
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_MEMBERS = [
  { id: 1, name: 'Sarah Connor', email: 'sarah@skynet.com', role: 'Admin', status: 'Active', avatar: 'S' },
  { id: 2, name: 'John Doe', email: 'john@skynet.com', role: 'Manager', status: 'Active', avatar: 'J' },
  { id: 3, name: 'Jane Smith', email: 'jane@skynet.com', role: 'Viewer', status: 'Pending', avatar: 'J' },
  { id: 4, name: 'Miles Dyson', email: 'miles@skynet.com', role: 'Manager', status: 'Active', avatar: 'M' }
];

const MOCK_APPROVALS = [
  { id: 101, candidate: 'Alex Freeman', role: 'Senior React Dev', rate: '$85/hr', status: 'Pending', requestedBy: 'John Doe', matchScore: 92 },
  { id: 102, candidate: 'Sam Taylor', role: 'UI/UX Designer', rate: '$60/hr', status: 'Approved', requestedBy: 'Sarah Connor', matchScore: 88 },
  { id: 103, candidate: 'Jordan Lee', role: 'Backend Engineer', rate: '$95/hr', status: 'Rejected', requestedBy: 'Miles Dyson', matchScore: 75 }
];

const MOCK_NOTES = [
  { id: 1, author: 'John Doe', authorInitial: 'J', candidate: 'Alex Freeman', content: 'Strong technical skills, but requested rate is on the higher end. Should we negotiate?', time: '2 hours ago' },
  { id: 2, author: 'Sarah Connor', authorInitial: 'S', candidate: 'Sam Taylor', content: 'Loved the portfolio. Approved the hiring request. Let\'s proceed with the offer.', time: '1 day ago' },
  { id: 3, author: 'Miles Dyson', authorInitial: 'M', candidate: 'Jordan Lee', content: 'Not enough experience with our specific microservices architecture. Let\'s keep looking.', time: '2 days ago' }
];

// --- COMPONENTS ---

export default function ClientTeamWorkspacePage() {
  const [activeTab, setActiveTab] = useState('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const TABS = [
    { id: 'members', label: 'Team Members', icon: Users, count: MOCK_MEMBERS.length },
    { id: 'approvals', label: 'Hiring Approvals', icon: Briefcase, count: 1 },
    { id: 'notes', label: 'Internal Notes', icon: MessageSquare, count: 3 }
  ];

  return (
    <div className="min-h-screen bg-surface dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans pb-12">
      
      {/* Header Area */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pt-24 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center text-brand-600 dark:text-brand-400">
                <Building className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Skynet Innovations</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Enterprise Workspace
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <button className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium hover:bg-surface dark:hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <button 
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Invite Member
              </button>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mt-8 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={"pb-4 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap " +
                    (isActive 
                      ? "border-brand-600 text-brand-600 dark:text-brand-400" 
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300")}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  <span className={"ml-1 px-2 py-0.5 rounded-full text-xs " +
                    (isActive ? "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400")}>
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
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -tranzinc-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <button className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium hover:bg-surface dark:hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2">
                  <Filter className="w-4 h-4" /> Filter
                </button>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-surface dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 uppercase text-xs font-semibold">
                      <tr>
                        <th className="px-6 py-4">Member</th>
                        <th className="px-6 py-4">Role / Permissions</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {MOCK_MEMBERS.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).map((member) => (
                        <tr key={member.id} className="hover:bg-surface dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold">
                                {member.avatar}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-white">{member.name}</div>
                                <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium">
                              <Shield className="w-3 h-3" /> {member.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {member.status === 'Active' ? (
                              <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium">
                                <CheckCircle className="w-4 h-4" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-xs font-medium">
                                <Clock className="w-4 h-4" /> Pending Invite
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                              <MoreHorizontal className="w-5 h-5" />
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
                  {MOCK_APPROVALS.map((approval) => (
                    <div key={approval.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{approval.candidate}</h3>
                          <span className="px-2 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-xs font-semibold rounded-md">
                            {approval.matchScore}% Match
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-3">
                          <Briefcase className="w-4 h-4" /> {approval.role} • {approval.rate}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Requested by <span className="font-medium text-gray-700 dark:text-gray-300">{approval.requestedBy}</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {approval.status === 'Pending' && (
                          <>
                            <button className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 transition-colors">
                              <X className="w-5 h-5" />
                            </button>
                            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm">
                              <Check className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {approval.status === 'Approved' && (
                          <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" /> Approved
                          </div>
                        )}
                        {approval.status === 'Rejected' && (
                          <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium flex items-center gap-2">
                            <XCircle className="w-4 h-4" /> Rejected
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Workflow Summary Widget */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm h-fit">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Hiring Workflow</h3>
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-tranzinc-x-px md:before:mx-auto md:before:tranzinc-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-800 before:to-transparent">
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white dark:border-gray-900 bg-brand-500 text-white shadow shrink-0 md:order-1 md:group-odd:-tranzinc-x-1/2 md:group-even:tranzinc-x-1/2 z-10">
                        <Check className="w-3 h-3" />
                      </div>
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] text-sm ml-4 md:ml-0 md:group-odd:text-right">
                        <p className="font-medium">Manager Review</p>
                        <p className="text-xs text-gray-500">Completed</p>
                      </div>
                    </div>
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white dark:border-gray-900 bg-brand-100 dark:bg-brand-900/40 text-brand-600 shadow shrink-0 md:order-1 md:group-odd:-tranzinc-x-1/2 md:group-even:tranzinc-x-1/2 z-10">
                        <div className="w-2 h-2 rounded-full bg-brand-600" />
                      </div>
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] text-sm ml-4 md:ml-0 md:group-even:text-right">
                        <p className="font-medium">Team Lead Approval</p>
                        <p className="text-xs text-brand-600 dark:text-brand-400">1 Pending</p>
                      </div>
                    </div>
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow shrink-0 md:order-1 md:group-odd:-tranzinc-x-1/2 md:group-even:tranzinc-x-1/2 z-10">
                      </div>
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] text-sm ml-4 md:ml-0 md:group-odd:text-right text-gray-400">
                        <p className="font-medium">Final Sign-off</p>
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
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-[600px]">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-surface dark:bg-gray-800/50">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-gray-500" /> Hiring Discussions
                  </h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {MOCK_NOTES.map((note) => (
                    <div key={note.id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 shrink-0">
                        {note.authorInitial}
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-semibold text-sm text-gray-900 dark:text-white">{note.author}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{note.time}</span>
                        </div>
                        <div className="text-xs font-medium text-brand-600 dark:text-brand-400 mb-2">
                          Re: {note.candidate}
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-b-xl rounded-tr-xl text-sm text-gray-700 dark:text-gray-300 leading-relaxed border border-gray-200 dark:border-gray-800/50">
                          {note.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <div className="relative">
                    <textarea 
                      placeholder="Add an internal note... (@mention team members)"
                      className="w-full bg-surface dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none min-h-[80px]"
                    ></textarea>
                    <button className="absolute right-3 bottom-3 p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Invite Modal (Simple Overlay Demo) */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-800"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <h3 className="text-lg font-bold">Invite Team Member</h3>
                <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input type="email" placeholder="colleague@company.com" className="w-full px-4 py-2 bg-surface dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                  <select className="w-full px-4 py-2 bg-surface dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Viewer</option>
                  </select>
                </div>
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm mt-4"
                >
                  Send Invitation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
