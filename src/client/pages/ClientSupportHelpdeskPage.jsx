import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket, Plus, MessageSquare, X, Clock, CheckCircle,
  AlertCircle, ChevronRight, RefreshCw, Headphones, Book,
  ChevronDown, ChevronUp, Send
} from 'lucide-react';
import { useSupportTickets, useCreateTicket, useSupportTicket, useReplyTicket, useCloseTicket } from '../services/clientHooks';
import toast, { Toaster } from 'react-hot-toast';

const STATUS_STYLES = {
  OPEN:       'bg-success/10 text-success border-success/20',
  IN_PROGRESS:'bg-#4C1D95]/10 text-blue-400 border-#4C1D95]/20',
  RESOLVED:   'bg-zinc-500/10 text-zinc-400 border-zinc-600/20',
  CLOSED:     'bg-zinc-500/10 text-zinc-500 border-zinc-700/20',
};

const PRIORITY = {
  LOW:      'text-zinc-400',
  MEDIUM:   'text-yellow-400',
  HIGH:     'text-orange-400',
  CRITICAL: 'text-red-400',
};

const CATEGORIES = ['Billing Issue', 'Contract Problem', 'Freelancer Dispute', 'Payment Not Received', 'Account Issue', 'Technical Bug', 'Other'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const TABS = ['All', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const FAQS = [
  { q: 'How do I fund escrow?', a: 'Go to your active contract, click on a milestone, and use the "Fund Escrow" button. Funds are held securely until you approve the work.' },
  { q: 'When does a freelancer get paid?', a: 'Freelancers are paid when you approve a submitted milestone. Funds are released from escrow immediately upon your approval.' },
  { q: 'How do I cancel a contract?', a: 'Open the contract from your Contracts page, click "Cancel Contract", and provide a reason. Both parties will be notified.' },
  { q: 'How long do disputes take to resolve?', a: 'Our team reviews disputes within 48 hours. Complex cases may take up to 7 business days. You can track progress in the Disputes section.' },
];

export default function ClientSupportHelpdeskPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [reply, setReply] = useState('');
  const [form, setForm] = useState({ subject: '', category: '', priority: 'MEDIUM', description: '' });

  const filters = { page, limit: 10, ...(activeTab !== 'All' && { status: activeTab }) };
  const { data, isLoading, error, refetch } = useSupportTickets(filters);
  const { data: ticketDetail } = useSupportTicket(selectedTicket?.id);
  const createTicket = useCreateTicket();
  const replyTicket = useReplyTicket(selectedTicket?.id);
  const closeTicket = useCloseTicket();

  const tickets = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.description) return toast.error('Subject and description are required.');
    try {
      await createTicket.mutateAsync({
        subject: form.subject,
        priority: form.priority,
        category: form.category,
        body: form.description
      });
      toast.success('Ticket created successfully!');
      setShowForm(false);
      setForm({ subject: '', category: '', priority: 'MEDIUM', description: '' });
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to create ticket');
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    try {
      await replyTicket.mutateAsync(reply);
      setReply('');
    } catch (_) {}
  };

  const handleClose = async (ticketId) => {
    try {
      await closeTicket.mutateAsync(ticketId);
      setSelectedTicket(null);
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 overflow-y-auto custom-scrollbar">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Headphones className="w-6 h-6 text-success" />Help & Support</h1>
            <p className="text-sm text-zinc-400 mt-1">We typically respond within 24 hours</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 bg-success hover:bg-success text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-[#4C1D95]/20">
            <Plus className="w-4 h-4" /> New Ticket
          </button>
        </div>

        {/* Create Ticket Form */}
        {showForm && (
          <div className="bg-zinc-900/60 border border-success/20 rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-white flex items-center gap-2"><Ticket className="w-4 h-4 text-success" />Submit a Support Ticket</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Subject *</label>
                <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Brief summary of your issue" required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 mb-1.5 block">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-success">
                    <option value="">Select category...</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1.5 block">Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-success">
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Please describe your issue in detail..." rows={4} required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success resize-none" />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-colors">Cancel</button>
                <button type="submit" disabled={createTicket.isPending} className="px-5 py-2 bg-success text-white rounded-xl text-sm font-bold hover:bg-success transition-colors disabled:opacity-50">
                  {createTicket.isPending ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* FAQs */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-zinc-800 bg-zinc-900/80">
            <h2 className="font-bold text-white flex items-center gap-2"><Book className="w-4 h-4 text-success" />Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {FAQS.map((faq, i) => (
              <div key={i}>
                <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-zinc-800/30 transition-colors">
                  <span className="text-sm font-bold text-white">{faq.q}</span>
                  {expandedFaq === i ? <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />}
                </button>
                {expandedFaq === i && (
                  <div className="px-5 pb-4 text-sm text-zinc-400 leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* My Tickets */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
            <h2 className="font-bold text-white">My Tickets ({total})</h2>
            <div className="flex gap-2 items-center">
              {TABS.map(t => (
                <button key={t} onClick={() => { setActiveTab(t); setPage(1); }}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${activeTab === t ? 'bg-success text-white border-success' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500'}`}>{t}</button>
              ))}
              <button onClick={refetch} className="p-1.5 text-zinc-400 hover:text-white transition-colors"><RefreshCw className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {isLoading ? (
            <div className="p-4 space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 bg-zinc-900/40 rounded-xl animate-pulse" />)}</div>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center">
              <Ticket className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
              <p className="text-zinc-400 text-sm">No tickets found.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {tickets.map(ticket => (
                <div key={ticket.id} className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-800/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-white truncate">{ticket.subject}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_STYLES[ticket.status] || STATUS_STYLES.OPEN}`}>
                        {ticket.status?.replace('_', ' ')}
                      </span>
                      {ticket.priority && (
                        <span className={`text-[10px] font-bold ${PRIORITY[ticket.priority] || 'text-zinc-400'}`}>• {ticket.priority}</span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500">{ticket.category} • #{ticket.id} • {new Date(ticket.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => setSelectedTicket(ticket)} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-xl text-xs font-bold transition-colors shrink-0">
                    View <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="p-4 border-t border-zinc-800 flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 disabled:opacity-40 hover:bg-zinc-700">Previous</button>
              <span className="text-xs text-zinc-400">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 disabled:opacity-40 hover:bg-zinc-700">Next</button>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Detail Slide-over */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-lg bg-zinc-950 border-l border-zinc-800 h-full flex flex-col shadow-2xl">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
              <div>
                <h3 className="font-bold text-white">{ticketDetail?.subject || selectedTicket.subject}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Ticket #{selectedTicket.id}</p>
              </div>
              <div className="flex items-center gap-2">
                {['OPEN', 'IN_PROGRESS'].includes(selectedTicket.status) && (
                  <button onClick={() => handleClose(selectedTicket.id)} disabled={closeTicket.isPending} className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50">
                    Close Ticket
                  </button>
                )}
                <button onClick={() => setSelectedTicket(null)} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              {/* Original ticket */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
                <p className="text-xs text-zinc-500 mb-2">You • {new Date(selectedTicket.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-zinc-200">{ticketDetail?.description || selectedTicket.description}</p>
              </div>

              {/* Support messages */}
              {(ticketDetail?.messages || []).map((msg, i) => (
                <div key={i} className={`rounded-2xl p-4 ${msg.senderType === 'SUPPORT' ? 'bg-success/5 border border-success/20' : 'bg-zinc-900/60 border border-zinc-800'}`}>
                  <p className="text-xs text-zinc-500 mb-2">{msg.senderType === 'SUPPORT' ? '🎧 Support Team' : 'You'} • {new Date(msg.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-zinc-200">{msg.body || msg.content}</p>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            {['OPEN', 'IN_PROGRESS'].includes(selectedTicket.status) && (
              <form onSubmit={handleReply} className="p-4 border-t border-zinc-800 space-y-3">
                <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Add a reply to your ticket..." rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success resize-none" />
                <div className="flex justify-end">
                  <button type="submit" disabled={replyTicket.isPending || !reply.trim()} className="flex items-center gap-1.5 px-4 py-2 bg-success text-white rounded-xl text-sm font-bold hover:bg-success transition-colors disabled:opacity-50">
                    <Send className="w-3.5 h-3.5" /> {replyTicket.isPending ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


