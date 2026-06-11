// src/store/chatStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import socketManager from "../lib/socket/SocketManager";
import notify from "../common/utils/notify";

// Helper to set auth header for axios – retrieve token from localStorage (fallback)
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || "";
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

const useChatStore = create(
  persist(
    (set, get) => ({
      // Auth slice
      auth: {
        user: null,
        token: null,
        role: null,
      },
      setAuth: (user, token, role) =>
        set(() => ({ auth: { user, token, role } })),
      logout: () => set({ auth: { user: null, token: null, role: null } }),

      // Conversations slice
      conversations: [],
      fetchConversations: async () => {
        const { data } = await axios.get("/conversations");
        set({ conversations: data });
      },
      addConversation: (conv) =>
        set((state) => ({ conversations: [conv, ...state.conversations] })),
      updateConversation: (updated) =>
        set((state) => ({
          conversations: state.conversations.map((c) => (c.id === updated.id ? updated : c)),
        })),

      // Messages slice (keyed by conversationId)
      messages: {},
      fetchMessages: async (conversationId, page = 1, limit = 20) => {
        const { data } = await axios.get(`/conversations/${conversationId}/messages`, {
          params: { page, limit },
        });
        set((state) => ({
          messages: { ...state.messages, [conversationId]: data },
        }));
      },
      addMessageOptimistic: (conversationId, message) =>
        set((state) => {
          const msgs = state.messages[conversationId] || [];
          return {
            messages: {
              ...state.messages,
              [conversationId]: [message, ...msgs],
            },
          };
        }),
      replaceMessage: (conversationId, tempId, serverMessage) =>
        set((state) => {
          const msgs = state.messages[conversationId] || [];
          const idx = msgs.findIndex((m) => m.id === tempId);
          if (idx === -1) return {};
          const newMsgs = [...msgs];
          newMsgs[idx] = serverMessage;
          return {
            messages: { ...state.messages, [conversationId]: newMsgs },
          };
        }),

      // Undo buffer for deletions (stores removed message for 5 s)
      undoBuffer: {},
      lastDeleted: null,

      // Delete message action with optimistic UI and undo support
      deleteMessage: async (conversationId, messageId) => {
        const msgs = get().messages[conversationId] || [];
        const msgToDelete = msgs.find((m) => m.id === messageId);
        if (!msgToDelete) return;
        const newMsgs = msgs.filter((m) => m.id !== messageId);
        set((state) => ({
          messages: { ...state.messages, [conversationId]: newMsgs },
          lastDeleted: { conversationId, messageId },
        }));
        const timeoutId = setTimeout(async () => {
          try {
            await socketManager.emitWithAck("delete_message", { messageId });
          } catch (e) {
            console.error("Permanent delete failed:", e);
          }
          set((state) => {
            const { [messageId]: _, ...rest } = state.undoBuffer;
            return { undoBuffer: rest, lastDeleted: null };
          });
        }, 5000);
        set((state) => ({
          undoBuffer: { ...state.undoBuffer, [messageId]: { message: msgToDelete, timeoutId } },
        }));
      },
      // Undo deletion (restore message locally and cancel server delete)
      undoDelete: (conversationId, messageId) => {
        const entry = get().undoBuffer[messageId];
        if (!entry) return;
        clearTimeout(entry.timeoutId);
        set((state) => {
          const msgs = state.messages[conversationId] || [];
          return {
            messages: { ...state.messages, [conversationId]: [entry.message, ...msgs] },
            undoBuffer: { ...state.undoBuffer, [messageId]: undefined },
            lastDeleted: null,
          };
        });
      },

      // Presence slice
      presence: {},
      setPresence: (userId, data) =>
        set((state) => ({
          presence: { ...state.presence, [userId]: data },
        })),

      // Notifications slice
      notifications: [],
      unreadNotificationCount: 0,
      addNotification: (notif) =>
        set((state) => ({
          notifications: [notif, ...state.notifications],
          unreadNotificationCount: state.unreadNotificationCount + 1,
        })),
      markNotificationRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          );
          return {
            notifications: updated,
            unreadNotificationCount: updated.filter((n) => !n.isRead).length,
          };
        }),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadNotificationCount: 0,
        })),
      clearNotifications: () =>
        set({ notifications: [], unreadNotificationCount: 0 }),

      // Calls slice
      call: null,

      // Optimistic send message
      sendMessageOptimistic: async (conversationId, text) => {
        const tempId = `temp-${Date.now()}`;
        const optimisticMsg = {
          id: tempId,
          senderId: get().auth.user?.id,
          content: text,
          createdAt: new Date().toISOString(),
          status: "sending",
        };
        get().addMessageOptimistic(conversationId, optimisticMsg);
        try {
          const response = await socketManager.emitWithAck("send_message", { conversationId, text });
          get().replaceMessage(conversationId, tempId, response.message);
        } catch (e) {
          set((state) => {
            const msgs = state.messages[conversationId] || [];
            const idx = msgs.findIndex((m) => m.id === tempId);
            if (idx === -1) return {};
            const newMsgs = [...msgs];
            newMsgs[idx] = { ...newMsgs[idx], status: "failed" };
            return { messages: { ...state.messages, [conversationId]: newMsgs } };
          });
          console.error("Send message failed:", e);
        }
      },

      editMessage: async (conversationId, messageId, newContent) => {
        const msgs = get().messages[conversationId] || [];
        const idx = msgs.findIndex((m) => m.id === messageId);
        if (idx !== -1) {
          const optimisticMsg = { ...msgs[idx], content: newContent, status: "editing" };
          const newMsgs = [...msgs];
          newMsgs[idx] = optimisticMsg;
          set((state) => ({ messages: { ...state.messages, [conversationId]: newMsgs } }));
        }
        try {
          const response = await socketManager.emitWithAck("edit_message", { messageId, newContent });
          if (response && response.success) {
            get().replaceMessage(conversationId, messageId, response.message);
          }
        } catch (e) {
          const msgs = get().messages[conversationId] || [];
          const idx = msgs.findIndex((m) => m.id === messageId);
          if (idx !== -1) {
            const originalMsg = { ...msgs[idx] };
            delete originalMsg.status;
            const newMsgs = [...msgs];
            newMsgs[idx] = originalMsg;
            set((state) => ({ messages: { ...state.messages, [conversationId]: newMsgs } }));
            console.error("Edit message failed:", e);
          }
        }
      },

      reactMessage: async (conversationId, messageId, emoji) => {
        const msgs = get().messages[conversationId] || [];
        const idx = msgs.findIndex((m) => m.id === messageId);
        if (idx !== -1) {
          const msg = msgs[idx];
          const reactions = msg.reactions ? [...msg.reactions] : [];
          reactions.push({ userId: get().auth.user?.id, emoji });
          const optimisticMsg = { ...msg, reactions };
          const newMsgs = [...msgs];
          newMsgs[idx] = optimisticMsg;
          set((state) => ({ messages: { ...state.messages, [conversationId]: newMsgs } }));
        }
        try {
          const response = await socketManager.emitWithAck("react_message", { messageId, emoji });
          if (response && response.success) {
            get().replaceMessage(conversationId, messageId, response.message);
          }
        } catch (e) {
          console.error("React message failed:", e);
        }
      },

      // Socket bindings (called once on app start)
      initSocket: () => {
        socketManager.connect();
        const socket = socketManager.socket;
        if (!socket) return;
        socket.on("message:new", (payload) => {
          const { conversationId, message } = payload;
          get().addMessageOptimistic(conversationId, message);
        });
        socket.on("message:edited", (payload) => {
          const { conversationId, message } = payload;
          const msgs = get().messages[conversationId] || [];
          const newMsgs = msgs.map((m) => (m.id === message.id ? message : m));
          set((state) => ({ messages: { ...state.messages, [conversationId]: newMsgs } }));
        });
        socket.on("message:deleted", (payload) => {
          const { conversationId, messageId } = payload;
          const msgs = get().messages[conversationId] || [];
          const newMsgs = msgs.filter((m) => m.id !== messageId);
          set((state) => ({ messages: { ...state.messages, [conversationId]: newMsgs } }));
        });
        socket.on("message:reacted", (payload) => {
          const { conversationId, message } = payload;
          const msgs = get().messages[conversationId] || [];
          const newMsgs = msgs.map((m) => (m.id === message.id ? message : m));
          set((state) => ({ messages: { ...state.messages, [conversationId]: newMsgs } }));
        });
        socket.on("system:message", (payload) => {
          const { conversationId, message } = payload;
          get().addMessageOptimistic(conversationId, message);
        });
        socket.on("conversation:frozen", ({ conversationId }) => {
          get().updateConversation({ id: conversationId, status: "FROZEN" });
        });
        socket.on("conversation:unfrozen", ({ conversationId }) => {
          get().updateConversation({ id: conversationId, status: "ACTIVE" });
        });
        // Presence events
        socket.on("presence:online", ({ userId }) => {
          get().setPresence(userId, { online: true, lastSeen: Date.now() });
        });
        socket.on("presence:offline", ({ userId }) => {
          get().setPresence(userId, { online: false, lastSeen: Date.now() });
        });
        // Notifications — store + real-time toast
        socket.on("notification:new", (payload) => {
          const notif = { ...payload, id: payload.id || Date.now(), isRead: false };
          get().addNotification(notif);
          // Fire a visual toast so the user is alerted immediately
          const title = notif.title || notif.type || 'New Notification';
          const message = notif.message || notif.body || notif.text || '';
          notify.info(message ? `${title}: ${message}` : title);
        });
      },
    }),
    {
      name: "chat-store",
      getStorage: () => localStorage,
    }
  )
);

export default useChatStore;
