import { useEffect, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';

/**
 * Real-time layer for MessagesInbox — complements REST polling.
 */
export function useMessagingSocket({ conversationId, onIncomingMessage, onTyping }) {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return undefined;

    socket.emit('conversation:join', { conversationId });

    const onReceive = (message) => {
      if (message?.conversationId === conversationId || !message?.conversationId) {
        onIncomingMessage?.(message);
      }
    };

    const onTyping = (payload) => {
      if (payload?.conversationId === conversationId) {
        onTyping?.(payload);
      }
    };

    socket.on('receive_message', onReceive);
    socket.on('message_sent', onReceive);
    socket.on('user_typing', onTyping);
    socket.on('chat:typing', onTyping);

    return () => {
      socket.off('receive_message', onReceive);
      socket.off('message_sent', onReceive);
      socket.off('user_typing', onTyping);
      socket.off('chat:typing', onTyping);
    };
  }, [socket, isConnected, conversationId, onIncomingMessage, onTyping]);

  const sendRealtime = useCallback(
    (content, messageType = 'TEXT') => {
      if (!socket || !isConnected || !conversationId) return;
      socket.emit(
        'send_message',
        { conversationId, content, type: messageType },
        () => {}
      );
    },
    [socket, isConnected, conversationId]
  );

  return { sendRealtime, isConnected };
}
