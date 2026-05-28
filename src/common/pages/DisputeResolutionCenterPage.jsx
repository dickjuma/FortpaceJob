import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, UploadCloud, MessageSquare, Scale, 
  FileText, Send, Paperclip, ChevronRight, CheckCircle2,
  AlertTriangle, DollarSign, Clock, Users
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const CHAT_MESSAGES = [
  { id: 1, sender: 'Alex Rivera (Freelancer)', role: 'freelancer', text: 'I delivered the requested features according to the original scope.', time: '10:30 AM', date: 'May 18' },
  { id: 2, sender: 'Sarah Mitchell (Client)', role: 'client', text: 'The features are incomplete. The payment gateway is missing Stripe support.', time: '11:15 AM', date: 'May 18' },
  { id: 3, sender: 'Forte Support (Mediator)', role: 'mediator', text: 'Hello Alex and Sarah. I am reviewing the contract terms now. Alex, please provide evidence of the Stripe integration.', time: '1:00 PM', date: 'May 18' },
];

export default function DisputeResolutionCenterPage() {
  const [message, setMessage] = useState('');

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-surface-dark border-b border-zinc-800 pt-8 pb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-rose-500/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 mb-4">
            <a href="#" className="hover:text-white transition-colors">Disputes</a> <ChevronRight className="w-3 h-3" />
            <span className="text-white">#DSP-2024-0092</span>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-2">
                <ShieldAlert className="w-8 h-8 text-rose-500" /> Dispute Resolution Center
              </h1>
              <p className="text-sm font-medium text-zinc-400">Our mediation team is currently reviewing this case.</p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-zinc-800 border border-zinc-700 px-6 py-3 rounded-2xl">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  <p className="font-bold text-white">Under Review</p>
                </div>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 px-6 py-3 rounded-2xl">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Disputed Amount</p>
                <p className="font-black text-white">$4,500.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-20 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Details & Evidence */}
        <div className="w-full lg:w-[400px] shrink-0 space-y-6">
          
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Dispute Details</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1">Contract</p>
                <p className="font-bold text-zinc-900 dark:text-white text-sm">React Native E-Commerce App</p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1">Opened By</p>
                <div className="flex items-center gap-2">
                  <img src="https://i.pravatar.cc/150?u=s1" alt="Client" className="w-6 h-6 rounded-full" />
                  <p className="font-bold text-zinc-900 dark:text-white text-sm">Sarah Mitchell (Client)</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1">Reason</p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-lg border border-rose-200 dark:border-rose-900/30">
                  <AlertTriangle className="w-3 h-3" /> Incomplete Work
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1">Opened On</p>
                <p className="font-bold text-zinc-900 dark:text-white text-sm">May 14, 2026</p>
              </div>
            </div>
          </div>

          {/* Evidence Center */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Evidence Center</h2>
              <span className="text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-1 rounded-md">4 Files</span>
            </div>
            
            <div className="space-y-3 mb-6">
              {[
                { name: 'contract_scope.pdf', uploader: 'Client' },
                { name: 'chat_export.pdf', uploader: 'Client' },
                { name: 'stripe_code_snippet.txt', uploader: 'Freelancer' },
              ].map((file, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-surface dark:bg-zinc-800/50">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-zinc-400" />
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white truncate max-w-[180px]">{file.name}</p>
                      <p className="text-[10px] font-medium text-zinc-500">By {file.uploader}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl font-bold text-brand-600 hover:bg-surface dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 text-sm">
              <UploadCloud className="w-4 h-4" /> Upload Evidence
            </button>
          </div>

        </div>

        {/* Right Column: Chat & Tracker */}
        <div className="flex-1 flex flex-col space-y-6">
          
          {/* Tracker */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <div className="flex justify-between items-center relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-100 dark:bg-zinc-800 -tranzinc-y-1/2 z-0"></div>
              <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-amber-500 -tranzinc-y-1/2 z-0"></div>
              
              {['Opened', 'Evidence', 'Mediation', 'Resolved'].map((step, idx) => {
                const isActive = idx === 2;
                const isDone = idx < 2;
                return (
                  <div key={step} className="relative z-10 flex flex-col items-center gap-2 bg-white dark:bg-surface-dark px-2">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                      isActive ? "border-amber-500 text-amber-500" : isDone ? "bg-amber-500 border-amber-500 text-white" : "border-zinc-200 dark:border-zinc-700 text-zinc-400 bg-white dark:bg-surface-dark"
                    )}>
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                    </div>
                    <span className={cn("text-xs font-bold", isActive ? "text-amber-600" : isDone ? "text-zinc-900 dark:text-white" : "text-zinc-400")}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mediation Chat */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex-1 flex flex-col overflow-hidden min-h-[500px]">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-surface dark:bg-zinc-800/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-zinc-400" />
                <h2 className="font-bold text-zinc-900 dark:text-white">Mediation Chat</h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                <div className="w-2 h-2 rounded-full bg-success"></div> Support is online
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {CHAT_MESSAGES.map(msg => (
                <div key={msg.id} className={cn("flex flex-col max-w-[80%]", msg.role === 'client' ? "ml-auto items-end" : "mr-auto items-start")}>
                  <p className="text-[10px] font-bold text-zinc-400 mb-1">{msg.sender} • {msg.time}</p>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm font-medium shadow-sm",
                    msg.role === 'mediator' ? "bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-900 text-brand-900 dark:text-brand-100" :
                    msg.role === 'client' ? "bg-surface-dark dark:bg-zinc-700 text-white rounded-tr-sm" : 
                    "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-tl-sm"
                  )}>
                    {msg.role === 'mediator' && <Scale className="w-4 h-4 text-brand-500 mb-2" />}
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white dark:bg-surface-dark border-t border-zinc-200 dark:border-zinc-800 shrink-0">
              <div className="flex items-end gap-2 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl p-2 focus-within:border-brand-500 transition-colors">
                <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors rounded-full shrink-0">
                  <Paperclip className="w-5 h-5" />
                </button>
                <textarea 
                  rows="1"
                  placeholder="Type your message to the mediator..."
                  className="w-full bg-transparent border-none outline-none text-sm font-medium text-zinc-900 dark:text-white py-2.5 resize-none max-h-32 custom-scrollbar"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
                <button className="p-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full transition-colors shrink-0 shadow-md disabled:opacity-50" disabled={!message.trim()}>
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
