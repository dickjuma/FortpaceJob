import React, { useEffect, useRef, useState } from 'react';
import { Search, Send, MessageSquare, ChevronLeft, Loader2, Video, Paperclip, MoreVertical, Archive } from 'lucide-react';
import { cn } from '../../../admin/utils/cn';
import MessageItem from './MessageItem';

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
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const endRef = useRef(null);

  const filtered = conversations.filter((c) => {
    const name = c.otherParticipant?.name || c.name || c.title || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const selected = conversations.find((c) => c.id === selectedId);
  const isActive = selected?.status !== 'CLOSED' && selected?.status !== 'FROZEN';

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, selectedId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!draft.trim() && attachments.length === 0) || !selectedId || sending || isUploading || !isActive) return;
    
    const text = draft.trim();
    const currentAttachments = [...attachments];
    
    setDraft('');
    setAttachments([]);
    
    await onSendMessage(text, currentAttachments);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Mock upload
    setIsUploading(true);
    setTimeout(() => {
      setAttachments(prev => [...prev, {
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        url: URL.createObjectURL(file) // Mock URL for preview
      }]);
      setIsUploading(false);
    }, 1000);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'JOB_CHAT': return 'bg-blue-100 text-blue-700';
      case 'PROPOSAL_CHAT': return 'bg-green-100 text-green-700';
      case 'SYSTEM_CHAT': return 'bg-orange-100 text-orange-700';
      case 'SUPPORT_CHAT': return 'bg-purple-100 text-purple-700';
      default: return 'bg-zinc-100 text-zinc-600';
    }
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
            const name = other.name || conv.name || conv.title || 'Conversation';
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
                  'w-full text-left px-4 py-3 flex gap-3 border-b border-zinc-100 hover:bg-zinc-100/50 transition-colors',
                  active && 'bg-white border-l-2 border-l-[#4C1D95]'
                )}
              >
                <Avatar name={name} src={other.avatar} online={other.isOnline} />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <span className="font-semibold text-sm text-zinc-900 truncate">{name}</span>
                    <span className="text-[10px] text-zinc-400 shrink-0">{timeAgo(conv.lastMessageAt || conv.updatedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {conv.type && conv.type !== 'DIRECT_CHAT' && (
                      <span className={cn('text-[9px] px-1.5 py-0.5 rounded-sm font-bold', getTypeColor(conv.type))}>
                        {conv.type.replace('_CHAT', '')}
                      </span>
                    )}
                    <p className="text-xs text-zinc-500 truncate flex-1">{conv.lastMessage?.content || conv.preview || 'No messages yet'}</p>
                  </div>
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
                name={selected?.otherParticipant?.name || selected?.name || selected?.title}
                src={selected?.otherParticipant?.avatar}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-zinc-900 text-sm">{selected?.otherParticipant?.name || selected?.name || selected?.title}</p>
                  {selected?.status === 'CLOSED' && (
                    <span className="text-[10px] px-2 py-0.5 bg-zinc-200 text-zinc-600 rounded-full font-bold">CLOSED</span>
                  )}
                  {selected?.status === 'FROZEN' && (
                    <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold">FROZEN</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span>Secure messaging</span>
                  {selected?.type && selected?.type !== 'DIRECT_CHAT' && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                      <span>{selected.type.replace('_', ' ')}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {videoEnabled && onStartVideoCall && isActive && (
                  <button
                    type="button"
                    onClick={onStartVideoCall}
                    className="p-2 rounded-lg border border-zinc-200 text-[#4C1D95] hover:bg-[#4C1D95]/5"
                    title="Start video call"
                  >
                    <Video className="w-5 h-5" />
                  </button>
                )}
                <button type="button" className="p-2 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50/50">
              {messagesLoading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#4C1D95]" />
                </div>
              )}
              {messages.map((msg) => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  currentUserId={currentUserId}
                  conversationId={selectedId}
                />
              ))}
              <div ref={endRef} />
            </div>

            {/* Input Area */}
            {isActive ? (
              <div className="p-4 border-t border-zinc-200 bg-white">
                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {attachments.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700">
                        <Paperclip size={12} className="text-zinc-400" />
                        <span className="max-w-[150px] truncate">{file.name}</span>
                        <button type="button" onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="text-zinc-400 hover:text-red-500 ml-1">
                          <Archive size={12} /> {/* Using Archive icon as an 'X' equivalent or we can just use text 'x' */}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <form onSubmit={handleSend} className="flex gap-2 items-end">
                  <div className="flex-1 border border-zinc-200 rounded-xl bg-zinc-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#4C1D95]/20 focus-within:border-[#4C1D95] transition-all flex items-end">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 text-zinc-400 hover:text-[#4C1D95] transition-colors"
                      disabled={isUploading || sending}
                    >
                      {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileSelect}
                      multiple
                    />
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend(e);
                        }
                      }}
                      placeholder="Write a message…"
                      className="flex-1 bg-transparent py-3 text-sm focus:outline-none min-h-[44px] max-h-32 resize-none"
                      rows={1}
                      style={{ height: draft.split('\n').length > 1 ? `${Math.min(draft.split('\n').length * 20 + 24, 128)}px` : '44px' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending || isUploading || (!draft.trim() && attachments.length === 0)}
                    className="p-3 h-[44px] bg-[#4C1D95] text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center shrink-0 hover:bg-[#3b1378] transition-colors shadow-sm"
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </form>
                <div className="text-[10px] text-zinc-400 text-right mt-1.5 pr-1">
                  Press Enter to send, Shift + Enter for new line
                </div>
              </div>
            ) : (
              <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex justify-center items-center">
                <p className="text-sm text-zinc-500 font-medium">This conversation is {selected?.status?.toLowerCase() || 'closed'}. You cannot send new messages.</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
