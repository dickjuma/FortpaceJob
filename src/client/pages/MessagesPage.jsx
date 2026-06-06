// MessagesPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useConversations, useMessages, useSendMessage } from '../services/clientHooks';
import { useAuthStore } from '../../common/authStore';
import { messagingAPI } from '../../common/services/messagingApi';
import MessagesInbox from '../../components/messaging/MessagesInbox';
import VideoCallModal from '../../components/ui/VideoCallModal';
import { useMessagingSocket } from '../../common/hooks/useMessagingSocket';
import { useSocket } from '../../common/context/SocketContext';

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [localMessages, setLocalMessages] = useState([]);
  const [videoOpen, setVideoOpen] = useState(false);
  const { isConnected } = useSocket();

  const { data: convData, isLoading, error, refetch } = useConversations({ limit: 50 });
  const { data: msgData, isLoading: msgsLoading, refetch: refetchMsgs } = useMessages(selectedConvId, { limit: 80 });
  const sendMessage = useSendMessage(selectedConvId);

  const conversations = convData?.items || [];
  const apiMessages = msgData?.items || [];

  useEffect(() => {
    setLocalMessages(apiMessages);
  }, [apiMessages]);

  useEffect(() => {
    if (!selectedConvId && conversations.length > 0) {
      setSelectedConvId(conversations[0].id);
    }
  }, [conversations, selectedConvId]);

  useEffect(() => {
    if (!selectedConvId) return;
    messagingAPI.markRead(selectedConvId).catch(() => {});
    const timer = setInterval(() => {
      refetchMsgs();
      refetch();
    }, 12000);
    return () => clearInterval(timer);
  }, [selectedConvId, refetchMsgs, refetch]);

  const onIncomingMessage = useCallback(
    (message) => {
      if (!message?.id) return;
      setLocalMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
      refetch();
    },
    [refetch]
  );

  useMessagingSocket({ conversationId: selectedConvId, onIncomingMessage });

  const selected = conversations.find((c) => c.id === selectedConvId);
  const other = selected?.otherParticipant || selected?.participant || {};

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="p-4 md:p-6 max-w-6xl mx-auto font-body"
    >
      {!isConnected && (
        <div className="text-xs text-warn bg-warn-light border border-warn/20 rounded-lg px-3 py-2 mb-3">
          Real-time connection offline — messages still sync via API.
        </div>
      )}
      <MessagesInbox
        backLink={
          <Link to="/client/dashboard" className="text-sm font-medium text-accent hover:underline">
            ← Dashboard
          </Link>
        }
        conversations={conversations}
        conversationsLoading={isLoading}
        conversationsError={error?.message}
        onRefreshConversations={refetch}
        messages={localMessages}
        messagesLoading={msgsLoading}
        selectedId={selectedConvId}
        onSelectConversation={setSelectedConvId}
        onSendMessage={async (text) => {
          await sendMessage.mutateAsync({ content: text, type: 'TEXT' });
          refetchMsgs();
          refetch();
        }}
        sending={sendMessage.isPending}
        currentUserId={user?.id}
        emptyTitle="Start a conversation from a job or hire flow."
        videoEnabled={Boolean(other?.id)}
        onStartVideoCall={other?.id ? () => setVideoOpen(true) : undefined}
      />
      {videoOpen && other?.id && (
        <VideoCallModal
          isOpen={videoOpen}
          onClose={() => setVideoOpen(false)}
          isIncoming={false}
          callerName={other.name}
          callerId={user?.id}
          receiverId={other.id}
          conversationId={selectedConvId}
          callType="VIDEO"
        />
      )}
    </motion.div>
  );
}
