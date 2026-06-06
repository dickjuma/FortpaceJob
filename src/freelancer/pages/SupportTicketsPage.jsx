// src/pages/freelancer/SupportTicketsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  X,
  AlertCircle,
  Send,
  ChevronRight,
} from 'lucide-react';

// ---------- Shared UI Components (inline) ----------
const Button = ({ children, variant = 'primary', disabled = false, className = '', onClick, type = 'button', icon: Icon }) => {
  const base = 'px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-brand-900 text-white hover:bg-brand-800 disabled:opacity-40',
    ghost: 'border border-brand-900 text-brand-900 hover:bg-surface-muted disabled:opacity-40',
    outline: 'border border-border text-ink-primary hover:bg-surface-muted disabled:opacity-40',
    danger: 'bg-danger text-white hover:bg-red-700 disabled:opacity-40',
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.button>
  );
};

const Card = ({ children, className = '', hover = true }) => (
  <motion.div
    whileHover={hover ? { y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' } : {}}
    transition={{ duration: 0.2 }}
    className={`bg-white border border-border rounded-2xl p-6 shadow-sm ${className}`}
  >
    {children}
  </motion.div>
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-surface-muted text-ink-secondary',
    success: 'bg-accent-light text-accent-dark',
    warning: 'bg-warn-light text-warn',
    danger: 'bg-danger-light text-danger',
    info: 'bg-info-light text-info',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Input = ({ value, onChange, placeholder, className = '', icon: Icon, required, type = 'text' }) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white ${Icon ? 'pl-9' : ''} ${className}`}
    />
  </div>
);

const Textarea = ({ value, onChange, placeholder, rows = 4, required }) => (
  <textarea
    rows={rows}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className="w-full border border-border rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white resize-vertical"
  />
);

const Select = ({ value, onChange, options, label }) => (
  <div>
    {label && <label className="block text-xs font-medium text-ink-secondary mb-1.5 font-body">{label}</label>}
    <select
      value={value}
      onChange={onChange}
      className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-md z-50 max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b border-border">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-display font-bold text-brand-900">{title}</h3>
              <button onClick={onClose} className="text-ink-tertiary hover:text-ink-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ---------- Helper ----------
const formatDate = (dateString) => {
  if (dateString === 'Just now') return dateString;
  if (dateString === 'Yesterday') return dateString;
  if (dateString.includes('hours ago') || dateString.includes('weeks ago')) return dateString;
  return dateString;
};

// ---------- Main Component ----------
export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState([
    {
      id: '#TK-4821',
      title: 'Escrow release dispute on Nexis project',
      category: 'Billing & Escrow',
      status: 'In Review',
      priority: 'High',
      date: '3 hours ago',
      desc: 'Milestone 2 deliverable has been fully approved but the funds have not been released by the system coordinator.',
    },
    {
      id: '#TK-2908',
      title: 'Profile name verification fail',
      category: 'Verification',
      status: 'Open',
      priority: 'Medium',
      date: 'Yesterday',
      desc: 'Attempted name verification via driver\'s license but received generic auth failures.',
    },
    {
      id: '#TK-1044',
      title: 'Custom Invoice styling adjustments',
      category: 'General',
      status: 'Resolved',
      priority: 'Low',
      date: '2 weeks ago',
      desc: 'Need custom formatting toggles for tax-compliant PDF downloads.',
    },
  ]);

  const [activeModal, setActiveModal] = useState(null); // 'create' or 'detail'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  const [ticketForm, setTicketForm] = useState({
    title: '',
    category: 'Billing & Escrow',
    priority: 'Medium',
    desc: '',
  });

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!ticketForm.title.trim() || !ticketForm.desc.trim()) {
      setToast({ type: 'error', message: 'Please fill in all required fields.' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const newTicket = {
      id: `#TK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: ticketForm.title.trim(),
      category: ticketForm.category,
      status: 'Open',
      priority: ticketForm.priority,
      date: 'Just now',
      desc: ticketForm.desc.trim(),
    };

    setTickets([newTicket, ...tickets]);
    setActiveModal(null);
    setTicketForm({ title: '', category: 'Billing & Escrow', priority: 'Medium', desc: '' });
    setToast({ type: 'success', message: `Ticket ${newTicket.id} created successfully.` });
    setTimeout(() => setToast(null), 3000);
  };

  const deleteTicket = (id) => {
    setTickets(tickets.filter(t => t.id !== id));
    setToast({ type: 'success', message: 'Ticket removed.' });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredTickets = tickets.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityVariant = (priority) => {
    if (priority === 'High') return 'danger';
    if (priority === 'Medium') return 'warning';
    return 'default';
  };

  const getStatusVariant = (status) => {
    if (status === 'Resolved') return 'success';
    if (status === 'In Review') return 'info';
    return 'warning';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-md text-sm font-medium flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-accent text-white' : 'bg-danger text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light text-accent-dark rounded-xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-display font-bold text-brand-900">Support desk</h1>
          </div>
          <p className="text-sm text-ink-secondary">
            Submit, monitor, and resolve disputes or operational inquiries.
          </p>
        </div>
        <Button variant="primary" onClick={() => setActiveModal('create')} icon={Plus}>
          Submit ticket
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-sm">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tickets by ID or title..."
          icon={Search}
        />
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
            <p className="text-ink-secondary">No tickets found.</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-accent">{ticket.id}</span>
                  <span className="text-xs text-ink-tertiary">•</span>
                  <span className="text-xs text-ink-secondary flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatDate(ticket.date)}
                  </span>
                  <Badge variant={getPriorityVariant(ticket.priority)}>{ticket.priority} priority</Badge>
                  <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
                </div>
                <h3 className="font-display font-semibold text-brand-900">{ticket.title}</h3>
                <p className="text-sm text-ink-secondary line-clamp-2">{ticket.desc}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setActiveModal('detail');
                  }}
                  className="text-sm"
                >
                  View details
                </Button>
                <button
                  onClick={() => deleteTicket(ticket.id)}
                  className="p-2 text-ink-tertiary hover:text-danger rounded-lg transition-colors"
                  aria-label="Delete ticket"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Ticket Modal */}
      <Modal isOpen={activeModal === 'create'} onClose={() => setActiveModal(null)} title="Submit support ticket">
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <Input
            value={ticketForm.title}
            onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
            placeholder="Ticket title"
            required
          />
          <Select
            value={ticketForm.category}
            onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
            options={[
              { value: 'Billing & Escrow', label: 'Billing & Escrow' },
              { value: 'Verification', label: 'Verification & Profile' },
              { value: 'General', label: 'General System Help' },
            ]}
            label="Category"
          />
          <Select
            value={ticketForm.priority}
            onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High (Immediate)' },
            ]}
            label="Priority"
          />
          <Textarea
            value={ticketForm.desc}
            onChange={(e) => setTicketForm({ ...ticketForm, desc: e.target.value })}
            placeholder="Detailed description of the issue..."
            rows={4}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              <Send className="w-4 h-4" /> Submit
            </Button>
          </div>
        </form>
      </Modal>

      {/* Ticket Detail Modal */}
      <Modal isOpen={activeModal === 'detail'} onClose={() => setActiveModal(null)} title={`Ticket ${selectedTicket?.id}`}>
        {selectedTicket && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant={getPriorityVariant(selectedTicket.priority)}>{selectedTicket.priority} priority</Badge>
              <Badge variant={getStatusVariant(selectedTicket.status)}>{selectedTicket.status}</Badge>
              <Badge variant="info">{selectedTicket.category}</Badge>
            </div>
            <div className="p-4 bg-surface-soft rounded-xl border border-border">
              <div className="flex justify-between text-xs text-ink-tertiary mb-2">
                <span>Your message</span>
                <span>{formatDate(selectedTicket.date)}</span>
              </div>
              <p className="text-sm text-ink-primary">{selectedTicket.desc}</p>
            </div>
            {selectedTicket.status === 'Resolved' && (
              <div className="p-4 bg-accent-light rounded-xl border border-accent">
                <div className="flex justify-between text-xs text-accent-dark mb-2">
                  <span>Support team response</span>
                  <span>1 week ago</span>
                </div>
                <p className="text-sm text-ink-primary">
                  Your issue has been resolved. The necessary adjustments have been made to your account.
                </p>
              </div>
            )}
            {selectedTicket.status !== 'Resolved' && (
              <div className="p-4 bg-warn-light rounded-xl border border-warn">
                <p className="text-sm text-ink-primary">
                  Our team is reviewing your ticket. You will receive updates here.
                </p>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setActiveModal(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
