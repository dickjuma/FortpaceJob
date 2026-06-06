// src/pages/public/HelpCenterPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle, Search, ChevronRight, FileText, Settings, ShieldCheck, Mail, MessageSquare, Check
} from 'lucide-react';

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(null);

  const faqs = [
    { q: 'How does the platform Milestone escrow work?', c: 'Billing', a: 'When a contract is initialized, clients deposit milestone funds into a secure escrow. Once deliverables are reviewed and approved, funds are safely disbursed.' },
    { q: 'How do I upgrade from an individual to an Agency workspace?', c: 'Agency', a: 'Navigate to Workspace settings, select Upgrade Profile, complete basic organization validation registry, and invite team members.' },
    { q: 'What criteria determines a "Top Rated Plus" verification badge?', c: 'Identity', a: 'Maintaining a 4.8+ job success score, earning $10k+ in revenue, completing 5+ verified skills certifications, and following site guidelines.' },
    { q: 'How do I resolve a milestone contract dispute with a client?', c: 'Billing', a: 'File an official inquiry within the Escrow management portal. A dedicated coordinator will audit logs and resolve payments safely.' }
  ];

  const categories = [
    { label: 'Escrow & Payouts', icon: FileText, desc: 'Setup invoice credentials, payouts, and taxes.' },
    { label: 'Agency Collaborations', icon: Settings, desc: 'Manage team invites, workspaces, and RBAC.' },
    { label: 'Security & Badges', icon: ShieldCheck, desc: 'Learn about verified credentials and MFA locks.' }
  ];

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (label) => {
    setShowSuccess({ message: `Viewing ${label} resources` });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-8 text-white relative overflow-hidden mb-8 shadow-sm">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-accent-light/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto space-y-4">
          <div className="p-3 bg-white/10 rounded-xl">
            <HelpCircle className="w-8 h-8 text-accent-light" />
          </div>
          <h1 className="font-display font-bold text-3xl">How can we assist you?</h1>
          <p className="text-sm text-white/80">Search our help articles or browse by category</p>

          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 h-11 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20"
            />
          </div>
        </div>
      </div>

      {/* Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -2 }}
              onClick={() => handleCategoryClick(cat.label)}
              className="bg-white border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="p-2.5 bg-accent-light rounded-lg w-fit mb-3 group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5 text-accent DEFAULT" />
              </div>
              <h3 className="font-body font-semibold text-base text-ink-primary mb-1">{cat.label}</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">{cat.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* FAQs Section */}
      <div>
        <h3 className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-4">
          Popular FAQs
        </h3>

        <div className="space-y-3">
          <AnimatePresence>
            {filteredFaqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-border rounded-xl p-5 shadow-sm hover:border-accent DEFAULT/30 transition-all"
              >
                <div className="flex justify-between items-start gap-3 mb-2">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-body font-medium bg-accent-light text-accent-dark">
                    {faq.c}
                  </span>
                </div>
                <h4 className="font-body font-semibold text-base text-ink-primary mt-1">{faq.q}</h4>
                <p className="text-sm text-ink-secondary mt-2 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 bg-white border border-border rounded-xl">
              <HelpCircle className="w-12 h-12 text-ink-tertiary mx-auto mb-2" />
              <p className="text-sm text-ink-secondary">No articles match your search</p>
              <p className="text-xs text-ink-tertiary mt-1">Try different keywords</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Support */}
      <div className="mt-8 p-6 bg-accent-light border border-accent DEFAULT rounded-xl text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5 text-accent-dark" />
          <h3 className="font-body font-semibold text-accent-dark">Still need help?</h3>
        </div>
        <p className="text-sm text-accent-dark mb-4">Our support team is ready to assist you</p>
        <button className="px-5 py-2 rounded-lg bg-accent-dark text-white hover:bg-accent-dark/90 font-body font-medium text-sm transition-colors">
          Contact support
        </button>
      </div>
    </motion.div>
  );
}
