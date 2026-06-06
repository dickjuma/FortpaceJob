// src/pages/freelancer/MessagesPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, Paperclip, Phone, Video,
  MoreVertical, Check, CheckCheck,
  ArrowLeft, Search, Loader2
} from 'lucide-react';
import { useAuthStore } from '../../common/authStore';
import {
  useFreelancerChats,
  useFreelancerMessages,
  useSendFreelancerMessage,
} from '../services/freelancerHooks';

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(null);
  const [localMessages, setLocalMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(null);

  const { user } = useAuthStore();
  const { data: conversations = [], isLoading, error } = useFreelancerChats();
  const { data: messages = [], isLoading: msgsLoading } = useFreelancerMessages(activeId);
  const sendMutation = useSendFreelancerMessage();

  const currentUser = useMemo(() => ({ id: user?.id || 'current-user', name: user?.firstName || 'Freelancer' }), [user]);

  useEffect(() => {
    if (activeId && messages) {
      setLocalMessages(messages);
    }
  }, [activeId, messages]);

  useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  const selected = conversations.find((c) => c.id === activeId);
  const other = selected?.otherParticipant || {};

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeId) return;

    const tempMessage = {
      id: `temp-${Date.now()}`,
      senderId: currentUser.id,
      text: newMessage,
      createdAt: new Date().toISOString(),
      read: false,
      isPending: true,
    };

    setLocalMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    sendMutation.mutate(
      { conversationId: activeId, content: newMessage },
      {
        onSuccess: () => {
          setShowSuccess({ message: 'Message sent' });
          setTimeout(() => setShowSuccess(null), 1500);
        },
        onError: () => {
          setShowSuccess({ message: 'Unable to send message', isError: true });
          setTimeout(() => setShowSuccess(null), 1500);
        },
      }
    );
  };

  const isConnected = true;

  const ConversationItem = ({ conv, isActive, onClick }) => (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
        isActive
          ? 'bg-accent-light border border-accent DEFAULT'
          : 'hover:bg-surface-muted'
      }`}
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-accent-dark font-mono font-semibold text-sm">
          {conv.otherParticipant.name.charAt(0)}
        </div>
        {conv.otherParticipant.online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-accent DEFAULT border-2 border-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h4 className="font-body font-semibold text-sm text-ink-primary truncate">
            {conv.otherParticipant.name}
          </h4>
          <span className="text-xs font-mono text-ink-tertiary">{conv.lastMessageTime}</span>
        </div>
        <p className="text-xs text-ink-tertiary truncate">{conv.lastMessage}</p>
      </div>
      {conv.unreadCount > 0 && (
        <div className="w-5 h-5 rounded-full bg-accent DEFAULT flex items-center justify-center">
          <span className="text-xs font-mono font-semibold text-white">{conv.unreadCount}</span>
        </div>
      )}
    </div>
  );

  const MessageBubble = ({ message, isOwn }) => (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
        isOwn
          ? 'bg-brand-900 text-white rounded-br-md'
          : 'bg-surface-muted text-ink-primary rounded-bl-md'
      }`}>
        <p className="text-sm font-body break-words">{message.text}</p>
        <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
          isOwn ? 'text-white/60' : 'text-ink-tertiary'
        }`}>
          <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {isOwn && (
            <>
              {message.read ? (
                <CheckCheck className="w-3.5 h-3.5" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
          <p className="text-ink-secondary">Failed to load messages</p>
          <button className="mt-4 px-4 py-2 rounded-lg bg-brand-900 text-white text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-6">
        <Link to="/freelancer/dashboard" className="inline-flex items-center gap-1 text-sm font-body font-medium text-accent DEFAULT hover:text-accent-dark transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-accent-light rounded-xl">
            <MessageSquare className="w-6 h-6 text-accent DEFAULT" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Messages</h1>
            <p className="text-ink-secondary font-body">Chat with clients and collaborators</p>
          </div>
        </div>
      </div>

      {!isConnected && (
        <div className="mb-4 p-3 bg-warn-light border border-warn DEFAULT rounded-lg">
          <p className="text-sm text-warn">Real-time connection offline — messages still sync via API</p>
        </div>
      )}

      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row h-[600px]">

          {/* Conversations Sidebar */}
          <div className="w-full md:w-80 border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-3 h-9 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-accent DEFAULT" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-10 h-10 text-ink-tertiary mx-auto mb-2" />
                  <p className="text-sm text-ink-secondary">No conversations yet</p>
                </div>
              ) : (
                conversations.map(conv => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    isActive={activeId === conv.id}
                    onClick={() => setActiveId(conv.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selected ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center justify-between bg-surface-soft">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-accent-dark font-mono font-semibold text-sm">
                        {other.name?.charAt(0) || 'U'}
                      </div>
                      {other.online && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-accent DEFAULT border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-body font-semibold text-ink-primary">{other.name || 'Client'}</h3>
                      <p className="text-xs text-ink-tertiary">
                        {other.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-ink-tertiary hover:text-ink-primary rounded-lg hover:bg-surface-muted transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-ink-tertiary hover:text-ink-primary rounded-lg hover:bg-surface-muted transition-colors">
                      <Video className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-ink-tertiary hover:text-ink-primary rounded-lg hover:bg-surface-muted transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {msgsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-accent DEFAULT" />
                    </div>
                  ) : localMessages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-10 h-10 text-ink-tertiary mx-auto mb-2" />
                      <p className="text-sm text-ink-secondary">No messages yet</p>
                      <p className="text-xs text-ink-tertiary">Send a message to start the conversation</p>
                    </div>
                  ) : (
                    localMessages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwn={message.senderId === currentUser.id}
                      />
                    ))
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border bg-white">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-ink-tertiary hover:text-ink-primary rounded-lg hover:bg-surface-muted transition-colors">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 h-10 px-3 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 rounded-lg bg-brand-900 text-white hover:bg-brand-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-ink-tertiary mx-auto mb-4" />
                  <h3 className="font-body font-semibold text-lg text-ink-primary mb-1">Select a conversation</h3>
                  <p className="text-ink-secondary">Choose a chat from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
