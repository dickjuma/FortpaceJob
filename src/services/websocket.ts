// WebSocket Service for Real-Time Communication
import { io, Socket } from 'socket.io-client';

const WS_BASE_URL = process.env.REACT_APP_WS_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000';

let socket: Socket | null = null;
let connectionAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export const initSocket = (token: string): Socket => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(WS_BASE_URL, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    connectionAttempts = 0;
    console.log('[WS] Connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[WS] Disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    connectionAttempts++;
    console.error('[WS] Connection error:', error.message);
    
    if (connectionAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('[WS] Max reconnection attempts reached');
    }
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  connectionAttempts = 0;
};

export const onSocketEvent = <T = unknown>(event: string, handler: (data: T) => void): void => {
  socket?.on(event, handler);
};

export const offSocketEvent = <T = unknown>(event: string, handler?: (data: T) => void): void => {
  if (handler) {
    socket?.off(event, handler);
  } else {
    socket?.off(event);
  }
};

export const emitSocketEvent = <T = unknown>(event: string, data: T): void => {
  socket?.emit(event, data);
};

// Re-export event types for type safety
export type { Socket };