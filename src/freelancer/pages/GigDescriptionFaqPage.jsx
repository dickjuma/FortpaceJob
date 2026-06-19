// src/pages/freelancer/GigDescriptionFaqPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bold, Italic, List, ListOrdered, Link as LinkIcon,
  Quote, Sparkles, Plus, Trash2, ChevronDown,
  ChevronUp, CheckCircle2, AlertCircle, HelpCircle,
  FileText, Wand2, Type, X, Check
} from 'lucide-react';
import { useGetGigFaqs, useUpdateGigFaqs } from '../services/freelancerHooks';

export default function GigDescriptionFaqPage() {
  const { data: response, isLoading } = useGetGigFaqs();
  const apiData = response?.data || response;
  const updateFaqs = useUpdateGigFaqs();

  const [description, setDescription] = useState(apiData?.description || '');
  
  const fallbackFaqs = [
    { id: 1, question: 'Do you provide the source files?', answer: 'Yes, the source files are included in the Standard and Premium packages.' }
  ];
  const faqs = apiData?.faqs || fallbackFaqs;
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [isFaqFormOpen, setIsFaqFormOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(1);
  const [showSuccess, setShowSuccess] = useState(null);

  const [seoScore, setSeoScore] = useState(65);

  const handleDescriptionChange = (e) => {
    const val = e.target.value;
    setDescription(val);

    let score = 40;
    if (val.length > 200) score += 20;
    if (val.length > 500) score += 15;
    if (val.includes('\n')) score += 10;
    if (val.length > 800) score += 15;
    setSeoScore(Math.min(100, score));
  };

  const addFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      const newId = Date.now();
      const updatedFaqs = [...faqs, { ...newFaq, id: newId }];
      
      updateFaqs.mutate({ faqs: updatedFaqs }, {
        onSuccess: () => {
          setNewFaq({ question: '', answer: '' });
          setIsFaqFormOpen(false);
          setExpandedFaq(newId);
          setShowSuccess({ message: 'FAQ added successfully' });
          setTimeout(() => setShowSuccess(null), 2000);
        }
      });
    }
  };

  const removeFaq = (id) => {
    const updatedFaqs = faqs.filter(f => f.id !== id);
    updateFaqs.mutate({ faqs: updatedFaqs }, {
      onSuccess: () => {
        setShowSuccess({ message: 'FAQ removed' });
        setTimeout(() => setShowSuccess(null), 2000);
      }
    });
  };

  const handleAiRewrite = () => {
    setShowSuccess({ message: 'AI rewrite feature would generate optimized content' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const getScoreColor = () => {
    if (seoScore > 80) return 'bg-accent-light text-accent-dark';
    if (seoScore > 50) return 'bg-warn-light text-warn';
    return 'bg-danger-light text-danger';
  };

  const getScoreBarColor = () => {
    if (seoScore > 80) return 'bg-accent DEFAULT';
    if (seoScore > 50) return 'bg-warn';
    return 'bg-danger';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">

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

      {/* Main Form Area */}
      <div className="flex-1 w-full space-y-6">

        {/* Description Section */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h2 className="font-display font-semibold text-lg text-brand-900 mb-1">Gig description</h2>
              <p className="text-sm font-body text-ink-secondary">
                Briefly describe your gig. Be detailed so buyers know exactly what to expect.
              </p>
            </div>
            <button
              onClick={handleAiRewrite}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-light text-accent-dark rounded-lg text-xs font-body font-medium hover:bg-accent-light/80 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-900"
            >
              <Sparkles className="w-3.5 h-3.5" /> AI rewrite
            </button>
          </div>

          {/* Editor Toolbar */}
          <div className="border border-border rounded-t-lg bg-surface-soft p-2 flex flex-wrap items-center gap-1">
            <button className="p-1.5 text-ink-tertiary hover:text-ink-primary hover:bg-white rounded-md transition-colors">
              <Bold className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-ink-tertiary hover:text-ink-primary hover:bg-white rounded-md transition-colors">
              <Italic className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-border mx-1" />
            <button className="p-1.5 text-ink-tertiary hover:text-ink-primary hover:bg-white rounded-md transition-colors">
              <List className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-ink-tertiary hover:text-ink-primary hover:bg-white rounded-md transition-colors">
              <ListOrdered className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-border mx-1" />
            <button className="p-1.5 text-ink-tertiary hover:text-ink-primary hover:bg-white rounded-md transition-colors">
              <LinkIcon className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-ink-tertiary hover:text-ink-primary hover:bg-white rounded-md transition-colors">
              <Quote className="w-4 h-4" />
            </button>
            <div className="ml-auto flex items-center gap-2 text-xs font-body px-2">
              <Type className="w-3.5 h-3.5 text-ink-tertiary" />
              <span className={description.length < 120 ? "text-danger" : "text-accent DEFAULT"}>
                {description.length} / 1200
              </span>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            rows={12}
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Welcome to my gig! Here's what I can do for you..."
            className="w-full p-4 border-x border-b border-border rounded-b-lg bg-white text-sm font-body text-ink-primary placeholder-ink-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-brand-900"
          />

          <div className="mt-4 flex items-start gap-2 p-3 bg-accent-light border border-accent DEFAULT rounded-lg">
            <AlertCircle className="w-4 h-4 text-accent-dark shrink-0 mt-0.5" />
            <p className="text-xs text-accent-dark font-body leading-relaxed">
              Don't include contact info (email, phone). Keep all communication on the platform to protect yourself.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h2 className="font-display font-semibold text-lg text-brand-900 mb-1">Frequently asked questions</h2>
              <p className="text-sm font-body text-ink-secondary">
                Add questions and answers for your buyers
              </p>
            </div>
            {!isFaqFormOpen && (
              <button
                onClick={() => setIsFaqFormOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-900 text-white hover:bg-brand-800 text-sm font-body font-medium transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-900"
              >
                <Plus className="w-4 h-4" /> Add FAQ
              </button>
            )}
          </div>

          {/* Add New FAQ Form */}
          <AnimatePresence>
            {isFaqFormOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 bg-surface-soft border border-border rounded-xl p-5"
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1 block">
                      Question
                    </label>
                    <input
                      type="text"
                      value={newFaq.question}
                      onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                      placeholder="e.g., Do you translate to English as well?"
                      className="w-full h-10 px-3 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1 block">
                      Answer
                    </label>
                    <textarea
                      rows={3}
                      value={newFaq.answer}
                      onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                      placeholder="e.g., Yes, I translate from French to English..."
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => { setIsFaqFormOpen(false); setNewFaq({question:'', answer:''}); }}
                      className="px-4 py-1.5 text-sm font-body font-medium text-ink-secondary hover:text-ink-primary transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addFaq}
                      disabled={!newFaq.question || !newFaq.answer}
                      className="px-4 py-1.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 text-sm font-body font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add FAQ
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FAQ List Accordion */}
          <div className="space-y-3">
            <AnimatePresence>
              {faqs.map(faq => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={faq.id}
                    className={`border rounded-xl overflow-hidden transition-all ${
                      isExpanded ? "border-accent DEFAULT bg-accent-light" : "border-border bg-white"
                    }`}
                  >
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 cursor-pointer text-left"
                    >
                      <h4 className="font-body font-semibold text-sm text-ink-primary pr-4">
                        {faq.question}
                      </h4>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-accent DEFAULT shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-ink-tertiary shrink-0" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 pt-2 border-t border-accent DEFAULT/30"
                        >
                          <p className="text-sm font-body text-ink-secondary leading-relaxed whitespace-pre-wrap">
                            {faq.answer}
                          </p>
                          <div className="flex justify-end mt-3">
                            <button
                              onClick={() => removeFaq(faq.id)}
                              className="text-xs font-body font-medium flex items-center gap-1 text-danger hover:text-danger/80 transition-colors p-1 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {faqs.length === 0 && !isFaqFormOpen && (
              <div className="text-center py-10 border-2 border-dashed border-border rounded-xl">
                <HelpCircle className="w-10 h-10 text-ink-tertiary mx-auto mb-2" />
                <p className="text-sm font-body font-medium text-ink-secondary">No FAQs added yet</p>
                <p className="text-xs text-ink-tertiary mb-4">Adding FAQs saves time answering common messages</p>
                <button
                  onClick={() => setIsFaqFormOpen(true)}
                  className="text-sm font-body font-medium text-accent DEFAULT hover:text-accent-dark transition-colors"
                >
                  Add your first FAQ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 shrink-0 space-y-5">

        {/* SEO Readability Score */}
        <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-body font-semibold text-ink-primary flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent DEFAULT" /> SEO readability
            </h3>
            <span className={`px-2 py-0.5 rounded-lg text-xs font-mono font-semibold ${getScoreColor()}`}>
              {seoScore}/100
            </span>
          </div>

          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden mb-5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${seoScore}%` }}
              className={`h-full rounded-full ${getScoreBarColor()}`}
            />
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2">
              {description.length > 200 ? (
                <CheckCircle2 className="w-4 h-4 text-accent DEFAULT shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-ink-tertiary shrink-0 mt-0.5" />
              )}
              <span className="text-xs font-body text-ink-secondary">Length (min 200 chars)</span>
            </div>
            <div className="flex items-start gap-2">
              {description.includes('\n') ? (
                <CheckCircle2 className="w-4 h-4 text-accent DEFAULT shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-ink-tertiary shrink-0 mt-0.5" />
              )}
              <span className="text-xs font-body text-ink-secondary">Formatting & paragraphs</span>
            </div>
            <div className="flex items-start gap-2">
              {faqs.length >= 3 ? (
                <CheckCircle2 className="w-4 h-4 text-accent DEFAULT shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-ink-tertiary shrink-0 mt-0.5" />
              )}
              <span className="text-xs font-body text-ink-secondary">3+ FAQs added</span>
            </div>
          </div>
        </div>

        {/* Writing Tips */}
        <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-xl p-5 text-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 className="w-5 h-5 text-accent-light" />
            <h3 className="font-body font-semibold text-white">Conversion tips</h3>
          </div>

          <div className="space-y-3">
            <div className="bg-white/10 p-3 rounded-lg border border-white/20">
              <h4 className="text-sm font-body font-semibold text-white mb-1">State your value clearly</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Start with a strong opening sentence summarizing what you offer and why you are the best choice.
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-lg border border-white/20">
              <h4 className="text-sm font-body font-semibold text-white mb-1">Use bullet points</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Buyers skim descriptions. Bullet points summarizing what's included significantly increase conversions.
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-lg border border-white/20">
              <h4 className="text-sm font-body font-semibold text-white mb-1">End with a CTA</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Encourage buyers to contact you before ordering to discuss project specifics.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-accent-light border border-accent DEFAULT rounded-xl p-4">
          <h4 className="text-sm font-body font-semibold text-accent-dark mb-2">Did you know?</h4>
          <p className="text-xs text-accent-dark font-body">
            Gigs with at least 3 FAQs receive <strong className="font-semibold">25% more orders</strong> on average.
          </p>
        </div>
      </div>
    </div>
  );
}
