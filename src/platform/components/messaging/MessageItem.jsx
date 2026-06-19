// src/components/messaging/MessageItem.jsx
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Smile, Reply, Copy, Forward, Clock, CheckCircle, XCircle, Bot, Paperclip, FileText, Download } from 'lucide-react';
import { cn } from '../../../admin/utils/cn';
import useChatStore from '../../store/chatStore';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, Slide, Snackbar, Tooltip, useTheme } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * MessageItem component
 * Props:
 *   - message: { id, content, createdAt, senderId, reactions?, replyTo?, status?, messageType, isEdited, isDeleted, isAI, attachmentsJson }
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
    sending: <Clock size={12} className="text-gray-400" title="Sending" />, 
    sent: <CheckCircle size={12} className="text-blue-500" title="Sent" />, 
    delivered: <CheckCircle size={12} className="text-green-500" title="Delivered" />, 
    read: <CheckCircle size={12} className="text-purple-600" title="Read" />, 
    failed: <XCircle size={12} className="text-red-500" title="Failed" />, 
  };
  const statusIcon = statusIcons[message.status?.toLowerCase()] || null;

  // Render System Message
  if (message.messageType === 'SYSTEM') {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-zinc-100 text-zinc-500 text-xs px-3 py-1.5 rounded-full font-medium">
          {message.content}
        </div>
      </div>
    );
  }

  // Parse attachments
  let attachments = [];
  try {
    attachments = typeof message.attachmentsJson === 'string' 
      ? JSON.parse(message.attachmentsJson) 
      : (message.attachmentsJson || []);
  } catch (e) {
    console.error('Failed to parse attachments', e);
  }

  const isAI = message.isAI || message.messageType === 'AI_ASSISTANT';

  return (
    <div className={cn('flex', isMe ? 'justify-end' : 'justify-start')} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {isAI && !isMe && (
        <div className="w-8 h-8 rounded-full bg-[#4C1D95]/10 flex items-center justify-center mr-2 mt-auto mb-5">
          <Bot size={16} className="text-[#4C1D95]" />
        </div>
      )}
      
      <div className={cn('max-w-[75%] p-4 rounded-2xl text-sm relative backdrop-blur-sm group',
        message.isDeleted 
          ? 'bg-zinc-100 text-zinc-400 border border-zinc-200 italic shadow-none'
          : isAI 
            ? 'bg-gradient-to-br from-[#4C1D95]/5 to-[#4C1D95]/10 text-zinc-800 rounded-bl-md shadow-sm border border-[#4C1D95]/20'
            : isMe
              ? 'bg-[#4C1D95]/90 text-white rounded-br-md shadow-lg'
              : 'bg-white/90 text-zinc-800 rounded-bl-md shadow'
      )}
        tabIndex={0}
        role="article"
      >
        {/* Reply preview */}
        {replyMessage && !message.isDeleted && (
          <div className="mb-2 p-2 border-l-2 border-[#4C1D95] bg-black/5 rounded">
            <span className={cn("text-xs font-medium", isMe ? "text-white" : "text-[#4C1D95]")}>Reply to:</span>
            <p className={cn("text-xs truncate", isMe ? "text-white/80" : "text-zinc-600")}>
              {replyMessage.content?.slice(0, 60)}{replyMessage.content?.length > 60 && '…'}
            </p>
          </div>
        )}

        {/* Main body */}
        {message.isDeleted ? (
          <div className="flex items-center gap-2">
            <Trash2 size={14} />
            <span>This message was deleted</span>
          </div>
        ) : isEditing ? (
          <div className="flex flex-col space-y-2 text-zinc-900">
            <textarea
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20 bg-white"
              rows={2}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              aria-label="Edit message"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsEditing(false)} className={cn("px-2 py-1 text-sm rounded", isMe ? "text-white/80 hover:bg-white/10" : "text-zinc-600 hover:bg-zinc-100")}>Cancel</button>
              <button onClick={handleEdit} className="px-3 py-1 bg-white text-[#4C1D95] font-semibold rounded text-sm hover:bg-zinc-100">Save</button>
            </div>
          </div>
        ) : (
          <div>
            <p className="whitespace-pre-wrap leading-relaxed">{message.content || message.message || message.text}</p>
            
            {/* Attachments rendering */}
            {attachments.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {attachments.map((file, idx) => (
                  <div key={idx} className={cn(
                    "flex items-center gap-3 p-2 rounded-lg border",
                    isMe ? "bg-black/10 border-white/20" : "bg-white border-zinc-200"
                  )}>
                    <div className={cn("p-2 rounded flex-shrink-0", isMe ? "bg-white/20" : "bg-[#4C1D95]/10")}>
                      <FileText size={16} className={isMe ? "text-white" : "text-[#4C1D95]"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{file.name || 'Attachment'}</p>
                      <p className="text-[10px] opacity-70 uppercase">{file.type || 'FILE'}</p>
                    </div>
                    <IconButton size="small" sx={{ color: 'inherit' }}>
                      <Download size={14} />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reaction chips */}
        {!message.isDeleted && Object.keys(reactionMap).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 mb-1">
            {Object.entries(reactionMap).map(([emoji, count]) => (
              <Chip key={emoji} label={`${emoji} ${count}`} size="small"
                sx={{ 
                  backgroundColor: userReactions.has(emoji) ? theme.palette.primary.main : 'rgba(0,0,0,0.1)', 
                  color: userReactions.has(emoji) ? '#fff' : 'inherit',
                  height: '20px',
                  fontSize: '0.7rem'
                }}
              />
            ))}
          </div>
        )}

        {/* Hover toolbar */}
        {hovered && !message.isDeleted && (
          <div className={cn(
            "absolute -top-3 flex space-x-1 p-1 rounded-lg shadow-sm border",
            isMe ? "right-2 bg-[#4C1D95] border-[#4C1D95]/50 text-white" : "right-2 bg-white border-zinc-200 text-zinc-600"
          )}>
            <Tooltip title="Reply"><IconButton size="small" onClick={handleReply} color="inherit"><Reply size={14} /></IconButton></Tooltip>
            <Tooltip title="React"><IconButton size="small" onClick={() => setShowEmojiPicker(!showEmojiPicker)} color="inherit"><Smile size={14} /></IconButton></Tooltip>
            {isMe && !isEditing && (
              <Tooltip title="Edit"><IconButton size="small" onClick={() => setIsEditing(true)} color="inherit"><Edit2 size={14} /></IconButton></Tooltip>
            )}
            {isMe && !isEditing && (
              <Tooltip title="Delete"><IconButton size="small" onClick={() => setShowDeleteConfirm(true)} color="inherit"><Trash2 size={14} /></IconButton></Tooltip>
            )}
            <Tooltip title="Copy"><IconButton size="small" onClick={handleCopy} color="inherit"><Copy size={14} /></IconButton></Tooltip>
            <Tooltip title="Forward"><IconButton size="small" onClick={handleForward} color="inherit"><Forward size={14} /></IconButton></Tooltip>
          </div>
        )}

        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="absolute z-10 mt-2 right-0">
            <EmojiPicker onEmojiClick={(emojiObject) => handleReaction(emojiObject.emoji)} />
          </div>
        )}

        {/* Timestamp and status */}
        <div className={cn(
          'text-[10px] mt-1.5 flex items-center gap-1.5 justify-end font-medium', 
          message.isDeleted ? 'text-zinc-400' : isMe ? 'text-white/80' : 'text-zinc-500'
        )}>
          {message.isEdited && !message.isDeleted && <span className="italic mr-1">(edited)</span>}
          {new Date(message.createdAt || message.sentAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isMe && statusIcon && <span>{statusIcon}</span>}
        </div>

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
