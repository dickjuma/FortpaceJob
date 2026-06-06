// ClientWorkspacePage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layout, MessageSquare, Folder, CheckSquare,
  Users, ChevronDown, Plus, Search, FileText,
  Image as ImageIcon, MoreHorizontal, Send, X,
  CheckCircle
} from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

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

const FILES = [
  { name: 'Wireframes.pdf', type: 'pdf', icon: FileText, color: 'text-danger', bg: 'bg-danger-light' },
  { name: 'Logo_Final.png', type: 'image', icon: ImageIcon, color: 'text-accent', bg: 'bg-accent-light' },
  { name: 'Brand_Assets', type: 'folder', icon: Folder, color: 'text-accent', bg: 'bg-accent-light' }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
};
const cardHover = {
  rest: { y: 0, boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
  hover: { y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', transition: { duration: 0.2 } }
};
const buttonTap = { scale: 0.97 };

export default function ClientWorkspacePage() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, tasks, chat, files
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    // Mock send
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-surface-soft font-body flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 lg:py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-sm">
                <Layout className="w-6 h-6" />
              </div>
              Acme Corp Workspace
            </h1>
            <p className="text-ink-secondary text-sm mt-1">Centralized collaboration, task tracking, and team communication.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2 mr-2">
              <img src="https://i.pravatar.cc/150?u=you" alt="Team" className="w-8 h-8 rounded-full border-2 border-white" />
              <img src="https://i.pravatar.cc/150?u=1" alt="Team" className="w-8 h-8 rounded-full border-2 border-white" />
              <img src="https://i.pravatar.cc/150?u=2" alt="Team" className="w-8 h-8 rounded-full border-2 border-white" />
              <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-muted flex items-center justify-center text-[10px] font-semibold text-ink-tertiary">+4</div>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors">
              <Users className="w-4 h-4" /> Invite
            </button>
          </div>
        </div>
        {/* Navigation Tabs */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex border-b border-border overflow-x-auto gap-6">
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
                  "py-3 text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap border-b-2",
                  activeTab === tab.id ? "border-accent text-accent" : "border-transparent text-ink-tertiary hover:text-ink-primary"
                )}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Main Area */}
              <div className="lg:col-span-2 space-y-8">
                {/* Active Projects */}
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-display text-lg font-bold text-brand-900">Active Projects</h2>
                    <button className="text-sm font-medium text-accent flex items-center gap-1 hover:underline">
                      <Plus className="w-4 h-4" /> New Project
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {PROJECTS.map((project) => (
                      <motion.div
                        key={project.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={cardHover.hover}
                        className="bg-white border border-border rounded-2xl p-5 shadow-sm cursor-pointer transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-ink-primary">{project.name}</h3>
                          <span className={cn(
                            "inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wide",
                            project.status === 'In Progress' ? "bg-accent-light text-accent-dark" : "bg-accent-light text-accent-dark"
                          )}>{project.status}</span>
                        </div>
                        <div className="mb-4">
                          <div className="flex justify-between text-xs font-medium text-ink-tertiary mb-1">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-surface-muted h-1.5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-accent rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${project.progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                          <div className="flex -space-x-2">
                            {project.team.map((avatar, i) => (
                              <img key={i} src={avatar} alt="Team" className="w-6 h-6 rounded-full border border-white" />
                            ))}
                          </div>
                          <button className="text-ink-tertiary hover:text-ink-primary transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* To-Do List */}
                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-display text-lg font-bold text-brand-900 flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-accent" /> My Tasks
                    </h2>
                    <span className="text-xs font-medium text-ink-tertiary">{TASKS.filter(t => t.completed).length}/{TASKS.length} completed</span>
                  </div>
                  <div className="space-y-3">
                    {TASKS.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border border-border rounded-xl hover:bg-surface-soft transition-colors">
                        <div className="flex items-center gap-3">
                          <button className={cn(
                            "w-5 h-5 rounded flex items-center justify-center border",
                            task.completed ? "bg-accent border-accent text-white" : "border-border bg-white"
                          )}>
                            {task.completed && <CheckSquare className="w-3.5 h-3.5" />}
                          </button>
                          <div>
                            <p className={cn("text-sm font-medium text-ink-primary", task.completed && "line-through text-ink-tertiary")}>{task.title}</p>
                            <p className="text-xs text-ink-tertiary">{task.project}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-medium text-ink-tertiary bg-surface-muted px-2 py-0.5 rounded uppercase">{task.assignee}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Activity Stream */}
                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="font-display font-bold text-brand-900 mb-5">Activity Stream</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-light text-accent-dark flex items-center justify-center shrink-0">
                        <CheckSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm text-ink-secondary">
                          <strong className="text-ink-primary">Sarah M.</strong> completed task <span className="font-medium">Finalize Figma mockups</span>
                        </p>
                        <p className="text-[10px] font-medium text-ink-tertiary mt-1">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-light text-accent-dark flex items-center justify-center shrink-0">
                        <Folder className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm text-ink-secondary">
                          <strong className="text-ink-primary">Alex R.</strong> uploaded <span className="font-medium">api_docs.pdf</span>
                        </p>
                        <p className="text-[10px] font-medium text-ink-tertiary mt-1">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workspace Resources */}
                <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl p-6 text-white shadow-sm">
                  <h3 className="font-display font-bold mb-4">Workspace Resources</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-sm font-medium hover:underline flex items-center gap-2"><FileText className="w-4 h-4" /> Project Charter</a></li>
                    <li><a href="#" className="text-sm font-medium hover:underline flex items-center gap-2"><FileText className="w-4 h-4" /> Design System Guide</a></li>
                    <li><a href="#" className="text-sm font-medium hover:underline flex items-center gap-2"><Folder className="w-4 h-4" /> Shared Drive</a></li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="font-display text-lg font-bold text-brand-900">All Tasks</h2>
                  <span className="text-xs font-medium text-ink-tertiary">{TASKS.filter(t => t.completed).length}/{TASKS.length} completed</span>
                </div>
                <div className="space-y-3">
                  {TASKS.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border border-border rounded-xl hover:bg-surface-soft transition-colors">
                      <div className="flex items-center gap-3">
                        <button className={cn(
                          "w-5 h-5 rounded flex items-center justify-center border",
                          task.completed ? "bg-accent border-accent text-white" : "border-border bg-white"
                        )}>
                          {task.completed && <CheckSquare className="w-3.5 h-3.5" />}
                        </button>
                        <div>
                          <p className={cn("text-sm font-medium text-ink-primary", task.completed && "line-through text-ink-tertiary")}>{task.title}</p>
                          <p className="text-xs text-ink-tertiary">{task.project}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-medium text-ink-tertiary bg-surface-muted px-2 py-0.5 rounded uppercase">{task.assignee}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-[calc(100vh-16rem)] bg-white border border-border rounded-2xl shadow-sm flex flex-col"
            >
              <div className="p-4 border-b border-border flex justify-between items-center bg-surface-soft rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-brand-900"># General Chat</h3>
                  <span className="text-xs font-medium text-ink-tertiary">4 members</span>
                </div>
                <Search className="w-4 h-4 text-ink-tertiary" />
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {CHAT.map(msg => (
                  <div key={msg.id} className={cn("flex gap-3 max-w-[85%]", msg.isYou ? "ml-auto flex-row-reverse" : "")}>
                    <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full shrink-0" />
                    <div>
                      <div className={cn("flex items-center gap-2 mb-1", msg.isYou ? "justify-end" : "")}>
                        <span className="text-xs font-semibold text-ink-primary">{msg.sender}</span>
                        {!msg.isYou && <span className="text-[10px] font-medium text-accent bg-accent-light px-1.5 rounded">{msg.role}</span>}
                        <span className="text-[10px] font-medium text-ink-tertiary">{msg.time}</span>
                      </div>
                      <div className={cn(
                        "p-3 rounded-xl text-sm font-medium",
                        msg.isYou ? "bg-accent text-white rounded-tr-sm" : "bg-surface-soft text-ink-primary rounded-tl-sm border border-border"
                      )}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border">
                <div className="relative">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Message team..."
                    className="w-full h-10 border border-border rounded-lg pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-accent hover:bg-accent-dark text-white rounded-md transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'files' && (
            <motion.div
              key="files"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display text-lg font-bold text-brand-900 flex items-center gap-2">
                    <Folder className="w-5 h-5 text-accent" /> Shared Files
                  </h2>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-accent-light text-accent-dark rounded-lg text-sm font-medium transition-colors hover:bg-accent/20">
                    <Plus className="w-4 h-4" /> Upload
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {FILES.map((file) => (
                    <motion.div
                      key={file.name}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
                      className="border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-accent/30 transition-all cursor-pointer group"
                    >
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105", file.bg)}>
                        <file.icon className={cn("w-6 h-6", file.color)} />
                      </div>
                      <p className="text-sm font-medium text-ink-primary truncate w-full">{file.name}</p>
                      <p className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wide mt-1">{file.type}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
