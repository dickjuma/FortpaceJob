// context/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { getSocketUrl } from '../utils/socketUrl';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};

export const SocketProvider = ({ children, token }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const newSocket = io(getSocketUrl(), {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  // Helper functions
  const joinConversation = (conversationId) => {
    if (socket && isConnected && conversationId) {
      socket.emit('conversation:join', { conversationId });
    }
  };

  const leaveConversation = (conversationId) => {
    if (socket && isConnected && conversationId) {
      socket.emit('conversation:leave', { conversationId });
    }
  };

  const sendMessage = (data) => {
    if (socket && isConnected) socket.emit('send_message', data);
  };

  const startTyping = (conversationId) => {
    if (socket && isConnected) socket.emit('typing', { conversationId, isTyping: true });
  };

  const stopTyping = (conversationId) => {
    if (socket && isConnected) socket.emit('typing', { conversationId, isTyping: false });
  };

  const markRead = (messageId) => {
    if (socket && isConnected && messageId) socket.emit('mark_read', { messageId });
  };

  const value = {
    socket,
    isConnected,
    joinConversation,
    leaveConversation,
    sendMessage,
    startTyping,
    stopTyping,
    markRead,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
