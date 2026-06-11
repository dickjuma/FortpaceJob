// src/lib/socket/SocketManager.js
import { io } from "socket.io-client";
import { getAuthToken, refreshAuthToken } from "../../store/authHelpers.js"; // corrected path

class SocketManager {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.heartbeatInterval = null;
    this.reconnectAttempts = 0;
  }

  _getToken() {
    // Assume token stored in localStorage or Zustand auth slice
    return getAuthToken();
  }

  connect() {
    if (this.socket) return;
    const token = this._getToken();
    this.socket = io(process.env.REACT_APP_SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      this.connected = true;
      this.reconnectAttempts = 0;
      this._startHeartbeat();
      console.log("Socket connected");
    });

    this.socket.on("disconnect", (reason) => {
      this.connected = false;
      this._stopHeartbeat();
      console.warn("Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        // possibly token expired
        this.refreshAndReconnect();
      }
    });

    // Register all incoming events according to spec
    const events = [
      "message:new",
      "message:edited",
      "message:deleted",
      "message:reacted",
      "conversation:created",
      "conversation:updated",
      "conversation:frozen",
      "conversation:unfrozen",
      "typing:start",
      "typing:stop",
      "presence:online",
      "presence:offline",
      "call:incoming",
      "call:accepted",
      "call:rejected",
      "call:ended",
      "call:missed",
      "notification:new",
      "user:block",
      "user:unblock",
      "system:message",
    ];
    events.forEach((e) => {
      this.socket.on(e, (payload) => {
        // Forward to Zustand or custom listeners
        // Simple example using a global event emitter (could be improved)
        if (window.dispatchEvent) {
          const ev = new CustomEvent(e, { detail: payload });
          window.dispatchEvent(ev);
        }
      });
    });
  }

  _startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.connected) {
        this.socket.emit("heartbeat", { timestamp: Date.now() });
      }
    }, 25000);
  }

  _stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  async refreshAndReconnect() {
    try {
      const newToken = await refreshAuthToken();
      if (newToken) {
        this.socket?.disconnect();
        this.socket = null;
        this.connect();
      }
    } catch (e) {
      console.error("Failed to refresh token", e);
    }
  }

  // Outgoing helpers
  sendMessage(data) {
    this.socket?.emit("send_message", data);
  }
  editMessage(data) {
    this.socket?.emit("edit_message", data);
  }
  deleteMessage(data) {
    this.socket?.emit("delete_message", data);
  }
  reactMessage(data) {
    this.socket?.emit("react_message", data);
  }
  typingStart(convId) {
    this.socket?.emit("typing_start", { conversationId: convId });
  }
  typingStop(convId) {
    this.socket?.emit("typing_stop", { conversationId: convId });
  }

  /**
   * Emit an event and return a Promise that resolves/rejects on acknowledgment.
   * Useful for optimistic UI with retry.
   */
  emitWithAck(event, payload, timeout = 5000) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error("Socket not connected"));
        return;
      }
      let timedOut = false;
      const timer = setTimeout(() => {
        timedOut = true;
        reject(new Error(`${event} ack timeout`));
      }, timeout);
      this.socket.emit(event, payload, (response) => {
        if (timedOut) return;
        clearTimeout(timer);
        if (response && response.success) {
          resolve(response);
        } else {
          reject(response?.error || new Error(`${event} failed`));
        }
      });
    });
  }

  // Add other emit wrappers as needed
}

const socketManager = new SocketManager();
export default socketManager;
