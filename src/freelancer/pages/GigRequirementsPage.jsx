// src/pages/freelancer/GigRequirementsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GripVertical, Plus, Trash2, CheckSquare, Type,
  Paperclip, List, Link, Calendar, CheckCircle2,
  FileQuestion, Zap, Info, MoreVertical, Check
} from 'lucide-react';

const REQUIREMENT_TYPES = [
  { id: 'text', label: 'Free Text', icon: Type },
  { id: 'file', label: 'Attachment', icon: Paperclip },
  { id: 'multiple', label: 'Multiple Choice', icon: List },
  { id: 'url', label: 'URL / Link', icon: Link },
  { id: 'checklist', label: 'Checklist', icon: CheckSquare },
  { id: 'date', label: 'Date', icon: Calendar },
];

const TEMPLATES = [
  { id: 't1', title: 'Web Design Intake', desc: 'Asks for brand guidelines, inspiration URLs, and color palettes.' },
  { id: 't2', title: 'Content Writing', desc: 'Asks for word count, target audience, and SEO keywords.' },
  { id: 't3', title: 'Bug Fixing', desc: 'Asks for staging URL, login credentials, and error screenshots.' },
];

export default function GigRequirementsPage() {
  const [requirements, setRequirements] = useState([
    { id: 1, type: 'text', question: 'Please describe your project in detail.', required: true, options: [] }
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newReqType, setNewReqType] = useState('text');
  const [newQuestion, setNewQuestion] = useState('');
  const [newRequired, setNewRequired] = useState(true);
  const [newOptions, setNewOptions] = useState(['Option 1', 'Option 2']);
  const [showSuccess, setShowSuccess] = useState(null);

  const addRequirement = () => {
    if (newQuestion.trim()) {
      setRequirements([...requirements, {
        id: Date.now(),
        type: newReqType,
        question: newQuestion,
        required: newRequired,
        options: [...newOptions]
      }]);
      setIsAdding(false);
      setNewQuestion('');
      setNewOptions(['Option 1', 'Option 2']);
      setNewReqType('text');
      setShowSuccess({ message: 'Requirement added' });
      setTimeout(() => setShowSuccess(null), 2000);
    }
  };

  const removeRequirement = (id) => {
    setRequirements(requirements.filter(r => r.id !== id));
    setShowSuccess({ message: 'Requirement removed' });
    setTimeout(() => setShowSuccess(null), 1500);
  };

  const loadTemplate = () => {
    setRequirements([
      { id: Date.now(), type: 'text', question: 'What is the main goal of this project?', required: true, options: [] },
      { id: Date.now() + 1, type: 'url', question: 'Do you have any inspiration websites?', required: false, options: [] },
      { id: Date.now() + 2, type: 'file', question: 'Please attach your brand guidelines and logo files.', required: true, options: [] },
    ]);
    setShowSuccess({ message: 'Template loaded' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const getIcon = (typeId) => {
    const TypeIcon = REQUIREMENT_TYPES.find(t => t.id === typeId)?.icon || FileQuestion;
    return <TypeIcon className="w-4 h-4" />;
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

        {/* Header */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h2 className="font-display font-semibold text-lg text-brand-900 mb-1">Buyer requirements</h2>
              <p className="text-sm font-body text-ink-secondary max-w-2xl">
                Get all the information you need from buyers to start working on their order. The order timer won't start until they submit these requirements.
              </p>
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-900 text-white hover:bg-brand-800 text-sm font-body font-medium transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" /> Add requirement
            </button>
          </div>
        </div>

        {/* Requirements List */}
        <div className="space-y-3">
          <AnimatePresence>
            {requirements.map((req, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={req.id}
                className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex group"
              >
                <div className="w-8 bg-surface-soft flex flex-col items-center justify-center border-r border-border text-ink-tertiary">
                  <GripVertical className="w-4 h-4" />
                </div>

                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-surface-muted rounded-lg flex items-center gap-1.5 text-xs font-body font-medium text-ink-secondary capitalize">
                        {getIcon(req.type)} {REQUIREMENT_TYPES.find(t => t.id === req.type)?.label}
                      </span>
                      {req.required && (
                        <span className="px-2 py-0.5 bg-danger-light text-danger rounded-lg text-xs font-body font-medium">
                          Required
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => removeRequirement(req.id)}
                        className="p-1 text-ink-tertiary hover:text-danger rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-body font-semibold text-base text-ink-primary mb-2">{req.question}</h3>

                  {/* Preview based on type */}
                  <div className="mt-3 pointer-events-none opacity-60">
                    {req.type === 'text' && (
                      <div className="h-16 w-full rounded-lg border border-border bg-surface-soft" />
                    )}
                    {req.type === 'file' && (
                      <div className="h-12 w-full rounded-lg border-2 border-dashed border-border bg-surface-soft flex items-center justify-center">
                        <Paperclip className="w-4 h-4 text-ink-tertiary mr-2" />
                        <span className="text-xs text-ink-tertiary">Drag & drop files here</span>
                      </div>
                    )}
                    {req.type === 'url' && (
                      <div className="h-9 w-full rounded-lg border border-border bg-surface-soft flex items-center px-3">
                        <Link className="w-4 h-4 text-ink-tertiary mr-2" />
                        <span className="text-xs text-ink-tertiary">https://...</span>
                      </div>
                    )}
                    {(req.type === 'multiple' || req.type === 'checklist') && (
                      <div className="space-y-1.5">
                        {req.options.map((opt, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className={`w-4 h-4 border border-border rounded ${req.type === 'checklist' ? 'rounded' : 'rounded-full'}`} />
                            <span className="text-xs text-ink-tertiary">{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State */}
          {requirements.length === 0 && !isAdding && (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl bg-surface-soft">
              <FileQuestion className="w-10 h-10 text-ink-tertiary mx-auto mb-3" />
              <h3 className="font-body font-semibold text-base text-ink-primary mb-1">No requirements added</h3>
              <p className="text-xs text-ink-tertiary mb-5">Orders will start without collecting any information</p>
              <button
                onClick={() => setIsAdding(true)}
                className="px-5 py-2 rounded-lg bg-brand-900 text-white hover:bg-brand-800 text-sm font-body font-medium transition-colors"
              >
                Add first requirement
              </button>
            </div>
          )}

          {/* Add Requirement Form */}
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white border-2 border-accent DEFAULT rounded-xl p-5 shadow-sm"
              >
                <h3 className="font-display font-semibold text-lg text-brand-900 mb-4">Add requirement</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1.5 block">
                      Response type
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {REQUIREMENT_TYPES.map(type => {
                        const Icon = type.icon;
                        const isSelected = newReqType === type.id;
                        return (
                          <button
                            key={type.id}
                            onClick={() => setNewReqType(type.id)}
                            className={`flex flex-col items-center justify-center p-2.5 rounded-lg border transition-all ${
                              isSelected
                                ? "border-accent DEFAULT bg-accent-light text-accent DEFAULT"
                                : "border-border bg-white text-ink-tertiary hover:border-border-strong"
                            }`}
                          >
                            <Icon className={`w-4 h-4 mb-1 ${isSelected ? "text-accent DEFAULT" : "text-ink-tertiary"}`} />
                            <span className="text-xs font-body font-medium">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1.5 block">
                      Question for buyer
                    </label>
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="What do you need the buyer to provide?"
                      className="w-full h-11 px-3 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    />
                  </div>

                  {(newReqType === 'multiple' || newReqType === 'checklist') && (
                    <div>
                      <label className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1.5 block">
                        Options
                      </label>
                      <div className="space-y-2 mb-2">
                        {newOptions.map((opt, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...newOptions];
                                newOpts[i] = e.target.value;
                                setNewOptions(newOpts);
                              }}
                              className="flex-1 h-9 px-3 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                            />
                            <button
                              onClick={() => setNewOptions(newOptions.filter((_, idx) => idx !== i))}
                              className="p-1.5 text-ink-tertiary hover:text-danger rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setNewOptions([...newOptions, `Option ${newOptions.length + 1}`])}
                        className="text-xs font-body font-medium text-accent DEFAULT hover:text-accent-dark flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add option
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div
                        className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                          newRequired ? "bg-accent DEFAULT" : "bg-border"
                        }`}
                        onClick={() => setNewRequired(!newRequired)}
                      >
                        <motion.div
                          className="w-4 h-4 bg-white rounded-full shadow-sm"
                          animate={{ x: newRequired ? 14 : 0 }}
                        />
                      </div>
                      <span className="text-sm font-body font-medium text-ink-primary">Answer is mandatory</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsAdding(false)}
                        className="px-4 py-1.5 text-sm font-body font-medium text-ink-secondary hover:text-ink-primary transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addRequirement}
                        disabled={!newQuestion}
                        className="px-5 py-1.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 text-sm font-body font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 shrink-0 space-y-5">

        {/* Templates */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-accent DEFAULT" />
            <h3 className="font-body font-semibold text-ink-primary">Quick templates</h3>
          </div>

          <div className="space-y-2">
            {TEMPLATES.map(temp => (
              <div
                key={temp.id}
                onClick={loadTemplate}
                className="p-3 bg-surface-soft rounded-xl border border-border cursor-pointer hover:border-accent DEFAULT transition-all group"
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-xs font-body font-semibold text-ink-primary">{temp.title}</h4>
                  <Plus className="w-3.5 h-3.5 text-ink-tertiary group-hover:text-accent DEFAULT transition-colors" />
                </div>
                <p className="text-xs text-ink-tertiary leading-relaxed">{temp.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-5 text-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-accent-light" />
            <h3 className="font-body font-semibold">Conversion tips</h3>
          </div>

          <div className="space-y-3">
            <div className="bg-white/10 p-3 rounded-lg border border-white/20">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-light shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-body font-semibold mb-1">Keep it simple</h4>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Too many requirements can overwhelm buyers. Ask only for what is absolutely necessary.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-lg border border-white/20">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-light shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-body font-semibold mb-1">Use multiple choice</h4>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Multiple choice questions are answered faster than open-ended text fields.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick tip */}
        <div className="bg-accent-light border border-accent DEFAULT rounded-xl p-4">
          <h4 className="text-sm font-body font-semibold text-accent-dark mb-1">Pro tip</h4>
          <p className="text-xs text-accent-dark">
            The order timer only starts after the buyer submits these requirements. Take your time to set them up correctly.
          </p>
        </div>
      </div>
    </div>
  );
}
