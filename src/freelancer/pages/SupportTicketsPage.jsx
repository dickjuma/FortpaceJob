import React, { useState } from 'react';
import { 
  MessageSquare, Plus, Search, ShieldCheck, Clock, CheckCircle2, 
  MoreVertical, X, AlertTriangle, FileText, Send
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState([
    { id: '#TK-4821', title: 'Escrow release dispute on Nexis project', category: 'Billing & Escrow', status: 'In Review', priority: 'High', date: '3 hours ago', desc: 'Milestone 2 deliverable has been fully approved but the funds have not been released by the system coordinator.' },
    { id: '#TK-2908', title: 'Profile name verification fail', category: 'Verification', status: 'Open', priority: 'Medium', date: 'Yesterday', desc: 'Attempted name verification via driver\'s license but received generic auth failures.' },
    { id: '#TK-1044', title: 'Custom Invoice styling adjustments', category: 'General', status: 'Resolved', priority: 'Low', date: '2 weeks ago', desc: 'Need custom formatting toggles for tax-compliant PDF downloads.' }
  ]);

  const [activeModal, setActiveModal] = useState(null); // 'create'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [ticketForm, setTicketForm] = useState({
    title: '',
    category: 'Billing & Escrow',
    priority: 'Medium',
    desc: ''
  });

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!ticketForm.title.trim() || !ticketForm.desc.trim()) return;

    const newTicket = {
      id: `#TK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: ticketForm.title.trim(),
      category: ticketForm.category,
      status: 'Open',
      priority: ticketForm.priority,
      date: 'Just now',
      desc: ticketForm.desc.trim()
    };

    setTickets([newTicket, ...tickets]);
    setActiveModal(null);
    toast.success(`Support Ticket ${newTicket.id} created successfully!`);
  };

  const deleteTicket = (id) => {
    setTickets(tickets.filter(t => t.id !== id));
    toast.success('Ticket entry cleared.');
  };

  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-accent-purple" />
            Support Desk
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Submit, monitor, and resolve disputes or operational system inquiries with our customer support teams.
          </p>
        </div>
        <Button 
          variant="primary" 
          icon={<Plus size={18} />}
          onClick={() => setActiveModal('create')}
        >
          Submit Ticket
        </Button>
      </div>

      <div className="mb-6 max-w-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -tranzinc-y-1/2 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search tickets by ID or title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-border rounded-xl bg-light-gray/40 text-sm focus:outline-none focus:border-accent-purple text-text-primary"
          />
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-black text-accent-purple select-all">{ticket.id}</span>
                <span className="text-xs text-text-secondary">•</span>
                <span className="text-xs text-text-secondary font-bold flex items-center gap-1"><Clock size={12} /> {ticket.date}</span>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0",
                  ticket.priority === 'High' ? 'bg-accent-red/10 text-accent-red border-accent-red/20' :
                  ticket.priority === 'Medium' ? 'bg-brand-50 border-brand-200 text-brand-600' :
                  'bg-light-gray text-text-secondary border-border'
                )}>
                  {ticket.priority} Priority
                </span>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0",
                  ticket.status === 'Resolved' ? 'bg-success/15 text-success border-success/20' : 'bg-amber-100 text-amber-600 border-amber-200'
                )}>
                  {ticket.status}
                </span>
              </div>
              <h3 className="font-black text-sm text-text-primary leading-tight">{ticket.title}</h3>
              <p className="text-xs text-text-secondary font-medium leading-relaxed max-w-xl">{ticket.desc}</p>
            </div>

            <div className="flex gap-2 self-end md:self-center shrink-0">
              <button 
                onClick={() => { setSelectedTicket(ticket); setActiveModal('detail'); }}
                className="px-3.5 py-1.5 bg-accent-purple/10 hover:bg-accent-purple text-accent-purple hover:text-white rounded-xl text-xs font-black transition-all"
              >
                View Dialogue
              </button>
              <button onClick={() => deleteTicket(ticket.id)} className="p-2 text-text-secondary hover:text-accent-red hover:bg-light-gray rounded-xl transition-all"><X size={16} /></button>
            </div>
          </div>
        ))}

        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-text-secondary mx-auto mb-3" />
            <h4 className="font-bold text-text-primary">No tickets discovered</h4>
            <p className="text-xs text-text-secondary mt-1">If you have an active dispute, submit a ticket above.</p>
          </div>
        )}
      </div>

      {/* --- SUBMIT TICKET MODAL --- */}
      {activeModal === 'create' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <Card className="w-full max-w-lg shadow-2xl relative bg-white border border-border p-6 rounded-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
              <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
                <Plus className="w-5 h-5 text-accent-purple" />
                Submit Support Ticket
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-light-gray rounded-md transition-colors text-text-secondary"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Ticket Title</label>
                <input 
                  type="text" 
                  value={ticketForm.title} 
                  onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-accent-purple text-sm text-text-primary"
                  placeholder="e.g. Milestone Release Discrepancy"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-accent-purple text-sm text-text-primary appearance-none"
                  >
                    <option value="Billing & Escrow">Billing & Escrow</option>
                    <option value="Verification">Verification & Profile</option>
                    <option value="General">General System Help</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Urgency Priority</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-accent-purple text-sm text-text-primary appearance-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Immediate)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Detailed Description</label>
                <textarea 
                  rows={4} 
                  value={ticketForm.desc} 
                  onChange={(e) => setTicketForm({ ...ticketForm, desc: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-accent-purple text-sm text-text-primary resize-none font-medium"
                  placeholder="Provide logs, contract IDs, and specifics..."
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" variant="primary">Submit Ticket</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* --- DETAIL DIALOGUE MODAL --- */}
      {activeModal === 'detail' && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <Card className="w-full max-w-lg shadow-2xl relative bg-white border border-border p-6 rounded-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-black text-text-primary">{selectedTicket.id}</h3>
                <p className="text-[10px] font-black uppercase text-text-secondary tracking-widest mt-0.5">Category: {selectedTicket.category}</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-light-gray rounded-md transition-colors text-text-secondary"><X size={18} /></button>
            </div>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto p-1 bg-light-gray/25 rounded-2xl border border-border mb-6">
              <div className="p-3 bg-white border border-border rounded-xl">
                <div className="flex justify-between text-[10px] font-bold text-text-secondary mb-1">
                  <span>Author: Freelancer</span>
                  <span>{selectedTicket.date}</span>
                </div>
                <p className="text-xs text-text-primary leading-relaxed font-medium">{selectedTicket.desc}</p>
              </div>
              {selectedTicket.status === 'Resolved' && (
                <div className="p-3 bg-success/15 border border-success/20 rounded-xl">
                  <div className="flex justify-between text-[10px] font-bold text-success mb-1">
                    <span>Forte Support Specialist</span>
                    <span>1 week ago</span>
                  </div>
                  <p className="text-xs text-text-primary leading-relaxed font-medium">Hello, we have manually adjusted the verification filters for your region. The parameters have successfully compiled and updated!</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="primary" onClick={() => setActiveModal(null)}>Close Dialogue</Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
