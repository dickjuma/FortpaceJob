// components/Messages.js
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  Paperclip,
  Phone,
  Search,
  Send,
  Star,
  Video,
} from 'lucide-react';
import { useSocket } from '../../Context/SocketContext';
import api from '../../Services/api'; // shared API client

// Helper functions (same as before)
const formatTime = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const formatDay = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
};

export default function Messages() {
  const { isConnected, joinConversation, leaveConversation, sendMessage, startTyping, stopTyping, markRead } = useSocket();

  // State
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeId, setActiveId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [composer, setComposer] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showThreadOnMobile, setShowThreadOnMobile] = useState(false);
  const [typingUsers, setTypingUsers] = useState({}); // { conversationId: { userId, name } }

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch conversations and messages on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: convs } = await api.get('/conversations');
        setConversations(convs);

        if (convs.length > 0) {
          const initialId = convs[0].id;
          setActiveId(initialId);
          const { data: msgs } = await api.get(`/conversations/${initialId}/messages`);
          setMessages({ [initialId]: msgs });
        }
      } catch (err) {
        console.error('Failed to load conversations', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Join/leave conversation when activeId changes
  useEffect(() => {
    if (!activeId) return;

    joinConversation(activeId);
    markRead(activeId); // Mark as read when opening

    return () => {
      leaveConversation(activeId);
    };
  }, [activeId, joinConversation, leaveConversation, markRead]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages[activeId]]);

  // Listen for new messages
  useEffect(() => {
    if (!isConnected) return;

    const handleNewMessage = (msg) => {
      // msg: { _id, sender: { _id, name, avatar }, content, attachments, createdAt, conversationId }
      if (msg.conversationId === activeId) {
        // Add to current conversation
        setMessages((prev) => ({
          ...prev,
          [activeId]: [...(prev[activeId] || []), msg],
        }));
      } else {
        // Update unread count for the conversation in the list
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === msg.conversationId
              ? { ...conv, unreadCount: (conv.unreadCount || 0) + 1, lastMessage: msg.content, updatedAt: msg.createdAt }
              : conv
          )
        );
      }
    };

    const handleUserTyping = ({ userId, name, conversationId }) => {
      if (conversationId === activeId) {
        setTypingUsers((prev) => ({ ...prev, [userId]: { userId, name } }));
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setTypingUsers((prev) => {
            const newState = { ...prev };
            delete newState[userId];
            return newState;
          });
        }, 3000);
      }
    };

    const handleUserStoppedTyping = ({ userId, conversationId }) => {
      if (conversationId === activeId) {
        setTypingUsers((prev) => {
          const newState = { ...prev };
          delete newState[userId];
          return newState;
        });
      }
    };

    const handleMessagesRead = ({ userId, conversationId }) => {
      if (conversationId === activeId) {
        // Could mark messages as read visually, but backend likely handles it
      }
    };

    window.socket?.on('new_message', handleNewMessage);
    window.socket?.on('user_typing', handleUserTyping);
    window.socket?.on('user_stopped_typing', handleUserStoppedTyping);
    window.socket?.on('messages_read', handleMessagesRead);

    return () => {
      window.socket?.off('new_message', handleNewMessage);
      window.socket?.off('user_typing', handleUserTyping);
      window.socket?.off('user_stopped_typing', handleUserStoppedTyping);
      window.socket?.off('messages_read', handleMessagesRead);
      clearTimeout(typingTimeoutRef.current);
    };
  }, [isConnected, activeId]);

  // Handle typing events
  const handleTypingStart = useCallback(() => {
    if (activeId) startTyping(activeId);
  }, [activeId, startTyping]);

  const handleTypingStop = useCallback(() => {
    if (activeId) stopTyping(activeId);
  }, [activeId, stopTyping]);

  // Debounced typing stop (when user stops typing)
  const onComposerChange = (e) => {
    setComposer(e.target.value);
    handleTypingStart();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 1000);
  };

  // Send message
  const handleSend = async () => {
    if (!composer.trim() || !activeId || sending) return;
    const draft = composer.trim();

    // Optimistic message
    const optimisticMsg = {
      _id: `temp-${Date.now()}`,
      sender: { _id: 'me', name: 'You', avatar: null }, // local identifier
      content: draft,
      attachments: [],
      createdAt: new Date().toISOString(),
      conversationId: activeId,
    };

    setComposer('');
    setMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), optimisticMsg],
    }));
    setSending(true);

    try {
      // Emit via socket
      sendMessage({ conversationId: activeId, content: draft, attachments: [] });
    } catch (err) {
      console.error('Send failed', err);
      // Optionally revert optimistic message
    } finally {
      setSending(false);
      handleTypingStop();
    }
  };

  // Load messages when switching conversation (if not already loaded)
  const handleSelectConversation = async (id) => {
    setActiveId(id);
    setShowThreadOnMobile(true);

    if (!messages[id]) {
      try {
        const { data: msgs } = await api.get(`/conversations/${id}/messages`);
        setMessages((prev) => ({ ...prev, [id]: msgs }));
      } catch (err) {
        console.error('Failed to load messages', err);
      }
    }
  };

  // Filter conversations
  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter((item) =>
      [item.name, item.subject, item.role, item.requestId]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [conversations, searchQuery]);

  const activeThread = conversations.find((item) => item.id === activeId);
  const threadMessages = messages[activeId] || [];
  const unreadTotal = conversations.reduce((sum, item) => sum + (item.unreadCount || 0), 0);

  return (
    <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
      {/* Sidebar */}
      <aside
        className={`rounded-[28px] border border-[#E7E1DE] bg-white p-4 shadow-[0_16px_40px_rgba(28,20,18,0.08)] xl:block ${
          showThreadOnMobile ? 'hidden' : 'block'
        }`}
      >
        {/* Inbox header */}
        <div className="rounded-[24px] bg-[linear-gradient(135deg,#FFF6F1,#F7ECE7)] p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[#8D776E]">Inbox</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#2E2322]">Messages</h2>
              <p className="mt-2 text-sm text-[#6E5C54]">Keep every client thread, request, and follow-up in one focused place.</p>
            </div>
            <div className="rounded-full bg-white px-3 py-1 text-sm font-medium text-[#B53A27] shadow-sm">
              {unreadTotal} new
            </div>
          </div>
        </div>

        {/* Search and new button */}
        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A38F85]" />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-[#E7E1DE] bg-[#FCFAF8] py-3 pl-10 pr-3 text-sm focus:border-[#C9452F] focus:outline-none focus:ring-2 focus:ring-[#FADDD4]"
            />
          </div>
          <button className="rounded-2xl bg-[#C9452F] px-4 py-3 text-sm font-medium text-white hover:bg-[#B53A27]">
            New
          </button>
        </div>

        {/* Conversations list */}
        <div className="mt-4 space-y-3">
          {loading && <div className="rounded-2xl bg-[#FCFAF8] px-4 py-5 text-sm text-[#7A5A4C]">Loading conversations...</div>}
          {!loading && filteredConversations.length === 0 && (
            <div className="rounded-2xl bg-[#FCFAF8] px-4 py-5 text-sm text-[#7A5A4C]">No conversations found.</div>
          )}

          {!loading &&
            filteredConversations.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectConversation(item.id)}
                className={`w-full rounded-[24px] border p-4 text-left transition ${
                  activeId === item.id
                    ? 'border-[#C9452F] bg-[#FDECE7] shadow-sm'
                    : 'border-[#E7E1DE] bg-white hover:bg-[#F9F4F1]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-[#2E2322]">{item.name}</div>
                    <div className="truncate text-xs text-[#7A5A4C]">{item.role}</div>
                  </div>
                  <span className="shrink-0 text-xs text-[#8E7A72]">{formatDate(item.updatedAt)}</span>
                </div>
                <div className="mt-3 text-sm font-medium text-[#4A312F]">{item.subject}</div>
                <div className="mt-1 line-clamp-1 text-sm text-[#7A5A4C]">{item.lastMessage}</div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  {item.status && <span className="rounded-full bg-white px-2.5 py-1 text-[#B53A27]">{item.status}</span>}
                  {item.unreadCount > 0 && (
                    <span className="rounded-full bg-[#C9452F] px-2.5 py-1 text-white">{item.unreadCount} unread</span>
                  )}
                </div>
              </button>
            ))}
        </div>
      </aside>

      {/* Main chat area */}
      <section
        className={`min-h-[70vh] rounded-[28px] border border-[#E7E1DE] bg-white shadow-[0_16px_40px_rgba(28,20,18,0.08)] ${
          showThreadOnMobile || typeof window === 'undefined' ? 'block' : 'hidden xl:flex'
        } xl:flex xl:flex-col`}
      >
        {!activeThread ? (
          <div className="flex min-h-[70vh] items-center justify-center px-6 text-center text-[#7A5A4C]">
            Select a conversation to start.
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="border-b border-[#E7E1DE] px-4 py-4 md:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="mb-3 flex items-center gap-3 xl:hidden">
                    <button
                      type="button"
                      onClick={() => setShowThreadOnMobile(false)}
                      className="rounded-full border border-[#E7E1DE] p-2 text-[#5E4B45]"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <span className="text-sm text-[#8D776E]">Back to inbox</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold text-[#2E2322]">{activeThread.name}</h3>
                    {activeThread.status && (
                      <span className="rounded-full bg-[#FDECE7] px-3 py-1 text-xs font-medium text-[#B53A27]">
                        {activeThread.status}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-[#6E5C54]">{activeThread.subject}</p>
                  {activeThread.requestId && (
                    <p className="mt-1 text-xs text-[#9E8A80]">Request ID: {activeThread.requestId}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {[Phone, Video, Star, CheckCircle].map((Icon, index) => (
                    <button
                      key={index}
                      type="button"
                      className="rounded-2xl border border-[#E7E1DE] p-2.5 text-[#6E5C54] hover:bg-[#F8F2EE]"
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
              </div>

              {activeThread.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {activeThread.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-[#E7E1DE] bg-[#FCFAF8] px-3 py-1 text-xs text-[#6B5B50]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Messages area */}
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-6">
              {threadMessages.length === 0 && <div className="text-sm text-[#7A5A4C]">No messages yet.</div>}

              {threadMessages.map((msg, index) => {
                const previous = threadMessages[index - 1];
                const showDay = !previous || formatDay(previous.createdAt) !== formatDay(msg.createdAt);
                const isMe = msg.sender._id === 'me'; // adjust based on actual user id

                return (
                  <React.Fragment key={msg._id}>
                    {showDay && (
                      <div className="flex justify-center">
                        <span className="rounded-full bg-[#F7F1ED] px-3 py-1 text-xs text-[#8C766D]">
                          {formatDay(msg.createdAt)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[88%] rounded-[24px] px-4 py-3 text-sm md:max-w-[72%] ${
                          isMe
                            ? 'bg-[#C9452F] text-white'
                            : 'border border-[#E7E1DE] bg-[#F8F4F1] text-[#2E2322]'
                        }`}
                      >
                        <p className="leading-6">{msg.content}</p>
                        <span className={`mt-2 block text-xs ${isMe ? 'text-white/75' : 'text-[#7A5A4C]'}`}>
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              {/* Typing indicator */}
              {Object.values(typingUsers).length > 0 && (
                <div className="flex justify-start">
                  <div className="rounded-[24px] bg-[#F8F4F1] px-4 py-3 text-sm text-[#2E2322]">
                    {Object.values(typingUsers).map(u => u.name).join(', ')} is typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message composer */}
            <div className="border-t border-[#E7E1DE] p-4 md:p-5">
              <div className="flex items-end gap-3 rounded-[24px] border border-[#E7E1DE] bg-[#FCFAF8] p-3">
                <button type="button" className="rounded-2xl p-2 text-[#7A5A4C] hover:bg-[#F3E9E5]">
                  <Paperclip size={17} />
                </button>
                <textarea
                  rows={1}
                  placeholder="Write a message..."
                  value={composer}
                  onChange={onComposerChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-1 py-2 text-sm text-[#2E2322] outline-none placeholder:text-[#A38F85]"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#C9452F] px-4 py-3 text-sm font-medium text-white hover:bg-[#B53A27] disabled:opacity-60"
                >
                  <Send size={14} />
                  <span className="hidden sm:inline">{sending ? 'Sending' : 'Send'}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
