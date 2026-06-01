import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Layout, MessageSquare, Folder, CheckSquare, 
  Users, ChevronDown, Plus, Search, FileText,
  Image as ImageIcon, MoreHorizontal, Send
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const PROJECTS = [
  { id: 'p1', name: 'E-Commerce App Redesign', status: 'In Progress', progress: 65, team: ['https://i.pravatar.cc/150?u=1', 'https://i.pravatar.cc/150?u=2', 'https://i.pravatar.cc/150?u=3'] },
  { id: 'p2', name: 'Marketing Site Next.js', status: 'Review', progress: 90, team: ['https://i.pravatar.cc/150?u=4', 'https://i.pravatar.cc/150?u=5'] }
];

const TASKS = [
  { id: 1, title: 'Finalize Figma mockups', assignee: 'Sarah M.', project: 'E-Commerce App', completed: true },
  { id: 2, title: 'Implement Stripe Checkout', assignee: 'Alex R.', project: 'E-Commerce App', completed: false },
  { id: 3, title: 'Optimize Core Web Vitals', assignee: 'David K.', project: 'Marketing Site', completed: false }
];

const CHAT = [
  { id: 1, sender: 'Alex Rivera', role: 'Freelancer', avatar: 'https://i.pravatar.cc/150?u=2', text: 'I\'ve pushed the Stripe integration to staging.', time: '10:42 AM' },
  { id: 2, sender: 'You', role: 'Client', avatar: 'https://i.pravatar.cc/150?u=you', text: 'Great, I will review it this afternoon. Were there any issues with the webhooks?', time: '10:45 AM', isYou: true },
  { id: 3, sender: 'Alex Rivera', role: 'Freelancer', avatar: 'https://i.pravatar.cc/150?u=2', text: 'All smooth! The endpoints are verified.', time: '10:47 AM' }
];

