// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '../../platform/components/common/Button';
import { Input } from '../../platform/components/common/Input';
import { Avatar } from '../../platform/components/common/Avatar';
import { Search, Star, MoreVertical, Send, Paperclip, MessageSquare, X } from 'lucide-react';
import clsx from 'clsx';
import { api } from '../../platform/common/services/api';
import { initSocket, getSocket, disconnectSocket, onSocketEvent, offSocketEvent, emitSocketEvent } from '../../platform/services/websocket';
import { useAuthStore } from '../../platform/common/authStore';

export const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState(null);
  const [detailError, setDetailError] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const { token } = useAuthStore();

  // Initialize WebSocket connection
  useEffect(() => {
    const socket = getSocket() || initSocket(token);
    
    // Listen for real-time message events
    onSocketEvent('MESSAGE_SENT', (msg) => {
      if (msg.conversationId === selectedConversationId) {
        setMessages(prev => [...prev, msg]);
        scrollToBottom();
      }
    });

    onSocketEvent('TYPING_INDICATOR', (data) => {
      if (data.conversationId === selectedConversationId && data.userId !== null) {
        setTypingUsers(prev => [...new Set([...prev, data.userId])]);
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(id => id !== data.userId));
        }, 3000);
      }
    });

    // Cleanup on unmount
    return () => {
      offSocketEvent('MESSAGE_SENT');
      offSocketEvent('TYPING_INDICATOR');
    };
  }, [selectedConversationId, token]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    let active = true;
    setLoadingList(true);
    setError(null);

    api
      .get('/admin_rbc/chat/conversations')
      .then((response) => {
        if (!active) return;
        const payload = response?.data ?? response;
        const items = payload.items || payload.data || [];
        setConversations(items);
        if (items.length > 0) {
          setSelectedConversationId(String(items[0].id));
        }
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || 'Unable to load conversations.');
      })
      .finally(() => {
        if (!active) return;
        setLoadingList(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    let active = true;
    setLoadingDetail(true);
    setDetailError(null);

    api
      .get(`/admin_rbc/chat/conversations/${selectedConversationId}`)
      .then((response) => {
        if (!active) return;
        const payload = response?.data ?? response;
        setMessages(payload.messages || []);
        setTimeout(scrollToBottom, 100);
      })
      .catch((err) => {
        if (!active) return;
        setDetailError(err?.message || 'Unable to load conversation.');
      })
      .finally(() => {
        if (!active) return;
        setLoadingDetail(false);
      });

    return () => {
      active = false;
    };
  }, [selectedConversationId]);

  const filteredConversations = conversations.filter((conversation) => {
    const participants = (conversation.participants || [])
      .map((p) => p.user?.name || p.user?.email || '')
      .join(' ')
      .toLowerCase();
    const preview = (conversation.lastMessage || conversation.snippet || '').toLowerCase();
    return (
      participants.includes(searchTerm.toLowerCase()) || preview.includes(searchTerm.toLowerCase())
    );
  });

  const selectedConversation = conversations.find((conversation) => String(conversation.id) === String(selectedConversationId));
  const participantsLabel = selectedConversation
    ? (selectedConversation.participants || [])
        .map((p) => p.user?.name || p.user?.email || 'Unknown')
        .join(', ')
    : '';

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversationId) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      content: messageText,
      sender: { id: 'current', name: 'You' },
      createdAt: new Date().toISOString(),
      isMine: true,
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setMessageText('');
    scrollToBottom();

    try {
      const response = await api.post(`/admin_rbc/chat/conversations/${selectedConversationId}/messages`, {
        content: messageText,
      });
      
      // Replace optimistic message with real one
      setMessages(prev => prev.filter(m => m.id !== tempId));
      if (response?.data || response?.id) {
        setMessages(prev => [...prev, response.data || response]);
      }
    } catch (err) {
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempId));
      // Fallback to regular chat endpoint if admin endpoint fails
      try {
        const response = await api.post(`/chat/conversations/${selectedConversationId}/messages`, {
          message: messageText,
        });
        setMessages(prev => prev.filter(m => m.id !== tempId));
        if (response?.data || response?.id) {
          setMessages(prev => [...prev, response.data || response]);
        }
      } catch (fallbackErr) {
        setDetailError(fallbackErr?.message || 'Failed to send message.');
      }
    }
  };

  const handleTyping = () => {
    if (selectedConversationId && getSocket()?.connected) {
      emitSocketEvent('TYPING_INDICATOR', {
        conversationId: selectedConversationId,
        userId: 'current',
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      handleTyping();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border border-border flex overflow-hidden">
      <div className="w-1/3 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#222222]">Messages</h2>
            <Button variant="primary" size="sm">Compose</Button>
          </div>
          <Input
            placeholder="Search messages..."
            icon={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-0"
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loadingList ? (
            <div className="p-6 text-sm text-text-secondary">Loading conversations...</div>
          ) : error ? (
            <div className="p-6 text-sm text-rose-600">{error}</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-6 text-sm text-text-secondary">No conversations found.</div>
          ) : (
            filteredConversations.map((conversation) => {
              const lastMessage = conversation.lastMessage || conversation.snippet || conversation.messages?.[conversation.messages.length - 1]?.content || 'No messages yet';
              const updatedAt = conversation.updatedAt || conversation.createdAt;
              const participants = (conversation.participants || [])
                .map((p) => p.user?.name || p.user?.email || '')
                .filter(Boolean)
                .join(', ');
              return (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversationId(String(conversation.id))}
                  className={clsx(
                    'p-4 border-b border-border cursor-pointer transition-colors flex items-start space-x-3',
                    selectedConversationId === String(conversation.id)
                      ? 'bg-success/20 border-l-4 border-l-success'
                      : 'hover:bg-light-gray'
                  )}
                >
                  <Avatar
                    name={
                      (conversation.participants || [])[0]?.user?.name ||
                      (conversation.participants || [])[0]?.user?.email ||
                      'Conversation'
                    }
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm truncate font-medium text-[#222222]">{participants || 'Conversation'}</h4>
                      <span className="text-xs text-text-secondary shrink-0">
                        {updatedAt ? new Date(updatedAt).toLocaleDateString() : '—'}
                      </span>
                    </div>
                    <p className="text-xs truncate text-text-secondary">{String(lastMessage).slice(0, 80)}</p>
                  </div>
                  <div className="shrink-0 text-text-secondary text-xs font-semibold">
                    {conversation._count?.messages ?? conversation.messages?.length ?? 0} msg
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border flex justify-between items-center bg-white">
          <div className="flex items-center space-x-3">
            <Avatar name={participantsLabel || 'Conversation'} size="md" status="online" />
            <div>
              <h3 className="font-bold text-[#222222]">{participantsLabel || 'Conversation details'}</h3>
              <p className="text-xs text-text-secondary">{selectedConversation?.id ? `Conversation ID: ${selectedConversation.id}` : 'Select a conversation to view details.'}</p>
            </div>
          </div>
          <button className="p-2 text-text-secondary hover:bg-light-gray rounded-full transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-light-gray/30 space-y-4">
          {loadingDetail ? (
            <div className="py-16 text-center text-text-secondary">Loading conversation...</div>
          ) : detailError ? (
            <div className="py-16 text-center text-rose-600">{detailError}</div>
          ) : selectedConversation ? (
            <>
              {messages.map((message) => {
                const isMine = message.isMine || message.sender?.name?.toLowerCase().includes('admin') || message.sender?.email?.toLowerCase().includes('admin');
                return (
                  <div
                    key={message.id}
                    className={clsx(
                      'flex items-start max-w-[80%]',
                      isMine ? 'ml-auto justify-end' : 'justify-start'
                    )}
                  >
                    {!isMine && <Avatar name={message.sender?.name || message.sender?.email || 'User'} size="sm" />}
                    <div className={clsx(
                      'rounded-2xl p-4 shadow-sm',
                      isMine ? 'bg-success border border-success/20 text-[#222222]' : 'bg-white border border-border text-text-primary'
                    )}>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-[10px] text-text-secondary mt-2 text-right">{new Date(message.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
              {typingUsers.length > 0 && (
                <div className="flex items-start max-w-[80%] justify-start">
                  <Avatar name="User" size="sm" />
                  <div className="bg-white border border-border rounded-2xl px-4 py-2">
                    <p className="text-sm text-text-secondary italic">typing...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="py-16 text-center text-text-secondary">Select a conversation to open the thread.</div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-border">
          <div className="flex items-end space-x-2">
            <button className="p-3 text-text-secondary hover:bg-light-gray hover:text-[#222222] rounded-full transition-colors">
              <Paperclip size={20} />
            </button>
            <div className="flex-1 bg-light-gray rounded-lg border border-border focus-within:border-[#e63946] focus-within:ring-1 focus-within:ring-[#e63946] transition-all">
              <textarea
                className="w-full bg-transparent p-3 text-sm focus:outline-none resize-none min-h-[60px] custom-scrollbar"
                placeholder="Type your message here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!selectedConversationId}
              />
            </div>
            <Button 
              variant="primary" 
              className="h-[60px] w-[60px] rounded-lg shrink-0" 
              onClick={handleSendMessage}
              disabled={!selectedConversationId || !messageText.trim()}
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;