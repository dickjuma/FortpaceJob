import React, { useState } from 'react';
import { 
  Search, Book, PlayCircle, MessageCircle, 
  HelpCircle, Shield, CreditCard, User, 
  Briefcase, ArrowRight, Sparkles, PhoneCall, FileText
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const CATEGORIES = [
  { title: 'Getting Started', icon: Book, color: 'text-[#14a800]', bg: 'bg-[#14a800]/5 dark:bg-[#14a800]/10' },
  { title: 'Trust & Safety', icon: Shield, color: 'text-success', bg: 'bg-emerald-50 dark:bg-success/10' },
  { title: 'Payments & Billing', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  { title: 'Account Settings', icon: User, color: 'text-[#14a800]', bg: 'bg-[#14a800]/5 dark:bg-[#14a800]/10' },
  { title: 'Finding Work', icon: Briefcase, color: 'text-[#14a800]', bg: 'bg-[#14a800]/5 dark:bg-[#14a800]/10' },
  { title: 'Hiring Talent', icon: Search, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
];

const ARTICLES = [
  { title: 'How to create a successful Gig', views: '124k' },
  { title: 'Understanding the success score', views: '98k' },
  { title: 'Escrow payment protection explained', views: '85k' },
  { title: 'How to submit a proposal that wins', views: '210k' },
  { title: 'Setting up two-factor authentication', views: '45k' },
  { title: 'Dispute resolution guidelines', views: '32k' },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Hero Section */}
      <div className="bg-[#14a800] pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#14a800]/30 to-transparent"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#14a800]/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">How can we help you?</h1>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -tranzinc-y-1/2 w-6 h-6 text-[#14a800]" />
            <input 
              type="text" 
              placeholder="Search for articles, tutorials, or topics..." 
              className="w-full bg-white dark:bg-surface-dark border-none rounded-2xl pl-16 pr-4 py-5 text-lg font-bold text-zinc-900 dark:text-white outline-none shadow-2xl focus:ring-4 focus:ring-[#14a800]/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 -tranzinc-y-1/2 px-6 py-3 bg-[#14a800] hover:bg-[#118a00] text-white font-bold rounded-xl transition-colors">
              Search
            </button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-3 text-sm font-medium text-[#14a800]">
            <span>Popular:</span>
            {['Reset Password', 'Fees', 'Contact Support', 'Withdrawals'].map(term => (
              <span key={term} className="px-3 py-1.5 rounded-full border border-[#14a800]/20 hover:bg-[#118a00] cursor-pointer transition-colors bg-[#118a00]/50 backdrop-blur-sm">
                {term}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 relative z-20 flex flex-col lg:flex-row gap-8">
        
        <div className="flex-1 space-y-8">
          
          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map(cat => (
              <div key={cat.title} className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-lg hover:-tranzinc-y-1 transition-all cursor-pointer group">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", cat.bg)}>
                  <cat.icon className={cn("w-6 h-6", cat.color)} />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white mb-2">{cat.title}</h3>
                <p className="text-sm font-medium text-zinc-500">Find answers and tutorials related to {cat.title.toLowerCase()}.</p>
              </div>
            ))}
          </div>

          {/* Popular Articles */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Popular Articles</h2>
             
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {ARTICLES.map(article => (
                <button key={article.title} type="button" className="flex items-center justify-between p-3 rounded-xl hover:bg-surface dark:hover:bg-zinc-800 transition-colors group text-left">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-zinc-400 group-hover:text-[#14a800] transition-colors" />
                    <span className="font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors text-sm">{article.title}</span>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400">{article.views} views</span>
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-center">
              <button className="text-sm font-bold text-[#14a800] hover:underline flex items-center gap-1">
                View all articles <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Video Tutorials */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Video Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="group cursor-pointer">
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 border border-zinc-200 dark:border-zinc-800 bg-surface-dark">
                    <img src={`https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80&random=${i}`} alt="Tutorial" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-[#14a800] transition-colors">
                        <PlayCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-sm group-hover:text-[#14a800] transition-colors">Getting started with Forte</h3>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar: Assistant & Contact */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          
          <div className="bg-gradient-to-br from-[#14a800] to-[#118a00] rounded-3xl p-6 shadow-md text-white relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md"><Sparkles className="w-5 h-5" /></div>
              <h3 className="font-bold">AI Support Assistant</h3>
            </div>
            
            <p className="text-sm font-medium text-[#14a800] mb-6 leading-relaxed">
              Get instant answers to your questions. Our AI is trained on all support articles and platform rules.
            </p>
            
            <button className="w-full py-3 bg-white text-[#14a800] font-bold rounded-xl shadow-sm transition-transform hover:scale-105">
              Ask AI Assistant
            </button>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-6">Need more help?</h3>
            
            <div className="space-y-4">
              <button className="w-full p-4 border border-zinc-200 dark:border-zinc-700 rounded-2xl flex items-center gap-4 hover:border-[#14a800]/20 transition-colors group text-left">
                <div className="w-10 h-10 bg-surface dark:bg-zinc-800 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#14a800]/5 dark:group-hover:bg-[#14a800]/10 transition-colors">
                  <MessageCircle className="w-5 h-5 text-zinc-400 group-hover:text-[#14a800]" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-0.5">Live Chat</h4>
                  <p className="text-xs font-medium text-zinc-500">Wait time: ~2 mins</p>
                </div>
              </button>

              <button className="w-full p-4 border border-zinc-200 dark:border-zinc-700 rounded-2xl flex items-center gap-4 hover:border-[#14a800]/20 transition-colors group text-left">
                <div className="w-10 h-10 bg-surface dark:bg-zinc-800 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#14a800]/5 dark:group-hover:bg-[#14a800]/10 transition-colors">
                  <PhoneCall className="w-5 h-5 text-zinc-400 group-hover:text-[#14a800]" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-0.5">Call Us</h4>
                  <p className="text-xs font-medium text-zinc-500">Available 24/7</p>
                </div>
              </button>

              <button className="w-full p-4 border border-zinc-200 dark:border-zinc-700 rounded-2xl flex items-center gap-4 hover:border-[#14a800]/20 transition-colors group text-left">
                <div className="w-10 h-10 bg-surface dark:bg-zinc-800 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#14a800]/5 dark:group-hover:bg-[#14a800]/10 transition-colors">
                  <HelpCircle className="w-5 h-5 text-zinc-400 group-hover:text-[#14a800]" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-0.5">Community Forum</h4>
                  <p className="text-xs font-medium text-zinc-500">Ask other users</p>
                </div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
