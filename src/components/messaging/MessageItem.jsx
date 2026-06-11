// src/components/messaging/MessageItem.jsx
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Smile, Reply, Copy, Forward, Clock, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import useChatStore from '../../store/chatStore';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, Slide, Snackbar, Tooltip, useTheme } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * MessageItem component
 * Props:
 *   - message: { id, content, createdAt, senderId, reactions?, replyTo?, status? }
 *   - currentUserId: ID of the logged‑in user
 *   - conversationId: ID of the conversation the message belongs to
 */
export default function MessageItem({ message, currentUserId, conversationId }) {
  const isMe = String(message.senderId || message.userId) === String(currentUserId);
  const store = useChatStore.getState();
  const theme = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(message.content || '');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);

  // Build reaction map and highlight current user's reactions
  const reactionMap = {};
  const userReactions = new Set();
  (message.reactions || []).forEach(r => {
    reactionMap[r.emoji] = (reactionMap[r.emoji] || 0) + 1;
    if (String(r.userId) === String(currentUserId)) userReactions.add(r.emoji);
  });

  // Load replied‑to message for preview
  useEffect(() => {
    if (message.replyTo) {
      const msgs = store.messages[conversationId] || [];
      const parent = msgs.find(m => m.id === message.replyTo);
      setReplyMessage(parent);
    }
  }, [message.replyTo, conversationId, store.messages]);

  // Show undo snackbar when this message sits in undo buffer
  useEffect(() => {
    const hasUndo = Object.keys(store.undoBuffer || {}).includes(message.id);
    setSnackbarOpen(hasUndo);
  }, [store.undoBuffer, message.id]);

  const handleEdit = async () => {
    if (!draft.trim()) return;
    await store.editMessage(conversationId, message.id, draft.trim());
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await store.deleteMessage(conversationId, message.id);
    setShowDeleteConfirm(false);
  };

  const handleUndo = async () => {
    await store.undoDelete(conversationId, message.id);
    setSnackbarOpen(false);
  };

  const handleReaction = (emoji) => {
    // emoji is the character string returned by EmojiPicker
    store.reactMessage(conversationId, message.id, emoji);
    setShowEmojiPicker(false);
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(message.content || ''); } catch (e) { console.error(e); }
  };

  const handleForward = () => {
    const ev = new CustomEvent('forward-message', { detail: { messageId: message.id } });
    window.dispatchEvent(ev);
  };

  const handleReply = () => {
    const ev = new CustomEvent('reply-to-message', { detail: { messageId: message.id, content: message.content } });
    window.dispatchEvent(ev);
  };

  const statusIcons = {
    sending: <Clock size={12} className="text-gray-400" title="Sending" />, // grey clock
    sent: <CheckCircle size={12} className="text-blue-500" title="Sent" />, // blue check
    delivered: <CheckCircle size={12} className="text-green-500" title="Delivered" />, // green check
    read: <CheckCircle size={12} className="text-purple-600" title="Read" />, // purple check
    failed: <XCircle size={12} className="text-red-500" title="Failed" />, // red cross
  };
  const statusIcon = statusIcons[message.status] || null;

  return (
    <div className={cn('flex', isMe ? 'justify-end' : 'justify-start')} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className={cn('max-w-[75%] p-4 rounded-2xl text-sm relative backdrop-blur-sm group',
        isMe
          ? 'bg-[#4C1D95]/90 text-white rounded-br-md shadow-lg'
          : 'bg-white/80 text-zinc-800 rounded-bl-md shadow'
      )}
        tabIndex={0}
        role="article"
        aria-label={`Message from ${isMe ? 'you' : 'other'} at ${new Date(message.createdAt).toLocaleTimeString()}`}
      >
        {/* Reply preview */}
        {replyMessage && (
          <div className="mb-2 p-2 border-l-2 border-[#4C1D95] bg-[#4C1D95]/10 rounded">
            <span className="text-xs text-[#4C1D95] font-medium">Reply to:</span>
            <p className="text-xs truncate text-[#4C1D95]">
              {replyMessage.content?.slice(0, 60)}{replyMessage.content?.length > 60 && '…'}
            </p>
          </div>
        )}
        {/* Main body */}
        {isEditing ? (
          <div className="flex flex-col space-y-2">
            <textarea
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20"
              rows={2}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              aria-label="Edit message"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsEditing(false)} className="px-2 py-1 text-sm text-zinc-600" aria-label="Cancel edit">Cancel</button>
              <button onClick={handleEdit} className="px-2 py-1 bg-[#4C1D95] text-white rounded text-sm" aria-label="Save edit">Save</button>
            </div>
          </div>
        ) : (
          <p>{message.content || message.message || message.text}</p>
        )}
        {/* Reaction chips */}
        {Object.keys(reactionMap).length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {Object.entries(reactionMap).map(([emoji, count]) => (
              <Chip key={emoji} label={`${emoji} ${count}`} size="small"
                sx={{ backgroundColor: userReactions.has(emoji) ? theme.palette.primary.main : '#f5f5f5', color: userReactions.has(emoji) ? '#fff' : 'inherit' }}
              />
            ))}
          </div>
        )}
        {/* Hover toolbar */}
        {hovered && (
          <div className="absolute top-1 right-1 flex space-x-1">
            <Tooltip title="Reply"><IconButton size="small" onClick={handleReply} aria-label="Reply" sx={{ color: isMe ? 'rgba(255,255,255,0.8)' : 'inherit' }}><Reply size={14} /></IconButton></Tooltip>
            <Tooltip title="React"><IconButton size="small" onClick={() => setShowEmojiPicker(!showEmojiPicker)} aria-label="Add reaction" sx={{ color: isMe ? 'rgba(255,255,255,0.8)' : 'inherit' }}><Smile size={14} /></IconButton></Tooltip>
            {isMe && !isEditing && (
              <Tooltip title="Edit"><IconButton size="small" onClick={() => setIsEditing(true)} aria-label="Edit" sx={{ color: 'rgba(255,255,255,0.8)' }}><Edit2 size={14} /></IconButton></Tooltip>
            )}
            {isMe && !isEditing && (
              <Tooltip title="Delete"><IconButton size="small" onClick={() => setShowDeleteConfirm(true)} aria-label="Delete" sx={{ color: 'rgba(255,255,255,0.8)' }}><Trash2 size={14} /></IconButton></Tooltip>
            )}
            <Tooltip title="Copy"><IconButton size="small" onClick={handleCopy} aria-label="Copy" sx={{ color: isMe ? 'rgba(255,255,255,0.8)' : 'inherit' }}><Copy size={14} /></IconButton></Tooltip>
            <Tooltip title="Forward"><IconButton size="small" onClick={handleForward} aria-label="Forward" sx={{ color: isMe ? 'rgba(255,255,255,0.8)' : 'inherit' }}><Forward size={14} /></IconButton></Tooltip>
          </div>
        )}
        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="absolute z-10 mt-2 right-0">
            <EmojiPicker onEmojiClick={(emojiObject) => handleReaction(emojiObject.emoji)} />
          </div>
        )}
        {/* Timestamp and status */}
        <p className={cn('text-[10px] mt-1 flex items-center gap-1', isMe ? 'text-white/70' : 'text-zinc-400')}>
          {new Date(message.createdAt || message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {statusIcon && <span>{statusIcon}</span>}
        </p>
        {/* Delete confirmation dialog */}
        <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} TransitionComponent={Transition} aria-labelledby="delete-dialog-title">
          <DialogTitle id="delete-dialog-title">Delete this message?</DialogTitle>
          <DialogContent>Are you sure you want to delete this message? You can undo within 5 seconds.</DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteConfirm(false)} color="primary">Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>
        {/* Undo snackbar */}
        <Snackbar open={snackbarOpen} message="Message deleted" action={<Button color="secondary" size="small" onClick={handleUndo}>UNDO</Button>} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
      </div>
    </div>
  );
}
