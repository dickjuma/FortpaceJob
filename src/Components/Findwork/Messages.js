import React, { useMemo, useState, useEffect } from "react";
import { Search, Send, Paperclip, Star, CheckCircle, Phone, Video } from "lucide-react";

/**
 * Conversation: {
 *   id: string,
 *   name: string,
 *   role?: string,
 *   subject?: string,
 *   lastMessage?: string,
 *   updatedAt?: string,
 *   unreadCount?: number,
 *   status?: string,
 *   requestId?: string,
 *   tags?: string[],
 *   avatar?: string
 * }
 * Message: {
 *   id: string,
 *   sender: "me" | "client" | "system",
 *   text: string,
 *   createdAt: string,
 *   attachments?: { name: string, url?: string }[]
 * }
 */

const mockConversations = [
  {
    id: "req-104",
    name: "Elena D.",
    role: "Facility Manager",
    subject: "HVAC diagnostics & repair",
    lastMessage: "Can you start tomorrow morning?",
    updatedAt: "2026-02-24T18:12:00Z",
    unreadCount: 2,
    status: "Urgent",
    requestId: "HVAC-921",
    tags: ["On-site", "High priority"]
  },
  {
    id: "req-110",
    name: "Chris A.",
    role: "Operations Lead",
    subject: "Fleet brake service",
    lastMessage: "Thanks, sending the scope now.",
    updatedAt: "2026-02-23T15:30:00Z",
    unreadCount: 0,
    status: "Active",
    requestId: "AUTO-510",
    tags: ["Multi-vehicle", "Fixed price"]
  },
  {
    id: "req-121",
    name: "Fatima S.",
    role: "Startup Founder",
    subject: "Product UI refresh",
    lastMessage: "We loved the moodboard. Next steps?",
    updatedAt: "2026-02-18T11:10:00Z",
    unreadCount: 0,
    status: "Proposal",
    requestId: "UX-302",
    tags: ["Remote", "Design"]
  }
];

const mockMessages = {
  "req-104": [
    { id: "m1", sender: "client", text: "Hi, we need a full HVAC diagnostic for our new site.", createdAt: "2026-02-24T09:42:00Z" },
    { id: "m2", sender: "me", text: "I can be onsite tomorrow. Do you have access windows?", createdAt: "2026-02-24T09:45:00Z" },
    { id: "m3", sender: "client", text: "Yes, 9am - 2pm. Please bring the full kit.", createdAt: "2026-02-24T09:50:00Z" }
  ],
  "req-110": [
    { id: "m4", sender: "client", text: "We need brake service across 6 vehicles in Austin.", createdAt: "2026-02-23T10:10:00Z" },
    { id: "m5", sender: "me", text: "I can handle that. Share fleet availability and location details.", createdAt: "2026-02-23T10:18:00Z" }
  ],
  "req-121": [
    { id: "m6", sender: "client", text: "We loved the moodboard. Next steps?", createdAt: "2026-02-18T11:10:00Z" }
  ]
};

const formatTime = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

