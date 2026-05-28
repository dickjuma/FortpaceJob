import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, UploadCloud, CheckCircle2, Link as LinkIcon, 
  MessageSquare, FileText, FileBadge, Info, 
  ChevronRight, Clock, AlertCircle
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const HISTORY = [
  { id: 1, type: 'submission', title: 'Initial Draft', date: 'May 16, 2026', status: 'Revision Requested' },
  { id: 2, type: 'revision', title: 'Client Feedback', date: 'May 17, 2026', comment: 'Please adjust the header layout.' },
];

export default function FreelancerDeliveryPage() {
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [checklist, setChecklist] = useState({ source: false, assets: false, instructions: false });

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-8 pb-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-2">
            <a href="#" className="hover:text-brand-600 transition-colors">Contracts</a> <ChevronRight className="w-3 h-3" />
            <a href="#" className="hover:text-brand-600 transition-colors">E-Commerce App</a>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-3">
                <Package className="w-6 h-6 text-brand-500" /> Submit Final Delivery
              </h1>
              <p className="text-sm font-medium text-zinc-500 mt-1">Client: Sarah Mitchell • Contract: #CTR-2024-8821</p>
            </div>
            
            <div className="flex items-center gap-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-900/30 px-4 py-2 rounded-xl">
              <Clock className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-xs font-bold text-amber-900 dark:text-amber-500 uppercase tracking-wider">Due In</p>
                <p className="text-sm font-black text-amber-700 dark:text-amber-400">2 Days, 4 Hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Main Delivery Form */}
        <div className="flex-1 space-y-8">
          
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Delivery Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Delivery Message</label>
                <p className="text-xs font-medium text-zinc-500 mb-3">Explain what you have delivered and any instructions for the client.</p>
                <textarea 
                  rows="6" 
                  value={deliveryMessage}
                  onChange={(e) => setDeliveryMessage(e.target.value)}
                  placeholder="Hi Sarah, I've attached the final zip file containing..."
                  className="w-full p-4 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium outline-none focus:border-brand-500 resize-y text-zinc-900 dark:text-white transition-colors"
                ></textarea>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3">Attach Files</h3>
                <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-surface dark:hover:bg-zinc-800/50 transition-colors group">
                  <div className="w-12 h-12 bg-white dark:bg-surface-dark shadow-sm rounded-full flex items-center justify-center mb-3 group-hover:-tranzinc-y-1 transition-transform">
                    <UploadCloud className="w-6 h-6 text-brand-500" />
                  </div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Drag & drop files or <span className="text-brand-600">browse</span></p>
                  <p className="text-xs font-medium text-zinc-500">ZIP, PDF, Source Files up to 5GB</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3">External Links (Optional)</h3>
                <div className="flex relative">
                  <LinkIcon className="absolute left-4 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400" />
                  <input 
                    type="url" 
                    placeholder="https://figma.com/file/..." 
                    className="w-full pl-10 pr-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium outline-none focus:border-brand-500 transition-colors text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Delivery Checklist</h2>
            <p className="text-sm font-medium text-zinc-500 mb-6">Make sure you have included everything required by the contract.</p>
            
            <div className="space-y-4">
              <label className={cn("flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors", checklist.source ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-zinc-200 dark:border-zinc-700 hover:bg-surface dark:hover:bg-zinc-800")}>
                <input type="checkbox" className="w-5 h-5 mt-0.5 rounded border-zinc-300 text-brand-600 focus:ring-brand-500" checked={checklist.source} onChange={() => setChecklist(p => ({...p, source: !p.source}))} />
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white">Source Files Included</h4>
                  <p className="text-xs font-medium text-zinc-500">Original project files (Figma, PSD, Code)</p>
                </div>
              </label>
              
              <label className={cn("flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors", checklist.assets ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-zinc-200 dark:border-zinc-700 hover:bg-surface dark:hover:bg-zinc-800")}>
                <input type="checkbox" className="w-5 h-5 mt-0.5 rounded border-zinc-300 text-brand-600 focus:ring-brand-500" checked={checklist.assets} onChange={() => setChecklist(p => ({...p, assets: !p.assets}))} />
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white">Final Assets Included</h4>
                  <p className="text-xs font-medium text-zinc-500">Exported deliverables ready for use</p>
                </div>
              </label>

              <label className={cn("flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors", checklist.instructions ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-zinc-200 dark:border-zinc-700 hover:bg-surface dark:hover:bg-zinc-800")}>
                <input type="checkbox" className="w-5 h-5 mt-0.5 rounded border-zinc-300 text-brand-600 focus:ring-brand-500" checked={checklist.instructions} onChange={() => setChecklist(p => ({...p, instructions: !p.instructions}))} />
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white">Instructions Added</h4>
                  <p className="text-xs font-medium text-zinc-500">Clear steps on how to use or install the files</p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button className="px-6 py-3 font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Cancel</button>
            <button className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-600/20 transition-all flex items-center gap-2">
              <Package className="w-5 h-5" /> Submit Delivery
            </button>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          
          <div className="bg-surface-dark dark:bg-surface-dark text-white rounded-3xl p-6 border border-zinc-800 shadow-xl">
            <h3 className="font-bold flex items-center gap-2 mb-4"><Info className="w-5 h-5 text-brand-400" /> Delivery Process</h3>
            <ul className="space-y-4 text-sm font-medium text-zinc-400">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 font-bold text-xs text-white">1</div>
                You submit the final work with all requirements.
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 font-bold text-xs text-white">2</div>
                The client has 3 days to review and approve.
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 font-bold text-xs text-white">3</div>
                Once approved, payment is released to your wallet.
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-zinc-400" /> Delivery History
            </h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-tranzinc-x-px md:before:mx-auto md:before:tranzinc-x-0 before:h-full before:w-0.5 before:bg-zinc-100 dark:before:bg-zinc-800">
              
              {HISTORY.map((item, i) => (
                <div key={item.id} className="relative flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-white dark:bg-surface-dark border-2 border-brand-500 flex items-center justify-center shrink-0 z-10 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-brand-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">{item.title}</h4>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{item.date}</span>
                    {item.comment && (
                      <div className="mt-2 p-3 bg-surface dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-700">
                        "{item.comment}"
                      </div>
                    )}
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
