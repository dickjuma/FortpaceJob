import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import useChatStore from '../../store/chatStore';
import notify from '../utils/notify';

/**
 * useNotificationSocket
 * ---------------------
 * Bridges the SocketContext socket (used inside SocketProvider layouts like
 * ClientLayout / FreelancerLayout) to the centralised chatStore notification
 * slice, so real-time notification:new events always reach the store regardless
 * of which socket instance first receives the event.
 *
 * Place this hook once at the layout root — it is a no-op when the socket is
 * not yet connected.
 */
export function useNotificationSocket() {
  const { socket, isConnected } = useSocket();
  const addNotification = useChatStore((s) => s.addNotification);

  useEffect(() => {
    if (!socket || !isConnected) return undefined;

    const handler = (payload) => {
      const notif = { ...payload, id: payload.id || Date.now(), isRead: false };
      addNotification(notif);
      const title   = notif.title   || notif.type || 'New Notification';
      const message = notif.message || notif.body || notif.text || '';
      notify.info(message ? `${title}: ${message}` : title);
    };

    socket.on('notification:new', handler);
    return () => socket.off('notification:new', handler);
  }, [socket, isConnected, addNotification]);
}
