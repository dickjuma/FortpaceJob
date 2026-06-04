import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Hash, Search, Bell, Users, Video, Phone,
  Paperclip, Smile, Send, CheckCircle2, MoreVertical, FileText,
  Clock, Info, ChevronRight, X
} from 'lucide-react';
import { useConversations, useMessages, useSendMessage } from '../services/clientHooks';
import { useAuthStore } from '../../common/authStore';

export default function ClientCollaborationHubPage() {
  const { user } = useAuthStore();
  const { data: convData } = useConversations();
  const conversations = convData?.items || [];
  
  const [activeChannel, setActiveChannel] = useState(null);
  const [showRightPane, setShowRightPane] = useState(true);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (conversations.length > 0 && !activeChannel) {
      setActiveChannel(conversations[0].id);
    }
  }, [conversations, activeChannel]);

  const { data: msgData, isLoading: loadingMsgs } = useMessages(activeChannel, { enabled: !!activeChannel });
  const messages = msgData?.items || [];
  const sendMessageMutation = useSendMessage(activeChannel);

  const handleSend = () => {
    if (!newMessage.trim() || !activeChannel) return;
    sendMessageMutation.mutate({ content: newMessage, type: 'TEXT' });
    setNewMessage('');
  };

  const getOtherParticipant = (conv) => {
    return conv.participants?.find(p => p.userId !== user?.id)?.user || { name: 'Unknown' };
  };

  const activeConv = conversations.find(c => c.id === activeChannel);
  const otherUser = activeConv ? getOtherParticipant(activeConv) : null;

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
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-success transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {/* Direct Messages */}
          <div>
            <div className="px-5 flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Direct Messages</span>
            </div>
            <div className="space-y-1 px-2">
              {conversations.length === 0 && <p className="text-xs text-gray-500 px-3 py-2">No conversations yet.</p>}
              {conversations.map(conv => {
                const partner = getOtherParticipant(conv);
                return (
                  <button 
                    key={conv.id}
                    onClick={() => setActiveChannel(conv.id)}
                    className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                      activeChannel === conv.id ? 'bg-success/10 text-success' : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-700'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-900">
                        {partner.name?.charAt(0) || '?'}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-success`}></div>
                    </div>
                    <div className="text-left overflow-hidden">
                      <div className="truncate text-sm font-bold text-gray-700">{partner.name || 'User'}</div>
                    </div>
                  </button>
                );
              })}
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
              <MessageSquare className="w-5 h-5 text-success" />
              {otherUser?.name || 'Select a Conversation'}
            </h3>
            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-4 font-medium">
              <span>Direct Message</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-success hover:bg-success/10 rounded-lg transition-colors"><Phone className="w-5 h-5" /></button>
            <button className="p-2 text-gray-500 hover:text-success hover:bg-success/10 rounded-lg transition-colors"><Video className="w-5 h-5" /></button>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar flex flex-col-reverse">
          {loadingMsgs ? (
            <div className="text-center text-zinc-500 text-sm">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-zinc-500 text-sm py-10">No messages yet. Say hello!</div>
          ) : (
            [...messages].map(msg => {
              const isMe = msg.senderId === user?.id;
              return (
                <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${isMe ? 'bg-success' : 'bg-success'} shadow-lg shadow-[#2bb75c]/20`}>
                    {isMe ? 'Me' : (msg.sender?.name?.charAt(0) || '?')}
                  </div>
                  <div className={`max-w-[80%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      {isMe ? (
                        <>
                          <span className="text-[10px] text-gray-400 font-medium">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <span className="font-bold text-gray-900 text-sm">You</span>
                        </>
                      ) : (
                        <>
                          <span className="font-bold text-gray-900 text-sm">{msg.sender?.name || 'User'}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </>
                      )}
                    </div>
                    <div className={`${isMe ? 'bg-success text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-600 rounded-tl-sm'} rounded-2xl px-4 py-3 text-sm leading-relaxed ${isMe ? 'shadow-lg shadow-[#2bb75c]/20' : ''}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-50 shrink-0 border-t border-gray-200">
          <div className="bg-white border border-gray-200 rounded-2xl flex flex-col focus-within:border-success focus-within:ring-1 focus-within:ring-success transition-all shadow-lg">
            <textarea 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              className="w-full bg-transparent px-4 pt-4 pb-2 text-sm text-gray-900 placeholder-zinc-500 focus:outline-none resize-none min-h-[80px]"
            ></textarea>
            <div className="flex items-center justify-between px-3 pb-3">
              <div className="flex items-center gap-1 text-gray-500">
                <button className="p-2 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"><Paperclip className="w-4 h-4" /></button>
                <button className="p-2 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"><Smile className="w-4 h-4" /></button>
              </div>
              <button 
                onClick={handleSend}
                disabled={!newMessage.trim() || sendMessageMutation.isPending}
                className="bg-success hover:bg-success text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-colors shadow-lg shadow-[#2bb75c]/20 disabled:opacity-50"
              >
                {sendMessageMutation.isPending ? 'Sending...' : 'Send'} <Send className="w-4 h-4" />
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
                <div className="w-12 h-12 bg-success/10 border border-success/20 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-success/20 text-success rounded border border-success/30">Active</span>
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
                  <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-xs font-bold text-gray-900">SJ</div>
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
                <button className="text-success hover:text-gray-900 capitalize text-[10px]">View All</button>
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-200">
                    <FileText className="w-4 h-4 text-gray-500 group-hover:text-success" />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="text-xs font-bold text-gray-900 truncate">tailwind.config.js</p>
                    <p className="text-[10px] text-gray-400">Today, 10:48 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-200">
                    <FileText className="w-4 h-4 text-gray-500 group-hover:text-success" />
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

