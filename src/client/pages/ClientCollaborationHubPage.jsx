import React, { useState } from 'react';
import { 
  MessageSquare, Hash, Search, Bell, Users, Video, Phone,
  Paperclip, Smile, Send, CheckCircle2, MoreVertical, FileText,
  Clock, Info, ChevronRight, X
} from 'lucide-react';

export default function ClientCollaborationHubPage() {
  const [activeChannel, setActiveChannel] = useState('project-alpha');
  const [showRightPane, setShowRightPane] = useState(true);

  const threads = [
    { id: 'project-alpha', name: 'Website Redesign', type: 'project', unread: 2 },
    { id: 'project-beta', name: 'Mobile App Dev', type: 'project', unread: 0 },
  ];

  const dms = [
    { id: 'u1', name: 'Sarah Jenkins', role: 'Frontend Dev', status: 'online' },
    { id: 'u2', name: 'Michael Chen', role: 'UX Designer', status: 'away' },
  ];

  return (
    <div className="h-[calc(100vh-80px)] bg-gray-50 text-gray-900 font-sans flex overflow-hidden rounded-2xl border border-gray-200 m-4">
      
      {/* LEFT PANE: Channels & DMs */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
        <div className="p-5 border-b border-gray-200">
          <h2 className="font-black text-gray-900 text-xl tracking-tight">Messages</h2>
          <div className="relative mt-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-vivid-lavender transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {/* Projects */}
          <div className="mb-6">
            <div className="px-5 flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Projects</span>
            </div>
            <div className="space-y-1 px-2">
              {threads.map(thread => (
                <button 
                  key={thread.id}
                  onClick={() => setActiveChannel(thread.id)}
                  className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between group transition-colors ${
                    activeChannel === thread.id ? 'bg-vivid-lavender/10 text-vivid-lavender' : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Hash className="w-4 h-4 shrink-0" />
                    <span className="truncate text-sm font-bold">{thread.name}</span>
                  </div>
                  {thread.unread > 0 && (
                    <span className="bg-vivid-lavender text-white text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                      {thread.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Messages */}
          <div>
            <div className="px-5 flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Direct Messages</span>
            </div>
            <div className="space-y-1 px-2">
              {dms.map(dm => (
                <button 
                  key={dm.id}
                  className="w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-gray-500 hover:bg-gray-100/50 hover:text-gray-700 transition-colors"
                >
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-900">
                      {dm.name.charAt(0)}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      dm.status === 'online' ? 'bg-vivid-green' : 'bg-zinc-500'
                    }`}></div>
                  </div>
                  <div className="text-left overflow-hidden">
                    <div className="truncate text-sm font-bold text-gray-700">{dm.name}</div>
                    <div className="truncate text-[10px] text-gray-400">{dm.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE PANE: Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-gray-50 relative">
        
        {/* Chat Header */}
        <div className="h-[72px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white/50">
          <div>
            <h3 className="font-black text-lg text-gray-900 flex items-center gap-2">
              <Hash className="w-5 h-5 text-vivid-lavender" />
              Website Redesign
            </h3>
            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-4 font-medium">
              <span>Project Discussion</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 3 Participants</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-vivid-lavender hover:bg-vivid-lavender/10 rounded-lg transition-colors"><Phone className="w-5 h-5" /></button>
            <button className="p-2 text-gray-500 hover:text-vivid-lavender hover:bg-vivid-lavender/10 rounded-lg transition-colors"><Video className="w-5 h-5" /></button>
            <div className="w-px h-6 bg-gray-100 mx-2"></div>
            <button 
              onClick={() => setShowRightPane(!showRightPane)}
              className={`p-2 rounded-lg transition-colors ${showRightPane ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          <div className="text-center text-xs font-bold text-gray-500 my-4 uppercase tracking-wider">
            Today, 10:42 AM
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-vivid-lavender flex items-center justify-center font-bold text-white shrink-0 shadow-lg shadow-vivid-lavender/20">
              SJ
            </div>
            <div className="max-w-[80%]">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-gray-900 text-sm">Sarah Jenkins</span>
                <span className="text-[10px] text-gray-400 font-medium">10:42 AM</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-600 leading-relaxed">
                Hi team, I've pushed the latest UI components to the repository. The new dark mode toggles should be fully functional now. Can you please review?
              </div>
            </div>
          </div>

          <div className="flex gap-4 flex-row-reverse">
            <div className="w-10 h-10 rounded-full bg-dark-purple border border-vivid-lavender/30 flex items-center justify-center font-bold text-white shrink-0">
              JD
            </div>
            <div className="max-w-[80%] flex flex-col items-end">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[10px] text-gray-400 font-medium">10:45 AM</span>
                <span className="font-bold text-gray-900 text-sm">You</span>
              </div>
              <div className="bg-vivid-lavender text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed shadow-lg shadow-vivid-lavender/20">
                Looks great Sarah! I'll review the PR this afternoon. Were there any changes needed to the Tailwind config for the new accent colors?
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-vivid-lavender flex items-center justify-center font-bold text-white shrink-0 shadow-lg shadow-vivid-lavender/20">
              SJ
            </div>
            <div className="max-w-[80%]">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-gray-900 text-sm">Sarah Jenkins</span>
                <span className="text-[10px] text-gray-400 font-medium">10:48 AM</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-600 leading-relaxed">
                Just a few minor additions to the color palette. I've attached the updated config file here.
              </div>
              <div className="mt-2 bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 w-64 hover:border-vivid-lavender/50 cursor-pointer transition-colors">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FileText className="w-5 h-5 text-vivid-lavender" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-gray-900 truncate">tailwind.config.js</p>
                  <p className="text-[10px] text-gray-400">2.4 KB</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-50 shrink-0 border-t border-gray-200">
          <div className="bg-white border border-gray-200 rounded-2xl flex flex-col focus-within:border-vivid-lavender focus-within:ring-1 focus-within:ring-vivid-lavender transition-all shadow-lg">
            <textarea 
              placeholder="Type your message..."
              className="w-full bg-transparent px-4 pt-4 pb-2 text-sm text-gray-900 placeholder-zinc-500 focus:outline-none resize-none min-h-[80px]"
            ></textarea>
            <div className="flex items-center justify-between px-3 pb-3">
              <div className="flex items-center gap-1 text-gray-500">
                <button className="p-2 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"><Paperclip className="w-4 h-4" /></button>
                <button className="p-2 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"><Smile className="w-4 h-4" /></button>
              </div>
              <button className="bg-vivid-lavender hover:bg-dark-purple text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-colors shadow-lg shadow-vivid-lavender/20">
                Send <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANE: Project Details (Collapsible) */}
      {showRightPane && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full shrink-0">
          <div className="h-[72px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
            <h3 className="font-black text-gray-900">Project Details</h3>
            <button onClick={() => setShowRightPane(false)} className="text-gray-400 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {/* Status Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-vivid-green/10 border border-vivid-green/20 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-vivid-green" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-vivid-green/20 text-vivid-green rounded border border-vivid-green/30">Active</span>
              </div>
              <h4 className="font-black text-gray-900 mb-1">Website Redesign</h4>
              <p className="text-xs text-gray-500 font-medium">Milestone 2 in progress</p>
              
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-sm">
                <span className="text-gray-400 font-bold">Budget</span>
                <span className="text-gray-900 font-black">$5,000</span>
              </div>
            </div>

            {/* Team */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Project Team</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-vivid-lavender flex items-center justify-center text-xs font-bold text-gray-900">SJ</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Sarah Jenkins</p>
                    <p className="text-[10px] text-gray-400">Freelancer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-900">MC</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Michael Chen</p>
                    <p className="text-[10px] text-gray-400">Freelancer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shared Files */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                Recent Files
                <button className="text-vivid-lavender hover:text-gray-900 capitalize text-[10px]">View All</button>
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-200">
                    <FileText className="w-4 h-4 text-gray-500 group-hover:text-vivid-lavender" />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="text-xs font-bold text-gray-900 truncate">tailwind.config.js</p>
                    <p className="text-[10px] text-gray-400">Today, 10:48 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-200">
                    <FileText className="w-4 h-4 text-gray-500 group-hover:text-vivid-lavender" />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="text-xs font-bold text-gray-900 truncate">mockup_v2.fig</p>
                    <p className="text-[10px] text-gray-400">Yesterday, 4:20 PM</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
