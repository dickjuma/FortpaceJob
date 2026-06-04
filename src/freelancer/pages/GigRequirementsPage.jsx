import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GripVertical, Plus, Trash2, CheckSquare, Type, 
  Paperclip, List, Link, Calendar, CheckCircle2,
  FileQuestion, Zap, Info, MoreVertical
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

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
    }
  };

  const removeRequirement = (id) => {
    setRequirements(requirements.filter(r => r.id !== id));
  };

  const loadTemplate = () => {
    setRequirements([
      { id: 101, type: 'text', question: 'What is the main goal of this project?', required: true, options: [] },
      { id: 102, type: 'url', question: 'Do you have any inspiration websites?', required: false, options: [] },
      { id: 103, type: 'file', question: 'Please attach your brand guidelines and logo files.', required: true, options: [] },
    ]);
  };

  const getIcon = (typeId) => {
    const TypeIcon = REQUIREMENT_TYPES.find(t => t.id === typeId)?.icon || FileQuestion;
    return <TypeIcon className="w-4 h-4" />;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full font-sans">
      
      {/* Main Form Area */}
      <div className="flex-1 w-full space-y-8">
        
        {/* Header Block */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Buyer Requirements</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
                Get all the information you need from buyers to start working on their order. The order timer won't start until they submit these requirements.
              </p>
            </div>
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-surface-dark dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Requirement
            </button>
          </div>
        </div>

        {/* Dynamic Builder List */}
        <div className="space-y-4">
          <AnimatePresence>
            {requirements.map((req, index) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                key={req.id}
                className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex group"
              >
                {/* Drag Handle */}
                <div className="w-10 bg-surface dark:bg-zinc-800/50 flex flex-col items-center justify-center border-r border-zinc-100 dark:border-zinc-800 cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 transition-colors">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                {/* Content */}
                <div className="flex-1 p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 capitalize">
                        {getIcon(req.type)} {REQUIREMENT_TYPES.find(t => t.id === req.type)?.label}
                      </span>
                      {req.required && (
                        <span className="px-2.5 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold">
                          Required
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <button onClick={() => removeRequirement(req.id)} className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">{req.question}</h3>
                  
                  {/* Mock Input Previews based on type */}
                  <div className="mt-4 pointer-events-none opacity-60">
                    {req.type === 'text' && <div className="h-20 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-surface dark:bg-zinc-800/30" />}
                    {req.type === 'file' && <div className="h-16 w-full rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-600 bg-surface dark:bg-zinc-800/30 flex items-center justify-center"><Paperclip className="w-4 h-4 text-zinc-400 mr-2"/> <span className="text-sm font-medium text-zinc-400">Drag & drop files here</span></div>}
                    {req.type === 'url' && <div className="h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-surface dark:bg-zinc-800/30 flex items-center px-3"><Link className="w-4 h-4 text-zinc-400 mr-2"/> <span className="text-sm text-zinc-400">https://...</span></div>}
                    {(req.type === 'multiple' || req.type === 'checklist') && (
                      <div className="space-y-2">
                        {req.options.map((opt, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className={cn("w-4 h-4 border border-zinc-300 dark:border-zinc-600", req.type === 'multiple' ? 'rounded-full' : 'rounded')} />
                            <span className="text-sm text-zinc-500">{opt}</span>
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
            <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-surface dark:bg-surface-dark/50">
              <FileQuestion className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">No requirements added</h3>
              <p className="text-xs text-zinc-500 mb-6 max-w-sm mx-auto">Orders will start immediately without collecting any specific information from the buyer.</p>
              <button onClick={() => setIsAdding(true)} className="px-6 py-2.5 bg-[#2bb75c] text-white font-bold text-sm rounded-xl">Add First Requirement</button>
            </div>
          )}

          {/* Add Requirement Form Builder inline */}
          <AnimatePresence>
            {isAdding && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                className="bg-white dark:bg-surface-dark border-2 border-[#2bb75c]/20 shadow-lg shadow-[#2bb75c]/25/10 rounded-2xl p-6 relative"
              >
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Build Requirement</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Response Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {REQUIREMENT_TYPES.map(type => (
                        <button
                          key={type.id}
                          onClick={() => setNewReqType(type.id)}
                          className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center",
                            newReqType === type.id ? "bg-[#2bb75c]/5 dark:bg-[#2bb75c]/10 border-[#2bb75c]/20 text-[#2bb75c] dark:text-[#2bb75c]" : "bg-surface dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                          )}
                        >
                          <type.icon className={cn("w-5 h-5 mb-1.5", newReqType === type.id ? "text-[#2bb75c]" : "text-zinc-400")} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Question for the Buyer</label>
                    <input 
                      type="text" 
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="What exactly do you need the buyer to provide?"
                      className="w-full p-4 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-zinc-900 dark:text-white outline-none focus:border-[#2bb75c]/20 focus:ring-1 focus:ring-[#2bb75c] transition-all"
                    />
                  </div>

                  {(newReqType === 'multiple' || newReqType === 'checklist') && (
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Options</label>
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
                              className="flex-1 p-2 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium outline-none focus:border-[#2bb75c]/20"
                            />
                            <button onClick={() => setNewOptions(newOptions.filter((_, idx) => idx !== i))} className="p-2 text-zinc-400 hover:text-rose-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setNewOptions([...newOptions, `Option ${newOptions.length + 1}`])} className="text-xs font-bold text-[#2bb75c] flex items-center gap-1 hover:underline">
                        <Plus className="w-3 h-3" /> Add Option
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className={cn(
                        "w-10 h-5 rounded-full transition-colors relative flex items-center p-0.5",
                        newRequired ? "bg-[#2bb75c]" : "bg-zinc-200 dark:bg-zinc-700"
                      )}>
                        <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-sm" animate={{ x: newRequired ? 20 : 0 }} />
                      </div>
                      <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Answer is mandatory</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white">Cancel</button>
                      <button onClick={addRequirement} disabled={!newQuestion} className="px-6 py-2 bg-[#2bb75c] disabled:bg-zinc-300 text-white text-sm font-bold rounded-xl transition-colors">Add</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Sidebar - Templates & Tips */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
        
        {/* Templates Box */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-zinc-900 dark:text-white">Quick Templates</h3>
          </div>
          
          <div className="space-y-3">
            {TEMPLATES.map(temp => (
              <div key={temp.id} className="p-3 bg-surface dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700/50 group cursor-pointer hover:border-[#2bb75c]/50 transition-colors" onClick={loadTemplate}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{temp.title}</h4>
                  <Plus className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#2bb75c] transition-colors" />
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed">{temp.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Box */}
        <div className="bg-gradient-to-br from-[#2bb75c] to-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-[#2bb75c]/25/20">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-[#2bb75c]" />
            <h3 className="font-bold text-[#2bb75c]">Conversion Tip</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-xl border border-white/10 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <div>
                <h4 className="text-sm font-bold mb-1">Keep it simple</h4>
                <p className="text-xs text-[#2bb75c] leading-relaxed">
                  Too many requirements can overwhelm buyers and cause them to abandon the order. Ask only for what is absolutely necessary to start.
                </p>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/10 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <div>
                <h4 className="text-sm font-bold mb-1">Use Multiple Choice</h4>
                <p className="text-xs text-[#2bb75c] leading-relaxed">
                  Multiple choice questions are 3x more likely to be answered quickly than open-ended text fields.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

