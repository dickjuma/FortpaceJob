import React, { useEffect, useRef, useState } from 'react';
import { Search, Send, MessageSquare, ChevronLeft, Loader2, Video } from 'lucide-react';
import { cn } from '../../admin/utils/cn';

function timeAgo(d) {
  if (!d) return '';
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function Avatar({ name, src, online }) {
  const initials = (name || '?').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="relative shrink-0">
      <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600 overflow-hidden">
        {src ? <img src={src} alt="" className="w-full h-full object-cover" /> : initials}
      </div>
      {online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4C1D95] border-2 border-white" />}
    </div>
  );
}

/**
 * Shared inbox UI — pass data hooks from client or freelancer layer.
 */
export default function MessagesInbox({
  backLink,
  conversations = [],
  conversationsLoading = false,
  conversationsError = null,
  onRefreshConversations,
  messages = [],
  messagesLoading = false,
  selectedId,
  onSelectConversation,
  onSendMessage,
  sending = false,
  currentUserId,
  emptyTitle = 'No conversations yet',
  onStartVideoCall,
  videoEnabled = false,
}) {
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const endRef = useRef(null);

  const filtered = conversations.filter((c) => {
    const name = c.otherParticipant?.name || c.name || c.title || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const selected = conversations.find((c) => c.id === selectedId);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, selectedId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!draft.trim() || !selectedId || sending) return;
    const text = draft.trim();
    setDraft('');
    await onSendMessage(text);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
      <aside
        className={cn(
          'w-full md:w-80 border-r border-zinc-200 flex flex-col bg-zinc-50/80',
          mobileShowThread ? 'hidden md:flex' : 'flex'
        )}
      >
        <div className="p-4 border-b border-zinc-200 bg-white">
          {backLink}
          <h1 className="text-lg font-bold text-zinc-900 mt-2">Messages</h1>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations"
              className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20 focus:border-[#4C1D95]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversationsLoading && (
            <div className="p-8 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#4C1D95]" />
            </div>
          )}
          {conversationsError && (
            <div className="p-4 text-sm text-red-600">
              {conversationsError}
              {onRefreshConversations && (
                <button type="button" onClick={onRefreshConversations} className="block mt-2 text-[#4C1D95] font-semibold">
                  Retry
                </button>
              )}
            </div>
          )}
          {!conversationsLoading && filtered.length === 0 && (
            <div className="p-8 text-center text-zinc-500 text-sm">{emptyTitle}</div>
          )}
          {filtered.map((conv) => {
            const other = conv.otherParticipant || conv.participant || {};
            const name = other.name || conv.name || 'Conversation';
            const active = conv.id === selectedId;
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => {
                  onSelectConversation(conv.id);
                  setMobileShowThread(true);
                }}
                className={cn(
                  'w-full text-left px-4 py-3 flex gap-3 border-b border-zinc-100 hover:bg-white transition-colors',
                  active && 'bg-white border-l-2 border-l-[#4C1D95]'
                )}
              >
                <Avatar name={name} src={other.avatar} online={other.isOnline} />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <span className="font-semibold text-sm text-zinc-900 truncate">{name}</span>
                    <span className="text-[10px] text-zinc-400 shrink-0">{timeAgo(conv.lastMessageAt || conv.updatedAt)}</span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{conv.lastMessage?.content || conv.preview || 'No messages yet'}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="shrink-0 min-w-[1.25rem] h-5 px-1 rounded-full bg-[#4C1D95] text-white text-[10px] font-bold flex items-center justify-center">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      <section className={cn('flex-1 flex flex-col min-w-0', !mobileShowThread && !selectedId ? 'hidden md:flex' : 'flex')}>
        {!selectedId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 p-8">
            <MessageSquare className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-sm font-medium">Select a conversation</p>
          </div>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-zinc-200 flex items-center gap-3 bg-white">
              <button type="button" className="md:hidden p-1" onClick={() => setMobileShowThread(false)}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <Avatar
                name={selected?.otherParticipant?.name || selected?.name}
                src={selected?.otherParticipant?.avatar}
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-zinc-900 text-sm">{selected?.otherParticipant?.name || selected?.name}</p>
                <p className="text-xs text-zinc-500">Secure messaging</p>
              </div>
              {videoEnabled && onStartVideoCall && (
                <button
                  type="button"
                  onClick={onStartVideoCall}
                  className="p-2 rounded-lg border border-zinc-200 text-[#4C1D95] hover:bg-[#4C1D95]/5"
                  title="Start video call"
                >
                  <Video className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50/50">
              {messagesLoading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#4C1D95]" />
                </div>
              )}
              {messages.map((msg) => {
                const senderId = msg.senderId || msg.userId || msg.fromUserId;
                const isMe = senderId && currentUserId && String(senderId) === String(currentUserId);
                return (
                  <div key={msg.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                    <div
                      className={cn(
                        'max-w-[75%] px-4 py-2.5 rounded-2xl text-sm',
                        isMe ? 'bg-[#4C1D95] text-white rounded-br-md' : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-md'
                      )}
                    >
                      <p>{msg.content || msg.message || msg.text}</p>
                      <p className={cn('text-[10px] mt-1', isMe ? 'text-white/70' : 'text-zinc-400')}>
                        {timeAgo(msg.createdAt || msg.sentAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-zinc-200 bg-white flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a message…"
                className="flex-1 px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20"
              />
              <button
                type="submit"
                disabled={sending || !draft.trim()}
                className="px-4 py-2.5 bg-[#4C1D95] text-white rounded-xl font-semibold disabled:opacity-50 flex items-center gap-2"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}


