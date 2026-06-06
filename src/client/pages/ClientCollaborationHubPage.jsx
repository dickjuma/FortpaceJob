// ClientCollaborationHubPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Phone,
  Video,
  Paperclip,
  Smile,
  Send,
  CheckCircle2,
  X,
  Info,
  FileText,
  Users,
  Clock,
} from 'lucide-react';
import { getConversations, getMessages, sendMessage, markMessagesRead } from '../services/clientApi';

// ----------------------------------------------------------------------
// Mock auth store (client-only placeholder)
// ----------------------------------------------------------------------
const useAuthStore = () => ({
  user: { id: 'client-1', name: 'Alex Morgan' },
});

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function ClientCollaborationHubPage() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showRightPane, setShowRightPane] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const convRes = await getConversations({ limit: 50 });
        const items = convRes?.items || convRes || [];
        setConversations(items);
        if (items.length > 0 && !activeChannel) {
          setActiveChannel(items[0].id);
        }
      } catch (err) {
        console.error('Failed to load conversations', err);
      } finally {
        setLoadingConversations(false);
      }
    };
    loadConversations();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      if (!activeChannel) return;
      setLoadingMsgs(true);
      try {
        const msgRes = await getMessages(activeChannel, { limit: 100, sort: 'createdAt:asc' });
        const items = msgRes?.items || msgRes || [];
        setMessages(items);
        await markMessagesRead(activeChannel);
      } catch (err) {
        console.error('Failed to load messages', err);
      } finally {
        setLoadingMsgs(false);
      }
    };
    loadMessages();
  }, [activeChannel]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeChannel) return;
    setSending(true);
    try {
      await sendMessage(activeChannel, newMessage.trim());
      setNewMessage('');
      const msgRes = await getMessages(activeChannel, { limit: 100, sort: 'createdAt:asc' });
      setMessages(msgRes?.items || msgRes || []);
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (conv) => {
    return (
      conv.participants?.find((p) => p.userId !== user?.id)?.user || {
        name: 'Unknown',
      }
    );
  };

  const activeConv = conversations.find((c) => c.id === activeChannel);
  const otherUser = activeConv ? getOtherParticipant(activeConv) : null;

  // Animation variants
  const fadeSlide = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };
  const buttonTap = { scale: 0.97 };

  return (
    <div className="min-h-screen bg-surface-soft font-body py-6 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto h-[calc(100vh-3rem)] bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col lg:flex-row">
        {/* LEFT PANE: Conversations */}
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border bg-white flex flex-col h-full">
          <div className="p-5 border-b border-border">
            <h2 className="font-display text-xl font-bold text-brand-900">Messages</h2>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full h-10 border border-border rounded-lg pl-9 pr-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-surface-soft"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-5 mb-2">
              <span className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide">
                Direct Messages
              </span>
            </div>
            <div className="space-y-1 px-2">
              {conversations.length === 0 && (
                <p className="text-sm text-ink-tertiary px-3 py-2">No conversations yet.</p>
              )}
              {conversations.map((conv) => {
                const partner = getOtherParticipant(conv);
                const isActive = activeChannel === conv.id;
                return (
                  <motion.button
                    key={conv.id}
                    whileTap={buttonTap}
                    onClick={() => setActiveChannel(conv.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-accent-light text-accent-dark'
                        : 'hover:bg-surface-muted text-ink-primary'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-surface-muted border border-border flex items-center justify-center font-display font-semibold text-ink-primary">
                        {partner.name?.charAt(0) || '?'}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-accent border-2 border-white"></span>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="truncate text-sm font-medium text-ink-primary">
                        {partner.name || 'User'}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* MIDDLE PANE: Chat */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Chat Header */}
          <div className="h-16 px-6 border-b border-border flex items-center justify-between shrink-0 bg-white">
            <div>
              <h3 className="font-display font-bold text-lg text-brand-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-accent" />
                {otherUser?.name || 'Select a conversation'}
              </h3>
              <div className="text-xs text-ink-tertiary mt-0.5 flex items-center gap-3">
                <span>Direct message</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <motion.button
                whileTap={buttonTap}
                className="p-2 rounded-lg text-ink-tertiary hover:text-accent hover:bg-accent-light transition-colors"
              >
                <Phone className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileTap={buttonTap}
                className="p-2 rounded-lg text-ink-tertiary hover:text-accent hover:bg-accent-light transition-colors"
              >
                <Video className="w-5 h-5" />
              </motion.button>
              <div className="w-px h-6 bg-border mx-1"></div>
              <motion.button
                whileTap={buttonTap}
                onClick={() => setShowRightPane(!showRightPane)}
                className={`p-2 rounded-lg transition-colors ${
                  showRightPane
                    ? 'bg-surface-muted text-ink-primary'
                    : 'text-ink-tertiary hover:bg-surface-muted'
                }`}
              >
                <Info className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Message Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col-reverse">
            {loadingMsgs ? (
              <div className="text-center text-ink-tertiary text-sm">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center text-ink-tertiary text-sm py-10">
                No messages yet. Say hello!
              </div>
            ) : (
              [...messages].map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <motion.div
                    key={msg.id}
                    initial="hidden"
                    animate="visible"
                    variants={fadeSlide}
                    className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0 ${
                        isMe ? 'bg-accent text-white' : 'bg-surface-muted text-ink-primary'
                      }`}
                    >
                      {isMe ? 'You' : (msg.sender?.name?.charAt(0) || '?')}
                    </div>
                    <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-baseline gap-2 mb-1">
                        {!isMe && (
                          <span className="font-medium text-sm text-ink-primary">
                            {msg.sender?.name || 'User'}
                          </span>
                        )}
                        <span className="text-[11px] text-ink-tertiary">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isMe
                            ? 'bg-accent text-white rounded-tr-sm'
                            : 'bg-surface-soft text-ink-primary rounded-tl-sm border border-border'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-white">
            <div className="bg-surface-soft border border-border rounded-2xl focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all">
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
                className="w-full bg-transparent px-4 pt-4 pb-2 text-sm text-ink-primary placeholder-ink-tertiary focus:outline-none resize-none min-h-[72px]"
              />
              <div className="flex items-center justify-between px-3 pb-3">
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg text-ink-tertiary hover:text-ink-primary hover:bg-surface-muted transition-colors">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-ink-tertiary hover:text-ink-primary hover:bg-surface-muted transition-colors">
                    <Smile className="w-4 h-4" />
                  </button>
                </div>
                <motion.button
                  whileTap={buttonTap}
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sending}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Send'}
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Project Details (animated) */}
        <AnimatePresence>
          {showRightPane && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-white flex flex-col shrink-0 overflow-hidden"
            >
              <div className="h-16 px-6 border-b border-border flex items-center justify-between shrink-0">
                <h3 className="font-display font-bold text-brand-900">Project Details</h3>
                <button
                  onClick={() => setShowRightPane(false)}
                  className="p-1 rounded-lg text-ink-tertiary hover:text-ink-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Status Card */}
                <div className="bg-surface-soft border border-border rounded-2xl p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-accent-light border border-accent/20 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-accent" />
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-light text-accent-dark">
                      Active
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-ink-primary mb-1">Website Redesign</h4>
                  <p className="text-xs text-ink-tertiary">Milestone 2 in progress</p>
                  <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm">
                    <span className="text-ink-tertiary font-medium">Budget</span>
                    <span className="font-bold text-ink-primary">$5,000</span>
                  </div>
                </div>

                {/* Team */}
                <div>
                  <h4 className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-3">
                    Project Team
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-light text-accent-dark flex items-center justify-center text-xs font-bold">
                        SJ
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink-primary">Sarah Jenkins</p>
                        <p className="text-xs text-ink-tertiary">Freelancer</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-muted text-ink-secondary flex items-center justify-center text-xs font-bold">
                        MC
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink-primary">Michael Chen</p>
                        <p className="text-xs text-ink-tertiary">Freelancer</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shared Files */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide">
                      Recent Files
                    </h4>
                    <button className="text-xs font-medium text-accent hover:text-accent-dark">
                      View All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {['tailwind.config.js', 'mockup_v2.fig'].map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-soft transition-colors cursor-pointer group"
                      >
                        <div className="p-2 bg-surface-muted rounded-lg group-hover:bg-white">
                          <FileText className="w-4 h-4 text-ink-tertiary group-hover:text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-ink-primary truncate">{file}</p>
                          <p className="text-[10px] text-ink-tertiary">
                            {idx === 0 ? 'Today, 10:48 AM' : 'Yesterday, 4:20 PM'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
