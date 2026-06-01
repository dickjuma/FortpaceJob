import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bold, Italic, List, ListOrdered, Link as LinkIcon,
  Quote, Sparkles, Plus, Trash2, ChevronDown,
  ChevronUp, CheckCircle2, AlertCircle, HelpCircle,
  FileText, Wand2, Type
} from 'lucide-react';
import { Info } from 'react-feather';
import { cn } from '../../admin/utils/cn';

export default function GigDescriptionFaqPage() {
  const [description, setDescription] = useState('');
  const [faqs, setFaqs] = useState([
    { id: 1, question: 'Do you provide the source files?', answer: 'Yes, the source files are included in the Standard and Premium packages.' }
  ]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [isFaqFormOpen, setIsFaqFormOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(1);

  const [seoScore, setSeoScore] = useState(65);

  const handleDescriptionChange = (e) => {
    const val = e.target.value;
    setDescription(val);

    // Simple mock SEO Readability calc
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
      setFaqs([...faqs, { ...newFaq, id: newId }]);
      setNewFaq({ question: '', answer: '' });
      setIsFaqFormOpen(false);
      setExpandedFaq(newId);
    }
  };

  const removeFaq = (id) => {
    setFaqs(faqs.filter(f => f.id !== id));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full font-sans">

      {/* Main Form Area */}
      <div className="flex-1 w-full space-y-8">

        {/* Description Section */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Gig Description</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Briefly describe your Gig. Be as detailed as possible so buyers know exactly what to expect.
              </p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#14a800]/5 dark:bg-[#14a800]/10 text-[#14a800] dark:text-[#14a800] rounded-xl text-xs font-bold hover:bg-[#14a800]/10 transition-colors shrink-0">
              <Sparkles className="w-3.5 h-3.5" /> AI Rewrite
            </button>
          </div>

          {/* Editor Toolbar */}
          <div className="border border-zinc-200 dark:border-zinc-700 rounded-t-xl bg-surface dark:bg-zinc-800/50 p-2 flex flex-wrap items-center gap-1">
            <button className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"><Bold className="w-4 h-4" /></button>
            <button className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"><Italic className="w-4 h-4" /></button>
            <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-600 mx-1" />
            <button className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"><List className="w-4 h-4" /></button>
            <button className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"><ListOrdered className="w-4 h-4" /></button>
            <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-600 mx-1" />
            <button className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"><LinkIcon className="w-4 h-4" /></button>
            <button className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"><Quote className="w-4 h-4" /></button>
            <div className="ml-auto flex items-center gap-2 text-xs font-bold px-2">
              <Type className="w-3.5 h-3.5 text-zinc-400" />
              <span className={cn(description.length < 120 ? "text-rose-500" : "text-success")}>
                {description.length} / 1200
              </span>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            rows="12"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Welcome to my gig! Here's what I can do for you..."
            className="w-full p-4 border-x border-b border-zinc-200 dark:border-zinc-700 rounded-b-xl bg-white dark:bg-surface-dark text-sm font-medium text-zinc-900 dark:text-white resize-none outline-none focus:ring-2 focus:ring-[#14a800] focus:border-[#14a800]/20 transition-all"
          />

          <div className="mt-4 flex items-start gap-2 p-3 bg-[#14a800]/5 dark:bg-[#14a800]/10 border border-[#14a800]/20 dark:border-[#14a800]/20/30 rounded-xl">
            <Info className="w-4 h-4 text-[#14a800] shrink-0 mt-0.5" />
            <p className="text-xs text-[#14a800] dark:text-[#14a800] leading-relaxed font-medium">
              Don't include any contact info (email, skype, phone). All communication must be kept within the platform to protect you.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Frequently Asked Questions</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Add Questions & Answers for your Buyers.
              </p>
            </div>
            {!isFaqFormOpen && (
              <button
                onClick={() => setIsFaqFormOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-surface-dark dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all shrink-0"
              >
                <Plus className="w-4 h-4" /> Add FAQ
              </button>
            )}
          </div>

          {/* Add New FAQ Form */}
          <AnimatePresence>
            {isFaqFormOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-surface dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-5"
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Question</label>
                    <input
                      type="text"
                      value={newFaq.question}
                      onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                      placeholder="e.g. Do you translate to English as well?"
                      className="w-full p-3 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold outline-none focus:border-[#14a800]/20 focus:ring-1 focus:ring-[#14a800]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Answer</label>
                    <textarea
                      rows="3"
                      value={newFaq.answer}
                      onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                      placeholder="e.g. Yes, I translate from French to English..."
                      className="w-full p-3 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium outline-none focus:border-[#14a800]/20 focus:ring-1 focus:ring-[#14a800] resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => { setIsFaqFormOpen(false); setNewFaq({question:'', answer:''}); }}
                      className="px-4 py-2 text-sm font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addFaq}
                      disabled={!newFaq.question || !newFaq.answer}
                      className="px-4 py-2 bg-[#14a800] disabled:bg-zinc-300 text-white text-sm font-bold rounded-xl transition-colors"
                    >
                      Add
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
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    key={faq.id}
                    className={cn(
                      "border rounded-xl overflow-hidden transition-colors duration-200",
                      isExpanded ? "border-[#14a800]/20 dark:border-[#14a800]/20/30 bg-white dark:bg-surface-dark" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface-dark"
                    )}
                  >
                    <div
                      onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 cursor-pointer",
                        isExpanded ? "bg-[#14a800]/5 dark:bg-[#14a800]/5" : "hover:bg-surface dark:hover:bg-zinc-800/50"
                      )}
                    >
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white pr-4">{faq.question}</h4>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-[#14a800] shrink-0" /> : <ChevronDown className="w-5 h-5 text-zinc-400 shrink-0" />}
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 border-t border-zinc-100 dark:border-zinc-800"
                        >
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
                          <div className="flex justify-end mt-4">
                            <button onClick={() => removeFaq(faq.id)} className="text-xs font-bold flex items-center gap-1 text-rose-500 hover:text-rose-600 transition-colors p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10">
                              <Trash2 className="w-3.5 h-3.5" /> Delete FAQ
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
              <div className="text-center py-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <HelpCircle className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-zinc-500">No FAQs added yet.</p>
                <p className="text-xs text-zinc-400 mb-4">Adding FAQs saves time answering common messages.</p>
                <button onClick={() => setIsFaqFormOpen(true)} className="text-sm font-bold text-[#14a800]">Add your first FAQ</button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Sidebar - Analytics & Insights */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">

        {/* Readability Score */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#14a800]" /> SEO Readability
            </h3>
            <span className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-black",
              seoScore > 80 ? "bg-emerald-100 text-emerald-700" : seoScore > 50 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
            )}>
              {seoScore}/100
            </span>
          </div>

          <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${seoScore}%` }}
              className={cn(
                "h-full rounded-full transition-colors duration-500",
                seoScore > 80 ? "bg-success" : seoScore > 50 ? "bg-amber-500" : "bg-rose-500"
              )}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              {description.length > 200 ? <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />}
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Length (min 200 chars)</span>
            </div>
            <div className="flex items-start gap-2">
              {description.includes('\n') ? <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />}
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Formatting & Paragraphs</span>
            </div>
            <div className="flex items-start gap-2">
              {faqs.length >= 3 ? <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />}
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">3+ FAQs added</span>
            </div>
          </div>
        </div>

        {/* AI Writing Tips */}
        <div className="bg-gradient-to-br from-[#14a800] to-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-[#14a800]/25/20">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 className="w-5 h-5 text-[#14a800]" />
            <h3 className="font-bold text-[#14a800]">Conversion Tips</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <h4 className="text-sm font-bold mb-1">State your value clearly</h4>
              <p className="text-xs text-[#14a800] leading-relaxed">
                Start with a strong opening sentence summarizing what you offer and why you are the best choice.
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <h4 className="text-sm font-bold mb-1">Use Bullet Points</h4>
              <p className="text-xs text-[#14a800] leading-relaxed">
                Buyers skim descriptions. Bullet points summarizing what's included significantly increase conversions.
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <h4 className="text-sm font-bold mb-1">End with a CTA</h4>
              <p className="text-xs text-[#14a800] leading-relaxed">
                Encourage buyers to contact you before ordering to discuss project specifics.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
