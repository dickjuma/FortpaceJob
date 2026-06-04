import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, UploadCloud, CheckCircle2, FileText,
  Send, AlertCircle, Image as ImageIcon, Link as LinkIcon
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

// Mock Data
const ORDER = {
  id: '#ORD-9821',
  title: 'I will build a responsive modern React JS web application',
  client: { name: 'Sarah Mitchell', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  deadline: 'May 17, 2026'
};

const CHECKLIST = [
  { id: '1', text: 'I have met all the requirements specified by the buyer' },
  { id: '2', text: 'The delivery files are final and ready for review' },
  { id: '3', text: 'I have not included any contact information or external payment links' }
];

export default function GigDeliveryPage() {
  const [message, setMessage] = useState('Hi Sarah,\n\nHere is the final delivery for the React JS web application. I\'ve included all the source code in the attached ZIP file, and a README with instructions on how to run it locally.\n\nLet me know if you need any revisions. Thank you for your business!');
  const [files, setFiles] = useState([]);
  const [portfolioSample, setPortfolioSample] = useState(false);
  const [checklist, setChecklist] = useState([]);
  const [isDelivering, setIsDelivering] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleChecklist = (id) => {
    setChecklist(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDeliver = (e) => {
    e.preventDefault();
    if (checklist.length !== CHECKLIST.length) return;

    setIsDelivering(true);
    setTimeout(() => {
      setIsDelivering(false);
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
          <div className="w-20 h-20 bg-emerald-100 dark:bg-success/20 text-success dark:text-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Package className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Order Delivered!</h2>
          <p className="text-zinc-500 font-medium mb-8">
            Your work has been sent to {ORDER.client.name}. They have 3 days to review it before it's automatically marked as complete.
          </p>
          <button className="w-full py-3.5 bg-surface-dark dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl shadow-sm hover:shadow-md transition-all">
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans py-12 px-4 sm:px-6 flex justify-center items-start">
      <div className="max-w-3xl w-full">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2 text-sm font-bold text-[#2bb75c]">
            <span>Order {ORDER.id}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2">Deliver Your Work</h1>
          <p className="text-zinc-500 font-medium flex items-center gap-2">
            Deliver your completed work to <img src={ORDER.client.avatar} alt="Client" className="w-5 h-5 rounded-full inline-block" /> {ORDER.client.name}
          </p>
        </div>

        <form onSubmit={handleDeliver}>

          {/* Main Delivery Box */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden mb-8">

            <div className="p-6 sm:p-8 space-y-8">

              {/* Message */}
              <div>
                <label className="text-sm font-bold text-zinc-900 dark:text-white mb-3 block">Message to Buyer</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full min-h-[150px] bg-surface dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2bb75c] transition-all resize-none placeholder:text-zinc-400"
                  placeholder="Describe what you have delivered..."
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="text-sm font-bold text-zinc-900 dark:text-white mb-3 block">Delivery Files</label>
                <div className="w-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-surface dark:bg-zinc-800/30 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#2bb75c]/20 transition-all text-center group">
                  <UploadCloud className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mb-3 group-hover:text-[#2bb75c] transition-colors" />
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Upload Delivery Source Files</h4>
                  <p className="text-xs font-medium text-zinc-500 max-w-sm">
                    Upload the final deliverables. ZIP files are recommended for multiple files. Max size: 5GB.
                  </p>
                </div>
              </div>

              {/* Portfolio Sample Selection */}
              <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-start gap-4 p-4 bg-[#2bb75c]/5 dark:bg-[#2bb75c]/5 border border-[#2bb75c]/20 dark:border-[#2bb75c]/20/20 rounded-2xl cursor-pointer" onClick={() => setPortfolioSample(!portfolioSample)}>
                  <div className={cn(
                    "w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors border-2",
                    portfolioSample ? "bg-[#2bb75c] border-[#2bb75c]/20" : "border-[#2bb75c]/20 dark:border-[#2bb75c]/20 bg-white dark:bg-surface-dark"
                  )}>
                    {portfolioSample && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2bb75c] dark:text-[#2bb75c] mb-1 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Add a sample to your Gig Gallery
                    </h4>
                    <p className="text-xs font-medium text-[#2bb75c]/70 dark:text-[#2bb75c]/70 leading-relaxed">
                      If the buyer leaves a positive review, they will have the option to showcase this delivery sample on your public gig page to help you get more orders.
                    </p>

                    <AnimatePresence>
                      {portfolioSample && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-[#2bb75c]/20/50 dark:border-[#2bb75c]/20/50">
                           <div className="w-full h-24 border-2 border-dashed border-[#2bb75c]/20 dark:border-[#2bb75c]/20 bg-white/50 dark:bg-surface-dark/50 rounded-xl flex items-center justify-center text-[#2bb75c] dark:text-[#2bb75c] text-xs font-bold hover:border-[#2bb75c]/20 transition-colors">
                              <UploadCloud className="w-4 h-4 mr-2" /> Upload Portfolio Watermarked Image
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Checklist & Submit */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 sm:p-8">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" /> Delivery Checklist
            </h3>

            <div className="space-y-4 mb-8">
              {CHECKLIST.map(item => {
                const isChecked = checklist.includes(item.id);
                return (
                  <label key={item.id} className="flex items-start gap-4 cursor-pointer group">
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                      isChecked ? "bg-success border-emerald-500" : "border-zinc-300 dark:border-zinc-600 bg-transparent group-hover:border-emerald-400"
                    )}>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={cn(
                      "text-sm font-medium transition-colors",
                      isChecked ? "text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white"
                    )}>
                      {item.text}
                    </span>
                  </label>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={checklist.length !== CHECKLIST.length || isDelivering}
              className="w-full py-4 bg-[#2bb75c] hover:bg-[#1d8d38] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDelivering ? (
                <>Delivering <span className="animate-pulse">...</span></>
              ) : (
                <>Deliver Final Work <Send className="w-4 h-4" /></>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

