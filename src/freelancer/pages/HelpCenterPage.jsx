import React, { useState } from 'react';
import { 
  HelpCircle, Search, ChevronRight, FileText, Settings, ShieldCheck, Mail, MessageSquare
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    { q: 'How does the platform Milestone escrow work?', c: 'Billing', a: 'When a contract is initialized, clients deposit milestone funds into a secure escrow. Once deliverables are reviewed and approved, funds are safely disbursed.' },
    { q: 'How do I upgrade from an individual to an Agency workspace?', c: 'Agency', a: 'Navigate to Workspace settings, select Upgrade Profile, complete basic organization validation registry, and invite team members.' },
    { q: 'What criteria determines a "Top Rated Plus" verification badge?', c: 'Identity', a: 'Maintaining a 4.8+ job success score, earning $10k+ in revenue, completing 5+ verified skills certifications, and following site guidelines.' },
    { q: 'How do I resolve a milestone contract dispute with a client?', c: 'Billing', a: 'File an official inquiry within the Escrow management portal. A dedicated coordinator will audit logs and resolve payments safely.' }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Search Header Banner */}
      <div className="bg-navy border border-border rounded-[24px] p-8 text-white relative overflow-hidden mb-8 shadow-sm">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-accent-purple/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto space-y-4">
          <HelpCircle className="w-12 h-12 text-accent-purple animate-pulse" />
          <h1 className="text-3xl font-black tracking-tight">How can we assist you?</h1>
          <p className="text-xs text-white/70 font-medium">Search our developer manuals, FAQs, or contact our support desk.</p>
          
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -tranzinc-y-1/2 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search help articles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 w-full border border-white/10 rounded-2xl bg-white/10 text-white placeholder-white/50 text-sm focus:outline-none focus:bg-white focus:text-text-primary"
            />
          </div>
        </div>
      </div>

      {/* Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Escrow & Payouts', icon: FileText, desc: 'Setup invoice credentials, payouts, and taxes.' },
          { label: 'Agency Collaborations', icon: Settings, desc: 'Manage team invites, workspaces, and RBAC.' },
          { label: 'Security & Badges', icon: ShieldCheck, desc: 'Learn about verified credentials and MFA locks.' },
        ].map((cat, idx) => (
          <Card key={idx} className="bg-white border border-border p-6 rounded-2xl shadow-sm hover:border-accent-purple/40 hover:shadow-md transition-all cursor-pointer group">
            <div className="p-3 bg-accent-purple/10 text-accent-purple rounded-xl shrink-0 w-11 h-11 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <cat.icon size={20} />
            </div>
            <h3 className="font-black text-sm text-text-primary mb-1">{cat.label}</h3>
            <p className="text-xs text-text-secondary font-medium leading-relaxed">{cat.desc}</p>
          </Card>
        ))}
      </div>

      {/* FAQs List */}
      <div className="space-y-4">
        <h3 className="text-sm font-black tracking-widest uppercase text-text-secondary mb-3">Popular FAQs</h3>
        
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <Card key={index} className="bg-white border border-border p-6 rounded-2xl shadow-sm hover:border-accent-purple/30 transition-all">
              <div className="flex justify-between items-start gap-4">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border bg-accent-purple/10 text-accent-purple border-accent-purple/20 shrink-0">
                  {faq.c}
                </span>
              </div>
              <h4 className="font-bold text-sm text-text-primary mt-2">{faq.q}</h4>
              <p className="text-xs text-text-secondary font-medium mt-2 leading-relaxed">{faq.a}</p>
            </Card>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-8">
              <HelpCircle className="w-12 h-12 text-text-secondary mx-auto mb-2" />
              <p className="text-xs text-text-secondary">No help articles match your search parameters. Try general terms.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
