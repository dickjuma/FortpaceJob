import React, { useState } from 'react';
import { 
  Users, MessageSquare, Plus, Search, ThumbsUp, Heart, X, Send, 
  ArrowRight, ShieldCheck, Tag, Star, Activity, Clock
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

export default function CommunityForumPage() {
  const [threads, setThreads] = useState([
    { id: 1, title: 'Tips for converting client chats into funded milestones', category: 'Gig Strategy', likes: 24, replies: 12, author: 'Alex Rivera', role: 'Top Rated Plus', date: '3 hours ago' },
    { id: 2, title: 'How are agencies pricing Solidity audits recently?', category: 'Web3 / Contracts', likes: 18, replies: 8, author: 'Sarah Jenkins', role: 'Agency Owner', date: 'Yesterday' },
    { id: 3, title: 'Standard Node.js boilerplate guidelines for corporate builds', category: 'Engineering', likes: 42, replies: 28, author: 'Elena Rodriguez', role: 'Lead Developer', date: '3 days ago' },
  ]);

  const [activeModal, setActiveModal] = useState(null); // 'create'
  const [searchTerm, setSearchTerm] = useState('');
  
  const [threadForm, setThreadForm] = useState({
    title: '',
    category: 'Gig Strategy',
    text: ''
  });

  const handleCreateThread = (e) => {
    e.preventDefault();
    if (!threadForm.title.trim() || !threadForm.text.trim()) return;

    const newThread = {
      id: Date.now(),
      title: threadForm.title.trim(),
      category: threadForm.category,
      likes: 1, // author self-like
      replies: 0,
      author: 'Alex Morgan',
      role: 'Verified Elite',
      date: 'Just now'
    };

    setThreads([newThread, ...threads]);
    setActiveModal(null);
    toast.success('Discussion thread successfully published to community board!');
  };

  const handleLike = (id) => {
    setThreads(threads.map(t => t.id === id ? { ...t, likes: t.likes + 1 } : t));
    toast.success('Thread liked! ❤️');
  };

  const filteredThreads = threads.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-success" />
            Community Lounge
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Exchange project strategy tip-offs, discuss development stacks, and network with elite platform collaborators.
          </p>
        </div>
        <Button 
          variant="primary" 
          icon={<Plus size={18} />}
          onClick={() => setActiveModal('create')}
        >
          New Thread
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Forums Categories list */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-black text-text-primary tracking-widest uppercase border-b border-border pb-2">Forum Boards</h3>
            <div className="space-y-1">
              {[
                { name: 'Gig Strategy', count: 18 },
                { name: 'Web3 / Contracts', count: 8 },
                { name: 'Engineering', count: 32 },
                { name: 'General Chat', count: 54 },
              ].map(board => (
                <button 
                  key={board.name}
                  onClick={() => setSearchTerm(board.name)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-text-secondary hover:text-success hover:bg-success/5 transition-all flex justify-between items-center group"
                >
                  <span>{board.name}</span>
                  <span className="bg-light-gray group-hover:bg-success/20 group-hover:text-success px-2 py-0.5 rounded text-[10px] font-black">{board.count} threads</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Side: Discussions stream */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative max-w-xs mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -tranzinc-y-1/2 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search active discussions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-border rounded-xl bg-light-gray/40 text-sm focus:outline-none focus:border-success text-text-primary"
            />
          </div>

          <div className="space-y-4">
            {filteredThreads.map((thread) => (
              <Card key={thread.id} className="bg-white border border-border p-6 rounded-3xl shadow-sm hover:border-success/30 transition-all flex flex-col justify-between min-h-[160px]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border bg-success/10 text-success border-success/20">
                      {thread.category}
                    </span>
                    <span className="text-[10px] text-text-secondary font-bold flex items-center gap-1"><Clock size={12} /> {thread.date}</span>
                  </div>

                  <h3 className="font-black text-sm text-text-primary leading-snug hover:text-success transition-colors cursor-pointer">{thread.title}</h3>
                </div>

                <div className="pt-4 border-t border-border mt-4 flex justify-between items-center bg-transparent">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-light-gray flex items-center justify-center font-black text-[10px] text-text-secondary border border-border shrink-0">
                      {thread.author[0]}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-text-primary">{thread.author}</p>
                      <p className="text-[8px] font-black uppercase text-success tracking-widest mt-0.5">{thread.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-bold text-text-secondary">
                    <button onClick={() => handleLike(thread.id)} className="flex items-center gap-1.5 hover:text-[#e63946] transition-colors">
                      <Heart size={14} className="text-[#e63946]" />
                      <span>{thread.likes}</span>
                    </button>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare size={14} className="text-success" />
                      <span>{thread.replies} replies</span>
                    </span>
                  </div>
                </div>
              </Card>
            ))}

            {filteredThreads.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-text-secondary mx-auto mb-3" />
                <h4 className="font-bold text-text-primary">No discussions discovered</h4>
                <p className="text-xs text-text-secondary mt-1">Refine your board search parameters or start a new thread above.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* --- CREATE THREAD MODAL --- */}
      {activeModal === 'create' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <Card className="w-full max-w-lg shadow-2xl relative bg-white border border-border p-6 rounded-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
              <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
                <Plus className="w-5 h-5 text-success" />
                Start Discussion Thread
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-light-gray rounded-md transition-colors text-text-secondary"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Thread Subject / Title</label>
                <input 
                  type="text" 
                  value={threadForm.title} 
                  onChange={(e) => setThreadForm({ ...threadForm, title: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary"
                  placeholder="e.g. Standard billing terms for multi-currency contracts"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Category Board</label>
                <select
                  value={threadForm.category}
                  onChange={(e) => setThreadForm({ ...threadForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary appearance-none"
                >
                  <option value="Gig Strategy">Gig Strategy</option>
                  <option value="Web3 / Contracts">Web3 / Contracts</option>
                  <option value="Engineering">Engineering</option>
                  <option value="General Chat">General Chat</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Discussion Description / Body</label>
                <textarea 
                  rows={4} 
                  value={threadForm.text} 
                  onChange={(e) => setThreadForm({ ...threadForm, text: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary resize-none font-medium"
                  placeholder="Share details, questions, or boilerplates..."
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" variant="primary">Publish Thread</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
}
