import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, AlertCircle, FileText, Image as ImageIcon, 
  MessageSquare, Check, X, Send, Eye, ShieldAlert, CheckCircle2
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

// Mock Data
const ORDER = {
  id: '#ORD-9821',
  seller: { name: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?u=alex' },
  revisionsRemaining: 2,
  revisionsTotal: 3,
  delivery: {
    message: 'Hi Sarah,\n\nHere is the final delivery for the React JS web application. I\'ve included all the source code in the attached ZIP file, and a README with instructions on how to run it locally.\n\nLet me know if you need any revisions. Thank you for your business!',
    files: [
      { name: 'react-app-source-v1.zip', size: '24.5 MB', type: 'zip' },
      { name: 'preview-screenshot.png', size: '1.2 MB', type: 'image' },
      { name: 'README.pdf', size: '450 KB', type: 'pdf' }
    ]
  }
};

export default function RevisionRequestPage() {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeFilePreview, setActiveFilePreview] = useState(null);

  const handleRequestRevision = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface dark:bg-surface-dark flex flex-col items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white dark:bg-surface-dark p-8 sm:p-12 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <RefreshCw className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Revision Requested</h2>
          <p className="text-zinc-500 font-medium mb-8">
            The seller has been notified of your changes. The order delivery time has been paused until the revision is provided.
          </p>
          <button className="w-full py-3.5 bg-surface-dark dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl shadow-sm hover:shadow-md transition-all">
            Return to Order Tracking
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Review Delivery */}
        <div className="flex-1 space-y-8">
          
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 text-sm font-bold text-brand-600">
              <span>Order {ORDER.id}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Review Delivery</h1>
          </div>

          {/* Delivered Content Card */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-surface/50 dark:bg-surface-dark/50 flex items-center gap-4">
              <img src={ORDER.seller.avatar} alt="Seller" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-white">{ORDER.seller.name} delivered your order</h3>
                <p className="text-xs font-semibold text-zinc-500">Delivered 2 hours ago</p>
              </div>
            </div>
            
            <div className="p-6 sm:p-8">
              <div className="prose prose-slate dark:prose-invert text-sm font-medium text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap mb-8">
                {ORDER.delivery.message}
              </div>

              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Delivered Files</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ORDER.delivery.files.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-surface dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl group hover:border-brand-500 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center shrink-0">
                      {file.type === 'image' ? <ImageIcon className="w-5 h-5 text-brand-500" /> : 
                       file.type === 'pdf' ? <FileText className="w-5 h-5 text-rose-500" /> : 
                       <FileText className="w-5 h-5 text-zinc-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{file.name}</p>
                      <p className="text-xs font-medium text-zinc-500">{file.size}</p>
                    </div>
                    {file.type === 'image' && (
                      <button 
                        onClick={() => setActiveFilePreview(file)}
                        className="p-2 text-zinc-400 hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Annotation Preview Mock */}
          <AnimatePresence>
            {activeFilePreview && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-surface-dark rounded-3xl border border-zinc-800 overflow-hidden relative"
              >
                <div className="p-4 bg-black/50 border-b border-white/10 flex justify-between items-center text-white">
                  <span className="text-sm font-bold flex items-center gap-2"><ImageIcon className="w-4 h-4 text-brand-400" /> {activeFilePreview.name}</span>
                  <button onClick={() => setActiveFilePreview(null)} className="p-1 hover:bg-white/10 rounded-md transition-colors"><X className="w-4 h-4" /></button>
                </div>
                <div className="p-8 flex justify-center relative bg-zinc-800/50">
                  <div className="relative inline-block border border-zinc-700 shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80" alt="Preview" className="max-w-full rounded" />
                    {/* Mock Annotation Pin */}
                    <div className="absolute top-[30%] left-[45%] w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white animate-bounce cursor-pointer">1</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Right Column: Revision Request Form */}
        <div className="w-full lg:w-[400px] shrink-0">
          
          <div className="sticky top-8 bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden">
            
            {/* Form Header */}
            <div className="p-6 sm:p-8 border-b border-zinc-100 dark:border-zinc-800 bg-amber-50 dark:bg-amber-500/10">
              <h2 className="text-xl font-bold text-amber-900 dark:text-amber-500 flex items-center gap-2 mb-2">
                <RefreshCw className="w-5 h-5" /> Request a Revision
              </h2>
              <p className="text-sm text-amber-800 dark:text-amber-400/80 font-medium">
                Not quite right? Outline what needs to be changed.
              </p>
            </div>

            {/* Revisions Remaining Badge */}
            <div className="px-6 sm:px-8 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-surface/50 dark:bg-surface-dark/50">
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Revisions Remaining</span>
              <div className="flex gap-1">
                {Array.from({ length: ORDER.revisionsTotal }).map((_, i) => (
                  <div key={i} className={cn(
                    "w-3 h-3 rounded-full",
                    i < ORDER.revisionsRemaining ? "bg-amber-400" : "bg-zinc-200 dark:bg-zinc-700"
                  )} />
                ))}
              </div>
            </div>

            <form onSubmit={handleRequestRevision} className="p-6 sm:p-8">
              
              <div className="mb-6">
                <label className="text-sm font-bold text-zinc-900 dark:text-white mb-2 block">What needs to be changed?</label>
                <textarea 
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Be as specific as possible. Point out exact files, colors, wording, or functionality that requires adjusting..."
                  className="w-full min-h-[160px] bg-surface dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none placeholder:text-zinc-400"
                />
              </div>

              {/* Guidelines Info */}
              <div className="flex items-start gap-3 p-4 bg-surface dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 mb-8">
                <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                  Revisions must fall within the scope of the original requirements. Completely new features may require purchasing an extra.
                </p>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || !feedback.trim()}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-tranzinc-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>Submitting <span className="animate-pulse">...</span></>
                ) : (
                  <>Submit Revision Request <Send className="w-4 h-4" /></>
                )}
              </button>

              <div className="mt-4 text-center">
                <button type="button" className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Actually, I accept the delivery
                </button>
              </div>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