export default function ClientWorkspacePage() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, tasks, chat, files
  const [chatInput, setChatInput] = useState('');

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24 flex flex-col">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-6 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#14a800] rounded-xl flex items-center justify-center text-white shadow-sm">
                <Layout className="w-6 h-6" />
              </div>
              Acme Corp Workspace
            </h1>
            <p className="text-zinc-500 font-medium">Centralized collaboration, task tracking, and team communication.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2 mr-4">
              <img src="https://i.pravatar.cc/150?u=you" alt="Team" className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900" />
              <img src="https://i.pravatar.cc/150?u=1" alt="Team" className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900" />
              <img src="https://i.pravatar.cc/150?u=2" alt="Team" className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900" />
              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500">+4</div>
            </div>
            <button className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2">
              <Users className="w-4 h-4" /> Invite
            </button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 mt-6">
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto custom-scrollbar gap-8">
            {[
              { id: 'overview', label: 'Overview', icon: Layout },
              { id: 'tasks', label: 'Tasks', icon: CheckSquare },
              { id: 'chat', label: 'Team Chat', icon: MessageSquare },
              { id: 'files', label: 'Files', icon: Folder },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "py-3 text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap border-b-2",
                  activeTab === tab.id ? "border-[#14a800]/20 text-[#14a800] dark:text-[#14a800]" : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                )}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Workspace Layout - Grid based on active tab */}
        <div className={cn("grid gap-8 h-full", activeTab === 'overview' ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1")}>
          
          {/* Main Area (Projects/Tasks) */}
          <div className={cn("space-y-8", activeTab === 'overview' ? "lg:col-span-2" : "hidden lg:block")}>
            
            {(activeTab === 'overview' || activeTab === 'tasks') && (
              <>
                {/* Active Projects */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Active Projects</h2>
                    <button className="text-sm font-bold text-[#14a800] flex items-center gap-1"><Plus className="w-4 h-4" /> New Project</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PROJECTS.map(project => (
                      <div key={project.id} className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm cursor-pointer hover:border-[#14a800]/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-zinc-900 dark:text-white">{project.name}</h3>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider",
                            project.status === 'In Progress' ? "bg-[#14a800]/5 text-[#14a800] dark:bg-[#14a800]/20 dark:text-[#14a800]" : "bg-emerald-50 text-emerald-700 dark:bg-success/20 dark:text-success"
                          )}>{project.status}</span>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-xs font-bold text-zinc-500 mb-1">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-[#14a800] rounded-full" style={{ width: `${project.progress}%` }}></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                          <div className="flex -space-x-2">
                            {project.team.map((avatar, i) => (
                              <img key={i} src={avatar} alt="Team" className="w-6 h-6 rounded-full border border-white dark:border-zinc-900" />
                            ))}
                          </div>
                          <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* To-Do List */}
                <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-[#14a800]" /> My Tasks
                    </h2>
                    <span className="text-xs font-bold text-zinc-500">{TASKS.filter(t=>t.completed).length}/{TASKS.length} completed</span>
                  </div>

                  <div className="space-y-3">
                    {TASKS.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-3 border border-zinc-100 dark:border-zinc-800 rounded-xl hover:bg-surface dark:hover:bg-zinc-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <button className={cn(
                            "w-5 h-5 rounded flex items-center justify-center border",
                            task.completed ? "bg-[#14a800] border-[#14a800]/20 text-white" : "border-zinc-300 dark:border-zinc-600 bg-transparent"
                          )}>
                            {task.completed && <CheckSquare className="w-3.5 h-3.5" />}
                          </button>
                          <div>
                            <p className={cn("text-sm font-bold text-zinc-900 dark:text-white", task.completed && "line-through text-zinc-400 dark:text-zinc-500")}>{task.title}</p>
                            <p className="text-xs font-medium text-zinc-500">{task.project}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded uppercase">{task.assignee}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {(activeTab === 'chat') && (
              <div className="h-[calc(100vh-16rem)] bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-surface/50 dark:bg-surface-dark/50 rounded-t-3xl">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-zinc-900 dark:text-white"># General Chat</h3>
                    <span className="text-xs font-bold text-zinc-500">4 members</span>
                  </div>
                  <Search className="w-4 h-4 text-zinc-400" />
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {CHAT.map(msg => (
                    <div key={msg.id} className={cn("flex gap-4 max-w-[85%]", msg.isYou ? "ml-auto flex-row-reverse" : "")}>
                      <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full shrink-0" />
                      <div>
                        <div className={cn("flex items-center gap-2 mb-1", msg.isYou ? "justify-end" : "")}>
                          <span className="text-xs font-bold text-zinc-900 dark:text-white">{msg.sender}</span>
                          {!msg.isYou && <span className="text-[10px] font-bold text-[#14a800] bg-[#14a800]/5 dark:bg-[#14a800]/10 px-1.5 rounded">{msg.role}</span>}
                          <span className="text-[10px] font-medium text-zinc-400">{msg.time}</span>
                        </div>
                        <div className={cn(
                          "p-3 rounded-2xl text-sm font-medium",
                          msg.isYou ? "bg-[#14a800] text-white rounded-tr-sm" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-tl-sm"
                        )}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Message team..."
                      className="w-full bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-4 pr-12 py-3 text-sm font-medium outline-none focus:border-[#14a800]/20"
                    />
                    <button className="absolute right-2 top-1/2 -tranzinc-y-1/2 p-2 bg-[#14a800] hover:bg-[#118a00] text-white rounded-lg transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {(activeTab === 'files') && (
              <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm min-h-[60vh]">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Folder className="w-5 h-5 text-[#14a800]" /> Shared Files
                  </h2>
                  <button className="px-4 py-2 bg-[#14a800]/5 dark:bg-[#14a800]/10 text-[#14a800] dark:text-[#14a800] font-bold rounded-lg text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Upload
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Wireframes.pdf', type: 'pdf', icon: FileText, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
                    { name: 'Logo_Final.png', type: 'image', icon: ImageIcon, color: 'text-success', bg: 'bg-emerald-50 dark:bg-success/10' },
                    { name: 'Brand_Assets', type: 'folder', icon: Folder, color: 'text-[#14a800]', bg: 'bg-[#14a800]/5 dark:bg-[#14a800]/10' }
                  ].map(file => (
                    <div key={file.name} className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-[#14a800]/50 transition-colors cursor-pointer group">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110", file.bg)}>
                        <file.icon className={cn("w-6 h-6", file.color)} />
                      </div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white truncate w-full">{file.name}</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1">{file.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar (Activity / Quick Links) */}
          {activeTab === 'overview' && (
            <div className="space-y-6 hidden lg:block">
              
              {/* Activity Stream */}
              <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                <h3 className="font-bold text-zinc-900 dark:text-white mb-6">Activity Stream</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-success/20 text-success dark:text-success flex items-center justify-center shrink-0">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        <strong className="text-zinc-900 dark:text-white">Sarah M.</strong> completed task <span className="font-medium">Finalize Figma mockups</span>
                      </p>
                      <p className="text-[10px] font-bold text-zinc-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#14a800]/10 dark:bg-[#14a800]/20 text-[#14a800] dark:text-[#14a800] flex items-center justify-center shrink-0">
                      <Folder className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        <strong className="text-zinc-900 dark:text-white">Alex R.</strong> uploaded <span className="font-medium">api_docs.pdf</span>
                      </p>
                      <p className="text-[10px] font-bold text-zinc-400 mt-1">5 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gradient-to-br from-[#14a800] to-[#118a00] rounded-3xl p-6 text-white shadow-md">
                <h3 className="font-bold mb-4">Workspace Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm font-medium hover:underline flex items-center gap-2"><FileText className="w-4 h-4" /> Project Charter</a></li>
                  <li><a href="#" className="text-sm font-medium hover:underline flex items-center gap-2"><FileText className="w-4 h-4" /> Design System Guide</a></li>
                  <li><a href="#" className="text-sm font-medium hover:underline flex items-center gap-2"><Folder className="w-4 h-4" /> Shared Drive</a></li>
                </ul>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
