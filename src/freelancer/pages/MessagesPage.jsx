import React, { useEffect, useState, useRef } from 'react';
import { Search, MoreVertical, Phone, Video, Send, Paperclip, Smile, Star, MessageSquare, ArrowLeft, Check, CheckCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../admin/utils/cn';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';

// --- Skeleton Loaders ---
const MessagesSkeleton = () => (
  <div className="h-screen w-full flex bg-white animate-pulse">
    <div className="w-96 border-r border-border p-6 flex flex-col gap-6">
      <div className="h-8 w-48 bg-light-gray rounded-md"></div>
      <div className="h-10 w-full bg-light-gray rounded-md"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex gap-4">
            <div className="w-12 h-12 bg-light-gray rounded-full shrink-0"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 w-3/4 bg-light-gray rounded-md"></div>
              <div className="h-3 w-1/2 bg-light-gray rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="flex-1 flex flex-col p-6 gap-6">
      <div className="h-16 w-full bg-light-gray rounded-md"></div>
      <div className="flex-1 flex flex-col gap-4 justify-end">
        <div className="h-12 w-1/3 bg-light-gray rounded-2xl self-start"></div>
        <div className="h-12 w-1/4 bg-light-gray rounded-2xl self-end"></div>
        <div className="h-24 w-1/2 bg-light-gray rounded-2xl self-start"></div>
      </div>
      <div className="h-16 w-full bg-light-gray rounded-md mt-auto"></div>
    </div>
  </div>
);

// --- Mock Data ---
const MOCK_CONVERSATIONS = [
  { id: 1, name: 'TechFlow Solutions', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop', lastMessage: 'The new designs look absolutely incredible!', time: '10:42 AM', unread: 2, online: true, isStarred: true, typing: true },
  { id: 2, name: 'Sarah Mitchell', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop', lastMessage: 'Can we schedule a call for tomorrow?', time: 'Yesterday', unread: 0, online: false, isStarred: false, typing: false },
  { id: 3, name: 'Global Design LLC', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop', lastMessage: 'Invoice has been paid. Thanks!', time: 'Mon', unread: 0, online: true, isStarred: true, typing: false },
];

const MOCK_MESSAGES = [
  { id: 1, text: "Hi! How's the progress on the dashboard?", sender: 'client', time: '10:30 AM', status: 'read' },
  { id: 2, text: "Hey! It's going great. I've finished the main analytics view and the sidebar navigation.", sender: 'me', time: '10:32 AM', status: 'read' },
  { id: 3, text: "Here is a quick preview of what I've done so far.", sender: 'me', time: '10:33 AM', status: 'read', attachment: { name: 'dashboard-preview.png', size: '2.4 MB', type: 'image' } },
  { id: 4, text: "The new designs look absolutely incredible!", sender: 'client', time: '10:42 AM', status: 'delivered' },
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await new Promise(res => setTimeout(res, 800));
      setConversations(MOCK_CONVERSATIONS);
      setActiveChat(MOCK_CONVERSATIONS[0]);
      setMessages(MOCK_MESSAGES);
      setLoading(false);
    };
    fetchInitialData();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      text: messageInput,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => [...prev, newMsg]);
    setMessageInput('');
    
    // Simulate read receipt
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m));
    }, 1000);
    
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m));
    }, 3000);
  };

  if (loading) return <MessagesSkeleton />;

  return (
    <div className="h-screen w-screen bg-light-gray animate-in fade-in duration-700 overflow-hidden">
      <Toaster position="top-right" />
      <div className="bg-white border-none shadow-sm h-full flex overflow-hidden relative">
        
        {/* Left Sidebar: Conversations List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-white/80 backdrop-blur-xl relative z-10">
          
          <div className="p-6 border-b border-border bg-white">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Link to="/freelancer/dashboard" className="p-2 -ml-2 text-text-secondary hover:text-navy hover:bg-light-gray rounded-md transition-colors" title="Back to Dashboard">
                  <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">Messages</h1>
              </div>
              <Button onClick={() => toast('Opening composer...', { icon: '✉️' })} variant="primary" size="sm" className="shadow-md">
                <Send size={14} className="mr-2" /> New
              </Button>
            </div>
            
            <div className="relative group mb-4">
              <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-text-secondary transition-colors" />
              <input 
                type="text" 
                placeholder="Search messages or clients..." 
                className="w-full pl-9 pr-4 py-2.5 bg-light-gray/50 border border-border rounded-lg text-sm text-text-primary outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all placeholder:text-text-secondary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              {['All', 'Unread', 'Starred'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-colors uppercase tracking-widest",
                    filter === f 
                      ? "bg-navy text-white shadow-sm" 
                      : "bg-light-gray text-text-secondary hover:bg-border hover:text-navy"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
            {conversations.map(conv => (
              <div 
                key={conv.id} 
                onClick={() => setActiveChat(conv)}
                className={cn(
                  "p-5 border-b border-border cursor-pointer transition-all flex items-center gap-4 relative group",
                  activeChat?.id === conv.id ? "bg-light-gray/50" : "hover:bg-light-gray/30"
                )}
              >
                {activeChat?.id === conv.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-navy rounded-r-full" />
                )}
                
                <div className="relative shrink-0">
                  <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform" />
                  {conv.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success border-2 border-white rounded-full" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={cn(
                      "text-sm font-bold truncate transition-colors",
                      activeChat?.id === conv.id || conv.unread > 0 ? "text-navy" : "text-text-primary group-hover:text-navy"
                    )}>
                      {conv.name}
                    </h3>
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{conv.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {conv.typing ? (
                      <p className="text-xs font-bold text-accent-purple animate-pulse flex-1">Typing...</p>
                    ) : (
                      <p className={cn(
                        "text-xs truncate font-medium flex-1",
                        conv.unread > 0 ? "text-text-primary font-bold" : "text-text-secondary"
                      )}>
                        {conv.lastMessage}
                      </p>
                    )}
                    {conv.isStarred && <Star size={12} className="text-warning fill-warning shrink-0" />}
                    {conv.unread > 0 && (
                      <div className="min-w-[18px] h-4.5 rounded-full bg-accent-red flex items-center justify-center text-[9px] font-black text-white px-1.5 shrink-0 shadow-sm">
                        {conv.unread}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Area: Chat Window */}
        <div className="flex-1 flex flex-col bg-[#F9FAFB] relative z-10 hidden md:flex">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="h-20 px-8 border-b border-border flex justify-between items-center bg-white shadow-sm z-20">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={activeChat.avatar} alt={activeChat.name} className="w-11 h-11 rounded-full object-cover shadow-sm" />
                    {activeChat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-white rounded-full" />}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-text-primary tracking-tight flex items-center gap-2">
                      {activeChat.name}
                      {activeChat.isStarred && <Star size={14} className="text-warning fill-warning" />}
                    </h2>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-0.5">
                      {activeChat.online ? <span className="text-success">Online Now</span> : 'Offline'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button onClick={() => toast('Calling...', { icon: '📞' })} className="p-2.5 text-text-secondary hover:text-navy hover:bg-light-gray rounded-lg transition-colors">
                    <Phone size={18} />
                  </button>
                  <button onClick={() => toast('Video Call...', { icon: '🎥' })} className="p-2.5 text-text-secondary hover:text-navy hover:bg-light-gray rounded-lg transition-colors">
                    <Video size={18} />
                  </button>
                  <div className="w-px h-6 bg-border mx-2"></div>
                  <button onClick={() => toast('Settings...', { icon: '⚙️' })} className="p-2.5 text-text-secondary hover:text-navy hover:bg-light-gray rounded-lg transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar relative">
                {/* Date Divider */}
                <div className="flex justify-center mb-6">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-light-gray px-3 py-1 rounded-full">
                    Today
                  </span>
                </div>

                {messages.map((msg) => (
                  <div key={msg.id} className={cn("flex w-full", msg.sender === 'me' ? "justify-end" : "justify-start")}>
                    <div className={cn("flex max-w-[70%] gap-3", msg.sender === 'me' ? "flex-row-reverse" : "flex-row")}>
                      
                      {msg.sender === 'client' && (
                        <img src={activeChat.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover shrink-0 mt-auto" />
                      )}

                      <div className={cn(
                        "flex flex-col",
                        msg.sender === 'me' ? "items-end" : "items-start"
                      )}>
                        
                        {/* Attachment */}
                        {msg.attachment && (
                          <div className={cn(
                            "mb-2 p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors shadow-sm",
                            msg.sender === 'me' ? "bg-navy text-white border-navy" : "bg-white border-border text-text-primary"
                          )} onClick={() => toast.success(`Downloading ${msg.attachment.name}`)}>
                            <div className={cn("p-2 rounded-lg", msg.sender === 'me' ? "bg-white/10" : "bg-light-gray")}>
                              <Paperclip size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-bold truncate max-w-[150px]">{msg.attachment.name}</p>
                              <p className={cn("text-[10px] font-semibold uppercase tracking-widest mt-0.5", msg.sender === 'me' ? "text-white/70" : "text-text-secondary")}>
                                {msg.attachment.size} • {msg.attachment.type}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Message Bubble */}
                        {msg.text && (
                          <div className={cn(
                            "px-5 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                            msg.sender === 'me' 
                              ? "bg-navy text-white rounded-br-sm" 
                              : "bg-white text-text-primary border border-border rounded-bl-sm"
                          )}>
                            {msg.text}
                          </div>
                        )}

                        {/* Meta */}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{msg.time}</span>
                          {msg.sender === 'me' && (
                            <span className={cn(
                              "text-xs",
                              msg.status === 'read' ? "text-accent-purple" : "text-text-secondary"
                            )}>
                              {msg.status === 'sent' && <Check size={12} />}
                              {(msg.status === 'delivered' || msg.status === 'read') && <CheckCheck size={12} />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {activeChat.typing && (
                  <div className="flex w-full justify-start">
                    <div className="flex max-w-[70%] gap-3 flex-row">
                      <img src={activeChat.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover shrink-0 mt-auto" />
                      <div className="bg-white border border-border px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white border-t border-border z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
                <form onSubmit={handleSendMessage} className="flex items-end gap-3 bg-light-gray/50 p-2 rounded-2xl border border-border focus-within:border-navy focus-within:ring-1 focus-within:ring-navy transition-all">
                  <div className="flex gap-1 pb-1 px-1">
                    <button type="button" onClick={() => toast('Attach file', { icon: '📎' })} className="p-2 text-text-secondary hover:text-navy hover:bg-white rounded-lg transition-colors shadow-sm">
                      <Paperclip size={20} />
                    </button>
                    <button type="button" onClick={() => toast('Add emoji', { icon: '😊' })} className="p-2 text-text-secondary hover:text-navy hover:bg-white rounded-lg transition-colors shadow-sm hidden sm:block">
                      <Smile size={20} />
                    </button>
                  </div>
                  
                  <textarea 
                    placeholder="Type your message..." 
                    className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none resize-none py-3 text-sm font-medium text-text-primary focus:outline-none focus:ring-0 placeholder:text-text-secondary"
                    rows="1"
                    value={messageInput}
                    onChange={(e) => {
                      setMessageInput(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  
                  <div className="pb-1 pr-1">
                    <Button type="submit" variant="primary" className={cn(
                      "p-3 rounded-xl shadow-md transition-all",
                      messageInput.trim() ? "bg-navy text-white hover:bg-navy/90" : "bg-text-secondary text-white opacity-50 cursor-not-allowed"
                    )}>
                      <Send size={18} />
                    </Button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#F9FAFB]">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
                <MessageSquare size={40} className="text-text-secondary opacity-50" />
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">Select a conversation</h2>
              <p className="text-sm text-text-secondary max-w-sm">Choose an existing conversation from the sidebar or start a new one to begin messaging.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
