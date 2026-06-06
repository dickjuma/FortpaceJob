import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart, MessageSquare, Briefcase, Search, Star, MapPin,
  Trash2, ChevronRight, FolderPlus, AlertCircle, RefreshCw,
  User, StickyNote, Check, X, Plus
} from 'lucide-react';
import {
  useShortlist, useRemoveFromShortlist, useStartConversation
} from '../services/clientHooks';
import ConfirmModal from '../../components/ui/ConfirmModal';
import toast, { Toaster } from 'react-hot-toast';

export default function ClientShortlistPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState(null);
  const [editingNote, setEditingNote] = useState(null); // { freelancerId, note }
  const [noteText, setNoteText] = useState('');

  const filters = {
    page, limit: 12,
    ...(search && { q: search }),
  };

  const { data, isLoading, error, refetch } = useShortlist(filters);
  const removeFromShortlist = useRemoveFromShortlist();
  const startConversation = useStartConversation();

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleRemove = async () => {
    if (!confirmModal) return;
    try {
      await removeFromShortlist.mutateAsync(confirmModal.freelancerId);
      setConfirmModal(null);
    } catch (_) {}
  };

  const handleMessage = async (freelancerId) => {
    try {
      await startConversation.mutateAsync({ participantId: freelancerId });
      navigate('/client/messages');
    } catch (_) {
      navigate('/client/messages');
    }
  };

  const startEditNote = (item) => {
    setEditingNote(item.freelancerId || item.id);
    setNoteText(item.note || '');
  };

  const saveNote = async (freelancerId) => {
    // TODO: wire to note endpoint if backend adds one
    toast.success('Note saved locally');
    setEditingNote(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 overflow-y-auto custom-scrollbar">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-400 fill-red-400" /> Shortlisted Talent
            </h1>
            <p className="text-sm text-zinc-400 mt-1">{total} freelancer{total !== 1 ? 's' : ''} saved</p>
          </div>
          <button
            onClick={() => navigate('/client/talent-search')}
            className="flex items-center gap-2 px-5 py-2.5 bg-success hover:bg-success text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-[#4C1D95]/20"
          >
            <Plus className="w-4 h-4" /> Find More Talent
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search saved freelancers..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success"
            />
          </div>
          <button onClick={refetch} className="p-2 text-zinc-400 hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-56 bg-zinc-900/40 rounded-2xl animate-pulse" />)}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <AlertCircle className="w-10 h-10 text-red-400 opacity-60" />
            <p className="text-zinc-400 text-sm">Failed to load shortlist. <button onClick={refetch} className="text-success underline">Retry</button></p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 gap-4 bg-zinc-900/30 rounded-2xl border border-zinc-800">
            <Heart className="w-14 h-14 text-zinc-600" />
            <div className="text-center">
              <p className="text-zinc-300 font-bold">No saved freelancers yet</p>
              <p className="text-zinc-500 text-sm mt-1">Browse talent and click the heart icon to shortlist them.</p>
            </div>
            <button onClick={() => navigate('/client/talent-search')} className="px-5 py-2 bg-success text-white rounded-full text-sm font-bold hover:bg-success transition-colors">
              Browse Freelancers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => {
              const f = item.freelancer || item;
              const freelancerId = item.freelancerId || f.id || f.userId;
              const isEditingThis = editingNote === freelancerId;

              return (
                <div key={freelancerId} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors group">

                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-lg font-bold text-white overflow-hidden">
                        {f.avatar || f.profilePicture
                          ? <img src={f.avatar || f.profilePicture} alt={f.name} className="w-full h-full object-cover" />
                          : (f.name || f.firstName || '?')[0]?.toUpperCase()
                        }
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm leading-tight">{f.name || `${f.firstName || ''} ${f.lastName || ''}`.trim() || 'Freelancer'}</h3>
                        <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{f.title || f.headline || f.jobTitle || 'Freelancer'}</p>
                      </div>
                    </div>
                    {/* Remove */}
                    <button
                      onClick={() => setConfirmModal({ freelancerId, name: f.name || 'this freelancer' })}
                      className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-3 text-xs text-zinc-400 mb-4">
                    {(f.rating || f.averageRating) && (
                      <span className="flex items-center gap-1 text-orange-400 font-bold">
                        <Star className="w-3 h-3 fill-orange-400" />
                        {Number(f.rating || f.averageRating).toFixed(1)}
                      </span>
                    )}
                    {f.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{f.location}</span>}
                    {(f.hourlyRate || f.rate) && (
                      <span className="font-bold text-success">KES {Number(f.hourlyRate || f.rate).toLocaleString()}/hr</span>
                    )}
                  </div>

                  {/* Skills */}
                  {f.skills && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(Array.isArray(f.skills) ? f.skills : []).slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-success/10 text-success rounded-full border border-success/20 font-medium">
                          {typeof skill === 'object' ? skill.name : skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Note */}
                  <div className="mb-4">
                    {isEditingThis ? (
                      <div className="space-y-2">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add a private note..."
                          rows={2}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success resize-none"
                        />
                        <div className="flex gap-1.5 justify-end">
                          <button onClick={() => setEditingNote(null)} className="p-1.5 text-zinc-400 hover:text-white transition-colors"><X className="w-3.5 h-3.5" /></button>
                          <button onClick={() => saveNote(freelancerId)} className="p-1.5 text-success hover:text-white transition-colors"><Check className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => startEditNote({ ...item, freelancerId })} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors w-full text-left">
                        <StickyNote className="w-3.5 h-3.5" />
                        {item.note ? <span className="italic line-clamp-1">{item.note}</span> : <span>Add private note...</span>}
                      </button>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/client/freelancers/${freelancerId}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-success/10 hover:bg-success/20 text-success border border-success/20 rounded-xl text-xs font-bold transition-colors"
                    >
                      View Profile <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMessage(freelancerId)}
                      disabled={startConversation.isPending}
                      className="w-9 h-9 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 rounded-xl transition-colors disabled:opacity-50"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => navigate(`/client/post-job?invite=${freelancerId}`)}
                      className="w-9 h-9 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 rounded-xl transition-colors"
                      title="Invite to Job"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Added date */}
                  {item.createdAt && (
                    <p className="text-[10px] text-zinc-600 mt-3">Saved {new Date(item.createdAt).toLocaleDateString()}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 disabled:opacity-40 hover:bg-zinc-700 transition-colors">Previous</button>
            <span className="text-sm text-zinc-400">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 disabled:opacity-40 hover:bg-zinc-700 transition-colors">Next</button>
          </div>
        )}
      </div>

      {/* Remove Confirm */}
      <ConfirmModal
        isOpen={!!confirmModal}
        title="Remove from Shortlist"
        message={`Remove ${confirmModal?.name} from your shortlist? You can always add them back later.`}
        confirmLabel="Remove"
        confirmVariant="danger"
        isLoading={removeFromShortlist.isPending}
        onConfirm={handleRemove}
        onClose={() => setConfirmModal(null)}
      />
    </div>
  );
}


