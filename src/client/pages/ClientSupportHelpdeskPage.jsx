import React, { useState } from 'react';
import { 
  AlertCircle, Clock, CheckCircle2, MessageSquare, 
  Search, Plus, ChevronDown, MessageCircle, FileText, X
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function ClientSupportHelpdeskPage() {
  const [tickets, setTickets] = useState([
    { id: 'TCK-2026-089', subject: 'Billing issue with last invoice', status: 'In Progress', priority: 'High', date: 'Oct 26, 2026' },
    { id: 'TCK-2026-088', subject: 'How to update company tax ID?', status: 'Resolved', priority: 'Low', date: 'Oct 24, 2026' },
    { id: 'TCK-2026-082', subject: 'Freelancer milestone dispute', status: 'Pending Info', priority: 'Medium', date: 'Oct 15, 2026' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Billing');
  const [description, setDescription] = useState('');

  const faqs = [
    { q: 'How does the escrow system work?', a: 'When you fund a milestone, the money is held in a secure escrow account. It is only released to the freelancer when you approve their work.' },
    { q: 'How do I dispute a milestone?', a: 'If you are unsatisfied with the work, you can click "Request Revisions" or open a dispute from the project dashboard. Our mediation team will step in if needed.' },
    { q: 'What payment methods are supported?', a: 'We support all major credit cards, bank transfers (ACH/Wire), and local mobile money solutions depending on your region.' }
  ];

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Submitting your support request...',
        success: () => {
          setTickets(prev => [
            {
              id: 'TCK-2026-' + Math.floor(100 + Math.random() * 900),
              subject: newSubject,
              status: 'New',
              priority: priority,
              date: 'Today'
            },
            ...prev
          ]);
          setIsModalOpen(false);
          setNewSubject('');
          setDescription('');
          return 'Ticket submitted successfully! We will be in touch shortly.';
        },
        error: 'Failed to submit ticket. Please try again.'
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-white bg-zinc-950 min-h-screen relative">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
        }} 
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Support & Helpdesk</h1>
          <p className="text-sm font-semibold text-zinc-400 mt-1">Get help with your account, projects, or billing inquiries.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-vivid-lavender hover:bg-dark-purple text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-vivid-lavender/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Open New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Ticket Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-black text-lg text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-vivid-lavender" /> Your Support Tickets
              </h3>
              
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search tickets..." 
                  className="bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-vivid-lavender transition-all w-48 focus:w-64"
                />
              </div>
            </div>

            <div className="divide-y divide-zinc-800">
              {tickets.map(t => (
                <div key={t.id} className="p-6 hover:bg-zinc-800/30 transition-colors cursor-pointer group">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-white group-hover:text-vivid-lavender transition-colors">{t.subject}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                          t.priority === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                          t.priority === 'Medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                          'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}>{t.priority}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 font-bold">
                        <span className="text-vivid-lavender">#{t.id}</span>
                        <span>•</span>
                        <span>{t.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                        t.status === 'Resolved' ? 'bg-zinc-950 border-zinc-800 text-zinc-500' :
                        t.status === 'In Progress' ? 'bg-vivid-lavender/10 border-vivid-lavender/30 text-vivid-lavender' :
                        'bg-orange-500/10 border-orange-500/30 text-orange-400'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: FAQs & Knowledge Base */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-black text-sm uppercase tracking-wider text-zinc-400 mb-5 flex items-center gap-2">
              <Search className="w-4 h-4" /> Knowledge Base
            </h3>
            
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="group">
                  <h4 className="text-sm font-bold text-white mb-2 group-hover:text-vivid-lavender transition-colors cursor-pointer flex justify-between items-start">
                    {faq.q}
                    <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed hidden group-hover:block pb-2">
                    {faq.a}
                  </p>
                  <div className="w-full h-px bg-zinc-800 mt-2"></div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 bg-zinc-950 border border-zinc-800 hover:border-vivid-lavender text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors">
              Browse All Articles
            </button>
          </div>
        </div>

      </div>

      {/* Floating Live Chat Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-vivid-lavender hover:bg-dark-purple text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 z-40 group">
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-16 bg-zinc-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-zinc-800">
          Live Chat Support
        </span>
      </button>

      {/* Create Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
              <h2 className="text-xl font-black text-white">Create Support Ticket</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors p-2 bg-zinc-900 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitTicket} className="p-6 space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Issue Category</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-vivid-lavender transition-colors appearance-none"
                >
                  <option>Billing & Payments</option>
                  <option>Project Dispute</option>
                  <option>Technical Issue</option>
                  <option>Account Management</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Subject</label>
                <input 
                  type="text" 
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  placeholder="Brief description of the issue"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-vivid-lavender transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Priority Level</label>
                <select 
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-vivid-lavender transition-colors appearance-none"
                >
                  <option value="Low">Low - General inquiry</option>
                  <option value="Medium">Medium - Non-critical issue</option>
                  <option value="High">High - Blocking my work</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows="4" 
                  placeholder="Provide as much detail as possible..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-vivid-lavender transition-colors resize-none"
                  required
                ></textarea>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-white hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-vivid-lavender hover:bg-dark-purple text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-vivid-lavender/20"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
