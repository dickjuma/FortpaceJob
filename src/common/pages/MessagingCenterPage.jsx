import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Phone, Video, MoreVertical, Paperclip, 
  Smile, Send, Mic, FileText, Check, CheckCheck,
  ChevronLeft, Image as ImageIcon, Folder
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const CONVERSATIONS = [
  { id: 1, name: 'Alex Rivera', role: 'Freelancer', lastMessage: 'I just pushed the latest changes to staging.', time: '10:42 AM', unread: 2, avatar: 'https://i.pravatar.cc/150?u=a1', online: true },
  { id: 2, name: 'Sarah Mitchell', role: 'Client', lastMessage: 'Great work! Let\'s proceed with the next milestone.', time: 'Yesterday', unread: 0, avatar: 'https://i.pravatar.cc/150?u=s1', online: false },
  { id: 3, name: 'Design Squad (Group)', role: 'Team', lastMessage: 'David: Has anyone seen the updated brand guidelines?', time: 'Tue', unread: 0, avatar: 'https://i.pravatar.cc/150?u=g1', online: true }
];

const MESSAGES = [
  { id: 1, sender: 'Alex Rivera', text: 'Hey! I\'ve finished the initial React setup.', time: '10:30 AM', isMe: false, status: 'read' },
  { id: 2, sender: 'Me', text: 'Awesome. Did you run into any issues with the Tailwind configuration?', time: '10:32 AM', isMe: true, status: 'read' },
  { id: 3, sender: 'Alex Rivera', text: 'No issues. It went smoothly. I just pushed the latest changes to staging.', time: '10:42 AM', isMe: false, status: 'read' }
];

export default function MessagingCenterPage() {
  const [activeChat, setActiveChat] = useState(CONVERSATIONS[0]);
  const [messageInput, setMessageInput] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="h-screen bg-surface dark:bg-surface-dark font-sans flex flex-col overflow-hidden">
      
      {/* Top Navigation */}
      <div className="h-16 bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 shrink-0 z-20 shadow-sm">
        <h1 className="text-xl font-black text-brand-600 dark:text-brand-400">forte. <span className="text-zinc-900 dark:text-white font-bold ml-2">Messages</span></h1>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Conversations List */}
        <div className={cn(
          "w-full md:w-80 lg:w-96 bg-white dark:bg-surface-dark border-r border-zinc-200 dark:border-zinc-800 flex flex-col shrink-0 transition-transform absolute md:relative z-10 h-full",
          showSidebar ? "tranzinc-x-0" : "-tranzinc-x-full md:tranzinc-x-0"
        )}>
          
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {CONVERSATIONS.map(conv => (
              <div 
                key={conv.id} 
                onClick={() => { setActiveChat(conv); setShowSidebar(false); }}
                className={cn(
                  "p-4 flex items-start gap-3 cursor-pointer transition-colors border-b border-zinc-100 dark:border-zinc-800/50",
                  activeChat.id === conv.id ? "bg-brand-50 dark:bg-brand-500/10" : "hover:bg-surface dark:hover:bg-zinc-800/50"
                )}
              >
                <div className="relative shrink-0">
                  <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover" />
                  {conv.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-white dark:border-zinc-900 rounded-full"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={cn("text-sm font-bold truncate", activeChat.id === conv.id ? "text-brand-900 dark:text-brand-100" : "text-zinc-900 dark:text-white")}>{conv.name}</h3>
                    <span className="text-xs font-bold text-zinc-400 shrink-0">{conv.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={cn("text-xs truncate mr-2", conv.unread > 0 ? "font-bold text-zinc-900 dark:text-white" : "font-medium text-zinc-500")}>
                      {conv.lastMessage}
                    </p>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-surface dark:bg-surface-dark relative w-full h-full">
          
          {/* Chat Header */}
          <div className="h-16 bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-3">
              <button className="md:hidden p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white" onClick={() => setShowSidebar(true)}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="relative shrink-0">
                <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover" />
                {activeChat.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success border-2 border-white dark:border-zinc-900 rounded-full"></div>}
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">{activeChat.name}</h2>
                <p className="text-xs font-medium text-zinc-500">{activeChat.online ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 text-zinc-400 hover:text-brand-600 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 hidden sm:flex"><Phone className="w-5 h-5" /></button>
              <button className="p-2 text-zinc-400 hover:text-brand-600 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 hidden sm:flex"><Video className="w-5 h-5" /></button>
              <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
            {/* System Message */}
            <div className="flex justify-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-200 dark:bg-zinc-800 px-3 py-1 rounded-full">Today</span>
            </div>

            {MESSAGES.map((msg, i) => {
              const showAvatar = !msg.isMe && (i === 0 || MESSAGES[i-1].sender !== msg.sender);
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={cn("flex max-w-[85%] sm:max-w-[70%]", msg.isMe ? "ml-auto" : "mr-auto")}
                >
                  {!msg.isMe && (
                    <div className="w-8 shrink-0 mr-2">
                      {showAvatar && <img src={activeChat.avatar} alt={msg.sender} className="w-8 h-8 rounded-full" />}
                    </div>
                  )}
                  
                  <div className={cn("flex flex-col", msg.isMe ? "items-end" : "items-start")}>
                    <div className={cn(
                      "px-4 py-3 rounded-2xl text-sm font-medium shadow-sm",
                      msg.isMe ? "bg-brand-600 text-white rounded-tr-sm" : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 rounded-tl-sm"
                    )}>
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-zinc-400">
                      {msg.time}
                      {msg.isMe && (
                        <CheckCheck className="w-3.5 h-3.5 text-brand-500" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Message Input Area */}
          <div className="p-4 bg-white dark:bg-surface-dark border-t border-zinc-200 dark:border-zinc-800 shrink-0">
            <div className="max-w-4xl mx-auto flex items-end gap-2 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl p-2 focus-within:border-brand-500 transition-colors">
              <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors rounded-full shrink-0">
                <Paperclip className="w-5 h-5" />
              </button>
              
              <textarea 
                rows="1"
                placeholder="Type a message..."
                className="w-full bg-transparent border-none outline-none text-sm font-medium text-zinc-900 dark:text-white py-2.5 resize-none max-h-32 custom-scrollbar"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
              />

              <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors rounded-full shrink-0 hidden sm:flex">
                <Smile className="w-5 h-5" />
              </button>
              
              {messageInput.trim() ? (
                <button className="p-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full transition-colors shrink-0 shadow-md">
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              ) : (
                <button className="p-2.5 bg-zinc-200 dark:bg-zinc-700 text-zinc-500 rounded-full transition-colors shrink-0">
                  <Mic className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="max-w-4xl mx-auto mt-2 text-center">
              <p className="text-[10px] font-bold text-zinc-400">Press Enter to send, Shift+Enter for new line.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
