// src/pages/freelancer/MessagesPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../platform/common/authStore';
import {
  useFreelancerChats,
  useFreelancerMessages,
  useSendFreelancerMessage,
} from '../services/freelancerHooks';
import MessagesInbox from '../../platform/components/messaging/MessagesInbox';

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(null);
  const [localMessages, setLocalMessages] = useState([]);
  const [showSuccess, setShowSuccess] = useState(null);

  const { user } = useAuthStore();
  const { data: conversations = [], isLoading, error, refetch: refetchConv } = useFreelancerChats();
  const { data: messages = [], isLoading: msgsLoading, refetch: refetchMsgs } = useFreelancerMessages(activeId);
  const sendMutation = useSendFreelancerMessage();

  const currentUser = useMemo(() => ({ id: user?.id || 'current-user', name: user?.firstName || 'Freelancer' }), [user]);

  useEffect(() => {
    if (activeId && messages) {
      setLocalMessages(messages);
    }
  }, [activeId, messages]);

  useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  const handleSendMessage = async (text, attachments) => {
    if ((!text.trim() && (!attachments || attachments.length === 0)) || !activeId) return;

    sendMutation.mutate(
      { 
        conversationId: activeId, 
        content: text || '',
        type: attachments?.length ? 'FILE' : 'TEXT',
        attachmentsJson: attachments?.length ? JSON.stringify(attachments) : undefined
      },
      {
        onSuccess: () => {
          setShowSuccess({ message: 'Message sent' });
          setTimeout(() => setShowSuccess(null), 1500);
          refetchMsgs();
          refetchConv();
        },
        onError: () => {
          setShowSuccess({ message: 'Unable to send message', isError: true });
          setTimeout(() => setShowSuccess(null), 1500);
        },
      }
    );
  };

  const selected = conversations.find((c) => c.id === activeId);
  const other = selected?.otherParticipant || {};

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <p className="text-ink-secondary">Failed to load messages</p>
          <button onClick={refetchConv} className="mt-4 px-4 py-2 rounded-lg bg-[#4C1D95] text-white text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="p-4 md:p-6 max-w-6xl mx-auto font-body"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-[#4C1D95] text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      <MessagesInbox
        backLink={
          <Link to="/freelancer/dashboard" className="text-sm font-medium text-[#4C1D95] hover:underline mb-2 block">
            ← Dashboard
          </Link>
        }
        conversations={conversations}
        conversationsLoading={isLoading}
        conversationsError={error?.message}
        onRefreshConversations={refetchConv}
        messages={localMessages}
        messagesLoading={msgsLoading}
        selectedId={activeId}
        onSelectConversation={setActiveId}
        onSendMessage={handleSendMessage}
        sending={sendMutation.isPending}
        currentUserId={currentUser.id}
        emptyTitle="No conversations yet"
        videoEnabled={Boolean(other?.id)}
        onStartVideoCall={undefined} // Implement video call logic if needed
      />
    </motion.div>
  );
}
