import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, UploadCloud, Link as LinkIcon, CheckCircle2, 
  Clock, AlertCircle, Save, Send, ShieldCheck
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import { validateJobDescription } from '../../common/utils/validation';
import notify from '../../common/utils/notify';

// Mock Data
const ORDER = {
  id: '#ORD-9821',
  title: 'I will build a responsive modern React JS web application',
  seller: {
    name: 'Alex Rivera',
    avatar: 'https://i.pravatar.cc/150?u=alex'
  },
  deliveryDays: 7
};

export default function GigRequirementsSubmissionPage() {
  const [formData, setFormData] = useState({
    description: '',
    industry: '',
    files: [],
    url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const descriptionErr = validateJobDescription(formData.description, 30);
    if (descriptionErr) {
      notify.error(descriptionErr);
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-surface dark:bg-surface-dark flex flex-col items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white dark:bg-surface-dark p-8 sm:p-12 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-[#14a800]/10 dark:bg-[#14a800]/20 text-[#14a800] dark:text-[#14a800] rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Order Started!</h2>
          <p className="text-zinc-500 font-medium mb-8">
            The seller has received your requirements. The {ORDER.deliveryDays}-day delivery countdown has officially begun.
          </p>
          <button className="w-full py-3.5 bg-[#14a800] text-white font-bold rounded-xl shadow-sm hover:bg-[#118a00] transition-colors">
            Go to Order Track
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2 text-sm font-bold text-[#14a800]">
            <span>Order {ORDER.id}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2">Submit Requirements</h1>
          <p className="text-zinc-500 font-medium">Please provide the details below so {ORDER.seller.name} can start working on your order.</p>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-1">Order timer is paused</h4>
            <p className="text-xs text-amber-700 dark:text-amber-300/80 font-medium leading-relaxed">
              The delivery countdown will not begin until you submit all required information. If you're not ready, you can save a draft and come back later.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
          
          <form onSubmit={handleSubmit}>
            
            {/* Form Fields */}
            <div className="p-6 sm:p-10 space-y-10">
              
              {/* Question 1: Text Area */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#14a800]/10 dark:bg-[#14a800]/20 text-[#14a800] dark:text-[#14a800] flex items-center justify-center font-bold text-sm shrink-0">1</div>
                  <label className="text-lg font-bold text-zinc-900 dark:text-white leading-snug">
                    Please describe your project in detail. What are the main goals and features?
                    <span className="text-rose-500 ml-1">*</span>
                  </label>
                </div>
                <div className="pl-11">
                  <textarea 
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter project details..."
                    className="w-full min-h-[150px] bg-surface dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#14a800] transition-all resize-none placeholder:text-zinc-400"
                  />
                  <div className="flex justify-end mt-2">
                    <span className="text-xs font-semibold text-zinc-400">{formData.description.length} / 2500 chars</span>
                  </div>
                </div>
              </div>

              {/* Question 2: Select/Input */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#14a800]/10 dark:bg-[#14a800]/20 text-[#14a800] dark:text-[#14a800] flex items-center justify-center font-bold text-sm shrink-0">2</div>
                  <label className="text-lg font-bold text-zinc-900 dark:text-white leading-snug">
                    What industry is this project for?
                    <span className="text-zinc-400 text-sm font-normal ml-2">(Optional)</span>
                  </label>
                </div>
                <div className="pl-11">
                  <input 
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    placeholder="e.g. Healthcare, E-commerce, Finance..."
                    className="w-full bg-surface dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#14a800] transition-all placeholder:text-zinc-400"
                  />
                </div>
              </div>

              {/* Question 3: File Upload */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#14a800]/10 dark:bg-[#14a800]/20 text-[#14a800] dark:text-[#14a800] flex items-center justify-center font-bold text-sm shrink-0">3</div>
                  <label className="text-lg font-bold text-zinc-900 dark:text-white leading-snug">
                    Please attach your brand guidelines and logo files.
                    <span className="text-rose-500 ml-1">*</span>
                  </label>
                </div>
                <div className="pl-11">
                  <div className="w-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-surface dark:bg-zinc-800/30 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#14a800]/20 hover:bg-[#14a800]/5 dark:hover:bg-[#14a800]/5 transition-all text-center">
                    <UploadCloud className="w-10 h-10 text-zinc-400 mb-3" />
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Click to upload or drag & drop</h4>
                    <p className="text-xs font-medium text-zinc-500">SVG, PNG, JPG or PDF (max. 50MB)</p>
                  </div>
                </div>
              </div>

              {/* Question 4: URL Input */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#14a800]/10 dark:bg-[#14a800]/20 text-[#14a800] dark:text-[#14a800] flex items-center justify-center font-bold text-sm shrink-0">4</div>
                  <label className="text-lg font-bold text-zinc-900 dark:text-white leading-snug">
                    Do you have any inspiration websites?
                    <span className="text-zinc-400 text-sm font-normal ml-2">(Optional)</span>
                  </label>
                </div>
                <div className="pl-11">
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({...formData, url: e.target.value})}
                      placeholder="https://..."
                      className="w-full bg-surface dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-11 pr-4 py-4 text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#14a800] transition-all placeholder:text-zinc-400"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Action Footer */}
            <div className="bg-surface dark:bg-surface-dark/50 border-t border-zinc-200 dark:border-zinc-800 p-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                <ShieldCheck className="w-4 h-4 text-success" /> Information is securely shared with the seller.
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button type="button" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-surface dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-bold rounded-xl transition-all">
                  <Save className="w-4 h-4" /> Save Draft
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !formData.description}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-[#14a800] hover:bg-[#118a00] text-white text-sm font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>Submitting <span className="animate-pulse">...</span></>
                  ) : (
                    <>Start Order <Send className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