export default function Messages({
  conversations = mockConversations,
  messages = mockMessages,
  loading = false,
  onSend,
  onSelectConversation,
  onSearch
}) {
  const [activeId, setActiveId] = useState(conversations[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [composer, setComposer] = useState("");
  const [sending, setSending] = useState(false);
  const [localMessages, setLocalMessages] = useState(messages);

  useEffect(() => {
    setLocalMessages(messages || {});
  }, [messages]);

  useEffect(() => {
    if (!conversations.find((item) => item.id === activeId)) {
      setActiveId(conversations[0]?.id || "");
    }
  }, [conversations, activeId]);

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
  const threadMessages = localMessages?.[activeId] || [];

  const handleSelect = (id) => {
    setActiveId(id);
    if (onSelectConversation) onSelectConversation(id);
  };

  const handleSend = async () => {
    if (!composer.trim() || !activeId || sending) return;
    const draft = composer.trim();
    const optimistic = {
      id: `local-${Date.now()}`,
      sender: "me",
      text: draft,
      createdAt: new Date().toISOString()
    };

    setComposer("");
    setLocalMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev?.[activeId] || []), optimistic]
    }));

    if (!onSend) return;
    try {
      setSending(true);
      await onSend({ conversationId: activeId, text: draft });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
      <aside className="bg-white border border-[#E7E1DE] rounded-xl p-4 shadow-[0_12px_30px_rgba(28,20,18,0.08)]">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A38F85]" />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              className="w-full pl-9 pr-3 py-2 border border-[#E7E1DE] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#C9452F] focus:border-[#C9452F]"
            />
          </div>
          <button className="px-3 py-2 bg-[#C9452F] text-white text-sm rounded-lg hover:bg-[#B53A27]">
            New
          </button>
        </div>

        {loading && (
          <div className="text-sm text-[#7A5A4C]">Loading conversations...</div>
        )}

        {!loading && filteredConversations.length === 0 && (
          <div className="text-sm text-[#7A5A4C]">No conversations found.</div>
        )}

        <div className="space-y-3">
          {filteredConversations.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full text-left p-3 rounded-xl border transition-colors ${
                activeId === item.id
                  ? "border-[#C9452F] bg-[#FDECE7]"
                  : "border-[#E7E1DE] hover:bg-[#F8F4F1]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[#2E2322]">{item.name}</div>
                  <div className="text-xs text-[#7A5A4C]">{item.role}</div>
                </div>
                <span className="text-xs text-[#7A5A4C]">{formatDate(item.updatedAt)}</span>
              </div>
              <div className="mt-2 text-sm text-[#4A312F]">{item.subject}</div>
              <div className="mt-1 text-xs text-[#7A5A4C] line-clamp-1">{item.lastMessage}</div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                {item.status && (
                  <span className="px-2 py-1 rounded-full bg-white border border-[#F4C7A1] text-[#B53A27]">
                    {item.status}
                  </span>
                )}
                {item.unreadCount > 0 && (
                  <span className="px-2 py-1 rounded-full bg-[#C9452F] text-white">
                    {item.unreadCount} new
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="bg-white border border-[#E7E1DE] rounded-xl p-5 shadow-[0_12px_30px_rgba(28,20,18,0.08)] flex flex-col">
        {!activeThread ? (
          <div className="flex-1 flex items-center justify-center text-[#7A5A4C]">
            Select a conversation to start.
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 border-b border-[#E7E1DE]">
              <div>
                <div className="text-lg font-semibold text-[#2E2322]">{activeThread.name}</div>
                <div className="text-sm text-[#7A5A4C]">{activeThread.subject}</div>
                {activeThread.requestId && (
                  <div className="text-xs text-[#A38F85] mt-1">Request ID: {activeThread.requestId}</div>
                )}
              </div>
              <div className="flex items-center gap-2 text-[#7A5A4C]">
                <button className="p-2 rounded-lg hover:bg-[#F3E9E5]">
                  <Phone size={16} />
                </button>
                <button className="p-2 rounded-lg hover:bg-[#F3E9E5]">
                  <Video size={16} />
                </button>
                <button className="p-2 rounded-lg hover:bg-[#F3E9E5]">
                  <Star size={16} />
                </button>
                <button className="p-2 rounded-lg hover:bg-[#F3E9E5]">
                  <CheckCircle size={16} />
                </button>
              </div>
            </div>

            {activeThread.tags?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {activeThread.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-[#F8F4F1] border border-[#E7E1DE] text-[#6B5B50]">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex-1 py-4 space-y-4">
              {threadMessages.length === 0 && (
                <div className="text-sm text-[#7A5A4C]">No messages yet.</div>
              )}
              {threadMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${{
                      me: "bg-[#C9452F] text-white",
                      client: "bg-[#F8F4F1] text-[#2E2322] border border-[#E7E1DE]",
                      system: "bg-[#FDECE7] text-[#4A312F] border border-[#F4C7A1]"
                    }[msg.sender]}`}
                  >
                    <p>{msg.text}</p>
                    <span className={`mt-2 block text-xs ${msg.sender === "me" ? "text-white/70" : "text-[#7A5A4C]"}`}>
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E7E1DE]">
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg hover:bg-[#F3E9E5] text-[#7A5A4C]">
                  <Paperclip size={16} />
                </button>
                <input
                  type="text"
                  placeholder="Write a message..."
                  value={composer}
                  onChange={(e) => setComposer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="flex-1 border border-[#E7E1DE] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9452F] focus:border-[#C9452F]"
                />
                <button
                  className="px-4 py-2 bg-[#C9452F] text-white rounded-lg hover:bg-[#B53A27] flex items-center gap-2 disabled:opacity-60"
                  onClick={handleSend}
                  disabled={sending}
                >
                  <Send size={14} />
                  {sending ? "Sending" : "Send"}
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
