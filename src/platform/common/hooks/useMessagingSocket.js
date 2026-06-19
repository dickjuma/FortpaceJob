import { useEffect, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';

/**
 * Real-time layer for MessagesInbox — complements REST polling.
 */
export function useMessagingSocket({ conversationId, onIncomingMessage, onTyping }) {
  const { socket, isConnected, joinConversation, leaveConversation } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return undefined;

    joinConversation(conversationId);

    const onReceive = (message) => {
      if (message?.conversationId === conversationId || !message?.conversationId) {
        onIncomingMessage?.(message);
      }
    };

    const onTypingEvent = (payload) => {
      if (payload?.conversationId === conversationId) {
        onTyping?.(payload);
      }
    };

    socket.on('new_message', onReceive);
    socket.on('message_sent', onReceive);
    socket.on('user_typing', onTypingEvent);
    socket.on('user_stopped_typing', onTypingEvent);
    socket.on('messages_read', () => {
      onTyping?.({ conversationId, readEvent: true });
    });

    return () => {
      leaveConversation(conversationId);
      socket.off('new_message', onReceive);
      socket.off('message_sent', onReceive);
      socket.off('user_typing', onTypingEvent);
      socket.off('user_stopped_typing', onTypingEvent);
      socket.off('messages_read');
    };
  }, [socket, isConnected, conversationId, joinConversation, leaveConversation, onIncomingMessage, onTyping]);

  const sendRealtime = useCallback(
    (content, messageType = 'TEXT') => {
      if (!socket || !isConnected || !conversationId) return;
      socket.emit('send_message', {
        conversationId,
        content,
        type: messageType,
      });
    },
    [socket, isConnected, conversationId]
  );

  return { sendRealtime, isConnected };
}
