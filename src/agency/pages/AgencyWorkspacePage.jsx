import React, { useState } from 'react';
import { 
  Building, Announcement, Users, Briefcase, Bell, Send, 
  Layers, Settings, ChevronRight, Activity, ArrowUpRight, MessageSquare, Zap, Clock, ShieldCheck
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

export default function AgencyWorkspacePage() {
  const [announcements, setAnnouncements] = useState([
    { id: 1, author: 'Elena Rodriguez', role: 'Project Manager', date: '2 hours ago', text: 'Reminder: The First National Bank UI review is scheduled for tomorrow at 10 AM PST. Please make sure the staging builds are fully compiled.' },
    { id: 2, author: 'Sarah Jenkins', role: 'Lead Developer', date: 'Yesterday', text: 'All developers please update their local setups to Node v20 LTS. Standard CI/CD workflows are being migrated this evening.' }
  ]);

  const [newPostText, setNewPostText] = useState('');
  
  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: Date.now(),
      author: 'Alex Morgan', // Mocking current user
      role: 'Agency Administrator',
      date: 'Just now',
      text: newPostText.trim()
    };

    setAnnouncements([newPost, ...announcements]);
    setNewPostText('');
    toast.success('Announcement posted to team workspace!');
  };

  const agencyStats = [
    { label: 'Agency Growth', value: '+24% QoQ', icon: ArrowUpRight, color: 'text-success', bg: 'bg-success/15' },
    { label: 'Billing Efficiency', value: '92.4%', icon: Zap, color: 'text-[#14a800]', bg: 'bg-[#14a800]/5' },
    { label: 'Active Roster Count', value: '12 Developers', icon: Users, color: 'text-success', bg: 'bg-success/10' },
  ];

  const activities = [
    { user: 'Sarah Jenkins', action: 'pushed to main', target: 'nexis-migration-suite', time: '12 mins ago' },
    { user: 'Michael Chen', action: 'updated assets in Figma', target: 'mobile-banking-redesign', time: '45 mins ago' },
    { user: 'Elena Rodriguez', action: 'approved Milestone 2 milestone payment', target: 'SaaS Billing Middleware', time: '2 hours ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header / Brand Title */}
      <div className="bg-[#222222] border border-border rounded-[24px] p-8 shadow-sm relative overflow-hidden mb-8">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-success/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-success/20 text-success text-xs font-black rounded-full uppercase tracking-widest border border-success/30">Enterprise Workspace</span>
              <span className="flex items-center gap-1 text-xs text-white/70"><ShieldCheck className="w-3.5 h-3.5 text-success" /> Verified Agency</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Acme Digital Workspace</h1>
            <p className="text-sm text-white/75 mt-1 font-medium">Collaborate on deliverables, share files, and view operational updates globally.</p>
          </div>
          <button className="px-6 py-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-all border border-white/20">
            Workspace Configuration
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {agencyStats.map((stat, idx) => (
          <Card key={idx} className="p-6 bg-white border border-border shadow-sm flex items-center gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Announcements & Broadcast */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Post Broadcast Card */}
          <Card className="bg-white border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-base font-black text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
              <Bell className="w-5 h-5 text-success animate-swing" />
              Broadcast Announcement
            </h3>
            
            <form onSubmit={handlePostAnnouncement} className="space-y-4">
              <textarea 
                rows={3}
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Post a message or instruction to the agency feed..."
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary resize-none font-medium"
                required
              />
              <div className="flex justify-end">
                <Button type="submit" variant="primary" icon={<Send size={16} />}>
                  Post to Board
                </Button>
              </div>
            </form>
          </Card>

          {/* Announcements List */}
          <div className="space-y-4">
            <h3 className="text-sm font-black tracking-widest uppercase text-text-secondary">Workspace Feed</h3>
            
            {announcements.map((post) => (
              <Card key={post.id} className="bg-white border border-border p-6 rounded-2xl shadow-sm hover:border-success/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center font-black text-sm shrink-0">
                    {post.author[0]}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-black text-text-primary">{post.author}</h4>
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{post.role}</p>
                      </div>
                      <span className="text-xs text-text-secondary font-bold flex items-center gap-1"><Clock size={12} /> {post.date}</span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed font-medium">{post.text}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

        </div>

        {/* Right Column: Operational Activity Stream */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-base font-black text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
              <Activity className="w-5 h-5 text-success" />
              Activity Monitor
            </h3>
            
            <div className="space-y-6">
              {activities.map((act, index) => (
                <div key={index} className="flex gap-3 relative last:before:hidden before:absolute before:left-5 before:top-10 before:bottom-0 before:w-0.5 before:bg-border">
                  <div className="w-10 h-10 rounded-full bg-light-gray flex items-center justify-center font-black text-xs shrink-0 border border-border z-10">
                    {act.user[0]}
                  </div>
                  <div className="text-xs space-y-1 py-1">
                    <p className="font-bold text-text-primary">
                      {act.user} <span className="text-text-secondary font-medium">{act.action}</span> <span className="text-success font-black">{act.target}</span>
                    </p>
                    <p className="text-[10px] text-text-secondary font-bold flex items-center gap-1"><Clock size={10} /> {act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
